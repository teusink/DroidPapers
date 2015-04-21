<?php
require_once("inc.init.php");
require_once("inc.api.php");
?>
<!DOCTYPE HTML>

<html lang="en-US">
<head>

<?php require_once("inc.html.header.php"); ?>

</head>

<body>

<!-- Header (including title) of website -->
<header class="pageHeader">
	
	<?php pageHeader(); ?>
	
</header>

<!-- left page of website -->
<section class="leftPage">

	<!-- including specific page contents -->
	
	<?php
	getAboutContent();
	reviews();
	?>
	
</section>

<!-- right page of website -->
<section class="rightPage">

	<?php
	droidpapersBanner();
	playstoreBanner();
	googlePlusBadge();
	droidpapersTwitter();
	?>
	
</section>

<!-- Footer of website -->
<footer class="pageFooter">

	<?php require_once("inc.html.footer.php"); ?>

</footer>

<!-- Plaats deze tag na de laatste widget-tag. -->
<script type="text/javascript">
  window.___gcfg = {lang: 'en-GB'};

  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>

</body>

</html>