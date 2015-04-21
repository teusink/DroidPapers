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
import android.widget.Toast;

public class DeleteDownloaded extends CordovaPlugin {

	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "DeleteDownloaded Plugin: ";

	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callbackContext) {
		if (action.equals("del")) {
			cordova.getThreadPool().execute(new Runnable() {
				@Override
				public void run() {
					try {
						final JSONObject params = args.getJSONObject(0);
						final String directory = params
								.getString("directory");
						final File dir = new File (Environment.getExternalStorageDirectory()
								.getAbsolutePath()
								+ "/" + directory + "/DroidPapers/");
						if (dir != null && dir.isDirectory()) {
							deleteDir(dir);
							showToast(
									cordova.getActivity()
									.getResources()
									.getString(
											org.teusink.droidpapers.R.string.cachedeleted),
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
					} catch (final Exception e) {
						e.printStackTrace();
						Log.e(LOG_PROV, LOG_NAME + "Error: "
								+ PluginResult.Status.ERROR);
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.ERROR));
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

	public static boolean deleteDir(final File dir) {
		if (dir != null && dir.isDirectory()) {
			final String[] children = dir.list();
			for (int i = 0; i < children.length; i++) {
				final boolean success = deleteDir(new File(dir, children[i]));
				if (!success) {
					return false;
				}
			}
		}
		return dir.delete();
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