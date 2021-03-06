(function(e, t) {
    this[e] = t(),
    typeof define == "function" ? define(this[e]) : typeof module == "object" && (module.exports = this[e])
})("mapp",
function(e) {
    "use strict";

	//app版本比较
    function p(e, t) {
        e = String(e).split("."),
        t = String(t).split(".");
        try {
            for (var n = 0,
            r = Math.max(e.length, t.length); n < r; n++) {
                var i = isFinite(e[n]) && Number(e[n]) || 0,
                s = isFinite(t[n]) && Number(t[n]) || 0;
                if (i < s) return - 1;
                if (i > s) return 1
            }
        } catch(o) {
            return - 1
        }
        return 0
    }

	//mapp.build 调用函数：在window中注册所有的函数；
	function g(e) {
        var t = e.split("."),
        n = window;
        return t.forEach(function(e) { ! n[e] && (n[e] = {}),
            n = n[e]
        }),
        n
    }

	//callback, 作为异步调用函数返回；
    function y(e, t, n) {
        e = typeof e == "function" ? e: window[e];
        if (!e) return;
        var i = b(e),
        s = "__MAPP_CALLBACK_" + i;
        return window[s] = function() {
            var e = r.call(arguments);
            w(i, e, t, n)
        },
        s
    }


	//存储回调函数，产生index
	function b(e) {
        var t = o++;
        return e && (u[t] = e),
        t
    }

	//__fireCallback
	//@param e 回调函数的存储index  或者直接为回调函数
	//@param t 执行src之后的返回参数，生成数组
	//@param n 为true，删除回调全局数据中存储的回调函数；
	//@param r 为true, 异步执行回调函数，否则同步执行
    function w(e, t, n, r) {
		//获取回调函数，赋值给i,并执行
        var i = typeof e == "function" ? e: u[e] || window[e],
        s = Date.now();
        t = t || [],
        typeof i == "function" ? r ? setTimeout(function() {
            i.apply(null, t)
        },
        0) : i.apply(null, t) : console.log("mappapi: not found such callback: " + e),
        n && (delete u[e], delete window["__MAPP_CALLBACK_" + e]);

		//删除 report uri 中的函数调用属性
		if (a[e]) {
            var o = a[e];
            delete a[e],
            Number(e) && delete a["__MAPP_CALLBACK_" + e];
        }
    }

	//native的回调函数，execGlobalCallback:
    function E(e) {
        var n = r.call(arguments, 1);
        t.android && n && n.length && n.forEach(function(e, t) {
            typeof e == "object" && "r" in e && "result" in e && (n[t] = e.result)
        }),
        w(e, n, !0) //执行回调函数，看是同步执行还是异步执行
    }


	function S() {}

	//mapp.build
	//@param {}
	function x(e, n) {
        var r = null,
        i = e.lastIndexOf("."),
        s = e.substring(0, i),
        o = e.substring(i + 1),
        u = g(s); //mapp.device 生成对应的数组存储关系
        if (u[o]) throw new Error("[mappapi]already has " + e);
        n.iOS && t.iOS ? r = n.iOS: n.android && t.android ? r = n.android: n.browser && (r = n.browser),
        u[o] = r || S, //存储函数
        f[e] = n.support // 存储函数调用版本
    }

	//support: 查询当前版本是否支持某个接口
    function T(e) {
        var n = f[e] || f[e.replace("qw.", "mapp.")],
        r = t.iOS ? "iOS": t.android ? "android": "browser";
        return ! n || !n[r] ? !1 : t.compare(n[r]) > -1
    }


	//创建一个iframe，执行src，供拦截
	function N(n, r) {
		console.log("logOpenURL:>>" + n);
        var i = document.createElement("iframe");
        i.style.cssText = "display:none;width:0px;height:0px;";
        var s = function() {
			//通过全局执行函数执行回调函数；监听iframe是否加载完毕
            E(r, {
                r: -201,
                result: "error"
            })
        };

		//ios平台，令iframe的src为url，onload函数为全局回调函数
		//并将iframe插入到body或者html的子节点中；
		t.iOS && (i.onload = s, i.src = n);
        var o = document.body || document.documentElement;
        o.appendChild(i),
        t.android && (i.onload = s, i.src = n);

		//
        var u = t.__RETURN_VALUE;
		//当iframe执行完成之后，最后执行settimeout 0语句
        return t.__RETURN_VALUE = e,
        setTimeout(function() {
            i.parentNode.removeChild(i)
        },
        0),
        u
    }

	//如果是ios，返回true；
	//如果是andorid且支持jsbridge，且当前模块的最小版本支持小于当前appVersion的时候，和ios一样的调用方法；
	function C(e,n) {
        return (t.iOS||t.android); //&& T("mapp." + e + "." + n);
    }

	//invoke
	//mapp.invoke("device", "getDeviceInfo", e);
	//@param e 类 必须
	//@param n 类方法 必须
	//@param i 同步回调的js方法
	//@param s
    function k(e, n, i, s) {
        if (!e || !n) return null;
        var o, u;
        i = r.call(arguments, 2), //相当于调用Array.prototype.slice(arguments) == arguments.slice(2),获取argument数组2以后的元素

		//令s等于回调函数
		s = i.length && i[i.length - 1],
        s && typeof s == "function" ? i.pop() : typeof s == "undefined" ? i.pop() : s = null,

		//u为当前存储回调函数的index；
		u = b(s);

		//如果当前版本支持Bridge
		if (C(e, n)) {
			//将传进来的所有参数生成一个url字符串；
            o = "getjsbridge:" + "/" + "/" + encodeURIComponent(e) + "/" + encodeURIComponent(n),
            i.forEach(function(e, t) {
                typeof e == "object" && (e = JSON.stringify(e)),
                t === 0 ? o += "?p=": o += "&p" + t + "=",
                o += encodeURIComponent(String(e))
            }),
            (o += "#" + u); //带上存储回调的数组index;


			//执行生成的url, 有些函数是同步执行完毕，直接调用回调函数；而有些函数的调用要通过异步调用执行，需要通过
			//全局调用去完成；
   		    var f = N(o);
            if (t.iOS) {
                f = f ? f.result: null;
                if (!s) return f; //如果无回调函数，直接返回结果；
                w(u, [f], !1, !0) //如果有回调函数，执行w函数；
            }
        }else {
			console.log("mappapi: the version don't support mapp." + e + "." + n);
		}
    }


    //当本地jsbridge初始化完成，调用此方法告诉前端jsbridge已经初始化完毕
    function _disPatchEvent(type){
        var ev = document.createEvent('Event');
        ev.initEvent(type, true, true);
        document.dispatchEvent(ev);
    }

	var t = {},
    n = navigator.userAgent, //判断浏览器类型
    r = Array.prototype.slice,
    i = /(iPad|iPhone|iPod).*? _MAPP_\/([\d\.]+)/, //ios浏览器标志
    s = /(Android).*? _MAPP_\/([\d\.]+)/, //android浏览器标志
    o = 1,
    u = {},
    a = {},
    f = {},
    l = -1e5,
    c = -2e5;
    t.debuging = !1,
    t.iOS = i.test(n),
    t.android = s.test(n),
    t.iOS && t.android && (t.iOS = !1),
    t.version = "20141027001",
    t.appVersion = "0",
    t.ERROR_NO_SUCH_METHOD = "no such method",
    t.ERROR_PERMISSION_DENIED = "permission denied",
    !t.android && !t.iOS && console.log("mappapi: not android or ios"),
    t.compare = function(e) {
        return p(t.appVersion, e)
    },
    t.android && (t.appVersion = function(e) {
        return e && e[2] || 0
    } (n.match(s)), window.JsBridge || (window.JsBridge = {}), window.JsBridge.callMethod = k, window.JsBridge.callback = E, window.JsBridge.compareVersion = t.compare),
    t.iOS && (window.iOSAPPApi = t, t.__RETURN_VALUE = e, t.appVersion = function(e) {
        return e && e[2] || 0
    } (n.match(i))),
    t.platform = t.iOS ? "IPH": t.android ? "AND": "OTH";
    return  t.__fireCallback = w,
    t.build = x,
    t.support = T,
    t.invoke = k,
    t.callback = y,
    t.execGlobalCallback = E,
    t.disPatchEvent = _disPatchEvent,
    t
}),
mapp.build("mapp.device.isMobileApp", {
    iOS: function(e) {
        var t = mapp.iOS;
        return e ? e(t) : t
    },
    android: function(e) {
        var t = mapp.android;
        return e ? e(t) : t
    },
    browser: function(e) {
        var t = mapp.android || mapp.iOS;
        return e ? e(t) : t
    },
    support: {
        iOS: "1.0",
        android: "1.0"
    }
}),
mapp.build("mapp.device.getDeviceInfo", {
    iOS: function(e) {
		return mapp.invoke("device", "getDeviceInfo", e);
    },
    android: function(e) {
		var t = e;
		e = function(e) {
			try {
				e = JSON.parse(e)
			} catch(n) {}
			t && t(e)
		},
		mapp.invoke("device", "getDeviceInfo", e)
    },
    support: {
        iOS: "1.0",
        android: "1.0"
    }
}),
mapp.build("mapp.device.getClientInfo", {
    iOS: function(e) {
		return mapp.invoke("device", "getClientInfo", e)
    },
    android: function(e) {
		var t = e;
		e = function(e) {
			try {
				e = JSON.parse(e)
			} catch(n) {}
			t && t(e)
		},
		mapp.invoke("device", "getClientInfo", e)
    },
    support: {
        iOS: "1.0",
        android: "1.0"
    }
}),
mapp.build("mapp.device.getProductName", {
    iOS: function(e) {
		return mapp.invoke("device", "getProductName", e)
    },
    android: function(e) {
		var t = e;
		e = function(e) {
			try {
				e = JSON.parse(e)
			} catch(n) {}
			t && t(e)
		},
		mapp.invoke("device", "getProductName", e)
    },
    support: {
        iOS: "1.0",
        android: "1.0"
    }
}),

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
}),

