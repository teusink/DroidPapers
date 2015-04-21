<?php
function pageHeader() { ?>
	<h1 class="h1"><a id="headerTitle" href="http://droidpapers.teusink.org/">DroidPapers</a></h1>
	<article id="headerBar">
		<div class="g-plusone" data-size="medium"></div>
		<div class="twitter">
			<a href="https://twitter.com/share" class="twitter-share-button" data-text="Stock Android wallpapers and ringtones!" data-hashtags="droidpapers">Tweet</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
		</div>
		<div class="headerBarTitle"><h3 class="headerBarTitleColor">The source for open source and free wallpapers and ringtones</h3></div>
	</article>
<?php
}
?>
<?php
function getTopics() {
	$sql1 = "SELECT `wallpaper` FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL ORDER BY `timestamp` DESC LIMIT 0,1;";
	$result1 = mysqli_query($GLOBALS['database'], $sql1) or die(mysqli_error());
	$lastSet = mysqli_fetch_object($result1);
	
	$sql2 = "SELECT `wallpaper`, COUNT(*) AS `magnitude` FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `wallpaper` ORDER BY `magnitude` DESC LIMIT 0,1;";
	$result2 = mysqli_query($GLOBALS['database'], $sql2) or die(mysqli_error());
	$topSet = mysqli_fetch_object($result2);
	
	$sql3 = "SELECT * FROM `dp-app-wallpapers` ORDER BY timestamp DESC LIMIT 0,1;";
	$result3 = mysqli_query($GLOBALS['database'], $sql3) or die(mysqli_error());
	$record3 = mysqli_fetch_object($result3);
	$folder = "wp-".$record3->folder;
	$filename = $record3->filename."_001";
	$recentAdded = "http://droidpapers.teusink.org/app_content/wallpapers/" . $folder . "/" . $filename . ".jpg";
	
?>
	<article class="card">
		<div class="card-image"><a href="distributions.php"><img alt="card_wallpapers" src="images/cards/card_wallpapers.jpg" />
		<h2>All wallpapers</h2></a></div>
	</article>
	<article class="card">
		<div class="card-image"><a href="distributions.php?content=ringtones"><img alt="card_alarms" src="images/cards/card_alarms.jpg" />
		<h2>All ringtones</h2></a></div>
	</article>
	<article class="card">
		<div class="card-image"><a href="topic.php?topic=topset30walls1month"><img alt="card_wallpapers" class="fit" src="<?php echo $topSet->wallpaper; ?>" />
		<div class="achievement"></div><h2>Top 30 set wallpapers</h2></a></div>
	</article>
	<article class="card">
		<div class="card-image"><a href="topic.php?topic=topset30rings1month"><img alt="card_notifications" src="images/cards/card_notifications.jpg" />
		<div class="achievement"></div><h2>Top 30 set ringtones</h2></a></div>
	</article>
	
	<article class="card">
		<div class="card-image"><a href="topic.php?topic=last30setwalls"><img alt="card_wallpapers" class="fit" src="<?php echo $lastSet->wallpaper; ?>" />
		<div class="gear"></div><h2>Last 30 set wallpapers</h2></a></div>
	</article>
	<article class="card">
		<div class="card-image"><a href="topic.php?topic=last30setrings"><img alt="card_ringtones" src="images/cards/card_ringtones.jpg" />
		<div class="gear"></div><h2>Last 30 set ringtones</h2></a></div>
	</article>
	<article class="card">
		<div class="card-image"><a href="topic.php?topic=recentwallpapers"><img alt="card_wallpapers" class="fit" src="<?php echo $recentAdded; ?>" />
		<div class="reload"></div><h2>Recent added wallpapers</h2></a></div>
	</article>
	<article class="card">
		<div class="card-image"><a href="topic.php?topic=recentringtones"><img alt="card_notifications" src="images/cards/card_notifications.jpg" />
		<div class="reload"></div><h2>Recent added ringtones</h2></a></div>
	</article>
	<?php
}
?>
<?php
function getSpecificTopic() {
	if(!isset($_GET['topic'])) { ?>
		<article class="standard">
			<header><h2 class="h2 cardTitle">No topic</h2></header>
			<p>No topic specified.</p>
		</article>
		<?php
	} else if(isset($_GET['topic'])) {
		$topic=$_GET['topic'];
		$topic=strip_html_tags($topic);

		switch ($topic) {
		
			case "topset30walls1month": ?>
				<article class="standard">
					<header><h2 class="h2 cardTitle">Top 30 set wallpapers</h2></header>
				<?php
				$sql = "SELECT `wallpaper`, COUNT(*) AS `magnitude` FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `wallpaper` ORDER BY `magnitude` DESC LIMIT 0,30;";
				showTopicWallpapers($sql);
				?>
				</article>
				<?php
				break;
				
			case "topset30rings1month": ?>
				<article class="standard">
					<header><h2 class="h2 cardTitle">Top 30 set ringtones</h2></header>
				<?php
				$sql = "SELECT `ringtone`, COUNT(*) AS `magnitude` FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `ringtone` ORDER BY `magnitude` DESC LIMIT 0,30;";
				showTopicRingtones($sql);
				?>
				</article>
				<?php
				break;
			
			case "last30setwalls": ?>
				<article class="standard">
					<header><h2 class="h2 cardTitle">Last 30 set wallpapers</h2></header>
				<?php
				$sql = "SELECT `wallpaper` FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL ORDER BY `timestamp` DESC LIMIT 0,30;";
				showTopicWallpapers($sql);
				?>
				</article>
				<?php
				break;
				
			case "last30setrings": ?>
				<article class="standard">
					<header><h2 class="h2 cardTitle">Last 30 set ringtones</h2></header>
				<?php
				$sql = "SELECT `ringtone` FROM `dp-app-contentset` WHERE `ringtone`!= '' AND `ringtone` IS NOT NULL ORDER BY `timestamp` DESC LIMIT 0,30;";
				showTopicRingtones($sql);
				?>
				</article>
				<?php
				break;
				
			case "recentwallpapers":
				$sql = "SELECT `version` FROM `dp-app-dbversion` ORDER BY `version` DESC LIMIT 0,1;";
				$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
				$record=mysqli_fetch_object($result);
				$version1=$record->version;
				$version2=$record->version-1;
				$version3=$record->version-2;
				$sql = "SELECT * FROM `dp-app-wallpapers` WHERE `version`='$version1' AND active='yes' OR `version`='$version2' AND active='yes' OR `version`='$version3' AND active='yes' ORDER BY distribution ASC, name ASC;";
				showGroupedTopicWallpapers($sql);
				break;
			
			case "recentringtones":
				$sql = "SELECT `version` FROM `dp-app-dbversion` ORDER BY `version` DESC LIMIT 0,1;";
				$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
				$record=mysqli_fetch_object($result);
				$version1=$record->version;
				$version2=$record->version-1;
				$version3=$record->version-2;
				$sql = "SELECT * FROM `dp-app-ringtones` WHERE `version`='$version1' AND active='yes' OR `version`='$version2' AND active='yes' OR `version`='$version3' AND active='yes' ORDER BY distribution ASC, device ASC, type ASC, name ASC;";
				showGroupedTopicRingtones($sql);
				break;
				
			case "muzeiwallpapers": ?>
				<article class="standard">
					<header><h2 class="h2 cardTitle">Wallpapers used by Muzei</h2></header>
				<?php
				$sql = "SELECT `wallpaper`, COUNT(*) AS `magnitude` FROM `dp-app-contentset` WHERE `wallpaper`!= '' AND `wallpaper` IS NOT NULL AND DATE(timestamp) >=  DATE(NOW() - INTERVAL 1 MONTH) GROUP BY `wallpaper` ORDER BY `magnitude` DESC LIMIT 0,100;";
				showTopicWallpapers($sql);
				?>
				</article>
				<?php
				break;
				
			default: ?>
				<article class="standard">
					<header><h2 class="h2 cardTitle">No topic</h2></header>
					<p>No topic specified.</p>
				</article>
			<?php
		}
	}
}
?>
<?php
function showGroupedTopicWallpapers($sql) {
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$num_rows = mysqli_num_rows($result);
	if($num_rows>0) {
		$device="";
		while($record=mysqli_fetch_object($result)) { ?>
			<?php
			for ($i = 1; $i <= $record->amount; $i++) {
				if ($device != $record->name) { 
					if ($device != "") { ?>
						</article>
					<?php
					} ?>
					<article class="standard">
					<header><h3 class="h3"><?php echo $record->distribution." - ".$record->name." (".$record->resolution.")"; ?></h3></header>
					<?php
					$device = $record->name;
				}
				$folder="wp-".$record->folder;
				$folderThumb="thumbs-".$record->folder;
				$number=formatNumberLength($i,3);
				$filename=$record->filename."_".$number;
				$link="http://droidpapers.teusink.org/share.php?folder=" . $folder . "&amp;name=" . $filename;
				$thumb="http://droidpapers.teusink.org/app_content/wallpapers_small_thumbs/" . $folderThumb . "/t_" . $filename . ".jpg"; ?>
				<a href="<?php echo $link; ?>"><img alt="Thumb of <?php echo $filename.".jpg"; ?>" class="fitAllThumb" src="<?php echo $thumb; ?>" /></a>
			<?php
			}
		}
	} else { ?>
		<article class="standard">
			<p>No wallpapers found.</p>
		</article>
	<?php
	}
}
?>
<?php
function showGroupedTopicRingtones($sql) {
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$num_rows = mysqli_num_rows($result);
	if($num_rows>0) {
		$device="";
		$ringType="";
		while($record=mysqli_fetch_object($result)) {
			if ($device != $record->device) { 
				if ($device != "") { ?>
					</article>
				<?php
				} ?>
				<article class="standard">
				<header><h3 class="h3"><?php echo $record->distribution." - ".$record->device; ?></h3></header>
				<?php
				$device = $record->device;
			}
			if ($ringType != $record->type) { ?>
				<h4 class="h4"><?php echo $record->type; ?></h4>
				<?php
				$ringType = $record->type;
			}
			$ringtoneLocal="app_content/ringtones/".$record->folder."/".$record->type."s/".$record->filename;
			$ringtone="http://droidpapers.teusink.org/".$ringtoneLocal;
			if (file_exists($ringtoneLocal)) {
				$folderName=str_replace('http://droidpapers.teusink.org/app_content/ringtones/','',$ringtone); // distro/type/file.ogg
				$folder=strstr($folderName,'/',TRUE); // distro
				$temp=strstr($folderName,'/',FALSE); // /type/file.ogg
				$temp=substr($temp,1); // type/file.ogg
				$type=strstr($temp,'/',TRUE); // type
				$name=strstr($temp,'/',FALSE); // /file.ogg
				$name=str_replace('/','',$name); // file.ogg
				$ext=strstr($name,'.',FALSE); // .ogg
				$ext=str_replace('.','',$ext); // ogg ?>
				<p class="smallBottom"><?php echo $record->name; ?>
				<audio controls>
				<?php
				if($ext=="ogg") { ?>
					<source src="<?php echo $ringtoneLocal; ?>" type="audio/ogg">
				<?php
				} else if ($ext=="mp3") { ?>
					<source src="<?php echo $ringtoneLocal; ?>" type="audio/mpeg">
				<?php
				} ?>
				Your browser does not support the audio element.
				</audio></p>
			<?php
			}
		}
	} else { ?>
		<article class="standard">
			<p>No ringtones found.</p>
		</article>
	<?php
	}
}
?>
<?php
function showTopicRingtones($sql) {
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$num_rows = mysqli_num_rows($result);
	if($num_rows>0) {
		while($record=mysqli_fetch_object($result)) {
			// var_dump(get_object_vars($record));
			$ringtone=strip_html_tags($record->ringtone); // http://droidpapers.teusink.org/app_content/ringtones/distro/type/file.ogg
			$ringtoneLocal=str_replace('http://droidpapers.teusink.org/','',$ringtone);
			if (filter_var($ringtone, FILTER_VALIDATE_URL) && strpos($ringtone,"http://droidpapers.teusink.org/app_content/ringtones/") !== false && file_exists($ringtoneLocal)) {
				$folderName=str_replace('http://droidpapers.teusink.org/app_content/ringtones/','',$ringtone); // distro/alarm/file.ogg
				$folder=strstr($folderName,'/',TRUE); // distro
				$temp=strstr($folderName,'/',FALSE); // /type/file.ogg
				$temp=substr($temp,1); // type/file.ogg
				$type=strstr($temp,'/',TRUE); // type
				$name=strstr($temp,'/',FALSE); // /file.ogg
				$name=str_replace('/','',$name); // file.ogg
				$ext=strstr($name,'.',FALSE); // .ogg
				$ext=str_replace('.','',$ext); // ogg
				$sql2="SELECT `distribution`,`name`,`type` FROM `dp-app-ringtones` WHERE `filename`='$name' AND `active`='yes' LIMIT 0,1;";
				$result2=mysqli_query($GLOBALS['database'], $sql2) or die(mysqli_error());
				$num_rows2 = mysqli_num_rows($result2);
				if($num_rows2>0) {
					$record2=mysqli_fetch_object($result2); ?>
					<h4 class="smallBottom"><?php echo $record2->distribution; ?> - <?php echo $record2->name; ?> (<?php echo $record2->type; ?><?php if (isset($record->magnitude)) { ?>, amount: <?php echo $record->magnitude; } ?>)</h4>
					<audio controls>
					<?php
					if($ext=="ogg") { ?>
						<source src="<?php echo $ringtoneLocal; ?>" type="audio/ogg">
					<?php
					} else if ($ext=="mp3") { ?>
						<source src="<?php echo $ringtoneLocal; ?>" type="audio/mpeg">
					<?php
					} ?>
					Your browser does not support the audio element.
					</audio>
				<?php
				}
			}
		}
	} else { ?>
		<article class="standard">
			<p>No ringtones found.</p>
		</article>
	<?php
	}
}
?>
<?php
function showTopicWallpapers($sql) {
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$num_rows = mysqli_num_rows($result);
	if($num_rows>0) {
		while($record=mysqli_fetch_object($result)) {
			$wallpaper=strip_html_tags($record->wallpaper);
			if (filter_var($wallpaper, FILTER_VALIDATE_URL) && strpos($wallpaper,"http://droidpapers.teusink.org/app_content/wallpapers/") !== false && strpos($wallpaper,".jpg") !== false) {
				$folderName=str_replace('http://droidpapers.teusink.org/app_content/wallpapers/','',$wallpaper);
				$folder=strstr($folderName,'/',TRUE);
				$folderThumb=str_replace('wp-','thumbs-',$folder);
				$name=strstr($folderName,'/',FALSE);
				$name=str_replace('/','',$name);
				$name=str_replace('.jpg','',$name);	
				$link="http://droidpapers.teusink.org/share.php?folder=" . $folder . "&amp;name=" . $name;
				$thumb="app_content/wallpapers_small_thumbs/" . $folderThumb . "/t_" . $name . ".jpg"; ?>
				<a href="<?php echo $link; ?>"><img alt="Thumb of <?php echo $name."jpg"; ?>" class="fitAllThumb" src="<?php echo $thumb; ?>" /></a>
			<?php
			}
		}
	} else { ?>
		<article class="standard">
			<p>No wallpapers found.</p>
		</article>
	<?php
	}
}
?>
<?php
function getPrivacyContent() { ?>
	<article class="standard">
	<header><h2 class="h2 cardTitle">Privacy statement</h2></header>
	<h3 class="h3">DroidPapers website</h3>
	<p>The website does not collect any private or personal identifiable information, nor sends any such information to online servers. Website statistics are, if not opted-out, uploaded to generate information for the improvement of the website. Website statistics are completely anonymous and only contains general information about how the website is used.</p>
	<p>The website uses Google Analytics to track and monitor the usage of the website. Click <a class="effect" href="https://tools.google.com/dlpage/gaoptout">here</a> to opt-out for Google Analytics.</p>
	<h3 class="h3">DroidPapers app</h3>
	<p>The app does not collect any private or personal identifiable information, nor sends any such information to online servers. App statistics are, if switched on, uploaded to generate information for the improvement of the app. App statistics are completely anonymous and only contains general information about how the app is used.</p>
	<p>The app uses Google Analytics to track and monitor the usage of the app. You can opt-out of this in the settings menu in the app.</p>
	<h3 class="h3">Disclaimer</h3>
	<p>All content and rights belong to their respected owners. No transfer of ownership is at hand with using this application. Every wallpaper and ringtone that is included in this app/website is downloaded from the Internet. There is no copyright violation intended with this app. If you feel that your copyright has been violated, please get in touch. Appropriate actions will be taken.</p>
	</article>
<?php
}
?>
<?php
function getCurrentWallpaper() { ?>
	<article class="standard">
	<header><h2 class="h2 cardTitle">Wallpaper</h2></header>
	<p>To save the wallpaper below, right-click your mouse on it and select "Save as..".</p>
	<?php
	// initialize wallpaper variable
	if(!isset($_GET['folder']) || !isset($_GET['name'])) { ?>
		<p>No wallpaper specified.</p>
		<?php
		$wallpaperOke = false;
	} else if(isset($_GET['folder']) && isset($_GET['name'])) {
		$folder=$_GET['folder'];
		$name=$_GET['name'];
		$folder=strip_html_tags($folder);
		$name=strip_html_tags($name);
		if($folder!="" && $name!="") {
			$wallpaper="http://droidpapers.teusink.org/app_content/wallpapers/".$folder."/".$name.".jpg";
			$wallpaperLocal=str_replace('http://droidpapers.teusink.org/','',$wallpaper);
			if (file_exists($wallpaperLocal)) {
				// more from ... wallpapers
				$filename=str_replace('http://droidpapers.teusink.org/app_content/wallpapers/','',$wallpaper);
				$filename=strstr($filename,'/',FALSE);
				$filename=strstr($filename,'_',true);
				$filename=str_replace('/','',$filename);
				$sql="SELECT `distribution`,`name`,`resolution` FROM `dp-app-wallpapers` WHERE `filename`='$filename' AND `active`='yes' LIMIT 0,1;";
				$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
				$num_rows = mysqli_num_rows($result);
				if($num_rows>0) {
					$wallpaperOke = true;
					$record=mysqli_fetch_object($result);
					// count wallpaper sets
					$sql5="SELECT `id` FROM `dp-app-contentset` WHERE `wallpaper`='$wallpaper';";
					$result5=mysqli_query($GLOBALS['database'], $sql5) or die(mysqli_error());
					$num_rows5 = mysqli_num_rows($result5); ?>
					- Total times set as default from within the app: <?php echo $num_rows5; ?><br />
					- Resolution: 
					<?php
					list($width, $height, $type, $attr) = getimagesize($wallpaperLocal);
					echo $width.'x'.$height; ?>
					</p>
					<p><img alt="Wallpaper <?php echo $wallpaper; ?>" class="wallpaper" src="<?php echo $wallpaper; ?>" /></p>
					<?php
					$sql5="SELECT `note` FROM `dp-app-wallpapers-notes` WHERE `wallpaper`='".$name.".jpg' LIMIT 0,1;";
					$result5=mysqli_query($GLOBALS['database'], $sql5) or die(mysqli_error());
					$num_rows5 = mysqli_num_rows($result5);
					if($num_rows5>0) {
						$record5=mysqli_fetch_object($result5); ?>
						<p><?php echo $record5->note; ?></p> 
					<?php
					}
					?>
				<?php
				} else { ?>
					<p>Wallpaper is not set active.</p>
					<?php
					$wallpaperOke = false;
				}
			} else if($folder=="" || $name=="") { ?>
				<p>No wallpaper specified.</p>
				<?php
				$wallpaperOke = false;
			} else { ?>
				<p>Wallpaper does not exists (anymore).</p>
				<?php
				$wallpaperOke = false;
			}
		} else { ?>
			<p>No wallpaper specified.</p>
			<?php
			$wallpaperOke = false;
		}
	} else { ?>
		<p>No wallpaper specified.</p>
		<?php
		$wallpaperOke = false;
	} ?>
	</article>
	
	<?php
	if ($wallpaperOke == true) {
	?>
		<article class="standard">
		<?php
		$sql="SELECT `name`,`resolution`,`folder`,`filename`,`amount`,`distribution` FROM `dp-app-wallpapers` WHERE `active`='yes' AND `name`='$record->name' LIMIT 0,1;";
		$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
		$num_rows = mysqli_num_rows($result);
		if($num_rows>0) {
			$record=mysqli_fetch_object($result);
			for ($i = 1; $i <= $record->amount; $i++) {
				$folder="wp-".$record->folder;
				$folderThumb="thumbs-".$record->folder;
				$number=formatNumberLength($i,3);
				$filename=$record->filename."_".$number;
				$link="http://droidpapers.teusink.org/share.php?folder=" . $folder . "&amp;name=" . $filename;
				$thumb="app_content/wallpapers_small_thumbs/" . $folderThumb . "/t_" . $filename . ".jpg"; ?>
				<a href="<?php echo $link; ?>"><img alt="Thumb of <?php echo $filename.".jpg"; ?>" class="fitAllThumb" src="<?php echo $thumb; ?>" /></a>
			<?php
			}
			$distribution=str_replace(' ','%20',$record->distribution); ?>
			<p>Want more from <a href="morefrom.php?type=distribution&amp;specific=<?php echo $distribution; ?>" class="effect"><?php  echo $record->distribution; ?></a>?</p>
		<?php
		} ?>
		</article>
	<?php
	}
}
?>
<?php
function getAboutContent() { ?>
	<article class="standard">DroidPapers will stop. Read more about it on my web-log <a href="http://teusink.blogspot.nl/2014/11/the-history-of-droidpapers.html" class="effect">here</a>.</article>
	
	<article class="standard">
	<header><h2 class="h2 cardTitle">About DroidPapers</h2></header>
	<h3 class="h3">The source for stock Android, and other open source wallpapers and ringtones</h3>
	<p>DroidPapers delivers official stock Android, and other open source and free wallpapers and ringtones. Download the wallpaper or ringtone you like and set it from within the app. App is and stays ad-free and there are no in-app purchases.</p>
	<h3 class="h3">Video</h3>
	<div class="video-container"><iframe src="http://www.youtube-nocookie.com/embed/tSi80MGQR0s" frameborder="0" allowfullscreen></iframe></div>
	<h3 class="h3">Features</h3>
	<p>* Open wallpapers in browser.<br />
	* Set wallpaper, alarms, notifications and ringtones from within the app.<br />
	* Set a wallpaper in grayscale or sepia color-scheme.<br />
	* Fullscreen view of wallpapers.<br />
	* Favorite systems to organize your favorite wallpapers and ringtones.<br />
	* Download wallpapers and sounds directly, without setting it as default.<br />
	* Play all sounds in the app.<br />
	* Share the wallpapers and ringtones you want to share with the world.<br />
	* Dynamic Wallpaper service to random change your wallpaper based on an interval.</p>
	<h3 class="h3">DroidPapers content</h3>
	<h4 class="h4">Included wallpapers</h4>
	<?php
	$sql="SELECT `logo`,`name`,`wallpapers`,`wallpaperstext`,`type` FROM `dp-app-distributions` WHERE `wallpapers`='yes' AND `active`='yes' ORDER BY `type` ASC, `name` ASC;";
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error()); ?>
	<p>
	<?php
	while($record=mysqli_fetch_object($result)) { ?>
		- <?php echo $record->name; ?> : <?php echo $record->wallpaperstext; ?><br />
	<?php
	} ?>
	</p>
	<?php
	$sql="SELECT `amount` FROM `dp-app-wallpapers` WHERE `active`='yes';";
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$num_rows="";
	while($record=mysqli_fetch_object($result)) {
		$num_rows=$num_rows+$record->amount;
	} ?>
	<p>Total wallpapers: <?php echo $num_rows; ?></p>
	<h4 class="h4">Screenshots Smartphone</h4>
	<a href="images/screenshots/phone_001.png"><img alt="Screenshot Phone 1" class="effect" src="images/screenshots/thumbs/t_phone_001.png" /></a>
	<a href="images/screenshots/phone_002.png"><img alt="Screenshot Phone 2" class="effect" src="images/screenshots/thumbs/t_phone_002.png" /></a>
	<a href="images/screenshots/phone_003.png"><img alt="Screenshot Phone 3" class="effect" src="images/screenshots/thumbs/t_phone_003.png" /></a>
	<a href="images/screenshots/phone_004.png"><img alt="Screenshot Phone 4" class="effect" src="images/screenshots/thumbs/t_phone_004.png" /></a>
	<a href="images/screenshots/phone_005.png"><img alt="Screenshot Phone 5" class="effect" src="images/screenshots/thumbs/t_phone_005.png" /></a>
	<a href="images/screenshots/phone_006.png"><img alt="Screenshot Phone 6" class="effect" src="images/screenshots/thumbs/t_phone_006.png" /></a>
	<a href="images/screenshots/phone_007.png"><img alt="Screenshot Phone 7" class="effect" src="images/screenshots/thumbs/t_phone_007.png" /></a>
	<h4 class="h4">Screenshots Tablet</h4>
	<a href="images/screenshots/tab_001.png"><img alt="Screenshot Tablet 1" class="effect" src="images/screenshots/thumbs/t_tab_001.png" /></a>
	<a href="images/screenshots/tab_002.png"><img alt="Screenshot Tablet 2" class="effect" src="images/screenshots/thumbs/t_tab_002.png" /></a>
	<a href="images/screenshots/tab_003.png"><img alt="Screenshot Tablet 3" class="effect" src="images/screenshots/thumbs/t_tab_003.png" /></a>
	<a href="images/screenshots/tab_004.png"><img alt="Screenshot Tablet 4" class="effect" src="images/screenshots/thumbs/t_tab_004.png" /></a>
	<a href="images/screenshots/tab_005.png"><img alt="Screenshot Tablet 5" class="effect" src="images/screenshots/thumbs/t_tab_005.png" /></a>
	<h4 class="h4">Included ringtones</h4>
	<?php
	$sql="SELECT `logo`,`name`,`ringtones`,`ringtonestext`,`type` FROM `dp-app-distributions` WHERE `ringtones`='yes' AND `active`='yes' ORDER BY `type` ASC, `name` ASC;";
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error()); ?>
	<p>
	<?php
	while($record=mysqli_fetch_object($result)) { ?>
		- <?php echo $record->name; ?> : <?php echo $record->ringtonestext; ?><br />
	<?php } ?>
	</p>
	<?php
	$sql="SELECT `filename`,COUNT(DISTINCT `filename`) AS `filecount` FROM `dp-app-ringtones` WHERE `active`='yes' GROUP BY `filename`;";
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$num_rows = mysqli_num_rows($result); ?>
	<p>Total unique ringtones: <?php echo $num_rows; ?></p>
	<p>Click <a href="http://droidpapers.teusink.org/ringtones.php" class="effect">here</a> to see an overview of all ringtones.</p>
	<h4 class="h4">Supports</h4>
	<p>- Android Ice Cream Sandwich (ICS 4.0, API14) and higher.<br />
	- App performs best on dual-core 1Ghz CPU or better.</p>
	<h4 class="h4">Permissions</h4>
	<p>- INTERNET: For downloading the wallpapers from the internet.<br />
	- ACCESS_NETWORK_STATE: For accessing internet through networks.<br />
	- WRITE_EXTERNAL_STORAGE: For saving wallpapers to SD-card.<br />
	- SET_WALLPAPER: For setting image as system wallpaper.<br />
	- READ_EXTERNAL_STORAGE: For accessing the downloaded wallpaper from SD-card.<br />
	- WRITE_SETTINGS: For setting a ringtone as default ringtone.<br />
	- RECEIVE_BOOT_COMPLETED: To start services after boot of phone.<br />
	<h4 class="h4">Technology used</h4>
	<ul>
		<li><p>The app is build in <a class="effect" href="http://jquerymobile.com">jQuery Mobile</a> and packaged with <a class="effect" href="http://phonegap.com">PhoneGap</a> for the Android platform.</p></li>
		<li><p>PhoneGap plugins: <a class="effect" href="http://teusink.blogspot.nl/2013/09/phonegap-android-androidpreferences.html">AndroidPreferences</a>, <a class="effect" href="http://teusink.blogspot.nl/2013/08/phonegap-android-appstore-plugin.html">Appstore</a>, <a class="effect" href="https://github.com/Red-Folder/Cordova-Plugin-BackgroundService">BackgroundService</a>, <a class="effect" href="http://teusink.blogspot.nl/2013/07/phonegap-android-cachecleaner-plugin.html">CacheCleaner</a>, <a class="effect" href="http://teusink.blogspot.nl/2013/02/phonegap-android-license-key-app-checker.html">CheckKey</a>, <a class="effect" href="http://teusink.blogspot.nl/2013/04/phonegap-android-downloader-plugin.html">Downloader</a>, <a class="effect" href="https://github.com/phonegap-build/GAPlugin">GAPlugin</a>, <a class="effect" href="http://teusink.blogspot.nl/2013/04/phonegap-android-share-plugin.html">Share</a>, and <a class="effect" href="http://teusink.blogspot.nl/2013/04/phonegap-android-toast-plugin.html">Toasts</a>.</p></li>
		<li><p>Java plugins: <a class="effect" href="http://www.joda.org/joda-time/">Joda Time</a>.</p></li>
		<li><p>Javascript plugins: <a class="effect" href="http://jamuhl.github.io/i18next/">i18next</a>.</p></li>
		<li><p>Web images: <a class="effect" href="http://www.androidicons.com/">Android Icons</a>.</p></li>
		<li><p>Interface and application template: <a class="effect" href="http://teusink.blogspot.nl/2013/04/android-example-app-with-phonegap-and.html">jpHolo</a>.</p></li>
	</ul>
	<h4 class="h4">Important notice</h4>
	<p>Teusink.org published DroidPapers only on the markets above. Other markets, such as GetJar, are not targeted by Teusink.org. Therefore APK files on markets other then the above may be corrupted. Please take caution with this. If you have any questions, please feel free to ask.</p>
	</article>
