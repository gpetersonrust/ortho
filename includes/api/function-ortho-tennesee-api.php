<?php 
// build method off of filename state by initializing api and registering reviews hook

 

 function ortho_tennessee_api_init() {
        register_rest_route( 'ortho-tennessee/v1', 'reviews', array(
            'methods' => 'post',
            'callback' => 'ortho_tennessee_reviews'
        ) );

        register_rest_route('ortho-tennessee/v1', 'add-posts', array(
            'methods' => 'post',
            'callback' => 'ortho_tennessee_add_post'
        ));

        // update average and total reviews
        register_rest_route('ortho-tennessee/v1', 'update-reviews', array(
            'methods' => 'get',
            'callback' => 'ortho_tennessee_update_reviews'
        ));
    }



   
 
 
//  function to add new post
function ortho_tennessee_add_post($data){
 $title = sanitize_text_field($data['title']);
 $content = sanitize_text_field($data['content']);
 $allowed_ips = array(
    '127.0.0.2');
    $ip_address = $_SERVER['REMOTE_ADDR'];

    if(!in_array($ip_address, $allowed_ips)){
        return new WP_Error('invalid-ip', 'You are not allowed to create posts', array('status' => 401));
    }


//  if no title or content return error
 if(empty($title) || empty($content)){
     return new WP_Error('no-title-content', 'You must provide title and content and be logged in to submit a post', array('status' => 422));
 }
 
 $new_post = array(
     'post_title' => $title,
     'post_content' => $content,
     'post_status' => 'publish',
     'post_type' => 'post'
 );

    $post_id = wp_insert_post($new_post, true);

    if($post_id){
        $post = get_post($post_id);
        $response = new WP_REST_Response($post);
        $response->set_status(201);
        // ip address of user
      

        return  array(
            'status' => 'success',
            'message' => 'Post created',
            'post_id' => $post_id,
            'ip_address' => $ip_address
        );
    } else {
        return new WP_Error('cant-create', 'Unable to create post', array('status' => 500));
    }
    

}
 
// build callback function to return reviews

function ortho_tennessee_reviews($date) {
     $date = $date['date'];
    // $date = '2023-01-01';
  
     
   
    //  add one month to date
     $end = date('Y-m-d', strtotime($date. ' + 1 month'));

    //  if not date and end return error
     if(empty($date) || empty($end)){
         return new WP_Error('no-date', 'You must provide a start and end date', array('status' => 422));
     }

    //  get ip address and match it to 127.0.0.1
        $allowed_ips = array(
            '127.0.0.1');
            $ip_address = $_SERVER['REMOTE_ADDR'];

            if(!in_array($ip_address, $allowed_ips)){
                return new WP_Error('invalid-ip', 'You are not allowed to view reviews', array('status' => 401));
            }
 
    // Decode the JSON response
    $reviews =   performCurlRequestAndReturnItems('reviews', $date, $end);
    $surveys =   performCurlRequestAndReturnItems('surveys', $date, $end);

  

 
    // Loop through the data array and insert rows
    insertDataIntoDatabase($reviews);
    insertDataIntoDatabase($surveys);
   $client_response = new WP_REST_Response(array(
      
        'reviews' => $reviews,
        'surveys' => $surveys
        
     ), 200);

    return $client_response;
    
}


function performCurlRequestAndReturnItems($params, $date, $end) {

    // Initialize cURL options
    $remote_url = "https://api.socialclimb.com/v1/$params?date=$date&end=$end";
 
    $api_token = "4d3efa64-973f-4b86-8b79-155721d4e670";
    $content_type = "application/json";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $remote_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "api-token: $api_token",
        "Content-Type: $content_type"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    // Execute the cURL request
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        $error_message = curl_error($ch);
        curl_close($ch);
        return array('error' => true, 'message' => "cURL Error: $error_message");
    }

    curl_close($ch);

    // Decode the JSON response
    $decoded_response = json_decode($response, true);

    if (!$decoded_response || !isset($decoded_response['items'])) {
        return array('error' => true, 'message' => 'Invalid JSON response');
    }

    return  $decoded_response['items'];
}




