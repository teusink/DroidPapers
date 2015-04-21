// JSLint, include this before tests
// var cordova, CreateBackgroundService;

/* PhoneGap service constructors */

// Dynamic Wallpaper
cordova.define('cordova/plugin/dynamicwallpaper', function (require, exports, module) {
	CreateBackgroundService('org.teusink.droidpapers.ServiceDynamicWallpaper', require, exports, module); // JSLint error "Missing 'new' is oke here 
});

// UpdateChecker
cordova.define('cordova/plugin/updatechecker', function (require, exports, module) {
	CreateBackgroundService('org.teusink.droidpapers.ServiceUpdateChecker', require, exports, module); // JSLint error "Missing 'new' is oke here
});

/* PhoneGap plugin constructors */

// AndroidPreferences
cordova.define("cordova/plugin/androidpreferences", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        get: function (message, win, fail) {
			exec(win, fail, "AndroidPreferences", "get", [message]);
		},
		set: function (message, win, fail) {
			exec(win, fail, "AndroidPreferences", "set", [message]);
		}
    };
});

// Appstore
cordova.define("cordova/plugin/appstore", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        show: function (message, win, fail) {
			exec(win, fail, "Appstore", "show", [message]);
		},
		check: function (win, fail) {
			exec(win, fail, "Appstore", "check", []);
		}
    };
});

// MuzeiExtension
cordova.define("cordova/plugin/muzeiextension", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        show: function (win, fail) {
			exec(win, fail, "MuzeiExtension", "show", []);
		}
    };
});

// CacheCleaner
cordova.define("cordova/plugin/cachecleaner", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        del: function (win, fail) {
			exec(win, fail, "CacheCleaner", "del", []);
		}
    };
});

// CheckDownload
cordova.define("cordova/plugin/checkdownload", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        check: function (message, win, fail) {
			exec(win, fail, "CheckDownload", "check", [message]);
		}
    };
});

// CurrentRingtone
cordova.define("cordova/plugin/currentringtone", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        play: function (message, win, fail) {
            exec(win, fail, "CurrentRingtone", "play", [message]);
        },
        stop: function (win, fail) {
            exec(win, fail, "CurrentRingtone", "stop", []);
        },
		check:  function (win, fail) {
			exec(win, fail, "CurrentRingtone", "check", []);
		}
    };
});

// DeleteCached
cordova.define("cordova/plugin/deletecached", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        del: function (message, win, fail) {
			exec(win, fail, "DeleteCached", "del", [message]);
		}
    };
});

// DeleteDownloaded
cordova.define("cordova/plugin/deletedownloaded", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        del: function (message, win, fail) {
			exec(win, fail, "DeleteDownloaded", "del", [message]);
		}
    };
});

// Downloader
cordova.define("cordova/plugin/downloader", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        get: function (message, win, fail) {
			exec(win, fail, "Downloader", "get", [message]);
		}
    };
});

// PackageVersion
cordova.define("cordova/plugin/packageversion", function (require, exports, module) {
	var exec = require("cordova/exec");
	module.exports = {
		get: function (win, fail) {
			exec(win, fail, "PackageVersion", "get", []);
		}
	};
});

// PreferredScreenSize
cordova.define("cordova/plugin/preferredscreensize", function (require, exports, module) {
	var exec = require("cordova/exec");
	module.exports = {
		set: function (message, win, fail) {
			exec(win, fail, "PreferredScreenSize", "set", [message]);
		},
		get: function (win, fail) {
			exec(win, fail, "PreferredScreenSize", "get", []);
		},
		getSystem: function (win, fail) {
			exec(win, fail, "PreferredScreenSize", "getSystem", []);
		}
	};
});

// Share
cordova.define("cordova/plugin/share", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        show: function (message, win, fail) {
			exec(win, fail, "Share", "show", [message]);
		}
    };
});

// Toasts
cordova.define("cordova/plugin/toasts", function (require, exports, module) {
    var exec = require("cordova/exec");
	module.exports = {
        showShort: function (message, win, fail) {
            exec(win, fail, "Toasts", "show_short", [message]);
        },
        showLong: function (message, win, fail) {
            exec(win, fail, "Toasts", "show_long", [message]);
        },
        cancel: function (win, fail) {
            exec(win, fail, "Toasts", "cancel", []);
        }
    };
});
/* END PhoneGap constructors */