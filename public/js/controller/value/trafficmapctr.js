/**
 * Created by weiMS on 2015/5/18....
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('trafficmapctr', function ($scope, $rootScope, $modal, $http) {
        $scope.todayClass = true;
        $scope.dt = new Date();
        $scope.dayClass = true;
        $scope.isCollapsed = true;
        $rootScope.start = 0;
        $rootScope.end = 0;

        $scope.init = function(){
            var linkData = [];
            $http.get("api/trafficmap?start=" + $scope.start + ",end=" + $scope.end).success(function (data) {
                console.log(data);
                for(var i = 0; i<data.length;i++){
                    if(data[i].pathName=="-"){
                        data[i].pathName = "直接输入网址或书签";
                    }
                    linkData.push({
                        id:i,
                        name:data[i].pathName,
                        ratio:data[i].uv,
                        count:data[i].pv
                    });
                }
                $scope.links = linkData;
                linkData=[];
            });
        }

        $scope.init();
        $scope.reloadByCalendar = function (type) {
            //console.info("info: now user click the " + type + " button");
            $rootScope.$broadcast("ssh_refresh_charts");
            $rootScope.$broadcast("ssh_dateShow_options_time_change", type);
        };

        $scope.offsitelinks = [
            {
                "id": 1,
                "name": "http://127.0.0.1:8000/#/page/offsitelinks"
            },
            {
                "id": 2,
                "name": "http://127.0.0.1:8000/#/extension/survey"
            },
        ]
        $scope.hoverIn = function () {
            this.hoverEdit = true;
        };
        $scope.hoverOut = function () {
            this.hoverEdit = false;
        };
        $scope.weblink = function () {
            $scope.isCollapsed = true
            $scope.offsitelinks = offsitelink.value;

        }
        $scope.timeselect = true;
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
        };
        $scope.today = function () {
            $scope.reset();
            $scope.isShowCalendar = false;
            $scope.hiddenSeven = false;
            $scope.todayCalendar = GetDateStr(0);
            $scope.hourselect = false;
            $scope.dayselect = false;
            $scope.weekselected = true;
            $scope.mothselected = true;
            $scope.reset();
            $scope.lastDaySelect = true;
            $scope.lastWeekSelect = true;
            $scope.clearCompareSelect = true;
            // table 参数配置
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.keyFormat = "hour";
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $scope.init();
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
            $scope.reloadByCalendar("yesterday");
            $('#reportrange span').html(GetDateStr(-1));
            $scope.yesterdayClass = true;
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.init();
        };
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
            $scope.reloadByCalendar("seven");
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
            $scope.reloadByCalendar("month");
            $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
            $scope.monthClass = true;
            $rootScope.start = -30;
            $rootScope.end = -1;
            $rootScope.interval = 30;
            $scope.init();
        };
        $scope.timeclick = function () {
            $scope.isShowCalendar = false;
            $scope.hiddenSeven = true;
            $scope.reset();
            $scope.timeClass = true;
            $('#reportrange span').html(GetDateStr(0))
        }
        $scope.open = function ($event) {
            $scope.opened = true;
            $scope.reset();
            $scope.definClass = true;
        };

        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;

        };
        $scope.daycheck = function () {
            $scope.hourcheckClass = false;
            $scope.dayClass = true;
            $scope.timeselect = true;

            $scope.today();
        };
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
        }
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
        //index select
        //弹窗

        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

        };
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        this.type = 'range';
        /*      this.identity = angular.identity;*/

        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }
    });

    ctrs.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

});
