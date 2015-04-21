// JSLint, include this before tests
// var window, cordova, $, document, navigator, jQuery, device, gaPluginResultHandler, gaPluginErrorHandler, serviceUpdateChecker, serviceDynamicWallpaper, toast, onDeviceReady, adjustStyle, createDatabase, updateDatabase, onPause, onResume, pressBackButton, initSettings, setTimeout, togglePanel, onConfirmBackup, onConfirmRestore, checkConnection, getFavorites, showTopicContent, checkContentVersionIndex, releaseAudio, pauseAudio, Connection, showTopicContentOffline, Shake, storeWallpaper, storeVarsRingtone, cleanUriVars, checkOpenPanels, FastClick, onMenuKeyDown, onSearchKeyDown, searchWallpaper, searchRingtone, checkSettings, handleAndroidPreferences, emptyCallback, handlePreferredScreenSize, currentRingtone, appstoreCheck, appstore;

// global settings and language
window.dbName = 'DroidPapers';
window.dbVersion = '1.0';
window.dbSize = 5 * 1024 * 1024;
window.serviceURL = 'http://droidpapers.teusink.org/';
window.apiFile = 'api/dp.api.v4.php';
window.apiKey = '?key=69b92f8de7a1724820fdaca1ec545d9f&action=';
window.gaAccount = "UA-40108306-3";
window.androidPrefsLib = "DroidPapersPrefs";
window.amountOfTimesStarted = 30;
window.loadingAnimation = '<div class="loading"><div class="outer"></div><div class="inner"></div></div>';
window.chromeView = 40;
var gaPlugin = null,
	refreshIntervalId = null;
$.i18n.init({ getAsync: false, debug: true, fallbackLng: 'en' });

// device ready
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	window.deviceReady = true;
	FastClick.attach(document.body);
	adjustStyle();
	document.addEventListener("resume", onResume, false);
	document.addEventListener("pause", onPause, false);
	document.addEventListener("backbutton", pressBackButton, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	createDatabase();
	initSettings();
	// Google Analytics
	handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
		if (prefValue !== "off") {
			gaPlugin = window.plugins.gaPlugin;
			gaPlugin.init(gaPluginResultHandler, gaPluginErrorHandler, window.gaAccount, 10);
		}
	});
}

// event handler orientationchange
$(window).bind('orientationchange',
	function (event) {
		if (event.orientation) {
			var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
			if (currentId === 'wallpaperFullscreenImagePage' || currentId === 'wallpaperFullscreenImagePluginPage') {
				var pic_real_width,
					pic_real_height,
					page,
					imageRatio,
					screenRatio;
				if (currentId === 'wallpaperFullscreenImagePage') {
					page = "Image";
				} else if (currentId === 'wallpaperFullscreenImagePluginPage') {
					page = "ImagePlugin";
				}
				$("<img />")
					.attr("src", $("#wallpaper" + page + "FullScr").attr("src"))
					.load(function () {
						pic_real_width = this.width;
						pic_real_height = this.height;
						imageRatio = pic_real_width / pic_real_height;
						if (event.orientation === "portrait" && window.innerWidth > window.innerHeight) {
							screenRatio = window.innerHeight / window.innerWidth;
						} else if (event.orientation === "landscape" && window.innerWidth < window.innerHeight) {
							screenRatio = window.innerHeight / window.innerWidth;
						} else {
							screenRatio = window.innerWidth / window.innerHeight;
						}
						if (pic_real_width > pic_real_height) {
							if (imageRatio < screenRatio) {
								$('#wallpaper' + page + 'FullScr').removeClass("fillwidth");
								$('#wallpaper' + page + 'FullScr').addClass("fillheight");
							} else {
								$('#wallpaper' + page + 'FullScr').removeClass("fillheight");
								$('#wallpaper' + page + 'FullScr').addClass("fillwidth");
							}
						} else if (pic_real_width < pic_real_height) {
							if (imageRatio < screenRatio) {
								$('#wallpaper' + page + 'FullScr').removeClass("fillwidth");
								$('#wallpaper' + page + 'FullScr').addClass("fillheight");
							} else {
								$('#wallpaper' + page + 'FullScr').removeClass("fillheight");
								$('#wallpaper' + page + 'FullScr').addClass("fillwidth");
							}
						} else if (pic_real_width === pic_real_height) {
							if (imageRatio > screenRatio) {
								$('#wallpaper' + page + 'FullScr').removeClass("fillheight");
								$('#wallpaper' + page + 'FullScr').addClass("fillwidth");
							} else {
								$('#wallpaper' + page + 'FullScr').removeClass("fillwidth");
								$('#wallpaper' + page + 'FullScr').addClass("fillheight");
							}
						}
					});
			}
		}
	});

