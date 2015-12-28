// schema types 参考 http://mongoosejs.com/docs/schematypes.html

var schemas = {

    //趋向分析-昨日统计-表格
    trend_yesterday_table_model: {
        module_name: "config",//推广URL模块
        model_name: "TrendYesterdayTable",
        collection_name: "cache_trend_yesterday_table",
        schema: {
            typeId: String, // $rootScope.userType
            date: String,//日期
            filterKey: String,//通过过滤条件计算的KEY
            timeFrame: String,//时间范围
            pv: String, // 浏览量
            vc: String,//访问次数
            uv: String, //访客数
            nuv: String, //新访客数
            nuvRate: String,//新访客比率
            ip: String,//IP
            outRate: String,//跳出率
            avgTime: String, //平均访问时长
            avgPage: String //平均访问页数
        }
    },

    //趋向分析-昨日统计-聚合
    trend_yesterday_summary_model: {
        module_name: "config",//推广URL模块
        model_name: "TrendYesterdaySummary",
        collection_name: "cache_trend_yesterday_summary",
        schema: {
            typeId: String, //  $rootScope.userType
            filterKey: String,//通过过滤条件计算的KEY
            date: String,//日期
            pv: String, // 浏览量
            vc: String,//访问次数
            uv: String, //访客数
            nuv: String, //新访客数
            nuvRate: String,//新访客比率
            ip: String,//IP
            outRate: String,//跳出率
            avgTime: String, //平均访问时长
            avgPage: String //平均访问页数
        }
    },
    //事件转化目标
    event_change_model: {
        module_name: "config",//推广URL模块
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
            event_target: Boolean,//是否为事件转化目标
            update_time: Number, //事件插入更新时间
            event_status: String //事件状态 1：启动  0：暂停
        }
    },

    //子目录管理
    subdirectories_model: {
        module_name: "config",//推广URL模块
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
        module_name: "config",//推广URL模块
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
            icon: Number,//图标编号
            is_top: Boolean,//是否置顶
            is_use: Number,//是否使用 1使用 0停用 逻辑删除
            //百度推广信息
            bname:String,//百度帐号
            bpasswd:String,//百度帐号 密码
            rname:String,//备注
            ctime:Number,//创建时间
            token:String,//用户token
            account_id:Number//百度帐号ID
        }
    },
// 站点统计规则
    siterules_model: {
        module_name: "config",//推广URL模块
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
        module_name: "config",//推广URL模块
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
        module_name: "config",//推广URL模块
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
        module_name: "config",//推广URL模块
        model_name: "PageConvent",
        collection_name: "conf_page_conv",
        schema: {
            uid: String,//用户ID
            site_id: String, // 站点ID
            target_name: String,//目标名称
            target_urls: [{url: String}],//目标URL
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
            conv_text: String,
            update_time: Number,
            is_pause:Boolean//是否暂停使用
        }

    },
    page_conv_urls_model: {
        module_name: "config",//推广URL模块
        model_name: "EventConvUrls",
        collection_name: "conf_page_conv_urls",
        schema: {
            page_conv_id: String,
            path: Number,//路径 编号
            step_level: Number, //步骤 编号 等于层次
            urls: [String], //url
            is_leaf: Boolean,//是否未叶子
            purls: [String],//父步骤Url
            curls: [String]//子步骤Url
        }
    },
    /**
     * 页面转化
     */
    page_title_model: {
        module_name: "config",//推广URL模块
        model_name: "PageTitleConfig",
        collection_name: "conf_page_title",
        schema: {
            uid: String, // user id 用户ID
            site_id: String,    //站点ID
            page_url: String,//点击图页面
            icon_name: String,//点击图名称
            create_date: String,//创建日期
            is_open: Boolean//是否开启
        }

    },
    /**
     * mongodb 指定广告追踪 表结构
     */
    adtrack_model: {
        module_name: "config",//推广URL模块
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
    },
    mail_rules_model: {
        module_name: "config",//推广URL模块
        model_name: "Mail_Rules_Model",
        collection_name: 'conf_mail_rules',
        schema: {
            uid: String,//存入邮件规则的用户id
            site_id: String,
            type_id: String,
            mail_address: [String],//定时发送邮件地址
            schedule_rule: Number,//定时规则,0为每日,1为每周一,2为每月第一天
            schedule_date: String,//发送时刻
            send_type: Number,//发送数据类型,0为csv,1为html
            rule_url: String,//发送数据的url的页面
            start: Number,//来源变化榜开始时间
            end: Number,//来源变化榜开始时间
            startString: String,//来源变化榜开始时间字符串
            contrastStart: Number,//来源变化榜对比时间
            contrastEnd: Number,//来源变化榜对比时间
            contrastStartString: String,//来源变化榜对比时间字符串
            scale: String, //同类群组分析-规模
            dateRange: String,//同类群组分析-周期
            indicator: String, //同类群组分析-指标
            result_data: [],
            result_head_data: []
        }
    },
    /////////////////////推广URL 前端Schemas////////////////////////
    //计划
    compaign_model: {
        module_name: "tg_url",//推广URL模块
        model_name: "User_Compaign_Model",
        collection_name: "compaign",
        schema: {
            "cid": Number,
            "name": String,
            "off": [],
            "sp": Number,
            "d": Number,
            "pr": Number,
            "p": Boolean,
            "s": Number,
            "acid": Number,
            "bd": [],
            "rt": [],
            "exip": [],
            "neg": [],
            "exneg": [],
            "sd": [],
            "idc": [],
            "ls": Number
        }
    },

    adgroup_model: {
        module_name: "tg_url",//推广URL模块
        model_name: " Ad_Group_Model",
        collection_name: "adgroup",
        schema: {
            "agid": Number,
            "cid": Number,
            "name": String,
            "max": Number,
            "p": Boolean,
            "s": Number,
            "acid": Number
        }
    }

}
module.exports = schemas


