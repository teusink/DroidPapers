<?php
// DroidPapers API v4
require_once('../inc.init.php');
if (isset($_GET['action']) && isset($_GET['key'])) {
	$action = strip_html_tags($_GET['action']);
	$action = trim($action);
	$action = truncate_chars($action, 255);
	$key = strip_html_tags($_GET['key']);
	$key = trim($key);
	$key = truncate_chars($key, 255);
	$source = $_SERVER['SERVER_NAME'];
	$mysqli = new mysqli($GLOBALS['db-server'], $GLOBALS['db-user'], $GLOBALS['db-password'], $GLOBALS['db-name']);
	if($stmt = $mysqli -> prepare("SELECT `id` FROM `dp-apikeys` WHERE `key`=? AND `active`='yes' AND `source`=? OR `key`=? AND `active`='yes' AND `source`='unknown' LIMIT 0,1")) {
		$stmt->bind_param("sss", $key, $source, $key);
		$stmt->execute();
		$stmt->store_result();
		$keyoke = $stmt->num_rows;
		$mysqli->close();
	} else {
		$keyoke = '0';
	}
	if ($keyoke == 1) {
		switch ($action) {
			
			case "appsyncversion":
				$sql = "SELECT `version`,`notes`,`app` FROM `dp-app-dbversion` ORDER BY `version` DESC LIMIT 0,1;";
				jsonQueryDB($sql);
				break;
				
			case "appsyncdistros":
				$sql = "SELECT `logo`,`name`,`wallpapers`,`wallpaperstext`,`ringtones`,`ringtonestext`,`type`,`os` FROM `dp-app-distributions` WHERE `active` = 'yes' ORDER BY `os` ASC, `type` ASC, `name` ASC;";
				jsonQueryDB($sql);
				break;
				
			case "appsyncwalls":
				$sql = "SELECT `name`,`resolution`,`folder`,`filename`,`amount`,`distribution`,`version`,`density` FROM `dp-app-wallpapers` WHERE `active` = 'yes' ORDER BY `distribution` ASC, `name` DESC;";
				jsonQueryDB($sql);
				break;
				
			case "appsyncrings":
				$sql = "SELECT `folder`,`filename`,`name`,`type`,`distribution`,`device`,`version` FROM `dp-app-ringtones` WHERE `active` = 'yes' ORDER BY `distribution` ASC, `device` DESC, `type` ASC, `name` ASC;";
				jsonQueryDB($sql);
				break;
				
			case "appsyncwallnotes":
				$sql = "SELECT `wallpaper`,`note` FROM `dp-app-wallpapers-notes` ORDER BY `wallpaper` ASC;";
				jsonQueryDB($sql);
				break;
			
			case "topset30walls1month":
				$sql = "SELECT `wallpaper`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `wallpaper` ORDER BY magnitude DESC LIMIT 0,30;";
				jsonQueryDB($sql);
				break;
			
			case "topset30alarms1month":
				$sql = "SELECT `ringtone`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtype` = 'alarm' AND `ringtone` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `ringtone` ORDER BY magnitude DESC LIMIT 0,30;";
				jsonQueryDB($sql);
				break;
			
			case "topset30notifications1month":
				$sql = "SELECT `ringtone`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtype` = 'notification' AND `ringtone` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `ringtone` ORDER BY magnitude DESC LIMIT 0,30;";
				jsonQueryDB($sql);
				break;
			
			case "topset30ringtones1month":
				$sql = "SELECT `ringtone`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtype` = 'ringtone' AND `ringtone` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `ringtone` ORDER BY magnitude DESC LIMIT 0,30;";
				jsonQueryDB($sql);
				break;
			
			case "lastset30walls":
				$sql = "SELECT `wallpaper` FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL ORDER BY `timestamp` DESC LIMIT 0,30;";
				// $sql = "SELECT `wallpaper`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL GROUP BY `timestamp` ORDER BY `magnitude` DESC LIMIT 0,30;"; // TODO
				jsonQueryDB($sql);
				break;
			
			case "lastset30alarms":
				$sql = "SELECT `ringtone` FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND `ringtype`='alarm' ORDER BY `timestamp` DESC LIMIT 0,30;";
				// $sql = "SELECT `ringtone`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND `ringtype`='alarm' GROUP BY `timestamp` ORDER BY `magnitude` DESC LIMIT 0,30;"; // TODO
				jsonQueryDB($sql);
				break;
			
			case "lastset30notifications":
				$sql = "SELECT `ringtone` FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND `ringtype`='notification' ORDER BY `timestamp` DESC LIMIT 0,30;";
				// $sql = "SELECT `ringtone`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND `ringtype`='notification' GROUP BY `timestamp` ORDER BY `magnitude` DESC LIMIT 0,30;"; // TODO
				jsonQueryDB($sql);
				break;
			
			case "lastset30ringtones":
				$sql = "SELECT `ringtone` FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND `ringtype`='ringtone' ORDER BY `timestamp` DESC LIMIT 0,30;";
				// $sql = "SELECT `ringtone`, COUNT(*) AS magnitude FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND `ringtype`='ringtone' GROUP BY `timestamp` ORDER BY `magnitude` DESC LIMIT 0,30;"; // TODO
				jsonQueryDB($sql);
				break;
			
			case "getwallspec":
				if (isset($_GET['url'])) {
					$url = strip_html_tags($_GET['url']);
					$url = trim($url);
					$url = truncate_chars($url, 255);
					$urlLocal=str_replace('http://droidpapers.teusink.org/','../',$url);
					if (filter_var($url, FILTER_VALIDATE_URL) && strpos($url, $GLOBALS['saveUrlContentWallpapers']) !== false && file_exists($urlLocal)) {
						list($width, $height, $type, $attr) = getimagesize($urlLocal);
						$filesize = filesize($urlLocal);
						$mysqli = new mysqli($GLOBALS['db-server'], $GLOBALS['db-user'], $GLOBALS['db-password'], $GLOBALS['db-name']);
						if($stmt = $mysqli -> prepare("SELECT `id` FROM `dp-app-contentset` WHERE `wallpaper`=?")) {
							$stmt->bind_param("s", $url);
							$stmt->execute();
							$stmt->store_result();
							$sets = $stmt->num_rows;
							$mysqli->close();
						} else {
							$sets = '0';
						}
						echo '{"items":[{"filesize":"'.$filesize.'","resolution":"'.$width.'x'.$height.'","sets":"'.$sets.'"}]}';
					} else {
						echo '{"items":[{"filesize":"","resolution":"","sets":""}]}';
					}
				} else {
					echo '{"items":[{"filesize":"","resolution":"","sets":""}]}';
				}
				break;
			
			case "getringspec":
				if (isset($_GET['url'])) {
					$url = strip_html_tags($_GET['url']);
					$url = trim($url);
					$url = truncate_chars($url, 255);
					$urlLocal=str_replace('http://droidpapers.teusink.org/','../',$url);
					if (filter_var($url, FILTER_VALIDATE_URL) && strpos($url, $GLOBALS['saveUrlContentRingtones']) !== false && file_exists($urlLocal)) {
						$filesize = filesize($urlLocal);
						$mysqli = new mysqli($GLOBALS['db-server'], $GLOBALS['db-user'], $GLOBALS['db-password'], $GLOBALS['db-name']);
						if($stmt = $mysqli -> prepare("SELECT `id` FROM `dp-app-contentset` WHERE `ringtone`=?")) {
							$stmt->bind_param("s", $url);
							$stmt->execute();
							$stmt->store_result();
							$sets = $stmt->num_rows;
							$mysqli->close();
						} else {
							$sets = '0';
						}
						echo '{"items":[{"filesize":"'.$filesize.'","sets":"'.$sets.'"}]}';
					} else {
						echo '{"items":[{"filesize":"","sets":""}]}';
					}
				} else {
					echo '{"items":[{"filesize":"","sets":""}]}';
				}
				break;
			
			case "contentsetwall":
				$url = strip_html_tags($_GET['url']);
				$url = trim($url);
				$url = truncate_chars($url, 255);
				$urlLocal=str_replace('http://droidpapers.teusink.org/','../',$url);
				if (filter_var($url, FILTER_VALIDATE_URL) && strpos($url, $GLOBALS['saveUrlContentWallpapers']) !== false && file_exists($urlLocal)) {
					$mysqli = new mysqli($GLOBALS['db-server'], $GLOBALS['db-user'], $GLOBALS['db-password'], $GLOBALS['db-name']);
					if ($stmt = $mysqli -> prepare("INSERT INTO `dp-app-contentset` (`wallpaper`) VALUES (?)")) {
						$stmt->bind_param("s", $url);
						$stmt->execute();
						echo '{"items":[{"contentsetwall":"oke"}]}';
					} else {
						echo '{"items":[{"contentsetwall":"notoke"}]}';
					}
				} else {
					echo '{"items":[{"contentsetwall":"urlnotoke"}]}';
				}
				break;
			
			case "contentsetring":
				$url = strip_html_tags($_GET['url']);
				$url = trim($url);
				$url = truncate_chars($url, 255);
				$urlLocal=str_replace('http://droidpapers.teusink.org/','../',$url);
				if (filter_var($url, FILTER_VALIDATE_URL) && strpos($url, $GLOBALS['saveUrlContentRingtones']) !== false && file_exists($urlLocal)) {
					if (strpos($url, 'alarms') !== false) {
						$type = 'alarm';
					} else if (strpos($url, 'notifications') !== false) {
						$type = 'notification';
					} else if (strpos($url, 'ringtones') !== false) {
						$type = 'ringtone';
					}
					$mysqli = new mysqli($GLOBALS['db-server'], $GLOBALS['db-user'], $GLOBALS['db-password'], $GLOBALS['db-name']);
					if ($stmt = $mysqli -> prepare("INSERT INTO `dp-app-contentset` (`ringtone`,`ringtype`) VALUES (?,?)")) {
						$stmt->bind_param("ss", $url, $type);
						$stmt->execute();
						echo '{"items":[{"contentsetring":"oke"}]}';
					} else {
						echo '{"items":[{"contentsetring":"notoke"}]}';
					}
				} else {
					echo '{"items":[{"contentsetring":"urlnotoke"}]}';
				}
				break;
			
			case "getallcounters":
				$sql = "SELECT `id` FROM `dp-app-contentset` WHERE `wallpaper`!= '';";
				$result = db_query($sql);
				$topWalls = mysqli_num_rows($result);
				$sql = "SELECT `id` FROM `dp-app-contentset` WHERE `ringtone`!= '';";
				$result = db_query($sql);
				$topRings = mysqli_num_rows($result);
				$sql = "SELECT `amount` FROM `dp-app-wallpapers` WHERE `active` = 'yes';";
				$result = db_query($sql);
				$amountWalls = 0;
				while($record = mysqli_fetch_object($result)) {
					$amountWalls = $amountWalls + $record->amount;
				}
				$sql = "SELECT COUNT(DISTINCT `filename`) AS `filecount` FROM `dp-app-ringtones` GROUP BY `filename`;";
				$result = db_query($sql);
				$amountRings = mysqli_num_rows($result);
				echo '{"items":[{"topwalls":"'.$topWalls.'","toprings":"'.$topRings.'","amountwalls":"'.$amountWalls.'","amountrings":"'.$amountRings.'"}]}';
				break;
			
			default:
				echo '{"message":[{"error":"command not found"}]}';
		}	
	} else {
		echo '{"message":[{"error":"command not found"}]}';
	}
} else {
	echo '{"message":[{"error":"command not found"}]}';
}
?>