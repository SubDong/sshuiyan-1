// schema types 参考 http://mongoosejs.com/docs/schematypes.html

var schemas = {

    //事件转化目标
   event_change_model: {
        model_name: "EventChange",
        collection_name: "conf_event_change",
        schema: {
            //_id: String, // mongoid
           uid: String, // user id 用户ID
           root_url:String, //根目录
           event_id:String,//事件ID
           event_name:String,//事件名称
           event_page: String, //事件作用页面
           create_date:String //创建时间
        }
    },
    //子目录管理
    subdirectories_model: {
        model_name: "Subdirectories",
        collection_name: "conf_subdirectories",
        schema: {
            //_id: String, // mongoid
            uid: String, // user id 用户ID
            root_url:String, //根目录
            subdirectory_url:String,//子目录
            is_regular:Boolean,//是否使用正则表达式
            analysis_url: String, //分析的目录
            not_analysis_url:String, //不分析的目录
            create_date:String //创建时间
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
            site_pause:Boolean,//配置暂停 true：暂停 false：使用
            track_status: String // track code status
            //status: String, // enable or disable track
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
            target_url: [String],//目标URL
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
                    step_urls: [{url:String}]//步骤URL 最多三个
                }]

            }],
            conv_tpye: String//转换类型，regist,communicate,place_order,othre_order
        },
        /**
         * 事件转化
         */
        event_conv_model: {
            model_name: "SubPaths",
            collection_name: "conf_event_conv",
            schema: {
                //id: String,
                uid: String,
                site_id: String, // 站点ID
                site_url: String,//网站地址
                event_name: String,//时间名称
                event_elem: String,//时间元素
                reg_enable: Boolean,
                name: String,
                paths: [String],
                ex_paths: [String]
            }
        }
    }
}
module.exports = schemas


