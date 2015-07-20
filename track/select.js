/**
 * Created by MrDeng on 2015/6/25.
 */
(function () {
    //提示消息 常量字符串定义
    var msgs = {
        title: "你好"
    }
    //标签数组
    var tips = [];

    var p = {
        flashUrl: "hy.best-ad.cn",
        urlPath: "config/select",
        protocol: "https:" == document.location.protocol ? "https:" : "http:",
        webroot: "http://tongji.baidu.com/hm-web",
        hyContent: "TrackerSenderContent",
        eventPanelStyle: "position:absolute; color:#000; text-align:left;  margin:0; z-index:2147483584; width:400px; padding:0 10px 5px 10px; background:#EAEFF4 url(/img/event_add_bg.gif) repeat-x; border:1px solid #6990B3; font-size:12px;",
        disablePanelStyle: "position:absolute; text-align:left; font-size:13px; color:#000; line-height:150%; text-align:left; z-index:2147483583; width:200px; padding:5px 10px; background:#EAEFF4; border:1px solid #6990B3; font-size:12px;",
        q: null,
        v:"1.0.1"
    };

    //无ID元素或者元素ID不正确情况 点击提示内容
    var errIdMsg = {
        defaultTargetName: "事件目标",
        disable: "该对象没有ID，无法监控，请修改网页源代码，为该对象添加ID.",
        Delete: "删除后，将不再跟踪统计该目标，该目标的历史数据会被删除且无法恢复。是否立即删除？",
        DUPLICATE_ID: function (G) {
            return "该网页中有该对象重复的ID，请修改网页源代码保证ID唯一。"
        },
        EDIT_DUPLICATE_ID: function (G, X) {
            return '"' + decodeURIComponent(G) + '"（id=' + X + ")的id在当前页面中不唯一，请调整页面代码保证该事件目标id唯一性。"
        },
        OBJECT: "无法监控。"
    };
    /////////////////////////////浏览器兼容处理
    var d = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);//Mozilla
    var H = /msie (\d+\.\d)/i.test(navigator.userAgent) ? parseFloat(RegExp["\x241"]) : 0;
    var e = /webkit/i.test(navigator.userAgent);
    var J = /opera\/(\d+\.\d)/i.test(navigator.userAgent) ? parseFloat(RegExp["\x241"]) : 0;
    var K = document.compatMode == "CSS1Compat";
    //////////////////////////////////////公共方法


    function ckeckDoc(doc) {
        if (doc && doc.preventDefault) {
            doc.preventDefault()
        } else {
            window.event.returnValue = false
        }
        return false
    }

    function forcedoc(doc) {//=n
        if ("string" == typeof doc || doc instanceof String) {
            return document.getElementById(doc)
        } else {
            if (doc && doc.nodeName && (doc.nodeType == 1 || doc.nodeType == 9)) {
                return doc
            }
        }
        return null
    }

    //添加鼠标事件
    function attachEvent(doc, ename, efunc) {
        doc = forcedoc(doc);
        ename = ename.replace(/^on/i, "").toLowerCase();
        if (doc.attachEvent) {
            doc.attachEvent("on" + ename, efunc)
        } else {
            if (doc.addEventListener) {
                doc.addEventListener(ename, efunc, false)
            }
        }
    }

    //设置风格
    function setPanleStyle(elem) {//elem=Y
        //var elem = attachEvent(elem);
        //var ac = (elem.nodeType == 9) ? elem : elem.ownerDocument || elem.document;
        //var ab = d > 0 && ac.getBoxObjectFor && N(elem, "position") == "absolute" && (elem.style.top === "" || elem.style.left === "");
        //var ad = {left: 0, top: 0};
        //var X = (H && !K) ? ac.body : ac.documentElement;
        //if (elem == X) {
        //    return ad
        //}
        //var Z = null;
        //var aa;
        //if (elem.getBoundingClientRect) {
        //    aa = elem.getBoundingClientRect();
        //    ad.left = Math.floor(aa.left) + Math.max(ac.documentElement.scrollLeft, ac.body.scrollLeft);
        //    ad.top = Math.floor(aa.top) + Math.max(ac.documentElement.scrollTop, ac.body.scrollTop);
        //    ad.left -= ac.documentElement.clientLeft;
        //    ad.top -= ac.documentElement.clientTop;
        //    if (H && !K) {
        //        ad.left -= 2;
        //        ad.top -= 2
        //    }
        //} else {
        //    if (ac.getBoxObjectFor && !ab) {
        //        aa = ac.getBoxObjectFor(elem);
        //        var G = ac.getBoxObjectFor(X);
        //        ad.left = aa.screenX - G.screenX;
        //        ad.top = aa.screenY - G.screenY
        //    } else {
        //        Z = elem;
        //        do {
        //            ad.left += Z.offsetLeft;
        //            ad.top += Z.offsetTop;
        //            if (e > 0 && N(Z, "position") == "fixed") {
        //                ad.left += ac.body.scrollLeft;
        //                ad.top += ac.body.scrollTop;
        //                break
        //            }
        //            Z = Z.offsetParent
        //        } while (Z && Z != elem);
        //        if (J > 0 || (browser.isWebkit > 0 && N(elem, "position") == "absolute")) {
        //            ad.top -= ac.body.offsetTop
        //        }
        //        Z = elem.offsetParent;
        //        while (Z && Z != ac.body) {
        //            ad.left -= Z.scrollLeft;
        //            if (!b.opera || Z.tagName != "TR") {
        //                ad.top -= Z.scrollTop
        //            }
        //            Z = Z.offsetParent
        //        }
        //    }
        //}
        //return ad
    }

    //随机名称生成
    var randName = function (length) {
        function randChar() {
            var ab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var aa = ab.length;
            return ab.charAt(Math.floor(Math.random() * aa))
        }
        var len = length || 8;
        var tempName = "";
        while (len--) {
            tempName += randChar()
        }
        if (randName.uniqueIdMap[tempName]) {
            return randName(len)
        } else {
            randName.uniqueIdMap[tempName] = 1;
            return tempName
        }
    };
    randName.uniqueIdMap = {};
    var D = "EventContainer" + randName(8);
    var m = "EventContainer" + randName(8);
    var h = "EventTarget" + randName(8);
    var s = "EventTarget" + randName(8);
    var Q = "EventSubmit" + randName(8);
    var cancelBtn = "EventCancel" + randName(8);
    var deleteBtn = "EventDelete" + randName(8);
    var S = "EventPanelTitle" + randName(8);
    var A = "EventPanelHelp" + randName(8);
    var y = "EventIdcontainer" + randName(8);

    function createElem() {
        var X = forcedoc(D);
        if (X) {
            X.style.zIndex = 2147483584;
            return X
        } else {
            var G = document.createElement("DIV");
            G.id = D;
            document.body.appendChild(G);
            return G
        }
    }

    //阻止浏览器 冒泡事件
    function stopBrowserBubble(G) {
        var G = G || window.event;
        if (G.stopPropagation) {
            G.stopPropagation()
        } else {
            window.event.cancelBubble = true
        }
    }

    function t(G) {
        this.list = [];
        this.nameSpace = "v";
        this.className = "vml" + this.getUniqueNum();
        this.strokeColor = G.color || "blue";
        this.strokeDashStyle = G.strokeDashStyle || "dash";
        this.StrokeWeight = G.StrokeWeight || "1";
        this.style = G.style || "";
        this.init()
    }

    t.prototype = {
        init: function () {
            if (!this.vml && document.all) {
                document.createStyleSheet().addRule("." + this.className, "behavior:url(#default#VML);display:inline-block;");
                if (!document.namespaces[this.nameSpace]) {
                    document.namespaces.add(this.nameSpace, "urn:schemas-microsoft-com:vml")
                }
                this.vml = true
            }
        }, getUniqueNum: function () {
            return Math.round(Math.random() * 2147483647)
        }, drawLine: function (ac, aa, ad, ab) {
            var Z = "vml" + this.getUniqueNum();
            var ae = '<v:stroke dashstyle = "' + this.strokeDashStyle + '"/></v:line>';
            var X = '<v:Line from="' + ac + "," + aa + '" to="' + ad + "," + ab + '" id="' + Z + '" strokeweight="' + this.StrokeWeight + '" strokecolor="' + this.strokeColor + '" class="' + this.className + '" style="' + this.style + '">';
            X += "</v:Line>";
            var G = document.createElement(ae);
            var Y = document.createElement(X);
            Y.appendChild(G);
            document.body.appendChild(Y);
            this.list.push(Y)
        }, drawRect: function (ag, ad, ah, X) {
            var aa = ag + ah;
            var Y = ad + X;
            var Z = this.list;
            var af = [ag, aa, aa, ag];
            var ac = [ad, ad, Y, Y];
            var ae = [aa, aa, ag, ag];
            var ab = [ad, Y, Y, ad];
            for (var G = 0; G < 4; G++) {
                if (Z[G]) {
                    this.setLinePos(Z[G], af[G], ac[G], ae[G], ab[G])
                } else {
                    this.drawLine(af[G], ac[G], ae[G], ab[G])
                }
            }
        }, setLinePos: function (ab, aa, X, Z, G) {
            var Y = forcedoc(ab);
            Y.style.display = "";
            Y.from = aa + "," + X;
            Y.to = Z + "," + G
        }, setColor: function (Y) {
            var X = this.list;
            for (var G = 0, aa = X.length; G < aa; G++) {
                var Z = X[G];
                if (Z) {
                    Z.strokecolor = Y
                }
            }
        }, clearLine: function () {
            var Y = document.getElementById;
            var Z = this.list;
            for (var X = 0, ab = Z.length; X < ab; X++) {
                var aa = Z[X];
                if (aa) {
                    aa.style.display = "none"
                }
            }
        }, remoiveLine: function () {
            var Y = document.getElementById;
            var Z = this.list;
            for (var X = 0, ab = Z.length; X < ab; X++) {
                var aa = Z[X];
                if (aa) {
                    document.body.removeChild(aa)
                }
            }
        }
    };

    //获取元素值，并去除限定字符
    function a(G) {
        return G.replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"), "")
    }

    //判断事件名称是否合法
    function ckeckEventName(G) {
        return (G.search(/[^*()<>"']/) == -1) ? true : false
    }

    function L(Y, Z) {
        var X = new RegExp("(^|&|\\?)" + Y + "=([^&]*)(&|\x24|#)");
        var G = Z.match(X);
        if (G) {
            return G[2]
        }
    };
    function o(ab, X, G, Y, aa) {
        var Z = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="' + G + '" height="' + Y + '" id="' + ab + '" align="middle">';
        Z += '<param name="allowscriptaccess" value="always">';
        Z += '<param name="quality" value="high">';
        Z += '<param name="movie" value="' + X + '">';
        Z += '<param name="flashvars" value="' + aa + '">';
        Z += '<embed src="' + X + '" flashvars="' + aa + '" quality="high" width="' + G + '" height="' + Y + '" name="' + ab + '" align="middle" allowscriptaccess="always" wmode="window" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">';
        Z += "</object>";
        return Z
    }

    function r(G) {
        return String(G).replace(/[-_]\D/g, function (X) {
            return X.charAt(1).toUpperCase()
        })
    }

    function N(X, G) {
        X = forcedoc(X);
        G = r(G);
        var Z = X.style[G];
        if (Z) {
            return Z
        }
        var Y = X.currentStyle || (H ? X.style : getComputedStyle(X, null));
        Z = Y[G];
        return Z
    }

    function E(Y) {
        var Y = forcedoc(Y);
        var ac = (Y.nodeType == 9) ? Y : Y.ownerDocument || Y.document;
        var ab = d > 0 && ac.getBoxObjectFor && N(Y, "position") == "absolute" && (Y.style.top === "" || Y.style.left === "");
        var ad = {left: 0, top: 0};
        var X = (H && !K) ? ac.body : ac.documentElement;
        if (Y == X) {
            return ad
        }
        var Z = null;
        var aa;
        if (Y.getBoundingClientRect) {
            aa = Y.getBoundingClientRect();
            ad.left = Math.floor(aa.left) + Math.max(ac.documentElement.scrollLeft, ac.body.scrollLeft);
            ad.top = Math.floor(aa.top) + Math.max(ac.documentElement.scrollTop, ac.body.scrollTop);
            ad.left -= ac.documentElement.clientLeft;
            ad.top -= ac.documentElement.clientTop;
            if (H && !K) {
                ad.left -= 2;
                ad.top -= 2
            }
        } else {
            if (ac.getBoxObjectFor && !ab) {
                aa = ac.getBoxObjectFor(Y);
                var G = ac.getBoxObjectFor(X);
                ad.left = aa.screenX - G.screenX;
                ad.top = aa.screenY - G.screenY
            } else {
                Z = Y;
                do {
                    ad.left += Z.offsetLeft;
                    ad.top += Z.offsetTop;
                    if (e > 0 && N(Z, "position") == "fixed") {
                        ad.left += ac.body.scrollLeft;
                        ad.top += ac.body.scrollTop;
                        break
                    }
                    Z = Z.offsetParent
                } while (Z && Z != Y);
                if (J > 0 || (browser.isWebkit > 0 && N(Y, "position") == "absolute")) {
                    ad.top -= ac.body.offsetTop
                }
                Z = Y.offsetParent;
                while (Z && Z != ac.body) {
                    ad.left -= Z.scrollLeft;
                    if (!b.opera || Z.tagName != "TR") {
                        ad.top -= Z.scrollTop
                    }
                    Z = Z.offsetParent
                }
            }
        }
        return ad
    };


    function C(X) {
        var G = q(X);
        return w(G)
    }

    function q(X) {
        var G = [];
        var Z = document.getElementsByTagName("*");
        var Y = 0;
        while (elm = Z[Y++]) {
            elm[X] ? G[G.length] = elm[X] : null
        }
        return G
    };
    function w(G) {
        var X = G.sort();
        var Z = {};
        for (var Y = 0, ab = G.length - 1; Y < ab; Y++) {
            if (X[Y + 1] == X[Y]) {
                var aa = X[Y];
                Z[aa] = Y
            }
        }
        return Z
    };
    function W(X, G) {
        var X = forcedoc(X);
        while (X && X != document.body) {
            if (X.tagName == G) {
                return true
            }
            X = X.parentNode
        }
        return false
    }

    function createNewElem() {
        var X = forcedoc(D);
        if (X) {
            X.style.zIndex = 2147483584;
            return X
        } else {
            var G = document.createElement("DIV");
            G.id = D;
            document.body.appendChild(G);
            return G
        }
    };
    function g(G, Y, X) {
        var G = forcedoc(G);
        while (G && G != document.body) {
            if (N(G, Y) == X) {
                return true
            }
            G = G.parentNode
        }
        return false
    }

    function I(G) {
        return document[G] || window[G]
    }

    function l() {
        var G = forcedoc(m);
        if (G) {
            G.style.zIndex = "2047483583";
            return G
        } else {
            var G = document.createElement("IFRAME");
            G.src = "about:blank";
            G.style.position = "absolute";
            G.style.zIndex = "2047483583";
            G.id = m;
            document.body.appendChild(G);
            return G
        }
    }

    //HTTP跨域请求返回JS值 全局变量
    var resQueue = [{locked: 0, val: undefined}, {locked: 0, val: undefined}, {locked: 0, val: undefined}];
    var getQueueIndex = function () {
        for (var i = 0; i < resQueue.length; i++) {
            if (resQueue[i].locked == 0) {
                resQueue[i].locked = 1;
                resQueue[i].val = undefined;
                return i;
            }
        }
        return -1;
    }
    //HTTP跨域请求返回JS接收 回调函数
    crossDomainCallback = function (data, index) {
        resQueue[index].val = data;
    }
    //跨域访问 统一函数
    //返回值为 返回数据存放位置
    crossDomainSendData = function (url, cb) {
        var index = getQueueIndex();
        console.log("跨域请求使用数据队列：" + index)
        if (index < 0) {//队列满了
            return;
        }
        var scriptBlock = document.createElement("script");
        if (url.indexOf("?") < 0) {//请求附加uid和trackid信息
            scriptBlock.src = url + "?index=" + index+"&td="+params["td"]+"&cuid="+params["cuid"];
        } else {
            scriptBlock.src = url + "&index=" + index+"&td="+params["td"]+"&cuid="+params["cuid"];
        }
        document.getElementsByTagName("head")[0].appendChild(scriptBlock);
        window.setTimeout(function () {
            if (resQueue[index].val == undefined) {
                console.log("超时，数据回写失败！")
            }
            else {
                //刷新显示事件
                console.log("跨域请求 返回数据:" + index + "==>" + JSON.stringify(resQueue[index]));
                cb(index, resQueue[index]);//数据发送并返回成功后处理
                panelcont.canelPanel();//关闭窗口
            }
            resQueue[index].locked = 0;//归还队列
            resQueue[index].val = undefined;
            document.getElementsByTagName("head")[0].removeChild(scriptBlock);//删除临时script元素
        }, 2000);//设置超时时间
    }
    //////////////////////////////////////公共方法


    /**
     * 页面整体控制
     * @type {{init: Function, forms: {input: string, select: string, img: string}, reBuildingWindow: Function, reBuildingFlash: Function, displayAltContent: Function}}
     */
    var rootPage = {//v=rootPage
        init: function () {
            rootPage.reBuildingFlash();
            rootPage.reBuildingWindow()
        },
        forms: {input: "", select: "", img: ""},
        reBuildingWindow: function () {
            window.open = function () {
            };
            window.openDialog = function () {
            };
            window.setHomePage = function () {
            }
        },
        reBuildingFlash: function () {
            var ac = [];
            var aa = document.getElementsByTagName("OBJECT");
            var G = document.getElementsByTagName("IFRAME");
            var X = document.getElementsByTagName("EMBED");
            for (var Y = 0, ab = aa.length; Y < ab; Y++) {
                rootPage.displayAltContent(aa[Y])
            }
            for (var Y = 0, ab = G.length; Y < ab; Y++) {
                rootPage.displayAltContent(G[Y])
            }
            for (var Y = 0, ab = X.length; Y < ab; Y++) {
                var Z = X[Y];
                if (Z.parentNode.tagName != "OBJECT") {
                    rootPage.displayAltContent(Z)
                }
            }
        },
        displayAltContent: function (Y) {
            if (Y.parentNode.id == "TrackerSenderFlashContent" || Y.parentNode.id.indexOf("BDBridge") > -1) {
                return false
            }
            var nelem = document.createElement("div");
            var X = E(Y);
            nelem.style.cssText = "position:absolute; border:1px solid #6990B3; font-size:12px; overflow:hidden; background:#fff";
            nelem.innerHTML = errIdMsg.OBJECT;
            nelem.title = errIdMsg.OBJECT;
            nelem.style.textAlign = "center";
            nelem.style.height = Y.offsetHeight + "px";
            nelem.style.lineHeight = Y.offsetHeight + "px";
            nelem.style.width = Y.offsetWidth + "px";
            Y.parentNode.insertBefore(nelem, Y);
            Y.style.visibility = "hidden"
        }
    };
    //Body标签操作
    var rootBody = {//rootBody=P
        initRootBody: function () {//初始化Body操作 =P.init()
            attachEvent(document, "click", panelcont.showPanelHandle);
            attachEvent(document, "mouseover", panelcont.showPanelTip);
            attachEvent(document, "mouseout", panelcont.hidePanelTip)

            //初始化已添加事件目标信息
            var url = p.protocol + "//" + p.flashUrl + "/" + p.urlPath + "?type=getTips&eventPage="+params["srcUrl"];
            crossDomainSendData(url, rootBody.initTips);
        },
        initTips: function (index, resData) {
            //同时要写入Tips
            var rtips = resData.val;
            for (var i = 0, len = rtips.length; i < len; i++) {
                var eventId = rtips[i]["event_id"];//事件ID
                var eventName = rtips[i]["event_name"];//事件名称
                var eventPage = rtips[i]["event_page"];//事件所属页面

                var doc = forcedoc(eventId);
                if (doc != null) {
                    doc.setAttribute("HY_transId", eventId);
                    doc.setAttribute("HY_eventTargetName", decodeURIComponent(eventName));
                    //doc.setAttribute("HY_eventType", data.eventType);
                    doc.setAttribute("HY_eventDomain", eventPage);
                    tipContent.showTip(doc.id);
                    tips.push(doc);
                }
            }
        }
    }
    //弹出Panel容器
    var panelcont = {//=O
        //显示各种弹出容器
        limit: 10,
        current: null,
        otherzIndex: 2147483570,
        vml: new t({style: "position:absolute; top:0; left:0;z-index:2147483582", strokeDashStyle: "ShortDash"}),
        curVml: new t({style: "position:absolute; top:0; left:0;z-index:2147483581"}),
        selectTip: null,
        showPanelHandle: function (doc) {
            ckeckDoc(doc);
            if (k.unFindIdList.length > 0) {
                k.showNoSelected()
            }
            var elem = doc.srcElement || doc.target;//elem=X
            if (elem.tagName == "HTML" || elem.tagName == "BODY" || elem.tagName == "Line") {
                panelcont.canelPanel();//关闭弹出层
                return
            }
            if (panelcont.curId) {
                panelcont.hideRect(panelcont.curId)
            }
            panelcont.showRect(elem);
            if (elem && elem.id) {//存在ID的 元素
                panelcont.showAddPanel(elem, doc)
            } else {//无ID元素
                panelcont.showDisablePanel(elem, errIdMsg.disable)
            }
        },
        //展示边框
        showPanelTip: function (doc) {
            var elem = doc.srcElement || doc.target;//获取鼠标点击元素
            if (elem.tagName == "HTML" || elem.tagName == "BrootBodyDY" || elem.tagName == "Line") {
                return
            }
            var eid = elem.id;
            if (panelcont.curId && eid == panelcont.curId) {
                return
            }
            elem.style.outline = "1px solid #00F"
            //}
        },
        //隐藏边框
        hidePanelTip: function (doc) {
            var elem = doc.srcElement || doc.target;
            var eid = elem.id;
            if (panelcont.curId && eid == panelcont.curId) {
                return
            }
            if (H > 0 && H < 8) {
                panelcont.vml.clearLine()
            } else {
                elem.style.outline = ""
            }
        },
        //存在ID元素点击 显示添加事件Panel
        showAddPanel: function (elem, doc) {//ac=elem Y=doc
            doc = doc || window.event;
            var ab = E(elem);
            var eid = elem.id;
            if (k.hasDuplicateId(eid)) {
                panelcont.showDisablePanel(elem, errIdMsg.DUPLICATE_ID(eid));
                return false
            }
            rootBody.curId = eid;
            var X = elem.getAttribute("HY_transId");
            var Z = X ? X : "";
            var G = createElem();
            G.setAttribute("HY_panelTarget", eid);
            G.setAttribute("HY_eventType", doc.type);
            G.setAttribute("HY_transId", Z);
            G.style.cssText = p.eventPanelStyle;
            G.style.display = "block";
            G.innerHTML = panelcont.addEventPanel();
            elem.top = elem.top + elem.offsetHeight;
            panelcont.fixedPosition(G, ab, elem);//固定位置
            attachEvent(G, "click", stopBrowserBubble);
            attachEvent(G, "mouseover", stopBrowserBubble);
            attachEvent(G, "mouseout", stopBrowserBubble);
            panelcont.bindPanelEvent();
            panelcont.updateInfo(elem.id);
            if (Z) {
                forcedoc(deleteBtn).style.display = "block";
                forcedoc(S).innerHTML = "编辑事件目标"
            } else {
                forcedoc(deleteBtn).style.display = "none";
                forcedoc(S).innerHTML = "添加事件目标"
            }
        },
        //无ID元素点击提示
        showDisablePanel: function (elem, contText) {
            var Y = E(elem);
            var G = createElem();
            G.style.cssText = p.disablePanelStyle;
            G.style.display = "block";
            G.innerHTML = contText;
            Y.top = Y.top + elem.offsetHeight;
            panelcont.fixedPosition(G, Y, elem);
            attachEvent(G, "click", stopBrowserBubble)
        },

        bindPanelEvent: function () {
            attachEvent(Q, "click", panelcont.submitPanel);
            attachEvent(cancelBtn, "click", panelcont.canelPanel);
            attachEvent(deleteBtn, "click", panelcont.deletePanel)
        },
        updateInfo: function (ab) {
            var aa = forcedoc(ab);
            var X = aa.getAttribute("HY_eventTargetName") || errIdMsg.defaultTargetName + (tips.length + 1);
            var Z = aa.getAttribute("HY_eventDomain");// || k.PREVIEW_URL;
            var Y = ab.length > 20 ? ab.substr(0, 18) + "..." : ab;
            var G = forcedoc(y);
            G.innerHTML = Y;
            G.title = ab;
            forcedoc(h).value = X;
            forcedoc(s).value = Z
        },
        fixedPosition: function (ag, Z, aa) {
            var aj = g(aa, "dispaly", "none") || g(aa, "visibility", "hidden");
            var G = K ? document.documentElement.clientWidth : document.body.clientWidth;
            var ab = K ? document.documentElement.clientHeight : document.body.clientHeight;
            var am = K ? document.documentElement.scrollTop : document.body.scrollTop;
            var af = ag.offsetWidth;
            var al = ag.offsetHeight;
            var ah = aa.offsetWidth;
            var an = aa.offsetHeight;
            var X = Z.left;
            var ai = Z.top;
            var ae, ad;
            if (an > al) {
                var Y = (af + X) < G ? true : false;
                var ak = (al + ai) < ab ? true : false;
                ae = Y ? X : X - af + ah;
                ad = ai - an
            } else {
                var Y = (af + X) < G ? true : false;
                var ak = (al + ai) < ab ? true : false;
                ae = Y ? X : X - af + ah;
                ad = ak ? ai : ai - al - an
            }
            ae = ae < 0 ? 0 : ae;
            ad = ad < 0 ? 0 : ad;
            if (aj || (ae == 0 && ad == 0)) {
                ae = (G / 2) - (af / 2);
                ad = (ab / 2) + (am ? am : 0) - (al / 2)
            }
            if (H == 6) {
                var ac = l();
                if (ac) {
                    ac.style.left = ae + "px";
                    ac.style.top = ad + "px";
                    ac.style.height = al + "px";
                    ac.style.width = af + "px";
                    ac.style.display = "block"
                }
            }
            ag.style.left = ae + "px";
            ag.style.top = ad + "px";
            ag.style.display = "block"
        },

        //弹出添加事件框 确定按钮
        submitPanel: function () {
            var addPanel = createElem();//addPanel=X
            var G = a(forcedoc(h).value);
            var ab = a(forcedoc(s).value);
            if (G == "") {
                alert("事件目标名称不能为空!");
                return
            }
            if (ab == "") {
                alert("事件作用页面或目录名称不能为空!");
                return
            }
            if (ckeckEventName(G)) {
                alert("事件目标名称是非法的!");
                return
            }
            var ad = addPanel.getAttribute("HY_panelTarget");
            var Z = addPanel.getAttribute("HY_eventType");
            var Y = addPanel.getAttribute("HY_transId");

            var ac = Y ? Y : "";
            var evenData = {name: encodeURIComponent(G), id: ad, eventType: Z, targetId: ac, monUrl: ab};
            var url = p.protocol + "//" + p.flashUrl  + "/" + p.urlPath+"?type=saveTips&data="+JSON.stringify(evenData);
            crossDomainSendData(url, function (index, resData) {
                //刷新显示事件
                panelcont.addCompleteController(evenData);
            });//==sendData 分不同情况
        },
        canelPanel: function () {
            var G = createElem();
            var Y = G.getAttribute("HY_panelTarget");
            G.style.display = "none";
            panelcont.hideRect(Y);
            if (H == 6) {
                var X = l();
                if (X) {
                    X.style.display = "none"
                }
            }
        },
        deletePanel: function () {
            var elm = createElem();
            elm.style.display = "none";
            var targetPanel = elm.getAttribute("HY_panelTarget");
            var doc = forcedoc(targetPanel);
            var eventId = doc.getAttribute("HY_EventId");
            if (eventId) {
                tipContent.deleteTip(eventId)
            }
        },
        //隐藏弹出层
        hideRect: function (docId) {
            var doc = forcedoc(docId);
            if (!doc) {
                return
            }
            if (H > 0 && H < 8) {
                panelcont.curVml.clearLine()
            } else {
                G.style.outline = ""
            }
        },
        //添加事件Panel构建
        addEventPanel: function () {
            var G = [];
            G.push('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
            G.push("<tr>");
            G.push('<td  height="28" id="' + S + '" valign="middle" style="margin:0; padding:0; border:0; font-size:12px; color:#000">添加事件目标</td>');
            G.push('<td  height="28" colspan="2" id="' + A + '" valign="middle"><div style="float:right;style="margin:0; padding:0; border:0; font-size:12px; color:#000"><a href="http://support.baidu.com/tongji/?module=default&controller=index&action=detail&nodeid=4791" target="_blank" style="font-size:12px; color:#00c; ">如何设置事件作用页面或目录</a></div></td>');
            G.push("</tr>");
            G.push("<tr>");
            G.push('<td width="150" height="30">ID</td>');
            G.push('<td id="' + y + '" colspan="2" style="margin:0;text-align:left;  padding:0; border:0; font-size:12px; color:#000"></td>');
            G.push("</tr>");
            G.push("<tr>");
            G.push('<td height="30" style="margin:0; padding:0; border:0; text-align:left; font-size:12px; color:#000">名称：</td>');
            G.push('<td colspan="2">');
            G.push("<label>");
            G.push('<input type="text" id="' + h + '" value="" size="40" style="font-size:12px; color:#000" />');
            G.push("</label>");
            G.push("</td>");
            G.push("</tr>");
            G.push("<tr>");
            G.push('<td height="30" style="margin:0; padding:0; border:0; text-align:left; font-size:12px; color:#000">事件作用页面或目录：</td>');
            G.push('<td colspan="2">');
            G.push("<label>");
            G.push('<input type="text"  size="40" id="' + s + '" value="' + params["srcUrl"] + '" />');
            G.push("</label>");
            G.push("</td>");
            G.push("</tr>");
            G.push("<tr>");
            G.push('<td height="30" colspan="3"><span style="color:#999;text-align:left;  font-size:12px; ">( 可以在URL首或尾使用*匹配任意长度字符，直接填写*代表事件作用目标为整个网站)</span></td>');
            G.push("</tr>");
            G.push("<tr>");
            G.push('<td height="30">');
            G.push('<input id="' + Q + '" type="button" value="保存"/>');
            G.push("</td>");
            G.push('<td height="30">');
            G.push('<input id="' + cancelBtn + '" type="button" value="取消" />');
            G.push("</td>");
            G.push('<td height="30">');
            G.push('<input id="' + deleteBtn + '" type="button" value="删除" />');
            G.push("</td>");
            G.push("</tr>");
            G.push("</table>");
            return G.join("")
        },

        showRect: function (X) {
            if (!X) {
                return
            }
            if (N(X, "z-index") > 2147483570 && !flag) {
                X.style.zIndex = panelcont.otherzIndex--
            }
            if (H > 0 && H < 8) {
                var G = E(X);
                panelcont.curVml.drawRect(G.left, G.top, X.offsetWidth, X.offsetHeight)
            } else {
                X.style.outline = "1px solid #00F"
            }
        },
        addCompleteController: function (data) {
            var Y = data.id;
            var X = forcedoc(Y);
            if (X) {
                X.setAttribute("HY_transId", data.targetId);
                X.setAttribute("HY_eventTargetName", decodeURIComponent(data.name));
                X.setAttribute("HY_eventType", data.eventType);
                X.setAttribute("HY_eventDomain", data.monUrl);
                tipContent.showTip(Y)
                tips.push(data);
            }
            panelcont.canelPanel()
        }
    };


    var k = {
        unFindIdList: [], status: 1, hasDuplicateId: function (X) {
            var G = C("id");
            if (G.hasOwnProperty(X)) {
                return true
            }
            return false
        }, unFindList: function () {
            var G = [];
            for (var X = 0, ab = x.length; X < ab; X++) {
                var Y = x[X];
                if (Y && Y.id) {
                    var aa = Y.id;
                    var Z = forcedoc(aa);
                    if (!Z) {
                        G.push(Y)
                    } else {
                        if (g(Z, "dispaly", "none") || g(Z, "visibility", "hidden")) {
                            G.push(Y)
                        }
                    }
                }
            }
            k.unFindIdList = G;
            return G
        }, showNoSelected: function () {
            var X = k.unFindIdList;
            for (var G = 0, ab = X.length; G < ab; G++) {
                var Y = X[G];
                if (Y && Y.id) {
                    var aa = forcedoc(Y.id);
                    if (aa) {
                        aa.setAttribute("HY_eventType", Y.eventType);
                        var Z = Y.targetId ? Y.targetId : "";
                        aa.setAttribute("HY_transId", Z);
                        aa.setAttribute("HY_eventTargetName", decodeURIComponent(Y.name));
                        aa.setAttribute("HY_eventDomain", Y.monUrl);
                        tipContent.showTip(Y.id);
                        X.splice(G, 1)
                    }
                }
            }
        }
    };

    var tipContent = {
        zIndex: 2147483001,
        cssStr: {
            TipDiv: "position:absolute; width:120px; height:20px; line-height:20px; padding:0 5px; font-size:12px; color:#fff; background:#a1afef;",
            NameDiv: "width:90px; height:20px; overflow:hidden; white-space:nowrap; margin:0; padding:0; border:0; color:#fff; font-size:12px;",
            EditDivNormal: "margin:0; padding:0; border:0;width:12px; height:12px; background:url(" + p.webroot + "/img/event-icon.gif) 0 -21px no-repeat",
            DeleteDivNormal: "margin:0; padding:0; border:0;width:12px; height:12px; background:url(" + p.webroot + "/img/event-icon.gif) -13px -21px no-repeat",
            EditDivHover: "margin:0; padding:0; border:0;width:12px; height:12px; background:url(" + p.webroot + "/img/event-icon.gif) 0 0 no-repeat",
            DeleteDivHover: "margin:0; padding:0; border:0;width:12px; height:12px; background:url(" + p.webroot + "/img/event-icon.gif) -13px 0 no-repeat"
        },
        getTipHtml: function (X) {
            var G = [];
            G.push("<div>");
            G.push('<table width="100%" border="0" cellspacing="0" cellpadding="0">');
            G.push("  <tr></tr>");
            G.push("  <tr>");
            G.push("    <td><div></div></td>");
            G.push('    <td width="15"><div title="编辑">&nbsp;</div></td>');
            G.push('    <td width="12"><div title="删除">&nbsp;</div></td>');
            G.push("  </tr>");
            G.push("  </table>");
            G.push("</div>");
            return G.join("")
        },
        creatTipContainer: function () {
            var G = document.createElement("DIV");
            G.id = "HY_EventTipContainer" + randName(8);
            G.style.zIndex = tipContent.zIndex;
            tipContent.zIndex++;
            return G
        },
        showTip: function (docId) {
            var doc = forcedoc(docId)//获取标签附着元素DOM
            var ag = (g(doc, "position", "fixed") || g(doc, "position", "absolute"));
            var tipDiv = tipContent.creatTipContainer();//创建tip标签
            doc.setAttribute("HY_transId", docId);//设置所属ID
            doc.setAttribute("HY_EventId", tipDiv.id);
            if (ag) {
                var ak = doc.firstChild;
                if (ak) {
                    doc.insertBefore(tipDiv, ak)
                } else {
                    doc.appendChild(tipDiv)
                }
            } else {
                document.body.appendChild(tipDiv)
            }
            var X = tipDiv.getElementsByTagName("DIV");
            var aj = doc.offsetWidth;
            var ad = doc.offsetHeight;
            tipDiv.innerHTML = tipContent.getTipHtml();
            tipDiv.style.border = "1px solid #a1afef";
            tipDiv.style.position = "absolute";
            tipDiv.style.width = aj + "px";
            tipDiv.style.height = ad + "px";
            tipDiv.style.cursor = "pointer";
            tipDiv.style.textAlign = "left";
            tipDiv.setAttribute("MapTarget", docId);
            var ae = W(doc, "CENTER") || g(doc, "text-align", "center");
            if (!ag) {
                var ah = E(doc);
                tipDiv.style.top = ah.top + "px";
                tipDiv.style.left = ah.left + "px"
            }
            X[0].style.cssText = tipContent.cssStr.TipDiv;
            var aa = X[1];
            var G = doc.getAttribute("HY_eventTargetName");
            aa.style.cssText = tipContent.cssStr.NameDiv;
            aa.innerHTML = decodeURIComponent(G);
            aa.setAttribute("title", G);
            var ac = X[2];
            ac.style.cssText = tipContent.cssStr.EditDivNormal;
            var ab = X[3];
            ab.style.cssText = tipContent.cssStr.DeleteDivNormal;
            //为Tip标签设置事件
            attachEvent(tipDiv, "mouseover", tipContent.overTipHandle(tipDiv.id));
            attachEvent(tipDiv, "mouseout", tipContent.outTipHandle(tipDiv.id));
            attachEvent(tipDiv, "click", tipContent.editTipHandle(tipDiv.id));
            attachEvent(ac, "click", tipContent.editTipHandle(tipDiv.id));//编辑
            attachEvent(ab, "click", tipContent.deleteHandle(tipDiv.id))//删除
        },
        clickHandle: function (G) {
            stopBrowserBubble(G)

        },
        overTipHandle: function (G) {
            return function (X) {
                stopBrowserBubble(X);
                var Z = forcedoc(G);
                Z.style.zIndex = 2147483581;
                var Y = Z.getElementsByTagName("DIV");
                Y[0].style.background = "#2a4bda";
                Z.style.border = "1px solid #2a4bda";
                Y[2].style.cssText = tipContent.cssStr.EditDivHover;
                Y[3].style.cssText = tipContent.cssStr.DeleteDivHover
            }
        },
        outTipHandle: function (G) {
            return function (X) {
                stopBrowserBubble(X);
                var Z = forcedoc(G);
                Z.style.border = "1px solid #a1afef";
                var Y = Z.getElementsByTagName("DIV");
                Y[0].style.background = "#a1afef";
                Y[2].style.cssText = tipContent.cssStr.EditDivNormal;
                Y[3].style.cssText = tipContent.cssStr.DeleteDivNormal
            }
        },
        editTipHandle: function (G) {
            return function (Y) {
                stopBrowserBubble(Y);
                var X = forcedoc(G).getAttribute("MapTarget");
                if (X) {
                    var Z = forcedoc(X);
                    panelcont.showAddPanel(Z, Y)
                }
            }
        },
        deleteHandle: function (G) {
            return function (X) {
                stopBrowserBubble(X);
                tipContent.deleteTip(G)
            }
        },
        deleteTip: function (docId) {
            var doc = forcedoc(docId);
            var targetMap = doc.getAttribute("MapTarget");
            if (targetMap) {
                var targetMapDoc = forcedoc(targetMap);
                if (targetMapDoc) {
                    var transId = targetMapDoc.getAttribute("HY_transId");
                    if (transId) {
                        var msgWind = window.confirm(errIdMsg.Delete);
                        if (!msgWind) {
                            return false
                        }
                    }
                    var elem = document.getElementById(docId);
                    if (elem != null)
                        elem.parentNode.removeChild(elem);
                    var ttips = [];
                    for (var n = 0, k = 0; n < tips.length; n++, k++) {
                        if (ab.id == tips[n].id) {
                            k--;
                            tipContent.deleteComplete(aa);
                            continue
                        }
                        ttips[k] = tips[n];
                    }
                    tips = ttips;
                    //物理删除
                    var ad = doc.getAttribute("HY_panelTarget");
                    console.log("event id="+ad);
                    //var url = p.protocol + "//" + p.flashUrl  + "/" + p.urlPath+"?type=deleteTips&data="+JSON.stringify(eventId);
                    //crossDomainSendData(url, function (index, resData) {
                    //    //刷新显示事件
                    //    panelcont.addCompleteController(evenData);
                    //});//==sendData 分不同情况
                }
            }
        },
        deleteComplete: function (G) {
            var Y = forcedoc(G.id);
            if (!Y) {
                return
            }
            if (G.tip_container) {
                var X = forcedoc(G.tip_container);
                Y.removeAttribute("HY_eventTargetName");
                //Y.removeAttribute("HY_eventType");
                Y.removeAttribute("HY_transId");
                Y.removeAttribute("HY_EventId");
                Y.removeAttribute("HY_eventDomain");
                X.parentNode.removeChild(X)
            }
            panelcont.canelPanel()
        }
    }

    var params={};
    var shref = document.location.href;
    var tps = shref.substring(shref.indexOf('?')+1,shref.length).split("&");
    for(var i = 0; i<tps.length;i++){
        var kv=tps[i].split("=");
        params[kv[0]]=kv[1];
    }

    params["srcUrl"]=shref.substring(0,shref.indexOf('?'));
    if(params!=null&&params.jn=="select"){
        //console.log("初始化使用Select.js 注入客户端代码 请求参数：")
        //console.log(params)
        //页面div插入
        document.write('<div id="' + p.hyContent + '" style="position:absolute;width:1px;height:1px;"></div>');
        //根Body初始化
        rootBody.initRootBody();
        //页面事件绑定
        attachEvent(document.body, "onload", rootPage.init);
    }
})();