mapp.build("mapp.ui.openUrl", {
    iOS: function(e) {
        e || (e = {});
        switch (e.target) {
        case 0:
            window.open(e.url, "_self");
            break;
        case 1:
            e.styleCode = {
                1 : 4,
                2 : 2,
                3 : 5
            } [e.style] || 1,
            mapp.invoke("nav", "openLinkInNewWebView", {
                url: e.url,
                options: e
            });
            break;
        case 2:
            mapp.invoke("nav", "openLinkInNewWebView", {
                url: e.url,
				options: e
            })
        }
    },
    android: function(e) {
		 e || (e = {});
        switch (e.target) {
        case 0:
            window.open(e.url, "_self");
            break;
        case 1:
            e.styleCode = {
                1 : 4,
                2 : 2,
                3 : 5
            } [e.style] || 1,
            mapp.invoke("nav", "openLinkInNewWebView", {
                url: e.url,
                options: e
            });
            break;
        case 2:
            mapp.invoke("nav", "openLinkInNewWebView", {
                url: e.url,
				options: e
            })
        }
	},
    support: {
        iOS: "1.0",
        android: "1.0"
    }
}),

mapp.build("mapp.ui.popBack", {
    iOS: function() {
        mapp.invoke("nav", "popBack")
    },
    android: function() {
        mapp.invoke("nav", "close")
    },
    support: {
        iOS: "1.0",
        android: "1.0"
    }
}),
mapp.build("mapp.ui.showDialog", {
    iOS: function(e, t) {
        e && (e.callback = mapp.callback(t, !0, !0), e.title = e.title + "", e.text = e.text + "", "needOkBtn" in e || (e.needOkBtn = !0), "needCancelBtn" in e || (e.needCancelBtn = !0), mapp.invoke("nav", "showDialog", e))
    },
    android: function(e, t) {
        e && (e.callback = mapp.callback(t, !0), mapp.invoke("nav", "showDialog", e));
    },
    support: {
        iOS: "1.0",
        android: "1.0"
    }
})
