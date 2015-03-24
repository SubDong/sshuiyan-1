/**
 * Created by john on 2015/3/12.
 */
$(function () {
    pagetitle_table();
});
function pagetitle_table() {
    jQuery("#pagetitle_table").jqGrid({
        url: 'json/vistior.json',
        datatype: "json",
        height: 400,
        colNames: ['点击图名称', '想统计的页面', '统计范围', '状态', '创建日期', '访问时长', '访问页数'],
        colModel: [
            {name: 'id', index: 'id', width: 30, align: "center", classes: 'xuhao_color'},
            {name: 'invdate', index: 'invdate', align: "center", formatter: 'link'},
            {name: 'name', index: 'name', align: "center"},
            {name: 'amount', index: 'amount', align: "center"},
            {name: 'tax', index: 'tax', align: "center"},
            {name: 'total', index: 'total', align: "center", hidden: true},
            {name: 'note', index: 'note', sortable: false, hidden: true}
        ],
        rowNum: 20,
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