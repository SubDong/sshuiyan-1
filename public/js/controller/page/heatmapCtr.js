/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    ctrs.controller('heatmapctr', function ($cookieStore, $scope, $state, $http, $rootScope, $stateParams, ngDialog) {
            $scope.selectedIndex = 0;
            $rootScope.start = -1;//时间偏移量开始
            $rootScope.end = -1;//时间偏移量结束
            $scope.heatMapRF = $cookieStore.get("heat_map_rf");

            if (!$scope.heatMapRF) {
                $state.go('pagetitle');
                return;
            }

            $scope.reset = function () {
                $scope.yesterdayClass = false;
                $scope.sevenDayClass = false;
                $scope.monthClass = false;
                $scope.definClass = false;
                $scope.beforeyesterdayClass = false;
                $scope.timeClass = false;
            };

            $scope.init = function () {

                //数据加载框
                $scope.urlDialog = ngDialog.open({
                    template: '<div class="ngdialog-buttons"><ul><li> 数据加载中，请稍后......</li></ul></div>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false,
                    showClose: false,
                    scope: $scope
                });

                var url = "/api/heatmap?start=" + $rootScope.start + "&end=" + $rootScope.end + "&loc=" + $scope.heatMapRF + "&type=4ae166b3563f97e92865ab355a45a78c";

                $http.get(url).success(function (res) {
                    //设置页面浏览量
                    $scope.pv = 100;
                    //设置页面点击量
                    $scope.hits = res.pointArr.length;

                    // 加载热力外部网页
                    $scope.loadHeatmap(res);
                    $scope.loadIframe(res, $scope.heatMapRF, $scope.urlDialog);

                });
            };

            $scope.yesterday = function () {
                $scope.reset();
                $scope.isShowCalendar = false;
                $scope.hiddenSeven = false;
                $scope.todayCalendar = GetDateStr(-1);
                $scope.hourselect = false;
                $scope.dayselect = false;
                $scope.weekselected = true;
                $scope.mothselected = true;
                $scope.lastDaySelect = true;
                $scope.lastWeekSelect = true;
                $scope.clearCompareSelect = true;
                $rootScope.tableTimeStart = -1;
                $rootScope.tableTimeEnd = -1;

                $('#reportrange span').html(GetDateStr(-1));
                $scope.yesterdayClass = true;
                $rootScope.start = -1;
                $rootScope.end = -1;
                $scope.init();
            };

            //获取前天统计数据
            $scope.beforeyesterday = function () {
                $scope.reset();
                $scope.isShowCalendar = false;
                $scope.hiddenSeven = false;
                $scope.todayCalendar = GetDateStr(-2);
                $scope.hourselect = false;
                $scope.dayselect = false;
                $scope.weekselected = true;
                $scope.mothselected = true;
                $scope.lastDaySelect = true;
                $scope.lastWeekSelect = true;
                $scope.clearCompareSelect = true;
                $rootScope.tableTimeStart = -2;
                $rootScope.tableTimeEnd = -2;

                $('#reportrange span').html(GetDateStr(-2));
                $scope.beforeyesterdayClass = true;
                $rootScope.start = -2;
                $rootScope.end = -2;
                $scope.init();
            }
            $scope.sevenDay = function () {
                $scope.reset();
                $scope.isShowCalendar = false;
                $scope.hiddenSeven = true;//今日统计和昨日统计中，点击7、30天时隐藏对比
                $scope.todayCalendar = GetDateStr(-6);
                $scope.hourselect = false;
                $scope.dayselect = false;
                $scope.weekselected = true;
                $scope.mothselected = true;
                $rootScope.tableTimeStart = -7;
                $rootScope.tableTimeEnd = -1;

                $('#reportrange span').html(GetDateStr(-6) + "至" + GetDateStr(0));
                $scope.sevenDayClass = true;
                $rootScope.start = -7;
                $rootScope.end = -1;
                $rootScope.interval = 7;
                $scope.init();
            };
            $scope.month = function () {
                $scope.reset();
                $scope.isShowCalendar = false;
                $scope.hiddenSeven = true;
                $scope.hourselect = false;
                $scope.dayselect = false;
                $scope.weekselected = false;
                $scope.mothselected = true;
                $rootScope.tableTimeStart = -29;
                $rootScope.tableTimeEnd = 0;

                $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
                $scope.monthClass = true;
                $rootScope.start = -30;
                $rootScope.end = -1;
                $rootScope.interval = 30;
                $scope.init();
            };
            $rootScope.datepickerClick = function (start, end, label) {
                $scope.reset();
                $scope.timeClass = true;
                var time = chartUtils.getTimeOffset(start, end);
                $rootScope.start = time[0];
                $rootScope.end = time[1];
                $scope.init();
            };
            $('#reportrange span').html(GetDateStr(0));


            $('#reportrange').daterangepicker({
                format: 'YYYY-MM-DD',
                maxDate: GetDateStr(0),
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
                separator: ' to '
            }, function (start, end, label) {
                $rootScope.datepickerClick(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                $rootScope.startString = (start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'))
                $('#reportrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
            });
            //日历
            this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
            this.type = 'range';

            $scope.yesterday();

            $scope.page_refresh = function () {
                $scope.init();
            }
        }
    );


});
