<?php
if(isset($_GET['overrule'])) {
	if($_GET['overrule'] != "true") {
		header('Location: http://teusink.blogspot.com/2014/11/the-history-of-droidpapers.html');
	}
} else {
	header('Location: http://teusink.blogspot.com/2014/11/the-history-of-droidpapers.html');
}

if (strpos($_SERVER['SERVER_NAME'], "droidpapers.org") == true) {
	header('Location: http://droidpapers.teusink.org/');
}
header("Cache-Control: public");
header("Content-type: text/html; charset=utf-8");

// error reporting
$GLOBALS['debugmode'] = 0; // 0 (debug off) || 1 (debug on)
if ($GLOBALS['debugmode'] == 1) {
	ini_set("display_errors", 1); // 0 (no errors) || 1 (all errors)
	error_reporting(1); // -1 (no errors) || 1 (all errors)
} else {
	ini_set("display_errors", 0); // 0 (no errors) || 1 (all errors)
	error_reporting(-1); // -1 (no errors) || 1 (all errors)
}

// connection to MySQL database
$GLOBALS['database'] = mysqli_connect("192.168.1.7","teusinkorg","GX8fuXegLV","database") or die(mysqli_error());
$GLOBALS['db-server'] = "192.168.1.7";
$GLOBALS['db-user'] = "teusinkorg";
$GLOBALS['db-password'] = "GX8fuXegLV";
$GLOBALS['db-name'] = "database";

// email addresses
$GLOBALS['system_operator_mail'] = 'info@droidpapers.org';
$GLOBALS['system_from_mail'] = 'info@droidpapers.org';

// save urls
$GLOBALS['saveUrlContentImages'] = "droidpapers.teusink.org/app_content/images/";
$GLOBALS['saveUrlContentLogos'] = "droidpapers.teusink.org/app_content/logos/";
$GLOBALS['saveUrlContentRingtones'] = "droidpapers.teusink.org/app_content/ringtones/";
$GLOBALS['saveUrlContentWallpapers'] = "droidpapers.teusink.org/app_content/wallpapers/";
$GLOBALS['saveUrlContentWallpapersSmallThumbs'] = "droidpapers.teusink.org/app_content/wallpapers_small_thumbs/";
$GLOBALS['saveUrlContentWallpapersThumbs'] = "droidpapers.teusink.org/app_content/wallpapers_thumbs/";

// clean from tags
function strip_html_tags($text) {
	// PHP's strip_tags() function will remove tags, but it
	// doesn't remove scripts, styles, and other unwanted
	// invisible text between tags.  Also, as a prelude to
	// tokenizing the text, we need to insure that when
	// block-level tags (such as <p> or <div>) are removed,
	// neighboring words aren't joined.
	$text = preg_replace(
		array(
			// Remove invisible content
			'@<head[^>]*?>.*?</head>@siu',
			'@<style[^>]*?>.*?</style>@siu',
			'@<script[^>]*?.*?</script>@siu',
			'@<object[^>]*?.*?</object>@siu',
			'@<embed[^>]*?.*?</embed>@siu',
			'@<applet[^>]*?.*?</applet>@siu',
			'@<noframes[^>]*?.*?</noframes>@siu',
			'@<noscript[^>]*?.*?</noscript>@siu',
			'@<noembed[^>]*?.*?</noembed>@siu',

			// Add line breaks before & after blocks
			'@<((br)|(hr))@iu',
			'@</?((address)|(blockquote)|(center)|(del))@iu',
			'@</?((div)|(h[1-9])|(ins)|(isindex)|(p)|(pre))@iu',
			'@</?((dir)|(dl)|(dt)|(dd)|(li)|(menu)|(ol)|(ul))@iu',
			'@</?((table)|(th)|(td)|(caption))@iu',
			'@</?((form)|(button)|(fieldset)|(legend)|(input))@iu',
			'@</?((label)|(select)|(optgroup)|(option)|(textarea))@iu',
			'@</?((frameset)|(frame)|(iframe))@iu',
		),
		array(
			' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
			"\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0",
			"\n\$0", "\n\$0",
		),
		$text);

	// Remove all remaining tags and comments and return.
	return strip_tags($text);
}

// truncate
function truncate_chars($text, $limit, $ellipsis = '...') {
	if( strlen($text) > $limit ) {
		$endpos = strpos(str_replace(array("\r\n", "\r", "\n", "\t"), ' ', $text), ' ', $limit);
		if($endpos !== FALSE)
			$text = trim(substr($text, 0, $endpos)) . $ellipsis;
	}
	return $text;
}

