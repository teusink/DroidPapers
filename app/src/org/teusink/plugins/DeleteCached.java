package org.teusink.plugins;

import java.io.File;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

public class DeleteCached extends CordovaPlugin {

	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "DeleteCached Plugin: ";

	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callbackContext) {
		if (action.equals("del")) {
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
							file.delete();
							if (fileExtension.equals("ogg")
									|| fileExtension.equals("mp3")) {
								final Uri uri = MediaStore.Audio.Media
										.getContentUriForPath(file
												.getAbsolutePath());
								cordova.getActivity()
								.getContentResolver()
								.delete(uri,
										"_data = '"
												+ file.getAbsolutePath()
												+ "'", null);
							}
							showToast(
									cordova.getActivity()
									.getResources()
									.getString(
											org.teusink.droidpapers.R.string.localfiledeleted),
									"short");
						} else {
							showToast(
									cordova.getActivity()
									.getResources()
									.getString(
											org.teusink.droidpapers.R.string.filenotondevice),
									"short");
						}
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.OK));
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

	private void showToast(final String message, final String duration) {
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (duration.equals("long")) {
					Toast.makeText(cordova.getActivity(), message,
							Toast.LENGTH_LONG).show();
				} else {
					Toast.makeText(cordova.getActivity(), message,
							Toast.LENGTH_SHORT).show();
				}
			}
		});
	}
}