<!-- meta tags -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, user-scalable=no" />
<meta name="description" content="Droidpapers, The source for open source and free wallpapers and ringtones" />
<meta name="keywords" content="alarm,app,application,audio,background,backgrounds,bean,browser,chrome,chromebook,chromecast,chromeos,cupcake,delicacies,device,devices,donut,droid,droipaper,droidpapers,eclair,froyo,gingerbread,google,hd,high,holo,honeycomb,icecream,ics,jelly,kat,kindle,kit,kitkat,notification,notifications,original,papers,play,resolution,ringtone,ringtones,sandwich,smartphone,stock,store,support,tablet,teusinkorg,wallpaper,wallpapers" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Joram Teusink" />
<meta name="generator" content="Notepad++" />
<meta name="googlebot" content="noodp" />

<!-- title of website -->
<title>
<?php
$basenamePage = basename($_SERVER['PHP_SELF']);
if ($basenamePage == "distributions.php") {
	?>DroidPapers, overview distributions<?php
} else if ($basenamePage == "morefrom.php") {
	?>DroidPapers, overview wallpapers<?php
} else if ($basenamePage == "share.php") {
	?>DroidPapers, wallpaper<?php
} else if ($basenamePage == "about.php") {
	?>DroidPapers, more information and support<?php
} else if ($basenamePage == "topic.php") {
	?>DroidPapers, topics with wallpapers and ringtones<?php
} else if ($basenamePage == "ringtones.php") {
	?>DroidPapers, overview ringtones<?php
} else {
	?>DroidPapers, open source wallpapers and ringtones<?php
}
?>
</title>

<!-- Fix for layout on older browsers -->
<!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->

<!-- Google Analytics -->
<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-28487298-1']);
	_gaq.push(['_setDomainName', 'teusink.org']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>

<!-- CSS3 stylesheet -->
<link rel="stylesheet" href="themes/styles.css" type="text/css" />
<link rel="stylesheet" href="themes/fonts.css" type="text/css" />
<link rel="stylesheet" href="themes/cards.css" type="text/css" />

<!-- Apple iOS stuff -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<link rel="apple-touch-icon" href="images/icons/dp-icon-196.png" />
<link rel="apple-touch-icon" sizes="72x72" href="images/icons/dp-icon-72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="images/icons/dp-icon-114.png" />
<link rel="apple-touch-icon" sizes="128x128" href="images/icons/dp-icon-128.png" />
<link rel="apple-touch-icon-precomposed" sizes="128x128" href="images/icons/dp-icon-128.png" />
<link rel="apple-touch-icon" sizes="144x144" href="images/icons/dp-icon-144.png" />

<!-- Google Chrome stuff -->
<meta name="mobile-web-app-capable" content="yes" />
<link rel="shortcut icon" sizes="128x128" href="images/icons/dp-icon-128.png" />
<link rel="shortcut icon" sizes="196x196" href="images/icons/dp-icon-196.png" />

<?php
$appDeepLink = getUrlAddress();
$appDeepLinkSlash = str_replace("://","/", $appDeepLink);
if ((strpos($appDeepLink, 'share.php?folder=') !== false && strpos($appDeepLink, '&name=') !== false) || (strpos($appDeepLink, '?device=') !== false && strpos($appDeepLink, '&folder=') !== false && strpos($appDeepLink, '&name=') !== false && strpos($appDeepLink, '&ext=') !== false && strpos($appDeepLink, '&type=') !== false)) { ?>
<!-- Android App deep link -->
<link rel="alternate" href="android-app://org.teusink.droidpapers/<? echo $appDeepLinkSlash; ?>" />
<?php } ?>

<!-- favicon -->
<link rel="icon" type="image/ico" href="favicon.ico" />