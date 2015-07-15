/**
 * Created by xiaowei on 15-7-15.
 */
var config = {
    pv: "pv_aggs.value",
    contribution: "cpv_aggs.cpv_aggs.value",
    uv: "uv_filter.uv_aggs.value",
    vc: "vc_aggs.vc_aggs.value",
    avgTime: {
        tvt: "max_aggs.value - min_aggs.value",
        vc: "vc_aggs.vc_aggs.value",
        avgTime: "Math.ceil(parseFloat(tvt) / 1000 / parseFloat((vc)))"
    },
    outRate: {
        vc: "vc_aggs.vc_aggs.value",
        sv: "single_visitor_aggs.buckets.length",
        svc: "parseInt(vc) - sv",
        outRate: "(parseFloat(svc) / parseFloat(vc) * 100).toFixed(2)"
    },
    arrivedRate: "vc_aggs.value",
    avgPage: {
        pv: "pv_aggs.value",
        uv: "vc_aggs.vc_aggs.value",
        avgPage: "(parseFloat(pv) / parseFloat(uv)).toFixed(2)"
    },
    conversions: "doc_count",
    pageConversion: "",
    eventConversion: "",
    ip: "ip_aggs.ip_aggs1.value",
    nuv: "new_visitor_aggs.nuv_aggs.value",
    nuvRate: {
        nuv: "new_visitor_aggs.nuv_aggs.value",
        uv: "uv_filter.uv_aggs.value",
        nuvRate: "(parseFloat(nuv) / parseFloat(uv) * 100).toFixed(2)"
    }
}
