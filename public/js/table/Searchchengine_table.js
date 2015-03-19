/**
 * Created by john on 2015/3/12.
 */
$(function () {
    Searchchengine();
});
function Searchchengine() {
    jQuery("#Searchchengine_table").jqGrid({
        url: 'json/vistior.json',
        datatype: "json",
        height: 200,
        colNames: ['搜索引擎','浏览量(PV)', '访客数(UV)', '订单数', '订单金额', '订单转化', '访问页数'],
        colModel: [
            {name: 'id', index: 'id', align: "center",classes: 'xuhao_color'},
            {name: 'invdate', index: 'invdate',align: "center"},
            { name: 'name',index: 'name', align: "center" },
            {name: 'amount', index: 'amount',  align: "center"},
            {name: 'tax', index: 'tax',align: "center"     },
            {name: 'total', index: 'total',  align: "center"},
            { name: 'note',  index: 'note',  sortable: false,hidden:true   }
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
            {name: ['No', 'Item', 'Qty', 'Unit', 'Line Total']
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