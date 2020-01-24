// JSLint, include this before tests
// var window, $, document, navigator, cordova, device, jQuery, gaPlugin, gaPluginEventsHandler, gaPluginResultHandler, gaPluginErrorHandler, getPackageVersion, handlePreferredScreenSize, serviceDynamicWallpaper, toast, serviceUpdateChecker, syncLocalDistros, syncLocalWalls, syncLocalRings, checkSyncFinished, deleteCachedFile, onConfirmCacheDelete, deleteEntireCache, onConfirmBackup, currentDate, backupFavoritesWalls, backupFavoritesRings, LocalFileSystem, failFileBackup, failFileRestoreWall, failFileRestoreRing, checkBackupFinished, checkRestoreFinished, errorHandlerSqlTransaction, onConfirmRestore, restoreFavoritesWalls, restoreFavoritesRings, startRestoreFavoritesRings, FileReader, startRestoreFavoritesWalls, amountWalls, amountRings, htmlClickEventHandlers, isDeviceReady, addPromotionButtons, wallpaperImage, placeFavoriteStar, wallpaperActionButtons, getWallSpecs, getOverviewDistributionsWalls, getOverviewDistributionsRings, getOverviewWalls, getOverviewRings, setOverviewRingsTitle, getFavorites, getFavoritesRings, totalWallCounter, totalRingCounter, togglePanel, share, navigateWallRight, navigateWallLeft, downloadWallpaper, appstore, placeFavoriteStarRings, playAudio, releaseAudio, setTimeout, getRingSpecs, hideNonContextButtons, panelMenuLeftOpened, showNonContextButtons, panelMenuLeftClosed, clearRingSpecs, shake, handleAndroidPreferences, handleAndroidPreferencesCB, checkWallpaperSettings, compareAppVersion, ringtonePlayer, wallpaperImageFullScr, togglePrevNextWallButtons, addRingtoneUriButton, emptyCallback, setOverviewWallsTitle, checkSettings, getOverviewSearchedRings, searchRingtone, getOverviewSearchedWalls, searchWallpaper, syncLocalWallNotes, getWallNote, fillCheckboxesWallFilter, clickCheckBoxesWallFilter, currentRingtone, appstoreCheck, checkConnection, homePageTopics, showTopicTitle, showTopicContent, getAndroidVersion, checkDynamicWallpaperSettings, muzeiExtension, screen, onConfirmDownloadedDelete, deleteDownloadedFolder, homePageCards, initSettingsSwitch, initDynamicWallpaperSwitch, initServiceSettingsSwitch, apiErrorHandler;

// left panelmenu
function panelMenu(divId) {
	var panel = $('#panelMenu' + divId + 'UL'),
		// home = $.t('home'),
		searchwallpapers = $.t('searchwallpapers'),
		searchringtones = $.t('searchringtones'),
		dynamicwallpaper = $.t('dynamicwallpaper');
	panel.children().remove('li');
	panel.append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	// panel.append('<li data-icon="false"><a class="panelText" href="#indexPage"><img alt="home" src="./images/icons/ic_action_home.png" class="ui-li-icon largerIcon" />' + home + '</a></li>'); // KEEP: kinda useless with only one page with panel menu left...
	panel.append('<li data-icon="false"><a class="panelText" id="searchWallpapers' + divId + '"><img alt="rings" src="./images/icons/ic_action_search_header.png" class="ui-li-icon largerIcon" />' + searchwallpapers + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" id="searchRingtones' + divId + '"><img alt="rings" src="./images/icons/ic_action_search_header.png" class="ui-li-icon largerIcon" />' + searchringtones + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" href="#dynamicWallpaperPage"><img alt="dynamicwallpaper" src="./images/icons/ic_action_playback_repeat.png" class="ui-li-icon largerIcon" />' + dynamicwallpaper + '</a></li>');
	appstoreCheck(function (value) {
		if (value === "google") {
			panel.append('<li data-icon="false"><a class="panelText" id="muzeiExtension' + divId + '"><img alt="muzei" src="./images/icons/ic_action_playback_repeat.png" class="ui-li-icon largerIcon" />Muzei Extension</a></li>');
			panel.listview('refresh');
			$("#muzeiExtension" + divId).off("click").on("click",
				function () {
					muzeiExtension();
				});
		}
	});
	panel.listview('refresh');
	$("#searchWallpapers" + divId).off("click").on("click",
		function () {
			searchWallpaper();
		});
	$("#searchRingtones" + divId).off("click").on("click",
		function () {
			searchRingtone();
		});
}

// right panelmenu
function panelMenuRight(divId) {
	var panel = $('#panelMenuRight' + divId + 'UL'),
		about = $.t('about'),
		support = $.t('support'),
		checkcontentupdates = $.t('checkcontentupdates'),
		settings = $.t('settings'),
		sharethisapp = $.t('sharethisapp'),
		ratethisapp = $.t('ratethisapp');
	panel.children().remove('li');
	panel.append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	panel.append('<li data-icon="false"><a class="panelText" href="#aboutPage"><img alt="about" src="./images/icons/ic_action_info.png" class="ui-li-icon largerIcon" />' + about + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" href="#supportPage"><img alt="support" src="./images/icons/ic_action_help.png" class="ui-li-icon largerIcon" />' + support + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" href="#syncPage"><img alt="sync" src="./images/icons/ic_action_sync.png" class="ui-li-icon largerIcon" />' + checkcontentupdates + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" href="#settingsPage"><img alt="settings" src="./images/icons/ic_action_settings.png" class="ui-li-icon largerIcon" />' + settings + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" id="shareAppFromPanel' + divId + '"><img alt="share" src="./images/icons/ic_action_share.png" class="ui-li-icon largerIcon" />' + sharethisapp + '</a></li>');
	panel.append('<li data-icon="false"><a class="panelText" id="rateAppFromPanel' + divId + '"><img alt="rate" src="./images/icons/ic_action_star_5.png" class="ui-li-icon largerIcon" />' + ratethisapp + '</a></li>');
	panel.listview('refresh');
	$("#shareAppFromPanel" + divId).off("click").on("click",
		function () {
			appstoreCheck(function (value) {
				if (value === "unknown") {
					share('DroidPapers', '#DroidPapers http://droidpapers.teusink.org/about.php');
				} else if (value === "amazon") {
					share('DroidPapers', '#DroidPapers http://www.amazon.com/gp/mas/dl/android?p=org.teusink.droidpapers');
				} else if (value === "google") {
					share('DroidPapers', '#DroidPapers https://play.google.com/store/apps/details?id=org.teusink.droidpapers');
				}
			});
		});
	$("#rateAppFromPanel" + divId).off("click").on("click",
		function () {
			appstore("org.teusink.droidpapers", "app");
		});
}

// panel open and closed handling
function panelHandling() {
	var currentId = window.localStorage.getItem("divIdGlobal");
	$("#panelMenu" + currentId).panel({
		open: function () {
			window.localStorage.setItem("panelLeft", 'open');
			hideNonContextButtons('panel');
			panelMenuLeftOpened();
		}
	});
	$("#panelMenu" + currentId).panel({
		close: function () {
			window.localStorage.setItem("panelLeft", 'closed');
			showNonContextButtons('panel');
			panelMenuLeftClosed();
		}
	});
	$("#panelMenu" + currentId + "UL").on("click", "li", function () {
		$('#panelMenu' + currentId).panel("close");
	});
	$("#panelMenuRight" + currentId).panel({
		open: function () {
			window.localStorage.setItem("panelRight", 'open');
			hideNonContextButtons('panel');
		}
	});
	$("#panelMenuRight" + currentId).panel({
		close: function () {
			window.localStorage.setItem("panelRight", 'closed');
			showNonContextButtons('panel');
		}
	});
	$("#panelMenuRight" + currentId + "UL").on("click", "li", function () {
		$('#panelMenuRight' + currentId).panel("close");
	});
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'wallpaperFullscreenImagePage') {
		$("#panelMenuWall" + currentId).panel({
			open: function () {
				window.localStorage.setItem("panelWall", 'open');
				hideNonContextButtons('wallpaper');
			}
		});
		$("#panelMenuWall" + currentId).panel({
			close: function () {
				window.localStorage.setItem("panelWall", 'closed');
				showNonContextButtons('wallpaper');
			}
		});
		$("#actionList" + currentId).on("click", "li", function () {
			$('#panelMenuWall' + currentId).panel("close");
		});
	}
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'overviewWallsPage') {
		$("#panelMenuFilter" + currentId).panel({
			open: function () {
				window.localStorage.setItem("panelFilter", 'open');
				hideNonContextButtons('filter');
			}
		});
		$("#panelMenuFilter" + currentId).panel({
			close: function () {
				window.localStorage.setItem("panelFilter", 'closed');
				showNonContextButtons('filter');
			}
		});
	}
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'uriRingtonePage' || $.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'searchRingtones' || $.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'topicPage' || $.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'rtFavoritesPage' || $.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'overviewRingsPage') {
		$("#panelMenuRing" + currentId).panel({
			open: function () {
				window.localStorage.setItem("panelRing", 'open');
				getRingSpecs();
				placeFavoriteStarRings(window.localStorage.getItem("ringtoneUrl"), window.localStorage.getItem("ringtoneName"), window.localStorage.getItem("ringtoneType"));
				playAudio();
				hideNonContextButtons('ringtone');
			}
		});
		$("#panelMenuRing" + currentId).panel({
			close: function () {
				window.localStorage.setItem("panelRing", 'closed');
				clearRingSpecs();
				releaseAudio();
				currentRingtone(window.localStorage.getItem("ringtoneType"), "stop", emptyCallback);
				showNonContextButtons('ringtone');
			}
		});
	}
}

