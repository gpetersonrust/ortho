<?php 

// regestier rest api init
add_action('rest_api_init', 'ortho_register_api');

function ortho_register_api() {
    register_rest_route('ortho/v1', '/get_experts', array(
        'methods' => 'GET',
        'callback' => 'ortho_get_posts'
    ));
}

function ortho_get_posts($data) {
    $post_type; 

    if (isset($data['post_type'])) {
        $post_type = sanitize_text_field($data['post_type']);
    } else {
        $post_type = 'physician';
    }
    $args = array(
        'post_type' => 'physician',
        'posts_per_page' => -1
    );

    $experts = get_posts($args);

    $experts_array = array_map(function ($expert) {
        $ID = $expert->ID;
        $affiliation = get_field('affiliation_link', $ID);
        $affilation_choice = get_field('affiliation_choice', $ID);
        $affiliations = [
            'https://kocortho.com/' => 'KNOXVILLE ORTHOPAEDIC CLINIC',
            'https://mocortho.com/' => 'ORTHO TENNESSEE MARYVILLE',
            'https://uosctn.com/' => 'UNIVERSITY ORTHOPAEDIC SURGEONS',
            'https://osorortho.com/' => 'KOC OAK RIDGE',
            'https://www.uosortho.com/' => 'UNIVERSITY ORTHOPAEDIC SURGEONS',
        ];

        $affiliationLabel = isset($affiliations[$affiliation]) ? $affiliations[$affiliation] : $affilation_choice;
        return [
            'id' => $ID,
            'name' => get_the_title($ID), // Changed from 'title' to 'name'
            'thumbnail' => get_the_post_thumbnail_url($ID, 'full'),
            'title' => get_field('title', $ID), // Renamed 'job_title' to 'title'
            'affiliation_choice' => $affiliationLabel, // Changed to 'affiliation_choice'
            'specialty' => get_field('specialty', $ID),
            'location' => get_field('office_location', $ID),
            'secondary_specialty' => get_field('secondary_specialty', $ID),
            'surgery' => get_field('Surgery', $ID),
            'permalink' => get_the_permalink($ID),
            'affilation_image' => get_field('affiliation', $ID),
        ];
    }, $experts);

    return  [
        'success' => true,
        'experts' => $experts_array,
        'status_code' => 200,
        'status' => 'ok', 
        'message' => 'Success! Experts fetched successfully.'

    ];
}