/**
 * Created by MrDeng on 2015/6/18.
 */

var dao = require('../db/daos');
var config_request = {


    /**
     * 刷新站点信息的Redis配置
     * @param redisClient
     * @param track_id
     */

     refreshSiteRedis : function (redisClient, track_id) {
        //由track_id查询站点配置
        var qry = {
            track_id: track_id
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                console.log("查询到站点结果");
                docs.forEach(function (item) {
                    var siteconfig = {
                        siteid: item._id.toString(),//站点ID 对应MongoDb _id
                        siteurl: item.site_url,//站点URL
                        sitepause: item.site_pause//站点暂停状态，false启用，true暂停
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
                    redisClient.multi().set("typeid:".concat(item.track_id), item.type_id)//
                        .set("ts:" + item.track_id, item._id)//
                        .set("st:" + item._id, item.track_id)//
                        .set("tsj:" + item.track_id, JSON.stringify(siteconfig))
                        //.set(ins._id + ":mouse:" + ins.site_url, JSON.stringify(config_mouse))//目前无具体URL配置 暂时设置在站点上
                        .set("duration:" + item._id, JSON.stringify(time_config))//站点级别设置
                        .set("visit:" + item._id, JSON.stringify(pv_config)).exec();
                    var cqry = {
                        uid: item.uid,
                        site_id: item._id
                    }
                    console.log("查询时长转化");
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
                                redisClient.multi().set("duration:" + docs[0].site_id, JSON.stringify(time_config))//站点级别设置
                                    .set("visit:" + docs[0].site_id, JSON.stringify(pv_config)).exec();
                            }
                        }
                    });
                });
            }
            // TODO 为什么要去差redis
        });


    },

     refreshPageTileRedis : function (redisClient, track_id, page_url) {
        //由track_id查询站点配置
        var qry = {
            track_id: track_id,
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

                        if (pdocs != null && pdocs.length == 1) {
                            var page_title = {
                                page_url: pdocs[0].page_url,
                                icon_name: pdocs[0].icon_name,
                                is_open: pdocs[0].is_open
                            }
                            //通过site_id 去获取track_id
                            if (pdocs[0].site_id != null && pdocs[0].page_url != null) {
                                //console.log("重写"+(pdocs[0].site_id + ":mouse:" + pdocs[0].page_url)+"-->"+JSON.stringify(page_title))
                                redisClient.multi().set(pdocs[0].site_id + ":mouse:" + pdocs[0].page_url, JSON.stringify(page_title)).exec();//站点级别设置
                            }
                        }

                    });
                });
            }
            // TODO 为什么要去差redis
        });


    },

     refreshEventRedis : function (redisClient, track_id, event_page) {
        //由track_id查询站点配置
        var qry = {
            track_id: track_id,
        }
        dao.find("sites_model", JSON.stringify(qry), null, {}, function (err, docs) {
            if (docs != null && docs.length > 0) {
                console.log("重写")
                docs.forEach(function (item) {
                    var pqry = {
                        root_url: item.site_id,
                        uid: item.uid,
                        event_page: event_page
                    }
                    dao.find("event_change_model", JSON.stringify(pqry), null, {}, function (err, edocs) {
                        //存储时长转化和PV转化到Redsi
                        if (edocs != null && edocs.length > 0) {//存在配置
                            var confs = [];
                            edocs.forEach(function (item) {
                                var event_config = {
                                    eid: item.event_id,//事件ID
                                    evttag: item.event_name,//事件名称
                                    evpage: event_page//事件页面
                                };
                                confs.push(event_config);
                            });
                            //console.log("重写"+(item.root_url + ":e:" + event_page)+"-->"+JSON.stringify(confs))
                            redisClient.multi().set(item.root_url + ":e:" + event_page, JSON.stringify(confs)).exec();
                        }

                    });
                });
            }
            // TODO 为什么要去差redis
        });


    }
}
module.exports = config_request;