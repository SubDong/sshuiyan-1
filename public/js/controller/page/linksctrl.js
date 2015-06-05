/**
 * Created by john on 2015/3/30.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('linksctrl', function ($cookieStore,$scope, $rootScope, $http, $modal, $log, requestService, messageService, areaService) {
        $scope.todayClass = true;
        $scope.dt = new Date();
        $scope.dayClass = true;
        $scope.isCollapsed = true;
        //获取站点
        $scope.usites = $cookieStore.get('usites');
        $scope.sites = [];
        $scope.usites.forEach(function (item, i) {
            $scope.sites.push({
                name: item.site_name,
                id: item.site_id
            });
        });
        var initSiteName = "http://" + $scope.sites[0].name+"/";
        $scope.init = function () {
            $scope.links = [];
            $scope.out_data = [];
            $scope.out_site = [];
            var linksData = [];
            //默认对用户其中一个站点进行统计
            $http.get("api/offsitelinks?start=" + $rootScope.start + ",end=" + $rootScope.end + ",name=" + initSiteName).success(function (result) {
                if(result==null){
                    linksData = [];
                    $scope.offsitelinks = {
                        name: initSiteName,
                        rf_pv: 0
                    }
                }else{
                    console.log(result);
                    $scope.offsitelinks = {
                        name: result[0].targetPathName_pv[0].pathname,
                        rf_pv: result[0].targetPathName_pv[0].pv
                    }
                    console.log(result[0].in_data.length);
                    for (var i = 0; i < result[0].in_data.length; i++) {
                        linksData.push({
                            id: i,
                            name: result[0].in_data[i].pathname,
                            ratio: result[0].in_data[i].proportion,
                            count: result[0].in_data[i].pv
                        });
                    }
                    for(var i = 0;i<result[0].out_data.length;i++){
                        $scope.out_data.push({
                            id: i,
                            name: result[0].out_data[i].pathname,
                            ratio: result[0].out_data[i].proportion,
                            count: result[0].out_data[i].pv
                        });
                    }
                    $scope.out_site ={
                        ratio:result[0].out_site[0].proportion
                    };
                    console.log($scope.out_site)
                    $scope.links = linksData;
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
        };
        $scope.today = function () {
            $scope.reset();
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $scope.init();
        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.init();
        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.sevenDayClass = true;
            $rootScope.start = -7;
            $rootScope.end = -1;
            $rootScope.interval = 7;
            $scope.init();

        };
        $scope.month = function () {
            $scope.reset();
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
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
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