// hide non-contextual buttons when panel opens
function hideNonContextButtons(type) {
	var currentId = window.localStorage.getItem("divIdGlobal"),
		headerShare = $('#headerShare' + currentId),
		headerRefresh = $('#headerRefresh' + currentId),
		headerWallMenu = $('#headerWallMenu' + currentId);
	if (headerShare.length > 0) {
		headerShare.hide();
	}
	if (headerRefresh.length > 0) {
		headerRefresh.hide();
	}
	if (headerWallMenu.length > 0 && type !== "wallpaper") {
		headerWallMenu.hide();
	}
}

// show non-contextual buttons when panel closes
function showNonContextButtons(type) {
	var currentId = window.localStorage.getItem("divIdGlobal"),
		headerShare = $('#headerShare' + currentId),
		headerRefresh = $('#headerRefresh' + currentId),
		headerWallMenu = $('#headerWallMenu' + currentId);
	if (headerShare.length > 0) {
		headerShare.show();
	}
	if (headerRefresh.length > 0) {
		headerRefresh.show();
	}
	if (headerWallMenu.length > 0 && type !== "wallpaper") {
		headerWallMenu.show();
	}
}

// show title icon with the dashes more to the left
function panelMenuLeftOpened() {
	if (window.localStorage.getItem("pageNaveType") === "menu") {
		$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "./images/icons/ic_launcher_full_menu_opened.png");
	}
}

// show title icon with the dashes more to the right
function panelMenuLeftClosed() {
	if (window.localStorage.getItem("pageNaveType") === "menu") {
		$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "./images/icons/ic_launcher_full_menu.png");
	}
}

// reset panel states
function resetPanelState() {
	window.localStorage.setItem('panelLeft', 'closed');
	window.localStorage.setItem('panelRight', 'closed');
	window.localStorage.setItem('panelWall', 'closed');
	window.localStorage.setItem('panelRing', 'closed');
	window.localStorage.setItem('panelFilter', 'closed');
}

// check if there is a panel open or not
function checkOpenPanels() {
	if (window.localStorage.getItem('panelLeft') === "closed" && window.localStorage.getItem('panelRight') === "closed" && window.localStorage.getItem('panelWall') === "closed" && window.localStorage.getItem('panelRing') === "closed" && window.localStorage.getItem('panelFilter') === "closed") {
		return false;
	}
	return true;
}

// toggle panel menu (open/close)
function togglePanel(panel) {
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'syncPage' && $("#startSyncButton").is(":disabled")) {
		var waitforupdate = $.t('waitforupdate');
		toast(waitforupdate, 'short');
	} else {
		$(panel).panel("toggle");
	}
}

