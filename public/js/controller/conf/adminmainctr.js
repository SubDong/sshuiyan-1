/**
 * Created by john on 2015/4/1.
 */

define(["./module"], function (ctrs) {
    "use strict";

    ctrs.directive('adminmainctrRemoteValidation', function ($http, $cookieStore) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                elm.bind('keyup', function () {
                    var uid = $cookieStore.get("uid");
                    var url = "/config/site_list?type=search&query=" + JSON.stringify({
                            uid: uid,
                            site_url: scope.dialog_model.site_url,
                            is_use: 1
                        });
                    $http({method: 'GET', url: url}).
                        success(function (data, status) {
                            if (data.length > 0) {
                                ctrl.$setValidity('remote', false);
                            } else {
                                ctrl.$setValidity('remote', true);
                            }
                        }).
                        error(function (data, status, headers, config) {
                            ctrl.$setValidity('remote', false);
                        });


                });
            }
        };
    });

    ctrs.controller('adminmainctr', function ($scope, $q, $rootScope, $http, requestService, ngDialog, $cookieStore, $state) {
        /**
         * 对应Mongo
         * @type {{uid: string, type_id: string, track_id: string, site_url: string, site_name: string, site_pause: boolean, track_status: string}}
         */
        $scope.sites_model = {

            //_id: String, // mongoid
            uid: "", // user id 用户ID
            type_id: "", // es type id ( hidden in front-end) 对应ES ID
            track_id: "", // js track id 随机生成
            site_url: "", // site url 设置的URL
            site_name: "", // site name 设置的URL
            site_pause: false,//配置暂停 true：暂停 false：使用
            track_status: 0, // track code status
           icon:1,
            is_top: false,
            is_use: 1
        };
        $scope.dialog_model = {
            "site_url": "",
            "site_name": "",
            is_top: true,
            readOnly: "",
            add_update: ""
        };
        //table配置
        $rootScope.adminSetHtml = "<div class='mid_left'> <div class=\"ngdialog-tilte\">复制代码</div ><div class='copycode_content'><div id='base_code' class='mid_left_code'>" +
            "&lt;script&gt;\<br\>" +
            "var _pct= _pct|| [];\<br\>" +
            " (function() {\<br\>" +
            "   var hm = document.createElement(\"script\");\<br\>" +
            "   hm.src = \"//t.best-ad.cn/t.js?tid=ex_track_id\";\<br\>" +
            "   var s = document.getElementsByTagName(\"script\")[0];\<br\>" +
            "    s.parentNode.insertBefore(hm, s);\<br\>" +
            " })();\<br\>" +
            "&lt;/script&gt;" +
            "</div> <div class='mid_right'><button type='button' class='btn btn-default navbar-btn' ssh-clip=''  data-clipboard-target='base_code'>复制</div></button><ul type='disc'>" +
            "  <li>请将代码添加至网站全部页面的&lt;/head&gt;标签前；</li><li>建议在header.htm类似的页头模板页面中安装，以达到一处安装，全站皆有的效果；</li><li>如需在JS文件中调用统计分析代码，请直接去掉以下代码首尾的&lt;script type='text/javascript' &gt;与&lt;/script&gt;后，放入JS文件中即可；</li>" +
            "<li> 如果代码安装正确，一般20分钟 后,可以查看网站分析数据；</li></ul></div></div>";


        //配置默认指标
        $rootScope.checkedArray = ["_uid", "uid", "type_id", "track_id", "site_url", "site_name", "site_pause", "track_status_ch"];


        //配置默认指标
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 5,
                enableSorting: false
            },
            {
                name: "网站域名",
                displayName: "网站域名",
                field: "site_url",
                maxWidth: '',
                cellClass: 'table_admin',
                enableSorting: false
            },

            {
                name: "网站名称",
                displayName: "网站名称",
                field: "site_name",
                maxWidth: '',
                cellClass: 'table_admin_color',
                enableSorting: false
            },
            {
                name: "首页代码状态",
                displayName: "首页代码状态",
                field: "track_status_ch",
                maxWidth: 500,
                cellClass: 'table_admin_color',
                enableSorting: false
            },
            {
                name: "x7",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.gain(index,grid,row)'>" +
                "获取代码<span class='glyphicon glyphicon-file'></span></a></div>",
                maxWidth: 100,
                enableSorting: false
            },
            {
                name: "x2",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.viewSite(this,grid,row)' >查看网站概览</a></div>",
                maxWidth: 100,
                enableSorting: false
            },
            {
                name: "x3",
                displayName: "",
                cellTemplate: "<div class='btn-group table_admin' dropdown='' is-open='status.isopen'>" +
                "<a type='button' dropdown-toggle='' ng-disabled='disabled' aria-haspopup='true' aria-expanded='false'><span class='glyphicon glyphicon-cog'></span>设置 </a> <ul class='dropdown-menu' role='menu'>" +
                "<li><a href='#conf/webcountsite/countrules'>设置统计规则</a></li>" +
                "<li><a href='#conf/webcountsite/childlist'>设置子目录</a></li>" +
                "<li><a href='#conf/webcountsite/pagechange'>设置页面转化目标</a></li>" +
                "<li><a href='#conf/webcountsite/eventchange'>设置事件转化目标</a></li>" +
                "<li><a href='#conf/webcountsite/timechange'>设置市场转化目标</a></li>" +
                " <li><a href='#conf/webcountsite/adtrack'>设置指定广告跟踪</a></li>" +
                "</ul> </div>",
                maxWidth: 80,
                enableSorting: false
            },
            {
                name: "x4",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.stop(this,grid,row)'>{{grid.appScope.x4Text(row)}}</a></div>",
                maxWidth: 50,
                enableSorting: false
            },
            {
                name: "x5",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.onDelete(this,grid,row)' >删除</a></div>",
                maxWidth: 50,
                enableSorting: false
            },
            {
                name: "x6",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.onUpdate(this,grid,row)' >修改</a></div>",
                maxWidth: 50,
                enableSorting: false
            }

        ];


        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 6,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };


        $scope.viewSite = function (rootGrid,grid,row) {
            $rootScope.default = row.entity.site_name;     // default site
            //$rootScope.defaultType =row.entity.type_id;   // default site id
            $rootScope.siteId = row.entity.site_id;
            $rootScope.siteUrl = row.entity.site_url;
            $rootScope.userType = row.entity.type_id;
            $rootScope.userTypeName = row.entity.site_name;
            $rootScope.siteTrackId=row.entity.site_track_id;
            $state.go("index");
        }
        $scope.openAddDialog = function () {
            $scope.urlDialog = ngDialog.open({
                template: '../conf/Dialog/main_addDialog.html',
                className: 'ngdialog-theme-default admin_ngdialog',
                scope: $scope
            });
        };

        $scope.openUpdateDialog = function (index, row) {
            $scope.urlDialog = ngDialog.open({
                template: './conf/Dialog/main_UpdateDialog.html',
                className: 'ngdialog-theme-default admin_ngdialog ',
                scope: $scope
            });
            $scope.submitUpdate = function () {
                var updateurl = "/config/site_list?type=update&query=" + JSON.stringify({_id: row.entity._id}) + "&updates=" + JSON.stringify({
                        site_name: $scope.dialog_model.site_name,
                        is_top: $scope.dialog_model.is_top
                    });
                if ($scope.dialog_model.is_top || $rootScope.gridOptions.data.length > 1) {//若置顶 先使原来置顶变为False
                    $rootScope.gridOptions.data[0].is_top = false;
                    row.entity.is_top = true;
                    var url = "/config/site_list?type=update&query=" + JSON.stringify({
                            _id: $rootScope.gridOptions.data[0]._id
                        }) + "&updates=" + JSON.stringify({is_top: "false",icon:1});
                    $http({method: 'GET', url: url}).success(function (dataConfig, status) {
                        $http({method: 'GET', url: updateurl}).success(function (insData, status) {
                            if (status == 200)forceRowData(row.entity, index);
                        })
                    });
                } else {
                    $http({method: 'GET', url: updateurl}).success(function (insData, status) {
                        if (status == 200)forceRowData(row.entity, index);
                    })
                }
                $scope.urlDialog.close();
            };
        };
        $scope.onInsert = function () {
            //$scope.dialog_model.readOnly = "";
            $scope.dialog_model.site_url = "";
            $scope.dialog_model.site_name = "";
            $scope.dialog_model.is_top = false;
            //$scope.dialog_model.add_update = "add";
            $scope.openAddDialog();
        };
        $scope.onUpdate = function (rootGrid, grid, row) {
            $scope.dialog_model.readOnly = "readonly";
            $scope.dialog_model.site_url = row.entity.site_url;
            $scope.dialog_model.site_name = row.entity.site_name;
            $scope.dialog_model.is_top = row.entity.is_top;
            $scope.dialog_model.add_update = "update";
            $scope.openUpdateDialog(rootGrid.$parent.$parent.rowRenderIndex, row);
        };
        /**
         * 删除按钮响应
         * @param index
         * @param grid
         * @param row
         */
        $scope.onDelete = function (rootGrid, grid, row) {
            $scope.tip='<li> 删除后，百思慧眼将不在跟踪统计该目标，该目标的  历史数据会被删除且无法恢复。<br/><br/>您希望现在删除吗？</li>';
            $scope.onDeleteDialog = ngDialog.open({
                template: './conf/Dialog/common_diaolg.html',
                className: 'ngdialog-theme-default admin_ngdialog',
                scope: $scope
            });

            $scope.sure = function () {
                $scope.onDeleteDialog.close();
                var query = "/config/site_list?type=logicdelete&query=" + JSON.stringify({_id: row.entity._id});
                $http({
                    method: 'GET',
                    url: query
                }).success(function (dataConfig, status) {
                    $rootScope.gridOptions.data.remove(rootGrid.$parent.$parent.rowRenderIndex);
                });
            };
        };


        //暂停弹框
        $scope.stop = function (index, grid, row) {

            $scope.sure = function () {
                //关闭弹出窗
                $scope.urlDialog.close();

                //用户ID+url 确定该用户对某个网站是否进行配置
                var query = "/config/site_list?type=search&query={\"_id\":\"" + row.entity._id + "\"}";
                $http({
                    method: 'GET',
                    url: query
                }).success(function (dataConfig, status) {
                    if (dataConfig != null) {//不存在配置 save
                        row.entity.site_pause = !row.entity.site_pause;
                        var url = "/config/site_list?type=update&query={\"_id\":\"" + row.entity._id + "\"}&updates={\"site_pause\":\"" + row.entity.site_pause + "\"}";
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {

                        });
                        //if(config)
                    }
                });
            };
             $scope.tip = "";
            if (row.entity.site_pause) {
                $scope.tip = "确定重新启用？";
            } else {
                $scope.tip = "<li>注意</li><li>暂停后，您将不再分析该网站，直至您重新启用，你确定现在暂停使用吗？</li>"
            }

            $scope.urlDialog = ngDialog.open({
                template: './conf/Dialog/common_diaolg.html',
                className: 'ngdialog-theme-default admin_ngdialog',
                scope: $scope

            });

        };

        $scope.x4Text = function (row) {
            if (row.entity.site_pause) {
                return "重新启用";
            }
            return "暂停"
        };
        //获取代码弹框
        $scope.gain = function (index, grid, row) {
            var thtml = $rootScope.adminSetHtml.replace("ex_track_id", row.entity.track_id);
            $scope.urlDialog = ngDialog.open({
                template: thtml,
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });
        };

        //整理表格单行数据

        var forceRowData = function (rowData, index) {
            switch (rowData["track_status"]) {
                case 0:
                    rowData["track_status_ch"] = "待测试";
                    break;
                case 1:
                    rowData["track_status_ch"] = "正常";
                    break;
                case -1:
                    rowData["track_status_ch"] = "异常";
                    break;
                default :
                    rowData["track_status_ch"] = "未知";
                    break;
            }
            if (rowData.is_top && index > 0) {
                var temp = $rootScope.gridOptions.data[0];
                $rootScope.gridOptions.data[0] = rowData;
                $rootScope.gridOptions.data[index] = temp;
            }
        }
        /**
         * 初始化数据
         */
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var url = "/config/site_list?index=site_list&type=search&query=" + JSON.stringify({uid: uid, is_use: 1});
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.gridOptions.data = dataConfig;
                $scope.gridOptions.data.forEach(function (data, index) {
                    //$rootScope.gridOptions.data.push(0)
                    forceRowData(data, index);
                })
            });
        };
        refushGridData();
        /**
         * 增加网站配置时候 添加配置
         * @param cliecked
         */
        $scope.submitSave = function (cliecked) {
            //var site_id=$rootScope.userType;//从conf_sites中获取
            var model = angular.copy($scope.sites_model);
            model.site_url = $scope.dialog_model.site_url;//网站URL 页面输入
            model.site_name = $scope.dialog_model.site_name;//网站名称 页面输入
            model.is_top = $scope.dialog_model.is_top;
            model.uid = $cookieStore.get("uid");
            //用户ID+url 确定该用户对某个网站是否进行配置
            var query = "/config/site_list?type=search&query=" + JSON.stringify({
                    uid: model.uid,
                    site_url: model.site_url
                });
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                if (dataConfig == null || dataConfig.length == 0) {//不存在配置 save
                    var insurl = "/config/site_list?type=save&entity=" + JSON.stringify(model);
                    if (model.is_top) {//若置顶 先使原来置顶变为False
                        var url = "/config/site_list?type=update&query=" + JSON.stringify({
                                uid: $cookieStore.get("uid"),
                                is_top: true
                            }) + "&updates=" + JSON.stringify({is_top: false});
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {
                            $http({method: 'GET', url: insurl}).success(function (insData, status) {
                                if (status == 200) {
                                    $scope.gridOptions.data.push(insData);
                                    forceRowData($scope.gridOptions.data[$scope.gridOptions.data.length - 1], $scope.gridOptions.data.length - 1);
                                }
                            })
                        });
                    } else {
                        $http({method: 'GET', url: insurl}).success(function (insData, status) {
                            if (status == 200) {
                                $scope.gridOptions.data.push(insData);
                                forceRowData($scope.gridOptions.data[$scope.gridOptions.data.length - 1], $scope.gridOptions.data.length - 1);
                            }
                        })
                    }
                } else {
                    var upurl = "/config/site_list?type=update&query=" + JSON.stringify({_id: dataConfig[0]._id}) + "&updates=" + JSON.stringify({
                            site_name: $scope.dialog_model.site_name,
                            is_top: $scope.dialog_model.is_top, is_use: 1
                        });
                    dataConfig[0].is_use = 1;
                    if (model.is_top) {//若置顶 先使原来置顶变为False
                        var url = "/config/site_list?type=update&query=" + JSON.stringify({
                                uid: $cookieStore.get("uid"),
                                is_top: true
                            }) + "&updates=" + JSON.stringify({is_top: false});
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (up, status) {
                            $http({method: 'GET', url: upurl}).success(function (upuse, status) {
                                if (status == 200) {
                                    $scope.gridOptions.data.push(dataConfig[0]);
                                    forceRowData($scope.gridOptions.data[$scope.gridOptions.data.length - 1], $scope.gridOptions.data.length - 1);
                                }
                            })
                        });
                    } else {
                        $http({method: 'GET', url: upurl}).success(function (upuse, status) {
                            if (status == 200) {
                                $scope.gridOptions.data.push(dataConfig[0]);
                                forceRowData($scope.gridOptions.data[$scope.gridOptions.data.length - 1], $scope.gridOptions.data.length - 1);
                            }
                        })
                    }
                }
            });
            $scope.urlDialog.close();
        };
        var status_ch = function (status) {
            switch (status) {
                case 1:
                    return "正常";
                case -1:
                    return "异常";
                default :
                    return "未知";
            }
        };
        //修改mongodb中状态值与页面上的值
        var changeStatus = function (path, uid, statusNumber) {
            for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                if ($scope.gridOptions.data[i].site_url == path.split("/")[0]) {
                    $scope.gridOptions.data[i].track_status_ch = status_ch(statusNumber);
                    var model = angular.copy($scope.sites_model);
                    model.site_url = $scope.gridOptions.data[i].site_url;//网站URL 页面输入
                    model.site_name = $scope.gridOptions.data[i].site_name;//网站名称 页面输入
                    model.is_top = $scope.dialog_model.is_top;
                    model.uid = uid;
                    model.type_id = $scope.gridOptions.data[i].type_id;//更新传入
                    model.track_id = $scope.gridOptions.data[i].track_id;
                    model.track_status = statusNumber;//0，１状态值
                    var url = "/config/site_list?type=update&query={\"uid\":\"" + model.uid + "\",\"site_url\":\"" + path + "\"}&updates=" + JSON.stringify(model);
                    $http({method: 'GET', url: url}).
                        success(function (data, status) {
                            console.log("test")
                            if (status == "200") {
                                createDialog(status_ch(statusNumber), "成功");
                            } else {
                                createDialog(status_ch(statusNumber), "失败");
                            }
                        }).
                        error(function (data, status, headers, config) {
                        });
                }
            }
        };
        //输入框的提示
        function changeCss(value) {
            $("#web_list_nav_input").css("color", "red");
            $("#web_list_nav_input").prop("value", value);
        }

        function createDialog(value, checkStatus) {
            $scope.urlDialog = ngDialog.open({
                template: '\
              <div class="ngdialog-buttons" >\
              <span style="text-align: center">代码状态：' + value + '</span>\
              <br>\
              <span style="text-align: center">更新' + checkStatus + '</span>\
                </div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });

        }
        var userID = $cookieStore.get("uid");
        //代码检查方法
        $scope.codeCheck = function () {
            var path = $("#web_list_nav_input").prop("value");//输入框获取的path
            var uid = userID;
            if (path.trim().length > 0 && path.trim() != "不能为空") {
                if (uid == null) {
                    $scope.urlDialog = ngDialog.open({
                        template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li>该账户错误</li></ul>' + '<div class="ng-button-div">\
                  <button type="button" class="ngdialog-button ngdialog-button-secondary " ng-click="closeThisDialog(0)">返回</button></div></div>',
                        className: 'ngdialog-theme-default admin_ngdialog',
                        plain: true,
                        scope: $scope
                    });
                } else {
                    $http.get("/config/site_list?type=search&query={\"uid\":\"" + uid + "\",\"site_url\":\"" + path + "\"}").success(function (result) {
                        if (result == "null" || result == "") {
                            $scope.urlDialog = ngDialog.open({
                                template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li>该账户下不存在该路径</li></ul>' + '<div class="ng-button-div">\
                  <button type="button" class="ngdialog-button ngdialog-button-secondary " ng-click="closeThisDialog(0)">返回</button></div></div>',
                                className: 'ngdialog-theme-default admin_ngdialog',
                                plain: true,
                                scope: $scope
                            });
                        } else {
                            $http.get("cdapi/link?path=" + path).success(function (data) {
                                if (data == "error") {
                                    changeCss("网址输入失误");
                                } else {
                                    if (data != null || data != "") {
                                        if (data.match("404 Not Found") == null) {
                                            var k = Number((data.toString().split('tid=')[0].split('\"').length));
                                            console.log(data.toString().split("tid=")[0].split("\"")[k - 1].split("/").length)
                                            if (data.toString().split("tid=")[0].split("\"")[k - 1].split("/").length == 4) {
                                                if (data.toString().split("tid=").length > 1) {
                                                    var tid = data.toString().split("tid=")[1].split("\"")[0];
                                                    $http.get("/config/site_list?type=search&query={\"uid\":\"" + uid + "\",\"track_id\":\"" + tid + "\"}").success(function (result) {
                                                        if (result == "null" || result == "") {
                                                            $scope.urlDialog = ngDialog.open({
                                                                template: '\
                                                    <div class="ngdialog-buttons" >\
                                                    <span style="text-align: center">该账户下不存在该路径</span>\
                                                    </div>',
                                                                className: 'ngdialog-theme-default',
                                                                plain: true,
                                                                scope: $scope
                                                            });
                                                        } else {
                                                            changeStatus(path, uid, 1);
                                                        }
                                                    });
                                                } else {
                                                    changeStatus(path, uid, -1);
                                                }
                                            } else {
                                                changeStatus(path, uid, -1);
                                            }
                                        } else {
                                            changeCss("网址不存在");
                                        }

                                    } else {
                                        changeCss("网址不存在");
                                    }
                                }


                            });
                        }
                    });
                }


            } else {
                changeCss("不能为空");
            }
        };

        Custom.initCheckInfo();//页面check样式js调用
    });
})
;
