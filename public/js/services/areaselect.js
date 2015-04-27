app.service('areaService', ['$rootScope','$http',function ($rootScope,$http) {
    $rootScope.disabled = undefined;
    $rootScope.enable = function() {
            $scope.disabled = false;
        };
    $rootScope.disable = function() {
            $scope.disabled = true;
        };
    $rootScope.country = {};
    $rootScope.countrys = [
            { name: '中国'},
            { name: '泰国'},
        ];
    $rootScope.city = {};
    $rootScope.citys = [
            { name: '北京'},
            { name: '上海'},
            { name: '成都'},
        ];
    $rootScope.continent = {};
    $rootScope.continents = [
            { name: '亚洲'},
            { name: '美洲 '},
        ];
    $rootScope.extendway = {};
    $rootScope.extendways = [
        {name: '全部页面目标'},
        {name: '公告'},
        {name: '全部事件目标'},
        {name: '完整下载'},
        {name: '在线下载'},
        {name: '时长目标'},
        {name: '访问页数目标'},
    ];

    $rootScope.souce = {};
    $rootScope.souces = [
        {name: '全部'},
        {name: '直接访问'},
        {name: '搜索引擎'},
        {name: '外部链接'},
    ];
    $rootScope.rootSelect = {};
    $rootScope.rootSelects = [
        {name: '浏览量(PV)',value:'pv'},
        {name: '访客数(UV) ',value:'uv'},
        {name: '新访客数',value:'nuv'},
        {name: 'IP数',value:'ip'},
        {name: '跳出率',value:'outRate'},
        {name: '平均访问时长',value:'avgTime'},
        {name: '转化次数',value:'convert'},

    ];
    $rootScope.choosedate = {};
    $rootScope.choosedates = [
        {name: '前一日'},
        {name: '上周同期 '}
    ];
    $rootScope.export = {};
    $rootScope.exports = [
        {name: '保存'},
        {name: '导出 '}
    ];
}]);

