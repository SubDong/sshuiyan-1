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
    refreshSiteRedis: function (redis_client, trackid,cb) {
        //由track_id查询站点配置
        var qry = {
            track_id: trackid
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                //console.log("查询到站点结果");
                docs.forEach(function (item) {
                    var siteconfig = {
                        siteid: item._id.toString(),//站点ID 对应MongoDb _id
                        siteurl: item.site_url,//站点URL
                        sitepause: item.site_pause,//站点暂停状态，false启用，true暂停
                        icon:item.icon ==undefined?1:item.icon
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
                    reut = {};//返回值
                    redis_client.multi().set("typeid:".concat(item.track_id), item.type_id)//
                        .set("ts:" + item.track_id, item._id)//
                        .set("st:" + item._id, item.track_id)//
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
                    //console.log("查询时长转化");
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
                        cb(err,reut);
                    });
                });
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
                        reut = {};//返回值
                        if (pdocs != null && pdocs.length == 1) {
                            var page_title = {
                                page_url: pdocs[0].page_url,
                                icon_name: pdocs[0].icon_name,
                                is_open: pdocs[0].is_open
                            }
                            //通过site_id trackid
                            if (pdocs[0].site_id != null && pdocs[0].page_url != null) {
                                //console.log("重写"+(pdocs[0].site_id + ":mouse:" + pdocs[0].page_url)+"-->"+JSON.stringify(page_title))
                                redis_client.multi().set(pdocs[0].site_id + ":mouse:" + pdocs[0].page_url, JSON.stringify(page_title)).exec();//站点级别设置
                                reut[pdocs[0].site_id + ":mouse:" + pdocs[0].page_url] = JSON.stringify(page_title);//热力图
                            }
                        }
                        return reut;
                    });
                });
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
                //console.log("重写")
                docs.forEach(function (item) {
                    var pqry = {
                        root_url: item._id,
                        uid: item.uid,
                        event_page: event_page
                    }
                    dao.find("event_change_model", JSON.stringify(pqry), null, {}, function (err, edocs) {
                        //存储时长转化和PV转化到Redsi
                        if (edocs != null && edocs.length > 0) {//存在配置
                            var confs = [];
                            reut = {};//返回值
                            edocs.forEach(function (ev) {
                                var event_config = {
                                    eid: ev.event_id,//事件ID
                                    evttag: ev.event_name,//事件名称
                                    evpage: ev.event_page//事件页面
                                };
                                confs.push(event_config);
                            });
                            //console.log(item)
                            //console.log("重写"+(item._id + ":e:" + event_page)+"-->"+JSON.stringify(confs))
                            redis_client.multi().set(item._id + ":evt:" + event_page, JSON.stringify(confs)).exec();
                            reut[item._id + ":evt:" + event_page] = JSON.stringify(confs);
                            return reut;
                        }

                    });
                });
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
    adTrackRedis: function(redisClient, trickid, produceUrl){
        var qry = {
            track_id: trickid
        };
        dao.find('sites_model', JSON.stringify(qry), null, {}, function(err, smDocs){
            if(smDocs != null && adDocs.length > 0){
                smDocs.forEach(function(item){
                    var smQuery = {
                        site_id: item._id,
                        uid: item.uid,
                        produceUrl: produceUrl
                    };
                    dao.find('adtrack_model', JSON.stringify(smQuery), null, {}, function(err, amDocs){
                        if(amDocs != null && amDocs.length > 0) {
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
                            result["ad:" + produceUrl] =  JSON.stringify(_array);
                            return result;
                        }
                    });
                });
            };
        });
    }
}
module.exports = config_request;