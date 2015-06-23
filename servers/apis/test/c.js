/**
 * Created by XiaoWei on 2015/6/19.
 */
T.namespace = function (d) {
    var c = d.split("."), b = this, a;
    if (c[0] === "T" || c[0] === "baidu") {
        c = c.slice(1)
    }
    for (a = 0; a < c.length; a += 1) {
        if (typeof b[c[a]] === "undefined") {
            b[c[a]] = {}
        }
        b = b[c[a]]
    }
    return b
};
T.i18n.currentLocale = "zh-CN";
T.i18n.number.formatNumber = function (a) {
    if (a == null) {
        return ""
    }
    if (a == "--") {
        return a
    }
    if (isNaN(parseFloat(a))) {
        return a
    }
    return T.i18n.number.format(a, T.i18n.currentLocale)
};
T.i18n.number.formatRatio = function (a) {
    if (a == null) {
        return ""
    }
    if (a == "--") {
        return a
    }
    if (isNaN(parseFloat(a))) {
        return a
    }
    return T.i18n.number.format(a, T.i18n.currentLocale) + "%"
};
T.i18n.number.formatTime = function (d, g) {
    var b, f, h, e, a;
    if (d == "--") {
        return d
    }
    if (g == 2) {
        h = d / 60 | 0;
        e = Math.round(d) - h * 60;
        var c = "";
        if (h) {
            c += h + "&#039;"
        }
        c += e + "&quot;";
        return c
    }
    b = d / (24 * 3600) | 0;
    d = Math.round(d) - b * 24 * 3600;
    f = d / 3600 | 0;
    d = Math.round(d) - f * 3600;
    h = d / 60 | 0;
    e = Math.round(d) - h * 60;
    if (Math.round(b) < 10) {
        b = b > 0 ? "0" + b : ""
    }
    if (Math.round(f) < 10) {
        f = "0" + f
    }
    if (Math.round(h) < 10) {
        h = "0" + h
    }
    if (Math.round(e) < 10) {
        e = "0" + e
    }
    if (b) {
        a = b + " " + f + ":" + h + ":" + e
    } else {
        a = f + ":" + h + ":" + e
    }
    return a
};
T.namespace("T.config");
T.lang.Class.create = function (b, a) {
    return new b(a)
};
T.createClass = function (a) {
    return T.lang.createClass(function (b) {
        this.options = T.extend(T.object.clone(this.options), T.object.clone(b));
        this._init && this._init()
    }).extend(a)
};
T.createUI = function (a) {
    return T.ui.createUI(function (b) {
        this.uiType = this._type;
        this.classPrefix = this._type;
        this.options = T.extend(T.object.clone(this.options), T.object.clone(b));
        this._init && this._init()
    }).extend(a)
};
T.inlineTip = function (b) {
    if (!T.g(b)) {
        return
    }
    if (T.dom.hasAttr(T.g(b), "defaultText")) {
        T.on(b, "click", function () {
            if (T.trim(this.value) == T.dom.getAttr(this, "defaultText")) {
                T.dom.removeClass(this, "gray");
                this.value = ""
            } else {
                T.dom.removeClass(this, "gray")
            }
        });
        T.on(b, "blur", function () {
            if (T.trim(this.value) == "" || T.trim(this.value) == T.dom.getAttr(this, "defaultText")) {
                T.dom.addClass(this, "gray");
                this.value = T.dom.getAttr(this, "defaultText")
            }
        });
        var a = T.dom.getAttr(T.g(b), "defaultText");
        if (a != T.g(b).value) {
            T.dom.removeClass(b, "gray")
        } else {
            T.dom.addClass(b, "gray")
        }
    } else {
        T.dom.addClass(b, "gray");
        T.on(b, "click", function () {
            if (T.trim(this.value) == this.defaultValue) {
                T.dom.removeClass(this, "gray");
                this.value = ""
            }
        });
        T.on(b, "blur", function () {
            if (T.trim(this.value) == "") {
                T.dom.addClass(this, "gray");
                this.value = this.defaultValue
            }
        })
    }
};
T.getInlineTipInputValue = function (a) {
    if (!T.g(a)) {
        return
    }
    if (T.dom.hasAttr(T.g(a), "defaultText")) {
        if (T.dom.getAttr(T.g(a), "defaultText") == T.g(a).value) {
            return ""
        } else {
            return T.g(a).value
        }
    } else {
        return T.g(a).value
    }
};
T.clearInlineTipInputValue = function (b) {
    var a = T.g(b);
    if (a && a.defaultValue != null) {
        T.dom.removeClass(a, "gray");
        a.value = a.defaultValue;
        T.event.uns([a], ["focus", "blur"])
    }
};
T.getCornerPosition = function (c, b, d) {
    c = T.g(c);
    var a = T.dom.getPosition(c);
    switch (b) {
        case"br":
            a.left += c.offsetWidth;
            a.top += c.offsetHeight;
            break;
        case"tr":
            a.left += c.offsetWidth;
            break;
        case"bl":
            a.top += c.offsetHeight;
            break
    }
    if (d) {
        if (d.left) {
            a.left += d.left
        }
        if (d.top) {
            a.top += d.top
        }
    }
    return a
};
T.setRelatedPosition = function (b, c, a, d) {
    T.dom.setPosition(b, T.getCornerPosition(c, a, d))
};
T.event.ons = function (c, a, b) {
    T.each(c, function (d) {
        if (a instanceof Array) {
            T.each(a, function (e) {
                T.on(d, e, b)
            })
        } else {
            T.on(d, a, b)
        }
    })
};
T.ons = T.event.ons;
T.event.uns = function (c, b, a) {
    T.each(c, function (d) {
        if (b instanceof Array) {
            T.each(b, function (e) {
                T.un(d, e, a)
            })
        } else {
            T.un(d, b, a)
        }
    })
};
T.uns = T.event.uns;
T.truncat = function (b, a) {
    if (b == null) {
        return b
    }
    var c = 1;
    if (/[^\x00-\xff]/.test(b)) {
        a = Math.floor(2 * a / 3);
        c = 2
    }
    if (b.length > a) {
        return b.substr(0, a - 2 / c) + "..."
    } else {
        return b
    }
};
T.param = function (b) {
    var a = [];
    T.object.each(b, function (d, c) {
        if (d == null) {
            return
        }
        if (T.lang.isArray(d)) {
            T.each(d, function (e) {
                a.push(encodeURIComponent(c + "[]") + "=" + encodeURIComponent(e))
            })
        } else {
            a.push(encodeURIComponent(c) + "=" + encodeURIComponent(d))
        }
    });
    return a.join("&").replace(/%20/g, "+")
};
T.ajax.checkConditionalPageTip = function (b) {
    var a = T.g("ConditionalPageTip");
    if (b) {
        text = T.dom.one(".text", a);
        text.innerHTML = b;
        T.show(a)
    } else {
        T.hide(a)
    }
};
T.ajax.jsonPost = function (b, c, a, d) {
    T.ajax.request(b, {
        data: T.param(c), onsuccess: function (g) {
            var e = null;
            try {
                e = T.json.decode(g.responseText);
                if (e.status === 0 || e.status > 2) {
                    a(e.data, e.status);
                    if (e.status === 0 && /\/a$/i.test(c.method)) {
                        T.ajax.checkConditionalPageTip(e.msg)
                    }
                } else {
                    if (e.status === 1) {
                        if (d) {
                            d(e.msg)
                        }
                    } else {
                        if (e.status === 2) {
                            window.location = e.data
                        }
                    }
                }
            } catch (f) {
                if (d) {
                    d("系统错误，请稍候再试…")
                }
            }
        }, onfailure: function () {
            if (d) {
                d("系统错误，请稍候再试…")
            }
        }, method: "POST", noCache: true
    })
};
T.ajax.jsonGet = function (b, c, a, d) {
    T.ajax.request(b, {
        data: T.param(c), onsuccess: function (g) {
            var e = null;
            try {
                e = T.json.decode(g.responseText);
                if (e.status === 0 || e.status > 2) {
                    a(e.data, e.status);
                    if (e.status === 0 && /\/a$/i.test(c.method)) {
                        T.ajax.checkConditionalPageTip(e.msg)
                    }
                } else {
                    if (e.status === 1) {
                        if (d) {
                            d(e.msg)
                        }
                    } else {
                        if (e.status === 2) {
                            window.location = e.data
                        }
                    }
                }
            } catch (f) {
                if (d) {
                    d("系统错误，请稍候再试…")
                }
            }
        }, onfailure: function () {
            if (d) {
                d("系统错误，请稍候再试…")
            }
        }, method: "GET", noCache: true
    })
};
var EventRouter = {
    _events: {}, _owner: null, register: function (a, b) {
        if (this._events[a]) {
            this._events[a].push(b)
        } else {
            this._events[a] = [b]
        }
    }, dispatch: function (a) {
        var d = [].slice.call(arguments, 1);
        var c = this._events[a];
        if (c) {
            for (var b = 0; b < c.length; b++) {
                c[b].apply(this._owner, d)
            }
        }
        if (this._owner && T.lang.isFunction(this._owner[a])) {
            this._owner[a].apply(this._owner, d)
        }
    }, setOwner: function (a) {
        this._owner = a
    }
};
var AceTemplate = AceTemplate || {};
(function () {
    var d = {
        log: function (h) {
            window.console && console.log(h)
        }
    };
    var f = {"#39": "'", quot: '"', lt: "<", gt: ">", amp: "&", nbsp: " "};
    var c = {"'": "#39", '"': "quot", "<": "lt", ">": "gt", "&": "amp", " ": "nbsp"};
    var g = {
        g: function (h) {
            if (typeof h != "string") {
                return h
            }
            return document.getElementById(h)
        }, decodeHTML: function (h) {
            return String(h).replace(/&(#39|quot|lt|gt|amp|nbsp);/ig, function (j, i) {
                return f[i]
            }).replace(/&#u([a-f\d]{4});/ig, function (i, j) {
                return String.fromCharCode(parseInt("0x" + j))
            }).replace(/&#(\d+);/ig, function (i, j) {
                return String.fromCharCode(+j)
            })
        }, encodeAttr: function (h) {
            return String(h).replace(/["']/g, function (i) {
                return "&" + c[i] + ";"
            })
        }, encodeHTML: function (h) {
            return String(h).replace(/['"<>& ]/g, function (i) {
                return "&" + c[i] + ";"
            })
        }, elementText: function (h) {
            if (!h || !h.tagName) {
                return ""
            }
            if (/^(input|textarea)$/i.test(h.tagName)) {
                return h.value
            }
            return g.decodeHTML(h.innerHTML)
        }
    };
    var a = {};
    var e = false;

    function b(j) {
        var i = [], k = [];
        i.push("with(this){");
        i.push(j.replace(/[\r\n]+/g, "\n").replace(/^\n+|\s+$/mg, "").replace(/((^\s*[<>!#^&\u0000-\u0008\u007F-\uffff].*$|^.*[<>]\s*$|^(?!\s*(else|do|try|finally)\s*$)[^'":;,\[\]{}()\n\/]+$|^(\s*(([\w-]+\s*=\s*"[^"]*")|([\w-]+\s*=\s*'[^']*')))+\s*$|^\s*([.#][\w-.]+(:\w+)?(\s*|,))*(?!(else|do|while|try|return)\b)[.#]?[\w-.*]+(:\w+)?\s*\{.*$)\s?)+/mg, function (l) {
            l = ['"', l.replace(/&none;/g, "").replace(/["'\\]/g, "\\$&").replace(/\n/g, "\\n").replace(/(!?!?#)\{(.*?)\}/g, function (p, m, o) {
                o = o.replace(/\\n/g, "\n").replace(/\\([\\'"])/g, "$1");
                var n = /^[a-z$][\w+$]+$/i.test(o) && !(/^(true|false|NaN|null|this)$/.test(o));
                return ['",', n ? ["typeof ", o, '=="undefined"?"":'].join("") : "", (m == "#" ? "_encode_" : m == "!!#" ? "_encodeAttr_" : ""), "(", o, '),"'].join("")
            }), '"'].join("").replace(/^"",|,""$/g, "");
            if (l) {
                return ["_output_.push(", l, ");"].join("")
            } else {
                return ""
            }
        }));
        i.push("}");
        var h = new Function("_output_", "_encode_", "helper", "_encodeAttr_", i.join(""));
        return h
    }

    AceTemplate.format = function (m, l, k) {
        if (!m) {
            return ""
        }
        var h, j;
        if (typeof m == "object" && m.tagName) {
            j = m;
            m = j.getAttribute("id")
        }
        k = k || this;
        h = a[m];
        if (!h) {
            if (!/[^\w-]/.test(m)) {
                if (!j) {
                    j = g.g(m)
                }
                h = this.register(m, j)
            } else {
                h = b(m)
            }
        }
        var i = [];
        h.call(l || "", i, g.encodeHTML, k, g.encodeAttr);
        return i.join("")
    };
    AceTemplate.register = function (m, l) {
        if (!arguments.length && !e) {
            e = true;
            var h = document.getElementsByTagName("script");
            for (var k = 0; k < h.length; k++) {
                var j = h[k];
                if (/^(text\/template)$/i.test(j.getAttribute("type"))) {
                    var m = j.getAttribute("id");
                    m && arguments.callee.call(this, m, j)
                }
            }
        }
        if (!m) {
            return
        }
        if (a[m]) {
            return a[m]
        }
        if (typeof l != "string") {
            if (typeof l == "undefined") {
                l = g.g(m)
            }
            l = g.elementText(l)
        }
        return a[m] = b(l)
    };
    AceTemplate.unregister = function (h) {
        delete a[h]
    }
})();
if (AceTemplate.format) {
    AceTemplate._format = AceTemplate.format;
    AceTemplate.format = function (d, c, b) {
        var a = AceTemplate._format(d, c, b);
        return String(a).replace(/(.+?)>\s*<(.+?)/g, "$1><$2")
    }
}
function loadedCallback(a) {
    EventRouter.dispatch("onflashLoaded", a)
}
function createImageSuccess(a) {
    EventRouter.dispatch("onflashCreateImageSuccess", a)
}
T.dom.one = function (c, b) {
    var a = T.dom.query(c, T.g(b));
    return a.length > 0 ? a[0] : null
};
T.dom.attachDropList = function (b) {
    function a(d, c) {
        if (d.type == "mouseover") {
            T.dom.addClass(c, "more-item-container-hover")
        } else {
            T.dom.removeClass(c, "more-item-container-hover")
        }
    }

    if (b) {
        T.event.ons(b, ["mouseover", "mouseout"], a)
    } else {
        if (T.q("more-item-container").length != 0) {
            T.event.ons(T.q("more-item-container"), ["mouseover", "mouseout"], a)
        }
    }
};
T.isCustomer = function () {
    var a = /.*customer$/i, b;
    T.object.each(T.config.userInfo.roles, function (d, c) {
        if (a.test(c) && d) {
            b = true
        }
    });
    return b
};
T.lang.isUrl = T.lang.isUrl || function (a) {
    return (/^((https|http|ftp|rtsp|mms)?:\/\/)?(([\w-]+\.)+[a-z]{2,6}|((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i).test(a)
};
T.lang.isMonUrl = T.lang.isMonUrl || function (b) {
    var a = ["^((https|http|ftp|rtsp|mms)?:\\/\\/)?", "(([\\w-]+\\.)+[a-z]{0,6}", "|((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d))", "(:[0-9]+)?", "(([\\w#!:.?+=&%@!\\-\\/])*\\*?[\\w#!:.?+=&%@!\\-\\/]*)?$"].join("");
    var c = new RegExp(a, "i");
    return c.test(b)
};
T.lang.isEmail = T.lang.isEmail || function (a) {
    return (/^\w+([-\.]\w+)*@\w+([-\.]\w+)*\.\w+([-\.]\w+)*$/i).test(a)
};
(function () {
    var b = null;
    var a = null;
    T.on(document.body, "click", function (e) {
        var g = T.event.get(e).target;
        var f = null;
        var d = null;
        do {
            if (g != document) {
                if (T.dom.hasClass(g, "layer")) {
                    d = g
                }
                if (T.dom.hasAttr(g, "layer")) {
                    f = g
                }
            }
        } while (g = g.parentNode);
        var c = function (j, i) {
            if (i) {
                T.dom.addClass(j, "selected")
            } else {
                T.dom.removeClass(j, "selected")
            }
            T.each(T.q("arrow", j), function (k) {
                if (i) {
                    T.dom.addClass(k, "selected")
                } else {
                    T.dom.removeClass(k, "selected")
                }
            })
        };
        if (f == null) {
            if (a != null && d != a) {
                T.hide(a);
                c(b, false);
                a = null;
                b = null
            }
        } else {
            var h = T.dom.one(T.dom.getAttr(f, "layer"));
            if (h != null) {
                if (a != null && h != a) {
                    T.hide(a);
                    c(b, false)
                }
                a = null;
                b = null;
                if (h.style.display == "none" || T.dom.hasClass(h, "shared-layer")) {
                    T.show(h);
                    c(f, true);
                    a = h;
                    b = f
                } else {
                    T.hide(h);
                    c(f, false)
                }
            }
        }
    })
})();
T.string.format = function (c, a) {
    c = String(c);
    var b = Array.prototype.slice.call(arguments, 1), d = Object.prototype.toString;
    if (b.length) {
        b = b.length == 1 ? (a !== null && (/\[object Array\]|\[object Object\]/.test(d.call(a))) ? a : b) : b;
        return c.replace(/(#|!)\{(.+?)(?:\s*,\s*(\d+?))*?\}/g, function (e, h, g, i) {
            var f = b[g];
            if ("[object Function]" == d.call(f)) {
                f = f(g)
            }
            if (i) {
                f = T.truncat(f, i)
            }
            if (h == "!") {
                f = T.string.encodeHTML(f)
            }
            return ("undefined" == typeof f ? "" : f)
        })
    }
    return c
};
T.format = T.string.format;
(function (a) {
    a.fn.bgiframe = (a.browser.ie && /msie 6.0/i.test(navigator.userAgent) ? function (e, d) {
        d = a.extend({
            top: "auto",
            left: "auto",
            width: "auto",
            height: "auto",
            opacity: true,
            src: "javascript:false;"
        }, d);
        var c = '<iframe class="bgiframe" frameborder="0" tabindex="-1" src="' + d.src + '"style="display:block;position:absolute;z-index:-1;' + (d.opacity !== false ? "filter:Alpha(Opacity='0');" : "") + "top:" + (d.top == "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+'px')" : b(d.top)) + ";left:" + (d.left == "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+'px')" : b(d.left)) + ";width:" + (d.width == "auto" ? "expression(this.parentNode.offsetWidth+'px')" : b(d.width)) + ";height:" + (d.height == "auto" ? "expression(this.parentNode.offsetHeight+'px')" : b(d.height)) + ';"/>';
        return T.array.each(e, function (f) {
            if (T.dom.query("iframe.bgiframe", f).length == 0) {
                f.insertBefore(T.dom.create(c), f.firstChild)
            }
        })
    } : function () {
        return this
    });
    a.fn.bgIframe = a.fn.bgiframe;
    function b(c) {
        return c && c.constructor === Number ? c + "px" : c
    }
})(T);
T.Class = function () {
    var a = arguments.length;
    var d = arguments[0];
    var c = arguments[a - 1];
    var e = typeof c.initialize == "function" ? c.initialize : function () {
        d.prototype.initialize.apply(this, arguments)
    };
    if (a > 1) {
        var b = [e, d].concat(Array.prototype.slice.call(arguments).slice(1, a - 1), c);
        T.inherit.apply(null, b)
    } else {
        e.prototype = c
    }
    e.extend = function (g) {
        if (!"[object Array]" == Object.prototype.toString.call(g)) {
            g = Array.prototype.concat.call(g)
        }
        var f = g.length;
        while (f--) {
            g[f].call(e.prototype)
        }
        return e
    };
    return e
};
T.inherit = function (f, d) {
    var c = function () {
    };
    c.prototype = d.prototype;
    f.prototype = new c;
    var b, a, e;
    for (b = 2, a = arguments.length; b < a; b++) {
        e = arguments[b];
        if (typeof e === "function") {
            e = e.prototype
        }
        T.Util.extend(f.prototype, e)
    }
};
T.namespace("T.Util");
T.Util.extend = function (a, e) {
    a = a || {};
    if (e) {
        for (var d in e) {
            var c = e[d];
            if (c !== undefined) {
                a[d] = c
            }
        }
        var b = typeof window.Event == "function" && e instanceof window.Event;
        if (!b && e.hasOwnProperty && e.hasOwnProperty("toString")) {
            a.toString = e.toString
        }
    }
    return a
};
T.Util.blank = function () {
};
T.url.queryToJson = function (a) {
    var j = a.lastIndexOf("?");
    if (j == -1) {
        return {}
    }
    var f = a.substr(j + 1), c = f.split("&"), e = c.length, l = {}, d = 0, h, g, k, b;
    for (; d < e; d++) {
        if (!c[d]) {
            continue
        }
        b = c[d].split("=");
        h = b[0];
        g = b[1];
        k = l[h];
        if ("undefined" == typeof k) {
            l[h] = g
        } else {
            if (baidu.lang.isArray(k)) {
                k.push(g)
            } else {
                l[h] = [k, g]
            }
        }
    }
    return l
};
T.url.changeQuery = function (b, d, a) {
    var a = a || window.location.href;
    var c = T.url.queryToJson(a);
    c[b] = d;
    window.location.href = window.location.pathname + "?" + T.url.jsonToQuery(c)
};
T.ui.Dialog = T.createUI({
    options: {
        id: "",
        titleText: "默认标题",
        content: "默认内容",
        position: {left: 360, top: 100},
        isSingle: false,
        isModal: false,
        hasClose: true,
        className: "dialog",
        zIndex: 99999
    }, _type: "dialog", _init: function () {
        var a = this;
        a.options.id = a.id = a.getId();
        a.render()
    }, _getInnerString: function () {
        var b = document;
        var a = this;
        var c = ['<div class="dialog-title">'];
        c.push('<div class="dialog-title-text">');
        c.push(a.options.titleText);
        c.push("</div>");
        if (this.options.hasClose) {
            c.push('<a href="javascript:void(0);" class="dialog-close">×');
            c.push("</a>")
        }
        c.push("</div>");
        c.push('<div class="dialog-content">');
        c.push(a._getContentHTML());
        c.push("</div>");
        return c.join("")
    }, _update: function () {
        var e = this;
        var a = e.getContainer();
        if (a) {
            var f = "#" + e.id + " .dialog-title-text";
            var d = T.dom.query(f)[0];
            if (d) {
                d.innerHTML = e.options.titleText
            }
            var c = "#" + e.id + " .dialog-content";
            var b = T.dom.query(c)[0];
            if (b) {
                b.innerHTML = e._getContentHTML()
            }
            T.dom.setPosition(a, e.options.position)
        } else {
            return
        }
    }, _setIFrame: function (d, c, a) {
        var b = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="javascript:false;"style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');top:' + (0) + "px;left:" + (0) + "px;width:" + (c) + "px;height:" + (a) + 'px;"/>';
        if (T.q("bgiframe", d).length === 0) {
            T.dom.insertHTML(d, "beforeBegin", b)
        }
    }, _getContentHTML: function () {
        var b = this;
        var c = document;
        if (T.lang.isString(b.options.content)) {
            return b.options.content
        } else {
            if (T.lang.isElement(b.options.content)) {
                T.show(b.options.content);
                var a = c.createElement("div");
                a.appendChild(b.options.content);
                return a.innerHTML
            } else {
                return ""
            }
        }
    }, setTitleText: function (b) {
        var a = this;
        if (T.lang.isString(b)) {
            a.options.titleText = b
        }
        a._update()
    }, setContent: function (c) {
        var b = this;
        var a = c;
        if (T.lang.isString(a) || T.lang.isElement(a)) {
            b.options.content = a
        }
        b._update()
    }, render: function () {
        var h = document;
        var e = this;
        var a = h.createElement("div");
        a.id = e.id;
        a.className = "dialog-container " + e.options.className;
        var d = "";
        if (e.options.isModal) {
            var c = e.options.zIndex - 1;
            var g = h.createElement("div");
            g.className = e.options.className + " modal";
            g.id = e.id + "modal";
            T.dom.setStyles(g, {
                position: "absolute",
                top: 0,
                left: 0,
                "background-color": "black",
                width: T.page.getWidth(),
                height: T.page.getHeight(),
                opacity: 0.6,
                "z-index": c
            });
            h.body.appendChild(g);
            if (T.browser.ie && (T.browser.ie < 7)) {
                var b = h.createElement("div");
                g.appendChild(b);
                e._setIFrame(g.firstChild, T.page.getWidth(), T.page.getHeight())
            }
            T.un(window, "resize", e._modalResizeHandler);
            T.on(window, "resize", e._modalResizeHandler)
        }
        a.innerHTML = e._getInnerString();
        h.body.appendChild(a);
        if (T.browser.ie && (T.browser.ie < 7)) {
            e._setIFrame(a.firstChild, a.offsetWidth, a.offsetHeight)
        }
        T.dom.setStyles(e.getContainer(), {position: "absolute", "z-index": e.options.zIndex});
        if (e.options.width) {
            T.dom.setStyle(e.getContainer(), "width", e.options.width);
            e.options.position.left = T.page.getScrollLeft() + (T.page.getViewWidth() - e.options.width) / 2;
            e.options.position.top = Math.max(T.page.getScrollTop() + (T.page.getViewHeight() - e.getContainer().offsetHeight) / 2, 0)
        }
        T.dom.setPosition(e.getContainer(), {left: e.options.position.left, top: e.options.position.top});
        if (this.options.hasClose) {
            var f = "#" + e.id + " .dialog-close";
            T.dom.query(f)[0].onclick = function () {
                e.close()
            }
        }
        e.hide()
    }, getContainer: function () {
        return T.g(this.id)
    }, setPosition: function (a) {
        var b = this;
        b.options.position.left = a.left;
        b.options.position.top = a.top;
        b._update()
    }, show: function () {
        var a = this;
        T.dom.show(a.getContainer());
        if (a.options.width) {
            T.dom.setStyle(a.getContainer(), "width", a.options.width);
            a.options.position.left = T.page.getScrollLeft() + (T.page.getViewWidth() - a.options.width) / 2;
            a.options.position.top = Math.max(T.page.getScrollTop() + (T.page.getViewHeight() - a.getContainer().offsetHeight) / 2, 0)
        }
        T.dom.setPosition(a.getContainer(), {left: a.options.position.left, top: a.options.position.top});
        if (a.getModalContainer()) {
            T.dom.show(a.getModalContainer())
        }
    }, hide: function () {
        var a = this;
        T.dom.hide(a.getContainer());
        if (a.getModalContainer()) {
            T.dom.hide(a.getModalContainer())
        }
    }, close: function () {
        if (!this.options.isSingle) {
            if (this.getContainer()) {
                T.dom.remove(this.getContainer())
            }
            if (this.getModalContainer()) {
                T.dom.remove(this.getModalContainer())
            }
            T.un(window, "resize", this._modalResizeHandler)
        } else {
            this.hide()
        }
        this.dispatchEvent("onclose")
    }, getModalContainer: function () {
        return T.g(this.id + "modal")
    }, _modalResizeHandler: function () {
        var b = T.q("modal");
        for (var a = 0; a < b.length; a++) {
            T.dom.setStyles(b[a], {width: T.page.getWidth(), height: T.page.getHeight()})
        }
    }
});
T.ui.Dialog.close = function () {
    T.element(".dialog-container, .modal").each(function (a) {
        T.dom.remove(a)
    })
};
T.ui.Paging = T.createUI({
    options: {
        containerId: null,
        onchange: function (a) {
        },
        offset: 0,
        pageSize: 20,
        pageSizeRange: [20, 50, 100],
        pageSizeSelectText: "每页显示：",
        fuzzy: false,
        withoutGoto: false,
        round: 2,
        previousTemplate: '<a href="javascript:void(0);" class="previous" data="#{0}">&lt;上一页</a>',
        pageNumberTemplate: '<a class="number#{0}" href="javascript:void(0);" data="#{1}">#{1}</a>',
        moreTemplate: "...",
        nextTemplate: '<a href="javascript:void(0);" class="next" data="#{0}">下一页&gt;</a>',
        pagingWrapperTemplate: '<div class="paging clearfix">#{0}</div>',
        pageNumberWrapperTemplate: '<div class="page-number">#{0}#{1}</div>',
        gotoTemplate: '第<input class="text" type="text"/>页 <a href="javascript:void(0)" class="button"><span>确定</span></a>',
        pageSizeWrapperTemplate: '<div class="page-size">#{0}#{1}</div>',
        pageSizeSelectTemplate: "<select>#{0}</select>",
        pageSizeOptionTemplate: '<option value="#{0}"#{1}>#{0}</option>'
    },
    _type: "paging",
    _total: 0,
    _offset: 0,
    _pageSize: 0,
    _fuzzy: false,
    _pageCount: 0,
    _currentPage: 0,
    _init: function () {
        this._offset = this.options.offset;
        this._pageSize = this.options.pageSize;
        this._fuzzy = this.options.fuzzy
    },
    _computeParams: function () {
        this._pageCount = Math.ceil(this._total / this._pageSize);
        if (this._pageCount == 0) {
            this._pageCount = 1
        }
        this._currentPage = this._offset / this._pageSize + 1
    },
    _computePageRange: function (b, c, a) {
        var e = c - a;
        var d = c + a;
        if (e < 1) {
            e = 1;
            d = Math.min(2 * a + 1, b)
        }
        if (d > b) {
            d = b;
            e = Math.max(b - 2 * a, 1)
        }
        return {from: e, to: d}
    },
    _renderPageSize: function () {
        if (!T.lang.isArray(this.options.pageSizeRange) || this.options.pageSizeRange.length == 0) {
            return ""
        }
        if (this._total <= this.options.pageSizeRange[0]) {
            return ""
        }
        var c = "";
        for (var b in this.options.pageSizeRange) {
            var a = this.options.pageSizeRange[b];
            c += T.format(this.options.pageSizeOptionTemplate, a, a == this._pageSize ? ' selected="selected"' : "")
        }
        return T.format(this.options.pageSizeWrapperTemplate, this.options.pageSizeSelectText, T.format(this.options.pageSizeSelectTemplate, c))
    },
    _renderPaging: function () {
        if (this._pageCount <= 1) {
            return ""
        }
        var c = "";
        if (this._currentPage > 1) {
            c += T.format(this.options.previousTemplate, this._currentPage - 1)
        }
        var b = this._computePageRange(this._pageCount, this._currentPage, this.options.round);
        if (!this._fuzzy) {
            if (b.from > 1) {
                c += T.format(this.options.pageNumberTemplate, "", 1) + this.options.moreTemplate
            }
            for (var a = b.from; a <= b.to; a++) {
                c += T.format(this.options.pageNumberTemplate, this._currentPage == a ? " selected" : "", a)
            }
            if (b.to < this._pageCount) {
                c += this.options.moreTemplate + T.format(this.options.pageNumberTemplate, "", this._pageCount)
            }
        }
        if (this._currentPage < this._pageCount) {
            c += T.format(this.options.nextTemplate, this._currentPage + 1)
        }
        return T.format(this.options.pageNumberWrapperTemplate, c, this._fuzzy || this.options.withoutGoto ? "" : this.options.gotoTemplate)
    },
    _changePage: function (c) {
        var d = T.event.get(c).target;
        var b = T.getAttr(d, "data");
        if (b == null) {
            return
        }
        var a = parseInt(b, 10);
        var e = (a - 1) * this._pageSize;
        this._offset = e;
        this._currentPage = a;
        this.options.onchange({
            offset: this._offset,
            currentPage: this._currentPage,
            pageSize: this._pageSize,
            paging: this
        })
    },
    _gotoPage: function (b) {
        var c = T.q("text", this.options.containerId)[0];
        var a = parseInt(T.trim(c.value), 10);
        if (isNaN(a) || a > this._pageCount || a == this._currentPage || a < 1) {
            return
        }
        var d = (a - 1) * this._pageSize;
        this._offset = d;
        this._currentPage = a;
        this.options.onchange({
            offset: this._offset,
            currentPage: this._currentPage,
            pageSize: this._pageSize,
            paging: this
        })
    },
    _changePageSize: function (a) {
        var b = T.event.get(a).target;
        this._pageSize = parseInt(b.value, 10);
        this._offset = 0;
        this._computeParams();
        this.options.onchange({
            offset: this._offset,
            currentPage: this._currentPage,
            pageSize: this._pageSize,
            paging: this
        })
    },
    _bindEvent: function () {
        T.event.ons(T.q("page-number", this.options.containerId), "click", T.fn.bind(this._changePage, this));
        T.event.ons(T.q("button", this.options.containerId), "click", T.fn.bind(this._gotoPage, this));
        T.event.ons(T.dom.query("#" + this.options.containerId + " div.page-size select"), "change", T.fn.bind(this._changePageSize, this))
    },
    clear: function () {
        T.dom.empty(this.options.containerId)
    },
    render: function (c, d, b) {
        if (!T.g(this.options.containerId)) {
            return
        }
        if (c != null) {
            this._total = c
        }
        if (d != null) {
            this._offset = d
        }
        if (b != null) {
            this._fuzzy = b
        }
        if (c != null || d != null) {
            this._computeParams()
        }
        T.dom.empty(this.options.containerId);
        var a = this._renderPageSize() + this._renderPaging();
        if (a != null && a.length > 0) {
            T.insertHTML(this.options.containerId, "beforeend", T.format(this.options.pagingWrapperTemplate, a));
            this._bindEvent()
        }
    }
});
T.Base = T.Class({
    initialize: function (a) {
        T.Util.extend(this, a)
    }, on: function (c, b) {
        if (!this._listeners) {
            this._listeners = {}
        }
        var a = this._listeners;
        if (typeof a[c] != "object") {
            a[c] = [b]
        } else {
            a[c].push(b)
        }
        return this
    }, fire: function (c) {
        if ("[object Function]" == Object.prototype.toString.call(this[c])) {
            this[c].apply(this, Array.prototype.slice.call(arguments, 1))
        }
        if (!this._listeners) {
            this._listeners = {}
        }
        var b = this._listeners;
        if (typeof b[c] == "object") {
            for (var a in b[c]) {
                b[c][a].apply(this, Array.prototype.slice.call(arguments, 1))
            }
        }
        return this
    }, ajax: function (d, a, c) {
        var b = this;
        a = a || {};
        T.extend(a, {method: d.uri});
        this.fire("on" + d.name);
        T.ajax.jsonPost(T.config.systemConfig.ajaxUri, a, function (f, e) {
            b.fire("on" + d.name + "Success", f, {status: e, postData: a, extData: c})
        }, function (e) {
            b.fire("on" + d.name + "Failed", e)
        })
    }
});
T.ui.CheckGroup = T.createUI({
    options: {
        containerId: "CheckGroup",
        onchange: function (a, b) {
        },
        limit: Number.MAX_VALUE,
        label: "",
        items: [],
        disabled: false,
        tip: false,
        selectedItems: [],
        template: '<label for="!{0}"><input id="!{0}" value="!{1}" type="#{2}" title="!{3}" #{4} name="#{5}" #{7} />#{6}</label>',
        groupTemplate: '<div class="group">#{1}#{0}</div>',
        separatorTemplate: '<div class="separator"></div>',
        tipTemplate: '<a class="help" data="#{0}" href="javascript:void(0)">&nbsp;</a>'
    }, _type: "checkGroup", _items: null, _selectedItems: null, _init: function () {
        if (!T.lang.isArray(this.options.items[0])) {
            this._items = [this.options.items]
        } else {
            this._items = this.options.items
        }
        this._selectedItems = T.object.clone(this.options.selectedItems);
        this._type = (this.options.limit == 1 ? "radio" : "checkbox")
    }, _renderHtml: function () {
        var a = [];
        T.array.each(this._items, function (d, c) {
            var b = [];
            if (d.length != 0) {
                if (c != 0) {
                    a.push(this.options.separatorTemplate)
                }
                T.array.each(d, function (g, f) {
                    if (this.options.tip) {
                        var e = T.encodeHTML(g.label) + T.format(this.options.tipTemplate, g.id)
                    } else {
                        e = g.label
                    }
                    b.push(T.format(this.options.template, this.getId(g.id), g.id, this._type, g.label, (T.array.contains(this._selectedItems, g.id) ? ' checked="checked"' : ""), this.getId(this.options.containerId), e, this.options.disabled ? " disabled" : ""))
                }, this);
                a.push(T.format(this.options.groupTemplate, b.join(""), this.options.label ? '<label class="label">' + this.options.label + "</label>" : ""))
            }
        }, this);
        return a.join("")
    }, _bind: function () {
        T.array.each(T.dom.query(":input", T.g(this.options.containerId)), function (a, b) {
            var c = this;
            this.on(a, "click", function (f) {
                if (c._type == "checkbox") {
                    var d = c._selectedItems;
                    if (this.checked) {
                        d.push(this.value)
                    } else {
                        if (d.length == 1) {
                            this.checked = true;
                            return false
                        }
                        T.array.remove(d, this.value)
                    }
                    if (d.length > c.options.limit) {
                        var e = T.array.removeAt(d, 0);
                        T.g(c.getId(e)).checked = false
                    }
                } else {
                    if (c._selectedItems && c._selectedItems.length == 1 && c._selectedItems[0] == this.value) {
                        return
                    }
                    c._selectedItems = [this.value]
                }
                var g = [];
                T.array.each(c._selectedItems, function (h) {
                    g.push(T.getAttr(c.getId(h), "title"))
                });
                c.options.onchange(c._selectedItems, g)
            })
        }, this)
    }, reset: function () {
        var a = T.g(this.options.containerId), c = this.getId(this.options.items[0].id), b = this;
        if (a) {
            T.array.each(T.dom.query("input", a), function (d) {
                var e = d.id;
                if (c == e) {
                    d.checked = true
                } else {
                    d.checked = false
                }
            })
        }
        this._selectedItems = T.object.clone(this.options.selectedItems);
        this.options.onchange(this._selectedItems, [])
    }, render: function () {
        var a = T.g(this.options.containerId);
        if (a) {
            T.dom.empty(a);
            T.insertHTML(a, "beforeEnd", this._renderHtml());
            this._bind()
        }
    }, click: function (b) {
        var a = T.g(this.getId(b));
        if (a) {
            a.click()
        }
    }, getSelectedLabels: function () {
        var b = [], a = this;
        T.array.each(this._selectedItems, function (c) {
            b.push(T.getAttr(a.getId(c), "title"))
        });
        return b
    }, getSelectedItems: function () {
        return this._selectedItems
    }
});
baidu.ui.Combobox = T.createUI({
    _type: "combobox",
    options: {
        containerId: null,
        items: null,
        selectedId: null,
        defaultText: "请选择",
        width: 200,
        onchange: function (a) {
        },
        comboboxTemplate: '<a class="combobox" href="javascript:void(0)" id="#{1}" layer="##{2}"><span title="!{0}" class="text">!{0,20}</span><span class="arrow"></span></a>',
        itemTemplate: '<li><a title="!{0}" href="javascript:void(0)" data="#{1}" class="#{2}">!{0}</a></li>',
        wrapperTemplate: '<ul class="options layer" style="display:none;position:absolute;width:#{2}px" id="#{1}">#{0}</ul>'
    },
    _init: function () {
        this._selectedId = this.options.selectedId;
        this._items = this.options.items;
        this._defaultText = this.options.defaultText
    },
    _selectedId: null,
    _items: null,
    _defaultText: null,
    _bindEvents: function () {
        var a = this;
        T.event.ons(T.dom.query("#" + this.getId("List") + ">li>a"), "click", function () {
            var d = T.dom.getAttr(this, "data");
            var b = T.array.find(a._items, function (e) {
                if (e.id == d) {
                    return true
                }
            });
            var c = T.dom.one(".text", a.getId());
            if (c) {
                c.innerHTML = T.format("!{0,20}", b.label);
                c.title = b.label
            }
            a._hide();
            a.options.onchange(d)
        });
        T.on(this.getId(), "click", function () {
            if (T.dom.hasClass(this, "combobox-disabled")) {
                return
            }
            var b = T.dom.one(".arrow", this);
            if (!T.dom.hasClass(b, "selected")) {
                a._show()
            }
        })
    },
    _show: function () {
        var a = T.getCornerPosition(this.getId(), "bl");
        T.dom.setPosition(this.getId("List"), a)
    },
    _hide: function () {
        var a = T.dom.one(".arrow", this.getId());
        if (T.dom.hasClass(a, "selected")) {
            T.dom.removeClass(a, "selected")
        }
        T.hide(this.getId("List"))
    },
    _render: function () {
        var d = this._defaultText;
        if (this._items && this._items.length > 0) {
            d = this._items[0].label;
            if (this._selectedId) {
                for (var a in this._items) {
                    var b = this._items[a];
                    if (b.id == this._selectedId) {
                        d = b.label;
                        break
                    }
                }
            }
        }
        T.dom.insertHTML(this.options.containerId, "beforeend", T.format(this.options.comboboxTemplate, d, this.getId(), this.getId("List")));
        if (this._items && this._items.length > 0) {
            T.dom.removeClass(this.getId(), "combobox-disabled");
            var c = [];
            for (var a = 0; a < this._items.length; a++) {
                var b = this._items[a];
                c.push(T.format(this.options.itemTemplate, b.label, b.id, b.disabled ? "disabled" : ""))
            }
            T.dom.insertHTML(document.body, "beforeend", T.format(this.options.wrapperTemplate, c.join(""), this.getId("List"), this.options.width))
        } else {
            T.dom.addClass(this.getId(), "combobox-disabled")
        }
    },
    setDefaultText: function (a) {
        this._defaultText = a
    },
    render: function (b, a) {
        if (!T.g(this.options.containerId)) {
            return
        }
        if (b || b === null) {
            this._items = b
        }
        if (a || a === null) {
            this._selectedId = a
        }
        T.dom.empty(this.options.containerId);
        if (T.g(this.getId("List"))) {
            T.dom.remove(this.getId("List"))
        }
        this._render();
        this._bindEvents()
    }
});
T.dom.ready(function () {
    T.lang.Class.create(T.ToggleTarget, {
        memo: T.config.memo, onchange: function (c) {
            EventRouter.dispatch("onchangeToggleTarget", c)
        }
    });
    T.lang.Class.create(T.TrackTarget, {
        onchange: function (c) {
            EventRouter.dispatch("onchangeTrackTarget", c)
        }
    });
    T.lang.Class.create(T.RecordTarget, {
        onchange: function (c) {
            EventRouter.dispatch("onchangeRecordTarget", c)
        }
    });
    T.dom.attachDropList();
    T.event.ons(T.dom.query("ul.nav a.open,ul.nav a.close"), "click", function (c) {
        T.event.preventDefault(c);
        if (T.dom.hasClass(this, "close")) {
            T.show(T.dom.next(this))
        } else {
            T.hide(T.dom.next(this))
        }
        T.dom.toggleClass(this, "close");
        T.dom.toggleClass(this, "open")
    });
    if (T.g("MoreNav")) {
        T.on("MoreNav", "mouseover", function () {
            T.dom.addClass(this, "more-hover")
        });
        T.on("MoreNav", "mouseout", function () {
            T.dom.removeClass(this, "more-hover")
        })
    }
    if (T.config && T.config.siteInfo && T.config.siteList && T.config.userInfo && T.g("SiteListContainer")) {
        var b = new T.ui.SiteSelector({
            siteList: T.config.siteList,
            defaultSiteId: T.config.userInfo.defaultSiteId,
            siteId: T.config.siteInfo.id,
            containerId: "SiteListContainer"
        });
        b.render()
    }
    T.fn.bgIframe(T.dom.q("bg-iframe"));
    if (T.g("BackToTop")) {
        var a = function () {
            if ((document.documentElement.scrollTop || document.body.scrollTop) > 0) {
                T.show("BackToTop")
            } else {
                T.hide("BackToTop")
            }
        };
        T.on(window, "scroll", function () {
            a()
        });
        T.on(window, "resize", function () {
            a()
        })
    }
    T.inlineTip("Help");
    setTimeout(function () {
        (new Image()).src = T.config.systemConfig.baseUri + "/stat/index"
    }, 30 * 60 * 1000)
});
baidu.ui.FuzzyQuery = T.createUI({
    _type: "fuzzy_query",
    options: {
        formId: "QueryForm",
        submitId: "QueryByWord",
        cancelId: "CancelQueryByWord",
        inputs: {SearchWord: null},
        onchange: function (a) {
        }
    },
    _init: function () {
    },
    _bindEvents: function () {
        var b = this;
        T.on(this.options.formId, "submit", function (d) {
            T.event.preventDefault(d);
            var f = true;
            for (var c in b.options.inputs) {
                var e = T.trim(T.G(c).value);
                if (T.G(c).defaultValue == e || e == "") {
                    b.options.inputs[c] = null
                } else {
                    b.options.inputs[c] = e;
                    f = false
                }
            }
            if (f) {
                T.hide(b.options.cancelId)
            } else {
                T.show(b.options.cancelId)
            }
            b.options.onchange(b.options.inputs)
        });
        T.on(this.options.cancelId, "click", function () {
            T.hide(this);
            for (var c in b.options.inputs) {
                T.G(c).value = T.G(c).defaultValue;
                T.dom.addClass(c, "gray");
                b.options.inputs[c] = null
            }
            b.options.onchange(b.options.inputs)
        });
        for (var a in b.options.inputs) {
            T.inlineTip(a)
        }
    },
    render: function () {
        T.insertHTML(this.options.submitId, "afterEnd", T.format('&nbsp;&nbsp;<a id="#{0}" style="display:none;" href="javascript:void(0);">返回</a>', this.options.cancelId));
        this._bindEvents()
    }
});
T.GetStartedGuide = T.Class({
    _type: "get-started-guide", initialize: function (a) {
        T.Util.extend(this, a);
        this._initDialog();
        this._initSlider()
    }, _initDialog: function () {
        this._dialog = new T.ui.Dialog({
            titleText: "新手入门",
            content: AceTemplate.format("GetStartedGuideTemplate"),
            isModal: true,
            className: this._type + "-dialog",
            width: 520,
            height: 539
        });
        this._dialog.show();
        var a = this;
        this._dialog.addEventListener("onclose", function () {
            var b = {elementId: "IsShowGetStartedGuide", type: a._type, status: 0};
            T.sio.log(T.config.systemConfig.memoUri + "?" + T.param(b))
        })
    }, _initSlider: function () {
        this._slider = T.ui.create(T.ui.Slide, {
            containerId: "GetStartedGuideSlidesContainer",
            sliderId: "GetStartedGuideSlider",
            width: 520,
            height: 416,
            isSlide: false,
            autoRender: true,
            onStart: T.fn.bind(this._onSliderStart, this),
            items: this.images
        });
        var a = this;
        this._sliderPrevious = T.dom.one(".home-guide-previous");
        this._sliderNext = T.dom.one(".home-guide-next");
        this._sliderStart = T.dom.one(".home-guide-start");
        T.event.on(this._sliderPrevious, "click", function (c, b) {
            a._slider.previous()
        });
        T.event.on(this._sliderNext, "click", function (c, b) {
            a._slider.next()
        })
    }, _onSliderStart: function (a) {
        if (a == this._slider.items.length - 1) {
            T.show(this._sliderPrevious);
            T.show(this._sliderStart);
            T.hide(this._sliderNext)
        } else {
            if (a == 0) {
                T.show(this._sliderNext);
                T.hide(this._sliderPrevious);
                T.hide(this._sliderStart)
            }
        }
    }, closeDialog: function () {
        if (this._dialog) {
            this._dialog.close()
        }
    }
});
T.Guide = T.createClass({
    options: {
        template: '<div id="GuideTip" class="guide-tip" style="display:none"><div class="tip-arrow"></div><div class="close-tip open #{recordable}" memo="{id:\'GuideTipClose\',type:\'guide\',global:1}" layer="#GuideTip">X</div><div class="tip-content"><p>#{content}</p></div></div>',
        getNewFunctionList: {name: "getNewFunctionList", uri: "guide/getNewFunctionList"},
        newFunctionGuide: false,
        hasMarketAuth: false,
        onsuccess: function (a) {
        },
        onclose: function () {
        }
    }, _type: "guide", _init: function () {
        if (this.options.newFunctionGuide) {
            this.getNewFunctionList()
        }
        var a = T.config.memo;
        if (this.options.hasMarketAuth && (!a.hasOwnProperty("GuideTipClose") || a.GuideTipClose)) {
            this.showTip("您已经开通百度精算权限！")
        }
    }, showTip: function (d) {
        if (T.g("GuideTip")) {
            T.dom.remove("GuideTip")
        }
        T.insertHTML(document.body, "beforeEnd", T.format(this.options.template, {
            content: d,
            recordable: this.options.hasMarketAuth ? "recordable" : ""
        }));
        var b = T.g("GuideTip"), a = T.dom.one(".market-link");
        if (a) {
            T.show(b);
            var c = a.offsetWidth - b.offsetWidth;
            T.setRelatedPosition(b, a, "bl", {left: c, top: 7});
            T.setStyle(T.dom.one("#GuideTip .tip-arrow"), "left", b.offsetWidth - a.offsetWidth / 2)
        }
    }, getNewFunctionList: function () {
        this.ajax(this.options.getNewFunctionList)
    }, ongetNewFunctionListSuccess: function (a, b) {
        this.show(b)
    }, ajax: function (c, a) {
        var b = this;
        a = a || {};
        b.dispatchEvent("on" + c.name);
        T.extend(a, {method: c.uri});
        T.ajax.jsonPost(T.config.systemConfig.ajaxUri, a, function (e, d) {
            b.dispatchEvent("on" + c.name + "Success", e);
            b.options.onsuccess(e)
        }, function (d) {
        })
    }, closeHandler: function (b, a) {
        this.GuideSilder.stop();
        this.options.onclose()
    }, show: function (c, b) {
        this.GuideDialog = new T.ui.Dialog({
            titleText: "",
            content: AceTemplate.format("GuideTemplate", {items: c.items, type: "function"}),
            isModal: true,
            className: "guide-dialog",
            width: 739,
            height: 530
        });
        this.GuideDialog.show();
        this.GuideDialog.addEventListener("onclose", T.fn.bind(this.closeHandler, this));
        var a = c.items[0].images;
        this.GuideSilder = T.ui.create(T.ui.Slide, {
            containerId: "SlidesContainer",
            sliderId: "Slider",
            controlId: "SliderBtn",
            direction: "left",
            duration: 35,
            pause: 2000,
            width: 700,
            height: 430,
            auto: a.length > 1 ? true : false,
            autoRender: true,
            items: a
        });
        this.GuideSilder.run(0)
    }
});
baidu.ui.InputCombobox = T.createUI({
    _type: "input-combobox",
    options: {
        maxlength: 40,
        label: "",
        inlineTip: true,
        disabled: false,
        selectable: true,
        readonly: false,
        containerId: null,
        items: null,
        selectedId: null,
        defaultText: "请输入",
        width: 244,
        onchange: function (a) {
        },
        comboboxTemplate: '#{6}<span class="input-combobox" id="#{1}"><input maxlength="#{4}" id="#{2}" class="custom-text" title="!{0}" value="!{0,20}" #{3} #{5}/>#{7}</span>',
        selectTemplate: '<span layer="##{0}" class="arrow operation" id="#{1}"></span>',
        itemTemplate: '<li><a title="!{0}" href="javascript:void(0)" data="#{1}" class="#{2}">!{0}</a></li>',
        wrapperTemplate: '<div class="layer bg-iframe" style="display:none;" id="#{1}"><ul class="input-combobox-list options" style="position:relative;width:#{2}px">#{0}</ul>'
    },
    _init: function () {
        this._selectedId = this.options.selectedId;
        this._items = this.options.items;
        this._defaultText = this.options.defaultText;
        this._comboboxId = this.getId();
        this._inputId = this.getId("Input");
        this._listId = this.getId("List");
        this._arrowId = this.getId("Arrow")
    },
    _selectedId: null,
    _items: null,
    _defaultText: null,
    _bindEvents: function () {
        var b = this;
        T.event.ons(T.dom.query("#" + this._listId + ">ul>li>a"), "click", function () {
            var d = T.dom.getAttr(this, "data");
            var c = T.array.find(b._items, function (e) {
                if (e.id == d) {
                    return true
                }
            });
            b.setCustomText(c.label);
            b._hide();
            b.options.onchange(d, c.label)
        });
        var a = T.dom.one(".operation", this._comboboxId);
        if (a) {
            T.on(a, "click", function () {
                if (T.dom.hasClass(this, "combobox-disabled")) {
                    return
                }
                if (!T.dom.hasClass(a, "selected")) {
                    b._show()
                }
            })
        }
    },
    _show: function () {
        var a = T.getCornerPosition(this._comboboxId, "bl");
        T.dom.setPosition(this._listId, a)
    },
    _hide: function () {
        var a = T.dom.one(".operation", this._comboboxId);
        if (T.dom.hasClass(a, "selected")) {
            T.dom.removeClass(a, "selected")
        }
        T.hide(this._listId)
    },
    _render: function () {
        var f = this._defaultText;
        if (this._items && this._items.length > 0) {
            if (!f) {
                f = this._items[0].label
            }
            if (this._selectedId) {
                for (var b in this._items) {
                    var c = this._items[b];
                    if (c.id == this._selectedId) {
                        f = c.label;
                        break
                    }
                }
            }
        }
        var a = T.format(this.options.selectTemplate, this._listId, this._arrowId);
        var e = T.format(this.options.comboboxTemplate, f, this._comboboxId, this._inputId, this.options.disabled ? " disabled" : "", this.options.maxlength, this.options.readonly ? "readonly" : "", this.options.label ? '<label class="lbl">' + this.options.label + "</label>" : "", this.options.selectable ? a : "");
        T.dom.insertHTML(this.options.containerId, "beforeend", e);
        if (this._items) {
            T.dom.removeClass(this._comboboxId, "combobox-disabled");
            var d = [];
            for (var b = 0; b < this._items.length; b++) {
                var c = this._items[b];
                d.push(T.format(this.options.itemTemplate, c.label, c.id, c.disabled ? "disabled" : ""))
            }
            T.dom.insertHTML(document.body, "beforeend", T.format(this.options.wrapperTemplate, d.join(""), this._listId, this.options.width))
        } else {
            T.dom.addClass(this._comboboxId, "combobox-disabled")
        }
    },
    setCustomText: function (b) {
        var a = T.g(this._inputId);
        this.clearInlineTip();
        if (a) {
            a.value = T.format("#{0}", b);
            a.title = b
        }
    },
    render: function (b, a) {
        if (!T.g(this.options.containerId)) {
            return
        }
        if (b || b === null) {
            this._items = b
        }
        if (a || a === null) {
            this._selectedId = a
        }
        T.dom.empty(this.options.containerId);
        if (T.g(this._listId)) {
            T.dom.remove(this._listId)
        }
        this._render();
        this._bindEvents();
        this.setInlineTip()
    },
    setInlineTip: function () {
        this.options.inlineTip && T.inlineTip(this._inputId)
    },
    clearInlineTip: function () {
        this.options.inlineTip && T.clearInlineTipInputValue(this._inputId)
    }
});
T.ui.Mask = T.createUI({
    options: {containerId: "GlobalModalLayer", zIndex: 99998}, _type: "mask", _init: function () {
    }, render: function () {
        var a = T.g(this.options.containerId);
        if (!a) {
            a = T.dom.create("div", {id: this.options.containerId, className: "mask-layer"});
            document.body.appendChild(a)
        }
        this._show();
        if (T.browser.ie && T.browser.ie < 7) {
            T.dom.addClass(document.body, "body-masked")
        }
        this.bind()
    }, bind: function () {
        var a = this;
        this.on(window, "resize", function (b) {
            a._show()
        })
    }, _show: function () {
        var b = T.g(this.options.containerId), a = this.options;
        T.dom.setStyles(b, {
            left: a.left || 0,
            top: a.top || 0,
            position: "absolute",
            width: a.width || T.page.getWidth(),
            height: a.height || T.page.getHeight(),
            "z-index": a.zIndex
        })
    }, show: function (a) {
        T.extend(this.options, a);
        this.render()
    }, _hide: function () {
        var a = T.g(this.options.containerId);
        T.setStyles(a, {left: -30, top: -30, position: "absolute", width: 1, height: 1, overflow: "hidden"})
    }, hide: function () {
        var a = T.g(this.options.containerId);
        if (a) {
            this._hide(a)
        }
        this.dispose();
        if (T.browser.ie && T.browser.ie < 7) {
            T.dom.removeClass(document.body, "body-masked")
        }
    }
});
T.RecordTarget = T.createClass({
    _type: "record-target",
    options: {
        sign: "recordable", recordUri: null, memo: null, onchange: function (a) {
        }
    },
    _memo: null,
    _init: function () {
        this.options.recordUri = this.options.recordUri || T.config.systemConfig.memoUri;
        this._memo = T.object.clone(this.options.memo || {});
        T.on(document.body, "mousedown", T.fn.bind(this.reordHandler, this))
    },
    reordHandler: function (a, e) {
        var g = T.event.getTarget(a);
        if (!(g[this.options.sign] || T.dom.hasClass(g, this.options.sign))) {
            return
        }
        var f = g.id || "", i = T.getAttr(g, "memo"), h, b;
        if (i) {
            memoObj = T.json.parse(i);
            if (memoObj.hasOwnProperty("id")) {
                f = memoObj.id
            }
            if (memoObj.hasOwnProperty("type")) {
                h = memoObj.type
            }
            if (memoObj.hasOwnProperty("global")) {
                b = memoObj.global
            }
        }
        var d = {elementId: f, type: h || ""};
        if (!b) {
            T.extend(d, {siteId: T.config.siteInfo.id, pageId: T.config.pageInfo.id})
        }
        var c;
        if (this._memo.hasOwnProperty(f)) {
            if (this._memo[f]) {
                c = 0
            } else {
                c = 1
            }
        } else {
            if (T.dom.hasClass(g, "close")) {
                c = 1
            } else {
                if (T.dom.hasClass(g, "open")) {
                    c = 0
                }
            }
        }
        this._memo[f] = c;
        d.status = c;
        this.options.onchange(d);
        this.postData(d)
    },
    postData: function (c) {
        var b = (new Date()).getTime();
        var a = window["bd_holmes" + b] = new Image();
        a.src = this.options.recordUri + "?r=" + b + "&" + T.url.jsonToQuery(c, function (e, d) {
            return encodeURIComponent(e)
        });
        a.onload = a.onerror = a.onabort = function () {
            a.onload = a.onerror = a.onabort = null;
            a = null
        }
    }
});
T.ui.SelectGroup = T.createUI({
    _type: "select_group",
    options: {
        containerId: null,
        label: "",
        items: [],
        selectedItems: [],
        separator: "",
        shortcuts: true,
        wrapperTemplate: '<span id="#{1}_container">#{0}<select id="#{1}" level="#{3}">#{2}</select></span>',
        optionTemplate: '<option title="!{3}" value="!{0}"#{2}>!{1}</option>',
        onchange: function (a) {
        }
    },
    _showLevel: 1,
    _values: null,
    _init: function () {
        this._values = []
    },
    _getData: function (e, g, b, f) {
        if (f > b) {
            return null
        }
        for (var c in e) {
            var d = e[c];
            if (b == f && d.id == g) {
                return d
            } else {
                var a = this._getData(d.children, g, b, f + 1);
                if (a != null) {
                    return a
                }
            }
        }
        return null
    },
    _select: function (e, d) {
        var b = this._getData(this.items, e, d, 1);
        if (b == null) {
            return
        }
        var c = d + 1;
        for (var a = c; a <= this._showLevel; a++) {
            T.dom.remove(this.getId() + "_" + a + "_container")
        }
        this._values.splice(d - 1, this._values.length - d + 1);
        this._values[d - 1] = e;
        if (b && b.children && b.children.length > 0) {
            this._showLevel = c;
            this._values[d] = b.children[0].id;
            this._render(b.children, d)
        } else {
            this._showLevel = d
        }
    },
    _getLabels: function (d) {
        var e = [];
        var a = this.items;
        for (var c = 0; c < d.length; c++) {
            if (a == null || a.length == 0) {
                break
            }
            for (var b in a) {
                if (d[c] == a[b].id) {
                    e.push(a[b].label);
                    a = a[b].children;
                    break
                }
            }
        }
        return e
    },
    _change: function (b, a) {
        this._select(b, a);
        if (this._values.length == 1 && this._values[0] == this.items[0].id) {
            this.options.onchange(T.object.clone(this._values), [])
        } else {
            this.options.onchange(T.object.clone(this._values), this._getLabels(this._values))
        }
    },
    _render: function (a, g) {
        if (a) {
            var e = "";
            for (var c in a) {
                var f = a[c];
                e += T.format(this.options.optionTemplate, f.id, f.label, f.id == this.options.selectedItems[g || 0] ? ' selected="selected"' : "", f.label)
            }
            var b = this.getId() + "_" + this._showLevel;
            if (T.g(this.getId("search_shotcuts_container"))) {
                T.insertHTML(this.getId("search_shotcuts_container"), "beforeBegin", T.format(this.options.wrapperTemplate, (this._showLevel == 1 && this.options.label ? '<label class="label">' + this.options.label + "</label>" : this.options.separator), b, e, this._showLevel))
            } else {
                T.insertHTML(this.options.containerId, "beforeEnd", T.format(this.options.wrapperTemplate, (this._showLevel == 1 && this.options.label ? '<label class="label">' + this.options.label + "</label>" : this.options.separator), b, e, this._showLevel))
            }
            var d = this;
            T.on(b, "change", function () {
                d._change(this.value, parseInt(T.getAttr(this, "level")))
            })
        }
    },
    _getShortcuts: function (a, d) {
        for (var b in a) {
            var c = a[b];
            if (c.shortcut) {
                if (d == null) {
                    c.allId = c.id
                } else {
                    c.allId = "" + d + "," + c.id
                }
                this._shortcuts.push(c)
            }
            if (c.children && c.children.length > 0) {
                if (d == null) {
                    this._getShortcuts(c.children, c.id)
                } else {
                    this._getShortcuts(c.children, "" + d + "," + c.id)
                }
            }
        }
    },
    _rendShortcuts: function () {
        this._getShortcuts(this.items);
        if (this._shortcuts.length == 0) {
            return
        }
        var b = "";
        for (var c in this._shortcuts) {
            var a = this._shortcuts[c];
            b += T.format('<a href="javascript:void(0)" id="#{0}" data="#{1}">#{2}</a>', this.getId("search_shotcuts_" + a.id), a.allId, a.label)
        }
        T.insertHTML(this.options.containerId, "beforeEnd", T.format('<span id="#{0}" class="search-shotcuts-container">#{1}</span>', this.getId("search_shotcuts_container"), b));
        var d = this;
        for (var c in this._shortcuts) {
            var a = this._shortcuts[c];
            T.on(this.getId("search_shotcuts_" + a.id), "click", function () {
                d.options.onchange([T.getAttr(this, "data")], [this.innerHTML])
            })
        }
    },
    render: function (a) {
        if (!T.g(this.options.containerId)) {
            return
        }
        if (a) {
            this.items = a;
            T.dom.empty(this.options.containerId)
        }
        this._render(this.items);
        if (this.options.shortcuts) {
            this._shortcuts = [];
            this._rendShortcuts()
        }
        if (this.options.selectedItems) {
            for (var b = 0; b < this.options.selectedItems.length; b++) {
                var c = this.options.selectedItems[b];
                this._select(c, b + 1)
            }
        }
        this.options.selectedItems = []
    },
    disable: function () {
        for (var a = 1; a <= this._showLevel; a++) {
            T.g(this.getId() + "_" + a).disabled = true
        }
    },
    enable: function () {
        for (var a = 1; a <= this._showLevel; a++) {
            T.g(this.getId() + "_" + a).disabled = false
        }
    },
    select: function (a) {
        T.g(this.getId() + "_" + this._showLevel).value = a
    },
    getGroupId: function (a) {
        return this.getId() + "_" + a
    },
    reset: function () {
        this._select(this.items[0].id, 1);
        this.select(this.items[0].id);
        this.options.onchange([], [])
    },
    getSelectedLabels: function () {
        return this._getLabels(this._values)
    },
    getSelectedValues: function () {
        return this._values.join()
    }
});
T.ui.SendReport = T.createUI({
    _type: "send-report",
    options: {
        trigerId: null,
        reportTitle: null,
        reportId: null,
        siteId: null,
        reportTypes: ["html", "csv"],
        url: null,
        onchange: function (a) {
        },
        wrapperTemplate: '<div class="send-report-wrapper"><div class="send-report-title">#{title}</div><div class="send-report-items">文件类型：#{types}<div id="#{tipId}" class="send-report-tip">#{typeTip}</div>发送周期：#{durations}<br/>发送时间：#{times}<br/>邮箱地址：#{mail}</div><div id="#{sendTipId}" class="red" style="display: none;"></div><div class="send-report-buttons"><a class="button" id="#{sendReportId}" href="javascript:void(0)"><span>确定</span></a><a id="#{cancelId}" href="javascript:void(0)">取消</a></div></div>',
        typeTemplate: '<label for="#{0}" title="#{2}"><input type="radio" title="#{2}" data="#{4}" id="#{0}"#{3} name="send__report"/>#{1}</label>',
        types: [{id: "html", label: "HTML", title: "本格式图文并茂，支持数据量较少，体积小便于下载阅读。"}, {
            id: "csv",
            label: "CSV",
            title: "本格式不含图示，支持较大量数据，便于后期数据处理。"
        }],
        durationTemplate: '<label for="#{0}"><input type="radio" data="#{3}" id="#{0}"#{2} name="send__duration"/>#{1}</label>',
        durations: [{id: "day", label: "每天"}, {id: "week", label: "每周一"}, {id: "month", label: "每月一号"}],
        mailTemplate: '<input type="text" class="text send-report-mail" style="ime-mode:disabled" id="#{0}" ><div class="send-report-tip"> 多个邮箱请用分号隔开。</div>'
    },
    _downloadType: null,
    _renderHTML: function () {
        var d = [];
        for (var c in this.options.types) {
            var e = this.options.types[c];
            if (T.array.contains(this.options.reportTypes, e.id)) {
                d.push(T.format(this.options.typeTemplate, this.getId(e.id), e.label, e.title, c == 0 ? ' checked="checked"' : "", e.id))
            }
        }
        var b = [];
        for (var c in this.options.durations) {
            var f = this.options.durations[c];
            b.push(T.format(this.options.durationTemplate, this.getId(f.id), f.label, c == 0 ? ' checked="checked"' : "", f.id))
        }
        var h = [];
        var a = (new Date()).getHours();
        if (a > 8 && a < 22) {
            a = a + 1
        } else {
            a = 8
        }
        for (var c = 8; c <= 23; c++) {
            h.push(T.format('<option value="#{0}" #{1}>#{0}</option>', "" + (c < 10 ? "0" + c : c) + ":00", c == a ? ' selected="selected"' : ""))
        }
        var g = this.options.types[0].title;
        this._downloadType = this.options.reportTypes[0];
        this._duration = this.options.durations[0].id;
        return T.format(this.options.wrapperTemplate, {
            title: (this.options.reportTitle || "发送报告"),
            types: d.join(""),
            typeTip: g,
            durations: b.join(""),
            times: T.format('<select id="#{0}">#{1}</select>', this.getId("Time"), h.join("")),
            tipId: this.getId("Tip"),
            sendTipId: this.getId("SendTip"),
            mail: T.format(this.options.mailTemplate, this.getId("Mail")),
            sendReportId: this.getId("Send"),
            cancelId: this.getId("Cancel")
        })
    },
    _bindEvents: function () {
        var c = this;
        for (var b in this.options.reportTypes) {
            var a = this.options.reportTypes[b];
            T.on(this.getId(a), "click", function () {
                T.g(c.getId("Tip")).innerHTML = this.title;
                c._downloadType = T.dom.getAttr(this, "data")
            })
        }
        for (var b in this.options.durations) {
            var d = this.options.durations[b];
            T.on(this.getId(d.id), "click", function () {
                c._duration = T.dom.getAttr(this, "data")
            })
        }
        T.on(this.getId("Send"), "click", function () {
            if (T.dom.hasClass(this, "disabled")) {
                return
            }
            var j = T.g(c.getId("Mail"));
            var g = j.value.replace("；", ";");
            var f = g.split(";");
            var h = f.length;
            if (h > 20) {
                alert("最多可输入20个电子邮件地址！")
            }
            for (var e = 0; e < h; e++) {
                if (baidu.trim(f[e]) == "") {
                    alert("您输入的第" + (e + 1) + "个电子邮件地址为空，请重新填写！");
                    return false
                }
                if (!T.lang.isEmail(f[e])) {
                    alert("您输入的第" + (e + 1) + "个电子邮件地址有误，请重新填写！");
                    return false
                }
            }
            c.options.onchange({
                format: c._downloadType,
                duration: c._duration,
                time: T.g(c.getId("Time")).value,
                mails: T.trim(T.g(c.getId("Mail")).value)
            });
            T.dom.addClass(this, "disabled")
        });
        T.on(this.getId("Cancel"), "click", function () {
            c.dialog.close()
        })
    },
    _renderDialog: function () {
        this.dialog = new T.ui.Dialog({
            id: this.getId("Dialog"),
            titleText: "发送报告",
            content: this._renderHTML(),
            isModal: true,
            isSingle: true,
            width: 400
        });
        this._bindEvents()
    },
    render: function () {
        if (T.g(this.options.trigerId) == null) {
            return
        }
        var a = this;
        T.on(this.options.trigerId, "click", function () {
            if (!a.dialog) {
                a._renderDialog()
            }
            T.hide(a.getId("SendTip"));
            T.dom.removeClass(a.getId("Send"), "disabled");
            a.dialog.show()
        })
    },
    send: function (b) {
        var c = {
            method: this.options.method,
            reportId: this.options.reportId,
            format: this._downloadType,
            duration: this._duration,
            time: T.g(this.getId("Time")).value,
            mails: T.trim(T.g(this.getId("Mail")).value),
            siteId: this.options.siteId,
            params: T.param(b)
        };
        var a = this;
        T.ajax.jsonPost(this.options.url, c, function (d) {
            T.show(a.getId("SendTip"));
            T.g(a.getId("SendTip")).innerHTML = d;
            T.dom.removeClass(a.getId("Send"), "disabled")
        }, function (d) {
            alert(d || "发送数据失败请稍后重试！");
            T.dom.removeClass(a.getId("Send"), "disabled")
        })
    }
});
T.ui.SiteSelector = T.createUI({
    _type: "siteselector",
    options: {
        containerId: "SiteListContainer",
        siteListId: "SiteList",
        siteList: null,
        siteId: null,
        defaultSiteId: "",
        subdirHoverClass: "sub-dir-hover",
        subdirTemplate: '<ul class="site-selector-subdir" style="display: none" id="#{1}">#{0}</ul>',
        subdirLiTemplate: '<li><a class="dir" href="#{0}" title="!{6}">!{1}#{5}</a></li>',
        subdirWithAuth: '<span class="auth">(权限子目录)</span>',
        settings: {
            isDefault: {title: "取消默认网站", className: "is-default"},
            isNotDefault: {title: "设为默认网站", className: "is-not-default"}
        }
    },
    _container: null,
    _init: function () {
        this._container = T.g(this.options.containerId);
        this._initSubDirs.call(this)
    },
    _initSubDirs: function () {
        for (var c = 0; c < this.options.siteList.length; c++) {
            var m = this.options.siteList[c], f = [];
            if (m.children) {
                for (var d in m.children) {
                    var h = "javascript:window.location = window.location.href.replace(/siteId=(\\d*)/,'siteId=" + m.children[d].id + "')", b = m.children[d].name, a = m.children[d].id, g = m.children[d].id == this.options.defaultSiteId ? this.options.settings.isDefault.className : this.options.settings.isNotDefault.className, k = m.children[d].id == this.options.defaultSiteId ? this.options.settings.isDefault.title : this.options.settings.isNotDefault.title, l = m.children[d].isAuth ? this.options.subdirWithAuth : "", e = m.children[d].isAuth ? b + "(权限网站)" : b;
                    f.push(T.format(this.options.subdirLiTemplate, h, b, a, g, k, l, e))
                }
                if (f.length !== 0) {
                    f = T.format(this.options.subdirTemplate, f.join(""), m.id + "SubDir");
                    T.dom.insertHTML(this._container, "beforeEnd", f)
                }
            }
        }
        this._bindSubDirEvent.call(this)
    },
    _bindEvent: function () {
        T.event.ons(T.dom.query("li", T.g(this.options.siteListId)), "mouseover", T.fn.bind(this._toggleSubDir, this));
        T.event.ons(T.dom.query(".arrow, div.text", this._container), "click", T.fn.bind(this._toggleSiteList, this));
        T.event.on(document, "click", T.fn.bind(this._hideSiteList, this));
        T.event.on(this._container, "click", T.fn.bind(this._setDefault, this))
    },
    _bindSubDirEvent: function () {
        var a = T.dom.query(".site-selector-subdir>li");
        T.event.ons(a, "mouseover", function (c) {
            var d = T.event.getTarget(c), b = T.dom.getAncestorByClass(d, "site-selector-subdir");
            T.element(T.dom.query("li", b)).each(function (f) {
                T.dom.removeClass(f, "sub-dir-hover")
            });
            T.dom.addClass(this, "sub-dir-hover")
        });
        T.event.ons(a, "mouseout", function () {
            T.dom.removeClass(this, "sub-dir-hover")
        })
    },
    _toggleSubDir: function (f) {
        T.event.stopPropagation(f);
        var d = T.event.getTarget(f), a = d.tagName == "LI" ? d : T.dom.getAncestorByTag(d, "li"), b = T.dom.last(a), g = T.dom.getAttr(b, "data");
        T.dom.query("li", T.g(this.options.siteListId)) && T.element(T.dom.query("li", T.g(this.options.siteListId))).each(function (h) {
            T.dom.removeClass(this, "hover")
        });
        T.dom.addClass(a, "hover");
        T.dom.query(".site-selector-subdir") && T.element(T.dom.query(".site-selector-subdir")).each(function (h) {
            T.dom.hide(h)
        });
        if (T.g(g + "SubDir")) {
            var c = T.g(g + "SubDir");
            T.dom.addClass(T.dom.query("li", c)[0], this.options.subdirHoverClass);
            T.dom.show(c)
        }
    },
    _toggleSiteList: function (a) {
        T.dom.toggle(T.g(this.options.siteListId));
        T.dom.query(".site-selector-subdir") && T.element(T.dom.query(".site-selector-subdir")).each(function (b) {
            T.dom.hide(b)
        });
        T.dom.query("li", T.g(this.options.siteListId)) && T.element(T.dom.query("li", T.g(this.options.siteListId))).each(function (b) {
            T.dom.removeClass(this, "hover")
        })
    },
    _hideSiteList: function (c) {
        T.event.stopPropagation(c);
        var b = T.event.getTarget(c), a = T.dom.getAncestorByClass(b, "site-selector");
        if (!a) {
            T.dom.hide(T.g(this.options.siteListId));
            T.dom.query(".site-selector-subdir") && T.element(T.dom.query(".site-selector-subdir")).each(function (d) {
                T.dom.hide(d)
            })
        }
    },
    _setDefaultSiteForCurrentSite: function (d) {
        T.event.stopPropagation(d);
        var c = T.event.getTarget(d);
        if (T.dom.hasClass(c, "set-default")) {
            var a = T.dom.one(T.format("#SiteListContainer li>a.set-default[data=#{0}]", this.options.siteId));
            if (T.dom.hasClass(c, "is-default")) {
                T.dom.removeClass(c, "is-default");
                T.dom.addClass(c, "is-not-default");
                this.title = "设为默认网站";
                T.dom.removeClass(a, "is-default");
                T.dom.addClass(a, "is-not-default");
                a.title = "设为默认网站";
                T.ajax.jsonPost(T.config.systemConfig.ajaxUri, {method: "home/user/setDefaultSite", sId: 0})
            } else {
                var b = T.dom.one("#SiteListContainer li>a.is-default");
                if (b) {
                    T.dom.removeClass(b, "is-default");
                    T.dom.addClass(b, "is-not-default");
                    b.title = "设为默认网站"
                }
                T.dom.removeClass(c, "is-not-default");
                T.dom.addClass(c, "is-default");
                this.title = "取消默认网站";
                T.dom.removeClass(a, "is-not-default");
                T.dom.addClass(a, "is-default");
                a.title = "取消默认网站";
                T.ajax.jsonPost(T.config.systemConfig.ajaxUri, {
                    method: "home/user/setDefaultSite",
                    sId: this.options.siteId
                })
            }
        }
    },
    _setDefault: function (b) {
        T.event.stopPropagation(b);
        var a = T.event.getTarget(b);
        if (T.dom.hasClass(a, "set-default") && a.id != "SetCurrentDefaultSite") {
            if (T.dom.hasClass(a, "is-default")) {
                this._switchDefaultStatus.call(this, a, true)
            } else {
                this._switchDefaultStatus.call(this, a, false)
            }
        }
    },
    _switchDefaultStatus: function (c, d) {
        var e = T.dom.getAttr(c, "data"), a = T.g("SetCurrentDefaultSite");
        if (d) {
            T.dom.removeClass(c, "is-default");
            T.dom.addClass(c, "is-not-default");
            c.title = "设为默认网站";
            if (e == T.dom.getAttr(a, "data")) {
                T.dom.removeClass(a, "is-default");
                T.dom.addClass(a, "is-not-default");
                a.title = "设为默认网站"
            }
            T.ajax.jsonPost(T.config.systemConfig.ajaxUri, {method: "home/user/setDefaultSite", sId: 0})
        } else {
            var b = T.dom.one("#SiteListContainer li>a.is-default");
            if (b) {
                T.dom.removeClass(b, "is-default");
                T.dom.addClass(b, "is-not-default");
                b.title = "设为默认网站"
            }
            T.dom.removeClass(c, "is-not-default");
            T.dom.addClass(c, "is-default");
            c.title = "取消默认网站";
            if (e == T.dom.getAttr(a, "data")) {
                T.dom.removeClass(a, "is-not-default");
                T.dom.addClass(a, "is-default");
                a.title = "取消默认网站"
            } else {
                T.dom.removeClass(a, "is-default");
                T.dom.addClass(a, "is-not-default");
                a.title = "设为默认网站"
            }
            T.ajax.jsonPost(T.config.systemConfig.ajaxUri, {method: "home/user/setDefaultSite", sId: e})
        }
    },
    render: function () {
        this._bindEvent()
    }
});
T.ui.Slide = T.createUI({
    options: {
        containerId: "SlidesContainer",
        sliderId: "Slider",
        controlId: "SilderBtn",
        controlTemplate: "<ul>#{0}</ul>",
        sliderTemplate: '<table cellspacing="0" cellpadding="0" border="0" id="SliderTable"><tbody><tr>#{0}</tr></tbody></table>',
        items: null,
        count: null,
        width: 680,
        height: 355,
        direction: "left",
        isSlide: true,
        auto: false,
        change: 0,
        duration: 35,
        time: 10,
        pause: 2000,
        tween: null,
        onStart: function () {
        },
        onFinish: function () {
        }
    },
    _type: "slide",
    items: null,
    auto: null,
    _slider: null,
    _container: null,
    _sliderControl: null,
    _timer: null,
    _count: null,
    _target: null,
    _t: null,
    _b: null,
    _c: null,
    index: 0,
    _init: function () {
        this._slider = T.g(this.options.sliderId);
        this._container = T.g(this.options.containerId);
        this._sliderControl = T.g(this.options.controlId);
        this._sliderBtns = this._sliderControl && this._sliderControl.getElementsByTagName("li");
        this._timer = null;
        this._target = 0;
        this._t = this._b = this._c = 0;
        this.auto = this.options.auto;
        this.index = 0;
        this.options.tween = this.options.tween || function (f, e, h, g) {
            return -h * ((f = f / g - 1) * f * f * f - 1) + e
        };
        var a = T.dom.getStyle(this._container, "position");
        if (!(a == "relative" || a == "absolute")) {
            this._container.style.position = "relative"
        }
        this.items = T.object.clone(this.options.items);
        this.count = this.options.count || this.items.length;
        this._container.style.overflow = "hidden";
        this._slider.style.position = "absolute"
    },
    renderHtml: function () {
        if (this._slider) {
            var c = [];
            for (var d = 0, b = this.count; d < b; d++) {
                if (typeof this.items[d] === "object" && this.items[d]["imgUrl"] && this.items[d]["link"]) {
                    c.push(T.format("<td><a href='#{3}' target='_blank'><img width = '#{1}' height='#{2}' src='#{0}' /></a></td>", this.items[d]["imgUrl"], this.options.width, this.options.height, this.items[d]["link"]))
                } else {
                    c.push(T.format("<td><img width = '#{1}' height='#{2}' src='#{0}' /></td>", this.items[d], this.options.width, this.options.height))
                }
            }
            T.dom.empty(this._slider);
            T.dom.insertHTML(this._slider, "beforeEnd", T.format(this.options.sliderTemplate, c.join("")));
            var a = this.options.direction == "left" ? false : true;
            this._change = this.options.change ? this.options.change : this._slider[a ? "offsetHeight" : "offsetWidth"] / this.count
        }
        if (this._sliderControl) {
            T.dom.empty(this._sliderControl);
            if (this.count != 1) {
                var e = [];
                for (var d = 0, b = this.count; d < b; d++) {
                    e.push("<li></li>")
                }
                T.dom.insertHTML(this._sliderControl, "beforeEnd", T.format(this.options.controlTemplate, e.join("")))
            }
        }
    },
    render: function (a) {
        this.renderHtml();
        this.bind()
    },
    bind: function () {
        var b = this;
        if (this._sliderBtns) {
            T.array.each(this._sliderBtns, function (d, c) {
                T.on(d, "mouseover", function (f, e) {
                    d.className = "on";
                    b.auto = false;
                    b.run(c)
                });
                T.on(d, "mouseout", function (f, e) {
                    if (!b.options.isSlide) {
                        return
                    }
                    d.className = "";
                    b.auto = true;
                    b.run()
                })
            })
        }
        var a = this._slider.getElementsByTagName("img");
        T.array.each(a, function (d, c) {
            T.on(d, "mouseover", function (f, e) {
                b.auto = false
            });
            T.on(d, "mouseout", function (f, e) {
                if (!b.options.isSlide) {
                    return
                }
                b.auto = true;
                b.run()
            })
        })
    },
    run: function (a) {
        if (a == this.count) {
            if (this.options.direction == "left") {
                if (T.g("SliderTable")) {
                    var e = T.g("SliderTable").rows[0];
                    e.appendChild(e.children[0].cloneNode(true))
                }
            } else {
                var d = baidu.g("users_logos");
                if (d) {
                    for (var c = 0; c < 5; c++) {
                        var b = d.children[c].cloneNode(true);
                        d.appendChild(b)
                    }
                }
            }
        }
        if (a == undefined) {
            a = this.index
        } else {
            if (a < 0) {
                a = this.count - 1
            } else {
                if (a > this.count) {
                    a = 0
                }
            }
        }
        this.index = a;
        this._target = -Math.abs(this._change) * this.index;
        this._t = 0;
        this._b = parseInt(T.dom.getStyle(this._slider, this.options.direction));
        this._c = this._target - this._b;
        this.start();
        this.move()
    },
    start: function () {
        var a = this;
        if (this._sliderBtns) {
            T.array.each(this._sliderBtns, function (c, b) {
                c.className = a.index % a.count == b ? "on" : ""
            })
        }
        this.options.onStart.call(this, this.index)
    },
    move: function () {
        clearTimeout(this._timer);
        if (this._c && this._t < this.options.duration) {
            this.moveTo(Math.round(this.options.tween(this._t++, this._b, this._c, this.options.duration)));
            this._timer = setTimeout(T.fn.bind(this.move, this), this.options.time)
        } else {
            if (this.index == this.count) {
                this.moveTo(0);
                if (this.options.direction == "left") {
                    var d = T.g("SliderTable");
                    if (d) {
                        var c = d.rows[0];
                        if (c.length > this.count) {
                            c.removeChild(c.children[c.cells.length - 1])
                        }
                    }
                } else {
                    var b = T.g("users_logos");
                    if (b) {
                        for (var a = 0; a < 5; a++) {
                            var e = b.children[b.children.length - 1];
                            b.removeChild(e)
                        }
                    }
                }
            } else {
                this.moveTo(this._target)
            }
            if (this.auto) {
                this._timer = setTimeout(T.fn.bind(this.next, this), this.options.pause)
            }
        }
    },
    moveTo: function (a) {
        T.setStyle(this._slider, this.options.direction, a + "px")
    },
    next: function () {
        this.run(++this.index)
    },
    previous: function () {
        this.run(--this.index)
    },
    stop: function () {
        clearTimeout(this._timer);
        this.options.onFinish.call(this);
        this.moveTo(this._target)
    }
});
T.ui.Tabs = T.createUI({
    _type: "tabs",
    options: {
        containerId: null,
        tabsSelector: ">.tabs>ul>li:not(.separator)",
        toggleSelector: ">.tabs>.toggle",
        contentsSelector: ">.tab-contents>ul>li",
        contentContainerSelector: ">.tab-contents",
        tabContainerSelector: ">.tabs>ul",
        eventType: "click",
        selectedClass: "selected",
        selectedIndex: null,
        onchange: function (a, b) {
        }
    },
    _currentIndex: null,
    _tabs: null,
    _toggle: null,
    _contents: null,
    _tabContainer: null,
    _contentContainer: null,
    _init: function () {
        if (!T.g(this.options.containerId)) {
            return
        }
        var c = this;
        this._tabs = T.dom.query("#" + this.options.containerId + this.options.tabsSelector);
        this._contents = T.dom.query("#" + this.options.containerId + this.options.contentsSelector);
        var b = T.dom.query("#" + this.options.containerId + this.options.toggleSelector);
        if (b && b.length > 0) {
            this._toggle = b[0]
        }
        var d = T.dom.query("#" + this.options.containerId + this.options.contentContainerSelector);
        if (d && d.length > 0) {
            this._contentContainer = d[0]
        }
        var a = T.dom.query("#" + this.options.containerId + this.options.tabContainerSelector);
        if (a && a.length > 0) {
            this._tabContainer = a[0]
        }
        T.each(this._tabs, function (f, e) {
            T.on(T.dom.one("a", f), c.options.eventType, function (g) {
                c._change(e, this.parentNode)
            })
        });
        if (this._toggle) {
            T.on(this._toggle, "click", T.fn.bind(this._toggleFn, this))
        }
        if (this.options.selectedIndex != null) {
            this._change(this.options.selectedIndex, this._tabs[this.options.selectedIndex]);
            this._currentIndex = this.options.selectedIndex
        }
    },
    _change: function (a, b, c) {
        if (c !== false) {
            c = true
        }
        if (a == this._currentIndex) {
            this._toggleFn();
            return false
        } else {
            this._unselect(this._currentIndex);
            this._currentIndex = a;
            this.open()
        }
        this.options.onchange(a, b, c)
    },
    _unselect: function (a) {
        if (a == null) {
            return
        }
        var c = this._tabs[a];
        T.removeClass(c, this.options.selectedClass);
        var b = T.dom.next(c);
        if (b && T.dom.hasClass(b, "separator")) {
            T.dom.show(b)
        }
        var d = T.dom.prev(c);
        if (d && T.dom.hasClass(d, "separator")) {
            T.dom.show(d)
        }
        if (this._contents && this._contents.length > 0) {
            T.hide(this._contents[this._currentIndex])
        }
    },
    _select: function (a) {
        var c = this._tabs[a];
        T.addClass(this._tabContainer, this.options.selectedClass);
        T.addClass(c, this.options.selectedClass);
        var b = T.dom.next(c);
        if (b && T.dom.hasClass(b, "separator")) {
            T.dom.hide(b)
        }
        var d = T.dom.prev(c);
        if (d && T.dom.hasClass(d, "separator")) {
            T.dom.hide(d)
        }
        if (this._contents && this._contents.length > 0) {
            T.show(this._contents[a])
        }
    },
    open: function () {
        if (this._contentContainer && this._toggle) {
            this._toggle.innerHTML = "收起";
            T.dom.removeClass(this._toggle, "close");
            T.dom.addClass(this._toggle, "open");
            T.show(this._contentContainer)
        }
        if (this._currentIndex == null) {
            this._currentIndex = 0
        }
        if (this._tabs[this._currentIndex].style.display == "none") {
            for (var a in this._tabs) {
                if (a != this._currentIndex && this._tabs[a].style.display != "none") {
                    this._currentIndex = a;
                    break
                }
            }
        }
        this._select(this._currentIndex)
    },
    close: function () {
        if (this._contentContainer && this._toggle) {
            T.dom.removeClass(this._toggle, "open");
            this._toggle.innerHTML = "展开";
            T.dom.addClass(this._toggle, "close");
            T.hide(this._contentContainer)
        }
        T.removeClass(this._tabContainer, this.options.selectedClass);
        this._unselect(this._currentIndex)
    },
    _toggleFn: function () {
        if (this._toggle) {
            if (T.dom.hasClass(this._toggle, "open")) {
                this.close()
            } else {
                this.open()
            }
        }
        this.options.onchange(this._currentIndex, this._tabs[this._currentIndex], true)
    },
    select: function (a) {
        this._unselect(this._currentIndex);
        this._currentIndex = a;
        this.open();
        this.options.onchange(a, this._tabs[a], false)
    },
    reset: function () {
        T.removeClass(this._currentIndex, this.options.selectedClass);
        this._currentIndex = null
    },
    hide: function (a) {
        var c = this._tabs[a];
        T.dom.hide(c);
        if (a == 0) {
            var b = T.dom.next(c);
            if (b && T.dom.hasClass(b, "separator")) {
                T.addClass(b, "invisible-separator")
            }
        } else {
            var d = T.dom.prev(c);
            if (d && T.dom.hasClass(d, "separator")) {
                T.addClass(d, "invisible-separator")
            }
        }
        if (a == this._currentIndex || this._currentIndex == null) {
            this.close()
        }
    },
    show: function (a) {
        var c = this._tabs[a];
        T.dom.show(c);
        if (a == 0) {
            var b = T.dom.next(c);
            if (b && T.dom.hasClass(b, "separator")) {
                T.removeClass(b, "invisible-separator")
            }
        } else {
            var d = T.dom.prev(c);
            if (d && T.dom.hasClass(d, "separator")) {
                T.removeClass(d, "invisible-separator")
            }
        }
    },
    getCurrentContent: function () {
        return this._contents[this._currentIndex]
    }
});
T.ui.Tip = T.createUI({
    options: {target: document.body, tip: null, position: null}, _type: "tip", _init: function () {
        this.position = this.options.position || T.dom.getPosition(this.target);
        if (T.lang.isElement(this.target)) {
            var c = T.ui.Tip.targetsTips.length;
            if (c === 0) {
                T.ui.Tip.targetsTips.push(this)
            } else {
                var b = false;
                for (var a = 0; a < T.ui.Tip.targetsTips.length; a++) {
                    if (T.ui.Tip.targetsTips[a].target === this.target) {
                        T.ui.Tip.targetsTips[a] = this;
                        b = true;
                        break
                    } else {
                        b = false
                    }
                }
                if (!b) {
                    T.ui.Tip.targetsTips.push(this)
                }
            }
        }
    }, getTargetPosition: function () {
        return T.dom.getPosition(this.target)
    }, render: function () {
        if (this.getTargetPosition().left + 275 >= T.page.getViewWidth()) {
            T.dom.setPosition(this.tip, {
                left: T.page.getViewWidth() - 275,
                top: this.getTargetPosition().top + this.target.offsetHeight
            });
            var b = T.q("tip-arrow", this.tip)[0];
            var a = this.getTargetPosition().left + 275 - T.page.getViewWidth();
            T.dom.setStyle(b, "left", 12 + a)
        } else {
            var b = T.q("tip-arrow", this.tip)[0];
            T.dom.setPosition(this.tip, {
                left: this.getTargetPosition().left,
                top: this.getTargetPosition().top + this.target.offsetHeight
            });
            T.dom.setStyle(b, "left", 12)
        }
        document.body.appendChild(this.tip);
        T.fn.bgIframe(T.dom.q("tip-container"))
    }
});
T.ui.Tip.targetsTips = [];
T.ui.Tip.close = function () {
    T.element(".tip-container").each(function (a) {
        T.dom.remove(a)
    })
};
T.ui.Tip.bindEvent = function () {
    T.event.on(document, "click", function (h) {
        var h = h || window.event;
        var g = T.event.getTarget(h);
        var d = false;
        var f = T.ui.Tip.targetsTips;
        for (var c = 0; c < f.length; c++) {
            if (f[c].target === g) {
                T.ui.Tip.close();
                f[c].render();
                d = true || d
            } else {
                d = false || d
            }
        }
        if (!d && !hasParent(g, ".help") && !hasParent(g, ".tip-container")) {
            T.ui.Tip.close()
        }
    });
    var a, b;
    T.event.on(document, "mouseover", function (d) {
        var d = d || window.event;
        var c = T.event.getTarget(d);
        var f = c;
        if (T.q("tip-container").length > 0) {
            if (hasParent(f, ".help") || hasParent(f, ".tip-container")) {
                clearTimeout(a)
            } else {
                clearTimeout(a);
                a = setTimeout(function () {
                    T.ui.Tip.close()
                }, 500)
            }
        }
        if (hasParent(f, ".help")) {
            clearTimeout(b);
            b = setTimeout(function () {
                var g = false;
                var h = T.ui.Tip.targetsTips;
                for (var e = 0; e < h.length; e++) {
                    if (h[e].target === f) {
                        T.ui.Tip.close();
                        h[e].render();
                        g = true || g
                    } else {
                        g = false || g
                    }
                }
                if (!g) {
                    T.ui.Tip.close()
                }
            }, 500)
        } else {
            clearTimeout(b)
        }
    })
};
T.ui.Tip.loadTips = function () {
    T.ui.Tip.targetsTips = [];
    var f = T.q("help");
    for (var b = 0; b < f.length; b++) {
        var c = T.dom.hasAttr(f[b], "data");
        if (!c) {
            if (T.config.pageInfo.tip) {
                var d = T.dom.create("div", {style: "position: absolute;"});
                d.className = "tip-container";
                d.innerHTML = '<div style="zoom: 1;position: relative; left:-13px;" class="tip-div tip-theme report-theme"><div class="tip-arrow"></div><div class="tip-wrap"><div class="tip-head"><div class="tip-head-text">' + T.config.pageInfo.title + '</div><div class="tip-close" onclick="T.ui.Tip.close()">×</div></div><div class="tip-body"><table class="tip-table"><tbody class="tip-table-body"><tr class="tip-row"><th class="tip-title">含义：</th><th class="tip-content">' + T.config.pageInfo.tip.title + '</th></tr><tr class="tip-row"><th class="tip-title">作用：</th><th class="tip-content">' + T.config.pageInfo.tip.content + "</th></tr></tbody></table></div></div></div>";
                new T.ui.Tip({target: f[b], tip: d})
            }
        } else {
            if (T.config.indexInfo.indicators) {
                var g = T.dom.getAttr(f[b], "data");
                var e = T.config.indexInfo.indicators.concat(T.config.indexInfo.indexes);
                for (var a = 0; a < e.length; a++) {
                    if (e[a].tip) {
                        if (e[a].id === g) {
                            var d = T.dom.create("div", {style: "position: absolute;"});
                            d.className = "tip-container";
                            d.innerHTML = '<div style="zoom: 1;position: relative; left:-12px;" class="tip-div tip-theme indicator-theme"><div class="tip-arrow"></div><div class="tip-wrap">' + e[a].tip + "</div></div>";
                            new T.ui.Tip({target: f[b], tip: d})
                        }
                    }
                }
            }
        }
    }
};
function hasParent(d, e) {
    var c = arguments;
    if (typeof e === "string") {
        var b = T.dom.query(e);
        var a = false;
        T.element(e).each(function (f) {
            a = a || c.callee(d, f)
        });
        return a
    } else {
        if (d === e && d === document.body) {
            return true
        } else {
            do {
                if (d === e) {
                    return true
                } else {
                    if (d === document.body) {
                        return false
                    }
                }
            } while (d = d.parentNode)
        }
        return false
    }
}
T.ToggleTarget = T.createClass({
    _type: "toggle-target", options: {
        sign: "toggleable", onchange: function (a) {
        }, smoothExpandableElements: [".report-tip"], memo: null
    }, _memo: null, _init: function () {
        this._memo = T.object.clone(this.options.memo || {});
        this._initStatus();
        T.on(document.body, "click", T.fn.bind(this.toggleHandler, this))
    }, _initStatus: function () {
        T.each(T.dom.q("recordable"), function (e) {
            var c = e.id || "", b = T.getAttr(e, "memo");
            if (b) {
                memoObj = T.json.parse(b);
                if (memoObj.hasOwnProperty("id")) {
                    c = memoObj.id
                }
            }
            if (!this._memo.hasOwnProperty(c)) {
                return
            }
            var a;
            T.removeClass(e, "open");
            T.removeClass(e, "close");
            if (this._memo[c]) {
                a = true;
                T.addClass(e, "open")
            } else {
                a = false;
                T.addClass(e, "close")
            }
            var d = T.getAttr(e, "targets");
            if (d) {
                T.each(T.dom.query(d), function (f) {
                    if (a) {
                        T.removeClass(f, "toggleable-hidden")
                    } else {
                        T.addClass(f, "toggleable-hidden")
                    }
                });
                if (d.indexOf(".flash-text") != -1) {
                    if (a) {
                        T.addClass(T.dom.one(".flash-text"), "toggleable-hidden")
                    } else {
                        T.removeClass(T.dom.one(".flash-text"), "toggleable-hidden")
                    }
                }
            }
        }, this)
    }, toggleHandler: function (d, b) {
        var e = T.event.getTarget(d);
        if (!(e[this.options.sign] || T.dom.hasClass(e, this.options.sign))) {
            return
        }
        var a = T.getAttr(e, "targets");
        var c = this;
        T.each(T.dom.query(a), function (g, f) {
            T.dom.toggleClass(g, "toggleable-hidden")
        });
        T.dom.toggleClass(e, "open");
        T.dom.toggleClass(e, "close");
        this.options.onchange(e.id)
    }
});
T.TrackTarget = T.createClass({
    options: {
        sign: "trackable", onchange: function (a) {
        }, trackUri: null
    }, _type: "track-target", _init: function () {
        this.options.trackUrl = this.options.trackUri || T.config.systemConfig.trackUri;
        T.on(document.body, "mousedown", T.fn.bind(this.trackHandler, this))
    }, _getTrackTarget: function (a) {
        var b = T.event.getTarget(a);
        if (!(b[this.options.sign] || T.dom.hasClass(b, this.options.sign))) {
            b = T.dom.getAncestorByClass(b, this.options.sign)
        }
        return b
    }, trackHandler: function (e, d) {
        var g = this._getTrackTarget(e);
        if (!g) {
            return
        }
        var c = g.id || "", b = T.getAttr(g, "memo");
        if (b) {
            memoObj = T.json.parse(b);
            if (memoObj.hasOwnProperty("id")) {
                c = memoObj.id
            }
        }
        var f = {siteId: T.config.siteInfo.id, pageId: T.config.pageInfo.id, elementId: c};
        var a = T.getAttr(g, "href");
        if (a && !(/^javascript|#/.test(a))) {
            f.url = encodeURIComponent(a)
        }
        if (g.innerHTML && !(/^\s*</i.test(g.innerHTML)) && !(/>\s*$/i.test(g.innerHTML))) {
            f.value = T.i18n.string.trim(g.innerHTML)
        }
        this.options.onchange(f);
        this.postData(f)
    }, postData: function (c) {
        var b = (new Date()).getTime();
        var a = window["bd_holmes" + b] = new Image();
        a.src = this.options.trackUrl + "?r=" + b + "&" + T.url.jsonToQuery(c, function (e, d) {
            return encodeURIComponent(e)
        });
        a.onload = a.onerror = a.onabort = function () {
            a.onload = a.onerror = a.onabort = null;
            a = null
        }
    }
});
T.Trade = T.Class(T.Base, {
    methods: {save: {name: "save", uri: "home/site/modifyTrade"}}, initialize: function (a) {
        T.Base.prototype.initialize.apply(this, Array.prototype.slice.call(arguments))
    }, update: function (b, c) {
        this._tradeDialog = new T.ui.Dialog({
            width: 400,
            isModal: true,
            titleText: "修改行业类别",
            content: AceTemplate.format("TradeTemplate", {siteId: b})
        });
        this._tradeDialog.show();
        var a = this;
        this._tradeSelectGroup = new T.ui.SelectGroup({
            containerId: "Trade",
            autoRender: true,
            selectedItems: String(c).split(","),
            items: this.list,
            onchange: function (d) {
                var e = d.join();
                a._isValid(e)
            }
        })
    }, _isValid: function (a) {
        this.fire("onvalidate");
        return +a === 0 ? false : true
    }, save: function (b) {
        var d = this._tradeSelectGroup.getSelectedValues();
        var c = {tradeLabel: this._tradeSelectGroup.getSelectedLabels().join("-")};
        var a = {siteId: b, tradeId: d};
        if (this._isValid(d)) {
            this.ajax(this.methods.save, a, c)
        }
    }, onsaveSuccess: function (a, b) {
        this.close();
        this.fire("onsaveTradeSuccess", a, b)
    }, onsaveFailed: function (a) {
        alert(a)
    }, close: function () {
        if (this._tradeDialog) {
            this._tradeDialog.close()
        }
    }
});
T.Validator = T.createClass({
    options: {
        items: null, onvalidate: function (a, b, c) {
        }
    }, types: {
        required: {
            validate: function (a) {
                return a !== ""
            }, msg: "不能为空"
        }, email: {
            validate: function (a) {
                return T.lang.isEmail(a)
            }, msg: "请输入正确的邮箱格式"
        }, tel: {
            validate: function (a) {
                return /(^(\d{3,4}-)?\d{7,8}$)|(^1[0-9]{10}$)/i.test(a)
            }, msg: "请输入正确的联系电话"
        }, url: {
            validate: function (a) {
                return T.lang.isUrl(a)
            }, msg: "请输入正确的网站域名"
        }
    }, _items: null, _init: function () {
        if (!T.lang.isArray(this.options.items)) {
            this._items = [this.options.items]
        } else {
            this._items = this.options.items
        }
        T.event.ons(this._items, ["keyup", "blur"], T.fn.bind(function (b, a) {
            this.validateField(a)
        }, this))
    }, validateField: function (c) {
        var f = T.dom.getAttr(c, "class"), e = f ? f.split(/\s+/) : [];
        var h = T.trim(c.value), j = true;
        for (var d = 0, b = e.length; d < b; d++) {
            var g = e[d], a = this.types[g];
            if (!a) {
                continue
            }
            j = a.validate(h), msg = "";
            if (!j) {
                msg = a.msg;
                this.dispatchEvent("onvalidate", {element: c, validationType: g, msg: msg});
                return j
            }
            this.dispatchEvent("onvalidate", {element: c, validationType: g, msg: msg})
        }
        return j
    }, validate: function () {
        var c = this._items;
        for (var d = 0, b = c.length; d < b; d++) {
            var e = c[d];
            var a = this.validateField(e);
            if (!a) {
                return false
            }
        }
        return true
    }, onvalidate: function (a, b) {
        this.options.onvalidate(b.element, b.validationType, b.msg)
    }
});
T.Webpage = function (a) {
    T.extend(this, {
        components: [], on: function (c, b) {
            EventRouter.register(c, b)
        }, fire: function (b) {
            EventRouter.dispatch.apply(EventRouter, arguments)
        }, _init: function () {
            T.extend(this, this.options);
            EventRouter.setOwner(this);
            T.extend(this, T.config);
            this.fire("onbeforeInit");
            this.initComponents(this.components);
            this.fire("oninit")
        }, initComponents: function (f) {
            for (var d in f) {
                var c = f[d];
                var e = null;
                var b = null;
                var h = null;
                if (T.lang.isString(c)) {
                    e = c;
                    h = e
                } else {
                    e = c.type;
                    b = c.options;
                    if (c.id) {
                        h = c.id
                    } else {
                        h = e
                    }
                }
                var g = "_init" + e;
                if (g != "_init" && T.lang.isFunction(this[g])) {
                    this[g]({id: h, type: e, options: b})
                }
                this.fire("on" + h + "Initialized")
            }
        }, _getEventName: function (c, b) {
            return b ? b + c : "onchange" + c
        }, _initTip: function (b) {
            T.ui.Tip.bindEvent();
            T.ui.Tip.loadTips()
        }, _initPaging: function (c) {
            var b = this;
            this[c.id] = new T.ui.Paging(T.extend({
                containerId: "Paging", onchange: function (d) {
                    b.fire(b._getEventName(c.id), d)
                }
            }, c.options))
        }, _initFuzzyQuery: function (c) {
            var b = this;
            this[c.id] = new T.ui.FuzzyQuery(T.extend({
                onchange: function (d) {
                    b.fire(b._getEventName(c.id), d)
                }
            }, c.options));
            this[c.id].render()
        }, auth: function (b) {
            return this.userInfo.auths[b]
        }, role: function (b) {
            return this.userInfo.roles[b]
        }, ajax: function (e, b, d) {
            var c = this;
            b = b || {};
            b.reportId = this.pageInfo.id;
            T.extend(b, {method: e.uri, validateToken: this.pageInfo.validateToken || ""});
            c.fire("on" + e.name);
            T.ajax.jsonPost(this.systemConfig.ajaxUri, b, function (g, f) {
                if (T.lang.isString(e.adapter) && T.lang.isFunction(c.DataAdapter[e.adapter])) {
                    c.fire("on" + e.adapter, g);
                    g = c.DataAdapter[e.adapter](g);
                    c.fire("after" + e.adapter, g)
                }
                c.fire("on" + e.name + "Success", g, {status: f, postData: b, extData: d})
            }, function (f) {
                c.fire("on" + e.name + "Failed", f)
            })
        }
    });
    T.extend(this, a);
    this._init()
};