/**
 * Created by MrDeng on 2015/7/3.
 */
(function(){
    var dqh={

        /**
         *  add
         *  添加 heartBeat之后
         *  引入select.js
         */
        getSelectJS:function(){
            var refJS = document.referrer;
            var jupy = refJS.substring(0,refJS.lastIndexOf("/"));
            if(jupy ===  (h.I.protocol + "//" + "127.0.0.1:8000")){
                var a = document.createElement("script");
                a.setAttribute("type", "text/javascript");
                a.setAttribute("src", "http://127.0.0.1:8001/t.js/select?tid=b6dccb905b3003f75e40f79cc6786200");
                var f = document.getElementsByTagName("script")[0];
                f.parentNode.insertBefore(a, f);
            }
        },
        init: function () {
            h.b = this;
            this.na();
            this.sm();
            this.custor();
            this.getSelectJS();
            //this.heartBeat("");
        }
    }
})();
