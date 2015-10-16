/**
 * Created by icepros on 2015/8/4.
 */
//tsource.js �� 641-658��
(function () {
    var loc = md.g.loc;
    var sr = loc.split("?")[1].split("&")[0].split("=")[0];
    var md = loc.split("?")[1].split("&")[1].split("=")[0];
    var pl = loc.split("?")[1].split("&")[2].split("=")[0];
    var kw = loc.split("?")[1].split("&")[3].split("=")[0];
    var ci = loc.split("?")[1].split("&")[4].split("=")[0];
    var tk = loc.split("?")[1].split("&")[5].split("=")[0];
    var ll = loc.split("?")[1].split("&")[6].split("=")[0];
    var tt = loc.split("?")[1].split("&")[7].split("=")[0];

    if (sr == "rf" && md == "media" && pl == "cpna" && kw == "kwna" && ci == "crt" && tk == "t" && ll == "atk" && tt == "tt") {
        //md.g.adtrack = 1;
        md.g.adtrack = loc;
        h.b.sm();
    }
})();