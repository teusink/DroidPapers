/* PhoneGap plugin functions */

// empty callback for callback functions
function emptyCallback() {
}

// AndroidPreferences
function handleAndroidPreferences(action, prefLib, prefName, prefValue, callback) {
	var androidPref = cordova.require("cordova/plugin/androidpreferences"),
		value;
	if (prefLib !== "" && prefName !== "") {
		if (action === "get") {
			androidPref.get(
				{preferenceLib: prefLib, preferenceName: prefName, preferenceValue: prefValue},
				function (returnValue) {
					// console.info("PhoneGap Plugin: AndroidPreferences: callback success");
					value = returnValue;
					callback(value);
				},
				function () {
					console.error("PhoneGap Plugin: AndroidPreferences: callback error");
					value = "";
					callback(value);
				}
			);
		} else if (action === "set") {
			androidPref.set(
				{preferenceLib: prefLib, preferenceName: prefName, preferenceValue: prefValue},
				function () {
					// console.info("PhoneGap Plugin: AndroidPreferences: callback success");
					value = "";
					callback(value);
				},
				function () {
					console.error("PhoneGap Plugin: AndroidPreferences: callback error");
					value = "";
					callback(value);
				}
			);
		}
	}
}

// Appstore
function appstore(link, type) {
	var appstores = cordova.require("cordova/plugin/appstore");
	appstores.show(
		{link: link, type: type},
		function () {
			// console.info("PhoneGap Plugin: Appstore: show: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: Appstore: show: callback error");
		}
	);
}

// Appstore check
function appstoreCheck(callback) {
	var appstores = cordova.require("cordova/plugin/appstore");
	appstores.check(
		function (appstore) {
			// console.info("PhoneGap Plugin: Appstore: check: callback success");
			callback(appstore);
		},
		function () {
			console.error("PhoneGap Plugin: Appstore: check: callback error");
			callback("unknown");
		}
	);
}

// CacheCleaner
function deleteEntireCache() {
	var cachecleaner = cordova.require("cordova/plugin/cachecleaner");
	cachecleaner.del(
		function () {
			// console.info("PhoneGap Plugin: CacheCleaner: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: CacheCleaner: callback error");
		}
	);
}

// CheckDownload
function checkDownload(file, ringType, callback) {
	var checkdownload = cordova.require("cordova/plugin/checkdownload"),
		downloadExists;
	checkdownload.check(
		{file: file, ringType: ringType},
		function (exists) {
			// console.info("PhoneGap Plugin: CheckDownload: callback success");
			downloadExists = exists;
			callback(downloadExists);
		},
		function () {
			console.error("PhoneGap Plugin: CheckDownload: callback error");
			callback(false);
		}
	);
}

function deleteDownloadedFolder(dir) {
	var deletedownloaded = cordova.require("cordova/plugin/deletedownloaded");
	deletedownloaded.del(
		{directory: dir},
		function () {
			// console.info("PhoneGap Plugin: DeleteDownloaded: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: DeleteDownloaded: callback error");
		}
	);
}

// CurrentRingtone
function currentRingtone(type, action, callback) {
	var currentRing = cordova.require("cordova/plugin/currentringtone");
	if (action === "play") {
		currentRing.play(
			type,
			function () {
				// console.info("PhoneGap Plugin: CurrentRingtone play: callback success");
				callback(false);
			},
			function () {
				console.error("PhoneGap Plugin: CurrentRingtone play: callback error");
				callback(false);
			}
		);
	} else if (action === "stop") {
		currentRing.stop(
			function () {
				// console.info("PhoneGap Plugin: CurrentRingtone stop: callback success");
				callback(true);
			},
			function () {
				console.error("PhoneGap Plugin: CurrentRingtone stop: callback error");
				callback(false);
			}
		);
	} else if (action === "check") {
		currentRing.check(
			function (playing) {
				// console.info("PhoneGap Plugin: CurrentRingtone check: callback success");
				callback(playing);
			},
			function () {
				console.error("PhoneGap Plugin: CurrentRingtone check: callback error");
				callback(false);
			}
		);
	}
}

// DeleteCached
function deleteCachedFile(file, ringType) {
	var deletecached = cordova.require("cordova/plugin/deletecached");
	deletecached.del(
		{file: file, ringType: ringType},
		function () {
			// console.info("PhoneGap Plugin: DeleteCached: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: DeleteCached: callback error");
		}
	);
}

// Downloader
function download(url, overwrite, setWall, setWallAsp, setWallCol, setRing, ringType, ringName) {
	var downloader = cordova.require("cordova/plugin/downloader");
	downloader.get(
		{url: url, overwrite: overwrite, setWallpaper: setWall, setWallAspect: setWallAsp, setWallColor: setWallCol, setRingtone: setRing, ringType: ringType, ringName: ringName},
		function () {
			// console.info("PhoneGap Plugin: Downloader: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: Downloader: callback error");
		}
	);
}

// MuzeiExtension
function muzeiExtension() {
	var muzeiextensions = cordova.require("cordova/plugin/muzeiextension");
	muzeiextensions.show(
		function () {
			// console.info("PhoneGap Plugin: MuzeiExtension: show: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: MuzeiExtension: show: callback error");
		}
	);
}

// PackageVersion
function getPackageVersion(callback) {
	var packageVersion = cordova.require("cordova/plugin/packageversion"),
		currentVersion;
	packageVersion.get(
		function (version) {
			// console.info("PhoneGap Plugin: PackageVersion: callback success");
			currentVersion = version;
			callback(currentVersion);
		},
		function () {
			console.error("PhoneGap Plugin: PackageVersion: callback error");
			currentVersion = "unknown";
			callback(currentVersion);
		}
	);
}

// PreferredScreenSize
function handlePreferredScreenSize(callback) {
	var preferredScreenSize = cordova.require("cordova/plugin/preferredscreensize"),
		screenSize = "unknown";
	preferredScreenSize.getSystem(
		function (currentScreenSize) {
			// console.info("PhoneGap Plugin: PreferredScreenSize: callback success");
			screenSize = currentScreenSize;
			callback(screenSize);
		},
		function () {
			console.error("PhoneGap Plugin: PreferredScreenSize: callback error");
			screenSize = "unknown";
			callback(screenSize);
		}
	);
}

// Share
function share(subject, text) {
	var shares = cordova.require("cordova/plugin/share");
	shares.show(
		{subject: subject, text: text},
		function () {
			// console.info("PhoneGap Plugin: Share: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: Share: callback error");
		}
	);
}

// Toasts
function toast(text, duration) {
	var toasts = cordova.require("cordova/plugin/toasts");
	if (duration === "short") {
		toasts.showShort(
			text,
			function () {
				// console.info("PhoneGap Plugin: Toasts short: callback success");
			},
			function () {
				console.error("PhoneGap Plugin: Toasts short: callback error");
			}
		);
	} else if (duration === "long") {
		toasts.showLong(
			text,
			function () {
				// console.info("PhoneGap Plugin: Toasts long: callback success");
			},
			function () {
				console.error("PhoneGap Plugin: Toasts long: callback error");
			}
		);
	} else {
		toasts.cancel(
			function () {
				// console.info("PhoneGap Plugin: Toasts cancel: callback success");
			},
			function () {
				console.error("PhoneGap Plugin: Toasts cancel: callback error");
			}
		);
	}
}
/* END PhoneGap plugins functions */