define([], function () {
    "use strict";
    class treeDataTransfer {
        constructor() {
            this.dataMap = new Map();
        }
        setData(type, data) {
            this.dataMap.set(type, data);
        }
        getData(type) {
            return this.dataMap.get(type);
        }
        clearData() {
            this.dataMap.clear();
        }
    }

    return new treeDataTransfer();
});