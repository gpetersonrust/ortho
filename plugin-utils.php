<?php 
// plugin-utils.php
function get_plugin_template($slug, $name = null, $data = array()) {
    ob_start();
    $plugin_path = plugin_dir_path(__FILE__); // Get the path to the plugin directory.
    $templates_path = $plugin_path  ; // Path to the templates folder.

    // Build the file names for the template based on the slug and name.
    $file_name = $slug . (isset($name) ? '-' . $name : '') . '.php';
     $html = '';
    
    // Check if the template file exists, and include it if found.
    if (file_exists($templates_path . $file_name)) {
          
        include($templates_path . $file_name);
        $html = ob_get_clean();
    } else {
        //   if file doesn't exist return error mesage
        $html = '<p>Template not found: ' . $templates_path . $file_name . '</p>';
     }
     return $html;
}
