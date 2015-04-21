package org.teusink.droidpapers;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.graphics.Rect;
import android.util.Log;

/* Class for Bitmap handling for setting wallpapers as system default
 * 
 * Usage:
 * 1.	WallpaperBitmaps wallBits = new WallpaperBitmaps();
 * 2.	wallBits.loadBitmap(filename, wallpaperManager);
 * 3.	wallBits.resizeBitmap(sampleBitmap, setWallWidthFit, wallpaperManager)
 * 4.	wallBits.prepareBitmap(sampleBitmap, wallpaperManager)
 * 5a.	wallBits.ConvertToGrayscale(sampleBitmap)
 * 5b.	wallBits.ConvertToSepia(sampleBitmap)
 */

public class LibraryWallpaperBitmaps {

	public static final String PREFS_NAME = "DroidPapersPrefs";
	public static final String LOG_PROV = "DroidPapersLog";
	public static final String LOG_NAME = "WallpaperBitmaps Library: ";
	public static final double multiplier = 1.50;

	// Load Bitmap from file
	public Bitmap loadBitmap(final String filename,
			final WallpaperManager wallpaperManager) {
		final BitmapFactory.Options options = new BitmapFactory.Options();
		options.inJustDecodeBounds = true;
		BitmapFactory.decodeFile(filename, options);
		options.inSampleSize = calculateInSampleSize(options, wallpaperManager);
		options.inPreferQualityOverSpeed = true;
		options.inJustDecodeBounds = false;
		options.inMutable = true;
		return BitmapFactory.decodeFile(filename, options);
	}

	// Calculate best sample-size to load Bitmap in to memory
	public int calculateInSampleSize(final BitmapFactory.Options options,
			final WallpaperManager wallpaperManager) {
		final int rawHeight = options.outHeight;
		final int rawWidth = options.outWidth;
		final int reqHeight = (int) (wallpaperManager.getDesiredMinimumHeight() * multiplier);
		final int reqWidth = (int) (wallpaperManager.getDesiredMinimumWidth() * multiplier);
		int inSampleSize = 1;
		if (rawHeight > reqHeight || rawWidth > reqWidth) {
			inSampleSize = 2;
		}
		if (rawHeight > reqHeight * 2 || rawWidth > reqWidth * 2) {
			inSampleSize = 4;
		}
		Log.i(LOG_PROV, LOG_NAME + "inSampleSize is: " + inSampleSize
				+ "\nHeight req: " + reqHeight + " - Height bitmap: "
				+ rawHeight + "\nWidth req: " + reqWidth + " - Width bitmap: "
				+ rawWidth);
		return inSampleSize;
	}

	// Scale bitmap to fit to max height, width, autofit, or autofill
	public Bitmap resizeBitmap(Bitmap sampleBitmap,
			final String setWallAspect,
			final WallpaperManager wallpaperManager) {
		final double heightBm = sampleBitmap.getHeight();
		final double widthBm = sampleBitmap.getWidth();
		final double heightDh = wallpaperManager.getDesiredMinimumHeight();
		final double widthDh = wallpaperManager.getDesiredMinimumWidth();
		double factor = 1.0;
		double width = 0;
		double height = 0;
		if (setWallAspect.equals("height")) { // keep height of Bitmap
			factor = heightDh / heightBm * 1;
			height = heightDh;
			width = Math.round(widthBm * factor);
		} else if (setWallAspect.equals("width")) { // keep width of Bitmap
			factor = widthDh / widthBm * 1;
			width = widthDh;
			height = Math.round(heightBm * factor);
		} else if (setWallAspect.equals("autofit")) { // fit entire wallpaper on screen
			if (heightBm >= widthBm) {
				factor = heightDh / heightBm * 1;
				height = heightDh;
				width = Math.round(widthBm * factor);
			} else {
				factor = widthDh / widthBm * 1;
				width = widthDh;
				height = Math.round(heightBm * factor);
			}
		} else if (setWallAspect.equals("autofill")) { // fill entire screen with wallpaper
			if (heightBm >= widthBm) {
				factor = widthDh / widthBm * 1;
				width = widthDh;
				height = Math.round(heightBm * factor);
			} else {
				factor = heightDh / heightBm * 1;
				height = heightDh;
				width = Math.round(widthBm * factor);
			}
		}
		sampleBitmap = Bitmap.createScaledBitmap(sampleBitmap, (int) width,
				(int) height, true);
		Log.i(LOG_PROV, LOG_NAME + "Scaled Bitmap to fit width (" + (int) width
				+ "x" + (int) height + ") in resizeBitmap, with wallpaper aspect " + setWallAspect);
		return sampleBitmap;
	}

