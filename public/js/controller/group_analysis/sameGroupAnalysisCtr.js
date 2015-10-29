/**
 * Created by ss on 2015/9/24.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('sameGroupAnalysisCtr', function ($scope, $rootScope, $q, $http, requestService, areaService, $location, uiGridConstants) {

        var option;
        $scope.groupTypes = [
            {name: '流量获取日期', field: 'date'}
        ];
        $scope.groupScales = [
            {name: '按天', field: 'day'},
            {name: '按周', field: 'week'},
            {name: '按月', field: 'month'}
        ];
        $scope.dateRanges = [
            {name: '过去7天', field: '7'},
            {name: '过去14天', field: '14'},
            {name: '过去21天', field: '21'},
            {name: '过去30天', field: '30'}
        ];
        $scope.groupIndexs = [
            {name: '用户数', field: 'visitor'},
            {name: '用户留存率', field: 'retentionRate'},
            {name: '浏览量', field: 'pv'}
        ];
        $scope.groupType = {};
        $scope.groupScale = {};
        $scope.dateRange = {};
        $scope.groupIndex = {};
        $scope.groupType.selected = {"name": "流量获取日期", "field": "date"};
        $scope.groupScale.selected = {"name": "按天", "field": "day"};
        $scope.dateRange.selected = {"name": "过去7天", "field": "7"};
        $scope.groupIndex.selected = {"name": "用户数", "field": "visitor"};


        $scope.scaleChange = function (val) {
            if (val.name == "按天") {
                $scope.groupScale.selected.field = "day";
                $scope.dateRange.selected = {"name": "过去7天", "field": "7"};
                $scope.dateRanges = [
                    {name: '过去7天', field: '7'},
                    {name: '过去14天', field: '14'},
                    {name: '过去21天', field: '21'},
                    {name: '过去30天', field: '30'}
                ];
                $scope.tables = [
                    {name: "第0天"},
                    {name: "第1天"},
                    {name: "第2天"},
                    {name: "第3天"},
                    {name: "第4天"},
                    {name: "第5天"},
                    {name: "第6天"},
                    {name: "第7天"},
                    {name: "第8天"},
                    {name: "第9天"},
                    {name: "第10天"},
                    {name: "第11天"},
                    {name: "第12天"}
                ];
            } else if (val.name == "按周") {
                $scope.groupScale.selected.field = "week";
                $scope.dateRange.selected = {"name": "上周", "field": "1"};
                $scope.dateRanges = [
                    {name: '上周', field: '1'},
                    {name: '过去3周', field: '3'},
                    {name: '过去6周', field: '6'},
                    {name: '过去9周', field: '9'},
                    {name: '过去12周', field: '12'}
                ];
                $scope.tables = [
                    {name: "第0周"},
                    {name: "第1周"},
                    {name: "第2周"},
                    {name: "第3周"},
                    {name: "第4周"},
                    {name: "第5周"},
                    {name: "第6周"},
                    {name: "第7周"},
                    {name: "第8周"},
                    {name: "第9周"},
                    {name: "第10周"},
                    {name: "第11周"},
                    {name: "第12周"}
                ];
            } else if (val.name == "按月") {
                $scope.groupScale.selected.field = "month";
                $scope.dateRange.selected = {"name": "上月", "field": "1"};
                $scope.dateRanges = [
                    {name: '上月', field: '1'},
                    {name: '过去2个月', field: '2'},
                    {name: '过去3个月', field: '3'}
                ];
                $scope.tables = [
                    {name: "第0月"},
                    {name: "第1月"},
                    {name: "第2月"},
                    {name: "第3月"},
                    {name: "第4月"},
                    {name: "第5月"},
                    {name: "第6月"},
                    {name: "第7月"},
                    {name: "第8月"},
                    {name: "第9月"},
                    {name: "第10月"},
                    {name: "第11月"},
                    {name: "第12月"}
                ];
            }
        }


        $scope.dateChange = function (val) {
            $scope.dateRange.selected = val;
        }
        /*当含有‘率’的时候纵轴含有百分号*/
        $scope.retentionRate = false;
        $scope.indexChange = function (val) {
            if (val.name == '用户留存率') {
                $scope.retentionRate = true;
            } else {
                $scope.retentionRate = false;
            }
            $scope.groupIndex.selected = val;
        }
        $scope.tables = {

        }
        /*table数据中表头*/
        $scope.tables = [
            {name: "第0天"},
            {name: "第1天"},
            {name: "第2天"},
            {name: "第3天"},
            {name: "第4天"},
            {name: "第5天"},
            {name: "第6天"},
            {name: "第7天"},
            {name: "第8天"},
            {name: "第9天"},
            {name: "第10天"},
            {name: "第11天"},
            {name: "第12天"}
        ];


        $scope.perToNum = function (x) {
            if (x != undefined) {
                return Number(x.replace('%', '')) / 100;
            }
        };

        $scope.init = function () {

            var xAxisData = [];
            var seriesData = [];
            var myChart = echarts.init(document.getElementById('myChart'));


            if($scope.groupTableDataes == null || $scope.groupTableDataes.length <= 0 ) {
                myChart = null;
                return;
            }

            angular.forEach($scope.tables, function (data, index, array) {
                xAxisData.push(data.name);
            });

            /*为了每行中每列达到12*/
            angular.forEach($scope.groupTableDataes, function (data, index, array) {
                var tdLength = data.gaResultTdDatas.length;
                if (tdLength < 12) {
                    for (var i = 0; i < 12 - tdLength; i++) {
                        data.gaResultTdDatas.push({});
                    }
                }
            })

            var groupTableDatas = $scope.groupTableDataes[0];

            if (groupTableDatas != null && groupTableDatas != undefined) {
                if ($scope.groupIndex.selected.field == 'retentionRate') {
                    seriesData.push($scope.perToNum(groupTableDatas.data));

                } else {
                    seriesData.push(groupTableDatas.data);
                }

                angular.forEach(groupTableDatas.gaResultTdDatas, function (groupTableData, index, array) {

                    if ($scope.groupIndex.selected.field == 'retentionRate') {
                        seriesData.push($scope.perToNum(groupTableData.data));
                    } else {
                        seriesData.push(groupTableData.data);
                    }


                });
            }
            //console.log(seriesData);
            option = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderColor: '#ededed',
                    borderWidth: 1,
                    padding: 10,
                    textStyle: {
                        color: '#000',
                        decoration: 'none',
                        fontSize: 12
                    },
                    formatter: function (params) {
                        var res;
                        if($scope.retentionRate == true){
                            res = params[0].name + '<br/>' + $scope.groupIndex.selected.name+'：' +(params[0].value*100).toFixed(2)+'%<br/>';
                        }else{
                            res = params[0].name + '<br/>' + $scope.groupIndex.selected.name+'：' +params[0].value+'<br/>';
                        }
                        return res;
                    }
                },
                legend: {
                    data: ['所有会话']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: function (v) {
//                                console.log(v);
                                if ($scope.retentionRate == true) {
                                    return v * 100 + '%';
                                } else {
                                    return v;
                                }
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '所有会话',
                        type: 'line',
                        stack: '总量',
                        data: seriesData
                    }
                ]
            };

            if ($scope.retentionRate == true) {
                option.yAxis[0]["max"] = 1;
                option.yAxis[0]["min"] = 0;
                option.yAxis[0]["splitNumber"] = 2;
            }

            // 为echarts对象加载数据
            myChart.setOption(option);

        }


        $scope.groupTableDataes = []
        $scope.max = 0.00;


        $scope.searchData = function () {


            var parameter = {
                type: $rootScope.userType,
                scale: $scope.groupScale.selected.field,
                dateRange: $scope.dateRange.selected.field,
                indicator: $scope.groupIndex.selected.field
            };


            var url = "/gacache/querydata?query=" + JSON.stringify(parameter);

            $http({
                method: 'GET',
                url: url
            }).success(function (data) {

                $scope.groupTableDataes = data.gaResultTrData;
                $scope.max = data.max;
                $scope.min = data.min;
                $scope.half = ($scope.max + $scope.min ) / 2;
                $scope.maxhalf = ($scope.max + $scope.half ) / 2;
                $scope.minhalf = ($scope.min + $scope.half ) / 2;



                $scope.init();

            });

        }
        $scope.searchData();

    })
})