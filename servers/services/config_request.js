/**
 * Created by MrDeng on 2015/6/18.
 */

var dao = require('../db/daos');
var redis = require('../utils/redis');
var config_request = {


    /**
     * 刷新站点信息的Redis配置
     * @param redisClient
     * @param track_id
     */
    refreshSiteRedis: function (redis_client, trackid, cb) {
        //由track_id查询站点配置
        var qry = {
            track_id: trackid
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                ////console.log("查询到站点结果");
                docs.forEach(function (item) {
                    var siteconfig = {
                        siteid: item._id.toString(),//站点ID 对应MongoDb _id
                        siteurl: item.site_url,//站点URL
                        sitepause: item.site_pause,//站点暂停状态，false启用，true暂停
                        icon: item.icon == undefined ? 1 : item.icon
                    }
                    //默认存储时长转化和PV转化到Redis
                    var time_config = {
                        ttpause: false,
                        tttime: 30
                    }
                    var pv_config = {
                        pvpause: false,
                        pvtimes: 3
                    }
                    var reut = {};//返回值
                    redis_client.multi().set("typeid:".concat(item.track_id), item.type_id)//
                        .set("ts:" + item.track_id, item._id)//
                        .set("st:" + item._id, item.track_id)//
                        .set("tsu:" + item.track_id, item.site_url)
                        .set("tsj:" + item.track_id, JSON.stringify(siteconfig))
                        //.set(ins._id + ":mouse:" + ins.site_url, JSON.stringify(config_mouse))//目前无具体URL配置 暂时设置在站点上
                        .set("duration:" + item._id, JSON.stringify(time_config))//站点级别设置
                        .set("visit:" + item._id, JSON.stringify(pv_config)).exec();
                    reut["typeid:".concat(item.track_id)] = item.type_id;//track_id 对应type_id
                    reut["ts:" + item.track_id] = item.type_id;//track_id 对应 站点site_id
                    reut["st:" + item._id] = item.track_id;//站点site_id 对应 track_id
                    reut["tsj:" + item.track_id] = JSON.stringify(siteconfig);//track_id 对应站点JSON
                    reut["duration:" + item._id] = JSON.stringify(time_config);//track_id对应时长转化
                    reut["visit:" + item._id] = JSON.stringify(pv_config);//track_id 对应页面访问次数转化

                    var cqry = {
                        uid: item.uid,
                        site_id: item._id
                    }
                    ////console.log("查询时长转化");
                    dao.find("converts_model", JSON.stringify(cqry), null, {}, function (err, docs) {
                        if (docs != null && docs.length > 0) {//有更新 刷新配置
                            if (docs != null && docs.length > 0) {
                                //存储时长转化和PV转化到Redis
                                var time_config = {
                                    ttpause: docs[0].time_conv.status,
                                    tttime: docs[0].time_conv.val
                                }
                                var pv_config = {
                                    pvpause: docs[0].pv_conv.status,
                                    pvtimes: docs[0].pv_conv.val
                                }
                                //通过site_id 去获取track_id
                                redis_client.multi().set("duration:" + docs[0].site_id, JSON.stringify(time_config))//站点级别设置
                                    .set("visit:" + docs[0].site_id, JSON.stringify(pv_config)).exec();
                                reut["duration:" + item._id] = JSON.stringify(time_config);//track_id对应时长转化 使用已有配置覆盖
                                reut["visit:" + item._id] = JSON.stringify(pv_config);//track_id 对应页面访问次数转化 使用已有配置覆盖
                            }
                        }
                        cb(err, reut);
                    });
                });
            }else{
                cb(err, null);
            }
            // TODO 为什么要去差redis
        });


    },

    refreshPageTileRedis: function (redis_client, trackid, page_url) {
        //由track_id查询站点配置
        var qry = {
            track_id: trackid
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                docs.forEach(function (item) {
                    var pqry = {
                        site_id: item.site_id,
                        uid: item.uid,
                        page_url: page_url
                    }
                    dao.find("page_title_model", JSON.stringify(pqry), null, {}, function (err, pdocs) {
                        //存储时长转化和PV转化到Redsi
                        var reut = {};//返回值
                        if (pdocs != null && pdocs.length == 1) {
                            var page_title = {
                                page_url: pdocs[0].page_url,
                                icon_name: pdocs[0].icon_name,
                                is_open: pdocs[0].is_open
                            }
                            //通过site_id trackid
                            if (pdocs[0].site_id != null && pdocs[0].page_url != null) {
                                ////console.log("重写"+(pdocs[0].site_id + ":mouse:" + pdocs[0].page_url)+"-->"+JSON.stringify(page_title))
                                var tempRef = pdocs[0].page_url
                                if (tempRef!=undefined&&tempRef.indexOf("http://") > -1 && tempRef.length > 8)
                                    tempRef = tempRef.substring(7, tempRef.length)
                                if (tempRef!=undefined&&tempRef.indexOf("https://") > -1 && tempRef.length > 9)
                                    tempRef = tempRef.substring(8, tempRef.length)
                                if(tempRef!=undefined&&tempRef!=""&&tempRef[tempRef.length-1]=="/"){
                                    tempRef = tempRef.substring(0,tempRef.length-1)
                                }
                                redis_client.multi().set(pdocs[0].site_id + ":mouse:" + tempRef, JSON.stringify(page_title)).exec();//站点级别设置
                                reut[pdocs[0].site_id + ":mouse:" + tempRef] = JSON.stringify(page_title);//热力图
                            }
                        }
                        return reut;
                    });
                });
            }else{
                return null;
            }
            // TODO 为什么要去差redis
        });


    },

    refreshEventRedis: function (redis_client, trackid, event_page) {
        //由track_id查询站点配置
        var qry = {
            track_id: trackid
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                ////console.log("重写")
                docs.forEach(function (site) {
                    var pqry = {
                        root_url: site._id,
                    }
                    dao.find("event_change_model", JSON.stringify(pqry), null, {}, function (err, edocs) {
                        if (edocs != null && edocs.length > 0) {//存在配置
                            var confs = [];
                            var reut = {};//返回值
                            var hash={}
                            var configs=[]
                            edocs.forEach(function (item) {
                                var event_config = {
                                    eid: item.event_id,//事件ID
                                    evttag: item.event_name,//事件名称
                                    evpage: item.event_page,//事件页面
                                    evtarget: item.event_target,//是否为转化目标
                                    evpause:item.event_status==0?true:false,
                                    evtime: item.update_time//转化修改时间
                                };
                                if(hash[item.event_page]==undefined){
                                    hash[item.event_page] = configs.length
                                    var sconf = {}
                                    sconf["page"]= item.event_page
                                    sconf["config"]=[]
                                    sconf["config"].push(event_config);
                                    configs.push(sconf)
                                }else{
                                    configs[hash[item.event_page]]["config"].push(event_config);
                                }
                            });
                            if(configs!=null&&configs.length>0){
                                configs.forEach(function(confItem){
                                    var tempRef = confItem.page
                                    if (tempRef!=undefined&&tempRef.indexOf("http://") > -1 && tempRef.length > 8)
                                        tempRef = tempRef.substring(7, tempRef.length)
                                    if (tempRef!=undefined&&tempRef.indexOf("https://") > -1 && tempRef.length > 9)
                                        tempRef = tempRef.substring(8, tempRef.length)
                                    if(tempRef!=undefined&&tempRef!=""&&tempRef[tempRef.length-1]=="/"){
                                        tempRef = tempRef.substring(0,tempRef.length-1)
                                    }
                                    ////console.log("重树 刷新Redis：" + site._id + ":e:" + tempRef + " = " + JSON.stringify(confItem))
                                    redis_client.multi().set(site._id + ":e:" + tempRef, JSON.stringify(confItem.config)).exec();
                                    //redis_client.multi().set(site._id + ":e:" + tempRef, JSON.stringify(confs)).exec();
                                    reut[site._id + ":e:" + tempRef] = JSON.stringify(confItem.config);
                                })
                                return reut;
                            }
                            return null
                        }

                    });
                });
            }else{
                return null;
            }
            // TODO 为什么要去差redis
        });
    },

    refreshPageConvRedis: function (redis_client, trackid, event_page) {
        //由track_id查询站点配置
        var qry = {
            track_id: trackid
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                ////console.log("重写")
                docs.forEach(function (site) {
                    var pqry = {
                        site_id: site._id,
                    }
                    //console.log(pqry)
                    dao.find("page_conv_model", JSON.stringify(pqry), null, {}, function (err, pdocs) {
                        //console.log(pdocs)
                        if (pdocs != null && pdocs.length > 0) {//存在配置
                            var reut = {};//返回值
                            pdocs.forEach(function (item) {
                                if (item._id != undefined) {
                                    var tpaths = [];
                                    item.paths.forEach(function (path, index) {
                                        if (path.path_mark) {
                                            var pathsteps = []
                                            path.steps.forEach(function (step) {
                                                var stepurls = []
                                                step.step_urls.forEach(function (step_url) {
                                                    stepurls.push(step_url.url)
                                                })
                                                pathsteps.push(stepurls)
                                            })
                                            var tpath = {
                                                path_num: index + 1,
                                                steps: pathsteps
                                            }
                                            tpaths.push(tpath)
                                        }
                                    })
                                    var conf = {
                                        target_name: item.target_name,
                                        record_type: item.record_type,
                                        expected_yield: item.expected_yield,
                                        pecent_yield: item.pecent_yield,
                                        update_time : item.update_time,
                                        pause:item.is_pause,
                                        paths: tpaths,
                                    }
                                    item.target_urls.forEach(function (target_url) {
                                        var tempRef = target_url.url
                                        if (tempRef!=undefined&&tempRef.indexOf("http://") > -1 && tempRef.length > 8)
                                            tempRef = tempRef.substring(7, tempRef.length)
                                        if (tempRef!=undefined&&tempRef.indexOf("https://") > -1 && tempRef.length > 9)
                                            tempRef = tempRef.substring(8, tempRef.length)
                                        if(tempRef!=undefined&&tempRef!=""&&tempRef[tempRef.length-1]=="/"){
                                            tempRef = tempRef.substring(0,tempRef.length-1)
                                        }
                                        ////console.log("重树 page_conv 刷新Redis：" + site._id + ":pc:" + tempRef + " = " + JSON.stringify(conf))
                                        redis_client.multi().set(site._id + ":pc:" + tempRef, JSON.stringify(conf)).exec()
                                        reut[site._id + ":pc:" + tempRef] = JSON.stringify(conf);
                                    })
                                }

                            });
                            return reut
                        }

                    });
                });
            }else{
                return null;
            }
            // TODO 为什么要去差redis
        });
    },

    /**
     * 指定广告追踪的  redis  查询
     * @param redisClient
     * @param trickid
     * @param produceUrl
     */
    adTrackRedis: function (redisClient, trickid, produceUrl) {
        var qry = {
            track_id: trickid
        };
        dao.find('sites_model', JSON.stringify(qry), null, {}, function (err, smDocs) {
            if (smDocs != null && adDocs.length > 0) {
                smDocs.forEach(function (item) {
                    var smQuery = {
                        site_id: item._id,
                        uid: item.uid,
                        produceUrl: produceUrl
                    };
                    dao.find('adtrack_model', JSON.stringify(smQuery), null, {}, function (err, amDocs) {
                        if (amDocs != null && amDocs.length > 0) {
                            var _array = [];
                            var result = {};
                            amDocs.forEach(function (item) {
                                var adConfig = {
                                    //targetUrl : item.targetUrl,
                                    mediaPlatform: item.mediaPlatform,
                                    adTypes: item.adTypes,
                                    planName: item.planName,
                                    keywords: item.keywords,
                                    creative: item.creative
                                    //produceUrl: item.produceUrl
                                };
                                _array.push(adConfig);
                            });
                            redisClient.multi().set("ad:" + produceUrl, JSON.stringify(_array)).exec();
                            result["ad:" + produceUrl] = JSON.stringify(_array);
                            return result;
                        }
                    });
                });
            }else{
                return null;
            }
            ;
        });
    }
}
module.exports = config_request;