	// Crop or inflate bitmap to desired device height and/or width
	public Bitmap prepareBitmap(final Bitmap sampleBitmap,
			final WallpaperManager wallpaperManager) {
		Bitmap changedBitmap = null;
		final int heightBm = sampleBitmap.getHeight();
		final int widthBm = sampleBitmap.getWidth();
		final int heightDh = wallpaperManager.getDesiredMinimumHeight();
		final int widthDh = wallpaperManager.getDesiredMinimumWidth();
		if (widthDh > widthBm || heightDh > heightBm) {
			final int xPadding = Math.max(0, widthDh - widthBm) / 2;
			final int yPadding = Math.max(0, heightDh - heightBm) / 2;
			changedBitmap = Bitmap.createBitmap(widthDh, heightDh,
					Bitmap.Config.ARGB_8888);
			final int[] pixels = new int[widthBm * heightBm];
			sampleBitmap.getPixels(pixels, 0, widthBm, 0, 0, widthBm, heightBm);
			changedBitmap.setPixels(pixels, 0, widthBm, xPadding, yPadding,
					widthBm, heightBm);
			Log.i(LOG_PROV,
					LOG_NAME
					+ ": Inflated size of Bitmap to fit device height/width in prepareBitmap");
		} else if (widthBm > widthDh || heightBm > heightDh) {
			changedBitmap = Bitmap.createBitmap(widthDh, heightDh,
					Bitmap.Config.ARGB_8888);
			int cutLeft = 0;
			int cutTop = 0;
			int cutRight = 0;
			int cutBottom = 0;
			final Rect desRect = new Rect(0, 0, widthDh, heightDh);
			Rect srcRect = new Rect();
			if (widthBm > widthDh) { // crop width (left and right)
				cutLeft = (widthBm - widthDh) / 2;
				cutRight = (widthBm - widthDh) / 2;
				srcRect = new Rect(cutLeft, 0, widthBm - cutRight, heightBm);
			} else if (heightBm > heightDh) { // crop height (top and bottom)
				cutTop = (heightBm - heightDh) / 2;
				cutBottom = (heightBm - heightDh) / 2;
				srcRect = new Rect(0, cutTop, widthBm, heightBm - cutBottom);
			}
			final Canvas canvas = new Canvas(changedBitmap);
			canvas.drawBitmap(sampleBitmap, srcRect, desRect, null);
			Log.i(LOG_PROV,
					LOG_NAME
					+ "Cropped size of Bitmap to fit device height/width in prepareBitmap");
		} else {
			changedBitmap = sampleBitmap;
			Log.i(LOG_PROV, LOG_NAME
					+ "Did NOT inflate or crop Bitmap in prepareBitmap");
		}
		return changedBitmap;
	}

	// Change color scale of bitmap to grayscale
	public Bitmap ConvertToGrayscale(Bitmap sampleBitmap) {
		final ColorMatrix gsMatrix = new ColorMatrix();
		gsMatrix.setSaturation(0);
		final ColorMatrixColorFilter colorFilter = new ColorMatrixColorFilter(
				gsMatrix);
		sampleBitmap = sampleBitmap.copy(Bitmap.Config.ARGB_8888, true);
		final Paint paint = new Paint();
		paint.setColorFilter(colorFilter);
		final Canvas myCanvas = new Canvas(sampleBitmap);
		myCanvas.drawBitmap(sampleBitmap, 0, 0, paint);
		Log.i(LOG_PROV, LOG_NAME
				+ "Changed Bitmap to grayscale in ConvertToGrayScale");
		return sampleBitmap;
	}

	// Change color scale of bitmap to sepia
	public Bitmap ConvertToSepia(Bitmap sampleBitmap) {
		final ColorMatrix sepiaMatrix = new ColorMatrix();
		final float[] sepMat = { 0.3930000066757202f, 0.7689999938011169f,
				0.1889999955892563f, 0, 0, 0.3490000069141388f,
				0.6859999895095825f, 0.1679999977350235f, 0, 0,
				0.2720000147819519f, 0.5339999794960022f, 0.1309999972581863f,
				0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 };
		sepiaMatrix.set(sepMat);
		final ColorMatrixColorFilter colorFilter = new ColorMatrixColorFilter(
				sepiaMatrix);
		sampleBitmap = sampleBitmap.copy(Bitmap.Config.ARGB_8888, true);
		final Paint paint = new Paint();
		paint.setColorFilter(colorFilter);
		final Canvas myCanvas = new Canvas(sampleBitmap);
		myCanvas.drawBitmap(sampleBitmap, 0, 0, paint);
		Log.i(LOG_PROV, LOG_NAME + "Changed Bitmap to sepia in ConvertToSepia");
		return sampleBitmap;
	}

}
