/**
 * Created by SubDong on 2015/4/23.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('indexoverview', function ($scope, $rootScope, $cookieStore, $http, areaService, uiGridConstants) {
        $scope.allBrowsers = angular.copy($rootScope.browsers);
        //        高级搜索提示
        $scope.sourceSearch = "";
        $scope.visitorSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function (obj) {
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeVisitorSearch = function (obj) {
            $rootScope.$broadcast("loadAllVisitor");
            obj.visitorSearch = "";
        }
        $scope.todayClass = true;
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        $scope.souce.selected = {"name": "全部"};
        $scope.browser.selected = {"name": "全部"};
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "entrance"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "页面url",
                displayName: "页面url",
                field: "loc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                cellTooltip: function (row, col) {
                    return row.entity.loc;
                },
                enableSorting: false
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history3\")' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>",
                enableSorting: false
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "入口页次数",
                displayName: "入口页次数",
                field: "entrance",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "页面url", displayName: "页面url", field: "loc"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
        });
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
            //图表
//            requestService.refresh($scope.charts);
            //首页表格
            //requestService.gridRefresh(scope.grids);
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //其他页面表格
//            $rootScope.targetSearch();
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };

        $rootScope.initMailData = function () {
            $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[8] + "").success(function (result) {
                if (result) {
                    var ele = $("ul[name='sen_form']");
                    formUtils.rendererMailData(result, ele);
                }
            });
        }
        $scope.sendConfig = function () {
            var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
            var result = formUtils.validateEmail(formData.mail_address, formData);
            if (result.ec) {
                alert(result.info);
            } else {
                formData.rule_url = $rootScope.mailUrl[8];
                formData.uid = $cookieStore.get('uid');
                formData.site_id = $rootScope.siteId;
                formData.type_id = $rootScope.userType;
                formData.schedule_date = $scope.mytime.time.Format('hh:mm');
                $http.get("api/saveMailConfig?data=" + JSON.stringify(formData)).success(function (data) {
                    var result = JSON.parse(eval("(" + data + ")").toString());
                    if (result.ok == 1) {
                        alert("操作成功!");
                        $http.get("/api/initSchedule");
                    } else {
                        alert("操作失败!");
                    }
                });
            }
        }

        //删除配置信息
        $scope.deleteConfig = function () {
            var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
            var result = formUtils.validateEmail(formData.mail_address, formData);
            if (result.ec) {
                alert(result.info);
            } else {
                formData.rule_url = $rootScope.mailUrl[8];
                formData.uid = $cookieStore.get('uid');
                formData.site_id = $rootScope.siteId;
                formData.type_id = $rootScope.userType;

                $http.get("api/deleteMailConfig?data=" + JSON.stringify(formData)).success(function (data) {
                    var result = JSON.parse(eval("(" + data + ")").toString());
                    if (result.ok == 1) {
                        alert("操作成功!");
                        $http.get("api/initSchedule").success(function (result) {
                            if (result) {
                                var ele = $("ul[name='sen_form']");
                                formUtils.initData(ele);
                            }
                        });
                    } else {
                        alert("操作失败!");
                    }
                });
            }
        };

        // 构建PDF数据
        $scope.generatePDFMakeData = function (cb) {
            var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
            var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
            var _tableBody = $rootScope.getPDFTableBody(dataInfo, dataHeadInfo);
            var docDefinition = {
                header: {
                    text: "Access Page - Summary Indicators Data Report",
                    style: "header",
                    alignment: 'center'
                },
                content: [
                    {
                        table: {
                            headerRows: 1,
                            body: _tableBody
                        }
                    },
                    {text: '\nPower by www.best-ad.cn', style: 'header'},
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        fontName: "标宋",
                        alignment: 'justify',
                        bold: true
                    }
                }
            };
            cb(docDefinition);
        };


    });

});
