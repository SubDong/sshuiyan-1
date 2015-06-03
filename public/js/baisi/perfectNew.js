var _pct = _pct || [];
(function () {
    var points = [], h = {}, md = {}, c = {
        id: "2",
        version: "1.0.10"
    };

    md.achieve = {};
    //系统版本
    md.achieve.os = function (a, b) {
        var osinfo = navigator.platform, userAgent = navigator.userAgent;
        if (a.indexOf("Win") > -1) {
            if (b.indexOf("Windows NT 5.0") > -1) return "Windows 2000"; else if (b.indexOf("Windows NT 5.1") > -1)return "Windows XP"; else if (b.indexOf("Windows NT 5.2") > -1)
                return "Windows 2003"; else if (b.indexOf("Windows NT 6.0") > -1) return "Windows Vista"; else if (b.indexOf("Windows NT 6.1") > -1 || b.indexOf("Windows 7") > -1)
                return "Windows 7"; else if (b.indexOf("Windows 8") > -1) return "Windows 8"; else return "Other";
        } else if (a.indexOf("Mac") > -1) return "Mac"; else if (a.indexOf("X11") > -1) return "Unix"; else if (a.indexOf("Linux") > -1) return "Linux"; else if (a.indexOf('Android') > -1 || a.indexOf('Linux') > -1)
            return "Android"; else if (a.indexOf('iPhone') > -1) return "iPhone"; else if (a.indexOf('Windows Phone') > -1) return "Windows Phone"; else return "Other";
    };
    //浏览器版本
    md.achieve.browser = function (a) {
        var t;
        if (/AppleWebKit.*Mobile/i.test(a) || /Android/i.test(a) || /BlackBerry/i.test(a) || /IEMobile/i.test(a) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(a))) {
            return "Mobile Browser"
        } else {
            if (/[Ff]irefox(\/\d+\.\d+)/.test(a)) {
                t = /([Ff]irefox)\/(\d+\.\d+)/.exec(a);
                return t[1] + t[2];
            } else if (/MSIE \d+\.\d+/.test(a)) {
                t = /MS(IE) (\d+\.\d+)/.exec(a);
                return t[1] + t[2];
            } else if (/[Cc]hrome\/\d+/.test(a)) {
                t = /([Cc]hrome)\/(\d+)/.exec(a);
                return t[1] + t[2];
            } else if (/[Vv]ersion\/\d+\.\d+\.\d+(\.\d)* *[Ss]afari/.test(a)) {
                t = /[Vv]ersion\/(\d+\.\d+\.\d+)(\.\d)* *([Ss]afari)/.exec(a);
                return t[3] + t[1];
            } else if (/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(a)) {
                t = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(a);
                return t[1] + t[2];
            } else if (/[Tt]rident\/\d+\.\d+/.test(a)) {
                t = /[Tt]rident\/(\d+)\.\d+/.exec(a);
                return t[1] + t[2];
            } else if (/[Aa]ppleWebKit\/\d+\.\d+/.test(a)) {
                t = /[Aa]ppleWebKit\/(\d+)\.\d+/.exec(a);
                return t[1] + t[2];
            } else if (/[Gg]ecko\/\d+\.\d+/.test(a)) {
                t = /[Gg]ecko\/(\d+)\.\d+/.exec(a);
                return t[1] + t[2];
            } else if (/[Kk]HTML\/\d+\.\d+/.test(a)) {
                t = /[Kk]HTML\/(\d+)\.\d+/.exec(a);
                return t[1] + t[2];
            } else return "Other";
        }

    };
    //flash版本
    md.achieve.flashV = function (a) {
        var v_flash;
        for (var i = 0; i < a.length; i++) {
            if (a[i].name.toLowerCase().indexOf("shockwave flash") >= 0) {
                v_flash = a[i].description.substring(a[i].description.toLowerCase().lastIndexOf("flash ") + 6, a[i].description.length);
                v_flash = v_flash.substring(0, v_flash.indexOf(" "));
            }
        }
        return ((v_flash == undefined || v_flash == "") ? "" : v_flash);
    };
    md.cookie = {};
    md.getDomain = function () {
        var a = document.location.hostname;
        var b = a.substring(a.indexOf("."));
        return b;
    };
    md.cookie.set = function (a, b) {
        document.cookie = a + "=" + escape(b) + ";domain=" + md.getDomain() + "; path=/";
    };
    md.cookie.setNull = function (a, b) {
        document.cookie = a + "=" + escape(b) + "; path=/";
    };
    md.cookie.get = function (a) {
        var arr, reg = new RegExp("(^| )" + a + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg)) return unescape(arr[2]); else return null;
    };
    //用户使用设备（0 移动端访问网页  1 PC端访问网页）
    md.achieve.PorM = function (a) {
        if (/AppleWebKit.*Mobile/i.test(a) || /Android/i.test(a) || /BlackBerry/i.test(a) || /IEMobile/i.test(a) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(a))) {
            if (/iPad/i.test(a)) return "1"; else return "1";
        } else {
            return "0";
        }
    }

    var p = !0, s = null, t = !1, ac = md.achieve;
    md.g = {};
    //os 系统
    md.g.os = ac.os(navigator.platform, navigator.userAgent);
    //br 浏览器
    md.g.br = ac.browser(navigator.userAgent);
    //fl flash版本
    md.g.fl = ac.flashV(navigator.plugins);
    //pm 访问终端(0 pc,1 手机)
    md.g.pm = ac.PorM(navigator.userAgent);
    //sr 屏幕分辨率
    md.g.sr = window.screen.width + "x" + window.screen.height;
    //lg 语言
    md.g.lg = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";
    //ck 是否支持cookie (0 不支持，1 支持)
    md.g.ck = (navigator.cookieEnabled ? "1" : "0");
    //ja 是否支持java (0 不支持 ， 1 支持)
    md.g.ja = (navigator.javaEnabled() ? "1" : "0");
    //sc 屏幕颜色
    md.g.sc = window.screen.colorDepth + "-bit";
    //dt 浏览页面时间
    md.g.dt = Date.parse(new Date());
    //rf 来源页面 url
    md.g.rf = document.referrer == "" ? "-" : encodeURIComponent(document.referrer);
    //loc 当前页面url
    md.g.loc = window.location.href;
    //v 统计js版本号
    md.g.v = c.version;
    //tit  title信息
    md.g.tit = document.title;
    //ct 新老客户（0:新客户， 1：老客户）
    md.g.ct = ((md.cookie.get("vid") == null || md.cookie.get("vid") == undefined || md.cookie.get("vid") == "") ? "0" : "1");
    // hm 热力图坐标
    // tt 用户的访问uv
    // vid cookie  id访客唯一标识
    // u       _trackPageview方法参数          PV跟踪
    // et      _trackEvent事件跟踪方法参数      事件跟踪
    // cv      _setCustomVar自定义方法参数      自定变量
    // tmc     移动转化工具监控方法参数         移动转化工具监控
    // tod     电商订单数据监控方法参数         电商订单数据监控

    md.event = {};
    md.event.e = function (a, b, f) {
        a.attachEvent ? a.attachEvent("on" + b, function (d) {
            f.call(a, d)
        }) : a.addEventListener && a.addEventListener(b, f, t)
    };
    md.event.preventDefault = function (a) {
        a.preventDefault ? a.preventDefault() : a.returnValue = t
    };
    md.lang = {};
    md.lang.d = function (a, b) {
        return "[object " + b + "]" === {}.toString.call(a)
    };

    md.localStorage = {};
    md.localStorage.f = "";
    md.localStorage.s = function () {
        if (!md.localStorage.f)try {
            md.localStorage.f = document.createElement("input"), md.localStorage.f.type = "hidden", md.localStorage.f.style.display = "none", md.localStorage.f.addBehavior("#default#userData"), document.getElementsByTagName("head")[0].appendChild(md.localStorage.f)
        } catch (a) {
            return t
        }
        return p
    };
    md.localStorage.set = function (a, b, f) {
        var d = new Date;
        d.setTime(d.getTime() + f || 31536E6);
        try {
            window.localStorage ? (b = d.getTime() + "|" + b, window.localStorage.setItem(a, b)) : md.localStorage.s() && (md.localStorage.f.expires = d.toUTCString(), md.localStorage.f.load(document.location.hostname), md.localStorage.f.setAttribute(a, b), md.localStorage.f.save(document.location.hostname))
        } catch (g) {
        }
    };
    md.localStorage.get = function (a) {
        if (window.localStorage) {
            if (a = window.localStorage.getItem(a)) {
                return window.localStorage.getItem(a);
            }
        } else if (md.localStorage.s())try {
            return md.localStorage.f.load(document.location.hostname), md.localStorage.f.getAttribute(a)
        } catch (d) {
        }
        return window.localStorage.getItem(a)
    };
    md.localStorage.remove = function (a) {
        if (window.localStorage)window.localStorage.removeItem(a); else if (md.localStorage.s())try {
            md.localStorage.f.load(document.location.hostname), md.localStorage.f.removeAttribute(a), md.localStorage.f.save(document.location.hostname)
        } catch (b) {
        }
    };
    md.sessionStorage = {};
    md.sessionStorage.set = function (a, b) {
        if (window.sessionStorage)try {
            window.sessionStorage.setItem(a, b)
        } catch (f) {
        }
    };
    md.sessionStorage.get = function (a) {
        return window.sessionStorage ? window.sessionStorage.getItem(a) : s
    };
    md.sessionStorage.remove = function (a) {
        window.sessionStorage && window.sessionStorage.removeItem(a)
    };

    md.UUID = {};
    md.UUID.toString = function () {
        return this.id;
    };
    md.UUID.rand = function (max) {
        return Math.floor(Math.random() * (max + 1));
    };
    md.UUID.returnBase = function (number, base) {
        return (number).toString(base).toUpperCase();
    };
    md.UUID.getIntegerBits = function (val, start, end) {
        var b = md.UUID;
        var base16 = b.returnBase(val, 16);
        var quadArray = new Array();
        var quadString = '';
        var i = 0;
        for (i = 0; i < base16.length; i++) {
            quadArray.push(base16.substring(i, i + 1));
        }
        for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
            if (!quadArray[i] || quadArray[i] == '') quadString += '0';
            else quadString += quadArray[i];
        }
        return quadString;
    };
    md.UUID.createUUID = function () {
        var a = md.UUID;
        var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
        var dc = new Date();
        var t = dc.getTime() - dg.getTime();
        var tl = a.getIntegerBits(t, 0, 31);
        var tm = a.getIntegerBits(t, 32, 47);
        var thv = a.getIntegerBits(t, 48, 59) + '1';
        var csar = a.getIntegerBits(a.rand(4095), 0, 7);
        var csl = a.getIntegerBits(a.rand(4095), 0, 7);
        var n = a.getIntegerBits(a.rand(8191), 0, 7) +
            a.getIntegerBits(a.rand(8191), 8, 15) +
            a.getIntegerBits(a.rand(8191), 0, 7) +
            a.getIntegerBits(a.rand(8191), 8, 15) +
            a.getIntegerBits(a.rand(8191), 0, 15);
        return tl + tm + thv + csar + csl + n;
    };
    //创建坐标对象
    md.position = {}
    //获取坐标
    md.position.getXy = function position(event){
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        //var val = Math.floor(Math.random() * 100);
        var point = {
            x: x,
            y: y
            //value: val
        };
        points.push(point);
        console.log(points)
        if(points.length >= 5){
            md.g.sm = points;
            return true;
        }else{
            return false;
        }
    };
    //全局变量h.I 访问地址URL设置 如：http://best-ad.cn/pft.gif?query string parameters
    h.I = {
        u: "best-ad.cn",
        P: "log.best-ad.cn",
        S: "pft.gif",
        //dk: 8088,":" + _c.dk +
        protocol: "https:" == document.location.protocol ? "https:" : "http:",
        Q: "os tit br fl pm sr lg ck ja sc dt rf loc tt ct vid u api et cv v".split(" ")
    };
    //通过闭包 访问 私有变量 sa
    (function () {
        var sa = {
            i: {}, e: function (a, f) {
                this.i[a] = this.i[a] || [];
                this.i[a].push(f)
            }, o: function (a, f) {
                this.i[a] = this.i[a] || [];
                for (var d = this.i[a].length, g = 0; g < d; g++)this.i[a][g](f)
            }
        };
        return h.w = sa
    })();


    /**
     * 用户  调用方法参数说明
     *  必填项如果没有值，将不参与统计
     * _trackPageview：
     *          接口说明：
     *                  用于发送某个指定URL的PV统计请求，通常用于AJAX页面的PV统计。
     *                  使用该接口生成的统计请求，与用户访问一个真实页面所生成的统计请求是有相同效果的。调用该接口后，在"最新访客"和"受访页面"等报告中都能看到指定URL所对应的PV。
     *
     *          调用：_pct.putPar(['_trackEvent', pageURL]),
     *          说明： _trackEvent 调用事件  ------此项必选
     *                pageURL：指定要统计PV的页面URL。------此项必选。
     *          调用实例：<input type="button" onclick="_pct.putPar(['_trackEvent', '/parm/action'])" value="调用"/>
     * _trackEvent
     *          接口说明：
     *                  用于触发某个事件，如某个按钮的点击，或播放器的播放/停止，以及游戏的开始/暂停等。
     *                  事件跟踪的数据不会被记入到页面PV中，适合用来统计所有的不需要看做PV的页面事件。
     *
     *          调用 _pct.putPar(['_trackEvent', category, action, extraInfo, extraNumValue]);
     *          说明：category ：要监控的目标的类型名称，通常是同一组目标的名字.------ 该项必选
     *               action：用户跟目标交互的行为.-------该项必选
     *               extraInfo: 事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。------该项可选。
     *               extraNumValue: 事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。-----该项可选。
     *          调用实例：<a onclick="_pct.putPar(['_trackEvent', 'nav', 'click', 'literature'])" href="">点击调用Event</a>
     * _setCustomVar
     *          接口说明：该接口允许自定义一个变量，该变量会追加到PV统计的请求中，从而追踪访客在站点上的行为。
     *
     *                   访客在站点上的访问可以分为3个级别：访客级别、访次级别、页面级别。
     *
     *                   访客级别：跟一个访客的整个活动周期是绑定的，同一个浏览器在网站上的所有活动，会被认为是来自于同一个访客。
     *                   访次级别：当访客在连续的一段时间内处于活动状态，我们会认识这是处于同一个访次内。如果访客一段时间没有访问任何页面，我们就会认为当前访次结束了。
     *                   页面级别：当访客在一个页面内活动时，就属于页面级别。
     *                   上述的每一个级别都对应了一个作用范围，每一个自定义变量都是限制在某个范围内的。
     *
     *                   例如我们可能会统计：
     *
     *                   站点上VIP客户和普通客户的数量（访客级别）
     *                   登录用户的访次数量（访次级别）
     *                   页面上几个按钮中哪个是用户最常点击的（页面级别）
     *          调用：_pct.putPar(['_setCustomVar', index, name, value, opt_scope]);、
     *          说明：index：是自定义变量所占用的位置。取值为从1到5。------该项必选。
     *               name：是自定义变量的名字。-----该项必选。
     *               value：是自定义变量的值。--------该项必选.
     *               opt_scope：是自定义变量的作用范围。该项可选。1为访客级别（对该访客始终有效），2为访次级别（在当前访次内生效），3为页面级别（仅在当前页面生效）。默认为3。
     *          调用实例：_pct.putPar(['_setCustomVar', 1, 'customer', 'vip', 3])
     * **/
    (function () {
        function b(a) {
            return a.replace ? a.replace(/'/g, "'0").replace(/\*/g, "'1").replace(/!/g, "'2") : a
        }

        var d = md.lang, l = h.w, e = {
            init: function () {
                _pct.putPar = function (a) {
                    if (md.lang.d(a, "Array")) {
                        var b = a[0];
                        if (e.hasOwnProperty(b) && md.lang.d(e[b], "Function"))e[b](a);
                    }
                }
            },
            D: function (a) {
                if (d.d(a, "Array")) {
                    var b = a[0];
                    if (b != undefined && b != null && b != "") {
                        if (e.hasOwnProperty(b) && d.d(e[b], "Function"))e[b](a)
                    }
                }
            },
            _trackPageview: function (a) {
                a[1].indexOf("/") == 0 ? "" : a[1] = "/" + a[1];
                md.g.u = h.I.protocol + "//" + document.location.host + a[1];
                md.g.api = "1_0";
                h.b.init();
            },
            _trackEvent: function (a) {
                if (a[1] != undefined && a[1] != "" && a[1] != null) {
                    if (a[2] != undefined && a[2] != "" && a[2] != null) {
                        2 < a.length && (md.g.api = "2_0", md.g.et = b(a[1]) + "*" + b(a[2]) + (a[3] ? "*" + b(a[3]) : "") + (a[4] ? "*" + b(a[4]) : ""), h.b.init())
                    }
                }
            },
            _setCustomVar: function (a) {
                if (!(4 > a.length)) {
                    var d = a[1], f = a[4] || 3;
                    if (0 < d && 6 > d && 0 < f && 4 > f) {
                        var se = h.b.getSessionData("PFT_CV_" + c.id);
                        if (se == undefined || se == null || se == "") {
                            var cvInfo = "", st = a[a.length - 1];
                            if (st == undefined || st == "" || st == null) a[a.length - 1] = 3;
                            for (var r = 1; r < a.length; r++) cvInfo = cvInfo + (a[r] == undefined ? "" : a[r] + "*");
                            cvInfo = cvInfo.substring(0, cvInfo.length - 1);
                            h.b.setSessionData("PFT_CV_" + c.id, cvInfo);
                            h.b.setSessionData("PFT_API", "3_0");
                        }
                    }
                }
            }
        };
        e.init();
        h.T = e;
        return h.T
    })();
    (function () {
        function sta() {
            this.init();
        }

        var ccz = md.g, faz = md.achieve, sess = md.sessionStorage, loa = md.localStorage, cookie = md.cookie, u = md.UUID, position = md.position;
        sta.prototype = {
            setData: function (a) {
                try {
                    cookie.set(a, u.createUUID());
                    loa.set(a, u.createUUID());
                } catch (e) {
                }
            },
            setSessionData: function (a, b) {
                sess.set(a, b);
            },
            getSessionData: function (a) {
                return sess.get(a);
            },
            getData: function (a) {
                return cookie.get(a);
            },
            uv: function () {
                var date = new Date().getTime();
            },
            na: function () {
                var a, b, d;
                var as = decodeURIComponent(md.g.rf).replace("http://", "");
                as = (as == "-" ? as : as.substring(as.indexOf(".") + 1, as.indexOf("/")));
                var ab = md.g.loc.replace("http://", "");
                ab = ab.substring(ab.indexOf(".") + 1, ab.indexOf("/"));
                md.g.tt = a = this.getData("PFT_" + c.id);
                var Judge = (this.getData("PFT_COOKIE_RF") == null || this.getData("PFT_COOKIE_RF") != decodeURIComponent(md.g.rf));
                if (null == a || "" == a || (as != "-" && as != ab && Judge)) {
                    this.setData("PFT_" + c.id);
                    cookie.set("PFT_COOKIE_RF", decodeURIComponent(md.g.rf));
                    md.g.tt = this.getData("PFT_" + c.id);
                    if (md.g.tt == null || md.g.tt == "") {
                        md.cookie.setNull("PFT_" + c.id, u.createUUID());
                        md.g.tt = this.getData("PFT_" + c.id);
                    }
                }
                var cookie_pos = document.cookie.indexOf("vid");
                if (cookie_pos == -1) {
                    var date = new Date();
                    date.setTime(date.getTime() * 100);
                    document.cookie = "vid=" + u.createUUID() + ";expires=" + date.toGMTString() + ";domain=" + md.getDomain() + "; path=/";
                }
                md.g.vid = this.getData("vid");
                if (md.g.vid == null || md.g.vid == "") {
                    document.cookie = "vid=" + u.createUUID() + ";expires=" + date.toGMTString() + "; path=/";
                    md.g.vid = this.getData("vid");
                }
            },
            par: function () {
                var a = "", b = h.I.Q, _c = md.g;
                md.g.cv = this.getSessionData("PFT_CV_" + c.id);
                md.g.api = this.getSessionData("PFT_API");
                if (md.g.cv != null || md.g.cv != undefined || md.g.cv != "") {
                    md.sessionStorage.remove("PFT_CV_" + c.id);
                    md.sessionStorage.remove("PFT_API");
                }
                for (var i = 0; i < b.length; i++) {
                    _c[b[i]] != undefined && _c[b[i]] != "" && _c[b[i]] != null ? a = a + b[i] + "\=" + _c[b[i]] + ((b[i] == "v") ? "" : "\&") : "";
                }
                return a;
            },
            sm: function () {
                var _c = h.I;
                var a = document.createElement("script");
                a.setAttribute("type", "text/javascript");
                a.setAttribute("charset", "utf-8");
                a.setAttribute("src", _c.protocol + "//" + _c.P + "/" + _c.S + "?t\=" + c.id + "\&" + this.par());
                var f = document.getElementsByTagName("script")[0];
                f.parentNode.insertBefore(a, f);
                f.remove()
            },
            hbInfo: function () {
                var _c = h.I;
                var a = document.createElement("script");
                a.setAttribute("type", "text/javascript");
                a.setAttribute("charset", "utf-8");
                a.setAttribute("src", _c.protocol + "//" + _c.P + "/" + _c.S + "?t\=" + c.id + "tt\=" + md.g.tt + "\&rf='-'\&ping=" + Date.parse(new Date()));
                var f = document.getElementsByTagName("script")[0];
                f.parentNode.insertBefore(a, f);
                f.remove()
            },
            heartBeat: function (a) {
                var b = 5 * 60 * 1000, c = 3 * 60 * 1000;
                a == undefined || a == "" || a == null ? b : a = a * 60 * 1000;
                var e = a < c ? b : a
                var d = setInterval(this.hbInfo, e);
            },
            //监听点击事件
            clickEvent:function(){
                document.onclick = function(event){
                    console.log(event)
                    var a = md.position.getXy(event);//获取点击坐标
                    if(a){
                        var s = new sta;
                        console.log(md.g)
                        s.na()
                        s.sm()
                        points = [];
                    }
                }
            },
            init: function () {
                h.b = this;
                this.clickEvent();
                this.na();
                this.sm();
                //this.heartBeat("");
            }

        };
        return new sta;
    })();

    console.log(md.g);
})();