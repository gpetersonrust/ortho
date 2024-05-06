<?php
/*
Plugin Name: Your Plugin Name
Description: Your plugin description.
Version: 1.0
Author: Your Name
*/

// Main menu page callback function
function your_plugin_page_cb() {
    // Display your plugin's main menu page content here
    echo '<h1>Your Plugin Main Menu Page</h1>';
}

// Submenu page callback function
function your_submenu_page_cb() {
 return include_once plugin_dir_path( __FILE__ ) . 'templates/reviews.php';
}

// Add main menu page
function your_plugin_add_menu_page() {
    add_menu_page(
        'Ortho  Tennessee',           // Page title
        'Otho Tennessee',           // Menu title
        'manage_options',        // Capability required to access the menu
        'ortho-tennessee',      // Menu slug
        'your_plugin_page_cb',   // Callback function to render the menu page
        'dashicons-admin-generic' // Icon URL or Dashicons class (optional)
    );
}


// // Add submenu page
function your_plugin_add_submenu_page() {
    add_submenu_page(
        'ortho-tennessee',    // Parent menu slug (should be the same as used in add_menu_page)
        'Orth Reviews',        // Page title
        'Other Reviews',        // Menu title
        'manage_options',      // Capability required to access the submenu
        'ortho-reviews',   // Menu slug
        'your_submenu_page_cb' // Callback function to render the submenu page
    );
}