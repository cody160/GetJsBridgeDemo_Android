package com.getpay.demoApp.plugins;

import org.json.JSONException;
import com.getpay.JSBridge.GetJSCallbackContext;
import com.getpay.JSBridge.GetJSParams;
import com.getpay.JSBridge.GetJSPlugin;


public class GetUIGlobalCtrl extends GetJSPlugin {
    public static final String TAG = "GetUIGlobalCtrl";

    /**
     * Constructor.
     */
    public GetUIGlobalCtrl() {
    }


    @Override
    public boolean execute(String realMethod, GetJSParams args, GetJSCallbackContext callbackContext) throws JSONException {
        if (realMethod.equals("showActionSheet")) {
            callbackContext.success(1); //int 代替true
        }


        else {
            return false;
        }
        return true;
    }
}
