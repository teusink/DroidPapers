// JSLint, include this before tests
// var cordova, window, $, handleDynamicWallpaperSuccess, handleDynamicWallpaperError, updateView, handleUpdateCheckerSuccess, handleUpdateCheckerError, handleAndroidPreferencesCB, handleAndroidPreferences, deInitServiceSettingsSwitch, initServiceSettingsSwitch, toast, checkSettings, serviceUpdateChecker, gaPlugin, gaPluginResultHandler, gaPluginErrorHandler, checkDynamicWallpaperSettings;

/* PhoneGap plugin services functions */

// DynamicWallpaper Service
function serviceDynamicWallpaper(action, input) {
	var dynamicwallpaper = cordova.require('cordova/plugin/dynamicwallpaper');
	if (action === "getStatus") {
		dynamicwallpaper.getStatus(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "runOnce") {
		dynamicwallpaper.runOnce(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "startService") {
		dynamicwallpaper.startService(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "stopService") {
		dynamicwallpaper.stopService(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "registerForBootStart") {
		dynamicwallpaper.registerForBootStart(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "deregisterForBootStart") {
		dynamicwallpaper.deregisterForBootStart(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "enableTimer") {
		dynamicwallpaper.enableTimer(
			input,
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	} else if (action === "disableTimer") {
		dynamicwallpaper.disableTimer(
			function (r) { handleDynamicWallpaperSuccess(r); },
			function (e) { handleDynamicWallpaperError(e); }
		);
	}
}
// handlers for service
function handleDynamicWallpaperError(data) {
	console.error("PhoneGap Plugin: DynamicWallpaper Service: Error: " + data.ErrorMessage);
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'dynamicWallpaperPage') {
		updateView(data);
	}
}
function handleDynamicWallpaperSuccess(data) {
	handleAndroidPreferences("get", window.androidPrefsLib, "settingDynamicWallpaper", "", function (prefValue) {
		if (!data.ServiceRunning && prefValue === "on") {
			// console.info("PhoneGap Plugin: DynamicWallpaper Service: started service, because it should be running.");
			serviceDynamicWallpaper("startService", "none");
		} else if (data.ServiceRunning && prefValue === "on") {
			if (data.TimerEnabled && !data.RegisteredForBootStart) {
				// console.info("PhoneGap Plugin: DynamicWallpaper Service: registered service for boot start.");
				serviceDynamicWallpaper("registerForBootStart", "none");
			} else if (!data.TimerEnabled) {
				// console.info("PhoneGap Plugin: DynamicWallpaper Service: enable service timer on 24 hours.");
				if (data.TimerMilliseconds === "" || data.TimerMilliseconds === null) {
					serviceDynamicWallpaper("enableTimer", 86400000);
				} else {
					serviceDynamicWallpaper("enableTimer", data.TimerMilliseconds);
				}
			} else if (data.TimerMilliseconds === "" || data.TimerMilliseconds === null) {
				// console.info("PhoneGap Plugin: DynamicWallpaper Service: set service timer on 24 hours.");
				serviceDynamicWallpaper("enableTimer", 86400000);
			}
		} else if (data.ServiceRunning && prefValue === "off") {
			// console.info("PhoneGap Plugin: DynamicWallpaper Service: stopped service, because it should not be running.");
			serviceDynamicWallpaper("stopService", "none");
		}
		if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'dynamicWallpaperPage') {
			updateView(data);
		}
	});
}

// service view page
function updateView(data) {
	deInitServiceSettingsSwitch();
	var currentTimerMilliseconds,
		timeDuration,
		setintervaltoonceevery = $.t('setintervaltoonceevery'),
		minute = $.t('minute'),
		minutes = $.t('minutes'),
		hour = $.t('hour'),
		hours = $.t('hours');
	if (data.ServiceRunning) {
		$('#switchDynamicWallpaper').val("on");
		$('#switchDynamicWallpaper').flipswitch("refresh");
		$("#durationTime").selectmenu("enable");
		$("#durationType").selectmenu("enable");
		$("#setDurationTimer").button("enable");
		if (data.TimerEnabled) {
			try {
				currentTimerMilliseconds = data.TimerMilliseconds;
			} catch (err5) {
				currentTimerMilliseconds = 0;
			}
			if (currentTimerMilliseconds === null || currentTimerMilliseconds === 0) {
				timeDuration = $.t('notimeractive');
			} else if (currentTimerMilliseconds === 60000 || currentTimerMilliseconds === 120000 || currentTimerMilliseconds === 180000 || currentTimerMilliseconds === 240000 || currentTimerMilliseconds === 300000 || currentTimerMilliseconds === 360000 || currentTimerMilliseconds === 600000 || currentTimerMilliseconds === 720000 || currentTimerMilliseconds === 900000 || currentTimerMilliseconds === 1440000 || currentTimerMilliseconds === 1800000) {
				$("#durationTime").val(currentTimerMilliseconds / 1000 / 60);
				$("#durationType").val("min");
				$("#durationTime").trigger('change');
				$("#durationType").trigger('change');
				if (currentTimerMilliseconds / 1000 / 60 > 1) {
					timeDuration = currentTimerMilliseconds / 1000 / 60 + ' ' + minutes;
				} else {
					timeDuration = currentTimerMilliseconds / 1000 / 60 + ' ' + minute;
				}
			} else if (currentTimerMilliseconds === 3600000 || currentTimerMilliseconds === 7200000 || currentTimerMilliseconds === 10800000 || currentTimerMilliseconds === 14400000 || currentTimerMilliseconds === 18000000 || currentTimerMilliseconds === 21600000 || currentTimerMilliseconds === 36000000 || currentTimerMilliseconds === 43200000 || currentTimerMilliseconds === 54000000 || currentTimerMilliseconds === 86400000) {
				$("#durationTime").val(currentTimerMilliseconds / 1000 / 60 / 60);
				$("#durationType").val("hour");
				$("#durationTime").trigger('change');
				$("#durationType").trigger('change');
				if (currentTimerMilliseconds / 1000 / 60 / 60 > 1) {
					timeDuration = currentTimerMilliseconds / 1000 / 60 / 60 + ' ' + hours;
				} else {
					timeDuration = currentTimerMilliseconds / 1000 / 60 / 60 + ' ' + hour;
				}
			}
			$('#timerDurationStatus').empty().append(setintervaltoonceevery + " " + timeDuration);
		} else {
			$('#timerDurationStatus').empty().append(setintervaltoonceevery + "...");
		}
		if (data.RegisteredForBootStart) {
			// KEEP: do nothing, keep for reference
		}
	} else {
		$('#switchDynamicWallpaper').val("off");
		$('#switchDynamicWallpaper').flipswitch("refresh");
		$('#timerDurationStatus').empty().append(setintervaltoonceevery + "...");
		$("#durationTime").selectmenu("disable");
		$("#durationType").selectmenu("disable");
		$("#setDurationTimer").button("disable");
	}
	initServiceSettingsSwitch();
}

// disabling all buttons upon false key checker
function disableBttDynamicWallpaper() {
	$('#switchDynamicWallpaper').val("off");
	$('#switchDynamicWallpaper').flipswitch("refresh");
	$("#durationTime").selectmenu("disable");
	$("#durationType").selectmenu("disable");
	$("#setDurationTimer").button("disable");
}

// de-init service settings switches
function deInitServiceSettingsSwitch() {
	$("#switchDynamicWallpaper").off("change");
	$('#setDurationTimer').off("click");
}
// init service settings switches
function initServiceSettingsSwitch() {
	$("#switchDynamicWallpaper").off("change").on("change", function () {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingDynamicWallpaper", "", function (prefValue) {
			var starteddynamicservice = $.t('starteddynamicservice'),
				stoppeddynamicservice = $.t('stoppeddynamicservice');
			if ($("#switchDynamicWallpaper").val() === 'on' && prefValue !== 'on') {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Service started", "DynamicWallpaper", 1);
				// console.info("PhoneGap Plugin: DynamicWallpaper Service: started service.");
				toast(starteddynamicservice, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingDynamicWallpaper", "on", function () {
					serviceDynamicWallpaper("startService", "none");
				});
			} else if ($("#switchDynamicWallpaper").val() === 'off' && prefValue !== 'off') {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Service stopped", "DynamicWallpaper", 0);
				// console.info("PhoneGap Plugin: DynamicWallpaper Service: stop service.");
				toast(stoppeddynamicservice, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingDynamicWallpaper", "off", function () {
					serviceDynamicWallpaper("stopService", "none");
				});
			}
		});
	});
	$('#setDurationTimer').off("click").on("click",
		function () {
			var setdynamyctimerto = $.t('setdynamyctimerto'),
				minute = $.t('minute'),
				minutes = $.t('minutes'),
				hour = $.t('hour'),
				hours = $.t('hours'),
				durationTime = parseInt($("#durationTime").val(), 10),
				durationType = $("#durationType").val(),
				durationTimeMiliseconds = 0,
				durationTimeString = "";
			if (durationType === "min") {
				durationTimeMiliseconds = durationTime * 1000 * 60;
				if (durationTime > 1) {
					durationTimeString = minutes;
				} else {
					durationTimeString = minute;
				}
			} else if (durationType === "hour") {
				durationTimeMiliseconds = durationTime * 1000 * 60 * 60;
				if (durationTime > 1) {
					durationTimeString = hours;
				} else {
					durationTimeString = hour;
				}
			}
			// console.info("PhoneGap Plugin: DynamicWallpaper Service: set service timer.");
			toast(setdynamyctimerto + ': ' + durationTime + ' ' + durationTimeString, "short");
			serviceDynamicWallpaper('enableTimer', durationTimeMiliseconds);
		});
}

// init settings switches
function initSettingsSwitch() {
	$('#toggleWallColor1').off("click").on("click",
		function () {
			var defaultsetwallpapercolor = $.t('defaultsetwallpapercolor'),
				original = $.t('original');
			toast(defaultsetwallpapercolor + " " + original, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallColor", "original", function () {
				checkSettings();
			});
		});
	$('#toggleWallColor2').off("click").on("click",
		function () {
			var defaultsetwallpapercolor = $.t('defaultsetwallpapercolor'),
				grayscale = $.t('grayscale');
			toast(defaultsetwallpapercolor + " " + grayscale, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallColor", "grayscale", function () {
				checkSettings();
			});
		});
	$('#toggleWallColor3').off("click").on("click",
		function () {
			var defaultsetwallpapercolor = $.t('defaultsetwallpapercolor'),
				sepia = $.t('sepia');
			toast(defaultsetwallpapercolor + " " + sepia, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallColor", "sepia", function () {
				checkSettings();
			});
		});
	$('#toggleWallAspect1').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				fitheight = $.t('fitheight');
			toast(defaultsetwallpaperto + " " + fitheight, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallAspect", "height", function () {
				checkSettings();
			});
		});
	$('#toggleWallAspect2').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				fitwidth = $.t('fitwidth');
			toast(defaultsetwallpaperto + " " + fitwidth, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallAspect", "width", function () {
				checkSettings();
			});
		});
	$('#toggleWallAspect3').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				alwaysfillscreen = $.t('alwaysfillscreen');
			toast(defaultsetwallpaperto + " " + alwaysfillscreen, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallAspect", "autofill", function () {
				checkSettings();
			});
		});
	$('#toggleWallAspect4').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				alwaysfitwallpaper = $.t('alwaysfitwallpaper');
			toast(defaultsetwallpaperto + " " + alwaysfitwallpaper, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setWallAspect", "autofit", function () {
				checkSettings();
			});
		});
	$("#settingAutoBackup").off("change").on("change", function () {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoBackup", "", function (prefValue) {
			var enableautobackup = $.t('enableautobackup'),
				disableautobackup = $.t('disableautobackup');
			if ($("#settingAutoBackup").val() === 'on' && prefValue !== 'on') {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Enabled auto backup", "Favorites", 1);
				toast(enableautobackup, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoBackup", "on", function () {
					checkSettings();
				});
			} else if ($("#settingAutoBackup").val() === 'off' && prefValue !== 'off') {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Disabled auto backup", "Favorites", 0);
				toast(disableautobackup, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoBackup", "off", function () {
					checkSettings();
				});
			}
		});
	});
	$("#settingAutoCheckContent").off("change").on("change", function () {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckContent", "", function (prefValue) {
			var enablenotifyupdate = $.t('enablenotifyupdate'),
				disablenotifyupdate = $.t('disablenotifyupdate');
			if ($("#settingAutoCheckContent").val() === "on" && prefValue !== "on") {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Service started", "AutoChecker", 1);
				handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoCheckContent", "on", function () {
					toast(enablenotifyupdate, "short");
					serviceUpdateChecker("getStatus", "none");
					checkSettings();
				});
			} else if ($("#settingAutoCheckContent").val() === "off" && prefValue !== "off") {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Service stopped", "AutoChecker", 0);
				handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoCheckContent", "off", function () {
					toast(disablenotifyupdate, "short");
					serviceUpdateChecker("getStatus", "none");
					checkSettings();
				});
			}
		});
	});
	$("#settingAutoCheckApp").off("change").on("change", function () {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckApp", "", function (prefValue) {
			var enablenotifyappupdate = $.t('enablenotifyappupdate'),
				disablenotifyappupdate = $.t('disablenotifyappupdate');
			if ($("#settingAutoCheckApp").val() === "on" && prefValue !== "on") {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Enabled app update", "AutoChecker", 1);
				toast(enablenotifyappupdate, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoCheckApp", "on", function () {
					checkSettings();
				});
			} else if ($("#settingAutoCheckApp").val() === "off" && prefValue !== "off") {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Disabled app update", "AutoChecker", 0);
				toast(disablenotifyappupdate, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingAutoCheckApp", "off", function () {
					checkSettings();
				});
			}
		});
	});
	$("#settingGoogleAnalytics").off("change").on("change", function () {
		handleAndroidPreferences("get", window.androidPrefsLib, "settingGoogleAnalytics", "", function (prefValue) {
			var enablestats = $.t('enablestats'),
				disablestats = $.t('disablestats');
			if ($("#settingGoogleAnalytics").val() === "on" && prefValue !== "on") {
				toast(enablestats, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingGoogleAnalytics", "on", function () {
					gaPlugin.init(gaPluginResultHandler, gaPluginErrorHandler, window.gaAccount, 10);
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Enabled", "Google Analytics", 1);
					checkSettings();
				});
			} else if ($("#settingGoogleAnalytics").val() === "off" && prefValue !== "off") {
				toast(disablestats, "short");
				handleAndroidPreferences("set", window.androidPrefsLib, "settingGoogleAnalytics", "off", function () {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Disabled", "Google Analytics", 0);
					gaPlugin.exit(gaPluginResultHandler, gaPluginErrorHandler);
					checkSettings();
				});
			}
		});
	});
}

