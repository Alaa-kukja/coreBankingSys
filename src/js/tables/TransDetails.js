define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class transDetail {
        /**
         *@description
         * @returns
         */

        constructor() {
            this.transNo = ko.observable(null);
            this.detailNo = ko.observable(null);
            this.docType = ko.observable(null);
            this.docNo = ko.observable(null);
            this.oldStatus = ko.observable(null);
            this.newStatus = ko.observable(null);
            this.operType = ko.observable(null);
        }

        _init(transNo, detailNo, docType, docNo, oldStatus, newStatus, operType) {
            this.transNo(transNo);
            this.detailNo(detailNo);
            this.docType(docType);
            this.docNo(docNo);
            this.oldStatus(oldStatus);
            this.newStatus(newStatus);
            this.operType(operType);
        }

        fields() {
            const result = {
                TRANS_NO: this.transNo(),
                DETAIL_NO: this.detailNo(),
                DOC_TYPE: this.docType(),
                DOC_NO: this.docNo(),
                OLD_STATUS: this.oldStatus(),
                NEW_STATUS: this.newStatus(),
                OPER_TYPE: this.operType(),
            };
            return result;
        }

        _clear() {
            this.transNo(null);
            this.detailNo(null);
            this.docType(null);
            this.docNo(null);
            this.oldStatus(null);
            this.newStatus(null);
            this.operType(null);
        }
    }
    return new transDetail();
});
