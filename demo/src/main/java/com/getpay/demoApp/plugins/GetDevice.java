package com.getpay.demoApp.plugins;

import java.util.TimeZone;
import org.json.JSONException;
import org.json.JSONObject;

import com.getpay.JSBridge.GetJSCallbackContext;
import com.getpay.JSBridge.GetJSParams;
import com.getpay.JSBridge.GetJSPlugin;


public class GetDevice extends GetJSPlugin {
    public static final String TAG = "GetDevice";

    public static String platform;                            // Device OS
    public static String uuid;                                // Device UUID

    private static final String ANDROID_PLATFORM = "Android";
    private static final String AMAZON_PLATFORM = "amazon-fireos";
    private static final String AMAZON_DEVICE = "Amazon";

    /**
     * Constructor.
     */
    public GetDevice() {
    }

    /**
     * 自定初始化操作；
     */
    @Override
    public void pluginInitialize(){
        super.pluginInitialize();
    }


    @Override
    public boolean execute(String realMethod, GetJSParams args, GetJSCallbackContext callbackContext) throws JSONException {
        boolean ret = false;
        JSONObject r = new JSONObject();

        switch (realMethod) {
            case "getDeviceInfo":

                r.put("version", this.getOSVersion());
                r.put("platform", this.getPlatform());
                r.put("model", this.getModel());
                callbackContext.success(r);

                ret = true;
                break;

            case "getProductName":

                r.put("productName", this.getProductName());
                callbackContext.success(r);

                ret = true;
                break;

            default:

                break;
        }
        /*
        if (realMethod.equals("getDeviceInfo")) {
            JSONObject r = new JSONObject();
            r.put("uuid", GetDevice.uuid);
            r.put("version", this.getOSVersion());
            r.put("platform", this.getPlatform());
            r.put("model", this.getModel());
            callbackContext.success(r);
        }
        else {
            return false;
        }
        */
        return ret;
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------

    /**
     * Get the OS name.
     *
     * @return
     */
    public String getPlatform() {
        String platform;
        if (isAmazonDevice()) {
            platform = AMAZON_PLATFORM;
        } else {
            platform = ANDROID_PLATFORM;
        }
        return platform;
    }


    public String getModel() {
        String model = android.os.Build.MODEL;
        return model;
    }

    public String getProductName() {
        String productname = android.os.Build.PRODUCT;
        return productname;
    }

    /**
     * Get the OS version.
     *
     * @return
     */
    public String getOSVersion() {
        String osversion = android.os.Build.VERSION.RELEASE;
        return osversion;
    }

    public String getSDKVersion() {
        @SuppressWarnings("deprecation")
        String sdkversion = android.os.Build.VERSION.SDK;
        return sdkversion;
    }

    public String getTimeZoneID() {
        TimeZone tz = TimeZone.getDefault();
        return (tz.getID());
    }

    /**
     * Function to check if the device is manufactured by Amazon
     *
     * @return
     */
    public boolean isAmazonDevice() {
        if (android.os.Build.MANUFACTURER.equals(AMAZON_DEVICE)) {
            return true;
        }
        return false;
    }

}
