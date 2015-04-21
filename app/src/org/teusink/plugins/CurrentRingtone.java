package org.teusink.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

public class CurrentRingtone extends CordovaPlugin {

	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "CurrentRingtone Plugin: ";

	private Uri sound = null;
	private Ringtone r = null;

	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callbackContext) {
		cordova.getThreadPool().execute(new Runnable() {
			@Override
			public void run() {
				if (action.equals("stop")) {
					stopSound();
				} else if (action.equals("play")) {
					try {
						final String type = args.getString(0);
						if (action.equals("play")) {
							playSound(type);
						}
					} catch (final JSONException e) {
						Log.e(LOG_PROV, LOG_NAME + "Error: "
								+ PluginResult.Status.JSON_EXCEPTION);
						e.printStackTrace();
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.JSON_EXCEPTION));
					}
				} else if (action.equals("check")) {
					if (r != null && r.isPlaying()) {
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.OK, true));
					} else {
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.OK, false));
					}
				}
				callbackContext.sendPluginResult(new PluginResult(
						PluginResult.Status.OK));
			}
		});
		return true;
	}

	private void playSound(final String type) {
		if (r != null && r.isPlaying()) {
			r.stop();
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.stopplaycurrent)
							+ " " + type + ".", "short");
		} else {
			if (type.equals("alarm")) {
				sound = RingtoneManager
						.getDefaultUri(RingtoneManager.TYPE_ALARM);
			} else if (type.equals("notification")) {
				sound = RingtoneManager
						.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
			} else if (type.equals("ringtone")) {
				sound = RingtoneManager
						.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
			}
			if (sound != null) {
				r = RingtoneManager.getRingtone(cordova.getActivity()
						.getBaseContext(), sound);
				if (r != null) {
					if (!r.isPlaying()) {
						r.play();
						showToast(
								cordova.getActivity()
								.getResources()
								.getString(
										org.teusink.droidpapers.R.string.startplaycurrent)
										+ " " + type + ".", "short");
					}
				}
			} else {
				showToast(
						cordova.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.nodefaultset)
								+ ": " + type, "short");
			}
		}
	}

	private void stopSound() {
		if (r != null && r.isPlaying()) {
			r.stop();
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.stopplaycurrentsound),
					"short");
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