(function (w) {



    var iframe = document.getElementById("iframe111");

    iframe.src = "http://www.best-ad.cn/";

    if (iframe.attachEvent){
        iframe.attachEvent("onload", function(){
            alert("Local iframe is now loaded.11111");
        });
    } else {
        iframe.onload = function(){
            alert("Local iframe is now loaded.222222");

            iframe.contentWindow.document.getElementById("username");

        };
    }


})(window);
