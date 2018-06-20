package com.getpay.demoApp.plugins;

import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import com.getpay.JSBridge.GetJSCallbackContext;
import com.getpay.JSBridge.GetJSParams;
import com.getpay.JSBridge.GetJSPlugin;
import com.getpay.jsapidemo_android.R;


public class GetNavCtrl extends GetJSPlugin {
    public static final String TAG = "GetNavCtrl";

    /**
     * Constructor.
     */
    public GetNavCtrl() {
    }


    public boolean execute(String realMethod, GetJSParams args, GetJSCallbackContext callbackContext) throws JSONException {
        boolean ret = false;

        switch (realMethod) {
            case "close":
                Log.i(TAG, "Closing webview");
                GetBaseWebViewActivity.getInstance().finish();
                callbackContext.success(1);
                ret = true;
                break;

            case "showDialog":
                Log.i(TAG, "Start showing dialog");


                AlertDialog.Builder builder = new AlertDialog.Builder(GetBaseWebViewActivity.getInstance())
                        .setIcon(R.drawable.ic_launcher)
                        .setTitle(args.jsonParamForkey("title").toString())
                        .setMessage(args.jsonParamForkey("text").toString())
                        .setCancelable(true);

                Log.i(TAG, "needOkBtn=" + args.jsonParamForkey("needOkBtn").toString());
                if (args.jsonParamForkey("needOkBtn").toString().equals("true")) {
                    builder.setPositiveButton(args.jsonParamForkey("okBtnText").toString(), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Toast.makeText(GetBaseWebViewActivity.getInstance(), "OK button pressed", Toast.LENGTH_SHORT).show();
                            dialog.dismiss();
                        }
                    });
                }
                Log.i(TAG, "needCancelBtn=" + args.jsonParamForkey("needCancelBtn").toString());
                if (args.jsonParamForkey("needCancelBtn").toString().equals("true")) {
                    builder.setNegativeButton(args.jsonParamForkey("cancelBtnText").toString(), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Toast.makeText(GetBaseWebViewActivity.getInstance(), "Cancel button pressed", Toast.LENGTH_SHORT).show();
                            dialog.dismiss();
                        }
                    });
                }

                AlertDialog dialog = builder.create();
                dialog.show();


                JSONObject jo = new JSONObject();
                jo.put("button", 1);
                callbackContext.success(jo);
                ret = true;
                break;

            case "openLinkInNewWebView":
                callbackContext.success(1);
                ret = true;
                break;

            default:

                break;
        }

        return ret;
    }
}