function insertDataIntoDatabase($dataArray) {
    global $wpdb;

  
   

 

    // Define the table name
    $table_name = $wpdb->prefix . 'ortho_survey_reviews';
    // Remove wp_ from table name
    $table_name = str_replace('wp_', '', $table_name);

    // Define the column names
    $columnNames = array(
        'comment',
        'create_time',
        'invite_name',
        'invite_type',
        'location',
        'location_oid',
        'message',
        'nps_rating',
        'platform',
        'rating',
        'review_id',
        'sent_at',
        'sent_to', 
        "external_provider_ids"
    );
    

    // Loop through the data array and insert rows
    foreach (  $dataArray as $data) {
        $dataToInsert = array();
        $review_id = $data['review_id'];

        // // Check if review id exists in db using $wpdb->prepare to sanitize
        $query = $wpdb->prepare("SELECT * FROM $table_name WHERE review_id = %s", $review_id);
        $review_exists = $wpdb->get_row($query);

        // If review exists, skip
        if ($review_exists) {
            continue;
        }

        foreach ($columnNames as $columnName) {
            if($columnName == 'external_provider_ids'){
 
                 $dataToInsert[$columnName] =   json_encode(swap_api_name_for_post_name($data[$columnName]));

            } else {
                
                $dataToInsert[$columnName] = isset($data[$columnName]) ? sanitize_text_field($data[$columnName]) : '';
            }
       
        }
     
       
        // Use $wpdb->insert() to insert the row into the table
        $wpdb->insert($table_name, $dataToInsert);
    }
}



// update average and total reviews
function ortho_tennessee_update_reviews($data){
    global $wpdb;
    $table_name = $wpdb->prefix . 'ortho_survey_reviews';
    $table_name = str_replace('wp_', '', $table_name);
    // allowed ips
    $allowed_ips = array(
        '127.0.0.1');
        $ip_address = $_SERVER['REMOTE_ADDR'];

        if(!in_array($ip_address, $allowed_ips)){
            return new WP_Error('invalid-ip', 'You are not allowed to view reviews', array('status' => 401));
        }


// $query = "SELECT AVG(review_rating) AS average_review_rating FROM {$wpdb->prefix}ortho_survey_reviews";
// use table_name

$query = "SELECT AVG(rating) AS average_review_rating FROM $table_name";

 
$average_rating = $wpdb->get_var($query);
// format average rating to 1 decimal place
$average_rating = number_format($average_rating, 1);

//  use tablename
$query = "SELECT COUNT(*) FROM $table_name";

$total_reviews = $wpdb->get_var($query);
update_field('average_rating', $average_rating  ,'options');
update_field('total_surveys', $total_reviews ,'options');
 
return array(
    'average_review_rating' => $average_rating,
    'total_reviews' => $total_reviews
);

}


function name_variation($name, $variation) {
    // Preprocess and split into arrays
    $variationArray = array_map('trim', explode(" ", preg_replace("/[.,]/", "", str_replace("\n", " ", $variation))));
    $nameArray = array_map('trim', explode(" ", preg_replace("/[.,]/", "", str_replace("\n", " ", $name))));
    // remove empty elements from both arrays
    $variationArray = array_filter($variationArray);
    $nameArray = array_filter($nameArray);

    // convert all elements to lowercase
    $variationArray = array_map('strtolower', $variationArray);
    $nameArray = array_map('strtolower', $nameArray);
     $variationCount = 0;
 
    foreach ($variationArray as $variationWord):   in_array(strtolower($variationWord), $nameArray) &&  $variationCount++ ; endforeach;
   return  ($variationCount == count($variationArray) || count($variationArray) -   $variationCount == 1);
}


function swap_api_name_for_post_name($api_names){
    $physician_names = [];
    $physician_query = new WP_Query(array(
        'post_type' => 'physician',
        'posts_per_page' => -1
    ));

   $converted_array =  [];

     
  
    while ($physician_query->have_posts()) {
        $physician_query->the_post();
        $physician_name =  get_the_title();
        $physician_names[] = $physician_name;
    }

 
 

    // loop through api names  and if name matches post name, swap it out for post name
    foreach($api_names as $api_name){
        $variation_match = false;
        foreach($physician_names as $physician_name){
            if(name_variation($physician_name, $api_name)){
              
                $variation_match = true;
                break;
            } else {
                $variation_match = false;
            }
        }
 
   
        $variation_match ? $converted_array[] = $physician_name : $converted_array[] = $api_name;
    }
     wp_reset_postdata();
   
    
     return $converted_array;
}