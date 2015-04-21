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

	<?php getSpecificTopic(); ?>
	
</section>

<!-- right page of website -->
<section class="rightPage">

	<?php
	droidpapersBanner();
	playstoreBanner();
	?>
	
</section>

<!-- Footer of website -->
<footer class="pageFooter">

	<?php require_once("inc.html.footer.php"); ?>

</footer>

</body>

</html>