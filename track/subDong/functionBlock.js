(function(){
    var config = {};
    config.evt =
        [{
            eid: "asw",//事件ID
            evttag: "Login",//事件名称
            evpage: "http://localhost"//事件页面
        }]
    //////////////
    if(config != undefined && config.evt.length>0){
        window.onload = function(){
            //自动添加客户转化时间配置
            config.evt.forEach(function (item, i) {
                var loc = h.I.protocol + "//" + document.location.hostname;
                if (loc === item.evpage) {
                    var eidTree = document.getElementById(item.eid);
                    if (eidTree != undefined && eidTree != null) {
                        eidTree.onclick = function(){
                            _pct.putPar(["_trackEvent",item.eid,item.evttag]);
                        }
                    }
                }
            })
        }
    }
    /////////////

    /////////////实现同一次访问在晚上11点到第二天00之后属于2次访问
    ////////////添加到  na方法中的 if (null == a || undefined == a || "" == a || (as != "-" && as != ab && Judge)) {}之后
    //ck.set("PFT_SJKD", new Date().getDate());///TODO 添加到par方法中的return之前
    else {
        var ckDay = this.getData("PFT_SJKD");
        var newDay = new Date().getDate();
        console.log(ckDay);
        console.log(newDay);
        ckDay < newDay ? md.g.n = "1" : "";
    }
    /////////////
})()