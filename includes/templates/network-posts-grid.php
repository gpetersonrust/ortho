<?php 
$network_site_post_feed = $data['network_site_post_feed'];
$request_uri = $_SERVER['REQUEST_URI'];
// if uri is the home page, set the number of posts to display to 3
if ($request_uri == '/') {
    $network_site_post_feed = array_slice($network_site_post_feed, 0, 3);
}

?>

 

<div class="network-posts-container">
    <?php foreach ($network_site_post_feed as $key => $value) {
        
        ?>
      
          
            
                <?php echo get_plugin_template('includes/templates/network-posts', null, array('posts' => $value)) ?>
      
        
    <?php } ?>
</div>
