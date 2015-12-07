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
                if(this[i] != null && this[i] != undefined && this[i] != "") {
                    if(this[i].hasOwnProperty(property) ) {
                        return i;
                     }
                }
            }
        return -1;
    }
}



if (!Array.elementHasOwnPropertyValue) {
    Array.prototype.elementHasOwnPropertyValue = function (property,value) {
        for(var i = 0; i<this.length; i++) {
            if(this[i] != null && this[i] != undefined && this[i] != "") {
                if(this[i].hasOwnProperty(property) ) {
                    if(this[i][property] === value) {
                       return i;
                    }
                }
            }
        }
      return -1
    }
}

if (!Array.elementAddValue) {
    Array.prototype.elementAddValue = function (sourceProperty,sourceKey,targetProperty,targetValue) {
        for(var i = 0; i<this.length; i++) {
            if(this[i] != null && this[i] != undefined && this[i] != "") {
                if(this[i][sourceProperty] === sourceKey ) {
                    this[i][targetProperty] = targetValue;
                }
            }
        }
        return -1;
    }
}