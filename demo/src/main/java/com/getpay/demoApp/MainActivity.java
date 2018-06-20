package com.getpay.demoApp;

import java.io.IOException;

import com.getpay.demoApp.plugins.GetBaseWebViewActivity;
import com.getpay.jsapidemo_android.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends Activity {
	public static String EXTRA_URL = "WebViewLoadUrl";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    public void openWebViewActivity(View view){
    	Intent intent = new Intent(this, GetBaseWebViewActivity.class);

    	String paths[];
		try {
			paths = this.getResources().getAssets().list("web");
	    	if(paths.length >= 1 && (paths[0].equalsIgnoreCase("api.htm") || paths[0].equalsIgnoreCase("GetJSBridge.js"))){
	    		intent.putExtra(EXTRA_URL, "file:///android_asset/web/api.htm");
	    	} else {
	    		intent.putExtra(EXTRA_URL, "file:///android_asset/web/api.htm");
	    	}

		} catch (IOException e) {
			e.printStackTrace();
			intent.putExtra(EXTRA_URL, "file:///android_asset/web/api.htm");
		}

    	startActivity(intent);
    }
}
