// JSLint, include this before tests
// var $, document, window, gaPlugin, gaPluginEventsHandler, gaPluginResultHandler, gaPluginErrorHandler, htmlClickEventHandlers, wallpaperImage, getWallSpecs, pressBackButton, favoriteSwipeRight, favoriteSwipeLeft, downloadWallpaper, toast, wallpaperImageFullScr, handleAndroidPreferences, navigateWallRight, navigateWallLeft, getWallNote, getFavorites, isDeviceReady;

function onPause() {
	// dummy function to prevent error with onPause event in the plugin html files.
}

// press effect in header bar
function pressEffectHeader() {
	var currentId = window.localStorage.getItem("divIdGlobalPlugin");
	// header press effect
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id !== 'pluginPage') {
		$("#headerTitle" + currentId).on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#headerTitle" + currentId).on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
}

// press effect in footer bar
function pressEffectFooter(set1, prev, next) {
	var currentId = window.localStorage.getItem("divIdGlobalPlugin");
	// set wallpaper 1 press effect
	if (set1 === true) {
		$("#setWallpaper1" + currentId).on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#setWallpaper1" + currentId).on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// previous wallpaper press effect
	if (prev === true) {
		$("#prevWall" + currentId).on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#prevWall" + currentId).on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
	// next wallpaper press effect
	if (next === true) {
		$("#nextWall" + currentId).on('touchstart', function () {
			$(this).addClass("holoPressEffect");
		});
		$("#nextWall" + currentId).on('touchend', function () {
			$(this).removeClass("holoPressEffect");
		});
	}
}

// initialize page variables and elements on create
function initPageVarsOnCreate(id) {
	// every page...
	htmlClickEventHandlers(id);
	// every page but...
	if (id !== "LandingPluginPage") {
		$("*").i18n();
	}
	// specific page...
	if (id === "LandingPluginPage") {
		// do nothing
	} else if (id === "WpPlugin") {
		getFavorites('Plugin');
	}
}

// initialize page variables on show
function initPageVarsOnShow(id) {
	window.localStorage.setItem("divIdGlobalPlugin", id);
	// every page...
	// every page but...
	if (id !== "LandingPluginPage") {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
			if (prefValue !== "off") {
				gaPluginEventsHandler("trackPage", id, "", "", "", "");
			}
		});
	}
	// specific page...
	if (id === "LandingPluginPage") {
		isDeviceReady("", "InitPlugin");
	} else if (id === "WpFullScrImagePlugin") {
		wallpaperImageFullScr('ImagePlugin');
		getWallSpecs();
		getWallNote();
		pressEffectHeader();
		pressEffectFooter(true, true, true);
	}
}

// assign click events to elements
function htmlClickEventHandlers(id) {
	if (id === "WpFullScrImagePlugin") {
		$('#headerTitle' + id).off("click").on("click",
			function () {
				pressBackButton();
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
	}
}

// detect swipeleft
$(document).off('swipeleft').on('swipeleft', function (event) {
	var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	if (currentId === "wallpaperFullscreenImagePluginPage") {
		favoriteSwipeLeft();
	}
});
// detect swiperight
$(document).off('swiperight').on('swiperight', function (event) {
	var currentId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	if (currentId === "wallpaperFullscreenImagePluginPage") {
		favoriteSwipeRight();
	}
});

// store important vars
function startBeforeShowVars(data) {
	window.localStorage.setItem("previousPageIdPlugin", data.prevPage.attr("id"));
}

// #landingPluginPage
$(document).on('pagebeforeshow', '#landingPluginPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('LandingPluginPage');
});
$(document).on('pagecreate', '#landingPluginPage', function () {
	initPageVarsOnCreate('LandingPluginPage');
});

// #pluginPage
$(document).on('pagebeforeshow', '#pluginPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('WpPlugin');
});
$(document).on('pagecreate', '#pluginPage', function () {
	initPageVarsOnCreate('WpPlugin');
});

// #wallpaperFullscreenImagePluginPage
$(document).on('pagebeforeshow', '#wallpaperFullscreenImagePluginPage', function (event, data) {
	startBeforeShowVars(data);
	initPageVarsOnShow('WpFullScrImagePlugin');
});
$(document).on('pagecreate', '#wallpaperFullscreenImagePluginPage', function () {
	initPageVarsOnCreate('WpFullScrImagePlugin');
});