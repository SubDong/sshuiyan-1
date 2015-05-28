/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adminmainctr', function ($scope, $q, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {

        /*    $scope.hourcheck= function(){
         $scope.dayClass=false;
         $scope.hourcheckClass=true;
         }
         $scope.daycheck= function(){
         $scope.dayClass=true;
         $scope.hourcheckClass=false;
         }*/
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = "hour";
        $rootScope.adminSetHtml ="<div class='mid_left'><div class='mid_left_code'> 邓子豪</div> </div><div class='mid_right'><button type='button' class='btn btn-default navbar-btn'>复制代码</button><ul type='disc'>"+
        "  <li>请将代码添加至网站全部页面的&lt;/head&gt;标签前；</li><li>建议在header.htm类似的页头模板页面中安装，以达到一处安装，全站皆有的效果；</li><li>如需在JS文件中调用统计分析代码，请直接去掉以下代码首尾的&lt;script type='text/javascript' &gt;与&lt;/script&gt;后，放入JS文件中即可；</li>"+
        "<li> 如果代码安装正确，一般20分钟 后,可以查看网站分析数据；</li></ul></div>"
        //配置默认指标
        //配置默认指标
        $rootScope.checkedArray = ["", "", ""];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>1</div>", maxWidth: 5},
            {name: "网站域名", displayName:"网站域名", field: "a", maxWidth: '', cellClass:'table_admin'},
            {name: "网站名称",  displayName:"网站名称", field: "b", cellTemplate: " <span class='glyphicon glyphicon-file'></span>" ,maxWidth: ''  },
            {name: "首页代码状态",  displayName:"首页代码状态", field: "b", maxWidth:500},
            {name: "x6", displayName: "",cellTemplate: "<div class='table_admin'>获取代码 <span class='glyphicon glyphicon-file'></span></div>" ,maxWidth:100 },
            {name: "x2", displayName: "",cellTemplate: "<div class='table_admin'>查看网站概览</div>", maxWidth:100 },
            {name: "x3", displayName: "",cellTemplate: "<div class='table_admin'><span class='glyphicon glyphicon-cog'></span>设置</div>", maxWidth:80  },
            {name: "x4", displayName: "",cellTemplate: "<div class='table_admin'>暂停</div>", maxWidth:80 },
            {name: "x5", displayName: "",cellTemplate: "<div class='table_admin'>删除</div>", maxWidth:80 }
        ];

        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 6,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        //
        $scope.dt = new Date();
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            if ($scope.charts[0].config.compare) {
                var time = $rootScope.start;
                if ($scope.compareType == 2) {
                    time = $rootScope.start - 7;
                }
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                var todayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + time + "&end=" + time + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                var lastDayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + (time - 1) + "&end=" + ( time - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                $q.all([todayData, lastDayData]).then(function (res) {
                    var dateStamp = chartUtils.getDateStamp(time);
                    console.log(dateStamp);
                    var final_result = chartUtils.compareTo(res, dateStamp);
                    $scope.charts[0].config.noFormat = "none";
                    $scope.charts[0].config.compare = true;
                    cf.renderChart(final_result, $scope.charts[0].config);
                });
            } else {
                clear.lineChart($scope.charts[0].config, checkedVal);
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                $scope.charts[0].types = checkedVal;
                var chartarray = [$scope.charts[0]];
                requestService.refresh(chartarray);
            }
        }



    });
});
