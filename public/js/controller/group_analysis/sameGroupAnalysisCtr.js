/**
 * Created by ss on 2015/9/24.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('sameGroupAnalysisCtr', function ($scope, $rootScope, $q, $http,$cookieStore, requestService, areaService, $location, uiGridConstants) {

        var option;
        $scope.groupTypes = [
            {name: '流量获取日期', field: 'date'}
        ];
        $scope.groupScales = [
            {name: '天', field: 'day'},
            {name: '周', field: 'week'},
            {name: '月', field: 'month'}
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
        $scope.groupScale.selected = {"name": "天", "field": "day"};
        $scope.dateRange.selected = {"name": "过去7天", "field": "7"};
        $scope.groupIndex.selected = {"name": "用户数", "field": "visitor"};


        $scope.scaleChange = function (val) {
            if (val.name == "天") {
                $scope.groupScale.selected.field = "day";
                $scope.groupScale.selected.name = "天";
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
            } else if (val.name == "周") {
                $scope.groupScale.selected.field = "week";
                $scope.groupScale.selected.name = "周";
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
            } else if (val.name == "月") {
                $scope.groupScale.selected.field = "month";
                $scope.groupScale.selected.name = "月";
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
            $scope.page_refresh();
        }


        $scope.dateChange = function (val) {
            $scope.dateRange.selected = val;
            $scope.page_refresh();
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
            $scope.page_refresh();
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

            var legendData = "所有访客";
            if($scope.retentionRate) {
                legendData = "所有新访客";
            }


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
                    data: [legendData]
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
                        name: legendData,
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

        //数据
        $scope.groupTableDataes = [];

        //发送邮件功能-初始化数据
        $rootScope.initMailData = function () {
            $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[11] + "").success(function (result) {
                if (result) {
                    var ele = $("ul[name='sen_form']");
                    formUtils.rendererMailData(result, ele);
                }
            });
        }
        //发送邮件功能-确定发送
        $scope.sendConfig = function () {
            var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
            var result = formUtils.validateEmail(formData.mail_address, formData);
            if (result.ec) {
                alert(result.info);
            } else {
                formData.rule_url = $rootScope.mailUrl[11];
                formData.uid = $cookieStore.get('uid');
                formData.site_id = $rootScope.siteId;
                formData.type_id = $rootScope.userType;
                formData.schedule_date = $scope.mytime.time.Format('hh:mm');
                //同类群组分析数据
                formData.scale = $scope.groupScale.selected.field;
                formData.dateRange = $scope.dateRange.selected.field;
                formData.indicator = $scope.groupIndex.selected.field;

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
        //删除配置信息
        $scope.deleteConfig = function () {
            var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
            var result = formUtils.validateEmail(formData.mail_address, formData);
            if (result.ec) {
                alert(result.info);
            } else {
                formData.rule_url = $rootScope.mailUrl[11];
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



        //下载功能-CSV
        $rootScope.gaFormatDataCSV = function () {
            var tableCSV = [];
            var trsData = $scope.groupTableDataes;
            angular.forEach(trsData, function (trData, trIndex, array) {

                var trCsv = '{"日期":"'+trData.code+'","第0'+ $scope.groupScale.selected.name +'":"'+trData.data+'",';
                var keepGoing = true;

                var boundary = $scope.dateRange.selected.field > 12 ? 12 :$scope.dateRange.selected.field;

                angular.forEach(trData.gaResultTdDatas, function (tdData, tdIndex, array) {

                    if(keepGoing) {
                        if(tdData.data != null && tdData != undefined && tdData != "") {
                             var day = tdIndex + 1;
                               trCsv += '"第'+ day +''+ $scope.groupScale.selected.name +'":"'+tdData.data+'",'
                         } else {
                            var day = tdIndex + 1;
                            trCsv += '"第'+ day +''+ $scope.groupScale.selected.name +'":"",'
                        }
                        if(boundary - 1 == tdIndex) {
                            keepGoing = false;
                            trCsv = trCsv.substr(0,trCsv.length-1);
                            trCsv += '}';
                        }
                    }
                });
               // console.log(trCsv);
                tableCSV.push(JSON.parse(trCsv));
                trCsv = "";
            });
            return JSON.stringify(tableCSV);
        }

        //下载功能 - PDF
        $scope.generatePDFMakeData = function (cb) {
            var _tableBody = [];
            //表单头
            var _tableHeader = [];
            var boundary = $scope.dateRange.selected.field > 12 ? 12 :$scope.dateRange.selected.field;
            _tableHeader.push("");
            for(var day = 0; day <= boundary; day ++) {
                _tableHeader.push($scope.groupScale.selected.field+day);
            }
            _tableBody.push(_tableHeader);

            var trsData = $scope.groupTableDataes;
            angular.forEach(trsData, function (trData, trIndex, array) {
                //表单明细
                var _tableDetail = [];
                //日期
                var _code = trData.code == "所有访客" || "所有新访客" ? "all" : trData.code;
                _tableDetail.push(_code);
                //汇总
                _tableDetail.push(trData.data);

                var keepGoing = true;
                //同类群组比较数据
                angular.forEach(trData.gaResultTdDatas, function (tdData, tdIndex, array) {
                    if(keepGoing) {
                        if(tdData.data != null && tdData != undefined && tdData != "") {
                            _tableDetail.push(tdData.data);
                        } else {
                            _tableDetail.push("");
                        }
                        if(boundary - 1 == tdIndex) {
                            keepGoing = false;
                        }
                    }
                });
                _tableBody.push(_tableDetail);
            });
            //定义表格样式
            var docDefinition = {
                header: {
                    text: "Cohort Analysis Data Report",
                    style: "header",
                    alignment: 'center'
                },
                content: [
                    {text: 'Scale:'+$scope.groupScale.selected.field+ '\n'},
                    {text: 'Date Range:'+  $scope.dateRange.selected.field +'\n'},
                    {text: 'Indicator:' + $scope.groupIndex.selected.field  +'\n'},
                    {
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
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

        $scope.page_refresh = function () {

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

                $scope.init();
            });
        }
        $scope.page_refresh();

    })
})