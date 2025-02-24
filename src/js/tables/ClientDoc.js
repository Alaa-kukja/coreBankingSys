define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class clientDoc {
        /**
         *@description
         * @returns
         */

        constructor() {
            this.clientNo = ko.observable(null);
            this.docNo = ko.observable(null);
            this.docType = ko.observable(null);
            this.type = ko.observable(null);
            this.docNoToTran = ko.observable(null);
            this.status = ko.observable(null);
            this.notesNo = ko.observable(null);
            this.utilNo = ko.observable(null);
            this.disAmount = ko.observable(null);
            this.disFromDate = ko.observable(null);
            this.disToDate = ko.observable(null);
            this.disCause = ko.observable(null);
            this.disAccountNo = ko.observable(null);

            this.transNo = ko.observable(null);
            this.detailNo = ko.observable(null);
            this.docType = ko.observable(null);
            this.docNo = ko.observable(null);
            this.oldStatus = ko.observable(null);
            this.newStatus = ko.observable(null);
            this.operType = ko.observable(null);
        }

        _init(transNo, detailNo, docType, docNo, oldStatus, newStatus, operType) {
            return {
                table: 'CLIENT_DOC',
                transNo: transNo,
                detailNo: detailNo,
                docType: docType,
                docNo: docNo,
                oldStatus: oldStatus,
                newStatus: newStatus,
                operType: operType,
                doBefore: 'getNewDocNo',
                doAfter: 'addToTransDetail',
                indent: 'INSERT',
                keys: { clientNo: this.clientNo },
                fields: this.fields(),
            };
        }

        fields() {
            const result = {
                CLIENT_NO: this.clientNo(),
                DOC_NO: this.docNo(),
                DOC_TYPE: this.docType(),
                TYPE: this.type(),
                DOC_NO_TO_TRAN: this.docNoToTran(),
                STATUS: this.status(),
                NOTES_NO: this.notesNo(),
                UTIL_NO: this.utilNo(),
                DIS_AMOUNT: this.disAmount(),
                DIS_FROM_DATE: this.disFromDate(),
                DIS_TO_DATE: this.disToDate(),
                DIS_CAUSE: this.disCause(),
                DIS_ACCOUNT_NO: this.disAccountNo(),
            };
            return result;
        }

        _clear() {
            this.clientNo(null);
            this.docNo(null);
            this.docType(null);
            this.type(null);
            this.docNoToTran(null);
            this.status(null);
            this.notesNo(null);
            this.utilNo(null);
            this.disAmount(null);
            this.disFromDate(null);
            this.disToDate(null);
            this.disCause(null);
            this.disAccountNo(null);

            this.transNo(null);
            this.detailNo(null);
            this.docType(null);
            this.docNo(null);
            this.oldStatus(null);
            this.newStatus(null);
            this.operType(null);
        }
    }
    return new clientDoc();
});
