(function() {
    window.onload=function(){

        var p = {
            flashUrl: "localhost:8000",
            protocol: "https:" == document.location.protocol ? "https:" : "http:"
        };
        var server_base_path = p.protocol + "//" + p.flashUrl;

        function heatUrl() {
            this.innerDiv = "HM_INNERHTML_CONTAINER";
            this.aPrefix = "HM_LINK_PREFIX";
            this.divPrefix = "HM_DIV_PREFIX";
            this.tablePrefix = "HM_DIV_TABLE";
            var currentIndex;
            this.alist = [];
            this.shadeDivList = [];
            this.popupDivList = [];
        }

        heatUrl.prototype = {
            initDom: function() {
                this.alist = document.getElementsByTagName("a");
                for (var i = 0;i < this.alist.length; i++) {
                    var a_type = this.alist[i];
                    a_type.id = this.aPrefix +i;
                }
            },
            getHeaderData : function() {
                var scriptBlock = document.createElement("script");
                var url = server_base_path + "/api/getHeatUrlHeaderData";
                scriptBlock.src = url;
                document.getElementsByTagName("head")[0].appendChild(scriptBlock);
                window.setTimeout(function () {
                    document.getElementsByTagName("head")[0].removeChild(scriptBlock);//删除临时script元素
                }, 1000);//设置超时事件
            },
            createDiv: function(aType,link,index) {
                this.left= aType.getBoundingClientRect().left;
                this.top =aType.getBoundingClientRect().top;
                this.width = aType.offsetWidth;
                this.height = aType.offsetHeight;

                var div = document.createElement("div");
                div.setAttribute("id",this.divPrefix+index);
                div.style.position="absolute";
                div.style.overflow="hidden";
                div.style.opacity=0.9;
                div.style.padding="1px 5px";
                div.style.cursor ="pointer";
                div.style.fontSize= "12px";
                div.style.color= "rgb(255, 255, 255)";

                div.style.zIndex = "2147482999";
                div.style.left= this.left;
                div.style.top = this.top;
                div.style.width= this.width;
                div.style.height= this.height;
                div.style.lineHeight= this.height+"px";
                div.style.backgroundColor= "rgb(65, 103, 161)";
                div.title = link.doc_count + "(" + link.focusing+")";
                div.innerHTML = link.doc_count + "(" + link.focusing+")";
                return div;
            },
            getDetailData : function(index) {
                this.currentIndex = index;
                var scriptBlock = document.createElement("script");
                var url = server_base_path + "/api/getHeatUrlDetailData?sourceUrl="+this.alist[index].href;

                scriptBlock.src = url;
                document.getElementsByTagName("head")[0].appendChild(scriptBlock);
                window.setTimeout(function () {
                    document.getElementsByTagName("head")[0].removeChild(scriptBlock);//删除临时script元素
                }, 1000);//设置超时事件
            },
            showDetailDiv : function (detailDiv) {
                detailDiv.style.visibility =  detailDiv.style.visibility == "visible" ? "hidden":"visible";
            },
            createDetailDiv: function(aType,link_hit,index,w,h) {

                // 获得事件Event对象
                function getEvent() {
                    return window.event || arguments.callee.caller.arguments[0];
                }

                var titleheight = "22px"; // 提示窗口标题高度
                var bordercolor = "#666699"; // 提示窗口的边框颜色
                var titlecolor = "#FFFFFF"; // 提示窗口的标题颜色
                var titlebgcolor = "#666699"; // 提示窗口的标题背景色
                var bgcolor = "#FFFFFF"; // 提示内容的背景色

                var iWidth = document.documentElement.clientWidth;
                var iHeight = document.documentElement.clientHeight;
                //var bgObj = document.createElement("div");
                // bgObj.style.cssText = "position:absolute;left:0px;top:0px;width:"+iWidth+"px;height:"+Math.max(document.body.clientHeight, iHeight)+"px;filter:Alpha(Opacity=30);opacity:0.3;background-color:#000000;z-index:101;";
                // document.body.appendChild(bgObj);

                var msgObj=document.createElement("div");
                msgObj.setAttribute("id",this.innerDiv+index);
                msgObj.style.cssText = "position:absolute;font:11px '宋体';top:"+(iHeight-h)/2+"px;left:"+(iWidth-w)/2+"px;width:"+w+"px;height:"+h+"px;text-align:center;border:1px solid "+bordercolor+";background-color:"+bgcolor+";padding:1px;line-height:22px;z-index:102;";


                //执行可移动的标题
                var table = document.createElement("table");
                msgObj.appendChild(table);
                table.style.cssText = "margin:0px;border:0px;padding:0px;";
                table.cellSpacing = 0;
                var tr = table.insertRow(-1);
                var titleBar = tr.insertCell(-1);

                titleBar.style.cssText = "width:100%;height:"+titleheight+"px;text-align:left;padding:3px;margin:0px;font:bold 13px '宋体';color:"+titlecolor+";border:1px solid " + bordercolor + ";cursor:move;background-color:" + titlebgcolor;
                titleBar.style.paddingLeft = "10px";
                //titleBar.innerHTML = title;
                var moveX = 0;
                var moveY = 0;
                var moveTop = 0;
                var moveLeft = 0;
                var moveable = false;
                var docMouseMoveEvent = document.onmousemove;
                var docMouseUpEvent = document.onmouseup;
                titleBar.onmousedown = function() {
                    var evt = getEvent();
                    moveable = true;
                    moveX = evt.clientX;
                    moveY = evt.clientY;
                    moveTop = parseInt(msgObj.style.top);
                    moveLeft = parseInt(msgObj.style.left);

                    document.onmousemove = function() {
                        if (moveable) {
                            var evt = getEvent();
                            var x = moveLeft + evt.clientX - moveX;
                            var y = moveTop + evt.clientY - moveY;
                            if ( x > 0 &&( x + w < iWidth) && y > 0 && (y + h < iHeight) ) {
                                msgObj.style.left = x + "px";
                                msgObj.style.top = y + "px";
                            }
                        }
                    };
                    document.onmouseup = function () {
                        if (moveable) {
                            document.onmousemove = docMouseMoveEvent;
                            document.onmouseup = docMouseUpEvent;
                            moveable = false;
                            moveX = 0;
                            moveY = 0;
                            moveTop = 0;
                            moveLeft = 0;
                        }
                    };
                }
                //关闭按钮
                var closeBtn = tr.insertCell(-1);
                closeBtn.style.cssText = "cursor:pointer; padding:2px;background-color:" + titlebgcolor;
                closeBtn.innerHTML = "<span style='font-size:15pt; color:"+titlecolor+";'>×</span>";
                closeBtn.onclick = function(){
                    // document.body.removeChild(bgObj);
                    //document.body.removeChild(msgObj);
                    msgObj.style.visibility = "hidden";
                }

                //表头数据
                var tablestyle ="border-bottom: 1px solid white;border-right: 1px solid #e4e4e4;border-top: 1px solid white;line-height: 1.2;padding: 8px 30px;background-color: #f2f2f2;"
                var divHeader = document.createElement("div");
                var tableHeader = document.createElement("table");
                divHeader.appendChild(tableHeader);
                msgObj.appendChild(divHeader);
                tableHeader.style.cssText = "width:100%;margin:0px;border:0px;padding:0px;";
                tableHeader.cellSpacing = 0;
                var headerRow = tableHeader.insertRow(-1);
                var vistorTd= headerRow.insertCell(-1);
                vistorTd.style.cssText = tablestyle;
                vistorTd.innerHTML = "<span>访客数</span><br><span style='text-align: center;font-weight: bold;' >"+ link_hit.uv.value +"</span>";
                var clicksTd= headerRow.insertCell(-1);
                clicksTd.style.cssText = tablestyle;
                clicksTd.innerHTML = "<span>点击数</span><br><span  style='text-align: center;font-weight: bold;'>"+ link_hit.doc_count +"</span>";
                var focusingTd= headerRow.insertCell(-1);
                focusingTd.style.cssText = tablestyle;
                focusingTd.innerHTML = "<span>聚焦度</span><br><span  style='text-align: center;font-weight: bold;'>"+ link_hit.focusing +"</span>";

                //选择列表    等待数据完善后进行添加
                //var filterDiv = document.createElement("div");
                //var span = document.createElement("span");
                //span.innerText = "细分维度：";
                //var headSelect = document.createElement("select");
                //
                //headSelect.options.add(new Option("地域","0"));
                //headSelect.options.add(new Option("浏览器","1"));
                //
                //headSelect.onchange = function(){
                //    heatUrl.getDetailData(index);
                //};
                //filterDiv.appendChild(span);
                //filterDiv.appendChild(headSelect);
                //msgObj.appendChild(filterDiv);
                //明细数据
                var tableDetail = document.createElement("table");
                tableDetail.setAttribute("id",this.tablePrefix+index);

                msgObj.appendChild(tableDetail);
                msgObj.style.visibility = "hidden";
                return msgObj;
            }
        }


        disposeDetailDataCallback = function (data) {

            var detailTable = document.getElementById(heatUrl.tablePrefix+heatUrl.currentIndex);
            detailTable.innerHTML = "";

            var headerRow = detailTable.insertRow(-1);
            var parameterTd= headerRow.insertCell(-1);
            var hitsTd= headerRow.insertCell(-1);

            parameterTd.innerHTML = "<span > 浏览器</span>";
            hitsTd.innerHTML = "<span > 点击数</span>";

            for(var i = 0; i < 2; i ++) {
                var dataRow = detailTable.insertRow(-1);
                var parameterDataTd = dataRow.insertCell(-1);
                var hitsDataTd= dataRow.insertCell(-1);

                parameterDataTd.innerHTML = "参数"+i;
                hitsDataTd.innerHTML = "点击"+i;
            }

        }

        disposeHeaderDataCallback = function (data) {
            console.log(data);

            //点击总量
            var hits = data.hits.buckets.data.doc_count;
            // hits = 1000;
            //分别连接点击量
            var link_hits = data.link_hits.buckets.data.link_hits.buckets;

            //var link_hits = [];
            //  link_hits[0] = {key:"http://www.best-ad.cn/seo.html",doc_count:"123",uv :{value:"123"}};

            //连接集合
            var alist = document.getElementsByTagName("a");

            for (var i =0; i < link_hits.length; i++) {
                var link_hit = link_hits[i];
                //循环连接标签集合
                for (var j = 0;j < alist.length; j++) {
                    var aType = alist[j];
                    //进行匹配
                    console.log(aType);
                    if(link_hit.key == aType.href  ) {
                        //聚焦度
                        link_hit.focusing = (parseInt(link_hit.doc_count *100 / hits)) + "%";
                        var div =  heatUrl.createDiv(aType,link_hit,j);
                        //创建明细窗口
                        var detialDiv = heatUrl.createDetailDiv(aType,link_hit,j,350,240);
                        document.body.appendChild(div);
                        document.body.appendChild(detialDiv);
                        //绑定方法
                        (function(detialDiv){
                            div.onclick = function(){
                                heatUrl.showDetailDiv(detialDiv);
                            };
                        }(detialDiv));
                    }
                }
            }
        }


        var heatUrl = new heatUrl();

        heatUrl.initDom();
        heatUrl.getHeaderData();

    }

})();