// press effect in header bar
function pressEffectHeader(filter, share, refresh, action) {
	var currentId = window.localStorage.getItem("divIdGlobal");
	window.localStorage.setItem("pageNaveType", action);
	// restore icons
	if (action === "menu") {
		$("#headerTitle" + currentId).attr("src", "./images/icons/ic_launcher_full_menu.png");
	}
	showNonContextButtons();
	// header press effect
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id !== 'pluginPage') {
		$("#headerTitle" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerTitle" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerTitle" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerOverflow" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerOverflow" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerOverflow" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'wallpaperFullscreenImagePage') {
		$("#headerWallMenu" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerWallMenu" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerWallMenu" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// filter press effect
	if (filter === true) {
		$("#headerFilter" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerFilter" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerFilter" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// share press effect
	if (share === true) {
		$("#headerShare" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerShare" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerShare" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// refresh press effect
	if (refresh === true) {
		$("#headerRefresh" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerRefresh" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerRefresh" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// search press effect
	if (($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'distributionsRingsPage') || $.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'searchRingtones' || ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'distributionsWallsPage') || $.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'searchWallpapers') {
		$("#headerSearch" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerSearch" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#headerSearch" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
}

// press effect in footer bar
function pressEffectFooter(set1, set2, prev, next) {
	var currentId = window.localStorage.getItem("divIdGlobal");
	// set wallpaper 1 press effect
	if (set1 === true) {
		$("#setWallpaper1" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#setWallpaper1" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#setWallpaper1" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// set wallpaper 2 press effect
	if (set2 === true) {
		$("#setWallpaper2" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#setWallpaper2" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#setWallpaper2" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// previous wallpaper press effect
	if (prev === true) {
		$("#prevWall" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#prevWall" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#prevWall" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// next wallpaper press effect
	if (next === true) {
		$("#nextWall" + currentId).off('touchstart').on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#nextWall" + currentId).off('touchend').on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
		$("#nextWall" + currentId).off('touchmove').on('touchmove', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
}

// system specs
function getSystemSpecs() {
	var devicemodel = $.t('devicemodel'),
		deviceplatform = $.t('deviceplatform'),
		version = $.t('version'),
		tag =	devicemodel + ': ' + device.model + '<br />' +
				deviceplatform + ': ' + device.platform + ' ' + device.version + '<br />' +
				'PhoneGap ' + version + ': ' + cordova.version + '<br />' +
				'jQuery ' + version + ': ' + jQuery.fn.jquery + '<br />' +
				'jQuery Mobile ' + version + ': ' + $.mobile.version;
	$('#systemSpecs').empty().append(tag);
}

function getAllCounters() {
	var connection = checkConnection(),
		counters,
		topwallpapersset = $.t('topwallpapersset'),
		topringtonesset = $.t('topringtonesset'),
		totalwallpapers = $.t('totalwallpapers'),
		totalringtones = $.t('totalringtones');
	if (connection !== "None") {
		$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'getallcounters', function (data) {
			counters = data.items;
			$.each(counters, function (index, counter) {
				$('#totalTopWallCounter').empty().append(topwallpapersset + ': ' + counter.topwalls);
				$('#totalTopRingCounter').empty().append(topringtonesset + ': ' + counter.toprings);
				$('#amountWalls').empty().append(totalwallpapers + ': ' + counter.amountwalls);
				$('#amountRings').empty().append(totalringtones + ': ' + counter.amountrings);
			});
		}).fail(function () {
			$('#totalTopRingCounter').empty();
			$('#amountWalls').empty();
			$('#amountRings').empty();
			apiErrorHandler($('#totalTopWallCounter'), "getallcounters");
		});
	}
}

// inject Package version
function injectPackageVersion() {
	var tag = "",
		currentappversion = $.t('currentappversion'),
		currentcontentversion = $.t('currentcontentversion');
	getPackageVersion(function (versionValue) {
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (contentValue) {
			if (versionValue !== "") {
				tag = tag + currentappversion + ': ' + versionValue + '<br />';
			}
			if (contentValue !== "") {
				tag = tag + currentcontentversion + ': ' + contentValue;
			}
			$('#currentPackageVersion').empty().append(tag);
		});
	});
}

// display promote buttons
function addPromotionButtons() {
	var num = window.localStorage.getItem("amountTimesStarted"),
		requestRating = $('#requestRating'),
		muzeiExtension = $('#muzeiExtension'),
		pleaseratethisapp = $.t('pleaseratethisapp'),
		checkmuzeiextension = $.t('checkmuzeiextension'),
		neveraskagain = $.t('neveraskagain');
	num = parseInt(num, 10);
	if (window.localStorage.getItem("dismissMuzeiExtension") === 'false' && num > 1) {
		muzeiExtension.empty().append('<div data-role="controlgroup"><a id="requestMuzeiButton" class="ui-btn">' + checkmuzeiextension + '</a><a id="requestMuzeiButtonDismiss" class="ui-btn" data-mini="true">' + neveraskagain + '</a></div>').trigger("create");
		$("#requestMuzeiButton").off("click").on("click",
			function () {
				window.localStorage.setItem("dismissMuzeiExtension", 'true');
				muzeiExtension.empty();
				appstore("org.teusink.droidpapers.muzei", "app");
			});
		$("#requestMuzeiButtonDismiss").off("click").on("click",
			function () {
				window.localStorage.setItem("dismissMuzeiExtension", 'true');
				muzeiExtension.empty();
			});
	} else if (window.localStorage.getItem("dismissPromotionRating") === 'false' && num > 5) {
		requestRating.empty().append('<div data-role="controlgroup"><a id="requestRateButton" class="ui-btn">' + pleaseratethisapp + '</a><a id="requestRateButtonDismiss" class="ui-btn" data-mini="true">' + neveraskagain + '</a></div>').trigger("create");
		$("#requestRateButton").off("click").on("click",
			function () {
				window.localStorage.setItem("dismissPromotionRating", 'true');
				requestRating.empty();
				appstore("org.teusink.droidpapers", "app");
			});
		$("#requestRateButtonDismiss").off("click").on("click",
			function () {
				window.localStorage.setItem("dismissPromotionRating", 'true');
				requestRating.empty();
			});
	}
}

// settings
function checkSettings() {
	handleAndroidPreferences("get", window.androidPrefsLib, "setWallColor", "", function (prefValue) {
		if (prefValue === "grayscale") {
			prefValue = $.t('grayscale');
		} else if (prefValue === "sepia") {
			prefValue = $.t('sepia');
		} else {
			prefValue = $.t('original');
		}
		$("#setWallColorStatus").empty().append($.t('defaultsetwallpapercolor') + " " + prefValue);
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "setWallAspect", "", function (prefValue) {
		if (prefValue === "height") {
			prefValue = $.t('fitheight');
		} else if (prefValue === "width") {
			prefValue = $.t('fitwidth');
		} else if (prefValue === "autofill") {
			prefValue = $.t('alwaysfillscreen');
		} else {
			prefValue = $.t('alwaysfitwallpaper');
		}
		$("#setWallAspectStatus").empty().append($.t('defaultsetwallpaperto') + " " + prefValue);
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoBackup", "", function (prefValue) {
		if (prefValue === "on") {
			$('#settingAutoBackup').val("on");
			$('#settingAutoBackup').flipswitch("refresh");
		} else {
			$('#settingAutoBackup').val("off");
			$('#settingAutoBackup').flipswitch("refresh");
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckContent", "", function (prefValue) {
		if (prefValue === "on") {
			$('#settingAutoCheckContent').val("on");
			$('#settingAutoCheckContent').flipswitch("refresh");
			$('#settingAutoCheckApp').flipswitch("enable");
		} else {
			$('#settingAutoCheckContent').val("off");
			$('#settingAutoCheckContent').flipswitch("refresh");
			$('#settingAutoCheckApp').flipswitch("disable");
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckApp", "", function (prefValue) {
		if (prefValue === "on") {
			$('#settingAutoCheckApp').val("on");
			$('#settingAutoCheckApp').flipswitch("refresh");
		} else {
			$('#settingAutoCheckApp').val("off");
			$('#settingAutoCheckApp').flipswitch("refresh");
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
		if (prefValue === "on") {
			$('#settingGoogleAnalytics').val("on");
			$('#settingGoogleAnalytics').flipswitch("refresh");
		} else {
			$('#settingGoogleAnalytics').val("off");
			$('#settingGoogleAnalytics').flipswitch("refresh");
		}
	});
}

// wallpaper settings
function checkDynamicWallpaperSettings() {
	handleAndroidPreferences("get", window.androidPrefsLib, "setDynamicWallColor", "", function (prefValue) {
		if (prefValue === "grayscale") {
			prefValue = $.t('grayscale');
		} else if (prefValue === "sepia") {
			prefValue = $.t('sepia');
		} else {
			prefValue = $.t('original');
		}
		$("#setDynamicWallColorStatus").empty().append($.t('defaultsetwallpapercolor') + " " + prefValue);
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "setDynamicWallAspect", "", function (prefValue) {
		if (prefValue === "height") {
			prefValue = $.t('fitheight');
		} else if (prefValue === "width") {
			prefValue = $.t('fitwidth');
		} else if (prefValue === "autofill") {
			prefValue = $.t('alwaysfillscreen');
		} else {
			prefValue = $.t('alwaysfitwallpaper');
		}
		$("#setDynamicWallAspectStatus").empty().append($.t('defaultsetwallpaperto') + " " + prefValue);
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "includePicturesFolder", "", function (prefValue) {
		if (prefValue === "false") {
			$('#settingServicePicturesFolder').val("off");
			$('#settingServicePicturesFolder').flipswitch("refresh");
		} else {
			$('#settingServicePicturesFolder').val("on");
			$('#settingServicePicturesFolder').flipswitch("refresh");
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "includeCameraFolder", "", function (prefValue) {
		if (prefValue === "false") {
			$('#settingServiceCameraFolder').val("off");
			$('#settingServiceCameraFolder').flipswitch("refresh");
		} else {
			$('#settingServiceCameraFolder').val("on");
			$('#settingServiceCameraFolder').flipswitch("refresh");
		}
	});
	handleAndroidPreferences("get", window.androidPrefsLib, "excludeDroidPapersFolder", "", function (prefValue) {
		if (prefValue === "true") {
			$('#settingServiceDroidPapersFolder').val("on");
			$('#settingServiceDroidPapersFolder').flipswitch("refresh");
		} else {
			$('#settingServiceDroidPapersFolder').val("off");
			$('#settingServiceDroidPapersFolder').flipswitch("refresh");
		}
	});
}

// check online content version from API
function checkContentVersionIndex() {
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncversion', function (data) {
		var versions = data.items,
			newcontentavailable = $.t('newcontentavailable'),
			downloadrequiredcontent = $.t('downloadrequiredcontent'),
			newappavailable = $.t('newappavailable');
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
			$.each(versions, function (index, version) {
				if (version.version !== prefValue && prefValue !== "" && prefValue !== null) {
					$('#infoSyncStatus').empty().append('<a href="#syncPage" class="ui-btn">' + newcontentavailable + '<br />Update: ' + version.version + ' - ' + version.notes + '</a>').trigger("create");
				} else if (prefValue === null || prefValue === "") {
					$('#infoSyncStatus').empty().append('<a href="#syncPage" class="ui-btn">' + downloadrequiredcontent + '</a>').trigger("create");
				} else {
					$('#infoSyncStatus').empty();
				}
				getPackageVersion(function (versionValue) {
					handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckApp", "", function (prefValue) {
						if (compareAppVersion(version.app, versionValue) === true && prefValue === "on") {
							$('#appUpdateStatus').empty().append('<a class="ui-btn">' + newappavailable + ': ' + version.app + '</a>').trigger("create");
							$("#appUpdateStatus").off("click").on("click",
								function () {
									$('#appUpdateStatus').empty();
									appstoreCheck(function (value) {
										if (value === "unknown") {
											window.open('http://droidpapers.teusink.org/about.php', '_system');
										} else {
											appstore("org.teusink.droidpapers", "app");
										}
									});
								});
						}
					});
				});
			});
		});
	}).fail(function () { apiErrorHandler($('#appUpdateStatus'), "appsyncversion"); });
}

// compare app versions
function compareAppVersion(latestVersion, currentVersion) {
	var latestVersionArray = latestVersion.split("."),
		appVersionArray = currentVersion.split("."),
		latestVersionMajor,
		latestVersionMedium,
		latestVersionMinor,
		appVersionMajor,
		appVersionMedium,
		appVersionMinor;
	latestVersionMajor = parseInt(latestVersionArray[0], 10);
	latestVersionMedium = parseInt(latestVersionArray[1], 10);
	latestVersionMinor = parseInt(latestVersionArray[2], 10);
	appVersionMajor = parseInt(appVersionArray[0], 10);
	appVersionMedium = parseInt(appVersionArray[1], 10);
	appVersionMinor = parseInt(appVersionArray[2], 10);
	if (((latestVersionMajor > appVersionMajor) || (latestVersionMajor === appVersionMajor && latestVersionMedium > appVersionMedium) || (latestVersionMajor === appVersionMajor && latestVersionMedium === appVersionMedium && latestVersionMinor > appVersionMinor)) && currentVersion !== "0.0.0") {
		return true; // higher version
	}
	return false; // lower version
}

// check online content version from API
function checkContentVersionSync() {
	var connection = checkConnection(),
		newcontentavailabledownload = $.t('newcontentavailabledownload'),
		downloadrequiredcontentdownload = $.t('downloadrequiredcontentdownload'),
		localcontentalreadylatest = $.t('localcontentalreadylatest'),
		internetneededfordownload = $.t('internetneededfordownload');
	if (connection !== "None") {
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
			$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncversion', function (data) {
				var versions = data.items;
				$.each(versions, function (index, version) {
					if (version.version !== prefValue && prefValue !== null) {
						$('#infoSync').empty().append(newcontentavailabledownload + ': ' + version.notes);
					} else if (prefValue === null) {
						$('#infoSync').empty().append(downloadrequiredcontentdownload);
					} else {
						$('#infoSync').empty().append(localcontentalreadylatest);
					}
				});
			}).fail(function () { apiErrorHandler($('#infoSync'), "appsyncversion"); });
		});
	} else {
		$('#infoSync').empty().append(internetneededfordownload);
	}
}

// sync content from API
function syncLocalContent() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		connection = checkConnection(),
		downloadstartdistros = $.t('downloadstartdistros'),
		downloadstartwalls = $.t('downloadstartwalls'),
		downloadstartrings = $.t('downloadstartrings'),
		downloadstartwallnotes = $.t('downloadstartwallnotes'),
		nointernetdetected = $.t('nointernetdetected');
	if (connection !== "None") {
		$('#panelMenu' + window.localStorage.getItem('divIdGlobal')).panel("close");
		$('#startSyncButton').button('disable');
		window.distroSyncFinished = false;
		window.wallSyncFinished = false;
		window.ringSyncFinished = false;
		window.wallNotesSyncFinished = false;
		// update version number
		$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncversion', function (data) {
			var versions = data.items;
			$.each(versions, function (index, version) {
				handleAndroidPreferences("set", window.androidPrefsLib, "localContentVersion", version.version, emptyCallback);
				// distributions
				$('#distroSync').empty().append('<img alt="download" src="./images/icons/ic_action_download.png" class="syncIcon" />' + downloadstartdistros);
				$('#wallsSync').empty().append('<img alt="download" src="./images/icons/ic_action_download.png" class="syncIcon" />' + downloadstartwalls);
				$('#ringsSync').empty().append('<img alt="download" src="./images/icons/ic_action_download.png" class="syncIcon" />' + downloadstartrings);
				$('#wallNotesSync').empty().append('<img alt="download" src="./images/icons/ic_action_download.png" class="syncIcon" />' + downloadstartwallnotes);
				db.transaction(
					function (transaction) {
						transaction.executeSql(
							'DELETE FROM dpAppDistributions',
							syncLocalDistros()
						);
						transaction.executeSql(
							'DELETE FROM dpAppWallpapers',
							syncLocalWalls()
						);
						transaction.executeSql(
							'DELETE FROM dpAppRingtones',
							syncLocalRings()
						);
						transaction.executeSql(
							'DELETE FROM dpAppWallpapersNotes',
							syncLocalWallNotes()
						);
					},
					errorHandlerSqlTransaction
				);
			});
		}).fail(function () { $('#startSyncButton').button('enable'); apiErrorHandler($('#infoSync'), "appsyncversion"); });
	} else {
		toast(nointernetdetected, 'short');
	}
}

// sync distros from API
function syncLocalDistros() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncdistros', function (data) {
		var distros = data.items;
		db.transaction(
			function (transaction) {
				$.each(distros, function (index, distro) {
					transaction.executeSql(
						'INSERT INTO dpAppDistributions (logo, name, wallpapers, wallpaperstext, ringtones, ringtonestext, type, os) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
						[distro.logo, distro.name, distro.wallpapers, distro.wallpaperstext, distro.ringtones, distro.ringtonestext, distro.type, distro.os],
						checkSyncFinished(index, distros.length, 'distros')
					);
				});
			},
			errorHandlerSqlTransaction
		);
	}).fail(function () { apiErrorHandler($('#infoSync'), "appsyncdistros"); });
}

// sync walls from API
function syncLocalWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncwalls', function (data) {
		var walls = data.items;
		db.transaction(
			function (transaction) {
				$.each(walls, function (index, wall) {
					transaction.executeSql(
						'INSERT INTO dpAppWallpapers (name, resolution, folder, filename, amount, distribution, version, density) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
						[wall.name, wall.resolution, wall.folder, wall.filename, wall.amount, wall.distribution, wall.version, wall.density],
						checkSyncFinished(index, walls.length, 'walls')
					);
				});
			},
			errorHandlerSqlTransaction
		);
	}).fail(function () { apiErrorHandler($('#infoSync'), "appsyncwalls"); });
}

// sync ringtones from API
function syncLocalRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncrings', function (data) {
		var rings = data.items;
		db.transaction(
			function (transaction) {
				$.each(rings, function (index, ring) {
					transaction.executeSql(
						'INSERT INTO dpAppRingtones (folder, filename, name, type, distribution, device, version) VALUES (?, ?, ?, ?, ?, ?, ?)',
						[ring.folder, ring.filename, ring.name, ring.type, ring.distribution, ring.device, ring.version],
						checkSyncFinished(index, rings.length, 'rings')
					);
				});
			},
			errorHandlerSqlTransaction
		);
	}).fail(function () { apiErrorHandler($('#infoSync'), "appsyncrings"); });
}


// sync wallpaper notes from API
function syncLocalWallNotes() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'appsyncwallnotes', function (data) {
		var notes = data.items;
		db.transaction(
			function (transaction) {
				$.each(notes, function (index, note) {
					transaction.executeSql(
						'INSERT INTO dpAppWallpapersNotes (wallpaper, note) VALUES (?, ?)',
						[note.wallpaper, note.note],
						checkSyncFinished(index, notes.length, 'wallnotes')
					);
				});
			},
			errorHandlerSqlTransaction
		);
	}).fail(function () { apiErrorHandler($('#infoSync'), "appsyncwalls"); });
}

