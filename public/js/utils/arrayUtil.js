if (!Array.targetIndexOf) {
    Array.prototype.targetIndexOf = function (Object) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == Object) {
                return i;
            }
        }
        return -1;
    }
}

if (!Array.elementHasOwnProperty) {
    Array.prototype.elementHasOwnProperty = function (property) {
            for(var i = 0; i<this.length; i++) {
                if(this[i].hasOwnProperty(property) ) {
                    return i;
                }
            }
        return -1;
    }
}