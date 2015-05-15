/**
 * Created by john on 2015/3/30.
 */
app.controller("SearchPromotion", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL) {
    $scope.todayClass = true;
    var user = "jiehun";
    var baiduAccount = "baidu-bjjiehun2123585";
    var semAdimension = "keyword";
    var esType = "2";

    //sem
    $scope.target = [
        {consumption_name: "展现量", name: "impression"},
        {consumption_name: "点击量", name: "click"},
        {consumption_name: "消费", name: "cost"},
        {consumption_name: "点击率", name: "ctr"},
        {consumption_name: "平均点击价格", name: "cpc"}
    ];
    //
    $scope.Webbased = [
        {consumption_name: "浏览量(PV)", name: "pv"},
        {consumption_name: "访问次数", name: "vc"},
        {consumption_name: "访客数(UV)", name: "uv"},
        {consumption_name: "新访客数", name: "nuv"},
        {consumption_name: "新访客比率", name: "nuvRate"},
        //{consumption_name: "页头访问次数", name: "o1"}
    ];
    $scope.flow = [
        {consumption_name: "跳出率", name: "outRate"},
        {consumption_name: "平均访问时长", name: "avgTime"},
        {consumption_name: "平均访问页数", name: "avgPage"},
        {consumption_name: "抵达率", name: "arrivedRate"},
    ];

    var getHtmlTableData = function () {
        $http({
            method: 'GET',
            url: '/api/realTimeAccess/?filerInfo=' + $rootScope.tableSwitch.tableFilter + "&type=" + esType
        }).success(function (data, status) {
            console.log(data)
            $scope.gridOptions.data = data;
        }).error(function (error) {
            console.log(error);
        });
    };

    if ($scope.tableSwitch.arrayClear)$rootScope.searchCheckedArray = new Array();
    if ($scope.tableSwitch.arrayClear)$rootScope.searchGridArray = new Array();


    $rootScope.searchIndicators = function (item, entities, number, refresh) {
        $rootScope.searchGridArray.shift();
        if (refresh == "refresh") {
            $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
            return
        }
        $rootScope.tableSwitch.number != 0 ? $scope.searchGridArray.shift() : "";
        $scope.searchGridObj = {};
        $scope.searchGridObjButton = {};
        var a = $rootScope.searchCheckedArray.indexOf(item.name);
        if (a != -1) {
            $rootScope.searchCheckedArray.splice(a, 1);
            $rootScope.searchGridArray.splice(a, 1);

            if ($rootScope.tableSwitch.number != 0) {
                $scope.searchGridObjButton["name"] = " ";
                $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                $rootScope.searchGridArray.unshift($scope.searchGridObjButton);
            }
            $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
        } else {
            if ($rootScope.searchCheckedArray.length >= number) {
                $rootScope.searchCheckedArray.shift();
                $rootScope.searchCheckedArray.push(item.name);
                $rootScope.searchGridArray.shift();

                $scope.searchGridObj["name"] = item.consumption_name;
                $scope.searchGridObj["displayName"] = item.consumption_name;
                $scope.searchGridObj["field"] = item.name;

                $rootScope.searchGridArray.push($scope.searchGridObj);

                if ($rootScope.tableSwitch.number != 0) {
                    $scope.searchGridObjButton["name"] = " ";
                    $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                    $rootScope.searchGridArray.unshift($scope.searchGridObjButton);
                }

                $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
            } else {
                $rootScope.searchCheckedArray.push(item.name);

                $scope.searchGridObj["name"] = item.consumption_name;
                $scope.searchGridObj["displayName"] = item.consumption_name;
                $scope.searchGridObj["field"] = item.name;
                $rootScope.searchGridArray.push($scope.searchGridObj);

                if ($rootScope.tableSwitch.number != 0) {
                    $scope.searchGridObjButton["name"] = " ";
                    $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                    $rootScope.searchGridArray.unshift($scope.searchGridObjButton);
                }
                $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
            }
        }
        angular.forEach(entities, function (subscription, index) {
            if (subscription.name == item.name) {
                $scope.classInfo = 'current';
            }
        });
    };
    // 推广概况表格配置项

    $scope.gridOptions = {
        //paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
        expandableRowHeight: 360,
        enableColumnMenus: false,
        enablePaginationControls: false,
        enableSorting: true,
        enableGridMenu: false,
        enableHorizontalScrollbar: 0,
        columnDefs: $scope.searchGridArray,
        onRegisterApi: function (gridApi) {
            $scope.gridApi2 = gridApi;
            if ($rootScope.tableSwitch.dimen) {
                griApiInfo(gridApi);
            }
        }
    };

    $rootScope.targetSearchSpread = function (isClicked) {
        if (isClicked) {
            $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.searchCheckedArray);
        }
        $http({
            method: 'GET',
            url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.searchCheckedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
            + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo="+$rootScope.tableFormat+"&type=" + esType
        }).success(function (data, status) {
            console.log(data);
            $scope.gridOptions.data = data;
                /*var url = SEM_API_URL + user + "/" + baiduAccount + "/"+ semAdimension+"/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1"
                $http({
                    method: 'GET',
                    url: url
                }).success(function (dataSEM, status) {

                });*/

        }).error(function (error) {
            console.log(error);
        });
    }

    //init
    $rootScope.targetSearchSpread()

    //表格数据展开项
    var griApiInfo = function (gridApi) {
        gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {

        });
    };
    //得到数据中的url
    $scope.getDataUrlInfo = function (grid, row, number) {
        var a = row.entity.source.split(",");
        if (number == 1) {
            return a[0];
        } else if (number == 2) {
            return a[1];
        }
    }


});


/**********************隐藏table中按钮的弹出层*******************************/
var s = 0;
function getMyButton(item) {
    var a = document.getElementsByClassName("table_win");
    theDisplay(a);
    item.nextSibling.style.display = "block";
    s = 0
}
function theDisplay(a) {
    for (var i = 0; i < a.length; i++) {
        if (document.getElementsByClassName("table_win")[i].style.display == "block") {
            document.getElementsByClassName("table_win")[i].style.display = "none";
        }
    }
}
document.onclick = function () {
    var a = document.getElementsByClassName("table_win");
    if (a.length != 0) {
        if (s > 0) {
            theDisplay(a);
            s = 0
        }
        s++
    }
};
/*******************************************************************/
