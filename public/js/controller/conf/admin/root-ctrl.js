/**
 * Created by icepros on 2015/5/26.
 */
/* 权限账户管理控制器 */
define(["../module"], function (ctrs) {
    "use strict";

    ctrs.controller('rootCtrl', function ($scope, $q, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        //配置默认指标
        $rootScope.checkArray = ["", "", ""];
        $rootScope.gridArray = [
            {name: "姓名", displayName: "姓名", field: ""},
            {name: "用户名", displayName: "用户名", field: ""},
            {name: "邮箱", displayName: "邮箱", field: ""},
            {name: "状态", displayName: "状态", field: ""},
            {name: "权限", displayName: "权限", field: ""}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

    });
});