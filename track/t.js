if (!config.open) {
    (function () {
        var points = [], h = {}, md = {}, c = {
            id: config.tid,
            version: "1.0.15",
            q: null
        };

        md.achieve = {};
        //ϵͳ�汾
        md.achieve.os = function (a, b) {
            var osinfo = navigator.platform, userAgent = navigator.userAgent;
            if (a.indexOf("Win") > -1) {
                if (b.indexOf("Windows NT 5.0") > -1) return "Windows 2000"; else if (b.indexOf("Windows NT 5.1") > -1)return "Windows XP"; else if (b.indexOf("Windows NT 5.2") > -1)
                    return "Windows 2003"; else if (b.indexOf("Windows NT 6.0") > -1) return "Windows Vista"; else if (b.indexOf("Windows NT 6.1") > -1 || b.indexOf("Windows 7") > -1)
                    return "Windows 7"; else if (b.indexOf("Windows 8") > -1) return "Windows 8"; else return "Other";
            } else if (a.indexOf("Mac") > -1) return "Mac"; else if (a.indexOf("X11") > -1) return "Unix"; else if (a.indexOf("Linux") > -1) return "Linux"; else if (a.indexOf('Android') > -1 || a.indexOf('Linux') > -1)
                return "Android"; else if (a.indexOf('iPhone') > -1) return "iPhone"; else if (a.indexOf('Windows Phone') > -1) return "Windows Phone"; else return "Other";
        };
        //������汾
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
        //flash�汾
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

        md.V = {};
        md.V.log = function (a, b) {
            var f = new Image, d = "mini_tangram_log_" + Math.floor(2147483648 * Math.random()).toString(36);
            window[d] = f;
            f.onload = f.onerror = f.onabort = function () {
                f.onload = f.onerror = f.onabort = c.q;
                f = window[d] = c.q;
                b && b(a)
            };
            f.src = a
        };
        md.cookie = {};
        md.getDomain = function () {
            var a = document.location.hostname;
            var b = a.substring(a.indexOf(".") + 1);
            return b;
        };
        md.cookie.set = function (a, b, c) {
            document.cookie = a + "=" + escape(b) + "; path=/";
        };
        md.cookie.setNull = function (a, b) {
            document.cookie = a + "=" + escape(b) + "; path=/";
        };
        md.cookie.get = function (a) {
            var arr, reg = new RegExp("(^| )" + a + "=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg)) return unescape(arr[2]); else return null;
        };
        md.cookie.remove = function (a) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = md.cookie.get(a);
            if (cval != null) document.cookie = a + "=" + cval + ";expires=" + exp.toGMTString();
        };
        //�û�ʹ���豸��0 �ƶ��˷�����ҳ  1 PC�˷�����ҳ��
        md.achieve.PorM = function (a) {
            if (/AppleWebKit.*Mobile/i.test(a) || /Android/i.test(a) || /BlackBerry/i.test(a) || /IEMobile/i.test(a) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(a))) {
                if (/iPad/i.test(a)) return "1"; else return "1";
            } else {
                return "0";
            }
        }

        var p = !0, s = null, t = !1, ac = md.achieve;
        md.g = {};
        //os ϵͳ
        md.g.os = ac.os(navigator.platform, navigator.userAgent);
        //br �����
        md.g.br = ac.browser(navigator.userAgent);
        //fl flash�汾
        md.g.fl = ac.flashV(navigator.plugins);
        //pm �����ն�(0 pc,1 �ֻ�)
        md.g.pm = ac.PorM(navigator.userAgent);
        //sr ��Ļ�ֱ���
        md.g.sr = window.screen.width + "x" + window.screen.height;
        //lg ����
        md.g.lg = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";
        //ck �Ƿ�֧��cookie (0 ��֧�֣�1 ֧��)
        md.g.ck = (navigator.cookieEnabled ? "1" : "0");
        //ja �Ƿ�֧��java (0 ��֧�� �� 1 ֧��)
        md.g.ja = (navigator.javaEnabled() ? "1" : "0");
        //sc ��Ļ��ɫ
        md.g.sc = window.screen.colorDepth + "-bit";
        //dt ���ҳ��ʱ��
        md.g.dt = new Date().getTime();
        //rf ��Դҳ�� url
        md.g.rf = document.referrer == "" ? "-" : encodeURIComponent(document.referrer);
        //loc ��ǰҳ��url
        md.g.loc = window.location.href;
        //v ͳ��js�汾��
        md.g.v = c.version;
        //tit  title��Ϣ
        md.g.tit = document.title;
        //ct ���Ͽͻ���0:�¿ͻ��� 1���Ͽͻ���
        md.g.ct = ((md.cookie.get("vid") == null || md.cookie.get("vid") == undefined || md.cookie.get("vid") == "") ? "0" : "1");
        // hm ����ͼ����
        // n�Ƿ��ǵ�һ�η���
        // sm
        // api
        // tt �û��ķ���uv
        // vid cookie  id�ÿ�Ψһ��ʶ
        // u       _trackPageview��������          PV����
        // et      _trackEvent�¼����ٷ�������      �¼�����
        // cv      _setCustomVar�Զ��巽������      �Զ�����
        // tmc     �ƶ�ת�����߼�ط�������         �ƶ�ת�����߼��
        // tod     ���̶������ݼ�ط�������         ���̶������ݼ��

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

        //ȫ�ֱ���h.I ���ʵ�ַURL���� �磺http://best-ad.cn/pft.gif?query string parameters
        h.I = {
            u: config.domain,
            P: "log.best-ad.cn",
            S: "pft.gif",
            //dk: 20001,//":" + _c.dk +
            protocol: "https:" == document.location.protocol ? "https:" : "http:",
            Q: "os tit br fl pm sr lg ck ja sc dt rf loc tt ct vid u api et cv xy ut duration durPage n v".split(" ")
        };
        //ͨ���հ� ���� ˽�б��� sa
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
         * �û�  ���÷�������˵��
         *  ���������û��ֵ����������ͳ��
         * _trackPageview��
         *          �ӿ�˵����
         *                  ���ڷ���ĳ��ָ��URL��PVͳ������ͨ������AJAXҳ���PVͳ�ơ�
         *                  ʹ�øýӿ����ɵ�ͳ���������û�����һ����ʵҳ�������ɵ�ͳ������������ͬЧ���ġ����øýӿں���"���·ÿ�"��"�ܷ�ҳ��"�ȱ����ж��ܿ���ָ��URL����Ӧ��PV��
         *
         *          ���ã�_pct.putPar(['_trackEvent', pageURL]),
         *          ˵���� _trackEvent �����¼�  ------�����ѡ
         *                pageURL��ָ��Ҫͳ��PV��ҳ��URL��------�����ѡ��
         *          ����ʵ����<input type="button" onclick="_pct.putPar(['_trackEvent', '/parm/action'])" value="����"/>
         * _trackEvent
         *          �ӿ�˵����
         *                  ���ڴ���ĳ���¼�����ĳ����ť�ĵ�����򲥷����Ĳ���/ֹͣ���Լ���Ϸ�Ŀ�ʼ/��ͣ�ȡ�
         *                  �¼����ٵ����ݲ��ᱻ���뵽ҳ��PV�У��ʺ�����ͳ�����еĲ���Ҫ����PV��ҳ���¼���
         *
         *          ���� _pct.putPar(['_trackEvent', category, action, extraInfo, extraNumValue]);
         *          ˵����category ��Ҫ��ص�Ŀ����������ƣ�ͨ����ͬһ��Ŀ�������.------ �����ѡ
         *               action���û���Ŀ�꽻������Ϊ.-------�����ѡ
         *               extraInfo: �¼���һЩ������Ϣ��ͨ�������Ǹ��������ơ���������ơ����ӵ����Ƶȵȡ�------�����ѡ��
         *               extraNumValue: �¼���һЩ��ֵ��Ϣ������Ȩ�ء�ʱ�����۸�ȵȣ��ڱ����п��Կ�����ƽ��ֵ�����ݡ�-----�����ѡ��
         *          ����ʵ����<a onclick="_pct.putPar(['_trackEvent', 'nav', 'click', 'literature'])" href="">�������Event</a>
         * _setCustomVar
         *          �ӿ�˵�����ýӿ������Զ���һ���������ñ�����׷�ӵ�PVͳ�Ƶ������У��Ӷ�׷�ٷÿ���վ���ϵ���Ϊ��
         *
         *                   �ÿ���վ���ϵķ��ʿ��Է�Ϊ3�����𣺷ÿͼ��𡢷ôμ���ҳ�漶��
         *
         *                   �ÿͼ��𣺸�һ���ÿ͵�����������ǰ󶨵ģ�ͬһ�����������վ�ϵ����л���ᱻ��Ϊ��������ͬһ���ÿ͡�
         *                   �ôμ��𣺵��ÿ���������һ��ʱ���ڴ��ڻ״̬�����ǻ���ʶ���Ǵ���ͬһ���ô��ڡ�����ÿ�һ��ʱ��û�з����κ�ҳ�棬���Ǿͻ���Ϊ��ǰ�ôν����ˡ�
         *                   ҳ�漶�𣺵��ÿ���һ��ҳ���ڻʱ��������ҳ�漶��
         *                   ������ÿһ�����𶼶�Ӧ��һ�����÷�Χ��ÿһ���Զ����������������ĳ����Χ�ڵġ�
         *
         *                   �������ǿ��ܻ�ͳ�ƣ�
         *
         *                   վ����VIP�ͻ�����ͨ�ͻ����������ÿͼ���
         *                   ��¼�û��ķô��������ôμ���
         *                   ҳ���ϼ�����ť���ĸ����û������ģ�ҳ�漶��
         *          ���ã�_pct.putPar(['_setCustomVar', index, name, value, opt_scope]);��
         *          ˵����index�����Զ��������ռ�õ�λ�á�ȡֵΪ��1��5��------�����ѡ��
         *               name�����Զ�����������֡�-----�����ѡ��
         *               value�����Զ��������ֵ��--------�����ѡ.
         *               opt_scope�����Զ�����������÷�Χ�������ѡ��1Ϊ�ÿͼ��𣨶Ը÷ÿ�ʼ����Ч����2Ϊ�ôμ����ڵ�ǰ�ô�����Ч����3Ϊҳ�漶�𣨽��ڵ�ǰҳ����Ч����Ĭ��Ϊ3��
         *          ����ʵ����_pct.putPar(['_setCustomVar', 1, 'customer', 'vip', 3])
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
                    md.g.dt = new Date().getTime();
                    md.g.api = "1_0";
                    h.b.init();
                },
                _trackEvent: function (a) {
                    if (a[1] != undefined && a[1] != "" && a[1] != null) {
                        if (a[2] != undefined && a[2] != "" && a[2] != null) {
                            md.g.dt = new Date().getTime();
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
                                md.cookie.set("PFT_CV_" + c.id, decodeURIComponent(cvInfo), 1);
                                md.cookie.set("PFT_API", decodeURIComponent("3_0"), 1);
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

            var ccz = md.g, ast = md.V, faz = md.achieve, sess = md.sessionStorage, loa = md.localStorage, cookie = md.cookie, u = md.UUID, position = md.position;
            sta.prototype = {
                setData: function (a) {
                    try {
                        cookie.set(a, u.createUUID(), 1);
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
                    if (null == a || undefined == a || "" == a || (as != "-" && as != ab && Judge)) {
                        this.setData("PFT_" + c.id);
                        cookie.set("PFT_COOKIE_RF", decodeURIComponent(md.g.rf));
                        md.g.tt = this.getData("PFT_" + c.id);
                        if (md.g.tt == null || md.g.tt == "") {
                            md.cookie.setNull("PFT_" + c.id, u.createUUID());
                            md.g.tt = this.getData("PFT_" + c.id);
                        }
                        md.g.n = "1";
                        md.cookie.remove("PFT_DTNJ");
                        md.cookie.remove("PFT_DTNP");
                    }
                    var cookie_pos = document.cookie.indexOf("vid");
                    if (cookie_pos == -1) {
                        var date = new Date();
                        date.setTime(date.getTime() * 100);
                        document.cookie = "vid=" + u.createUUID() + ";expires=" + date.toGMTString() + ";domain=" + md.getDomain() + "; path=/";
                    }
                    md.g.vid = this.getData("vid");
                },
                par: function () {
                    var a = "", b = h.I.Q, _c = md.g;
                    for (var i = 0; i < b.length; i++) {
                        _c[b[i]] != undefined && _c[b[i]] != "" && _c[b[i]] != null ? a = a + b[i] + "\=" + _c[b[i]] + ((b[i] == "v") ? "" : "\&") : "";
                    }
                    return a;
                },
                custor: function () {
                    md.g.cv = md.cookie.get("PFT_CV_" + c.id);
                    md.g.api = md.cookie.get("PFT_API");
                    if (md.g.cv != null || md.g.cv != undefined || md.g.cv != "") {
                        md.cookie.remove("PFT_CV_" + c.id);
                        md.cookie.remove("PFT_API");
                        this.sm();
                    }
                },
                sm: function (a) {
                    var _c = h.I;
                    var d = _c.protocol + "//" + _c.P + "/" + _c.S + "?t\=" + c.id + "\&" + this.par();
                    ast.log(d);
                },
                hbInfo: function () {
                    var _c = h.I;
                    var a = document.createElement("script");
                    a.setAttribute("type", "text/javascript");
                    a.setAttribute("charset", "utf-8");
                    a.setAttribute("src", _c.protocol + "//" + _c.P + "/" + _c.S + "?t\=" + c.id + "tt\=" + md.g.tt + "\&rf='-'\&ping=" + Date.parse(new Date()));
                    var f = document.getElementsByTagName("script")[0];
                    f.parentNode.insertBefore(a, f);
                },
                heartBeat: function (a) {
                    var b = 5 * 60 * 1000, c = 3 * 60 * 1000;
                    a == undefined || a == "" || a == null ? b : a = a * 60 * 1000;
                    var e = a < c ? b : a
                    var d = setInterval(this.hbInfo, e);
                },
                init: function () {
                    h.b = this;
                    this.na();
                    this.sm();
                    this.custor();
                    //this.heartBeat("");
                }

            };
            return new sta;
        })();
        //url�ٶ�
        (function () {
            var en = md.event, cookie = md.cookie;
            var la = function (a) {
                var b = performance.timing, d = b[a + "Start"] ? b[a + "Start"] : 0;
                a = b[a + "End"] ? b[a + "End"] : 0;
                return {start: d, end: a, value: 0 < a - d ? a - d : 0}
            }
            var ut = function () {
                var a, req, nav;
                nav = la("navigation");
                req = la("request");
                a = {
                    nett: req.start - nav.start,    // netAll �������ȫ��ʱ��
                    netd: la("domainLookup").value,  // netDns ��������ʱ��
                    nttp: la("connect").value,  //netTcp���Ӽ���ʱ��
                    srv: la("response").start - req.start,  //��Ӧʱ��
                    dms: performance.timing.domInteractive - performance.timing.fetchStart,  //dom������ʱ��
                    let: la("loadEvent").end - nav.start  //�¼�����ʱ��
                };
                var ctime = cookie.get("judge");
                if (ctime != md.g.tt) {
                    cookie.setNull("judge", md.g.tt);
                    md.g.ut = JSON.stringify(a);
                    h.b.sm();
                    md.g.ut = null;
                }
            };
            en.e(window, "load", function () {
                setTimeout(ut, 400);
            })
        })();
        if (config.timeOpen) {
            //ʱ��ת��
            (function () {
                var ck = md.cookie;
                ck.get("PFT_DTNJ") === null ? ck.set("PFT_DTNJ", true) : "";
                if (ck.get("PFT_DTNJ") == "true") {
                    var duration = function () {

                        var dtn = ck.get("PFT_DTN") == null ? ck.set("PFT_DTN", new Date().getTime()) : ck.get("PFT_DTN");
                        var dateTime = new Date().getTime();
                        if (parseInt((dateTime - dtn) / 1000) >= config.timeVal) {
                            md.g.duration = 1;
                            h.b.sm();
                            md.g.duration = null;
                            clearInterval(timer);
                        }
                        ck.set("PFT_DTNJ", false);
                    }
                }
                var timer = setInterval(duration, 1000);
            }());
        }
        if (config.timeOpen) {
            //��ҳ��ת��
            (function () {
                var ck = md.cookie;
                ck.get("PFT_DTNP") == null ? ck.set("PFT_DTNP", true) : "";
                if (ck.get("PFT_DTNP") === "true") {
                    var dtn = ck.get("PFT_PAGE") == null ? ck.set("PFT_PAGE", 0) : ck.get("PFT_PAGE");
                    if (parseInt(dtn) >= config.pageVal) {
                        md.g.durPage = 1;
                        h.b.sm();
                        md.g.durPage = null;
                        ck.set("PFT_DTNP", false);
                    } else {
                        ck.set("PFT_PAGE", parseInt(ck.get("PFT_PAGE")) + 1)
                    }
                }
            }());
        }
        if (config.mouse) {
            //��ȡ����ͼ�������
            (function () {
                document.onclick = function (event) {
                    //��ȡ����
                    var e = event || window.event;
                    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                    var x = e.pageX || e.clientX + scrollX;
                    var y = e.pageY || e.clientY + scrollY;
                    var point = {
                        x: x,
                        y: y
                    };
                    points.push(point);
                    if (points.length >= 5) {
                        md.g.xy = JSON.stringify(points);
                        h.b.sm();
                        points = [];
                    }
                }
            })();
        }
    })();
}	