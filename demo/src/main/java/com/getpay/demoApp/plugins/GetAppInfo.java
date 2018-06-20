package com.getpay.demoApp.plugins;

import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import org.json.JSONException;
import com.getpay.JSBridge.GetJSCallbackContext;
import com.getpay.JSBridge.GetJSParams;
import com.getpay.JSBridge.GetJSPlugin;


public class GetAppInfo extends GetJSPlugin {
    public static final String TAG = "GetAppInfo";

    /**
     * Constructor.
     */
    public GetAppInfo() {
    }


    /**
     * 自定初始化操作；
     */
    @Override
    public void pluginInitialize(){
        super.pluginInitialize();
    }


    @Override
    public boolean execute(String realMehtod, GetJSParams args, GetJSCallbackContext callbackContext) throws JSONException {
        if (realMehtod.equals("launchSettings")) {
            Log.i(TAG, "Starting system settings activity");
            Intent intent=new Intent(Settings.ACTION_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            GetBaseWebViewActivity.getInstance().startActivityForResult( intent , 0);
            callbackContext.success(1); //int 代替true
        }
        else {
            return false;
        }
        return true;
    }
}