// callback function to track page with Google Analytics
function gaPluginEventsHandler(action, id, category, eventAction, eventLabel, eventValue) {
	if (window.gaPluginReady === true && window.deviceReady === true) {
		if (action === "trackPage") {
			gaPlugin.trackPage(gaPluginResultHandler, gaPluginErrorHandler, '/' + id, id);
		} else if (action === "event") {
			gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, category, eventAction, eventLabel, eventValue);
		}
	} else {
		window.setTimeout('gaPluginEventsHandler("' + action + '", "' + id + '", "' + category + '", "' + eventAction + '", "' + eventLabel + '", "' + eventValue + '");', 100);
	}
}

// GAPlugin success handler
function gaPluginResultHandler(result) {
	window.gaPluginReady = true;
	// console.info('gaPluginResultHandler: ' + result);
}

// GAPlugin error handler
function gaPluginErrorHandler(error) {
	window.gaPluginReady = false;
	console.error('gaPluginErrorHandler: ' + error);
}

// API error handler
function apiErrorHandler(content, error) {
	if (content !== "none") {
		content.empty().append('<p>' + $.t('apierror') + '</p>');
	}
	console.error('PhoneGap: getJSON API error: ' + error);
}

// database sql transaction error message
function errorHandlerSqlTransaction(error) {
	console.error('SQLite - Error code: ' + error.code + ' - Error message: ' + error.message);
	return true;
}

// get current date as string
function currentDate() {
	var today = new Date(),
		dd = today.getDate(),
		mm = today.getMonth() + 1,
		yyyy = today.getFullYear(),
		date = yyyy + "-" + mm + "-" + dd;
	return date;
}

// get current connection type
function checkConnection() {
	var networkState = navigator.connection.type,
		states = {};
	states[Connection.UNKNOWN] = 'Unknown';
	states[Connection.ETHERNET] = 'Ethernet';
	states[Connection.WIFI] = 'WiFi';
	states[Connection.CELL_2G] = '2G';
	states[Connection.CELL_3G] = '3G';
	states[Connection.CELL_4G] = '4G';
	states[Connection.NONE] = 'None';
	return states[networkState];
}

// adjust specific style to tablet or smartphone view
function adjustStyle() {
	handlePreferredScreenSize(function (screenValue) {
		if (screenValue === "xlarge" || screenValue === "large") {
			$("#sizeStylesheet").attr("href", "./themes/application.tablet.css");
		} else {
			$("#sizeStylesheet").attr("href", "./themes/application.smartphone.css");
		}
	});
}

// Open any anchor with http/https through javascript
$(document).on('click', 'a[href^=http], a[href^=https]', function (event) {
	event.preventDefault();
	var url = $(this);
	window.open(url.attr('href'), '_system');
});

// get Android version as 2 number integer
function getAndroidVersion() {
	var deviceVersion = device.version;
	if (deviceVersion === '' || deviceVersion === null) { deviceVersion = 23; }
	deviceVersion = deviceVersion.substring(0, 3);
	deviceVersion = deviceVersion.replace(".", "");
	deviceVersion = parseInt(deviceVersion, 10);
	return deviceVersion;
}

// initiate auto-backup
function initiateAutobackup() {
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoBackup", "", function (prefValue) {
		if (prefValue !== "on" && prefValue !== "off") {
			handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoBackup", "off", emptyCallback);
		} else if (prefValue === "on" && window.localStorage.getItem("settingFavoritesChanged") === "true") {
			if (window.localStorage.getItem("settingLastBackupDate") !== currentDate()) {
				onConfirmBackup(1);
			}
		}
	});
}

