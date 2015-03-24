/**
 * Created by john on 2015/3/12.
 */
$(function () {
    Engine_table();
});
function Engine_table() {
    jQuery("#Engine_table").jqGrid({
        url: "json/templateData.json",
        datatype: "json",
        height: "100%",
        colNames: ['搜索词 ', '总搜索次数', '百度', 'Google', '搜狗', '其他', '占比'],
        colModel: [
            {name: 'id', index: 'id', align: "center", sortable: true, classes: 'xuhao_color'},
            {name: 'name', index: 'name asc, invdate', align: "center", formatter: 'link'},
            {name: 'invdate', index: 'invdate', formatter: 'number', align: "center"},
            {name: 'amount', index: 'amount', align: "center", formatter: 'number'},
            {name: 'tax', index: 'tax', align: "center", formatter: 'number'},
            {name: 'total', index: 'total', align: "center", formatter: 'number'},
            {name: 'note', index: 'note', align: "center"}
        ],
        rowNum: 10,
        rowList: [10, 20, 30],
        pager: 'pager',
        sortname: 'id',
        mtype: "post",
        viewrecords: true,
        sortorder: "desc",
        loadui: 'disable',
        altRows: true,
        footerrow: true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });

}
