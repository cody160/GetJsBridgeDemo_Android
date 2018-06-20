# JS Bridge Demo for Android

This is a demo showing how to communicate between web and native app by building a bridge between JavaScript & Java.

## What is JS Bridge

**JS bridge** is a communication channel between JavaScript and Java languages, and between web and native app. Normally, the communication between web and app is very limited and inefficient. But through JS bridge, the communication is much easier.

## Why JS Bridge is Needed

We need a JS bridge for the following reasons:

1. **To empower the web.** A normal webpage's capability is quite limited. It couldn't access many features OS offers the same way native app could easily do. The only way to remove the restriction is through JS bridge.

2. **To offer web some special services provided by native app.** If a merchant made an H5 and needed our Super App's payment service on consumer checkout. While in the web, it could simple call JS API to invoke our payment module implemented in native Java code.

## How to Add a New API

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
