/**
 * Created by ss on 2015/6/23.
 */
define(["./module"], function (ctrs) {

    'use strict';
    ctrs.controller('changelistctr', function ($scope, $rootScope, $q, $http, $cookieStore, requestService, messageService, areaService, uiGridConstants, popupService) {
            //初始化时间
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.contrastStart = -1;
            $rootScope.contrastEnd = -1;
            $rootScope.startString = GetDateStr(0);
            $rootScope.contrastStartString = GetDateStr(-1);
            $scope.initTime = {
                time: GetDateStr(0),
                contrastTime: GetDateStr(-1)
            };

            $scope.timeClass = true;
            $scope.choiceClass = true;
            $scope.yesterdayClass = false;
            $scope.lastWeek = true;
            $scope.lastMonth = true;
            $scope.visible = true;
            $scope.send = true;//显示发送
            $scope.dateshows = true;
            $scope.lastDayClass = false;
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "来源域名",
                    displayName: "来源域名",
                    field: "pathName",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                {
                    name: "浏览量(PV)",
                    displayName: "",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    }
                },
                {
                    name: "访问次数",
                    displayName: "",
                    field: "contrastPv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: " ",
                    displayName: "变化情况",
                    headerCellTemplate: '<div class="change_list">' +
                    '<a href="javascript:void(0)" class="rise">+升</a>' +
                    '<a href="javascript:void(0)" class="descend">-降</a>' +
                    '<a href="javascript:void(0)" class="flat">平</a>' +
                    '<a href="javascript:void(0)" class="all">全部</a>' +
                    '</div>',
                    field: "percentage",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                    enableSorting: false
                }
            ];
            //alert($rootScope.contrastStartString)
            $scope.showSearchUrl = function (row) {
                popupService.showSourceData(row.entity.kw);
            };
            $rootScope.tableSwitch = {
                latitude: {name: "搜索词", displayName: "搜索词", field: "kw"},
                tableFilter: null,
                dimen: false,
                // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                number: 2,
                //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                coding: "<li><a>查看相关热门搜索词</a></li>" +
                "<li><a ng-click='grid.appScope.showSearchUrl()'>查看搜索来路URL</a></li>" +
                "<li><a ui-sref='history6' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent'>查看历史趋势</a></li>",
                //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
                arrayClear: false //是否清空指标array
            };
            $scope.$on("Ctr1NameChange", function (event, msg) {
                $rootScope.gridArray[2].displayName = $rootScope.startString;
                $rootScope.gridArray[3].displayName = $rootScope.contrastStartString;
                $scope.$broadcast("parrentData", {
                    start: $rootScope.start,
                    end: $rootScope.end,
                    contrastStart: $rootScope.contrastStart,
                    contrastEnd: $rootScope.contrastEnd,
                    gridArray: $rootScope.gridArray
                });
            });

            function GetDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期
                var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
                return y + "-" + m + "-" + d;
            }

            $rootScope.datepickerClick1 = function (start, end, flag) {
                var time = chartUtils.getTimeOffset(start, end);
                if (flag) {
                    $rootScope.start = time[0];
                    $rootScope.end = time[1];
                } else {
                    $rootScope.contrastStart = time[0];
                    $rootScope.contrastEnd = time[1];
                }
            };
            $('#choicetrange span').html(GetDateStr(-1));
            $('#choicetrange').daterangepicker({
                format: 'YYYY-MM-DD',
                maxDate: GetDateStr(0),
                minDate: GetDateStr(-43),
                showDropdowns: true,
                showWeekNumbers: false,
                timePicker: false,
                //timePickerIncrement: 1,
                timePicker12Hour: false,
                opens: 'left',
                drops: 'down',
                timeZone: true,
                buttonClasses: ['btn', 'btn-sm'],
                applyClass: 'btn-primary',
                cancelClass: 'btn-default',
                separator: ' to ',
                singleDatePicker: true
            }, function (start, end, label) {
                $rootScope.datepickerClick1(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), false);
                $rootScope.contrastStartString = (start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));

                if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
                    $('#choicetrange span').html(start.format('YYYY-MM-DD'));
                    $rootScope.contrastStartString = (start.format('YYYY-MM-DD'));
                }
                else {
                    $('#choicetrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                }
            });
            $('#reportrange span').html(GetDateStr(0));
            $('#reportrange').daterangepicker({
                format: 'YYYY-MM-DD',
                maxDate: GetDateStr(0),
                minDate: GetDateStr(-43),
                showDropdowns: true,
                showWeekNumbers: false,
                timePicker: false,
                //timePickerIncrement: 1,
                timePicker12Hour: false,
                opens: 'left',
                drops: 'down',
                timeZone: true,
                buttonClasses: ['btn', 'btn-sm'],
                applyClass: 'btn-primary',
                cancelClass: 'btn-default',
                separator: ' to ',
                singleDatePicker: true
            }, function (start, end, label) {
                $rootScope.datepickerClick1(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), true);
                $rootScope.startString = (start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));

                if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
                    $('#reportrange span').html(start.format('YYYY-MM-DD'));
                    $rootScope.startString = (start.format('YYYY-MM-DD'));
                }
                else {
                    $('#reportrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                }
            });
            $scope.reloadByCalendar = function (type) {
                //console.info("info: now user click the " + type + " button");
                $rootScope.$broadcast("ssh_refresh_charts");
                $rootScope.$broadcast("ssh_dateShow_options_time_change", type);
            };
            $scope.yesterday = function () {
                $scope.yesterdayClass = true;
                $scope.timeClass = false;
                $rootScope.tableTimeStart = -1;
                $rootScope.tableTimeEnd = -1;
                $rootScope.start = -1;
                $rootScope.end = -1;
                $rootScope.startString = GetDateStr(-1);
                $('#reportrange span').html(GetDateStr(-1));
                $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(-1));
                $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(-1));
            };
            $scope.timeClick = function () {
                $scope.isShowCalendar = false;
                $scope.hiddenSeven = true;
                $scope.reset();
                $scope.timeClass = true;
            };
            function contrastReset() {
                $scope.lastDayClass = false;
                $scope.lastWeekClass = false;
                $scope.choiceClass = false;
            }

            $scope.lastDay = function () {
                $rootScope.contrastStart = $rootScope.start - 1;
                $rootScope.contrastEnd = $rootScope.end - 1;
                contrastReset();
                $scope.lastDayClass = true;
                $rootScope.contrastStartString = GetDateStr($rootScope.start - 1);
                $('#choicetrange span').html(GetDateStr($rootScope.start - 1));
                $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr($rootScope.start - 1));
                $('#choicetrange').data('daterangepicker').setEndDate($rootScope.end - 1);
            };
            $scope.lastWeek = function () {
                $rootScope.contrastStart = $rootScope.start - 7;
                $rootScope.contrastEnd = $rootScope.end - 7;
                contrastReset();
                $scope.lastWeekClass = true;
                $rootScope.contrastStartString = GetDateStr($rootScope.start - 7);
                $('#choicetrange span').html(GetDateStr($rootScope.start - 7));
                $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr($rootScope.start - 7));
                $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr($rootScope.end - 7));
            };
            $scope.contrastTimeClick = function () {
                contrastReset();
                $scope.choiceClass = true;
            };
            $scope.changeTime = function () {
                $scope.initTime = {
                    time: $rootScope.startString,
                    contrastTime: $rootScope.contrastStartString
                };
                $rootScope.gridArray[2].displayName = $rootScope.startString;
                $rootScope.gridArray[3].displayName = $rootScope.contrastStartString;
                $scope.$broadcast("parrentData", {
                    start: $rootScope.start,
                    end: $rootScope.end,
                    contrastStart: $rootScope.contrastStart,
                    contrastEnd: $rootScope.contrastEnd,
                    gridArray: $rootScope.gridArray
                });
            };
            //刷新
            $scope.page_refresh = function () {
                $rootScope.start = 0;
                $rootScope.end = 0;
                $rootScope.tableTimeStart = -1;
                $rootScope.tableTimeEnd = -1;
                $scope.timeClass = true;
                $scope.choiceClass = true;
                $scope.lastDayClass = false;
                $scope.lastWeekClass = false;
                $('#reportrange span').html(GetDateStr(0));
                $('#choicetrange span').html(GetDateStr(-1));
                $rootScope.startString = GetDateStr(0);
                $rootScope.contrastStartString = GetDateStr(-1);
                $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(0));
                $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(0));
                $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr(-1));
                $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr(-1));
                $scope.reset();
                $scope.changeTime();
            };

            $scope.reset = function () {
                $scope.timeClass = true;
                $scope.choiceClass = true;
                $scope.lastDayClass = false;
                $scope.lastWeekClass = false;
                $scope.yesterdayClass = false;
            };

            $rootScope.initMailData = function () {
                console.log($rootScope.mailUrl[10]);
                $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[10] + "").success(function (result) {
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
                    formData.rule_url = $rootScope.mailUrl[10];
                    formData.uid = $cookieStore.get('uid');
                    formData.site_id = $rootScope.siteId;
                    formData.type_id = $rootScope.userType;
                    formData.schedule_date = $scope.mytime.time.Format('hh:mm');
                    formData.start = $rootScope.start + "";
                    formData.end = $rootScope.end + "";
                    formData.startString = $rootScope.startString;
                    formData.contrastStart = $rootScope.contrastStart + "";
                    formData.contrastEnd = $rootScope.contrastEnd + "";
                    formData.contrastStartString = $rootScope.contrastStartString;
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
        }
    );

});