// sync status
function checkSyncFinished(index, length, type) {
	index = index + 1;
	if (index > 0 && index < length) {
		if (type === "distros") {
			var downloadbusydistros = $.t('downloadbusydistros');
			$('#distroSync').empty().append('<img alt="write" src="./images/icons/ic_action_arrow_right_green.png" class="syncIcon" />' + downloadbusydistros + ' (' + Math.round(index / length * 100) + '%)...');
			window.distroSyncFinished = false;
		}
		if (type === "walls") {
			var downloadbusywalls = $.t('downloadbusywalls');
			$('#wallsSync').empty().append('<img alt="write" src="./images/icons/ic_action_arrow_right_green.png" class="syncIcon" />' + downloadbusywalls + ' (' + Math.round(index / length * 100) + '%)...');
			window.wallSyncFinished = false;
		}
		if (type === "rings") {
			var downloadbusyrings = $.t('downloadbusyrings');
			$('#ringsSync').empty().append('<img alt="write" src="./images/icons/ic_action_arrow_right_green.png" class="syncIcon" />' + downloadbusyrings + ' (' + Math.round(index / length * 100) + '%)...');
			window.ringSyncFinished = false;
		}
		if (type === "downloadbusywallnotes") {
			var downloadbusywallnotes = $.t('downloadbusywallnotes');
			$('#WallNotesSync').empty().append('<img alt="write" src="./images/icons/ic_action_arrow_right_green.png" class="syncIcon" />' + downloadbusywallnotes + ' (' + Math.round(index / length * 100) + '%)...');
			window.wallNotesSyncFinished = false;
		}
	}
	if (index === length) {
		if (type === "distros") {
			var downloaddonedistros = $.t('downloaddonedistros');
			$('#distroSync').empty().append('<img alt="finished" src="./images/icons/ic_action_tick.png" class="syncIcon" />' + downloaddonedistros);
			window.distroSyncFinished = true;
		}
		if (type === "walls") {
			var downloaddonewalls = $.t('downloaddonewalls');
			$('#wallsSync').empty().append('<img alt="finished" src="./images/icons/ic_action_tick.png" class="syncIcon" />' + downloaddonewalls);
			window.wallSyncFinished = true;
		}
		if (type === "rings") {
			var downloaddonerings = $.t('downloaddonerings');
			$('#ringsSync').empty().append('<img alt="finished" src="./images/icons/ic_action_tick.png" class="syncIcon" />' + downloaddonerings);
			window.ringSyncFinished = true;
		}
		if (type === "wallnotes") {
			var downloaddonewallnotes = $.t('downloaddonewallnotes');
			$('#WallNotesSync').empty().append('<img alt="finished" src="./images/icons/ic_action_tick.png" class="syncIcon" />' + downloaddonewallnotes);
			window.wallNotesSyncFinished = true;
		}
		if (window.distroSyncFinished === true && window.wallSyncFinished === true && window.ringSyncFinished === true && window.wallNotesSyncFinished === true) {
			$('#startSyncButton').button('enable');
			$("body").pagecontainer("change", "#indexPage");
		}
	}
}

