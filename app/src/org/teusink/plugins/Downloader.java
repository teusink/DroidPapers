package org.teusink.plugins;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.teusink.droidpapers.LibraryWallpaperBitmaps;
import org.teusink.droidpapers.R;

import android.annotation.SuppressLint;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.WallpaperManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.MediaStore.Audio.AudioColumns;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;

@SuppressLint("DefaultLocale")
public class Downloader extends CordovaPlugin {

	public static final String PREFS_NAME = "DroidPapersPrefs";
	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "Downloader Plugin: ";

	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callbackContext) {
		if (action.equals("get")) {
			cordova.getThreadPool().execute(new Runnable() {
				@Override
				public void run() {
					try {
						final JSONObject params = args.getJSONObject(0);
						final String fileUrl = params.getString("url");
						final Boolean overwrite = params
								.getBoolean("overwrite");
						final Boolean setWallpaper = params
								.getBoolean("setWallpaper");
						final String setWallAspect = params.getString("setWallAspect");
						final String setWallColor = params.getString("setWallColor");
						final Boolean setRingtone = params
								.getBoolean("setRingtone");
						final String ringType = params.getString("ringType");
						final String ringName = params.getString("ringName");
						final String fileName = fileUrl.substring(fileUrl
								.lastIndexOf("/") + 1);
						final String fileExtension = fileName.substring(
								fileName.lastIndexOf(".") + 1).toLowerCase();
						String dirName = Environment
								.getExternalStorageDirectory()
								.getAbsolutePath()
								+ "/Download/";
						if (fileExtension.equals("jpeg")
								|| fileExtension.equals("jpg")
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
							} else {
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
						downloadUrl(fileUrl, dirName, fileName, overwrite,
								setWallpaper, setWallAspect,
								setWallColor, setRingtone,
								ringType, ringName, callbackContext);
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.OK));
					} catch (final JSONException e) {
						e.printStackTrace();
						Log.e(LOG_PROV, LOG_NAME + "Error: "
								+ PluginResult.Status.JSON_EXCEPTION);
						callbackContext.sendPluginResult(new PluginResult(
								PluginResult.Status.JSON_EXCEPTION));
					} catch (final InterruptedException e) {
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

	private Boolean downloadUrl(final String fileUrl, final String dirName,
			final String fileName, final Boolean overwrite,
			final Boolean setWallpaper, final String setWallAspect,
			final String setWallColor,
			final Boolean setRingtone, final String ringType,
			final String ringName, final CallbackContext callbackContext)
					throws InterruptedException, JSONException {
		try {
			final File dir = new File(dirName);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			final File file = new File(dirName, fileName);
			if (overwrite == true || !file.exists()) {
				final Intent intent = new Intent();
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				final PendingIntent pend = PendingIntent.getActivity(
						cordova.getActivity(), 0, intent,
						PendingIntent.FLAG_UPDATE_CURRENT);
				final NotificationManager mNotifyManager = (NotificationManager) cordova
						.getActivity().getSystemService(
								Context.NOTIFICATION_SERVICE);
				final NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
						cordova.getActivity())
				.setSmallIcon(R.drawable.ic_stat_icon_notification)
				.setContentTitle(
						cordova.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.app_name))
								.setContentText(
										cordova.getActivity()
										.getResources()
										.getString(
												org.teusink.droidpapers.R.string.file)
												+ ": " + fileName + " - 0%");
				final int mNotificationId = new Random().nextInt(10000);
				final URL url = new URL(fileUrl);
				final HttpURLConnection ucon = (HttpURLConnection) url
						.openConnection();
				ucon.setRequestMethod("GET");
				ucon.connect();
				final InputStream is = ucon.getInputStream();
				final byte[] buffer = new byte[1024];
				int readed = 0;
				final int progress = 0;
				int totalReaded = 0;
				final int fileSize = ucon
						.getContentLength();
				final FileOutputStream fos = new FileOutputStream(file);
				if (setWallpaper == false && setRingtone == false) {
					showToast(
							cordova.getActivity()
							.getResources()
							.getString(
									org.teusink.droidpapers.R.string.downloadstarted),
							"short");
				}
				int step = 0;
				while ((readed = is.read(buffer)) > 0) {
					fos.write(buffer, 0, readed);
					totalReaded += readed;
					final int newProgress = totalReaded * 100 / fileSize;
					if (newProgress != progress & newProgress > step) {
						mBuilder.setProgress(100, newProgress, false);
						mBuilder.setContentText(cordova
								.getActivity()
								.getResources()
								.getString(
										org.teusink.droidpapers.R.string.file)
										+ ": " + fileName + " - " + step + "%");
						mBuilder.setContentIntent(pend);
						mNotifyManager
						.notify(mNotificationId, mBuilder.build());
						step = step + 1;
					}
				}
				fos.flush();
				fos.close();
				is.close();
				ucon.disconnect();
				mBuilder.setContentText(
						cordova.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.downloadcomplete)
								+ ": " + fileName).setProgress(0, 0, false);
				mBuilder.setContentIntent(pend);
				mNotifyManager.notify(mNotificationId, mBuilder.build());
				try {
					Thread.sleep(3000);
				} catch (final InterruptedException e) {
					Log.e(LOG_PROV, LOG_NAME + "Thread sleep error: " + e);
				}
				mNotifyManager.cancel(mNotificationId);
				if (setWallpaper == false && setRingtone == false) {
					showToast(
							cordova.getActivity()
							.getResources()
							.getString(
									org.teusink.droidpapers.R.string.downloadcomplete)
									+ ".", "short");
				}
			} else if (overwrite == false && setWallpaper == false
					&& setRingtone == false) {
				showToast(
						cordova.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.alreadydownloaded),
						"short");
			}
			if (file.exists()) {
				if (setWallpaper == true && setRingtone == false) {
					setSystemWallpaper(dirName, fileName, setWallAspect,
							setWallColor, callbackContext);
				} else if (setWallpaper == false && setRingtone == true) {
					setRingtone(dirName, fileName, ringType, ringName,
							setRingtone, callbackContext);
				} else if (setWallpaper == false && setRingtone == false
						&& !ringName.equals("none")) {
					setRingtone(dirName, fileName, ringType, ringName,
							setRingtone, callbackContext);
				}
				scanMedia(dirName + fileName);
			} else {
				showToast(
						cordova.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.downloadwrong),
						"long");
				Log.e(LOG_PROV, LOG_NAME + "Error: Download went wrong.");
			}
			return true;
		} catch (final FileNotFoundException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.fileweberror),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		} catch (final IOException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.fileerror),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		}
	}

	private void scanMedia(final String path) {
		final File file = new File(path);
		final Uri uri = Uri.fromFile(file);
		final Intent scanFileIntent = new Intent(
				Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri);
		cordova.getActivity().sendBroadcast(scanFileIntent);
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

	private boolean setSystemWallpaper(final String dirName,
			final String fileName, final String setWallAspect,
			final String setWallColor,
			final CallbackContext callbackContext) {
		try {
			final WallpaperManager wallpaperManager = WallpaperManager
					.getInstance(this.cordova.getActivity());
			final LibraryWallpaperBitmaps wallBits = new LibraryWallpaperBitmaps();
			final String fname = dirName + fileName;
			Bitmap bMap = wallBits.loadBitmap(fname, wallpaperManager);
			if (bMap != null && !bMap.isRecycled()) {
				final Intent intent = new Intent();
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				final PendingIntent pend = PendingIntent.getActivity(
						cordova.getActivity(), 0, intent,
						PendingIntent.FLAG_UPDATE_CURRENT);
				final NotificationManager mNotifyManager = (NotificationManager) cordova
						.getActivity().getSystemService(
								Context.NOTIFICATION_SERVICE);
				final NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
						cordova.getActivity())
				.setSmallIcon(R.drawable.ic_stat_icon_notification)
				.setContentTitle(
						cordova.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.app_name))
								.setContentText(
										cordova.getActivity()
										.getResources()
										.getString(
												org.teusink.droidpapers.R.string.settingwallpaper)
												+ ": " + fileName);
				final int mNotificationId = new Random().nextInt(10000);
				mBuilder.setContentIntent(pend);
				mNotifyManager.notify(mNotificationId, mBuilder.build());
				bMap = wallBits.resizeBitmap(bMap, setWallAspect,
						wallpaperManager);
				bMap = wallBits.prepareBitmap(bMap, wallpaperManager);
				if (setWallColor.equals("grayscale")) {
					bMap = wallBits.ConvertToGrayscale(bMap);
				} else if (setWallColor.equals("sepia")) {
					bMap = wallBits.ConvertToSepia(bMap);
				}
				if (bMap != null && !bMap.isRecycled()) {
					wallpaperManager.setBitmap(bMap);
					showToast(
							cordova.getActivity()
							.getResources()
							.getString(
									org.teusink.droidpapers.R.string.wallpaperset),
							"short");
				} else {
					showToast(
							cordova.getActivity()
							.getResources()
							.getString(
									org.teusink.droidpapers.R.string.errorsettingwall),
							"long");
					Log.e(LOG_PROV, LOG_NAME + "Error setting recycled bMap.");
				}
				try {
					Thread.sleep(3000);
				} catch (final InterruptedException e) {
					Log.e(LOG_PROV, LOG_NAME + "Thread sleep error: " + e);
				}
				mNotifyManager.cancel(mNotificationId);

			} else {
				if (bMap == null) {
					showToast(
							cordova.getActivity()
							.getResources()
							.getString(
									org.teusink.droidpapers.R.string.errorsettingwalldel),
							"long");
					Log.e(LOG_PROV, LOG_NAME
							+ "Error setting wallpaper (bMap): " + dirName
							+ fileName);
				} else if (bMap.isRecycled()) {
					showToast(
							cordova.getActivity()
							.getResources()
							.getString(
									org.teusink.droidpapers.R.string.errorsettingwall),
							"long");
					Log.e(LOG_PROV, LOG_NAME + "Error setting recycled bMap.");
				}
			}
			if (bMap != null && !bMap.isRecycled()) {
				bMap.recycle();
			}
			return true;
		} catch (final IOException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingwallcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		} catch (final IllegalStateException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingwallcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		} catch (final IllegalArgumentException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingwallcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		}
	}

	private boolean setRingtone(final String dirName, final String fileName,
			final String ringType, final String ringName,
			final boolean setRingtone, final CallbackContext callbackContext) {
		try {
			final File fname = new File(dirName, fileName);
			final MediaPlayer mp = new MediaPlayer();
			mp.setDataSource(dirName + fileName);
			final ContentValues values = new ContentValues();
			values.put(MediaStore.MediaColumns.DATA, fname.getAbsolutePath());
			values.put(MediaStore.MediaColumns.SIZE, fname.length());
			values.put(MediaStore.MediaColumns.MIME_TYPE, "audio/ogg");
			values.put(AudioColumns.DURATION, 1);
			values.put(MediaStore.MediaColumns.TITLE, ringName);
			values.put(AudioColumns.ARTIST, ringName);
			if (ringType.equals("ringtone")) {
				values.put(AudioColumns.IS_RINGTONE, true);
				values.put(AudioColumns.IS_NOTIFICATION, false);
				values.put(AudioColumns.IS_ALARM, false);
			}
			if (ringType.equals("notification")) {
				values.put(AudioColumns.IS_RINGTONE, false);
				values.put(AudioColumns.IS_NOTIFICATION, true);
				values.put(AudioColumns.IS_ALARM, false);
			}
			if (ringType.equals("alarm")) {
				values.put(AudioColumns.IS_RINGTONE, false);
				values.put(AudioColumns.IS_NOTIFICATION, false);
				values.put(AudioColumns.IS_ALARM, true);
			}
			values.put(AudioColumns.IS_MUSIC, false);
			final Uri uri = MediaStore.Audio.Media.getContentUriForPath(fname
					.getAbsolutePath());
			this.cordova
			.getActivity()
			.getContentResolver()
			.delete(uri, "_data = '" + fname.getAbsolutePath() + "'",
					null);
			final Uri newUri = this.cordova.getActivity().getContentResolver()
					.insert(uri, values);
			if (setRingtone == true) {
				if (ringType.equals("ringtone")) {
					RingtoneManager.setActualDefaultRingtoneUri(
							this.cordova.getActivity(),
							RingtoneManager.TYPE_RINGTONE, newUri);
				}
				if (ringType.equals("notification")) {
					RingtoneManager.setActualDefaultRingtoneUri(
							this.cordova.getActivity(),
							RingtoneManager.TYPE_NOTIFICATION, newUri);
				}
				if (ringType.equals("alarm")) {
					RingtoneManager.setActualDefaultRingtoneUri(
							this.cordova.getActivity(),
							RingtoneManager.TYPE_ALARM, newUri);
				}
				showToast(
						ringName
						+ " "
						+ cordova
						.getActivity()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.ringsetas)
								+ " " + ringType + ".", "short");
			}
			mp.release();
			return true;
		} catch (final IllegalArgumentException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingringcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		} catch (final SecurityException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingringcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		} catch (final IllegalStateException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingringcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		} catch (final IOException e) {
			showToast(
					cordova.getActivity()
					.getResources()
					.getString(
							org.teusink.droidpapers.R.string.errorsettingringcontact),
					"long");
			Log.e(LOG_PROV, LOG_NAME + "Error: " + PluginResult.Status.ERROR);
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.ERROR));
			return false;
		}
	}
}