// count startups
function countStartups() {
	if (window.localStorage.getItem("amountTimesStarted") === null || window.localStorage.getItem("amountTimesStarted") === '') {
		window.localStorage.setItem('amountTimesStarted', '1');
	} else {
		var num = window.localStorage.getItem("amountTimesStarted");
		num = parseInt(num, 10);
		if (num < (window.amountOfTimesStarted + 1)) { num = num + 1; }
		if (num > window.amountOfTimesStarted) { num = 1; }
		window.localStorage.setItem('amountTimesStarted', num);
	}
}

// initialize settings
function initSettings() {
	if (window.localStorage.getItem("dismissPromotionRating") !== 'true' && window.localStorage.getItem("dismissPromotionRating") !== 'false') {
		window.localStorage.setItem('dismissPromotionRating', 'false');
	}
	if (window.localStorage.getItem("dismissMuzeiExtension") !== 'true' && window.localStorage.getItem("dismissMuzeiExtension") !== 'false') {
		window.localStorage.setItem('dismissMuzeiExtension', 'false');
	}
	if (window.localStorage.getItem("settingLastBackupDate") === null) {
		window.localStorage.setItem('settingLastBackupDate', '');
	}
	if (window.localStorage.getItem("settingFavoritesChanged") !== "true" && window.localStorage.getItem("settingFavoritesChanged") !== "false") {
		window.localStorage.setItem("settingFavoritesChanged", "false");
	}
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckContent", "", function (prefValue) {
		if (prefValue !== "on" && prefValue !== "off") {
			handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoCheckContent", "on", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckApp", "", function (prefValue) {
		if (prefValue !== "on" && prefValue !== "off") {
			handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoCheckApp", "on", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
		if (prefValue !== "on" && prefValue !== "off") {
			handleAndroidPreferences("set", window.androidPrefsLib, "settingGoogleAnalytics", "on", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "setWallColor", "", function (prefValue) {
		if (prefValue !== "original" && prefValue !== "grayscale" && prefValue !== "sepia") {
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallColor", "standard", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "setWallAspect", "", function (prefValue) {
		if (prefValue !== "autofill" && prefValue !== "autofit") {
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallAspect", "autofill", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "setDynamicWallColor", "", function (prefValue) {
		if (prefValue !== "original" && prefValue !== "grayscale" && prefValue !== "sepia") {
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallColor", "standard", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "setDynamicWallAspect", "", function (prefValue) {
		if (prefValue !== "autofill" && prefValue !== "autofit") {
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallAspect", "autofill", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "includePicturesFolder", "", function (prefValue) {
		if (prefValue !== "true" && prefValue !== "false") {
			handleAndroidPreferences("set", window.androidPrefsLib, "includePicturesFolder", "false", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "includeCameraFolder", "", function (prefValue) {
		if (prefValue !== "true" && prefValue !== "false") {
			handleAndroidPreferences("set", window.androidPrefsLib, "includeCameraFolder", "false", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "excludeDroidPapersFolder", "", function (prefValue) {
		if (prefValue !== "true" && prefValue !== "false") {
			handleAndroidPreferences("set", window.androidPrefsLib, "excludeDroidPapersFolder", "false", emptyCallback);
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingDynamicWallpaper", "", function (prefValue) {
		if (prefValue !== "on" && prefValue !== "off") {
			handleAndroidPreferences("set", window.androidPrefsLib, "settingDynamicWallpaper", "off", emptyCallback);
		}
	});
	if (window.localStorage.getItem("wallFilterSD") !== 'sd' && window.localStorage.getItem("wallFilterSD") !== 'false') {
		window.localStorage.setItem('wallFilterSD', 'sd');
	}
	if (window.localStorage.getItem("wallFilterHD") !== 'hd' && window.localStorage.getItem("wallFilterHD") !== 'false') {
		window.localStorage.setItem('wallFilterHD', 'hd');
	}
	if (window.localStorage.getItem("wallFilterHD2") !== 'hd2' && window.localStorage.getItem("wallFilterHD2") !== 'false') {
		window.localStorage.setItem('wallFilterHD2', 'hd2');
	}
	if (window.localStorage.getItem("wallFilterHD3") !== 'hd3' && window.localStorage.getItem("wallFilterHD3") !== 'false') {
		window.localStorage.setItem('wallFilterHD3', 'hd3');
	}
}

// callback function to check if device is ready
function isDeviceReady(value, action) {
	if (window.deviceReady === true) {
		switch (action) {
		case "InitApp":
			if (window.localStorage.getItem("appInitiated") !== 'true') {
				createDatabase();
				initSettings();
				window.localStorage.setItem('appInitiated', 'true');
			}
			startPreLoadImages();
			serviceDynamicWallpaper("getStatus", "none");
			serviceUpdateChecker("getStatus", "none");
			countStartups();
			initiateAutobackup();
			break;
		case "InitPlugin":
			$("body").pagecontainer("change", "#pluginPage");
			break;
		case "InitUri":
			var wallFolder,
				wallName,
				ringDevice,
				ringFolder,
				ringName,
				ringExt,
				ringType;
			handleAndroidPreferences("get", window.androidPrefsLib, "UriWallFolder", "", function (prefValue) {
				wallFolder = prefValue;
				handleAndroidPreferences("get", window.androidPrefsLib, "UriWallName", "", function (prefValue) {
					wallName = prefValue;
					handleAndroidPreferences("get", window.androidPrefsLib, "UriRingDevice", "", function (prefValue) {
						ringDevice = prefValue;
						handleAndroidPreferences("get", window.androidPrefsLib, "UriRingFolder", "", function (prefValue) {
							ringFolder = prefValue;
							handleAndroidPreferences("get", window.androidPrefsLib, "UriRingName", "", function (prefValue) {
								ringName = prefValue;
								handleAndroidPreferences("get", window.androidPrefsLib, "UriRingExt", "", function (prefValue) {
									ringExt = prefValue;
									handleAndroidPreferences("get", window.androidPrefsLib, "UriRingType", "", function (prefValue) {
										ringType = prefValue;
										if (wallFolder !== "" && wallName !== "") {
											cleanUriVars();
											window.localStorage.setItem("uriView", 'true');
											storeWallpaper(wallFolder.replace("wp-", "") + "/", wallName + "_mini.jpg", 1, 1, "normal");
										} else if (ringDevice !== "" && ringFolder !== "" && ringName !== "" && ringExt !== "" && ringType !== "") {
											cleanUriVars();
											window.localStorage.setItem("uriView", 'true');
											var url = "http://droidpapers.teusink.org/app_content/ringtones/" + ringFolder + "/" + ringType + "s/" + ringName + "." + ringExt;
											storeVarsRingtone(url, ringName + "." + ringExt, ringType, ringFolder);
											$("body").pagecontainer("change", "#uriRingtonePage");
										} else {
											window.localStorage.setItem("uriView", 'false');
											$("body").pagecontainer("change", "#indexPage");
										}
									});
								});
							});
						});
					});
				});
			});
			break;
		default:
			// do nothing
		}
	} else {
		window.setTimeout("isDeviceReady(\"" + value + "\", \"" + action + "\");", 100);
	}
}

// clean URI preferences variables
function cleanUriVars() {
	handleAndroidPreferences("set", window.androidPrefsLib, "UriWallFolder", "", emptyCallback);
	handleAndroidPreferences("set", window.androidPrefsLib, "UriWallName", "", emptyCallback);
	handleAndroidPreferences("set", window.androidPrefsLib, "UriRingDevice", "", emptyCallback);
	handleAndroidPreferences("set", window.androidPrefsLib, "UriRingFolder", "", emptyCallback);
	handleAndroidPreferences("set", window.androidPrefsLib, "UriRingName", "", emptyCallback);
	handleAndroidPreferences("set", window.androidPrefsLib, "UriRingExt", "", emptyCallback);
	handleAndroidPreferences("set", window.androidPrefsLib, "UriRingType", "", emptyCallback);
}

// override default back button handling
function pressBackButton() {
	var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	if (window.localStorage.getItem("uriView") === 'true') {
		window.localStorage.setItem("uriView", 'false');
		navigator.app.exitApp();
	} else if (currentId === 'pluginPage' || currentId === 'wallpaperFullscreenImagePluginPage') {
		if (currentId === 'pluginPage') {
			handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
				if (prefValue !== "off") {
					gaPlugin.exit(gaPluginResultHandler, gaPluginErrorHandler);
				}
			});
			navigator.app.exitApp();
		} else {
			window.history.back();
		}
	} else if (checkOpenPanels() === false) {
		if (currentId === 'indexPage') {
			releaseAudio();
			currentRingtone(window.localStorage.getItem("ringtoneType"), "stop", emptyCallback);
			handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
				if (prefValue !== "off") {
					gaPlugin.exit(gaPluginResultHandler, gaPluginErrorHandler);
				}
			});
			navigator.app.exitApp();
		} else if (currentId === 'syncPage' && $("#startSyncButton").is(":disabled")) {
			toast('Please wait until the sync has finished', 'short');
		} else {
			window.history.back();
		}
	} else if (window.localStorage.getItem('panelLeft') === 'open' || window.localStorage.getItem('panelRight') === 'open' || window.localStorage.getItem('panelWall') === 'open' || window.localStorage.getItem('panelRing') === 'open' || window.localStorage.getItem('panelFilter') === 'open') {
		if (window.localStorage.getItem('panelLeft') === 'open') {
			$('#panelMenu' + window.localStorage.getItem("divIdGlobal")).panel("close");
		} else if (window.localStorage.getItem('panelRight') === 'open') {
			$('#panelMenuRight' + window.localStorage.getItem("divIdGlobal")).panel("close");
		} else if (window.localStorage.getItem('panelWall') === 'open') {
			$('#panelMenuWall' + window.localStorage.getItem("divIdGlobal")).panel("close");
		} else if (window.localStorage.getItem('panelRing') === 'open') {
			$('#panelMenuRing' + window.localStorage.getItem("divIdGlobal")).panel("close");
		} else if (window.localStorage.getItem('panelFilter') === 'open') {
			$('#panelMenuFilter' + window.localStorage.getItem("divIdGlobal")).panel("close");
		}
	}
}

// menu button
function onMenuKeyDown() {
    togglePanel('#panelMenuRight' + window.localStorage.getItem("divIdGlobal"));
}

// search button
function onSearchKeyDown() {
    var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	if (currentId === 'searchWallpapers' || currentId === 'distributionsWallsPage' || currentId === 'overviewWallsPage') {
		searchWallpaper();
	} else if (currentId === 'searchRingtones' || currentId === 'distributionsRingsPage' || currentId === 'overviewRingsPage') {
		searchRingtone();
	} else {
		togglePanel('#panelMenu' + window.localStorage.getItem("divIdGlobal"));
	}
}

// image preloader
jQuery.preloadImages = function () {
	var i;
	for (i = 0; i < arguments.length; i = i + 1) {
		jQuery("<img>").attr("src", arguments[i]);
	}
};

// actually preload images
function startPreLoadImages() {
	$.preloadImages(
		"./images/jqm-icons/expander_close_holo_light.9.png",
		"./images/jqm-icons/expander_open_holo_light.9.png",
		"./images/jqm-icons/ic_action_playback_pause.png",
		"./images/jqm-icons/ic_action_playback_play.png",
		"./images/jqm-icons/ic_action_playback_stop.png",
		"./images/icons/ic_action_android.png",
		"./images/icons/ic_action_arrow_left_footer.png",
		"./images/icons/ic_action_arrow_right_footer.png",
		"./images/icons/ic_action_arrow_right_green.png",
		"./images/icons/ic_action_book.png",
		"./images/icons/ic_action_circles.png",
		"./images/icons/ic_action_crop.png",
		"./images/icons/ic_action_download.png",
		"./images/icons/ic_action_download_footer.png",
		"./images/icons/ic_action_filter_header.png",
		"./images/icons/ic_action_globe.png",
		"./images/icons/ic_action_google_play.png",
		"./images/icons/ic_action_gplus.png",
		"./images/icons/ic_action_help.png",
		"./images/icons/ic_action_home.png",
		"./images/icons/ic_action_info.png",
		"./images/icons/ic_action_linkedin.png",
		"./images/icons/ic_action_list_header.png",
		"./images/icons/ic_action_mail.png",
		"./images/icons/ic_action_music_1.png",
		"./images/icons/ic_action_overflow_header.png",
		"./images/icons/ic_action_picture.png",
		"./images/icons/ic_action_picture_footer.png",
		"./images/icons/ic_action_playback_repeat.png",
		"./images/icons/ic_action_reload.png",
		"./images/icons/ic_action_reload_header.png",
		"./images/icons/ic_action_search_header.png",
		"./images/icons/ic_action_settings.png",
		"./images/icons/ic_action_share.png",
		"./images/icons/ic_action_share_header.png",
		"./images/icons/ic_action_star_0.png",
		"./images/icons/ic_action_star_0_footer.png",
		"./images/icons/ic_action_star_5.png",
		"./images/icons/ic_action_star_10.png",
		"./images/icons/ic_action_star_10_footer.png",
		"./images/icons/ic_action_sync.png",
		"./images/icons/ic_action_tick.png",
		"./images/icons/ic_action_trash.png",
		"./images/icons/ic_action_twitter.png",
		"./images/icons/ic_launcher_full_arrow.png",
		"./images/icons/ic_launcher_full_menu.png",
		"./images/icons/ic_launcher_full_menu_opened.png",
		"./images/icons/ic_launcher_full_noarrow.png",
		"./images/icons/ic_launcher_small_arrow.png",
		"./images/cards/card_alarms.jpg",
		"./images/cards/card_notifications.jpg",
		"./images/cards/card_ringtones.jpg",
		"./images/cards/card_wallpapers.jpg",
		"./images/cards/icon_achievement.png",
		"./images/cards/icon_gear.png",
		"./images/cards/icon_reload.png",
		"./images/cards/icon_star.png"
	);
}

// pause app
function onPause() {
	pauseAudio();
	currentRingtone(window.localStorage.getItem("ringtoneType"), "stop", emptyCallback);
}

// resume app
function onResume() {
	// do nothing
}

// database version handler
function dbVersionHandler(currentVersion, versionBack) {
	return (parseInt(currentVersion, 10) - versionBack).toString();
}

// create database
function createDatabase() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	db.transaction(
		function (transaction) {
			transaction.executeSql('CREATE TABLE IF NOT EXISTS entries (file TEXT NOT NULL, folder TEXT NOT NULL)');
			transaction.executeSql('CREATE TABLE IF NOT EXISTS entriesRings (url TEXT NOT NULL, name TEXT NOT NULL, type TEXT NOT NULL)');
			transaction.executeSql('CREATE TABLE IF NOT EXISTS dpAppDistributions (logo TEXT NOT NULL, name TEXT NOT NULL, wallpapers TEXT NOT NULL, wallpaperstext TEXT, ringtones TEXT NOT NULL, ringtonestext TEXT, type TEXT NOT NULL, os TEXT NOT NULL)');
			transaction.executeSql('CREATE TABLE IF NOT EXISTS dpAppWallpapers (name TEXT NOT NULL, resolution TEXT NOT NULL, folder TEXT NOT NULL, filename TEXT NOT NULL, amount INTEGER NOT NULL, distribution TEXT NOT NULL, version TEXT NOT NULL, density TEXT NOT NULL)');
			transaction.executeSql('CREATE TABLE IF NOT EXISTS dpAppRingtones (folder TEXT NOT NULL, filename TEXT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, distribution TEXT NOT NULL, device TEXT NOT NULL, version TEXT NOT NULL)');
			transaction.executeSql('CREATE TABLE IF NOT EXISTS dpAppWallpapersNotes (wallpaper TEXT NOT NULL, note TEXT NOT NULL)');
		},
		errorHandlerSqlTransaction
	);
}