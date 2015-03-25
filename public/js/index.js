app.controller('DateChartController', ['$scope', '$http', function ($scope, $http) {
    $scope.today = function () {
        var start = today_start(), end = today_end();

        var option = {
            type: "pv,uv",
            chart: "line"

        };
        request('index_charts', start.getTime(), end.getTime(), option)
    };

    $scope.yesterday = function () {

    };

    $scope.lastseven = function () {

    };

}]).controller('IndexController', ['$scope', '$http', function ($scope, $http) {
    // grid
    $scope.gridOptions = {
        paginationPageSizes: [10, 15, 20],
        paginationPageSize: 10,
        columnDefs: [
            {field: '_id', displayName: 'ID', visible: false},
            {field: 'name', displayName: '关键词', enableSorting: false}
            //{
            //    name: 'edit',
            //    displayName: '编辑',
            //    cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="edit(row.entity)" >Edit</button>'
            //}
        ]
    };
}]);

function update(id, start, end, type) {
    $.get("/api/time?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {

        var myChart = echarts.init(document.getElementById(id));

        var jsons = JSON.parse(data);

        var option = {
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: jsons.lables
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: []
        };

        var types = type.split(",");
        var lables = [];
        types.forEach(function (item) {

            var serie = {
                name: item,
                type: 'line',
                data: jsons[item],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            };

            //var buckets = aggs[item].buckets
            //buckets.forEach(function (bucket) {
            //    serie.data.push(bucket['doc_count'])
            //    lables.push(bucket['key'])
            //})
            option.series.push(serie)
        });

        //datas.forEach(function (data) {
        //    option.xAxis[0].data.push(data['key'])
        //})

        myChart.setOption(option);


    }).error(function (err) {
        console.error(err)
    })
}