// handle _001 in filenames
function formatNumberLength($num, $length) {
	$num = (string) $num;
	$r = "" . $num;
	while (strlen($r) < $length) {
		$r = "0".$r;
	}
	return $r;
}

// handling database queries
function db_query($query) {
	// Perform Query
	$result = mysqli_query($GLOBALS['database'], $query);
	// Check result
	// This shows the actual query sent to MySQL, and the error. Useful for debugging.
	if (!$result) {
		if ($GLOBALS['debugmode']){
			$message  = '<b>Invalid query:</b><br />' . mysqli_error($GLOBALS['database']) . '<br /><br />';
			$message .= '<b>Whole query:</b><br />' . $query;
			die($message);
		} else {
			$serror =
			"Env:       " . $_SERVER['SERVER_NAME'] . "\r\n" .
			"timestamp: " . Date('m/d/Y H:i:s') . "\r\n" .
			"script:    " . $_SERVER['PHP_SELF'] . "\r\n" .
			"url:       " . getUrlAddress() . "\r\n" .
			"error:     " . "\r\n\r\nInvalid query: " . mysqli_error($GLOBALS['database']) . "\r\n\r\n" . 'Whole query: ' . $query . "\r\n";
			mail($GLOBALS['system_operator_mail'], 'DroidPapers Database error', $serror, 'From: ' . $GLOBALS['system_from_mail']);
		}
	}
	return $result;
}

// parse sql result as json
function jsonQueryDB($sql) {
	try {
		$dbh = new PDO("mysql:host=192.168.1.7;dbname=database", "teusinkorg", "GX8fuXegLV");
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $dbh->query($sql);
		$menus = $stmt->fetchAll(PDO::FETCH_OBJ);
		$dbh = null;
		echo '{"items":'. json_encode($menus) .'}';
	} catch(PDOException $e) {
		if ($GLOBALS['debugmode']){
			$message  = '<b>Error:</b><br />' . $e->getMessage();
			die($message);
		} else {
			$serror =
			"Env:       " . $_SERVER['SERVER_NAME'] . "\r\n" .
			"timestamp: " . Date('m/d/Y H:i:s') . "\r\n" .
			"script:    " . $_SERVER['PHP_SELF'] . "\r\n" .
			"url:       " . getUrlAddress() . "\r\n" .
			"error:     " . "\r\n\r\n" . $e->getMessage() . "\r\n\r\n";
			mail($GLOBALS['system_operator_mail'], 'DroidPapers Database error', $serror, 'From: ' . $GLOBALS['system_from_mail']);
		}
	}
}

// get remote ip address
function getUserIpAddr() {
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		return $_SERVER['HTTP_CLIENT_IP'];
	} else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		return $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
		return $_SERVER['REMOTE_ADDR'];
	}
}

// get remote hostname
function getUserHostName() {
	if (isset($_ENV["HOSTNAME"])) {
		return $_ENV["HOSTNAME"];
	} else if (isset($_ENV["COMPUTERNAME"])) {
		return $_ENV["COMPUTERNAME"];
	} else {
		return;
	}
}

// get the full url of current page
function getUrlAddress() {
	if(!isset($_SERVER['HTTPS'])) { $_SERVER['HTTPS']=""; }
	if(!isset($_SERVER['HTTP_HOST'])) { $_SERVER['HTTP_HOST']=""; }
	if(!isset($_SERVER['REQUEST_URI'])) { $_SERVER['REQUEST_URI']=""; }
 
	// check for https is on or not
	$url = $_SERVER['HTTPS'] == 'on' ? 'https' : 'http';
	// return the full address
	return $url .'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
}

// get all files in directory
function listdir($dir = '.') {
	if (!is_dir($dir)) {
		return false;
	}
	$files = array();
	listdiraux($dir, $files);
    return $files;
}
function listdiraux($dir, &$files) {
	$handle = opendir($dir);
	while (($file = readdir($handle)) != false) {
		if ($file == '.' || $file == '..') {
			continue; 
		}
		$filepath = $dir == '.' ? $file : $dir . '/' . $file;
		if (is_link($filepath))
			continue;
		if (is_file($filepath))
			$files[] = $filepath;
		else if (is_dir($filepath))
			listdiraux($filepath, $files);
	}
	closedir($handle);
}
?>