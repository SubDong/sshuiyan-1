/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller("externallinksctr", function ($scope, $rootScope, $http,$cookieStore, requestService, messageService, areaService, uiGridConstants) {
        $scope.todayClass = true;
//        高级搜索提示
        $scope.exTerminalSearch = "";
        $scope.webTypeSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeTerminalSearch = function (obj) {
            $rootScope.$broadcast("ExLoadAllTerminal");
            obj.exTerminalSearch = "";
        }
        $scope.removeWebTypeSearch = function (obj) {
            $rootScope.$broadcast("ExLoadAllWeb");
            obj.webTypeSearch = "";
        }
        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = "[{\"entrance\":\"1\"}]";
        //配置默认指标
        $rootScope.checkedArray = ["uv", "nuv", "nuvRate"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "外部连接",
                displayName: "外部连接",
                field: "rf",
                cellTemplate: '<a href="{{row.entity.rf}}" title="{{row.entity.rf}}" target="_blank" style="color:#0965b8;line-height:30px; display:block; padding:0 10px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;}">{{row.entity.rf}}</a></div>',
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                cellTooltip: function (row, col) {
                    return row.entity.rf;
                },
                enableSorting: false
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history7' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='javascript:void(0)' ng-click='grid.appScope.showEntryPageLink(row)'>查看入口页链接</a></li></ul></div></div>",
                enableSorting: false
            },
            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "新访客数",
                displayName: "新访客数",
                field: "nuv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "新访客比率",
                displayName: "新访客比率",
                field: "nuvRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "外部连接", displayName: "外部连接", field: "rf"},
            tableFilter: "[{\"rf_type\": [\"3\"]}]",
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ui-sref='history7' ng-click='grid.appScope.getHistoricalTrend(this)'>查看历史趋势</a></li><li><a href='javascript:void(0)' ng-click='grid.appScope.showEntryPageLink(this)'>查看入口页链接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            isJudge: false //是否清空filter 默认为清空
        };

        //

        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            $scope.charts[1].config.instance = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].types = checkedVal;
            var chartArray = [$scope.charts[1]];
            requestService.refresh(chartArray);
        }
        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var tmpData = [];
            json.forEach(function (e) {
                e.key.forEach(function (item) {
                    tmpData.push(chartUtils.getLinked(item));
                });
                e.key = tmpData;
            });
            cf.renderChart(json, config);
        }
        $scope.externalinkFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var times = [$rootScope.start, $rootScope.end];
            var specialResult = chartUtils.getRf_type(json, times, "serverLabel", e.types, config, 3);
            var result = specialResult[0];
            result.forEach(function (item) {
                var _thisCount = 0;
                item.quota.forEach(function (q) {
                    _thisCount += Number(q);
                });
                item["totalCount"] = _thisCount;
            })
            result.sort(chartUtils.by("totalCount"));
            config['noFormat'] = true;//告知chart工厂无须格式化json，可以直接使用data对象
            config['twoYz'] = "none";
            cf.renderChart(result, config);
            //渲染pie图
            var pieData = chartUtils.getEnginePie(specialResult[1], null, e);
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            //$scope.charts[0].config.instance.on("hover", $scope.pieListener);
            cf.renderChart(pieData, $scope.charts[0].config);
            var firstCount = 0;
            pieData.forEach(function (i) {
                i.quota.forEach(function (q) {
                    firstCount += q;
                });
            });
            if (firstCount) {
                $(".chart_box").attr("style", "background:" + $rootScope.chartColors[0]);
                var name=pieData[0].key[0]
                $("#chartlink").html(name.length > 30 ? name.substring(0, 30) + "..." + name.substring(name.length - 10, name.length) : name);
                $("#chartnumber").html(pieData[0].quota[0]);
                $("#chartpointe").html(parseFloat(pieData[0].quota[0] / firstCount * 100).toFixed(2) + "%");
            }
            $("#chartname").html(chartUtils.convertChinese(e.types[0]));
        }
        $scope.extPieHover = function (params, type) {
            if (params.dataIndex != -1) {
                var colorIndex = Number(params.dataIndex);
                $(".chart_box").attr("style", "background:" + $rootScope.chartColors[colorIndex]);
                $("#chartlink").html(params.name.length > 30 ? "<a href='"+params.name+"' target='_blank'>"+params.name.substring(0, 30) + "..." + params.name.substring(params.name.length - 10, params.name.length) +"</a>": "<a href='"+params.name+"' target='_blank'>"+params.name+"</a>");
                $("#chartname").html(chartUtils.convertChinese(type));
                $("#chartnumber").html(params.data.value);
                $("#chartpointe").html(params.special + "%");
            }
        }
        $scope.itemHover = function (params, typeTotal, allTotal) {
            var type = chartUtils.convertChinese($scope.charts[1].types.toString())
            $(".chart_box").attr("style", "background:" + $rootScope.chartColors[params.seriesIndex]);
            $("#chartlink").html(params[0]);
            $("#chartname").html(type);
            $("#chartnumber").html(typeTotal);
            $("#chartpointe").html(parseFloat(typeTotal / allTotal * 100).toFixed(2) + "%");
            var xName = params[1].toString();
            var res = '<li>' + type + '</li>';
            if ($rootScope.start - $rootScope.end == 0) {
                res += '<li>' + xName + ':00-' + xName + ':59</li>';
            } else {
                res += '<li>' + xName + '</li>';
            }
            res += '<li  class=chartstyle' + params.seriesIndex + '>外部链接：' + params[2] + '</li>';
            return res;
        }
        $scope.charts = [
            {
                config: {
                    legendData: ["外部链接", "直接访问", "搜索引擎"],
                    id: "sourse_charts",
                    //pieStyle: true,
                    serieName: "访问情况",
                    chartType: "pie",
                    dataKey: "key",
                    dataValue: "quota",
                    onHover: $scope.extPieHover
                },
                types: ["pv"],
                dimension: ["rf"],
                filter: '[{\"rf_type\":[3]}]',
                topN: [-2, 5],
                url: "/api/map",
                cb: $scope.pieFormat
            },
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 1,
                    //min_max: false,
                    bGap: false,
                    id: "indicators_charts",
                    chartType: "line",
                    lineType: false,
                    // auotHidex: true,
                    //qingXie:true,
                    qxv: 18,
                    // tt: "item",
                    itemHover: $scope.itemHover,
                    dataKey: "key",
                    keyFormat: "none",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["period,rf"],
                filter: '[{\"rf_type\":[3]}]',
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.externalinkFormat
            }
        ];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            util.renderLegend(chart, $scope.charts[1].config);
            var arrayChart = [$scope.charts[1]];
            requestService.refresh(arrayChart);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            var arrayChart = [$scope.charts[1]];
            requestService.refresh(arrayChart);
        });
        //日历
        $scope.dateClosed = function () {
            $rootScope.start = $scope.startOffset;
            $rootScope.end = $scope.endOffset;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            })
            if ($rootScope.start <= -1) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            requestService.refresh($scope.charts);
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = $scope.startOffset;
            $rootScope.tableTimeEnd = $scope.endOffset;
            $scope.$broadcast("ssh_dateShow_options_time_change");
        };
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.keyFormat = "day";
            $scope.charts[1].config.instance = chart;
            var arrayChart = [$scope.charts[1]];

            requestService.refresh(arrayChart);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
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
//            //图表
//            requestService.refresh($scope.charts);
            $scope.reloadByCalendar("yesterday");
            $('#reportrange span').html(GetDateStr(-1));
            //其他页面表格
//            $rootScope.targetSearch();
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };

        $rootScope.initMailData = function () {
            $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[7] + "").success(function (result) {
                if (result) {
                    var ele = $("ul[name='sen_form']");
                    formUtils.rendererMailData(result, ele);
                }
            });
        };

        $scope.sendConfig = function () {
            var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
            var result = formUtils.validateEmail(formData.mail_address, formData);
            if (result.ec) {
                alert(result.info);
            } else {
                formData.rule_url = $rootScope.mailUrl[7];
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
        };

        // 构建PDF数据
        $scope.generatePDFMakeData = function (cb) {
            var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
            var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
            var _tableBody = $rootScope.getPDFTableBody(dataInfo, dataHeadInfo);
            var docDefinition = {
                header: {
                    text: "External Links data report",
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
