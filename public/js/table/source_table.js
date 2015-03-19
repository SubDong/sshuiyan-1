/**
 * Created by john on 2015/3/12.
 */
$(function () {
    pageInit4();
});
function pageInit4() {
    jQuery("#source_table").jqGrid({
        url: "json/templateData.json",
        datatype: "json",
        height: "100%",
        colNames: ['序号', '外部链接', '浏览量(PV)', '浏览量占比', '访客数(UV)', 'Total', 'Notes'],
        colModel: [
            {name: 'id', index: 'id', width: 20,align: "center",sortable:true,classes: 'xuhao_color',hidden:true},
            {name: 'name', index: 'name asc, invdate',align: "center" ,formatter: 'link' },
            {name: 'invdate', index: 'invdate',formatter: 'number',align: "center"},
            {name: 'amount', index: 'amount', align: "center", formatter: 'number'},
            {name: 'tax',index: 'tax',  align: "center",formatter: 'number' },
            {name: 'total', index: 'total',  align: "center", formatter: 'number',hidden:true},
            {name: 'note', index: 'note', hidden:true }
        ],
        rowNum : 10,
        rowList : [ 10, 20, 30 ],
        pager: 'pager',
        sortname : 'id',
        mtype : "post",
        viewrecords : true,
        sortorder : "desc",
        loadui: 'disable',
        altRows: true,
        footerrow : true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });

}
$(function () {
    source_table2();
});
function source_table2() {
    jQuery("#source_table2").jqGrid({
        url: "json/templateData.json",
        datatype: "json",
        height: "100%",
        colNames: ['序号', '外部链接', '浏览量(PV)', '浏览量占比', '访客数(UV)', 'Total', 'Notes'],
        colModel: [
            {name: 'id', index: 'id', width: 20,align: "center",sortable:true,classes: 'xuhao_color',hidden:true},
            {name: 'name', index: 'name asc, invdate',align: "center" ,formatter: 'link' },
            {name: 'invdate', index: 'invdate',formatter: 'number',align: "center"},
            {name: 'amount', index: 'amount', align: "center", formatter: 'number'},
            {name: 'tax',index: 'tax',  align: "center",formatter: 'number' },
            {name: 'total', index: 'total',  align: "center", formatter: 'number',hidden:true},
            {name: 'note', index: 'note', hidden:true }
        ],
        rowNum : 10,
        rowList : [ 10, 20, 30 ],
        pager: 'pager',
        sortname : 'id',
        mtype : "post",
        viewrecords : true,
        sortorder : "desc",
        loadui: 'disable',
        altRows: true,
        footerrow : true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });

}
