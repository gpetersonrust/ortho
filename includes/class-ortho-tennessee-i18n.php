<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://gpeterson@moxcar.com
 * @since      1.0.0
 *
 * @package    Ortho_Tennessee
 * @subpackage Ortho_Tennessee/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Ortho_Tennessee
 * @subpackage Ortho_Tennessee/includes
 * @author     Gino Peterson <gpeterson@moxcar.com>
 */
class Ortho_Tennessee_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'ortho-tennessee',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
