package org.teusink.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.google.analytics.tracking.android.Fields;
import com.google.analytics.tracking.android.GAServiceManager;
import com.google.analytics.tracking.android.GoogleAnalytics;
import com.google.analytics.tracking.android.MapBuilder;
import com.google.analytics.tracking.android.Tracker;

public class GAPlugin extends CordovaPlugin {
	@SuppressWarnings("deprecation")
	@Override
	public boolean execute(final String action, final JSONArray args,
			final CallbackContext callback) throws JSONException {
		final GoogleAnalytics ga = GoogleAnalytics.getInstance(cordova.getActivity());
		Tracker tracker = ga.getDefaultTracker();

		if (action.equals("initGA")) {
			try {
				tracker = ga.getTracker(args.getString(0));
				GAServiceManager.getInstance().setLocalDispatchPeriod(
						args.getInt(1));
				callback.success("initGA - id = " + args.getString(0)
						+ "; interval = " + args.getInt(1) + " seconds");
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("exitGA")) {
			try {
				GAServiceManager.getInstance().dispatchLocalHits();
				callback.success("exitGA");
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("trackEvent")) {
			try {
				tracker.send(MapBuilder.createEvent(args.getString(0),
						args.getString(1), args.getString(2), args.getLong(3))
						.build());
				callback.success("trackEvent - category = " + args.getString(0)
						+ "; action = " + args.getString(1) + "; label = "
						+ args.getString(2) + "; value = " + args.getInt(3));
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("trackPage")) {
			try {
				tracker.send(MapBuilder.createAppView()
						.set(Fields.SCREEN_NAME, args.getString(0)).build());
				callback.success("trackPage - url = " + args.getString(0));
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("setVariable")) {
			try {
				tracker.set(Fields.customDimension(args.getInt(0)),
						args.getString(1));

				callback.success("setVariable passed - index = "
						+ args.getInt(0) + "; value = " + args.getString(1));
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("setDimension")) {
			try {
				tracker.set(Fields.customDimension(args.getInt(0)),
						args.getString(1));
				callback.success("setDimension passed - index = "
						+ args.getInt(0) + "; value = " + args.getString(1));
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("setMetric")) {
			try {
				tracker.set(Fields.customMetric(args.getInt(0)),
						args.getString(1));
				callback.success("setVariable passed - index = "
						+ args.getInt(2) + "; key = " + args.getString(0)
						+ "; value = " + args.getString(1));
				return true;
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("trackSocial")) {
			try {
				tracker.send(MapBuilder.createSocial(args.getString(0),
						args.getString(1), args.getString(2)).build());
				callback.success("trackSocial - Network = " + args.getString(0)
						+ "; action = " + args.getString(1) + "; target = "
						+ args.getString(2));
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("trackEcommerceTransaction")) {
			try {
				tracker.send(MapBuilder.createTransaction(args.getString(0), // (String)
						// Transaction
						// ID
						args.getString(1), // (String) Affiliation
						args.getDouble(2), // (Double) Order revenue
						args.getDouble(3), // (Double) Tax
						args.getDouble(4), // (Double) Shipping
						args.getString(5) // (String) Currency code
						).build());

				callback.success("trackSocial - Transaction ID = "
						+ args.getString(0) + " Affiliation "
						+ args.getString(1) + " Revenue " + args.getDouble(2)
						+ " Tax " + args.getDouble(3) + " Shipping "
						+ args.getDouble(4) + " Currency code "
						+ args.getString(5));

			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		} else if (action.equals("trackEcommerceItem")) {
			try {
				tracker.send(MapBuilder.createItem(args.getString(0), // (String)
						// Transaction
						// ID
						args.getString(1), // (String) Product name
						args.getString(2), // (String) Product SKU
						args.getString(3), // (String) Product category
						args.getDouble(4), // (Double) Product price
						args.getLong(5), // (Long) Product quantity
						args.getString(6) // (String) Currency code
						).build());

				callback.success("trackSocial - Transaction ID = "
						+ args.getString(0) + " Name " + args.getString(1)
						+ " SKU " + args.getString(2) + " Category "
						+ args.getString(3) + " Price " + args.getDouble(4)
						+ " Quantity " + args.getString(5) + " Currency code "
						+ args.getString(6));
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		}

		return false;
	}
}
