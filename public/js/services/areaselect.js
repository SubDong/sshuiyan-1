app.service('areaService', ['$rootScope', '$http', function ($rootScope, $http) {
    $rootScope.disabled = undefined;
    $rootScope.enable = function () {
        $scope.disabled = false;
    };
    $rootScope.disable = function () {
        $scope.disabled = true;
    };
    $rootScope.country = {};
    $rootScope.countrys = [
        {name: '中国'},
        {name: '泰国'},
    ];
    $rootScope.city = {};
    $rootScope.citys = [
        {name: '北京'},
        {name: '上海'},
        {name: '成都'},
    ];
    $rootScope.continent = {};
    $rootScope.continents = [
        {name: '亚洲'},
        {name: '美洲 '},
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
        {name: '浏览量(PV)', value: 'pv'},
        {name: '访客数(UV) ', value: 'uv'},
        {name: '新访客数', value: 'nuv'},
        {name: 'IP数', value: 'ip'},
        {name: '跳出率', value: 'outRate'},
        {name: '平均访问时长', value: 'avgTime'},
        {name: '转化次数', value: 'convert'}
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
    $rootScope.equipment = {};
    $rootScope.equipments = [
        {name: '设备环境', value: 'pm'},
        {name: '分辨率', value: 'sr'},
        {name: '屏幕颜色', value: 'sc'},
        {name: 'falsh版本', value: 'fl'},
        {name: '是否支持java', value: 'ja'},
        {name: '语言环境', value: 'lg'},
        {name: '是否支持cookie', value: 'ck'},
        {name: '网络供应商', value: 'isp'}
    ];
    $rootScope.lagerMulti = [
        {name: '展现量', ename: 'pv'},
        {name: '点击量', ename: 'pv'},
        {name: '消费', ename: 'pv'},
        {name: '点击率', ename: 'pv'},
        {name: '平均点击价格', ename: 'pv'},
        {name: '浏览量(PV)', ename: 'pv'},
        {name: '访问次数', ename: 'vc'},
        {name: '访客数(UV)', ename: 'uv'},
        {name: '新访客数', ename: 'nuv'},
        {name: '新访客比率', ename: 'pv'},
        {name: '页头访问次数', ename: 'pv'},
        {name: '跳出率', ename: 'outRate'},
        {name: '平均访问时长', ename: 'avgTime'},
        {name: '平均访问页数', ename: 'pv'},
        {name: '抵达率', ename: 'arrivedRate'},
        {name: '转化次数', ename: 'pv'},
        {name: '转化率', ename: 'pv'},
        {name: '平均转化成本', ename: 'pv'},
        {name: '收益', ename: 'pv'},
        {name: '利润', ename: 'pv'},
        {name: '投资回报率', ename: 'pv'},
        {name: '搜索页直拨电话展现', ename: 'pv'},
        {name: '搜索页直拨电话点击', ename: 'pv'},
        {name: '搜索页直拨电话消费', ename: 'pv'},
        {name: '搜索页回呼电话点击', ename: 'pv'},
        {name: '搜索页回呼电话消费', ename: 'pv'},
        {name: '搜索页APP下载展现', ename: 'pv'},
        {name: '搜索页APP下载点击', ename: 'pv'},
        {name: '搜索页APP下载消费', ename: 'pv'}
    ]
}]);

