/**
 * Created by john on 2015/3/12.
 */
$(function () {
    vister();
});
function vister() {
    jQuery("#vister").jqGrid({
        url: 'json/vistior.json',
        datatype: "json",
        height:"600",
        colNames: ['页面URL ', '浏览量(PV)', '访客数(UV)', '入口页次数', 'IP数', '平均访问页数','订单转化率'],
        colModel: [
            {name: 'id', index: 'id',align: "center",classes: 'xuhao_color' ,formatter: 'link'},
            {name: 'invdate', index: 'invdate',align: "center"},
            { name: 'name',index: 'name', align: "center" },
            {name: 'amount', index: 'amount',  align: "center"},
            {name: 'tax', index: 'tax',align: "center"  ,hidden:true    },
            {name: 'total', index: 'total',  align: "center",hidden:true },
            { name: 'note',  index: 'note',  sortable: false ,hidden:true  }
        ],
        rowNum:20,
        rowList: [20, 30, 40],
        pager: '#pager2',
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        multiselect: false,
        loadui: 'disable',
        altRows: true,
        footerrow: true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });
}
$(function () {
    overview_table();
});
function overview_table() {
    jQuery("#overview_table").jqGrid({
        url: 'json/vistior.json',
        datatype: "json",
        height:"600",
        colNames: ['页面URL ', '浏览量(PV)', '访客数(UV)', 'IP数', '入口页次数', '贡献下游浏览','退出页次数'],
        colModel: [
            {name: 'id', index: 'id',align: "center",classes: 'xuhao_color' ,formatter: 'link'},
            {name: 'invdate', index: 'invdate',align: "center"},
            { name: 'name',index: 'name', align: "center" },
            {name: 'amount', index: 'amount',  align: "center"},
            {name: 'tax', index: 'tax',align: "center"   },
            {name: 'total', index: 'total',  align: "center"},
            { name: 'note',  index: 'note',  sortable: false  }
        ],
        rowNum:20,
        rowList: [20, 30, 40],
        pager: '#pager2',
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        multiselect: false,
        loadui: 'disable',
        altRows: true,
        footerrow: true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });
}

$(function () {
    Indexoverview();
});
function Indexoverview() {
    jQuery("#Indexoverview").jqGrid({
        url: 'json/vistior.json',
        datatype: "json",
        height:"600",
        colNames: ['页面URL ', '访问次数', '访客数(UV)', '贡献浏览量', '平均访问时长', '转化次数','转化率'],
        colModel: [
            {name: 'id', index: 'id',align: "center",classes: 'xuhao_color' ,formatter: 'link'},
            {name: 'invdate', index: 'invdate',align: "center"},
            { name: 'name',index: 'name', align: "center" },
            {name: 'amount', index: 'amount',  align: "center"},
            {name: 'tax', index: 'tax',align: "center"   },
            {name: 'total', index: 'total',  align: "center"},
            { name: 'note',  index: 'note',  sortable: false  }
        ],
        rowNum:20,
        rowList: [20, 30, 40],
        pager: '#pager2',
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        multiselect: false,
        loadui: 'disable',
        altRows: true,
        footerrow: true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });
}