/**
 * Created by XiaoWei on 2015/6/19.
 */
var LANG = {
    CHECKING: "系统正在检查URL的有效性和可访问性，请稍后......",
    NONE: "内容为空，请重新输入！",
    MODIFY_ING: "您进行了修改，点击保存后修改才能生效。",
    ERROR: "代码检测过程发生异常，请稍后重试！",
    NODOMAIN: "您输入的预览URL格式错误，请输入正确的URL！",
    ERRORMOBURL: "您输入的事件作用页面或目录不正确，请输入正确的事件作用页面或目录！",
    SELECT: '直接点击需要跟踪的链接添加事件目标。<a href="javascript:EventController.hideOverlay()">关闭</a>',
    NODATA: '您提交的数据为空，请确认已选择事件目标.<a href="javascript:EventController.hideOverlay()">关闭</a>',
    LOADING: "正在打开您的网站建立通讯连接,可能需要几分钟,请耐心等待......",
    POSTING: "正在更新数据、请稍等！",
    DELETING: "正在删除数据、请稍等！",
    POST_ERROR: "数据更新过程中、发生异常。请稍后重试!",
    DELETE_ERROR: "数据删除过程中、发生异常。请稍后重试!",
    SUCCESS: "设置成功！",
    SUCCESS_AND_GO: "设置成功，3秒钟后将自动跳转到设置目标页......",
    DIFFPWD: "两次输入密码不一致，请重新输入。",
    PWDEMPTY: "密码不能为空，如希望不输入密码就公开，请选择不需要密码直接就可以查看。",
    DELETE: "您确认要删除吗？",
    CHECK: '正在打开您的网站检查事件目标的有效性,可能需要几分钟,请耐心等待... <br>如果页面无法打开，请点击<a href="javascript:EventController.hideOverlayPanel()">这里</a>跳转。',
    UPDATE_STATUS: "正在更新状态... ",
    DOUBLE_POST: "设置未变更，请不要重复提交!",
    PROTOCOL: "当前只支持http协议，请重新输入！",
    NO_FLASH: '使用此功能浏览器必须有Adobe Flash Player插件支持，请您点击<a href="http://get.adobe.com/flashplayer/" target="_blank">这里</a>下载安装。',
    VALIDATE: "开始验证......",
    NO_CONNECT: '无法打开页面，请检查页面代码安装情况！<a href="javascript:EventController.hideOverlayPanel()">关闭</a>',
    CLOSE: '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:EventController.hideOverlay()">关闭</a>',
    NO_EVT_TARGET: function (a) {
        return '当前页面无法找到事件目标:"' + a + '"请检查页面代码。'
    },
    BEFORE_UNLOAD: "以上操作还未保存，保存后才能生效，您确认要退出吗？",
    PREVIEW_URL_T: function (a) {
        return "事件目标预览URL:　" + a
    }
};
(function () {
    var a = {};
    getUniqueId = function (c) {
        var d = c || 8;
        var e = "";
        while (d--) {
            e += b()
        }
        if (!a[e]) {
            a[e] = 1;
            return e
        } else {
            return getUniqueId(d)
        }
    };
    var b = function () {
        var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var c = d.length;
        return d.charAt(Math.floor(Math.random() * c))
    }
})();
function stopDefault(a) {
    if (a && a.preventDefault) {
        a.preventDefault()
    } else {
        window.event.returnValue = false
    }
    return false
}
function stopBubble(a) {
    var a = a || window.event;
    if (a.stopPropagation) {
        a.stopPropagation()
    } else {
        window.event.cancelBubble = true
    }
}
function FlashProxy(a) {
    this.name = a.name;
    this.instanceName;
    this.loadedCallBack = a.loadedCallBack || null;
    this.flashFunction = a.flashFunction || null;
    this.loaded = false;
    this.init()
}
FlashProxy.prototype = {
    init: function () {
        if (!this.flashFunction) {
            return false
        }
        var b = this;
        var a = this.flashFunction;
        var d = baidu.swf.getMovie(b.name);
        var c = setInterval(function () {
            try {
                if (d[a]) {
                    clearInterval(c);
                    b.loaded = true;
                    b.loadedCallBack && b.loadedCallBack()
                }
            } catch (f) {
            }
        }, 100)
    }, call: function () {
        try {
            var d = baidu.swf.getMovie(this.name);
            var a = Array.prototype.slice.call(arguments);
            var b = a.shift();
            d[b].apply(d, a)
        } catch (c) {
        }
    }
};
function insertAfter(c, a) {
    var b = a.parentNode;
    if (b.lastChild == a) {
        b.appendChild(c)
    } else {
        b.insertBefore(c, a.nextSibling)
    }
}
function isIllegal(a) {
    return (a.search(/[!@$^*()<>]/) == -1) ? false : true
}
function isDomain(b) {
    if (isIllegal(b)) {
        return false
    }
    var a = /^((http|https):\/\/)?(([\w-]+\.)+[a-z]{2,6}|((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))(\/\S*)?$/i;
    return a.test(b)
}
function isStrictDomain(a) {
    if (isIllegal(a)) {
        return false
    }
    if (a.search(/[\/]/) != -1) {
        return false
    }
    return isDomain(a)
}
function istrans(b) {
    if (isIllegal(b)) {
        return false
    }
    var a = /^(http:\/\/|https:\/\/).+|^\//i;
    return a.test(b)
}
function isPath(c, d) {
    if (isIllegalPath(d)) {
        return false
    }
    c.replace(/\/$/, "");
    var a = "";
    if (/^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)/.test(c)) {
        a = "^(http|https):\\/\\/" + c.replace(/\./g, "\\.") + "(\\/\\S*)?$"
    } else {
        a = "^(http|https):\\/\\/([\\w\\*-]+\\.)*" + c.replace(/\./g, "\\.") + "(\\/\\S*)?$"
    }
    var b = new RegExp(a, "i");
    return b.test(d)
}
function isEmail(b) {
    var a = /^\w+([-\.]\w+)*@\w+([-\.]\w+)*\.\w+([-\.]\w+)*$/i;
    return a.test(b)
}
function isEmpty(c, e, d) {
    var b = d ? T.dom.g(d) : T.dom.getParent(c);
    var a = ['<span class="erro-container url-erro">', '<span class="icon"></span>', '<span class="erro-msg">' + e + "</span>", '<span class="arrow arrow-border"></span>', '<span class="arrow arrow-background"></span>', "</span>"].join("");
    if (T.trim(c.value) === "") {
        if (!T.dom.query(".erro-container", b).length) {
            T.dom.insertHTML(b, "beforeEnd", a)
        } else {
            T.dom.show(T.dom.query(".erro-container", b)[0])
        }
        return true
    }
    if (T.dom.query(".erro-container", b).length) {
        T.dom.hide(T.dom.query(".erro-container", b)[0])
    }
    return false
}
baidu.addClassName = function (c, a) {
    var b = c.className.split(/\s+/);
    b.push(a);
    c.className = b.join(" ")
};
function formatDate(c, b) {
    if (typeof(c) != "string" && b.constructor != Date) {
        return null
    }
    function a(e, f) {
        f = f.length;
        e = e || 0;
        var g = String(Math.pow(10, f) + e);
        return f == 1 ? e : g.substr(g.length - f)
    }

    return c.replace(/([YMDhsmw])\1*/g, function (d) {
        switch (d.charAt()) {
            case"Y":
                return a(b.getFullYear(), d);
            case"M":
                return a(b.getMonth() + 1, d);
            case"D":
                return a(b.getDate(), d);
            case"w":
                return b.getDay();
            case"h":
                return a(b.getHours(), d);
            case"m":
                return a(b.getMinutes(), d);
            case"s":
                return a(b.getSeconds(), d)
        }
    })
}
function getDomain(a) {
    return a.match(/^(http|https):\/\/(.*?)($|\/)/i)[2]
}
function getFlash() {
    var k = navigator;
    if (navigator.plugins && navigator.mimeTypes.length) {
        var b = navigator.plugins["Shockwave Flash"];
        if (b && b.description) {
            return parseInt(b.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")) + ".0"
        }
    } else {
        if (window.ActiveXObject) {
            var g = 0;
            for (var d = 10; d >= 2; d--) {
                try {
                    var j = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + d);
                    if (j) {
                        g = d + ".0";
                        break
                    }
                } catch (h) {
                }
            }
            return parseInt(g) + ".0"
        }
    }
}
function clone(d) {
    var a = d, b;
    if (!d || d instanceof Number || d instanceof String || d instanceof Boolean) {
        return a
    } else {
        if (d instanceof Array) {
            a = [];
            var c = 0;
            for (b = 0, len = d.length; b < len; b++) {
                a[c++] = clone(d[b])
            }
        } else {
            if ("object" == typeof d) {
                a = {};
                for (b in d) {
                    if (d.hasOwnProperty(b)) {
                        a[b] = clone(d[b])
                    }
                }
            }
        }
    }
    return a
}
function Pager(a) {
    this.selected = {};
    this.handle = a.handle;
    this.container = a.container;
    this.items = a.items || [20, 50, 100];
    this.wrapClass = a.wrapClass || "pager-wrap";
    this.leftClass = a.leftClass || "pager-left";
    this.rightClass = a.rightClass || "pager-right";
    this.activeClass = a.activeClass || "pager-active";
    this.moreClass = a.moreClass || "pager-more"
}
Pager.prototype = {
    tpl: {
        wrap: '<div class="#{wrapClass}">#{wrapContent}</div>',
        leftclass: '<div class="#{leftClass}">每页显示：<select>#{option}</select></div>',
        option: '<option value="#{item}">#{item}条</option>',
        rightclass: '<div class="#{rightClass}">#{content}</div>',
        previous: '<a href="##{prevPage}"  title = "第#{prevPage}页" rel = "#{prevPage}"><上一页</a>',
        next: '<a href="##{next}"  title = "第#{next}页" rel = "#{next}">下一页></a>',
        other: '<span class="#{otherClass}">#{otherContent}</span>',
        pageLink: '<a href="##{page}"  title = "第#{page}页" rel = "#{page}">#{page}</a>'
    }, renderPage: function (a, h, c, f) {
        var b = baidu.G(this.container);
        f = parseFloat(f, 10) || 20;
        this.selected.items = f;
        this.selected.curCount = a;
        a = parseFloat(a, 10) || 1;
        h = parseFloat(h, 10) || 5;
        c = parseFloat(c, 10) || 0;
        var i = baidu.format, e = this.tpl, d = [];
        var g = this.getPageStartAndEnd(a, h, c);
        d.push(i(e.leftclass, {leftClass: this.leftClass, option: this.renderSelect(f)}));
        d.push(i(e.rightclass, {rightClass: this.rightClass, content: this.renderLink(a, g, c, h)}));
        if (f == c * f) {
            b.style.display = "none"
        } else {
            b.style.display = "block"
        }
        b.innerHTML = (i(e.wrap, {wrapClass: this.wrapClass, wrapContent: d.join("")}));
        this.regHandle()
    }, renderLink: function (a, j, d, k) {
        var l = baidu.format, h = this.tpl, g = [];
        if (a > 1) {
            g.push(l(h.previous, {prevPage: a - 1}))
        }
        var b = j.start;
        var e = j.end;
        if (a > Math.round(k / 2) && d > k) {
            g.push(l(h.pageLink, {page: 1}))
        }
        if (a > Math.round(k / 2) + 1 && d > k + 1) {
            g.push(l(h.other, {otherClass: this.moreClass, otherContent: "..."}))
        }
        for (var f = b, c = e; f <= c; f++) {
            if (f != a) {
                g.push(l(h.pageLink, {page: f}))
            } else {
                g.push(l(h.other, {otherClass: this.activeClass, otherContent: a}))
            }
        }
        if (d - a > Math.round(k / 2) && d > k + 1) {
            g.push(l(h.other, {otherClass: this.moreClass, otherContent: "..."}))
        }
        if (d - a > Math.round(k / 2) - 1 && d > k) {
            g.push(l(h.pageLink, {page: d}))
        }
        if (a < d) {
            g.push(l(h.next, {next: a + 1}))
        }
        return g.join("")
    }, renderSelect: function () {
        var c = [];
        var d = baidu.format;
        var a = this.tpl;
        for (var b = 0, e = this.items.length; b < e; b++) {
            c.push(d(a.option, {item: this.items[b]}))
        }
        return c.join("")
    }, getPageStartAndEnd: function (d, c, b) {
        var e = Math.max(1, d - Math.floor(c / 2));
        var a = Math.min(b, e + c - 1);
        e = Math.max(1, a - c + 1);
        return {start: e, end: a}
    }, regHandle: function () {
        var c = baidu.G(this.container);
        var b = c.getElementsByTagName("select")[0];
        for (var d = 0, e = b.options.length; d < e; d++) {
            if (b.options[d].value == this.selected.items) {
                b.options[d].selected = true;
                break
            }
        }
        if (c.style.display != "none") {
            b.onchange = this.doChange();
            var a = c.getElementsByTagName("a");
            for (var d = 0; d < a.length; d++) {
                a[d].onclick = this.doClick()
            }
        }
    }, doChange: function () {
        var a = this;
        return function () {
            a.selected.items = this.options[this.selectedIndex].value;
            a.selected.curCount = 1;
            a.handle.call(a, a.selected)
        }
    }, doClick: function () {
        var a = this;
        return function (b) {
            stopDefault(b);
            if (a.selected.curCount == this.rel) {
                return false
            }
            a.selected.curCount = this.rel;
            a.handle.call(a, a.selected)
        }
    }
};
var Mask = {
    show: function () {
        var a;
        var b = document.body.clientWidth;
        var d = Math.max(document.documentElement.clientHeight, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
        if (!Mask.uniqueId) {
            Mask.uniqueId = getUniqueId() + "Mark";
            a = document.createElement("DIV");
            a.id = Mask.uniqueId;
            a.className = "mask-layer";
            document.body.appendChild(a)
        } else {
            a = baidu.G(Mask.uniqueId)
        }
        if (baidu.setStyles) {
            baidu.setStyles(a, {
                left: 0,
                top: 0,
                position: "absolute",
                width: b + "px",
                height: d + "px",
                overflow: "auto"
            })
        } else {
            baidu.setStyle(a, {
                left: 0,
                top: 0,
                position: "absolute",
                width: b + "px",
                height: d + "px",
                overflow: "auto"
            })
        }
        if (baidu.ie == 6) {
            var c = document.body.className.split(/\s+/);
            c.push("body-masked");
            document.body.className = c.join(" ")
        }
    }, hide: function () {
        var b = baidu.G(Mask.uniqueId);
        if (!b) {
            return
        }
        if (baidu.setStyles) {
            baidu.setStyles(b, {
                left: "-30px",
                top: "-30px",
                position: "absolute",
                width: "1px",
                height: "1px",
                overflow: "hidden"
            })
        } else {
            baidu.setStyle(b, {
                left: "-30px",
                top: "-30px",
                position: "absolute",
                width: "1px",
                height: "1px",
                overflow: "hidden"
            })
        }
        if (baidu.ie == 6) {
            var c = document.body.className.split(/\s+/);
            var a = c.length;
            while (a--) {
                if (c[a] == "body-masked") {
                    c.splice(a, 1)
                }
            }
            document.body.className = c.join(" ")
        }
    }
};
var PARAMS = {site_id: T.config.siteInfo.id};
var VAR = {
    BASE_URL: T.config.systemConfig.baseUri,
    CHECK_REQUEST: T.config.systemConfig.baseUri + "/home/trans/event/check",
    SUBMIT_REQUEST: T.config.systemConfig.baseUri + "/home/trans/event/add",
    DELETE_REQUEST: T.config.systemConfig.baseUri + "/home/trans/event/delete",
    UPDATE_REQUEST: T.config.systemConfig.baseUri + "/home/trans/event/modify",
    RECEVER_URL: T.config.systemConfig.webRoot + "/flash/receiver.swf",
    SITE_ID: T.config.siteInfo.signature,
    FLAG: "add",
    LIST: [],
    SITE_URL: T.config.siteInfo.url
};
(function () {
    function b() {
        this.initialize.apply(this, arguments)
    }

    b.parseJSON = function (e, f) {
        var g = {};
        if (e.indexOf("?") == 0) {
            e = e.substr(1)
        }
        e = e.split("&");
        var d = {};
        for (var k = 0, h = e.length; k < h; k++) {
            if (e[k]) {
                var j = e[k].split("=");
                var n = j[0], m = j[1];
                m = typeof f == "function" ? f(m) : m;
                if (!d[n]) {
                    g[n] = [m];
                    d[n] = 1
                } else {
                    g[n].push(m)
                }
            }
        }
        return g
    };
    b.prototype = {
        get: function (d) {
            var e = this._param;
            return d ? (e[d] ? (e[d].length == 1 ? e[d][0] : e[d]) : null) : e
        }, set: function (f, e) {
            if (typeof f != "undefined") {
                var g = this._param;
                if (typeof e == "undefined") {
                    if (f instanceof b) {
                        if (f == this) {
                            return this
                        } else {
                            return this.set(f.getParameter())
                        }
                    } else {
                        if (typeof f != "object") {
                            f = b.parseJSON(f)
                        }
                        for (var d in f) {
                            this.set(d, f[d])
                        }
                    }
                } else {
                    if (typeof f == "string" && f != "") {
                        if (e === null) {
                            delete g[f]
                        } else {
                            g[f] = e && e instanceof Array ? e : [e]
                        }
                    }
                }
            }
            return this
        }, toString: function (h) {
            var l = this._param;
            var f = [];
            for (var g in l) {
                if (g.toString().length && l[g] != undefined && l[g] != null) {
                    var k = l[g];
                    if (typeof h == "function") {
                        for (var e = 0, d = k.length; e < d; e++) {
                            f.push("&", g, "=", h(k[e]))
                        }
                    } else {
                        f.push("&", g, "=", k.join("&" + g + "="))
                    }
                }
            }
            f.shift();
            return f.join("")
        }, initialize: function () {
            this._param = {};
            return this.set.apply(this, arguments)
        }
    };
    var a = window.baidu = window.baidu || {};
    var c = a.more = a.more || {};
    c.URLParameter = b
})();
var URLParam = new baidu.more.URLParameter();
var EventController = {
    ValidateTip: "ValidateTip",
    OverlayContent: "OverlayContent",
    OverlayPanel: "OptControlPanel",
    OverlayTooltip: "OverlayTooltip",
    OverlayIframe: "OverlayIframe",
    UrlInput: "UrlInput",
    SubmitBtn: "SubmitBtn",
    manualSubmitBtn: "manualSubmitBtn",
    UrlParamsFlag: "UrlParamsFlag",
    FlashContent: "FlashContent",
    EventReceiver: "EventReceiver",
    TextContent: "TextContent",
    OverlayOpacity: "OverlayOpacity",
    OverlayCancelBtn: "OverlayCancelBtn",
    OverlaySubmitBtn: "OverlaySubmitBtn",
    OverlayCloseBtn: "OverlayCloseBtn",
    OverlayTipContainer: "OverlayTipContainer",
    TimeOutDuration: 1000 * 60,
    Timer: null,
    eventParams: {
        domain: null,
        cla: "_hm" + getUniqueId(32),
        sd: null,
        jn: "select",
        sx: "js",
        clb: "_bd" + getUniqueId(32)
    },
    postData: VAR.LIST || [],
    deleteDb: [],
    init: function () {
        var b = new T.ui.Tabs({containerId: "ProductTabs", selectedIndex: 0});
        if (VAR.FLAG == "add") {
            baidu.G(EventController.SubmitBtn).onclick = EventController.submitHandle;
            T.g(EventController.manualSubmitBtn).onclick = EventController.manualSubmitHandle
        } else {
            var a = document.location.href;
            EventController.submitHandle()
        }
    },
    submitHandle: function () {
        var c = baidu.G;
        var d = c(EventController.UrlInput).value;
        var b = baidu.trim(c(EventController.UrlInput).value);
        if (/^\/(.)+/.test(b)) {
            b = VAR.SITE_URL + d
        }
        EventController.hideVaildateTip();
        var a = EventController.validateController(b);
        if (a) {
            EventController.url = a;
            baidu.G(EventController.SubmitBtn).blur();
            PARAMS.prev_url = b;
            VAR.PREVIEW_URL = b;
            EventController.checkCode()
        }
    },
    manualSubmitHandle: function () {
        var a = T.trim(T.dom.query('[name="id"]')[0].value);
        var g = T.trim(T.dom.query('[name="name"]')[0].value);
        var c = T.trim(T.dom.query('[name="monUrl"]')[0].value);
        var f = true;
        var e = T.dom.query('#manual-add-form input[type="text"]');
        for (var b = 0; b < e.length; b++) {
            var d = e[b];
            if (isEmpty(d, T.dom.getAttr(d, "emptyText"), T.dom.getAttr(d, "appendId"))) {
                f = false
            }
        }
        if (EventController.validateMonUrl(c)) {
            T.dom.hide(T.dom.g("manualValidateTip"))
        } else {
            T.dom.show(T.dom.g("manualValidateTip"));
            T.dom.g("manualValidateTip").innerHTML = LANG.ERRORMOBURL;
            f = false
        }
        if (f) {
            var h = {};
            h.id = a;
            h.name = g;
            h.monUrl = c;
            h.siteId = PARAMS.site_id;
            h.addType = 1;
            h.displayUrl = "";
            h.method = "home/trans/event/add";
            T.ajax.jsonPost(T.config.systemConfig.ajaxUri, h, function (j, i) {
                alert("提交成功！");
                window.location.href = T.config.systemConfig.baseUri + "/home/trans/event?siteId=" + T.config.siteInfo.id
            }, function (i) {
                T.dom.g("manualValidateTip").innerHTML = i;
                T.dom.show(T.dom.g("manualValidateTip"))
            })
        }
    },
    showVaildateTip: function (b, a) {
        var c = baidu.G(EventController.ValidateTip);
        c.style.display = "block";
        c.innerHTML = b;
        if (a) {
            c.className = a
        } else {
            c.className = ""
        }
    },
    hideVaildateTip: function () {
        var a = baidu.G(EventController.ValidateTip);
        a.style.display = "none";
        a.innerHTML = "";
        a.className = ""
    },
    validateController: function (b) {
        var c = baidu.G;
        var a = c(EventController.UrlInput);
        EventController.showVaildateTip(LANG.CHECKING);
        var g = parseInt(getFlash());
        if (g == 0) {
            EventController.showVaildateTip(LANG.NO_FLASH);
            a.focus();
            return false
        }
        if (isEmpty(T.dom.g("UrlInput"), "请输入目标预览URL", T.dom.q("submit-bar")[0])) {
            EventController.showVaildateTip("");
            a.focus();
            return false
        }
        var e = /^(https:\/\/)+/i;
        if (e.test(b)) {
            EventController.showVaildateTip(LANG.PROTOCOL);
            a.focus();
            return false
        }
        var d = /^(http:\/\/)+/i;
        b = d.test(b) ? b : "http://" + b;
        if (!T.lang.isUrl(b)) {
            EventController.showVaildateTip(LANG.NODOMAIN);
            a.focus();
            return false
        }
        return b
    },
    validateMonUrl: function (a) {
        var b = /^\*[\w#!:.?+=&%@!\-\/]*$/i;
        if (!T.trim(a) || b.test(a) || T.lang.isMonUrl(a)) {
            return true
        }
        return false
    },
    checkCode: function () {
        var a = VAR.CHECK_REQUEST + "?" + URLParam.initialize(PARAMS).toString(encodeURIComponent);
        EventController.showVaildateTip(LANG.CHECKING, "loading");
        T.ajax.jsonPost(T.config.systemConfig.ajaxUri, {
            method: "home/trans/event/check",
            displayUrl: PARAMS.prev_url,
            siteId: PARAMS.site_id
        }, function (c, b) {
            EventController.onCheckSuccess(c, b)
        }, function (b) {
            EventController.onCheckFail(b)
        })
    },
    onCheckSuccess: function (f, a) {
        var c = f;
        var e = baidu.G;
        var b = e(EventController.UrlInput);
        if (a == "0") {
            EventController.hideVaildateTip();
            EventController.eventParams.domain = getDomain(EventController.url);
            EventController.eventParams.sd = VAR.SITE_ID;
            VAR.LIST = c ? c : [];
            EventController.creatCurrentFlash();
            EventController.showOverlayPanel();
            var g = baidu.G(EventController.OverlayTipContainer);
            var d = LANG.PREVIEW_URL_T(PARAMS.prev_url);
            g.innerHTML = baidu.string.subByte(d, 150);
            g.title = d
        } else {
            if (a == "1") {
                if (c) {
                    EventController.showVaildateTip(c);
                    b.focus()
                }
            } else {
                EventController.onCheckFail()
            }
        }
    },
    onCheckFail: function (a) {
        EventController.showVaildateTip(a)
    },
    creatCurrentFlash: function () {
        var a = baidu.swf.getMovie(EventController.EventReceiver);
        if (!a) {
            EventController.eventParams.callBack = "EventController.receivedFromFlash";
            baidu.swf.create({
                id: EventController.EventReceiver,
                url: VAR.RECEVER_URL,
                width: "1",
                height: "1",
                errorMessage: "载入FLASH出错",
                ver: "9. 0.0",
                vars: EventController.eventParams,
                allowscriptaccess: "always"
            }, EventController.FlashContent);
            delete EventController.eventParams.callBack
        }
    },
    receivedFromFlash: function (d) {
        if (d.constructor == Object) {
            switch (d.type) {
                case"OK":
                    EventController.reBuildingWindow();
                    if (EventController.Timer) {
                        window.clearTimeout(EventController.Timer)
                    }
                    EventController.sendData({callBack: "OK", data: VAR});
                    break;
                case"SUCCESS":
                    EventController.showOverlay(LANG.SELECT);
                    break;
                case"NO":
                    var c = d.data;
                    var b = "";
                    for (var a = 0, e = c.length; a < e; a++) {
                        b += decodeURIComponent(c[a].name) + "(ID=" + c[a].id + "),"
                    }
                    EventController.showOverlay(LANG.NO_EVT_TARGET(b) + LANG.CLOSE);
                    break;
                case"ADD":
                    EventController.postData = d.data;
                    EventController.sumitData();
                    break;
                case"DELETE":
                    EventController.deleteDb = d.data;
                    EventController.deleteData();
                    break
            }
        }
    },
    reBuildingWindow: function () {
        window.open = function () {
        };
        window.openDialog = function () {
        };
        window.setHomePage = function () {
        }
    },
    sendData: function (b) {
        var a = baidu.swf.getMovie(EventController.EventReceiver);
        a.sendData(b)
    },
    showOverlayPanel: function () {
        var b = baidu.G;
        var a = b(EventController.OverlayPanel);
        var c = b(EventController.OverlayContent);
        Mask.show();
        EventController.url = EventController.url.split("#")[0] + "#" + URLParam.initialize(EventController.eventParams).toString(encodeURIComponent);
        c.innerHTML = EventController.getIframeHtml(EventController.OverlayIframe, EventController.url);
        EventController.Timer = window.setTimeout(function () {
            EventController.showOverlay(LANG.NO_CONNECT)
        }, EventController.TimeOutDuration);
        EventController.showOverlay(LANG.LOADING, true);
        EventController.fixPosition();
        EventController.bindEvent();
        baidu.on(window, "resize", EventController.fixPosition)
    },
    hideOverlayPanel: function () {
        var b = baidu.G;
        var a = b(EventController.OverlayPanel);
        a.style.display = "none";
        Mask.hide();
        baidu.un(window, "resize", EventController.fixPosition);
        EventController.gotoUrl()
    },
    gotoUrl: function () {
        window.location.href = VAR.BASE_URL + "/home/trans/event/index?siteId=" + PARAMS.site_id
    },
    bindEvent: function () {
        var b = baidu.G;
        var c = b(EventController.OverlayCloseBtn);
        baidu.on(c, "click", EventController.hideAll);
        var a = b(EventController.OverlaySubmitBtn);
        baidu.on(a, "click", EventController.hideAll)
    },
    hideAll: function () {
        var d = baidu.json.encode(VAR.LIST);
        var b = baidu.json.encode(EventController.postData);
        if (d != b && VAR.FLAG == "0") {
            var a = window.confirm(LANG.BEFORE_UNLOAD);
            if (!a) {
                return false
            }
        }
        EventController.hideOverlayPanel();
        EventController.hideOverlay()
    },
    sumitData: function () {
        var b = EventController.postData;
        EventController.showOverlay(LANG.POSTING, true);
        var d = (b.targetId) ? "home/trans/event/modify" : "home/trans/event/add";
        var c = {method: d, url: PARAMS.prev_url, siteId: PARAMS.site_id};
        var a = T.object.extend(c, b);
        T.ajax.jsonPost(T.config.systemConfig.ajaxUri, a, function (f, e) {
            EventController.onSubmitSuccess(f, e)
        }, function (e) {
            EventController.onSubmitFail(e)
        })
    },
    onSubmitSuccess: function (d, a) {
        var b = d;
        if (b) {
            if (a == "0") {
                var c = EventController.postData;
                EventController.sendData({callBack: "ADD_COMPLETE", data: c});
                EventController.hideOverlay()
            } else {
                if (a == "1") {
                    if (b) {
                        EventController.showOverlay(b + LANG.CLOSE)
                    }
                } else {
                    EventController.onSubmitFail()
                }
            }
        } else {
            EventController.onSubmitFail()
        }
    },
    onSubmitFail: function (a) {
        if (a) {
            EventController.showOverlay(a + LANG.CLOSE);
            return
        }
        EventController.showOverlay(LANG.POST_ERROR + LANG.CLOSE)
    },
    deleteData: function () {
        var c = EventController.deleteDb;
        var a = VAR.DELETE_REQUEST + "?" + baidu.url.jsonToQuery(PARAMS) + "&" + baidu.url.jsonToQuery(c);
        EventController.showOverlay(LANG.DELETING, true);
        var d = {method: "home/trans/event/delete", url: PARAMS.prev_url, siteId: PARAMS.site_id};
        var b = T.object.extend(d, c);
        T.ajax.jsonPost(T.config.systemConfig.ajaxUri, b, function (f, e) {
            EventController.onDeleteSuccess(f, e)
        }, function (e) {
            EventController.onDeleteFail()
        })
    },
    onDeleteSuccess: function (c, a) {
        var b = c;
        if (b) {
            if (a == "0") {
                EventController.sendData({callBack: "DELETE_COMPLETE", data: EventController.deleteDb});
                EventController.hideOverlay()
            } else {
                if (a == "1") {
                    if (b) {
                        EventController.showOverlay(b + LANG.CLOSE)
                    }
                } else {
                    EventController.onDeleteFail()
                }
            }
        } else {
            EventController.onDeleteFail()
        }
    },
    onDeleteFail: function () {
        EventController.showOverlay(LANG.DELETE_ERROR + LANG.CLOSE)
    },
    showOverlay: function (f, d) {
        var c = baidu.G;
        var b = c(EventController.OverlayTooltip);
        var e = c(EventController.TextContent);
        var a = c(EventController.OverlayOpacity);
        b.style.display = "block";
        a.style.display = "block";
        e.innerHTML = f;
        if (d) {
            e.className = "overlay-loading"
        } else {
            e.className = "overlay-inner"
        }
    },
    hideOverlay: function () {
        var c = baidu.G;
        var b = c(EventController.OverlayTooltip);
        var a = c(EventController.OverlayOpacity);
        b.style.display = "none";
        a.style.display = "none"
    },
    fixPosition: function () {
        var f = baidu.G;
        var a = f(EventController.OverlayPanel);
        var g = f(EventController.OverlayContent);
        var c = f(EventController.OverlayTooltip);
        var b = f(EventController.OverlayOpacity);
        var e = document.documentElement.clientHeight;
        a.style.height = e + "px";
        a.style.width = "984px";
        a.style.display = "block";
        var d = (e - 55);
        g.style.height = d + "px";
        c.style.height = d + "px";
        b.style.height = d + "px"
    },
    getIframeHtml: function (c, a) {
        var b = '<iframe id="' + c + '" name="' + c + '"  marginwidth="0" marginheight="0" width="100%" height="100%" frameborder="0" src="' + a + '"> </iframe>';
        return b
    }
};
baidu.on(window, "onload", EventController.init);