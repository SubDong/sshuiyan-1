var filterUtil = {
    filter: function (allFilters,element,filter) {
        if(allFilters == null || allFilters ==undefined || allFilters =="") {
            allFilters = [];
        }
            //搜素是否存在该元素
            var _index = allFilters.elementHasOwnProperty(element);
            //已存在
            if(_index != -1) {
                //替换
                if(filter != "") {
                    allFilters[_index](filter);
                //删除
                } else {
                    allFilters.remove(_index);
                }
            } else {
                if(filter != "") {
                    allFilters.push(filter);
                }
            }

        return allFilters;
    }
}