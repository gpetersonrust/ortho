<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://gpeterson@moxcar.com
 * @since      1.0.0
 *
 * @package    Ortho_Tennessee
 * @subpackage Ortho_Tennessee/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Ortho_Tennessee
 * @subpackage Ortho_Tennessee/public
 * @author     Gino Peterson <gpeterson@moxcar.com>
 */
class Ortho_Tennessee_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	public function enqueue_styles() {
		$current_uri = $_SERVER['REQUEST_URI'];
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Your_Package_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Your_Package_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		// dist /app path url
		$directory_url = plugin_dir_url( dirname( __FILE__, 1 ) ) . 'dist/app/';
		$self_pay_directory_url = plugin_dir_url( dirname( __FILE__, 1 ) ) . 'dist/self-pay-pricing/';
		$app_css = $directory_url . 'app' . dynamic_hash() . '.css';

		wp_enqueue_style( $this->plugin_name,  $app_css  , array(), $this->version, 'all' );

		if($current_uri == '/self-pay-pricing-2/') {
			wp_enqueue_style( 'self-pay-pricing',  $self_pay_directory_url . 'self-pay-pricing' . dynamic_hash() . '.css'  , array(), $this->version, 'all' );
		}

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		 
		$current_uri = $_SERVER['REQUEST_URI'];
		 

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Your_Public_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Your_Package_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		// dist /app path
		$directory_url = plugin_dir_url( dirname( __FILE__, 1 ) ) . 'dist/app/';
		$self_pay_directory_url = plugin_dir_url( dirname( __FILE__, 1 ) ) . 'dist/self-pay-pricing/';
		$app_js = $directory_url . 'app' . dynamic_hash() . '.js';

		wp_enqueue_script( $this->plugin_name,  $app_js, [], $this->version, true );
		// localize script site_url
		wp_localize_script( $this->plugin_name, 'site_url', site_url() );
		// localize script ajax_url
		wp_localize_script( $this->plugin_name, 'ajax_url',   get_rest_url() );
		// localize script wp-rest nonce 
		wp_localize_script( $this->plugin_name, 'wp_rest_nonce', wp_create_nonce('wp_rest') );
		

		if($current_uri == '/self-pay-pricing-2/') {
			wp_enqueue_script( 'self-pay-pricing',  $self_pay_directory_url . 'self-pay-pricing' . dynamic_hash() . '.js'  , array(), $this->version, true );
		}

	}

}

/**
 * Get the dynamic hash generated for assets.
 *
 * This function retrieves the dynamic hash generated for assets by following these steps:
 * 1. Read the 'dist/app' directory and get the first file.
 * 2. Extract the hash from the file name by splitting it with '-wp'.
 * 3. Further extract the hash by splitting it with '.' to remove the file extension.
 * 4. Combine the hash with the '-wp' prefix and return the final dynamic hash.
 *
 * @since    1.0.0
 *
 * @return   string   The dynamic hash for assets.
 */
function dynamic_hash() {
	// Get the path to the 'dist/app' directory.
	$directory_path = plugin_dir_path( dirname( __FILE__, 1 ) ) . 'dist/app/';

	// Get the files in the 'dist/app' directory.
	$files = scandir( $directory_path );

	// Find the first file in the directory.
	$first_file = '';
	foreach ( $files as $file ) {
		if ( ! is_dir( $directory_path . $file ) ) {
			$first_file = $file;
			break;
		}
	}

	// Extract the hash from the file name.
	$hash_parts = explode( '-wp', $first_file );
	$hash = isset( $hash_parts[1] ) ? $hash_parts[1] : '';

	// Further extract the hash by splitting it with '.' to remove the file extension.
	$hash_parts = explode( '.', $hash );
	$hash = isset( $hash_parts[0] ) ? $hash_parts[0] : '';

	// Combine the hash with the '-wp' prefix and return the final dynamic hash.
	$dynamic_hash = '-wp' . $hash;

	return $dynamic_hash;
}