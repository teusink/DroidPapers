package org.teusink.droidpapers;

import java.io.File;
import java.io.IOException;
import java.util.Random;

import org.joda.time.DateTime;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.WallpaperManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

@SuppressLint("DefaultLocale")
public class ServiceDynamicWallpaper extends BackgroundService {

	private String configSetting = "";

	public static final String PREFS_NAME = "DroidPapersPrefs";
	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "Dynamic Wallpaper Service: ";

	final Handler handler = new Handler();

	@Override
	protected JSONObject doWork() {
		final JSONObject result = new JSONObject();
		final DateTime today = new DateTime();
		final String msg = LOG_NAME + "Last ran on: " + today;
		autoWork();
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

	private void autoWork() {
		final SharedPreferences settings = getSharedPreferences(PREFS_NAME,
				Context.MODE_PRIVATE);
		final String settingDynamicWallpaper = settings.getString("settingDynamicWallpaper", "off");
		if (settingDynamicWallpaper.equals("on")) {
			final String setDynamicWallAspect = settings.getString("setDynamicWallAspect", "autofit");
			final String setDynamicWallColor = settings.getString("setDynamicWallColor", "original");
			String excludeDroidPapersFolder = settings.getString(
					"excludeDroidPapersFolder", "false");
			final String includePicturesFolder = settings.getString(
					"includePicturesFolder", "false");
			final String includeCameraFolder = settings.getString(
					"includeCameraFolder", "false");
			boolean filesDroidPapersOk = false;
			boolean filesPicturesOk = false;
			boolean filesCameraOk = false;
			if (excludeDroidPapersFolder.equals("true")
					&& includePicturesFolder.equals("false")
					&& includeCameraFolder.equals("false")) {
				excludeDroidPapersFolder = "false";
			}
			File[][] files = null;
			File[] filesDroidPapers = null;
			File[] filesPictures = null;
			File[] filesCamera = null;
			// DroidPapers folder
			if (excludeDroidPapersFolder.equals("false")) {
				final File dirListDroidPapers = new File(Environment
						.getExternalStorageDirectory().getAbsolutePath()
						+ "/Pictures/DroidPapers/");
				filesDroidPapers = dirListDroidPapers.listFiles();
			}
			// Pictures folder
			if (includePicturesFolder.equals("true")) {
				final File dirListPictures = new File(Environment
						.getExternalStorageDirectory().getAbsolutePath()
						+ "/Pictures/");
				filesPictures = dirListPictures.listFiles();
			}
			// Camera folder
			if (includeCameraFolder.equals("true")) {
				final File dirListCamera = new File(Environment
						.getExternalStorageDirectory().getAbsolutePath()
						+ "/DCIM/Camera/");
				filesCamera = dirListCamera.listFiles();
			}
			// populate files array
			if (filesDroidPapers != null
					&& excludeDroidPapersFolder.equals("false")) {
				filesDroidPapersOk = true;
			}
			if (filesPictures != null && includePicturesFolder.equals("true")) {
				filesPicturesOk = true;
			}
			if (filesCamera != null && includeCameraFolder.equals("true")) {
				filesCameraOk = true;
			}
			if (filesDroidPapersOk == true && filesPicturesOk == true
					&& filesCameraOk == true) {
				files = new File[][] { filesDroidPapers, filesPictures,
						filesCamera };
			} else if (filesDroidPapersOk == false && filesPicturesOk == true
					&& filesCameraOk == true) {
				files = new File[][] { filesPictures, filesCamera };
			} else if (filesDroidPapersOk == true && filesPicturesOk == false
					&& filesCameraOk == true) {
				files = new File[][] { filesDroidPapers, filesCamera };
			} else if (filesDroidPapersOk == true && filesPicturesOk == true
					&& filesCameraOk == false) {
				files = new File[][] { filesDroidPapers, filesPictures };
			} else if (filesDroidPapersOk == false && filesPicturesOk == false
					&& filesCameraOk == true) {
				files = new File[][] { filesCamera };
			} else if (filesDroidPapersOk == false && filesPicturesOk == true
					&& filesCameraOk == false) {
				files = new File[][] { filesPictures };
			} else if (filesDroidPapersOk == true && filesPicturesOk == false
					&& filesCameraOk == false) {
				files = new File[][] { filesDroidPapers };
			}
			// check files
			if (files != null && files.length > 0) {
				final Random rand = new Random();
				int index1 = 0;
				int index2 = 0;
				File testFile = null;
				String fileName = null;
				String fileExtension = null;
				boolean testFileOk = false;
				boolean testExtensionOk = false;
				int i = 0;
				while (testFileOk == false && testExtensionOk == false
						&& i < 10) {
					i = i + 1;
					if (files.length > 0) {
						index1 = rand.nextInt(files.length);
					}
					if (files.length > 0 && files[index1].length > 0) {
						index2 = rand.nextInt(files[index1].length);
					}
					try {
						testFile = files[index1][index2];
						fileName = testFile.getPath();
					} catch (final ArrayIndexOutOfBoundsException e) {
						Log.e(LOG_PROV,
								LOG_NAME
								+ "Somehow there was no file selected (ArrayIndexOutOfBoundsException Error)");
					}
					if (fileName != null) {
						fileExtension = fileName.substring(
								fileName.lastIndexOf(".") + 1).toLowerCase();
						if (testFile.isFile() == true) {
							testFileOk = true;
							Log.i(LOG_PROV, LOG_NAME
									+ "Selected entry is a file: " + fileName
									+ ": [" + index1 + "][" + index2 + "]");
						} else {
							testFileOk = false;
							Log.i(LOG_PROV, LOG_NAME
									+ "Selected entry is NOT a file: "
									+ fileName + ": [" + index1 + "][" + index2
									+ "]");
						}
						if (fileExtension.equals("jpeg")
								|| fileExtension.equals("jpg")
								|| fileExtension.equals("gif")
								|| fileExtension.equals("png")
								|| fileExtension.equals("bmp")
								|| fileExtension.equals("webp")) {
							testExtensionOk = true;
							Log.i(LOG_PROV, LOG_NAME
									+ "Selected entry is a valid image: "
									+ fileName + ": [" + index1 + "][" + index2
									+ "]");
						} else {
							testExtensionOk = false;
							Log.i(LOG_PROV, LOG_NAME
									+ "Selected entry is NOT a valid image: "
									+ fileName + ": [" + index1 + "][" + index2
									+ "]");
						}
					} else {
						testFileOk = false;
						testExtensionOk = false;
						Log.i(LOG_PROV, LOG_NAME + "Selected file = null: ["
								+ index1 + "][" + index2 + "]");
					}
				}
				if (testFileOk == true && testExtensionOk == true) {
					try {
						final WallpaperManager wallpaperManager = WallpaperManager
								.getInstance(this);
						final LibraryWallpaperBitmaps wallBits = new LibraryWallpaperBitmaps();
						final String fname = fileName;
						Bitmap bMap = wallBits.loadBitmap(fname,
								wallpaperManager);
						if (bMap != null && !bMap.isRecycled()) {
							if (setDynamicWallColor.equals("grayscale")) {
								bMap = wallBits.ConvertToGrayscale(bMap);
							}
							if (setDynamicWallColor.equals("sepia")) {
								bMap = wallBits.ConvertToSepia(bMap);
							}
							bMap = wallBits.resizeBitmap(bMap, setDynamicWallAspect,
									wallpaperManager);
							bMap = wallBits.prepareBitmap(bMap,
									wallpaperManager);
							if (bMap != null && !bMap.isRecycled()) {
								wallpaperManager.setBitmap(bMap);
								Log.i(LOG_PROV, LOG_NAME
										+ "Wallpaper changed to " + fileName
										+ " with aspect "
										+ setDynamicWallAspect);
							} else {
								Log.e(LOG_PROV,
										LOG_NAME
										+ "Error setting recycled paddedWallpaper");
							}
						} else {
							if (bMap == null) {
								Log.e(LOG_PROV, LOG_NAME
										+ "Error setting wallpaper (bMap): "
										+ fileName);
							} else if (bMap.isRecycled()) {
								Log.e(LOG_PROV, LOG_NAME
										+ "Error setting recycled bMap");
							}
						}
						if (bMap != null && !bMap.isRecycled()) {
							bMap.recycle();
						}
					} catch (final IOException e) {
						Log.e(LOG_PROV, LOG_NAME + "IOException Error");
						e.printStackTrace();
					} catch (final IllegalStateException e) {
						Log.e(LOG_PROV, LOG_NAME
								+ "IllegalStateException Error");
						e.printStackTrace();
					} catch (final IllegalArgumentException e) {
						Log.e(LOG_PROV, LOG_NAME
								+ "IllegalArgumentException Error");
						e.printStackTrace();
					}
				} else {
					Log.i(LOG_PROV,
							LOG_NAME
							+ "There is no image found for now, therefore no background change");
				}
			} else {
				showToast(
						getApplicationContext()
						.getResources()
						.getString(
								org.teusink.droidpapers.R.string.nodownloadsfound),
						"short");
				Log.i(LOG_PROV, LOG_NAME + "No downloaded wallpapers detected");
			}
		} else if (!settingDynamicWallpaper.equals("on")) {
			Log.i(LOG_PROV, LOG_NAME + "Service is not set to \"on\"");
		}
	}

	private void showToast(final String message, final String duration) {
		handler.post(new Runnable() {
			@Override
			public void run() {
				if (duration.equals("long")) {
					Toast.makeText(getBaseContext(), message, Toast.LENGTH_LONG)
					.show();
				} else {
					Toast.makeText(getBaseContext(), message,
							Toast.LENGTH_SHORT).show();
				}
			}
		});
	}

}
