# JS Bridge Demo for Android

This is a demo for showing how to communicate between WAP and native app by building a bridge for JS & Java.

## How to add a new API

1. Determine the API category. Currently in this demo, there are 4 categories, i.e. device, app, nav and ui. You could check category by looking at file **PluginConfig.json** in asserts folder. In this file, each **pluginname** field corresponds to each category. You could also add a new category if you want in this file, but you need to add a new Java class accordingly. The new Java class should extend from **GetJSPlugin** and override its method **execute()**. Please check plugin class **GetAppInfo** for sample implementation.
2. If we want to add an API for letting user to launch Android System Settings screen from webpage, I choose the name **launchSettings* for this API and put it under an existing API category **app**. Then, in file **GetJSBridge.js**, we need to build this API method **mapp.app.launchSettings()** by calling **mapp.build()** like the following example shows:
   ```javascript
   mapp.build("mapp.app.launchSettings", {
       iOS: function(e, t) {
           return mapp.invoke("app", "launchSettings", t)
       },
       android: function(e, t) {
           mapp.invoke("app", "launchSettings", t)
       },
       support: {
           iOS: "1.0",
           android: "1.0"
       }
   })
   ```
   In the above example, by calling **mapp.invoke()**, request is channelled to native method **GetAppInfo.execute()** with its first argument **realMehtod** being **launchSettings**. So we could implement our native code as this:
   ```java
   @Override
    public boolean execute(String realMehtod, GetJSParams args, GetJSCallbackContext callbackContext) throws JSONException {
        if (realMehtod.equals("launchSettings")) {
            Intent intent=new Intent(Settings.ACTION_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            GetBaseWebViewActivity.getInstance().startActivityForResult( intent , 0);
            callbackContext.success(1);
        }
        else {
            return false;
        }
        return true;
    }
   ```
3. In our webpage, when we need to switch to Settings screen, we could simply make a call like this:
   ```javascript
   mapp.app.launchSettings(function(result){
	   // use result in this callback function
	 });
   ```
   On returning from native calling, the callback function passed in as an argument will be called automatically.
   
## Technical Support
Please feel free to contact me at cody@get.com.mm if you have any questions about this demo.
Thank you!
