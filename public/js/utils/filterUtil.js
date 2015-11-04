var filterUtil = {
    filter: function (allFilters,element,filter) {
        if(allFilters == null || allFilters ==undefined || allFilters =="") {
            allFilters = [];
        }
            var _index = allFilters.elementHasOwnProperty(element);
            if(_index != -1) {
                if(filter != "") {
                    allFilters[_index] = filter;
                } else {
                    this.splice(_index,1);
                }
            } else {
                if(filter != "") {
                    allFilters.push(filter);
                }
            }
        return allFilters;
    }
}