// delete a selected file from cache
function deleteCache(file, type) {
	deleteCachedFile(file, type);
}

// start cache deletion
function startCacheDeletion() {
	var deletecache = $.t('deletecache'),
		deletecachemessage = $.t('deletecachemessage'),
		tdelete = $.t('delete'),
		cancel = $.t('cancel');
	navigator.notification.confirm(deletecachemessage, onConfirmCacheDelete, deletecache, [tdelete, cancel]);
}

// cache deletion confirmed
function onConfirmCacheDelete(button) {
	if (button === 1) {
		gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Delete entire cache", "Storage", 1);
		window.localStorage.clear();
		deleteEntireCache();
		navigator.app.exitApp();
	}
}

// start download deletion
function startDownloadDeletion() {
	var deletedownloaded = $.t('deletedownloaded'),
		deletedownloadsmessage = $.t('deletedownloadsmessage'),
		tdelete = $.t('tdelete'),
		cancel = $.t('cancel');
	navigator.notification.confirm(deletedownloadsmessage, onConfirmDownloadedDelete, deletedownloaded, [tdelete, cancel]);
}

// download deletion confirmed
function onConfirmDownloadedDelete(button) {
	if (button === 1) {
		gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Delete downloads", "Storage", 1);
		deleteDownloadedFolder('Pictures');
		deleteDownloadedFolder('Alarms');
		deleteDownloadedFolder('Notifications');
		deleteDownloadedFolder('Ringtones');
	}
}

// change backup and restore button states
function buttonStateBackRest(state) {
	$('#startBackupButton').button(state);
	$('#startBackupButton').button("refresh");
	$('#startRestoreButton').button(state);
	$('#startRestoreButton').button("refresh");
}

// start backup
function startBackup() {
	var startbackup = $.t('startbackup'),
		startbackupmessage = $.t('startbackupmessage'),
		start = $.t('start'),
		cancel = $.t('cancel');
	buttonStateBackRest("disable");
	navigator.notification.confirm(startbackupmessage, onConfirmBackup, startbackup, [start, cancel]);
}

// backup confirmed
function onConfirmBackup(button) {
	if (button === 1) {
		var backupstarted = $.t('backupstarted');
		toast(backupstarted, "short");
		window.localStorage.setItem('settingLastBackupDate', currentDate());
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
			fileSystem.root.getDirectory("DroidPapers", {create: true, exclusive: false});
		});
		backupFavoritesWalls();
		backupFavoritesRings();
	} else {
		buttonStateBackRest("enable");
	}
}

