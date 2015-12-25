/**
 * Created by hydm on 2015/8/6.
 */

define(["../app"], function (app) {
    'use strict';
    /**
     * Create by wms on 2015-04-22.搜索推广合计信息显示
     */
    app.directive("sshSstgDateShow", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数

                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.ssh_sem_type = attris.semType;
                scope.ssh_sem_id_type = attris.semIdType;
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);

                };
                // 刷新加载时设置默认指标
//                scope.setDefaultShowArray();

                // 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/index_summary/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var semRequest = $http.get(SEM_API_URL + "/sem/report/" + scope.ssh_sem_type + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&device=-1&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd);
                    }
                    $q.all([semRequest]).then(function (final_result) {
                        scope.pushSEOData(final_result[0].data);
                        var esRequestArray = [];
                        angular.forEach(final_result[0].data, function (item) {
                            esRequestArray.push($http.get('/api/index_summary/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=[{\"" + scope.ssh_sem_id_type + "\":[\"" + item[scope.ssh_sem_type + "Id"] + "\"]}]&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType));
                        });
                        $q.all(esRequestArray).then(function (final_result) {
                            var esDataArray = [];
                            angular.forEach(final_result, function (item) {
                                var t_a = JSON.parse(eval('(' + item.data + ')').toString())
                                angular.forEach(t_a, function (t_a_i) {
                                    esDataArray.push(t_a_i);
                                });
                            });
                            scope.pushESData(esDataArray);
                        });
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                //scope.loadCompareDataShow = function (startTime, endTime) {
                //    scope.DateNumber = false;
                //    scope.DateLoading = false;
                //    var esRequest = $http.get('/api/index_summary/?start=' + startTime + "&end=" + endTime + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                //    var seoQuotas = scope.getSEOQuotas();
                //    if (seoQuotas.length > 0) {
                //        var seoRequest = $http.get(SEM_API_URL + "/sem/report/" + scope.ssh_seo_type + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&device=-1&?startOffset=" + startTime + "&endOffset=" + endTime);
                //    }
                //    $q.all([esRequest, seoRequest]).then(function (final_result) {
                //        // 初始化对比数据
                //        scope.pushESData(final_result[0].data, true);
                //        if (final_result[1] != undefined) {
                //            scope.pushSEOData(final_result[1].data, true);
                //        }
                //        scope.DateNumber = true;
                //        scope.DateLoading = true;
                //    });
                //};
                scope.getSEOQuotas = function () {
                    var seoQuotas = [];
                    // 根据用户所选择的指标，判断是否具有SEO指标，如果存在SEO指标则构建该指标的对象并且存储该指标
                    angular.forEach(scope.ds_dateShowQuotasOption, function (e) {
                        switch (e) {
                            case "cost":
                            case "impression":
                            case "click":
                            case "ctr":
                            case "cpc":
                            case "cpm":
                            case "conversion":
                                seoQuotas.push(e);
                        }
                    });
                    return seoQuotas;
                };
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo, _i) {
                            temp += Number(qo);
                            count++;
                        });
                        angular.forEach(_array, function (_array_r) {
                            if (_array_r.label == dateShowObject.label) {
                                if (flag) {
                                    _array_r.cCount = count;
                                    _array_r.cValue = temp
                                } else {
                                    _array_r.count = count;
                                    _array_r.value = temp
                                }
                            }
                        });
                    });
                    scope.dateShowArray = $rootScope.copy(_array);
                };
                scope.pushSEOData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    var _count = 0;
                    angular.forEach(result, function (r) {
                        var infoKey = r[$rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field];
                        if (scope.filter) {
                            if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null")) {
                                return false;
                            }
                        }
                        _count++;
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (flag) {
                                obj.cValue += r[temp];
                            } else {
                                obj.value += r[temp];
                            }
                        });
                    });
                    // 判断是不是sem指标
                    function isSeoLabel(_label) {
                        switch (_label) {
                            case "cost":
                            case "impression":
                            case "click":
                            case "ctr":
                            case "cpc":
                            case "cpm":
                            case "conversion":
                                return true;
                        }
                        return false;
                    }

                    // 设置_count
                    angular.forEach(_array, function (obj) {
                        if (flag) {
                            obj.cCount = _count;
                        } else {
                            obj.count = _count;
                        }
                    });
                    scope.dateShowArray = $rootScope.copy(_array);
                };

                // 对比
                //scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                //    scope.isCompared = true;
                //    angular.forEach(scope.dateShowArray, function (dsa) {
                //        dsa.cValue = 0;
                //    });
                //    scope.loadCompareDataShow(startTime, endTime);
                //});

                scope.$on("ssh_dateShow_options_quotas_change", function (e, msg) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.loadDataShow();
                });

                scope.loadDataShow();
            }
        };
    });

    /**
     * Create by wms on 2015-08-06.网盟推广合计信息显示
     */
    app.directive("sshWmtgDateShow", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.ssh_wm_type = attris.wmType;
                scope.ssh_wm_id_type = attris.wmIdType;
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);

                };
                // 刷新加载时设置默认指标
