/**
 * Created by icepros on 2015/8/4.
 */
//tsource.js ÖÐ 641-663ÐÐ
(function () {
    var loc = md.g.loc;
    var sr = loc.split("?")[1].split("&")[0].split("=")[0];
    var md = loc.split("?")[1].split("&")[1].split("=")[0];
    var pl = loc.split("?")[1].split("&")[2].split("=")[0];
    var kw = loc.split("?")[1].split("&")[3].split("=")[0];
    var ci = loc.split("?")[1].split("&")[4].split("=")[0];
    var tk = loc.split("?")[1].split("&")[5].split("=")[0];
    /*var adObj = {
     tid: loc.split("?")[1].split("&")[5].split("=")[1],
     rf: loc.split("?")[0].split("/")[2],
     media: loc.split("?")[1].split("&")[0].split("=")[1],
     cpna: loc.split("?")[1].split("&")[2].split("=")[1],
     kwna: loc.split("?")[1].split("&")[3].split("=")[1],
     crt: loc.split("?")[1].split("&")[4].split("=")[1]
     };*/
    if (sr == "hmsr" && md == "hmmd" && pl == "hmpl" && kw == "hmkw" && ci == "hmci" && tk == "tid") {
        md.g.adtrack = 1;
        h.b.sm();
    } else {

    }
})();