// backup favorites walls
function backupFavoritesWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	window.finishedBackupWalls = false;
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entries;',
				null,
				function (transaction, result) {
					if (result.rows.length > 0) {
						var tag = '{"items":[',
							i,
							row;
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							tag = tag + '{"file":"' + row.file + '","folder":"' + row.folder + '"}';
							if (i + 1 < result.rows.length) {
								tag = tag + ',';
							}
						}
						tag = tag + ']}';
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
							fileSystem.root.getFile("DroidPapers/backup-fav-walls.txt", {create: true, exclusive: false}, function (fileEntry) {
								fileEntry.createWriter(function (writer) {
									writer.write(tag);
								}, failFileBackup);
							}, failFileBackup);
						}, failFileBackup);
						checkBackupFinished('walls');
					} else {
						var nowallsbackup = $.t('nowallsbackup');
						toast(nowallsbackup, "short");
						checkBackupFinished('walls');
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// backup favorites rings
function backupFavoritesRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	window.finishedBackupRings = false;
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entriesRings;',
				null,
				function (transaction, result) {
					if (result.rows.length > 0) {
						var tag = '{"items":[',
							i,
							row;
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							tag = tag + '{"url":"' + row.url + '","name":"' + row.name + '","type":"' + row.type + '"}';
							if (i + 1 < result.rows.length) {
								tag = tag + ',';
							}
						}
						tag = tag + ']}';
						window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
							fileSystem.root.getFile("DroidPapers/backup-fav-rings.txt", {create: true, exclusive: false}, function (fileEntry) {
								fileEntry.createWriter(function (writer) {
									writer.write(tag);
								}, failFileBackup);
							}, failFileBackup);
						}, failFileBackup);
						checkBackupFinished('rings');
					} else {
						var noringsbackup = $.t('noringsbackup');
						toast(noringsbackup, "short");
						checkBackupFinished('rings');
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// backup status finished
function checkBackupFinished(type) {
	if (type === "walls") {
		window.finishedBackupWalls = true;
	}
	if (type === "rings") {
		window.finishedBackupRings = true;
	}
	if (window.finishedBackupWalls === true && window.finishedBackupRings === true) {
		var backupdone = $.t('backupdone');
		toast(backupdone, "short");
		window.localStorage.setItem("settingFavoritesChanged", "false");
		buttonStateBackRest("enable");
	}
}

// backup file fail function
function failFileBackup(error) {
	var backupfailed = $.t('backupfailed');
	console.error("PhoneGap Plugin: FileSystem: Message: Backup - file does not exists, isn't writeable or isn't readable. Error code: " + error.code);
	buttonStateBackRest("enable");
	toast(backupfailed, 'short');
}

// start restore
function startRestore() {
	var startrestore = $.t('startrestore'),
		startrestoremessage = $.t('startrestoremessage'),
		start = $.t('start'),
		cancel = $.t('cancel');
	buttonStateBackRest("disable");
	navigator.notification.confirm(startrestoremessage, onConfirmRestore, startrestore, [start, cancel]);
}

// restore confirmed
function onConfirmRestore(button) {
	if (button === 1) {
		var restorestarted = $.t('restorestarted');
		toast(restorestarted, "short");
		window.startRestoreInitiated = true;
		restoreFavoritesWalls();
		restoreFavoritesRings();
	} else {
		buttonStateBackRest("enable");
	}
}

// restore favorites walls
function restoreFavoritesWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'DELETE FROM entries;',
				startRestoreFavoritesWalls()
			);
		},
		errorHandlerSqlTransaction
	);
}

// actually start restore favorite wallpapers
function startRestoreFavoritesWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	window.wallRestoreFinished = false;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		fileSystem.root.getFile("DroidPapers/backup-fav-walls.txt", null, function (fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function (evt) {
					var data = JSON.parse(evt.target.result),
						walls = data.items;
					db.transaction(
						function (transaction) {
							$.each(walls, function (index, wall) {
								transaction.executeSql(
									'INSERT INTO entries (file, folder) VALUES (?, ?);',
									[wall.file, wall.folder],
									checkRestoreFinished(index, walls.length, 'walls')
								);
							});
						},
						errorHandlerSqlTransaction
					);
				};
				reader.readAsText(file);
			}, failFileRestoreWall);
		}, failFileRestoreWall);
	}, failFileRestoreWall);
}

// restore favorites rings
function restoreFavoritesRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'DELETE FROM entriesRings;',
				startRestoreFavoritesRings()
			);
		},
		errorHandlerSqlTransaction
	);
}

// actually start restore favorite ringtones
function startRestoreFavoritesRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	window.ringRestoreFinished = false;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		fileSystem.root.getFile("DroidPapers/backup-fav-rings.txt", null, function (fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function (evt) {
					var data = JSON.parse(evt.target.result), rings = data.items;
					db.transaction(
						function (transaction) {
							$.each(rings, function (index, ring) {
								transaction.executeSql(
									'INSERT INTO entriesRings (url, name, type) VALUES (?, ?, ?);',
									[ring.url, ring.name, ring.type],
									checkRestoreFinished(index, rings.length, 'rings')
								);
							});
						},
						errorHandlerSqlTransaction
					);
				};
				reader.readAsText(file);
			}, failFileRestoreRing);
		}, failFileRestoreRing);
	}, failFileRestoreRing);
}

// restore status
function checkRestoreFinished(index, length, type) {
	index = index + 1;
	if (index === 1 && window.startRestoreInitiated === true) {
		window.startRestoreInitiated = false;
	}
	if (index === length) {
		if (type === "walls") {
			window.wallRestoreFinished = true;
		}
		if (type === "rings") {
			window.ringRestoreFinished = true;
		}
		if ((window.wallRestoreFinished === true || window.wallRestoreFailed === true) && (window.ringRestoreFinished === true || window.ringRestoreFailed === true)) {
			var restoredone = $.t('restoredone');
			toast(restoredone, "short");
			buttonStateBackRest("enable");
		}
	}
}

// restore file fail function
function failFileRestoreWall(error) {
	var restorefavwallsfailed = $.t('restorefavwallsfailed');
	window.wallRestoreFailed = true;
	console.error("PhoneGap Plugin: FileSystem: Message: Restore - file does not exists, isn't writeable or isn't readable. Error code: " + error.code);
	buttonStateBackRest("enable");
	toast(restorefavwallsfailed, 'short');
}

// restore file fail function
function failFileRestoreRing(error) {
	var restorefavringsfailed = $.t('restorefavringsfailed');
	window.ringRestoreFailed = true;
	console.error("PhoneGap Plugin: FileSystem: Message: Restore - file does not exists, isn't writeable or isn't readable. Error code: " + error.code);
	buttonStateBackRest("enable");
	toast(restorefavringsfailed, 'short');
}

// initialize page variables and elements on create
function initPageVarsOnCreate(id) {
	// every page
	// every page but...
	if (id !== "LandingPage") {
		$("*").i18n();
	}
	// specific page...
	if (id === "DistributionsWalls") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "WpFavorites") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "OverviewWalls") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "DistributionsRings") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "OverviewRings") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "Sync") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "Index") {
		htmlClickEventHandlers(id, "menu");
		homePageCards();
	} else if (id === "Topic") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "About") {
		injectPackageVersion();
		htmlClickEventHandlers(id, "back");
	} else if (id === "Support") {
		getSystemSpecs();
		htmlClickEventHandlers(id, "back");
	} else if (id === "Settings") {
		initSettingsSwitch();
		htmlClickEventHandlers(id, "back");
	} else if (id === "RtFavorites") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "WpFullScrImage") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "DynamicWall") {
		initDynamicWallpaperSwitch();
		initServiceSettingsSwitch();
		htmlClickEventHandlers(id, "back");
	} else if (id === "RingUri") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "RingSearch") {
		htmlClickEventHandlers(id, "back");
	} else if (id === "WallSearch") {
		htmlClickEventHandlers(id, "back");
	}
}