//                scope.setDefaultShowArray();

                // 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var wmQuotas = scope.getWmQuotas();
                    if (wmQuotas.length > 0) {
                        var wmRequest = $http.get(SEM_API_URL + "/sem/report/nms/" + scope.ssh_wm_type + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd);
                    }
                    $q.all([wmRequest]).then(function (final_result) {
                        scope.pushWmData(final_result[0].data);
                        var esRequestArray = [];
                        angular.forEach(final_result[0].data, function (item) {
                            esRequestArray.push($http.get('/api/index_summary/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=[{\"" + scope.ssh_wm_id_type + "\":[\"" + item[scope.ssh_wm_type + "Id"] + "\"]}]&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType));
                        });
                        $q.all(esRequestArray).then(function (final_result) {
                            var esDataArray = [];
                            angular.forEach(final_result, function (item) {
                                var t_a = JSON.parse(eval('(' + item.data + ')').toString())
                                angular.forEach(t_a, function (t_a_i) {
                                    esDataArray.push(t_a_i);
                                });
                            });
                            scope.pushESData(esDataArray);
                        });
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                //scope.loadCompareDataShow = function (startTime, endTime) {
                //    scope.DateNumber = false;
                //    scope.DateLoading = false;
                //    var esRequest = $http.get('/api/index_summary/?start=' + startTime + "&end=" + endTime + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                //    var seoQuotas = scope.getSEOQuotas();
                //    if (seoQuotas.length > 0) {
                //        var seoRequest = $http.get(SEM_API_URL + "/sem/report/" + scope.ssh_seo_type + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&device=-1&?startOffset=" + startTime + "&endOffset=" + endTime);
                //    }
                //    $q.all([esRequest, seoRequest]).then(function (final_result) {
                //        // 初始化对比数据
                //        scope.pushESData(final_result[0].data, true);
                //        if (final_result[1] != undefined) {
                //            scope.pushSEOData(final_result[1].data, true);
                //        }
                //        scope.DateNumber = true;
                //        scope.DateLoading = true;
                //    });
                //};
                scope.getWmQuotas = function () {
                    var wmQuotas = [];
                    // 根据用户所选择的指标，判断是否具有SEO指标，如果存在SEO指标则构建该指标的对象并且存储该指标
                    angular.forEach(scope.ds_dateShowQuotasOption, function (e) {
                        switch (e) {
                            case "cost":
                            case "impression":
                            case "click":
                            case "ctr":
                            case "acp":
                            case "cpm":
                            case "conversion":
                                wmQuotas.push(e);
                        }
                    });
                    return wmQuotas;
                };
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo, _i) {
                            temp += Number(qo);
                            count++;
                        });
                        angular.forEach(_array, function (_array_r) {
                            if (_array_r.label == dateShowObject.label) {
                                if (flag) {
                                    _array_r.cCount = count;
                                    _array_r.cValue = temp
                                } else {
                                    _array_r.count = count;
                                    _array_r.value = temp
                                }
                            }
                        });
                    });
                    scope.dateShowArray = $rootScope.copy(_array);
                };
                scope.pushWmData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    var _count = 0;
                    angular.forEach(result, function (r) {
                        var infoKey = r[$rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field];
                        if (scope.filter) {
                            if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null")) {
                                return false;
                            }
                        }
                        _count++;
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (r[temp] != -1) {
                                if (flag) {
                                    obj.cValue += r[temp];
                                } else {
                                    obj.value += r[temp];
                                }
                            }
                        });
                    });
                    // 判断是不是sem指标
                    function isSeoLabel(_label) {
                        switch (_label) {
                            case "cost":
                            case "impression":
                            case "click":
                            case "ctr":
                            case "acp":
                            case "cpm":
                            case "conversion":
                                return true;
                        }
                        return false;
                    }

                    // 设置_count
                    angular.forEach(_array, function (obj) {
                        if (flag) {
                            obj.cCount = _count;
                        } else {
                            obj.count = _count;
                        }
                    });
                    scope.dateShowArray = $rootScope.copy(_array);
                };

                // 对比
                //scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                //    scope.isCompared = true;
                //    angular.forEach(scope.dateShowArray, function (dsa) {
                //        dsa.cValue = 0;
                //    });
                //    scope.loadCompareDataShow(startTime, endTime);
                //});

                scope.$on("ssh_dateShow_options_quotas_change", function (e, msg) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.loadDataShow();
                });

                scope.loadDataShow();
            }
        };
    });

    /**
     * Create by wms on 2015-04-22.搜索推广合计信息显示
     */
    app.directive("sshSstgSscDateShow", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数

                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);

                };

                scope.$on("LoadSSCDataFinish", function (e, msg, data) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.setDefaultShowArray();
                    scope.pushESAndSE0Data(data);
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                });

                scope.pushESAndSE0Data = function (data) {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(data, function (r) {
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (JSON.stringify(r[temp]).indexOf("%") != -1) {
                                obj.value += parseFloat(r[temp].substr(0, r[temp].length - 1));
                            } else if (JSON.stringify(r[temp]).indexOf(":") != -1) {
                                var _t_array = r[temp].split(":");
                                obj.value += _t_array[0] * 3600 * 1000 + _t_array[1] * 60 * 1000 + _t_array[2] * 1000;
                            } else if (JSON.stringify(r[temp]).indexOf(".") != -1 && JSON.stringify(r[temp]).indexOf("%") == -1) {
                                obj.value += parseFloat(r[temp]);
                            } else {
                                obj.value += parseInt(r[temp]);
                            }
                            obj.count++;
                        });
                    });

                    scope.dateShowArray = $rootScope.copy(_array);
                };
            }
        };
    });

    /**
     * Create by wms on 2015-11-09.搜索推广.推广URL
     */
    app.directive("sshSstgTgurlDateShow", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数

                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);

                };

                scope.$on("LoadTgurlDataFinish", function (e, msg, data) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.setDefaultShowArray();
                    scope.pushESAndSE0Data(data);
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                });

                scope.pushESAndSE0Data = function (data) {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(data, function (r) {
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (JSON.stringify(r[temp]).indexOf("%") != -1) {
                                obj.value += parseFloat(r[temp].substr(0, r[temp].length - 1));
                            } else if (JSON.stringify(r[temp]).indexOf(":") != -1) {
                                var _t_array = r[temp].split(":");
                                obj.value += _t_array[0] * 3600 * 1000 + _t_array[1] * 60 * 1000 + _t_array[2] * 1000;
                            } else {
                                obj.value += parseInt(r[temp]);
                            }
                            obj.count++;
                        });
                    });

                    scope.dateShowArray = $rootScope.copy(_array);
                };
            }
        };
    });

    /**
     * Create by wms on 2015-12-23.历史趋势
     */
    app.directive("sshHistoryDateShow", function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };

                scope.$on("LoadHistoryDataFinish", function (e, msg, data) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.setDefaultShowArray();
                    scope.pushESAndSE0Data(data);
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                });

                scope.pushESAndSE0Data = function (data) {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(data, function (r) {
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (JSON.stringify(r[temp]).indexOf("%") != -1) {
                                obj.value += parseFloat(r[temp].substr(0, r[temp].length - 1));
                            } else if (JSON.stringify(r[temp]).indexOf(":") != -1) {
                                var _t_array = r[temp].split(":");
                                obj.value += _t_array[0] * 3600 * 1000 + _t_array[1] * 60 * 1000 + _t_array[2] * 1000;
                            } else {
                                obj.value += parseInt(r[temp]);
                            }
                            obj.count++;
                        });
                    });

                    scope.dateShowArray = $rootScope.copy(_array);
                };
            }
        };
    });

    /**
     * Create by wms on 2015-12-25.指定广告跟踪
     */
    app.directive("sshAdDateShow", function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };

                scope.setDefaultShowArray();

                scope.$on("LoadAdDateShowStart", function (e, msg) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.setDefaultShowArray();
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                });

                scope.$on("LoadAdDateShowFinish", function (e, field, data) {
                    scope.dateShowArray.forEach(function (_obj) {
                        if (field == _obj["label"]) {
                            _obj.value = data;
                            _obj.count = 1;
                        }
                    });
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                });

            }
        };
    });

    app.directive("sshHeatMap", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'C',
            link: function (scope, element, attris, controller) {

                scope.loadHeatmap = function (heatData) {
                    var option = {
                        title : {
                            text: '热力图'
                        },
                        series : [
                            {
                                type : 'heatmap',
                                data : heatData.pointArr,
                                hoverable : false
                            }
                        ]
                    };
                    element.css({
                        width: "100%",
                        height: heatData.dh
                    });

                    var myChart = echarts.init(element[0]);

                    myChart.showLoading({
                        text: '正在努力的读取数据中...'    //loading话术
                    });

                    myChart.hideLoading();

                    myChart.setOption(option)
                };

            }
        };
    });

    app.directive("sshHeatIFrame", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            template: "<iframe></iframe>",
            transclude: true,
            replace: true,
            restrict: 'C',
            link: function (scope, element, attris, controller) {

                scope.loadIframe = function (res, loc, dialog) {

                    element[0].src = loc.indexOf("http://") != -1 ? loc : "http://hy.best-ad.cn";

                    element.css({
                        width: "100%",
                        height: res.dh
                    });

                    if (element[0].attachEvent) {
                        element[0].attachEvent("onload", function () {
                            dialog.close();
                        });
                    } else {
                        element[0].onload = function () {
                            dialog.close();
                        };
                    }

                };
            }
        };
    });

    /**
     * 指标过滤器
     */
    app.filter("quotaFormat", function () {
        var quotaObject = {};
        quotaObject.pv = "浏览量(PV)";
        quotaObject.uv = "访客数(UV)";
        quotaObject.vc = "访问次数";
        quotaObject.outRate = "跳出率";
        quotaObject.ip = "IP数";
        quotaObject.nuv = "新访客数";
        quotaObject.nuvRate = "新访客比率";
        quotaObject.arrivedRate = "抵达率";
        quotaObject.pageConversion = "页面转化";
        quotaObject.eventConversion = "事件转化";
        quotaObject.avgTime = "平均访问时长";
        quotaObject.avgPage = "平均访问页数";
        quotaObject.cost = "消费";
        quotaObject.impression = "展现量";
        quotaObject.click = "点击量";
        quotaObject.ctr = "点击率";
        quotaObject.acp = "平均点击价格";
        quotaObject.cpc = "平均点击价格";
        quotaObject.cpm = "千次展现消费";
        quotaObject.conversion = "转化";
        quotaObject.entrance = "入口页次数";
        quotaObject.contribution = "贡献浏览量";
        quotaObject.freq = "总搜索次数";
        quotaObject.baidu = "百度";
        quotaObject.sougou = "搜狗";
        quotaObject.haosou = "好搜";
        quotaObject.bing = "必应";
        quotaObject.clickTotal = "事件点击总数";
        quotaObject.conversions = "转化次数";
        quotaObject.crate = "转化率";
        quotaObject.other = "其他";
        quotaObject.transformCost = "平均转化成本(事件)";
        quotaObject.visitNum = "唯一访客事件数";
        quotaObject.avgCost = "平均转化成本(页面)";
        quotaObject.benefit = "收益";
        quotaObject.profit = "利润";
        quotaObject.orderNum = "订单数";
        quotaObject.orderMoney = "订单金额";
        quotaObject.orderNumRate = "订单转化率";
        quotaObject.ec = "退出页次数";
        return function (key) {
            return quotaObject[key] || "未定义的指标KEY";
        };
    });

    /**
     * 指标帮助字符过滤器
     */
    app.filter("quotaHelpFormat", function () {
        var quotaObject = {};
        quotaObject.pv = "即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。";
        quotaObject.uv = "一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。";
        quotaObject.vc = "访客在您网站上的会话(Session)次数，一次会话过程中可能浏览多个页面。如果访客连续30分钟没有新开和刷新页面，或者访客关闭了浏览器，则当访客下次访问您的网站时，访问次数加1。";
        quotaObject.outRate = "只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。";
        quotaObject.ip = "一天之内您网站的独立访问ip数。";
        quotaObject.nuv = "一天的独立访客中，历史第一次访问您网站的访客数。";
        quotaObject.nuvRate = "新访客比率=新访客数/访客数。";
        quotaObject.arrivedRate = "抵达率=访问次数/点击量。即访客点击广告到完全打开网站次数的比例。";
        quotaObject.pageConversion = "如果您认为网站上的某个页面特别重要(如表单提交后出现的“提交成功”页面)，到达了该页面表示访客完成了您的期望，您可以将到达您设定的目标作为一种转化来统计。";
        quotaObject.eventConversion = "客户点击您期望触发的事件，并且这个事件被设置为转化目标，那么这样的用户操作就是一次事件转化。";
        quotaObject.avgTime = "访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。";
        quotaObject.avgPage = "平均每次访问浏览的页面数量，平均访问页数=浏览量/访问次数。";
        quotaObject.cost = "推广被点击后产生的费用。";
        quotaObject.impression = "一段时间内广告展现的次数。";
        quotaObject.click = "一段时间内推广被点击的次数。";
        quotaObject.ctr = "点击率＝点击量/展现量，较高的点击率反映了网民对您的推广结果更感兴趣、更为认可。点击率是影响关键词质量度的重要因素。";
        quotaObject.acp = "平均每次点击产生的消费。平均点击价格=消费金额/点击次数。";
        quotaObject.cpc = "平均每次点击产生的消费。平均点击价格=消费金额/点击次数。";
        quotaObject.cpm = "获得一千次展现机会所付出的推广费用";
        quotaObject.conversion = "即指潜在客户完成一次您期望的行动。";
        quotaObject.entrance = "作为访问会话的入口页面（也称着陆页面）的次数。";
        quotaObject.contribution = "指以该页面作为入口产生的浏览量（PV）总计。";
        quotaObject.freq = "访客点击搜索结果到达您网站的次数。";
        quotaObject.baidu = "来自搜索引擎百度的搜索次数占比";
        quotaObject.sougou = "来自搜索引擎搜狗的搜索次数占比";
        quotaObject.haosou = "来自搜索引擎好搜的搜索次数占比";
        quotaObject.bing = "来自搜索引擎必应的搜索次数占比";
        quotaObject.other = "来自其他搜索引擎的搜索次数占比";
        quotaObject.conversions = "访客到达转化目标页面的次数。";
        quotaObject.clickTotal = "事件点击总数";
        quotaObject.crate = "转化率=转化次数/访问次数。";
        quotaObject.benefit = "预期每次转化收益*转化次数。";
        quotaObject.orderNumRate = "订单转化数/访问次数。";
        quotaObject.visitNum = "一个用户进行一次操作记录一次唯一访客事件数，但同一个用户多次点击同一个按钮不重复计算。";
        quotaObject.clickTotal = "操作发生的次数。";
        quotaObject.ec = "作为访问会话最后一个浏览页面（即退出页面）的次数。";
        quotaObject.transformCost = "平均转化成本=消费/转化次数";
        return function (key) {
            return quotaObject[key] || "未定义的指标KEY";
        };
    });

    /**
     * 指标显示数据计算器
     */
    app.filter("quotaDataFormat", function () {
        return function (value, label, count) {
            if (value == "--") { // 处理特殊数据
                return value;
            }
            switch (label) {
                case "nuvRate":
                case "outRate":
                case "arrivedRate":
                case "baidu":
                case "sougou":
                case "haosou":
                case "bing":
                case "other":
                {
                    if (value.indexOf && value.indexOf("%") != -1) {// 缓存中的数据使用
                        return value;
                    }
                    return count ? (value == 0 ? "0.00%" : (value / count).toFixed(2) + "%") : "0.00%";
                }
                case "avgTime":
                {
                    if (value.indexOf && value.indexOf(":") != -1) {// 缓存中的数据使用
                        return value;
                    }
                    return MillisecondToDate(value / count);
                }
                case "freq":
                {
                    return count ? value : "0";
                }
                case "cost":
                case "cpc":
                {
                    return value ? value.toFixed(2) : value;
                }
                case "impression":
                case "cpm":
                case "conversion":
                {
                    return count ? value : "0";
                }
                case "ctr":
                {
                    if (value.indexOf && value.indexOf("%") != -1) {// 字符串且存在符号%
                        if (value == "0%") {
                            return "0.00%";
                        }
                        return value;
                    }
                    return count ? (value == 0 ? "0.00%" : (value / count).toFixed(2) + "%") : "--";
                }
                case "acp":
                case "avgPage":
                {
                    return count ? (value == 0 ? "0" : (value / count).toFixed(2)) : "0";
                }
                default :
                {
                    return value ? value + "" : "0";
                }
            }
        };
    });
});