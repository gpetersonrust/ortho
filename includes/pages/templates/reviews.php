<form method="post" action="<?php echo esc_url(site_url() .'/wp-json/ortho-tennessee/v1/surveys'); ?>">
        <!-- Add a hidden field for the wp_nonce -->
        <?php wp_nonce_field('your_plugin_reviews_nonce_action', 'your_plugin_reviews_nonce'); ?>

        <label for="start_date">Start Date:</label>
        <input type="date" id="start_date" name="start_date" required>

        <label for="end_date">End Date:</label>
        <input type="date" id="end_date" name="end_date" required>

        <input type="hidden" name="action" value="process_reviews_form">
        <input type="submit" value="Get Reviews">
    </form>