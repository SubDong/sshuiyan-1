/**
 * Created by MrDeng on 2015/7/3.
 */
(function(){
    var dqh={

        /**
         *  add
         *  ��� heartBeat֮��
         *  ����select.js
         */
        getSelectJS:function(){
            //ccz.ref �ж���Դ
            console.log("getSelectJS")
            var _c = h.I;
            var a = document.createElement("script");
            a.setAttribute("type", "text/javascript");
            a.setAttribute("src","http://127.0.0.1:8001/t.js/select?tid="+ c.id);//tid=b6dccb905b3003f75e40f79cc6786200 Ϊtrackid
            var f = document.getElementsByTagName("script")[0];
            f.parentNode.insertBefore(a, f);
        }

    }
})();
