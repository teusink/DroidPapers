package org.teusink.plugins;

import java.io.File;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Environment;
import android.util.Log;

public class CheckDownload extends CordovaPlugin {

	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "CheckDownload Plugin: ";

	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callbackContext) {
		if (action.equals("check")) {
			cordova.getThreadPool().execute(new Runnable() {
				@Override
				public void run() {
					try {
						final JSONObject params = args.getJSONObject(0);
						final String fileInput = params.getString("file");
						final String ringType = params.getString("ringType");
						final String fileName = fileInput.substring(fileInput
								.lastIndexOf("/") + 1);
						final String fileExtension = fileName
								.substring(fileName.lastIndexOf(".") + 1);
						String dirName = Environment
								.getExternalStorageDirectory()
								.getAbsolutePath()
								+ "/Download/";
						if (fileExtension.equals("jpg")
								|| fileExtension.equals("png")) {
							dirName = Environment.getExternalStorageDirectory()
									.getAbsolutePath()
									+ "/Pictures/DroidPapers/";
						} else if (fileExtension.equals("ogg")
								|| fileExtension.equals("mp3")) {
							if (ringType.equals("alarm")) {
								dirName = Environment
										.getExternalStorageDirectory()
										.getAbsolutePath()
										+ "/Alarms/DroidPapers/";
							} else if (ringType.equals("notification")) {
								dirName = Environment
										.getExternalStorageDirectory()
										.getAbsolutePath()
										+ "/Notifications/DroidPapers/";
							} else if (ringType.equals("ringtone")) {
								dirName = Environment
										.getExternalStorageDirectory()
										.getAbsolutePath()
										+ "/Ringtones/DroidPapers/";
							}
						} else {
							dirName = Environment.getExternalStorageDirectory()
									.getAbsolutePath()
									+ "/Download/DroidPapers/";
						}
						final File file = new File(dirName, fileName);
						if (file.exists()) {
							callbackContext.sendPluginResult(new PluginResult(
									PluginResult.Status.OK, true));
						} else {
							callbackContext.sendPluginResult(new PluginResult(
									PluginResult.Status.OK, false));
						}
					} catch (final JSONException e) {
						e.printStackTrace();
						Log.e(LOG_PROV, LOG_NAME + "Error: "
								+ PluginResult.Status.JSON_EXCEPTION);
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.JSON_EXCEPTION));
					}
				}
			});
			return true;
		} else {
			Log.e(LOG_PROV, LOG_NAME + "Error: "
					+ PluginResult.Status.INVALID_ACTION);
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.INVALID_ACTION));
			return false;
		}
	}
}