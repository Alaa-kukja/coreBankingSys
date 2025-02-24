define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class accInterest {
        /**
         *@description
         * @returns
         */

        constructor() {
            this.docNo = ko.observable(null);
            this.accDocNo = ko.observable(null);
            this.intNo = ko.observable(null);
            this.startDate = ko.observable(null);
            this.linkType = ko.observable(null);
            this.status = ko.observable(null);
        }

        _init(docNo, accDocNo, intNo, startDate, linkType, status) {
            this.docNo(docNo);
            this.accDocNo(accDocNo);
            this.intNo(intNo);
            this.startDate(startDate);
            this.linkType(linkType);
            this.status(status);
        }

        fields() {
            const result = {
                DOC_NO: this.docNo(),
                ACC_DOC_NO: this.accDocNo(),
                INT_NO: this.intNo(),
                START_DATE: this.startDate(),
                LINK_TYPE: this.linkType(),
                STATUS: this.status(),
            };
            return result;
        }

        _clear() {
            this.docNo(null);
            this.accDocNo(null);
            this.intNo(null);
            this.startDate(null);
            this.linkType(null);
            this.status(null);
        }
    }
    return new accInterest();
});