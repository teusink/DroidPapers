package org.teusink.droidpapers;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.joda.time.DateTime;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Handler;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

public class ServiceUpdateChecker extends BackgroundService {

	private String configSetting = "";

	public static final String PREFS_NAME = "DroidPapersPrefs";
	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "UpdateChecker Service: ";

	// SERVICE_URL + API_FILE + "?key=" + API_KEY + "&action=" + API_COMMAND
	// http://droidpapers.teusink.org/api/dp.api.v4.php?key=69b92f8de7a1724820fdaca1ec545d9f&action=appsyncversion
	public static final String SERVICE_URL = "http://droidpapers.teusink.org/api/";
	public static final String API_FILE = "dp.api.v4.php";
	public static final String API_KEY = "69b92f8de7a1724820fdaca1ec545d9f";
	public static final String API_COMMAND = "appsyncversion";
	public static final String FULL_API = SERVICE_URL + API_FILE + "?key="
			+ API_KEY + "&action=" + API_COMMAND;

	final Handler handler = new Handler();

	@Override
	protected JSONObject doWork() {
		final JSONObject result = new JSONObject();
		final DateTime today = new DateTime();
		final String msg = "UpdateChecker service last ran on: " + today;
		checkWork();
		try {
			result.put("Message", msg);
		} catch (final JSONException e) {
			Log.e(LOG_PROV, LOG_NAME + "JSONException Error");
			e.printStackTrace();
		}
		Log.i(LOG_PROV, LOG_NAME + msg);
		return result;
	}

	@Override
	protected JSONObject getConfig() {
		final JSONObject result = new JSONObject();
		try {
			result.put("mConfig", this.configSetting);
		} catch (final JSONException e) {
			Log.e(LOG_PROV, LOG_NAME + "JSONException Error");
			e.printStackTrace();
		}
		return result;
	}

	@Override
	protected void setConfig(final JSONObject config) {
		try {
			if (config.has("mConfig")) {
				this.configSetting = config.getString("mConfig");
			}
		} catch (final JSONException e) {
			Log.e(LOG_PROV, LOG_NAME + "JSONException Error");
			e.printStackTrace();
		}

	}

	@Override
	protected JSONObject initialiseLatestResult() {
		return null;
	}

	@Override
	protected void onTimerEnabled() {
	}

	@Override
	protected void onTimerDisabled() {
	}

