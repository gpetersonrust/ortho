<?php
function network_site_post_feed(){

$sites = get_sites();
$network_site_post_feed = array();

$active_blogs = [2, 3 ];

// loop through sites
foreach($sites as $site) {
    // switch to site
    $blog_id = $site->blog_id;

      
    //  get blog name 
    $blog_name = get_blog_details($blog_id)->blogname;

    
    // Check if the current blog_id is in active_blogs array
    if (in_array($blog_id, $active_blogs)) {

        switch_to_blog($blog_id);

        // get site name and create array key
        $site_name = get_bloginfo('name');

        // if array key does not exist create it
        // if (!array_key_exists($site_name, $network_site_post_feed)) {
        //     $network_site_post_feed[$site_name] = array();
        // }

        // get posts
        $posts_query = new WP_Query( array(
            'post_type' => 'post',
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_status' => 'publish',
        
            'tax_query' => array(
                array(
                    'taxonomy' => 'category',
                    'field'    => 'slug',
                    'terms'    => 'updates',
                ),
            ),

        ) );
        // loop through posts and get post_title, post_date, thumbnail full size, and post link and store in array 
        while ( $posts_query->have_posts() ) : $posts_query->the_post();
            $network_site_post_feed[] = array(
                'post_title' => get_the_title(),
                'post_date' => get_the_date(),
                'post_thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'full'),
                'post_link' => get_the_permalink(),
                // site_name
                'site_name' => $site_name,
            );
        endwhile;
    //    sort network_site_post_feed by post_date
        usort($network_site_post_feed, 'sortByPostDateDescending');     

        
        // Restore global post data
        wp_reset_postdata();
        restore_current_blog();

    }


}

 
// turn on output buffering
return get_plugin_template('includes/templates/network-posts-grid', null, array('network_site_post_feed' => $network_site_post_feed));
}


// Custom comparison function to sort by 'post_date' in descending order
function sortByPostDateDescending($a, $b) {
    $dateA = strtotime($a['post_date']);
    $dateB = strtotime($b['post_date']);

    // Sort in descending order
    return $dateB - $dateA;
}



add_shortcode('get-post-content', 'get_post_content_shortcode');

function get_post_content_shortcode($atts) {
    // Set default values for attributes
    $atts = shortcode_atts(
        array(
            'id' => 0, // Default post ID if not provided
        ),
        $atts,
        'get-post-content'
    );

    // Get the ID of the post from the $atts
    $post_id = $atts['id'];
     // use post_id to get the content with youtube embeds
     $post_content = apply_filters('the_content', get_post_field('post_content', $post_id));   

    // Return the post content
    return $post_content;
}



add_shortcode('social_climb_id_exists', function($atts){
    $atts = shortcode_atts(
        array(
            'id' => 0, // Default post ID if not provided
        ),
        $atts,
        'social_climb_id_exists'
    );

    // Get the ID of the post from the $atts
    $post_id = $atts['id'];

     $social_climb_id = get_field('social_climb_id', $post_id);

if ($social_climb_id) {
     return "true";
} else {
    return "false";
}
});