<?php
}
?>
<?php
function getIncludedRingtones() { ?>
	<article class="standard">
	<header><h2 class="h2 cardTitle">Included ringtones</h2></header>
	<?php
	if(!isset($_GET['device'])) {
		$setDevice = "all";
	} else if(isset($_GET['device'])) {
		$setDevice=$_GET['device'];
		$setDevice=strip_html_tags($setDevice);
	}
	if($setDevice == "all") {
		$sql="SELECT `name`,`distribution`,`device`,`type`,`filename`,`folder` FROM `dp-app-ringtones` WHERE `active`='yes' ORDER BY `distribution` ASC, `device` ASC, `type` ASC, `name` ASC;";
	} else {
		$sql="SELECT `name`,`distribution`,`device`,`type`,`filename`,`folder` FROM `dp-app-ringtones` WHERE `distribution`='$setDevice' AND `active`='yes' ORDER BY `distribution` ASC, `device` ASC, `type` ASC, `name` ASC;";
	}
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$distribution="";
	$device="";
	$type="";
	?>
	<table class="ringtoneTable">
	<?php
	while($record=mysqli_fetch_object($result)) {
		if($distribution!=$record->distribution) {
			if($device!="" && $distribution!="" && $type!="") { ?>
				</p></td></tr>
			<?php } ?>
			<tr class="ringtoneTr"><td colspan=3 class="ringtoneTd"><h4 class="h4"><?php echo $record->distribution; ?> <?php echo $record->device; ?></h4></td></tr><tr class="ringtoneTr">
			<?php
			$distribution=$record->distribution;
			$device=$record->device; ?>
			<td class="ringtoneTd"><h5 class="h5"><?php echo $record->type; ?></h5>
			<?php $type=$record->type; ?>
			<p>
		<?php
		} else if($device!=$record->device) {
			if($device!="" && $distribution!="" && $type!="") { ?>
				</p></td></tr>
			<?php
			} ?>
			<tr class="ringtoneTr"><td colspan=3 class="ringtoneTd"><h4 class="h4"><?php echo $record->distribution; ?> <?php echo $record->device; ?></h4></td></tr><tr class="ringtoneTr">
			<?php $device=$record->device; ?>
			<td class="ringtoneTd"><h5 class="h5"><?php echo $record->type; ?></h5>
			<?php $type=$record->type; ?>
			<p>
		<?php
		} else if($type!=$record->type) {
			if($device!="" && $distribution!="" && $type!="") { ?>
				</p></td>
			<?php
			} ?>
			<td class="ringtoneTd"><h5 class="h5"><?php echo $record->type; ?></h5>
			<?php $type=$record->type; ?>
			<p>
		<?php
		}
		$ext=strstr($record->filename,'.',false);
		$filename=str_replace($ext,'',$record->filename);
		$ext=str_replace('.','',$ext);
		$setDevice=str_replace(' ','%20',$setDevice); ?>
		<a class="effect" href="ringtones.php?device=<?php echo $setDevice; ?>&amp;folder=<?php echo $record->folder; ?>&amp;name=<?php echo $filename; ?>&amp;ext=<?php echo $ext; ?>&amp;type=<?php echo $record->type; ?>"><?php echo $record->name; ?></a><br />
	<?php
	} ?>
	</p>
	</table>
	</article>
<?php
}
?>
<?php
function getMoreFrom() { ?>
	<article class="standard">
	<?php
	if(!isset($_GET['type']) || !isset($_GET['specific'])) { ?>
		<p>Not enough information to get content.</p>
		<?php
		$wallpaperOke = false;
	} else if(isset($_GET['type']) && isset($_GET['specific'])) {
		$type=$_GET['type'];
		$specific=$_GET['specific'];
		$type=strip_html_tags($type);
		$specific=strip_html_tags($specific);
		$specific20=str_replace(' ','%20',$specific);
		$specificClean=str_replace('%20',' ',$specific);
		if($type=="distribution" || $type=="device") {
			if($specific!="") {
				if($type=="distribution") {
					$sql="SELECT `name`,`resolution`,`folder`,`filename`,`amount`,`distribution` FROM `dp-app-wallpapers` WHERE `distribution`='$specific' AND `active`='yes' ORDER BY `name` ASC;";
					$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
					$num_rows = mysqli_num_rows($result);
					if($num_rows>0) { ?>
						<header><h2 class="h2 cardTitle">Wallpapers: <?php echo $specificClean; ?></h2></header>
						<?php
						while($record=mysqli_fetch_object($result)) { ?>
							<p>Device: <a href="morefrom.php?type=device&amp;specific=<?php echo $record->filename; ?>" class="effect"><?php echo $record->name; ?></a><br />Resolution: <?php echo $record->resolution; ?></p>
							<?php
							for ($i = 1; $i <= $record->amount; $i++) {
								$folder="wp-".$record->folder;
								$folderThumb="thumbs-".$record->folder;
								$number=formatNumberLength($i,3);
								$filename=$record->filename."_".$number;
								$link="http://droidpapers.teusink.org/share.php?folder=" . $folder . "&amp;name=" . $filename;
								$thumb="http://droidpapers.teusink.org/app_content/wallpapers_small_thumbs/" . $folderThumb . "/t_" . $filename . ".jpg"; ?>
								<a href="<?php echo $link; ?>"><img alt="Thumb of <?php echo $filename.".jpg"; ?>" class="fitAllThumb" src="<?php echo $thumb; ?>" /></a>
							<?php
							}
						}
					} else { ?>
						<header><h2 class="h2 cardTitle">More from...</h2></header>
						<p>Distribution not found.</p>
					<?php
					}
				}
				if($type=="device") {
					$sql="SELECT `name`,`resolution`,`folder`,`filename`,`amount`,`distribution` FROM `dp-app-wallpapers` WHERE `active`='yes' AND `filename`='$specific' LIMIT 0,1;";
					$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
					$num_rows = mysqli_num_rows($result);
					if($num_rows>0) {
						$record=mysqli_fetch_object($result);
						$distribution=str_replace(' ','%20',$record->distribution); ?>
						<header><h2 class="h2 cardTitle">More from device: <?php echo $record->name; ?></h2></header>
						<p>Distribution: <a href="morefrom.php?type=distribution&amp;specific=<?php echo $distribution; ?>" class="effect"><?php echo $record->distribution; ?></a><br />Device: <?php echo $record->name; ?><br />Resolution: <?php echo $record->resolution; ?></p>
						<?php
						for ($i = 1; $i <= $record->amount; $i++) {
							$folder="wp-".$record->folder;
							$folderThumb="thumbs-".$record->folder;
							$number=formatNumberLength($i,3);
							$filename=$record->filename."_".$number;
							$link="http://droidpapers.teusink.org/share.php?folder=" . $folder . "&amp;name=" . $filename;
							$thumb="app_content/wallpapers_small_thumbs/" . $folderThumb . "/t_" . $filename . ".jpg"; ?>
							<a href="<?php echo $link; ?>"><img alt="Thumb of <?php echo $filename.".jpg"; ?>" class="fitAllThumb" src="<?php echo $thumb; ?>" /></a>
						<?php
						}
					} else { ?>
						<header><h2 class="h2 cardTitle">More from...</h2></header>
						<p>Device not found.</p>
					<?php
					}
				}
			} else { ?>
				<header><h2 class="h2 cardTitle">More from...</h2></header>
				<p>Unkown vendor or device.</p>
			<?php
			}
		} else { ?>
			<header><h2 class="h2 cardTitle">More from...</h2></header>
			<p>Incorrect type.</p>
		<?php
		}
	} ?>
	</article>
<?php
}
?>
<?php
function distros() {
	if(isset($_GET['content'])) {
		$content=$_GET['content'];
		$content=strip_html_tags($content);
	} else {
		$content="wallpapers";
	}
	if($content!="ringtones") {
		$sql="SELECT `logo`,`name` FROM `dp-app-distributions` WHERE `wallpapers`='yes' AND `active`='yes' ORDER BY `name` ASC;";
	} else {
		$sql="SELECT `logo`,`name` FROM `dp-app-distributions` WHERE `ringtones`='yes' AND `active`='yes' ORDER BY `name` ASC;";
	}
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	$i = 1;
	while($record=mysqli_fetch_object($result)) {
		$name=str_replace(' ','%20',$record->name);
		$logo=str_replace('.png','.jpg',$record->logo); ?>
		<article class="card">
			<div class="card-image">
		<?php if($content!="ringtones") { ?>
			<a href="morefrom.php?type=distribution&amp;specific=<?php echo $name; ?>">
		<?php } else { ?>
			<a href="ringtones.php?device=<?php echo $record->name; ?>">
		<?php } ?>
			<img alt="card_wallpapers" src="app_content/logos/<?php echo $logo; ?>" />
			<h2><?php echo $record->name; ?></h2></a></div>
		</article>
	<?php
	}
}
?>
<?php
function reviews() { ?>
	<article class="standard"><header><h2 class="h2 cardTitle">Reviews</h2></header>
	<?php
	$sql="SELECT `name`,`url`,`language` FROM `dp-reviews` ORDER BY `name`;";
	$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
	while($record=mysqli_fetch_object($result)) { ?>
		<p><a href="<?php echo $record->url; ?>" class="effect"><?php echo $record->name; ?></a> - <?php echo $record->language?></p>
	<?php
	} ?>
	</article>
<?php
}
?>
<?php
function insertAudioPlayer() { ?>
	<article class="standard">
		<header><h2 class="h2 cardTitle">Audio player</h2></header>
		<?php
		if(!isset($_GET['folder']) || !isset($_GET['name']) || !isset($_GET['type']) || !isset($_GET['ext'])) { ?>
			<p>No ringtone specified.</p>
			<?php
			$ringtoneOke = false;
		} else if(isset($_GET['folder']) && isset($_GET['name']) && isset($_GET['type']) && isset($_GET['ext'])) {
			if(isset($_GET['device'])) {
				$device=$_GET['device'];
				$device=strip_html_tags($device);
			} else {
				$device="";
			}
			$folder=$_GET['folder'];
			$name=$_GET['name'];
			$ext=$_GET['ext'];
			$type=$_GET['type'];
			$folder=strip_html_tags($folder);
			$name=strip_html_tags($name);
			$ext=strip_html_tags($ext);
			$type=strip_html_tags($type);
			if($folder!="" && $name!="" && $type!="" && $ext!="") {
				$ringtone="http://droidpapers.teusink.org/app_content/ringtones/".$folder."/".$type."s/".$name.".".$ext;
				$ringtoneLocal=str_replace('http://droidpapers.teusink.org/','',$ringtone);
				if (file_exists($ringtoneLocal)) {
					$ringtoneOke = true;
					if ($device=="" or $device=="all") {
						$sql="SELECT `distribution`,`device`,`name`,`type` FROM `dp-app-ringtones` WHERE `filename`='$name.$ext' AND `active`='yes' LIMIT 0,1;";
					} else {
						$sql="SELECT `distribution`,`device`,`name`,`type` FROM `dp-app-ringtones` WHERE `filename`='$name.$ext' AND `active`='yes' AND `distribution`='$device' LIMIT 0,1;";
					}
					$result=mysqli_query($GLOBALS['database'], $sql) or die(mysqli_error());
					$num_rows = mysqli_num_rows($result);
					if($num_rows>0) {
						$record=mysqli_fetch_object($result); ?>
						<h4 class="h4"><?php echo $record->distribution; ?> <?php echo $record->device; ?> - <?php echo $record->name; ?> (<?php echo $record->type; ?>)</h4>
						<audio controls>
						<?php
						if($ext=="ogg") { ?>
							<source src="<?php echo $ringtoneLocal; ?>" type="audio/ogg">
						<?php
						} else if ($ext=="mp3") { ?>
							<source src="<?php echo $ringtoneLocal; ?>" type="audio/mpeg">
						<?php
						} else if ($ext=="wav") { ?>
							<source src="<?php echo $ringtoneLocal; ?>" type="audio/wav">
						<?php
						} else { ?>
							<source src="<?php echo $ringtoneLocal; ?>">
						<?php
						} ?>
						Your browser does not support the audio element.
						</audio>
						<?php
						// count ringtone sets
						$sql4="SELECT `id` FROM `dp-app-contentset` WHERE `ringtone`='$ringtone';";
						$result4=mysqli_query($GLOBALS['database'], $sql4) or die(mysqli_error());
						$num_rows4 = mysqli_num_rows($result4); ?>
						<p>Total times set as default from within the app: <?php echo $num_rows4; ?></p>
					<?php
					} else { ?>
						<p>Ringtone is not set active.</p>
					<?php
					}
				} else if($folder=="" || $name=="") { ?>
					<p>No ringtone specified.</p>
					<?php
					$ringtoneOke = false;
				} else { ?>
					<p>Ringtone does not exists (anymore).</p>
					<?php
					$ringtoneOke = false;
				}
			} else { ?>
				<p>No ringtone specified.</p>
				<?php
				$ringtoneOke = false;
			}
		} else { ?>
			<p>No ringtone specified.</p>
			<?php
			$ringtoneOke = false;
		}
		?>
	</article>
<?php
}
?>
<?php
function droidpapersBanner() {
	?><article class="card force-width">
	<div class="card-content"><a href="http://teusink.blogspot.nl/2014/11/the-history-of-droidpapers.html">
		<p>DroidPapers will stop. Read more about it on my web-log here.</p></div>
		<div><h2 class="card-title">DroidPapers will stop!</h2></a></div>
	</article>
	
	<?php
	$sql1 = "SELECT `amount` FROM `dp-app-wallpapers` WHERE `active`='yes';";
	$result1 = mysqli_query($GLOBALS['database'], $sql1) or die(mysqli_error());
	$wallTotalCount = 0;
	while($record1 = mysqli_fetch_object($result1)) {
		$wallTotalCount = $wallTotalCount + $record1->amount;
	}
	$sql2 = "SELECT `filename`,COUNT(DISTINCT `filename`) AS `filecount` FROM `dp-app-ringtones` WHERE `active`='yes' GROUP BY `filename`;";
	$result2 = mysqli_query($GLOBALS['database'], $sql2) or die(mysqli_error());
	$ringTotalCount = 0;
	$ringTotalCount = mysqli_num_rows($result2);
	$sql3 = "SELECT `id` FROM `dp-app-contentset` WHERE `wallpaper`!='';";
	$result3 = mysqli_query($GLOBALS['database'], $sql3) or die(mysqli_error());
	$wallSetCount = 0;
	$wallSetCount = mysqli_num_rows($result3);
	$sql4 = "SELECT `id` FROM `dp-app-contentset` WHERE `ringtone`!='';";
	$result4 = mysqli_query($GLOBALS['database'], $sql4) or die(mysqli_error());
	$ringSetCount = 0;
	$ringSetCount = mysqli_num_rows($result4);
?>
	<article class="card force-width">
		<div class="card-image"><a href="about.php"><img class="force-fit" alt="DroidPapers Banner" src="images/web_function.png" />
		<h2>About</h2></div>
		<p>In DroidPapers there are <?php echo $wallTotalCount; ?> wallpapers and <?php echo $ringTotalCount; ?> unique ringtones available and people have set a total of <?php echo $wallSetCount; ?> wallpapers and <?php echo $ringSetCount; ?> ringtones on their devices.</p>
		<p>All wallpapers and ringtones are open source, free or are permitted to be hosted on DroidPapers. So you won't have to worry about any copyright issues.</p></a>
	</article>
<?php
}
?>
<?php
function googlePlusBadge() { ?>
	<article class="cleanCenter">
		<!-- Plaats deze tag waar je de widget wilt weergeven. -->
		<div class="g-community" data-width="355" data-href="https://plus.google.com/communities/110717643404858418197" data-showowners="true"></div>
	</article>
<?php
}
?>
<?php
function playstoreBanner() { ?>
	<article class="card force-width">
		<div class="card-content">
			<!-- <a href="https://play.google.com/store/apps/details?id=org.teusink.droidpapers"><img class="borderless appstore" alt="Get it on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png" /></a><br />
			<div class="g-plusone" data-annotation="inline" data-width="300" data-href="https://market.android.com/details?id=org.teusink.droidpapers"></div><br />
			<a href="http://www.amazon.com/gp/mas/dl/android?p=org.teusink.droidpapers"><img class="borderless appstore" alt="Get it on Amazon Appstore" src="images/amazon.png" /></a><br />
			<div class="g-plusone" data-annotation="inline" data-width="300" data-href="http://www.amazon.com/gp/mas/dl/android?p=org.teusink.droidpapers"></div><br /> -->
			To download the latest APK file, <a href="http://droidpapers.teusink.org/apk/DroidPapers2.apk" class="effect">click here</a>.<br />
			<div class="g-plusone" data-annotation="inline" data-width="300" data-href="http://droidpapers.teusink.org/apk/DroidPapers2.apk"></div>
		</div>
		<div><h2 class="card-title">Download DroidPapers</h2></div>
	</article>
	<article class="card force-width">
		<div class="card-content">
			<!-- <a href="https://play.google.com/store/apps/details?id=org.teusink.droidpapers.muzei"><img class="borderless appstore" alt="Get it on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png" /></a><br />
			<div class="g-plusone" data-annotation="inline" data-width="300" data-href="https://play.google.com/store/apps/details?id=org.teusink.droidpapers.muzei"></div><br /> -->
			To download the latest APK file, <a href="http://droidpapers.teusink.org/apk/DroidPapersMuzeiExtension.apk" class="effect">click here</a>.<br />
			<div class="g-plusone" data-annotation="inline" data-width="300" data-href="http://droidpapers.teusink.org/apk/DroidPapersMuzeiExtension.apk"></div>
		</div>
		<div><h2 class="card-title">Download DroidPapers Muzei Extension</h2></div>
	</article>
<?php
}
?>
<?php
function droidpapersTwitter() { ?>
	<article class="cleanCenter">
		<a class="twitter-timeline" href="https://twitter.com/search?q=DroidPapers" data-widget-id="294023343462551552">Tweets over "@DroidPapers"</a>
		<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
	</article>
<?php
}
?>