// init wallpaper settings switches
function initDynamicWallpaperSwitch() {
	$('#toggleDynamicWallColor1').off("click").on("click",
		function () {
			var defaultsetwallpapercolor = $.t('defaultsetwallpapercolor'),
				original = $.t('original');
			toast(defaultsetwallpapercolor + " " + original, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallColor", "original", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$('#toggleDynamicWallColor2').off("click").on("click",
		function () {
			var defaultsetwallpapercolor = $.t('defaultsetwallpapercolor'),
				grayscale = $.t('grayscale');
			toast(defaultsetwallpapercolor + " " + grayscale, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallColor", "grayscale", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$('#toggleDynamicWallColor3').off("click").on("click",
		function () {
			var defaultsetwallpapercolor = $.t('defaultsetwallpapercolor'),
				sepia = $.t('sepia');
			toast(defaultsetwallpapercolor + " " + sepia, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallColor", "sepia", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$('#toggleDynamicWallAspect1').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				fitheight = $.t('fitheight');
			toast(defaultsetwallpaperto + " " + fitheight, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallAspect", "height", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$('#toggleDynamicWallAspect2').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				fitwidth = $.t('fitwidth');
			toast(defaultsetwallpaperto + " " + fitwidth, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallAspect", "width", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$('#toggleDynamicWallAspect3').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				alwaysfillscreen = $.t('alwaysfillscreen');
			toast(defaultsetwallpaperto + " " + alwaysfillscreen, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallAspect", "autofill", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$('#toggleDynamicWallAspect4').off("click").on("click",
		function () {
			var defaultsetwallpaperto = $.t('defaultsetwallpaperto'),
				alwaysfitwallpaper = $.t('alwaysfitwallpaper');
			toast(defaultsetwallpaperto + " " + alwaysfitwallpaper, "short");
			handleAndroidPreferences("set", window.androidPrefsLib, "setDynamicWallAspect", "autofit", function () {
				checkDynamicWallpaperSettings();
			});
		});
	$("#settingServicePicturesFolder").off("change").on("change",
		function () {
			handleAndroidPreferences("get", window.androidPrefsLib, "includePicturesFolder", "", function (prefValue) {
				var includepicturesfolder = $.t('includepicturesfolder'),
					excludepicturesfolder = $.t('excludepicturesfolder');
				if ($("#settingServicePicturesFolder").val() === 'on' && prefValue !== "true") {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Include Pictures folder", "DynamicWallpaper", 1);
					toast(includepicturesfolder, "short");
					handleAndroidPreferences("set", window.androidPrefsLib, "includePicturesFolder", "true", function () {
						checkDynamicWallpaperSettings();
					});
				} else if ($("#settingServicePicturesFolder").val() === 'off' && prefValue !== "false") {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Exclude Pictures folder", "DynamicWallpaper", 0);
					toast(excludepicturesfolder, "short");
					handleAndroidPreferences("set", window.androidPrefsLib, "includePicturesFolder", "false", function () {
						checkDynamicWallpaperSettings();
					});
				}
			});
		});
	$("#settingServiceCameraFolder").off("change").on("change",
		function () {
			handleAndroidPreferences("get", window.androidPrefsLib, "includeCameraFolder", "", function (prefValue) {
				var includecamerafolder = $.t('includecamerafolder'),
					excludecamerafolder = $.t('excludecamerafolder');
				if ($("#settingServiceCameraFolder").val() === 'on' && prefValue !== "true") {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Include Camera folder", "DynamicWallpaper", 1);
					toast(includecamerafolder, "short");
					handleAndroidPreferences("set", window.androidPrefsLib, "includeCameraFolder", "true", function () {
						checkDynamicWallpaperSettings();
					});
				} else if ($("#settingServiceCameraFolder").val() === 'off' && prefValue !== "false") {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Exclude Camera folder", "DynamicWallpaper", 0);
					toast(excludecamerafolder, "short");
					handleAndroidPreferences("set", window.androidPrefsLib, "includeCameraFolder", "false", function () {
						checkDynamicWallpaperSettings();
					});
				}
			});
		});
	$("#settingServiceDroidPapersFolder").off("change").on("change",
		function () {
			handleAndroidPreferences("get", window.androidPrefsLib, "excludeDroidPapersFolder", "", function (prefValue) {
				var includedroidpapersfolder = $.t('includedroidpapersfolder'),
					excludedroidpapersfolder = $.t('excludedroidpapersfolder');
				if ($("#settingServiceDroidPapersFolder").val() === 'on' && prefValue !== "true") {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Exclude DroidPapers folder", "DynamicWallpaper", 1);
					toast(excludedroidpapersfolder, "short");
					handleAndroidPreferences("set", window.androidPrefsLib, "excludeDroidPapersFolder", "true", function () {
						checkDynamicWallpaperSettings();
					});
				} else if ($("#settingServiceDroidPapersFolder").val() === 'off' && prefValue !== "false") {
					gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Switch", "Include DroidPapers folder", "DynamicWallpaper", 0);
					toast(includedroidpapersfolder, "short");
					handleAndroidPreferences("set", window.androidPrefsLib, "excludeDroidPapersFolder", "false", function () {
						checkDynamicWallpaperSettings();
					});
				}
			});
		});
}

// UpdateChecker Service
function serviceUpdateChecker(action, input) {
	var updatechecker = cordova.require('cordova/plugin/updatechecker');
	if (action === "getStatus") {
		updatechecker.getStatus(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "runOnce") {
		updatechecker.runOnce(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "startService") {
		updatechecker.startService(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "stopService") {
		updatechecker.stopService(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "registerForBootStart") {
		updatechecker.registerForBootStart(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "deregisterForBootStart") {
		updatechecker.deregisterForBootStart(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "enableTimer") {
		updatechecker.enableTimer(
			input,
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	} else if (action === "disableTimer") {
		updatechecker.disableTimer(
			function (r) { handleUpdateCheckerSuccess(r); },
			function (e) { handleUpdateCheckerError(e); }
		);
	}
}
// handlers for service
function handleUpdateCheckerError(data) {
	console.error("PhoneGap Plugin: UpdateChecker Service: Error: " + data.ErrorMessage);
}
function handleUpdateCheckerSuccess(data) {
	handleAndroidPreferences("get", window.androidPrefsLib, "settingAutoCheckContent", "", function (prefValue) {
		if (!data.ServiceRunning && prefValue === "on") {
			// console.info("PhoneGap Plugin: UpdateChecker Service: started service.");
			serviceUpdateChecker("startService", "none");
		} else if (data.ServiceRunning && prefValue === "on") {
			if (data.TimerEnabled && !data.RegisteredForBootStart) {
				// console.info("PhoneGap Plugin: UpdateChecker Service: registered service for boot start.");
				serviceUpdateChecker("registerForBootStart", "none");
			} else if (!data.TimerEnabled) {
				// console.info("PhoneGap Plugin: UpdateChecker Service: enable service timer on 24 hours.");
				serviceUpdateChecker("enableTimer", 86400000);
			} else if (data.TimerMilliseconds !== 86400000) {
				// console.info("PhoneGap Plugin: UpdateChecker Service: set service timer on 24 hours.");
				serviceUpdateChecker("enableTimer", 86400000);
			}
		} else if (prefValue === "off") {
			if (data.ServiceRunning && data.TimerEnabled) {
				// console.info("PhoneGap Plugin: UpdateChecker Service: disable service timer.");
				serviceUpdateChecker("disableTimer", "none");
			} else if (data.ServiceRunning && data.RegisteredForBootStart) {
				// console.info("PhoneGap Plugin: UpdateChecker Service: de-registered service for boot start.");
				serviceUpdateChecker("deregisterForBootStart", "none");
			} else if (data.ServiceRunning && !data.TimerEnabled && !data.RegisteredForBootStart) {
				// console.info("PhoneGap Plugin: UpdateChecker Service: stop service.");
				serviceUpdateChecker("stopService", "none");
			}
		}
	});
}

/* END PhoneGap plugins services functions */