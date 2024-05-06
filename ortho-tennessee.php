<?php


/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://gpeterson@moxcar.com
 * @since             1.0.0
 * @package           Ortho_Tennessee
 *
 * @wordpress-plugin
 * Plugin Name:       Ortho Tennessee
 * Plugin URI:        https://gpeterson@moxcar.com
 * Description:       This plugin will maintain moxcar multisite
 * Version:           1.0.0
 * Author:            Gino Peterson
 * Author URI:        https://gpeterson@moxcar.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       ortho-tennessee
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'ORTHO_TENNESSEE_VERSION', '1.0.0' );
define("ORTHO_TENNESSEE_PLUGIN_DIR_PATH", plugin_dir_path( __FILE__ ));

// require plugin-utils.php
require_once plugin_dir_path( __FILE__ ) . '/plugin-utils.php';
// require shortcodes.php
require_once ORTHO_TENNESSEE_PLUGIN_DIR_PATH . '/shortcodes/shortcodes.php';
// api 
require_once ORTHO_TENNESSEE_PLUGIN_DIR_PATH . '/api/api.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-ortho-tennessee-activator.php
 */
function activate_ortho_tennessee() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-ortho-tennessee-activator.php';
	Ortho_Tennessee_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-ortho-tennessee-deactivator.php
 */
function deactivate_ortho_tennessee() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-ortho-tennessee-deactivator.php';
	Ortho_Tennessee_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_ortho_tennessee' );
register_deactivation_hook( __FILE__, 'deactivate_ortho_tennessee' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-ortho-tennessee.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_ortho_tennessee() {

	$plugin = new Ortho_Tennessee();
	$plugin->run();

}
run_ortho_tennessee();
 

function custom_redirect_on_specific_sites($target_sites) {
  $current_domain = $_SERVER['HTTP_HOST'];
  $current_url = $_SERVER['REQUEST_URI'];
  // if current_url has / at the end, remove it
  if (substr($current_url, -1) === '/') {
      $current_url = substr($current_url, 0, -1);
  }
  

  foreach ($target_sites as $target_site) {
      $target_domain = $target_site['domain'];
      $target_url = $target_site['url'];
      $redirect_url = $target_site['redirect_url'];


      if ($current_domain === $target_domain && $current_url === $target_url) {
          // Redirect to the specified URL
          wp_redirect($redirect_url, 301);
          exit;
      }
  }
}

add_action('template_redirect', function() {
  // Define an array of target domains and URLs
  $target_sites = array(
      array(
          'domain' => 'kocortho.com',
          'url' => '/cast-care', 
          'redirect_url' => 'https://www.youtube.com/watch?v=AkkK2vlY1Do'
      ),
         
      // Add additional target sites here
  );

  // Call the function with the array of target sites
  custom_redirect_on_specific_sites($target_sites);
});