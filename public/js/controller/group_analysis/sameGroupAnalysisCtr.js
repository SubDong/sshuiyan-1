/**
 * Created by ss on 2015/9/24.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('sameGroupAnalysisCtr', function ($scope, $rootScope, $q, $http, requestService, areaService, $location,uiGridConstants) {
        $scope.groupTypes = [
            {name: '流量获取日期', field: 'date'}
        ];
        $scope.groupScales = [
            {name: '按天', field: 'day'},
            {name: '按周', field: 'week'},
            {name: '按月', field: 'month'}
        ];
        $scope.dateRanges = [
            {name: '过去7天', field: 'pastSeven'},
            {name: '过去14天', field: 'pastFourteen'},
            {name: '过去21天', field: 'pastTwenty'},
            {name: '过去30天', field: 'pastThirty'}
        ];
        $scope.groupIndexs = [
            {name: '用户留存率', field: 'userKeep'},
            {name: '用户数', field: 'userNo'},
            {name: '浏览量', field: 'pv'}
        ];
        $scope.groupType={};
        $scope.groupScale={};
        $scope.dateRange={};
        $scope.groupIndex={};
        $scope.groupType.selected = {"name": "流量获取日期", "field": "date"};
        $scope.groupScale.selected = {"name": "按天", "field": "day"};
        $scope.dateRange.selected = {"name": "过去30天", "field": "pastThirty"};
        $scope.groupIndex.selected = {"name": "用户数", "field": "userNo"};

        $scope.scaleChange = function(val) {
            if(val.name == "按天"){
                $scope.dateRange.selected = {"name": "过去30天", "field": "pastThirty"};
                $scope.dateRanges = [
                    {name: '过去7天', field: 'pastSeven'},
                    {name: '过去14天', field: 'pastFourteen'},
                    {name: '过去21天', field: 'pastTwenty'},
                    {name: '过去30天', field: 'pastThirty'}
                ];
                $scope.tables = [
                    {name:"第0天"},
                    {name:"第1天"},
                    {name:"第2天"},
                    {name:"第3天"},
                    {name:"第4天"},
                    {name:"第5天"},
                    {name:"第6天"},
                    {name:"第7天"},
                    {name:"第8天"},
                    {name:"第9天"},
                    {name:"第10天"},
                    {name:"第11天"},
                    {name:"第12天"}
                ];
            }else if(val.name == "按周"){
                $scope.dateRange.selected = {"name": "上周", "field": "pastSeven"};
                $scope.dateRanges = [
                    {name: '上周', field: 'pastSeven'},
                    {name: '过去3周', field: 'pastFourteen'},
                    {name: '过去6周', field: 'pastTwenty'},
                    {name: '过去9周', field: 'pastThirty'},
                    {name: '过去12周', field: 'pastThirty'}
                ];
                $scope.tables = [
                    {name:"第0周"},
                    {name:"第1周"},
                    {name:"第2周"},
                    {name:"第3周"},
                    {name:"第4周"},
                    {name:"第5周"},
                    {name:"第6周"},
                    {name:"第7周"},
                    {name:"第8周"},
                    {name:"第9周"},
                    {name:"第10周"},
                    {name:"第11周"},
                    {name:"第12周"}
                ];
            }else if(val.name == "按月"){
                $scope.dateRange.selected = {"name": "上月", "field": "pastSeven"};
                $scope.dateRanges = [
                    {name: '上月', field: 'pastSeven'},
                    {name: '过去2个月', field: 'pastFourteen'},
                    {name: '过去3个月', field: 'pastTwenty'}
                ];
                $scope.tables = [
                    {name:"第0月"},
                    {name:"第1月"},
                    {name:"第2月"},
                    {name:"第3月"},
                    {name:"第4月"},
                    {name:"第5月"},
                    {name:"第6月"},
                    {name:"第7月"},
                    {name:"第8月"},
                    {name:"第9月"},
                    {name:"第10月"},
                    {name:"第11月"},
                    {name:"第12月"}
                ];
            }
        }
        $scope.dateChange = function(val) {
            console.log(val);
        }
        $scope.indexChange = function(val) {
            console.log(val);
        }
        $scope.tables = {

        }
        /*table数据中表头*/
        $scope.tables = [
            {name:"第0周"},
            {name:"第1周"},
            {name:"第2周"},
            {name:"第3周"},
            {name:"第4周"},
            {name:"第5周"},
            {name:"第6周"},
            {name:"第7周"},
            {name:"第8周"},
            {name:"第9周"},
            {name:"第10周"},
            {name:"第11周"},
            {name:"第12周"}
        ];

        $scope.groupTableDataes = [
            {
                subTableDates:[{name:'所有访客',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            },{
                subTableDates:[{name:'2015年5月3日-2015年5月9日',total:'18771位用户'},{name:'18771'},{name:'671'},{name:'415'},{name:'253'},{name:'206'},{name:'148'},{name:'126'},{name:'97'},{name:'77'},{name:'60'},{name:'29'},{name:'14'},{name:'5'}]
            }
        ]
    })
})