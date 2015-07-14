// schema types 参考 http://mongoosejs.com/docs/schematypes.html

var schemas = {

    //趋向分析-昨日统计-表格
    trend_yesterday_table_model: {
        model_name: "TrendYesterdayTable",
        collection_name: "cache_trend_yesterday_table",
        schema: {
            date:String,//日期
            timeFrame:String,//时间范围
            pv: String, // 浏览量
            vc: String,//访问次数
            uv: String, //访客数
            nuv:String, //新访客数
            nuvRate:String,//新访客比率
            ip: String,//IP
            outRate: String,//跳出率
            avgTime: String, //平均访问时长
            avgPage: String //平均访问页数
        }
    },

    //趋向分析-昨日统计-聚合
    trend_yesterday_summary_model: {
        model_name: "TrendYesterdaySummary",
        collection_name: "cache_trend_yesterday_summary",
        schema: {
            date:String,//日期
            pv: String, // 浏览量
            vc: String,//访问次数
            uv: String, //访客数
            nuv:String, //新访客数
            nuvRate:String,//新访客比率
            ip: String,//IP
            outRate: String,//跳出率
            avgTime: String, //平均访问时长
            avgPage: String //平均访问页数
        }
    },
    //事件转化目标
    event_change_model: {
        model_name: "EventChange",
        collection_name: "conf_event_change",
        schema: {
            //_id: String, // mongoid
            uid: String, // user id 用户ID
            root_url: String, //根目录
            event_id: String,//事件ID
            event_name: String,//事件名称
            event_page: String, //事件作用页面
            event_method: String, //事件设置方式
            event_status: String //事件状态 1：启动  0：暂停
        }
    },
    //子目录管理
    subdirectories_model: {
        model_name: "Subdirectories",
        collection_name: "conf_subdirectories",
        schema: {
            //_id: String, // mongoid
            uid: String, // user id 用户ID
            root_url: String, //根目录
            subdirectory_url: String,//子目录
            is_regular: Boolean,//是否使用正则表达式
            analysis_url: String, //分析的目录
            not_analysis_url: String, //不分析的目录
            create_date: String//创建时间
        }
    },

    sites_model: {
        model_name: "Sites",
        collection_name: "conf_sites",
        schema: {
            //_id: String, // mongoid
            uid: String, // user id 用户ID
            type_id: String, // es type id ( hidden in front-end) 对应ES ID
            track_id: String, // js track id 随机生成
            site_url: String, // site url 设置的URL
            site_name: String, // site name 设置的URL
            site_pause: Boolean,//配置暂停 true：暂停 false：使用
            track_status: Number,// track code status
            //status: String, // enable or disable track
            is_top: Boolean,
            is_use:Number
        }
    },

// 站点统计规则
    siterules_model: {
        model_name: " SiteRules",
        collection_name: "conf_siterules",
        schema: {
            //id: String,
            uid: String,
            site_id: String,
            // 统一URL, 数组
            rules: [
                {
                    source: String, // 源url
                    convert: String // 转换url
                }
            ],

            ex_ips: [String],  // 排除IP
            ex_refer_urls: [String], // 排除来源网站
            ex_urls: [String], // 排除受访地址
            cross_sites: [String] // 跨域监控
        }
    },

// 转化目标
    converts_model: {
        model_name: "Converts",
        collection_name: "conf_converts",
        schema: {
            //id: String,
            uid: String,
            site_id: String,
            time_conv: {
                status: Boolean,
                val: Number
            },
            pv_conv: {
                status: Boolean,
                val: Number
            }
        }
    },

    subpaths_model: {
        model_name: "SubPaths",
        collection_name: "conf_subpaths",
        schema: {
            //id: String,
            uid: String,
            site_id: String, // 站点ID
            reg_enable: Boolean,
            name: String,
            paths: [String],
            ex_paths: [String]
        }
    },

    /**
     * 页面转化
     */
    page_conv_model: {
        model_name: "PageConvent",
        collection_name: "conf_page_conv",
        schema: {
            uid: String,//用户ID
            site_id: String, // 站点ID
            target_name: String,//目标名称
            target_url: [{url: String}],//目标URL
            record_type: String,//记录方式
            //收益设置
            expected_yield: Number,//预期收益
            pecent_yield: Number,//预期收益率
            //路径类型
            paths: [{
                path_name: String,//路径名称
                path_mark: Boolean,//只有经过此路径的目标记为转化
                steps: [{
                    step_name: String,//步骤名称
                    step_urls: [{url: String}]//步骤URL 最多三个
                }]

            }],
            conv_tpye: String,//转换类型，regist,communicate,place_order,othre_order
            conv_text: String
        }

    },
    /**
     * 页面转化
     */
    page_title_model: {
        model_name: "PageTitleConfig",
        collection_name: "conf_page_title",
        schema: {
            uid: String, // user id 用户ID
            site_id: String,    //站点ID
            page_url: String,//点击图页面
            icon_name: String,//点击图名称
            create_date:String,//创建日期
            is_open: Boolean//是否开启
        }

    },
    /**
     * mongodb 指定广告追踪 表结构
     */
    adtrack_model: {
        model_name: "ConfigAdtrack",
        collection_name: "t_configAdtrack",
        schema: {
            uid: String,            //用户ID
            site_id: String,        //站点ID
            targetUrl: String,      //目标URL
            mediaPlatform: String,  //媒体平台
            adTypes: String,        //广告类型
            planName: String,       //计划名称
            keywords: String,       //关键词
            creative: String,       //创意
            produceUrl: String      //产生后的URL
        }
    }


}
module.exports = schemas


