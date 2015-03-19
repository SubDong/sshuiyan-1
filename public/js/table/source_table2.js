/**
 * Created by john on 2015/3/12.
 */
$(function () {
    pageInit3();
});
function pageInit3() {
    jQuery("#vistior_table2").jqGrid({
        url: 'json/vistior.json',
        datatype: "json",
        height: 200,
        colNames: ['来源类型 ', '浏览量占比', '访问次数', '新访客数', 'IP数', '平均访问页数','订单转化率'],
        colModel: [
            {name: 'id', index: 'id',align: "center",classes: 'xuhao_color' ,formatter: 'link'},
            {name: 'invdate', index: 'invdate',align: "center"},
            { name: 'name',index: 'name', align: "center" },
            {name: 'amount', index: 'amount',  align: "center"},
            {name: 'tax', index: 'tax',align: "center"     },
            {name: 'total', index: 'total',  align: "center"},
            { name: 'note',  index: 'note',  sortable: false   }
        ],
        rowNum: 10,
        rowList: [10, 20, 30],
        pager: '#pager2',
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        multiselect: false,
        subGrid: true,
        subGridUrl:'json/templateData.json',
        subGridModel: [
            {name: ['id', 'invdate', 'name', 'amount', 'tax']
                , width: [55, 200, 80, 80, 80]}],
        loadui: 'disable',
        altRows: true,
        footerrow: true,
        userDataOnFooter: true,
        altclass: 'table_color',
        rownumbers: true,
        autowidth: true
    });
}