/**
 * Created by weims on 2015/5/15.
 */
define(['angular'], function (ng) {
    'use strict';

    return ng.module('source.controllers', []).run(["$templateCache", function ($templateCache) {
        var tmp = '<xdoc version="A.3.0"><body>'
            + '<para heading="1" lineSpacing="28"><text valign="center" fontName="标宋" fontSize="29"><%=title%></text></para>'
            + '<para><text valign="center" fontName="标宋" fontSize="20">站点名称,<%=zdmc%>,,</text></para>'
            + '<para><text valign="center" fontName="标宋" fontSize="20">站点首页,<%=zdsy%>,,</text></para>'
            + '<para><text valign="center" fontName="标宋" fontSize="20">来路域名,<%=startString%>,<%=contrastStartString%>,变化情况</text></para>'
            + '<%for(var i=0;i< changeListData.length;i++){%>'
            + '<%var item = changeListData[i];%>'
            //+ '<%if(item.percentage.indexOf("+") != -1){%>'
            + '<para><text valign="center" fontName="标宋" fontSize="20" color="red"><%=item.pathName %>,<%=item.pv %>,<%=item.contrastPv %>,<%=item.percentage %></text></para>'
            //+ '<%}%>'
            //+ '<%if(item.percentage.indexOf("-") != -1){%>'
            //+ '<para><text valign="center" fontName="标宋" fontSize="20" color="green"><%=item.pathName %>,<%=item.pv %>,<%=item.contrastPv %>,<%=item.percentage %></text></para>'
            //+ '<%}%>'
            //+ '<%if(item.percentage.indexOf("(0.00%)") != -1){%>'
            //+ '<para><text valign="center" fontName="标宋" fontSize="20" color="blue"><%=item.pathName %>,<%=item.pv %>,<%=item.contrastPv %>,<%=item.percentage %></text></para>'
            //+ '<%}%>'
            + '<%}%>'
            + '<para><text valign="center" fontName="标宋" fontSize="20">全站统计,<%=changeObj.sum_pv_count%>,<%=changeObj.contrast_sum_pv_count%>,<%=changeObj.all_percentage%></text></para>'
            + '<para><text valign="center" fontName="标宋" fontSize="29"><%=author%>,,,</text></para>'
            + '</body></xdoc>';
        //来源分析-来源升降榜(来路域名)(指标：pv)(2015-10-30对比2015-10-29),,,
        //来路域名,2015-10-30,2015-10-29,变化情况
        //直接输入网址或标签,3,0,+3(-)
        //全站统计,3,0,+3(-)
        $templateCache.put('ChangeListPDFTemp', tmp);
    }]);
});