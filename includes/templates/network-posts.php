<!-- Assuming you have imported Tailwind CSS in your HTML file or template -->

<?php
 

// Assuming $data['posts'] contains the blog post data.
$posts = $data['posts'];

 
 
?>

 

<!-- Ortho Network Blog Post Section -->
 
 
    <article class="ortho-network-blog-post-card">
      <a href ="<?php echo $posts['post_link'] ?>">
      <div class="ortho-network-blog-post-card__header">
        <!-- img -->

        <div class="ortho-network-blog-post-card__header__img">
          <img class="img-fit" src="<?php echo $posts['post_thumbnail']; ?>" alt="<?php echo $posts['post_thumbnail'] ?>" />
        </div>
      </div>
       <!--  card  footer -->
      <div class="ortho-network-blog-post-card__footer">
        <div class="ortho-network-blog-post-card__footer__date">
          <p class="ortho-network-blog-post-date"><?php echo $posts['post_date']; ?></p>
        </div>
        <div class="ortho-network-blog-post-card__footer__title">
          <h3 class="ortho-network-blog-post-title"><?php echo wp_trim_words($posts['post_title'], 6, '...')  ?></h3>
        </div>
        <!-- site name -->
        <div class="ortho-network-blog-post-card__footer__site-name">
          <p class="ortho-network-blog-post-site-name"><?php echo $posts['site_name']; ?></p>

          </div>
      
      </div>
     </a>
     
    </article>
 
 
