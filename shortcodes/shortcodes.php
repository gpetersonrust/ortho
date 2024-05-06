<?php
class Ortho_Shortcodes{
    public function __construct(){
        $this->register_shortcode();
    }

    public function register_shortcode(){
        add_shortcode('location-exists', array($this, 'location_exists'));
        add_shortcode('dynamic_logo', array($this, 'dynamic_logo_shortcode'));
        add_shortcode('expert_query' , array($this, 'expert_query_shortcode'));
    }

    public function location_exists($atts){
        // get id from $atts  
        $atts = shortcode_atts(
            array(
                'id' => '',
            ),
            $atts,
            'location-exists'
        );
        $id = $atts['id'] ? $atts['id'] : get_the_ID();
        // get location from id
        $location = get_field('office_location', $id);
        $location_exists = $location ? 'location_exists' : 'location_does_not_exist';
        // return location_exists
        return $location_exists;
    }

    public function dynamic_logo_shortcode($atts) {
        // Extract shortcode attributes
        $atts = shortcode_atts(
            array(
                'logo' => '', // Default value if no attribute is provided
            ),
            $atts,
            'dynamic_logo'
        );

        // Get the URL from the attribute
        $logo_url = $atts['logo'];

        // Check if the logo URL needs replacement
        if ($logo_url === 'https://orthotndev.wpengine.com/wp-content/uploads/2022/05/Knoxville-Orthopaedic-Clinic-Logo-RGB-NO-TAG.png') {
            // Replace with the new URL
            $logo_url = 'https://www.orthotn.com/wp-content/uploads/2024/03/koc-logo-larged.jpg';
        }

        // Return the URL
        return $logo_url;
    }

 

}
new Ortho_Shortcodes();