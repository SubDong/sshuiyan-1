/**
 * Created by perfection on 2015/3/30.
 */
var sharedData;
var shareSiteName = "http://www.best-ad.cn/";
var shareSiteUrl = "";
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('linksctrl', function ($cookieStore, $scope, $rootScope, $http, $modal, $log, requestService, messageService, areaService) {
        $scope.todayClass = true;
        $scope.dt = new Date();
        $scope.dayClass = true;
        $scope.isCollapsed = true;
        if($rootScope.siteUrl!=shareSiteUrl){
            shareSiteName = "http://"+$rootScope.siteUrl+"/";

            shareSiteUrl = shareSiteName;
        }
        $scope.init = function () {
            $scope.links = [];
            $scope.out_data = [];
            $scope.out_site = [];
            var linksData = [];

            //默认对用户其中一个站点进行统计
            $http.get("api/offsitelinks?start=" + $rootScope.start + ",end=" + $rootScope.end + ",name=" + shareSiteName).success(function (result) {
                if (result.length == 0) {
                    linksData = [];
                    $scope.offsitelinks = {
                        name: shareSiteName,
                        rf_pv: 0
                    }
                    $scope.out_site = {
                        ratio: "0%"
                    };
                } else {
                    if (result[0].in_data.length == 0) {
                        $scope.links.push({
                            id: 1,
                            name: null,
                            ratio: null,
                            count: null
                        });
                        $scope.offsitelinks = {
                            name: result[0].targetPathName_pv[0].pathname,
                            rf_pv: result[0].targetPathName_pv[0].pv
                        };
                        for (var i = 0; i < result[0].out_data.length; i++) {
                            $scope.out_data.push({
                                id: i,
                                name: result[0].out_data[i].pathname,
                                ratio: result[0].out_data[i].proportion,
                                count: result[0].out_data[i].pv
                            });
                        }
                        $scope.out_site = {
                            ratio: result[0].out_site[0].proportion
                        };
                    } else {
                        $scope.offsitelinks = {
                            name: result[0].targetPathName_pv[0].pathname,
                            rf_pv: result[0].targetPathName_pv[0].pv
                        };
                        for (var i = 0; i < result[0].in_data.length; i++) {
                            if (result[0].in_data[i].pathname == "-") {
                                result[0].in_data[i].pathname = "直接输入网址"
                            }
                            linksData.push({
                                id: i,
                                name: result[0].in_data[i].pathname,
                                ratio: result[0].in_data[i].proportion,
                                count: result[0].in_data[i].pv
                            });
                        }
                        for (var i = 0; i < result[0].out_data.length; i++) {
                            $scope.out_data.push({
                                id: i,
                                name: result[0].out_data[i].pathname,
                                ratio: result[0].out_data[i].proportion,
                                count: result[0].out_data[i].pv
                            });
                        }
                        $scope.out_site = {
                            ratio: result[0].out_site[0].proportion
                        };
                        $scope.links = linksData;
                    }

                }
                if (result.length != 0) {
                    if (result[0].in_data.length <= 3) {
                        document.getElementById("linkstree_top").style.top = "14%";
                        document.getElementById("linkstree_right").style.top = "14%";
                    }
                    if (result[0].in_data.length == 0) {
                        document.getElementById("linkstree_top").style.top = "0";
                        document.getElementById("linkstree_right").style.top = "0";
                        $(".linkstree_left").css("margin-top", "14px")
                    }
                    if (result[0].in_data.length == 1) {
                        document.getElementById("linkstree_top").style.top = "0";
                        document.getElementById("linkstree_right").style.top = "0";
                        $(".linkstree_left").css("margin-top", "14px")
                    }
                    if (result[0].in_data.length == 4) {
                        document.getElementById("linkstree_top").style.top = "20%";
                        document.getElementById("linkstree_right").style.top = "20%";
                    }
                    if (result[0].in_data.length >= 5) {
                        document.getElementById("linkstree_top").style.top = "35%";
                        document.getElementById("linkstree_right").style.top = "35%";
                    }
                }

            });


        };
        $scope.init();//初始化第一次进该页面默认显示默认网址的当天的数据

        $scope.hoverIn = function () {
            this.hoverEdit = true;
        };
        $scope.hoverOut = function () {
            this.hoverEdit = false;
        };
        $scope.linkstreeIn = function () {
            this.linkstreeEdit = true;
        };
        $scope.linkstreeOut = function () {
            this.linkstreeEdit = false;
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
            $scope.timeClass = false;
        };
        $scope.today = function () {
            $scope.reset();
            $scope.todayCalendar = GetDateStr(0);
            $('#reportrange span').html(GetDateStr(0));
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $scope.init();
        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.todayCalendar = GetDateStr(-1);
            $('#reportrange span').html(GetDateStr(-1));
            $scope.yesterdayClass = true;
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.init();
        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.todayCalendar = GetDateStr(-6);
            $('#reportrange span').html(GetDateStr(-6) + "至" + GetDateStr(0));
            $scope.sevenDayClass = true;
            $rootScope.start = -7;
            $rootScope.end = -1;
            $rootScope.interval = 7;
            $scope.init();

        };
        $scope.month = function () {
            $scope.reset();
            $scope.todayCalendar = GetDateStr(-29);
            $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
            $scope.monthClass = true;
            $rootScope.start = -30;
            $rootScope.end = -1;
            $rootScope.interval = 30;
            $scope.init();

        };
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

        //弹窗
        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;

                    }
                }
            });

        };
        $rootScope.datepickerClick = function (start, end, label) {
            $scope.reset();
            $scope.timeClass = true;
            $rootScope.start = start;
            $rootScope.end = end;
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
        /*      this.identity = angular.identity;*/

        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }

        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
        sharedData = function (monitorPath) {
            shareSiteName = monitorPath;
            $scope.init();
        }
    });

    ctrs.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, $rootScope) {

        $http.get("api/modalInstance?type=" + $rootScope.userType).success(function (result) {
            $("#selected_item").html(shareSiteName);
            if (result.length != 0) {
                $scope.items = result;
            }
        });
        $scope.selected = function (item) {
            $scope.Selected = item.monitorPath;
            $("#selected_item").html(item.monitorPath);
            return;
        }
        $scope.ok = function () {
            var monitorPath = $("#selected_item").html();
            sharedData(monitorPath);
            shareSiteName = monitorPath;
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    });

});
