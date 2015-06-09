define(["../app"], function (app) {
    'use strict';
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
            {name: '泰国'}
        ];
        $rootScope.city = {};
        $rootScope.citys = [
            {name: '全部'},
            {name: '北京'},
            {name: '上海'},
            {name: '天津'},
            {name: '重庆'},
            {name: '河北'},
            {name: '山西'},
            {name: '内蒙古'},
            {name: '辽宁'},
            {name: '吉林'},
            {name: '黑龙江'},
            {name: '江苏'},
            {name: '浙江'},
            {name: '安徽'},
            {name: '福建'},
            {name: '江西'},
            {name: '山东'},
            {name: '河南'},
            {name: '湖北'},
            {name: '湖南'},
            {name: '广东'},
            {name: '广西'},
            {name: '海南'},
            {name: '四川'},
            {name: '贵州'},
            {name: '云南'},
            {name: '西藏'},
            {name: '陕西'},
            {name: '甘肃'},
            {name: '青海'},
            {name: '宁夏'},
            {name: '新疆'},
            {name: '港澳台'}

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
            {name: '访问页数目标'}
        ];

        $rootScope.souce = {};
        $rootScope.souces = [
            {name: '全部', value: 0},
            {name: '直接访问', value: 1},
            {name: '搜索引擎', value: 2},
            {name: '外部链接', value: 3}
        ];
        $rootScope.rootSelect = {};
        $rootScope.rootSelects = [
            {name: '浏览量(PV)', value: 'pv'},
            {name: '访客数(UV) ', value: 'uv'},
            {name: '新访客数', value: 'nuv'},
            {name: 'IP数', value: 'ip'},
            {name: '跳出率', value: 'outRate'},
            {name: '平均访问时长', value: 'avgTime'},
            {name: '平均访问页数', value: 'avgPage'},
            {name: '转化次数', value: 'convert'}

        ];
        $rootScope.choosedate = {};
        $rootScope.choosedates = [
            {name:'取消对比',value:100},
            {name: '前一日', value: -2},
            {name: '上周同期 ', value: -7}
        ];
        $rootScope.equipment = {};
        $rootScope.equipments = [
            {name: '网络设备类型', field: 'pm'},
            {name: '网络供应商', field: 'isp'},
            {name: '浏览器', field: 'br'},
            {name: '分辨率', field: 'sr'},
            {name: '屏幕颜色', field: 'sc'},
            {name: 'flash版本', field: 'fl'},
            {name: '是否支持java', field: 'ja'},
            {name: '语言环境', field: 'lg'},
            {name: '是否支持cookie', field: 'ck'}
        ];
        $rootScope.lagerMulti = [
            {label: '点击量', name: 'click'},
            {label: '展现量', name: 'impression'},
            {label: '消费', name: 'cost'},
            {label: '点击率', name: 'ctr'},
            {label: '平均点击价格', name: 'cpc'},
            {label: '浏览量(PV)', name: 'pv'},
            {label: '访问次数', name: 'vc'},
            {label: '访客数(UV)', name: 'uv'},
            {label: '新访客数', name: 'nuv'},
            {label: '新访客比率', name: 'nuvRate'},
            //{label: '页头访问次数', name: 'pv'},
            {label: '跳出率', name: 'outRate'},
            {label: '平均访问时长', name: 'avgTime'},
            {label: '平均访问页数', name: 'avgPage'},
            {label: '抵达率', name: 'arrivedRate'}
            //{label: '转化', name: 'conversion'},
            //{label: '转化率', name: 'pv'},
            //{label: '平均转化成本', name: 'pv'},
            //{label: '收益', name: 'pv'},
            //{label: '利润', name: 'pv'},
            //{label: '投资回报率', name: 'pv'},
            //{label: '搜索页直拨电话展现', name: 'pv'},
            //{label: '搜索页直拨电话点击', name: 'pv'},
            //{label: '搜索页直拨电话消费', name: 'pv'},
            //{label: '搜索页回呼电话点击', name: 'pv'},
            //{label: '搜索页回呼电话消费', name: 'pv'},
            //{label: '搜索页APP下载展现', name: 'pv'},
            //{label: '搜索页APP下载点击', name: 'pv'},
            //{label: '搜索页APP下载消费', name: 'pv'}
        ];
        $rootScope.browser = {};
        $rootScope.browsers = [
            {name: '全部', value: '全部'},
            {name: '百度', value:  '百度'},
            {name: 'Google', value: 'Google'},
            {name: '搜狗', value: '搜狗'},
            {name: '好搜', value: '好搜'},
            {name: '必应', value: '必应'},
            {name: '其他', value: '其他'}
        ];
    }]);
});
