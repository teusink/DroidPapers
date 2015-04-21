package org.teusink.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;

import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;

public class MuzeiExtension extends CordovaPlugin {

	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "Appstore Plugin: ";

	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callbackContext) {
		cordova.getThreadPool().execute(new Runnable() {
			@Override
			public void run() {
				if (action.equals("show")) {
					final String muzeiExtension = "org.teusink.droidpapers.muzei";
					final String muzeiExtensionActivity = "org.teusink.droidpapers.muzei.DroidPapersSettings";
					final Intent intent = new Intent(Intent.ACTION_VIEW);
					if (appInstalledOrNot(muzeiExtension) == true) {
						intent.setComponent(new ComponentName(muzeiExtension, muzeiExtensionActivity));
					} else {
						if (appInstalledOrNot("com.amazon.venezia") == true) {
							// org.teusink.droidpapers
							intent.setData(Uri
									.parse("amzn://apps/android?p="
											+ muzeiExtension));
						} else if (appInstalledOrNot("com.android.vending") == true) {
							// org.teusink.droidpapers
							intent.setData(Uri.parse("market://details?id="
									+ muzeiExtension));
						} else {
							// org.teusink.droidpapers
							// intent.setData(Uri.parse("https://play.google.com/store/apps/details?id="
							// + appstoreLink));
							intent.setData(Uri
									.parse("http://droidpapers.teusink.org/about.php"));
						}
					}
					try {
						cordova.getActivity().startActivityForResult(
								intent, 0);
					} catch (final ActivityNotFoundException e) {
						Log.e(LOG_PROV, LOG_NAME + "Error: "
								+ PluginResult.Status.ERROR);
						e.printStackTrace();
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.ERROR));
					}
					callbackContext.sendPluginResult(new PluginResult(
							PluginResult.Status.OK));
				} else if (action.equals("check")) {
					String appstore = "unknown";
					if (appInstalledOrNot("com.amazon.venezia")) {
						appstore = "amazon";
					} else if (appInstalledOrNot("com.android.vending")) {
						appstore = "google";
					}
					callbackContext.sendPluginResult(new PluginResult(
							PluginResult.Status.OK, appstore));
				} else {
					Log.e(LOG_PROV, LOG_NAME + "Error: "
							+ PluginResult.Status.INVALID_ACTION);
					callbackContext.sendPluginResult(new PluginResult(
							PluginResult.Status.INVALID_ACTION));
				}
			}
		});
		return true;
	}

	private boolean appInstalledOrNot(final String uri) {
		final PackageManager manager = cordova.getActivity()
				.getPackageManager();
		boolean app_installed = false;
		try {
			manager.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
			app_installed = true;
		} catch (final PackageManager.NameNotFoundException e) {
			app_installed = false;
		}
		return app_installed;
	}
}