// initialize page variables on show
function initPageVarsOnShow(id) {
	// every page...
	var headerWallMenu;
	window.localStorage.setItem("divIdGlobal", id);
	// every page but...
	if (id !== "LandingPage") {
		if (id !== "Topic") {
			handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
				if (prefValue !== "off") {
					gaPluginEventsHandler("trackPage", id, "", "", "", "");
				}
			});
		}
		resetPanelState();
		panelMenu(id);
		panelMenuRight(id);
		panelHandling();
		handlePreferredScreenSize(function (screenValue) {
			if (screenValue === "xlarge" || screenValue === "large") {
				$(document).on("collapsibleexpand", "[data-role=collapsible]", function () {
					var position = $(this).offset().top;
					position = position - 53;
					if (getAndroidVersion() >= window.chromeView) {
						$("html, body").stop().animate({ "scrollTop" : position }, 300);
					} else {
						$.mobile.silentScroll(position);
					}
				});
			} else {
				$(document).on("collapsibleexpand", "[data-role=collapsible]", function () {
					var position = $(this).offset().top;
					position = position - 46;
					if (getAndroidVersion() >= window.chromeView) {
						$("html, body").stop().animate({ "scrollTop" : position }, 300);
					} else {
						$.mobile.silentScroll(position);
					}
				});
			}
		});
	}
	// specific page...
	if (id === "LandingPage") {
		isDeviceReady("", "InitApp");
		isDeviceReady("", "InitUri");
	} else if (id === "DistributionsWalls") {
		pressEffectHeader(false, false, false, "back");
		if (window.localStorage.getItem("previousPageId") !== "overviewWallsPage") {
			getOverviewDistributionsWalls();
		}
	} else if (id === "WpFavorites") {
		pressEffectHeader(false, false, false, "back");
		getFavorites('Image');
	} else if (id === "OverviewWalls") {
		pressEffectHeader(true, false, false, "back");
		if (window.localStorage.getItem("previousPageId") !== "wallpaperFullscreenImagePage") {
			fillCheckboxesWallFilter();
			getOverviewWalls();
			setOverviewWallsTitle();
		}
	} else if (id === "DistributionsRings") {
		pressEffectHeader(false, false, false, "back");
		if (window.localStorage.getItem("previousPageId") !== "overviewRingsPage") {
			getOverviewDistributionsRings();
		}
	} else if (id === "OverviewRings") {
		pressEffectHeader(false, false, false, "back");
		window.localStorage.setItem('ringtoneSource', 'Nor');
		getOverviewRings();
		setOverviewRingsTitle();
		ringtonePlayer(id);
	} else if (id === "Sync") {
		pressEffectHeader(false, false, false, "back");
		checkContentVersionSync();
	} else if (id === "Index") {
		pressEffectHeader(false, false, false, "menu");
		checkContentVersionIndex();
		addPromotionButtons();
		if (window.localStorage.getItem('settingFirstBoot') !== "false") {
			var headerTitle = $("#headerTitle" + window.localStorage.getItem("divIdGlobal")),
				panel = $('#panelMenu' + window.localStorage.getItem("divIdGlobal"));
			headerTitle.addClass("holoPressEffect");
			setTimeout(function () {
				togglePanel(panel);
			}, 750);
			setTimeout(function () {
				headerTitle.removeClass("holoPressEffect");
				togglePanel(panel);
			}, 1750);
			window.localStorage.setItem('settingFirstBoot', 'false');
		}
	} else if (id === "Topic") {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
			if (prefValue !== "off") {
				gaPluginEventsHandler("trackPage", id + '-' + window.localStorage.getItem("cardSubject"), "", "", "", "");
			}
		});
		pressEffectHeader(false, false, true, "back");
		if (window.localStorage.getItem("previousPageId") !== "wallpaperFullscreenImagePage") {
			ringtonePlayer(id);
			showTopicTitle();
			showTopicContent();
		}
	} else if (id === "About") {
		pressEffectHeader(false, false, false, "back");
		getAllCounters();
	} else if (id === "Support") {
		pressEffectHeader(false, false, false, "back");
	} else if (id === "Settings") {
		pressEffectHeader(false, false, false, "back");
		checkSettings();
	} else if (id === "RtFavorites") {
		pressEffectHeader(false, false, false, "back");
		window.localStorage.setItem('ringtoneSource', 'Fav');
		getFavoritesRings('alarm');
		getFavoritesRings('notification');
		getFavoritesRings('ringtone');
		ringtonePlayer(id);
	} else if (id === "WpFullScrImage") {
		togglePrevNextWallButtons();
		wallpaperImageFullScr('Image');
		pressEffectHeader(false, true, false, "back");
		pressEffectFooter(true, true, true, true);
		getWallSpecs();
		getWallNote();
		window.localStorage.setItem("shareTagSubject", 'DroidPapers');
		window.localStorage.setItem("shareTagText", '#DroidPapers ' + window.serviceURL + 'share.php?folder=' + window.localStorage.getItem("wallPaperShareFolder" + window.appPart) + '&name=' + window.localStorage.getItem("wallPaperShareName" + window.appPart));
		placeFavoriteStar(window.localStorage.getItem("wallPaperFolder" + window.appPart), window.localStorage.getItem("wallPaperName" + window.appPart));
		wallpaperActionButtons();
		if (window.localStorage.getItem('settingFirstBootWpImage') === null || window.localStorage.getItem('settingFirstBootWpImage') === "true") {
			headerWallMenu = $("#headerWallMenu" + window.localStorage.getItem("divIdGlobal"));
			headerWallMenu.addClass("holoPressEffect");
			setTimeout(function () {
				togglePanel('#panelMenuWall' + window.localStorage.getItem("divIdGlobal"));
			}, 750);
			setTimeout(function () {
				headerWallMenu.removeClass("holoPressEffect");
				togglePanel('#panelMenuWall' + window.localStorage.getItem("divIdGlobal"));
			}, 1750);
			window.localStorage.setItem('settingFirstBootWpImage', 'false');
		}
	} else if (id === "DynamicWall") {
		pressEffectHeader(false, false, false, "back");
		checkDynamicWallpaperSettings();
		serviceDynamicWallpaper("getStatus", "none");
	} else if (id === "RingUri") {
		pressEffectHeader(false, false, false, "back");
		ringtonePlayer(id);
		addRingtoneUriButton();
	} else if (id === "RingSearch") {
		pressEffectHeader(false, false, false, "back");
		ringtonePlayer(id);
		getOverviewSearchedRings();
	} else if (id === "WallSearch") {
		pressEffectHeader(false, false, false, "back");
		if (window.localStorage.getItem("previousPageId") !== "wallpaperFullscreenImagePage") {
			getOverviewSearchedWalls();
		}
	}
}

