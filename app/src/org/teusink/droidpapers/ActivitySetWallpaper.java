package org.teusink.droidpapers;

import org.apache.cordova.CordovaActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;

public class ActivitySetWallpaper extends CordovaActivity {

	public static final String PREFS_NAME = "DroidPapersPrefs";

	@SuppressLint("NewApi")
	@Override
	public void onCreate(final Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.init();
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
			if (0 != (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE)) {
				WebView.setWebContentsDebuggingEnabled(true);
			}
		}
		final SharedPreferences settings = getSharedPreferences(PREFS_NAME,
				Context.MODE_PRIVATE);
		final String preferScreenSize = settings.getString("preferScreenSize",
				"");
		if (preferScreenSize != null && preferScreenSize.equals("smartphone")) {
			initiateApp("smartphone");
		} else if (preferScreenSize != null
				&& preferScreenSize.equals("tablet")) {
			initiateApp("tablet");
		} else {
			if (checkScreenSize().equals("large")
					|| checkScreenSize().equals("xlarge")) {
				initiateApp("tablet");
			} else {
				initiateApp("smartphone");
			}
		}
	}

	private void initiateApp(final String screenSize) {
		if (screenSize.equals("tablet")) {
			super.loadUrl("file:///android_asset/www/set_wallpaper.html");
		} else {
			super.loadUrl("file:///android_asset/www/set_wallpaper.html");
		}
	}

	private String checkScreenSize() {
		String screenSize = "normal";
		if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
			screenSize = "xlarge";
		} else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
			screenSize = "large";
		} else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_NORMAL) {
			screenSize = "normal";
		} else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_SMALL) {
			screenSize = "small";
		} else {
			screenSize = "normal";
		}
		return screenSize;
	}
}
