// schema types 参考 http://mongoosejs.com/docs/schematypes.html

var schemas = {

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
            track_status: String, // track code status
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
            site_id:String,
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
    }
}

module.exports = schemas