// assign click events to elements
function htmlClickEventHandlers(id, action) {
	$('#headerTitle' + id).off("click").on("click",
		function () {
			if (action !== "back") {
				togglePanel('#panelMenu' + id);
			} else {
				if (window.localStorage.getItem("uriView") === 'true') {
					window.localStorage.setItem("uriView", 'false');
					navigator.app.exitApp();
				} else {
					window.history.back();
				}
			}
		});
	$('#headerOverflow' + id).off("click").on("click",
		function () {
			togglePanel('#panelMenuRight' + id);
		});
	if (id === "Index") {
		//
	}
	if (id === "Topic") {
		$('#headerRefresh' + id).off("click").on("click",
			function () {
				showTopicTitle();
				showTopicContent();
			});
		$('#headerRefresh' + id).on("taphold",
			function () {
				var refresh = $.t('refresh');
				toast(refresh, "short");
			});
	} else if (id === "About") {
		$('#linkBrowserDroidPapers').off("click").on("click",
			function () {
				window.open(window.serviceURL, '_system');
			});
		$('#linkBrowserDroidPapersApps').off("click").on("click",
			function () {
				appstore("Teusink.org", "pub");
			});
		$('#linkAboutDroidPapers').off("click").on("click",
			function () {
				window.open('http://droidpapers.teusink.org/about.php', '_system');
			});
		$('#linkjQueryMobile').off("click").on("click",
			function () {
				window.open('http://jquerymobile.com/', '_system');
			});
		$('#linkPhoneGap').off("click").on("click",
			function () {
				window.open('http://phonegap.com/', '_system');
			});
		$('#linkDroidPapersLocales').off("click").on("click",
			function () {
				window.open('https://github.com/teusinkorg/DroidPapersLocales', '_system');
			});
	} else if (id === "Settings") {
		$('#startBackupButton').off("click").on("click",
			function () {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Start backup", "Favorites", 1);
				startBackup();
			});
		$('#startRestoreButton').off("click").on("click",
			function () {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Start restore", "Favorites", 1);
				startRestore();
			});
		$('#deleteEntireCache').off("click").on("click",
			function () {
				startCacheDeletion();
			});
		$('#deleteDownloadedWallpapers').off("click").on("click",
			function () {
				startDownloadDeletion();
			});
	} else if (id === "Sync") {
		$('#startSyncButton').off("click").on("click",
			function () {
				syncLocalContent();
			});
	} else if (id === "WpFullScrImage") {
		$('#headerWallMenu' + id).off("click").on("click",
			function () {
				togglePanel('#panelMenuWall' + id);
			});
		$('#headerShare' + id).off("click").on("click",
			function () {
				share(window.localStorage.getItem('shareTagSubject'), window.localStorage.getItem('shareTagText'));
			});
		$('#prevWall' + id).off("click").on("click",
			function () {
				navigateWallRight();
			});
		$('#nextWall' + id).off("click").on("click",
			function () {
				navigateWallLeft();
			});
		$('#setWallpaper1' + id).off("click").on("click",
			function () {
				var setWallColor,
					setWallAspect;
				handleAndroidPreferences("get", window.androidPrefsLib, "setWallColor", "", function (prefValue) {
					setWallColor = prefValue;
					handleAndroidPreferences("get", window.androidPrefsLib, "setWallAspect", "", function (prefValue) {
						setWallAspect = prefValue;
						downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, setWallAspect, setWallColor);
					});
				});
			});
		$('#setWallpaper2' + id).off("click").on("click",
			function () {
				downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, false, "", "");
			});
		$('#headerShare' + id).on("taphold",
			function () {
				var share = $.t('share');
				toast(share, "short");
			});
		$('#prevWall' + id).on("taphold",
			function () {
				var previouswallpaper = $.t('previouswallpaper');
				toast(previouswallpaper, "short");
			});
		$('#nextWall' + id).on("taphold",
			function () {
				var nextwallpaper = $.t('nextwallpaper');
				toast(nextwallpaper, "short");
			});
		$('#setWallpaper1' + id).on("taphold",
			function () {
				var setwallpaperdefault = $.t('setwallpaperdefault');
				toast(setwallpaperdefault, "short");
			});
		$('#setWallpaper2' + id).on("taphold",
			function () {
				var downloadonly = $.t('downloadonly');
				toast(downloadonly, "short");
			});
	} else if (id === "OverviewWalls") {
		$('#headerFilter' + id).off("click").on("click",
			function () {
				togglePanel('#panelMenuFilter' + id);
			});
		clickCheckBoxesWallFilter();
	}
	// Special conditions
	if (id === "DistributionsRings" || id === "RingSearch") {
		$('#headerSearch' + id).off("click").on("click",
			function () {
				searchRingtone();
			});
		$('#headerSearch' + id).on("taphold",
			function () {
				var search = $.t('search');
				toast(search, "short");
			});
	}
	if (id === "DistributionsWalls" || id === "WallSearch") {
		$('#headerSearch' + id).off("click").on("click",
			function () {
				searchWallpaper();
			});
		$('#headerSearch' + id).on("taphold",
			function () {
				var search = $.t('search');
				toast(search, "short");
			});
	}
}

// detect swipeleft
$(document).off('swipeleft').on('swipeleft', function (event) {
	var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	if (currentId === "wallpaperFullscreenImagePage") {
		if (checkOpenPanels() === false) {
			navigateWallLeft();
		}
	}
});
// detect swiperight
$(document).off('swiperight').on('swiperight', function (event) {
	var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id,
		w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		x = w.innerWidth || e.clientWidth || g.clientWidth;
	if (currentId === "wallpaperFullscreenImagePage") {
		if (checkOpenPanels() === false) {
			navigateWallRight();
		}
	} else if (window.localStorage.getItem("pageNaveType") === "menu") {
		if (checkOpenPanels() === false && event.swipestart.coords[0] < x / 5) {
			togglePanel('#panelMenu' + window.localStorage.getItem("divIdGlobal"));
		}
	}
});

// store important vars
function startBeforeShowVars(data) {
	window.localStorage.setItem("previousPageId", data.prevPage.attr("id"));
}

// #landingPage
$(document).on('pagebeforeshow', '#landingPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('LandingPage');
});
$(document).on('pagecreate', '#landingPage', function () {
	initPageVarsOnCreate('LandingPage');
});

// #distributionsWallsPage
$(document).on('pagebeforeshow', '#distributionsWallsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('DistributionsWalls');
});
$(document).on('pagecreate', '#distributionsWallsPage', function () {
	initPageVarsOnCreate('DistributionsWalls');
});

// #wpFavoritesPage
$(document).on('pagebeforeshow', '#wpFavoritesPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('WpFavorites');
});
$(document).on('pagecreate', '#wpFavoritesPage', function () {
	initPageVarsOnCreate('WpFavorites');
});

// #overviewWallsPage
$(document).on('pagebeforeshow', '#overviewWallsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('OverviewWalls');
});
$(document).on('pagecreate', '#overviewWallsPage', function () {
	initPageVarsOnCreate('OverviewWalls');
});

// #distributionsRingsPage
$(document).on('pagebeforeshow', '#distributionsRingsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('DistributionsRings');
});
$(document).on('pagecreate', '#distributionsRingsPage', function () {
	initPageVarsOnCreate('DistributionsRings');
});

// #overviewRingsPage
$(document).on('pagebeforeshow', '#overviewRingsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('OverviewRings');
});
$(document).on('pagecreate', '#overviewRingsPage', function () {
	initPageVarsOnCreate('OverviewRings');
});

// #syncPage
$(document).on('pagebeforeshow', '#syncPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Sync');
});
$(document).on('pagecreate', '#syncPage', function () {
	initPageVarsOnCreate('Sync');
});

// #indexPage
$(document).on('pagebeforeshow', '#indexPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Index');
});
$(document).on('pagecreate', '#indexPage', function () {
	initPageVarsOnCreate('Index');
});

// #topicPage
$(document).on('pagebeforeshow', '#topicPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Topic');
});
$(document).on('pagecreate', '#topicPage', function () {
	initPageVarsOnCreate('Topic');
});

// #aboutPage
$(document).on('pagebeforeshow', '#aboutPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('About');
});
$(document).on('pagecreate', '#aboutPage', function () {
	initPageVarsOnCreate('About');
});

// #supportPage
$(document).on('pagebeforeshow', '#supportPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Support');
});
$(document).on('pagecreate', '#supportPage', function () {
	initPageVarsOnCreate('Support');
});

// #settingsPage
$(document).on('pagebeforeshow', '#settingsPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('Settings');
});
$(document).on('pagecreate', '#settingsPage', function () {
	initPageVarsOnCreate('Settings');
});

// #dynamicWallpaperPage
$(document).on('pagebeforeshow', '#dynamicWallpaperPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('DynamicWall');
});
$(document).on('pagecreate', '#dynamicWallpaperPage', function () {
	initPageVarsOnCreate('DynamicWall');
});

// #wallpaperFullscreenImagePage
$(document).on('pagebeforeshow', '#wallpaperFullscreenImagePage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('WpFullScrImage');
});
$(document).on('pagecreate', '#wallpaperFullscreenImagePage', function () {
	initPageVarsOnCreate('WpFullScrImage');
});

// #rtFavoritesPage
$(document).on('pagebeforeshow', '#rtFavoritesPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('RtFavorites');
});
$(document).on('pagecreate', '#rtFavoritesPage', function () {
	initPageVarsOnCreate('RtFavorites');
});

// #uriRingtonePage
$(document).on('pagebeforeshow', '#uriRingtonePage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('RingUri');
});
$(document).on('pagecreate', '#uriRingtonePage', function () {
	initPageVarsOnCreate('RingUri');
});

// #searchRingtones
$(document).on('pagebeforeshow', '#searchRingtones', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('RingSearch');
});
$(document).on('pagecreate', '#searchRingtones', function () {
	initPageVarsOnCreate('RingSearch');
});

// #searchWallpapers
$(document).on('pagebeforeshow', '#searchWallpapers', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('WallSearch');
});
$(document).on('pagecreate', '#searchWallpapers', function () {
	initPageVarsOnCreate('WallSearch');
});