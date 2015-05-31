// schema types 参考 http://mongoosejs.com/docs/schematypes.html

var sites = {
    id: String, // mongoid
    uid: String, // user id
    site_url: String, // site url
    site_name: String, // site name
    track_code: String, // js track id
    track_status: String, // track code status
    status: String, // enable or disable track
    type_id : String // es type id ( hidden in front-end)
}

// 站点统计规则
var siterules = {
    id: String,
    uid : String,
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

// 转化目标
var converts = {
    id: String,
    uid: String,
    time_conv: {
        status: Boolean,
        val: Number
    },
    pv_conv: {
        status: Boolean,
        val: Number
    }
}

var subpaths = {
    id: String,
    uid: String,
    site_id:String, // 站点ID
    reg_enable: Boolean,
    name: String,
    paths: [String],
    ex_paths: [String]
}