	private void checkWork() {
		final SharedPreferences settings = getSharedPreferences(PREFS_NAME,
				Context.MODE_PRIVATE);
		final String settingAutoCheckContent = settings.getString(
				"settingAutoCheckContent", "");
		if (isOnline() && settingAutoCheckContent.equals("on")) {
			final JSONObject json = getJSONfromURL(FULL_API);
			if (json != null) {
				try {
					final JSONArray items = json.getJSONArray("items");
					final JSONObject e = items.getJSONObject(0);
					final String fVersion = e.getString("version");
					final String fNotes = e.getString("notes");
					final String fAppVersion = e.getString("app");
					final String currentVersion = settings.getString(
							"currentVersion", "");
					final String localContentVersion = settings.getString(
							"localContentVersion", "");
					final String currentAppVersion = settings.getString(
							"currentAppVersion", "");
					final String autoCheckApp = settings.getString(
							"settingAutoCheckApp", "");
					final SharedPreferences.Editor editor = settings.edit();
					if ((!fVersion.equals(currentVersion) || currentVersion == "")
							&& (!fVersion.equals(localContentVersion) || localContentVersion == "")
							&& !fVersion.equals("") && !fNotes.equals("")) {
						editor.putString("currentVersion", fVersion);
						editor.commit();
						handler.post(new Runnable() {
							@Override
							public void run() {
								String notificationTitle = "";
								String notificationMessage = "";
								final Intent intent = new Intent(
										Intent.ACTION_MAIN);
								intent.setClass(getApplicationContext(),
										ActivityMain.class);
								intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
								final PendingIntent pend = PendingIntent
										.getActivity(
												getApplicationContext(),
												0,
												intent,
												PendingIntent.FLAG_UPDATE_CURRENT);
								final NotificationManager mNotifyManager = (NotificationManager) getApplicationContext()
										.getSystemService(
												Context.NOTIFICATION_SERVICE);
								if (currentVersion == null
										|| currentVersion.equals("")) {
									notificationTitle = getApplicationContext()
											.getResources()
											.getString(
													org.teusink.droidpapers.R.string.app_name)
													+ ": "
													+ getApplicationContext()
													.getResources()
													.getString(
															org.teusink.droidpapers.R.string.initcontent);
									notificationMessage = getApplicationContext()
											.getResources()
											.getString(
													org.teusink.droidpapers.R.string.initcontentmessage);
								} else {
									notificationTitle = getApplicationContext()
											.getResources()
											.getString(
													org.teusink.droidpapers.R.string.app_name)
													+ ":  "
													+ getApplicationContext()
													.getResources()
													.getString(
															org.teusink.droidpapers.R.string.contentupdate)
															+ " " + fVersion;
									notificationMessage = fNotes;
								}
								final NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
										getApplicationContext())
								.setSmallIcon(
										R.drawable.ic_stat_icon_notification)
										.setContentTitle(notificationTitle)
										.setContentText(notificationMessage);
								final NotificationCompat.BigTextStyle bigTextStyle = new NotificationCompat.BigTextStyle();
								bigTextStyle
								.setBigContentTitle(notificationTitle);
								bigTextStyle.bigText(notificationMessage);
								mBuilder.setStyle(bigTextStyle);
								mBuilder.setContentIntent(pend);
								mBuilder.setAutoCancel(true);
								mNotifyManager.notify(100, mBuilder.build());
								Log.i(LOG_PROV, LOG_NAME
										+ "Checked for content update");
							}
						});
					} else if (fVersion.equals("") && fNotes.equals("")) {
						Log.e(LOG_PROV, LOG_NAME
								+ "API seems offline or returns no data");
					}
					if ((!fAppVersion.equals(currentAppVersion) || currentAppVersion == "")
							&& compareAppVersion(fAppVersion) == true
							&& autoCheckApp.equals("on")
							&& !fAppVersion.equals("")) {
						editor.putString("currentAppVersion", fAppVersion);
						editor.commit();
						handler.post(new Runnable() {
							@Override
							public void run() {
								final String notificationTitle = getApplicationContext()
										.getResources()
										.getString(
												org.teusink.droidpapers.R.string.app_name)
												+ ": "
												+ getApplicationContext()
												.getResources()
												.getString(
														org.teusink.droidpapers.R.string.appupdate)
														+ " " + fAppVersion;
								final String notificationMessage = getApplicationContext()
										.getResources()
										.getString(
												org.teusink.droidpapers.R.string.appupdatemessage);
								final Intent intent = new Intent(
										Intent.ACTION_VIEW);
								if (appInstalledOrNot("com.amazon.venezia")) {
									intent.setData(Uri
											.parse("amzn://apps/android?p=org.teusink.droidpapers"));
								} else if (appInstalledOrNot("com.android.vending")) {
									intent.setData(Uri
											.parse("market://details?id=org.teusink.droidpapers"));
								} else {
									intent.setData(Uri
											.parse("http://droidpapers.teusink.org/apk/DroidPapers2.apk"));
								}
								intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
								final PendingIntent pend = PendingIntent
										.getActivity(
												getApplicationContext(),
												0,
												intent,
												PendingIntent.FLAG_UPDATE_CURRENT);
								final NotificationManager mNotifyManager = (NotificationManager) getApplicationContext()
										.getSystemService(
												Context.NOTIFICATION_SERVICE);
								final NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
										getApplicationContext())
								.setSmallIcon(
										R.drawable.ic_stat_icon_notification)
										.setContentTitle(notificationTitle)
										.setContentText(notificationMessage);
								final NotificationCompat.BigTextStyle bigTextStyle = new NotificationCompat.BigTextStyle();
								bigTextStyle
								.setBigContentTitle(notificationTitle);
								bigTextStyle.bigText(notificationMessage);
								mBuilder.setStyle(bigTextStyle);
								mBuilder.setContentIntent(pend);
								mBuilder.setAutoCancel(true);
								mNotifyManager.notify(101, mBuilder.build());
								Log.i(LOG_PROV, LOG_NAME
										+ "Checked for app update");
							}
						});
					} else if (fAppVersion.equals("")) {
						Log.e(LOG_PROV, LOG_NAME
								+ "API seems offline or returns no data");
					}
				} catch (final JSONException e) {
					Log.e(LOG_PROV,
							LOG_NAME + "Error parsing data " + e.toString());
				}
			}
		} else if (!settingAutoCheckContent.equals("on")) {
			Log.i(LOG_PROV, LOG_NAME + "Service is not set to \"on\"");
		}
	}

	public static JSONObject getJSONfromURL(final String url) {
		try {
			final HttpClient httpclient = new DefaultHttpClient();
			final HttpPost httppost = new HttpPost(url);
			final HttpResponse response = httpclient.execute(httppost);
			final HttpEntity entity = response.getEntity();
			final InputStream is = entity.getContent();
			final BufferedReader reader = new BufferedReader(
					new InputStreamReader(is, "iso-8859-1"), 8);
			final StringBuilder sb = new StringBuilder();
			String line = null;
			while ((line = reader.readLine()) != null) {
				sb.append(line + "\n");
			}
			is.close();
			final String result = sb.toString();
			final JSONObject jArray = new JSONObject(result);
			return jArray;
		} catch (final Exception e) {
			Log.e(LOG_PROV,
					LOG_NAME + "Error in JSON from API: " + e.toString());
			return null;
		}
	}

	public boolean isOnline() {
		final ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
		final NetworkInfo netInfo = cm.getActiveNetworkInfo();
		if (netInfo != null && netInfo.isConnectedOrConnecting()) {
			return true;
		} else {
			return false;
		}
	}

	public boolean compareAppVersion(final String latestAppVersion) {
		try {
			final PackageInfo pInfo = getApplicationContext()
					.getPackageManager().getPackageInfo(
							"org.teusink.droidpapers", 0);
			final String currentAppVersion = pInfo.versionName;
			final String[] latestAppVersionArray = latestAppVersion
					.split("\\.");
			final String[] currentAppVersionArray = currentAppVersion
					.split("\\.");
			final int latestVersionMajor = Integer
					.parseInt(latestAppVersionArray[0]);
			final int latestVersionMedium = Integer
					.parseInt(latestAppVersionArray[1]);
			final int latestVersionMinor = Integer
					.parseInt(latestAppVersionArray[2]);
			final int appVersionMajor = Integer
					.parseInt(currentAppVersionArray[0]);
			final int appVersionMedium = Integer
					.parseInt(currentAppVersionArray[1]);
			final int appVersionMinor = Integer
					.parseInt(currentAppVersionArray[2]);
			if ((latestVersionMajor > appVersionMajor
					|| latestVersionMajor == appVersionMajor
					&& latestVersionMedium > appVersionMedium || latestVersionMajor == appVersionMajor
					&& latestVersionMedium == appVersionMedium
					&& latestVersionMinor > appVersionMinor)
					&& !currentAppVersion.equals("0.0.0")) {
				return true; // higher version
			} else {
				return false; // lower version
			}
		} catch (final NameNotFoundException e1) {
			return false;
		}
	}

	private boolean appInstalledOrNot(final String uri) {
		final PackageManager manager = getApplicationContext()
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
