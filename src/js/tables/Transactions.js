define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class transaction {
        /**
         *@description
         * @returns
         */

        constructor() {
            this.transNo = ko.observable(null);
            this.clientNo = ko.observable(null);
            this.writer = ko.observable(null);
            this.checker = ko.observable(null);
            this.transferor = ko.observable(null);
            this.canceler = ko.observable(null);
            this.status = ko.observable(null);
            this.subSystem = ko.observable(null);
            this.functionCode = ko.observable(null);
            this.execDate = ko.observable(null);
            this.regDate = ko.observable(null);
            this.notesNo = ko.observable(null);
            this.checkDate = ko.observable(null);
            this.cancelDate = ko.observable(null);
            this.transferDate = ko.observable(null);
            this.noteClientNo = ko.observable(null);
            this.moneySource = ko.observable(null);
            this.moneyDestClientNo = ko.observable(null);
            this.amlAmount = ko.observable(null);
            this.corBy = ko.observable(null);
            this.corFor = ko.observable(null);
            this.execBranchNo = ko.observable(null);
            this.orgBranchNo = ko.observable(null);
            this.orgTransNo = ko.observable(null);
            this.cashCode = ko.observable(null);
            this.cashDate = ko.observable(null);
            this.cashRegDate = ko.observable(null);
            this.cashClientNo = ko.observable(null);
            this.currencyNo = ko.observable(null);
            this.moneyRel = ko.observable(null);
            this.brStatus = ko.observable(null);
            this.brStatusReason = ko.observable(null);

            this.notesNo = ko.observable(null);
        }

        async getNewTransactionNo(toDO = null) {
            const nIdCommand = {
                token: localStorage.getItem('token'),
                table: 'NOTES',
                select: [`MAX(NOTES.NOTES_NO)||'N' ID`],
            };
            const idCommand = {
                token: localStorage.getItem('token'),
                table: 'TRANSACTIONS',
                select: [`MAX(TRANSACTIONS.TRANS_NO)||'T' ID`],
                union: [],
            };
            idCommand.union.push(nIdCommand);
            Promise.all([serviceUtils.ajaxSendRequest('getTable', idCommand)])
                .then(
                    await async function (values) {
                        let array;
                        if (values) {
                            if (values.length > 0) {
                                array = coreUtils.parseJSON(values[0]);
                                if (array.error) error = array.console;
                                else {
                                    for (let index = 0; index < array.length; index++) {
                                        const element = array[index];
                                        if (element.indexOf('N') > -1) {
                                            this.notesNo(parseInt(element.slice(0, -1)) + 1);
                                        } else this.transNo(parseInt(element.slice(0, -1)) + 1);
                                    }
                                    if (toDO != null) await toDO(array);
                                }
                            }
                        }
                        return true;
                    }.bind(this)
                )
                .catch(
                    function (reason) {
                        console.log(reason);
                        //this.clientTransactions('');
                    }.bind(this)
                );
        }

        fields() {
            const result = {
                TRANS_NO: this.transNo(),
                CLIENT_NO: this.clientNo(),
                WRITER: this.writer(),
                CHECKER: this.checker(),
                TRANSFEROR: this.transferor(),
                CANCELER: this.canceler(),
                STATUS: this.status(),
                SUB_SYSTEM: this.subSystem(),
                FUNCTION_CODE: this.functionCode(),
                EXEC_DATE: this.execDate(),
                REG_DATE: this.regDate(),
                NOTES_NO: this.notesNo(),
                CHECK_DATE: this.checkDate(),
                CANCEL_DATE: this.cancelDate(),
                TRANSFER_DATE: this.transferDate(),
                NOTE_CLIENT_NO: this.noteClientNo(),
                MONEY_SOURCE: this.moneySource(),
                MONEY_DEST_CLIENT_NO: this.moneyDestClientNo(),
                AML_AMOUNT: this.amlAmount(),
                COR_BY: this.corBy(),
                COR_FOR: this.corFor(),
                EXEC_BRANCH_NO: this.execBranchNo(),
                ORG_BRANCH_NO: this.orgBranchNo(),
                ORG_TRANS_NO: this.orgTransNo(),
                CASH_CODE: this.cashCode(),
                CASH_DATE: this.cashDate(),
                CASH_REG_DATE: this.cashRegDate(),
                CASH_CLIENT_NO: this.cashClientNo(),
                CURRENCY_NO: this.currencyNo(),
                MONEY_REL: this.moneyRel(),
                BR_STATUS: this.brStatus(),
                BR_STATUS_REASON: this.brStatusReason(),
            };
            return result;
        }

        _clear() {
            this.transNo(null);
            this.clientNo(null);
            this.writer(null);
            this.checker(null);
            this.transferor(null);
            this.canceler(null);
            this.status(null);
            this.subSystem(null);
            this.functionCode(null);
            this.execDate(null);
            this.regDate(null);
            this.notesNo(null);
            this.checkDate(null);
            this.cancelDate(null);
            this.transferDate(null);
            this.noteClientNo(null);
            this.moneySource(null);
            this.moneyDestClientNo(null);
            this.amlAmount(null);
            this.corBy(null);
            this.corFor(null);
            this.execBranchNo(null);
            this.orgBranchNo(null);
            this.orgTransNo(null);
            this.cashCode(null);
            this.cashDate(null);
            this.cashRegDate(null);
            this.cashClientNo(null);
            this.currencyNo(null);
            this.moneyRel(null);
            this.brStatus(null);
            this.brStatusReason(null);

            this.notesNo(null);
        }
    }
    return new transaction();
});
