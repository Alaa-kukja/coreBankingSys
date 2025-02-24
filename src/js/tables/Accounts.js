define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class accounts {
        /**
         *@description
         * @returns
         */

        constructor() {
            this.accountNo = ko.observable(null);
            this.parent = ko.observable(null);
            this.name = ko.observable(null);
            this.nature = ko.observable(null);
            this.type = ko.observable(null);
            this.roundingPeriod = ko.observable(null);
            this.statementPeriod = ko.observable(null);
            this.currencyNo = ko.observable(null);
            this.status = ko.observable(null);
            this.roundDebBalance = ko.observable(null);
            this.roundCrdBalance = ko.observable(null);
            this.debBalance = ko.observable(null);
            this.crdBalance = ko.observable(null);
            this.notesNo = ko.observable(null);
            this.atmRsrvAmount = ko.observable(null);
            this.atmCardNo = ko.observable(null);
            this.exceedAmount = ko.observable(null);
            this.exceedLimitDate = ko.observable(null);
            this.tmpAtmRsrvAmount = ko.observable(null);
            this.cardType = ko.observable(null);
            this.cardStatus = ko.observable(null);
            this.cardExpMonth = ko.observable(null);
            this.cardExpYear = ko.observable(null);
            this.cardLatinName = ko.observable(null);
            this.oppAccountNo = ko.observable(null);
            this.genDtl = ko.observable(null);
            this.stopEndDate = ko.observable(null);
            this.crdLimitAmount = ko.observable(null);
            this.crdLimitDate = ko.observable(null);
            this.crdExtAmount = ko.observable(null);
            this.crdExtDate = ko.observable(null);
            this.monthsBeforeFreeze = ko.observable(null);
            this.monthsFreezeDate = ko.observable(null);
            this.eAccountNo = ko.observable(null);
            this.oAccountNo = ko.observable(null);
            this.oBranchNo = ko.observable(null);
            this.cardBranchNo = ko.observable(null);
            this.balMaxLimit = ko.observable(null);
            this.dailyMaxDebLimit = ko.observable(null);
            this.balMinLimit = ko.observable(null);

            this.accountNoExists = ko.observable(false);

            this.parentType = ko.observable(null);
            this.accID = ko.observable(null);
            this.amount = ko.observable(null);
            this.oppFlag = ko.observable(null);
            this.interest = ko.observable(null);
            this.accLinks = ko.observableArray([]);

            this.accountNo.subscribe(async (value) => {
                if (value != null) {
                    const checkCommand = {
                        token: localStorage.getItem('token'),
                        table: 'ACCOUNTS',
                        select: ['ACCOUNT_NO'],
                        where: [` ACCOUNT_NO =${value}`],
                    };
                    await Promise.all([serviceUtils.ajaxSendRequest('getTable', checkCommand)])
                        .then(
                            await function (values) {
                                let value;
                                let error;
                                if (values.length > 0) {
                                    value = coreUtils.parseJSON(values[0]);
                                    if (value.error) error = value.console;
                                    else {
                                        this.accountNoExists(true);
                                    }
                                }
                            }.bind(this)
                        )
                        .catch(function (reason) {
                            console.log(reason);
                        });
                }
            });
        }

        fields() {
            const result = {
                ACCOUNT_NO: this.accountNo(),
                PARENT: this.parent(),
                NAME: this.name(),
                NATURE: this.nature(),
                TYPE: this.type(),
                ROUNDING_PERIOD: this.roundingPeriod(),
                STATEMENT_PERIOD: this.statementPeriod(),
                CURRENCY_NO: this.currencyNo(),
                STATUS: this.status(),
                ROUND_DEB_BALANCE: this.roundDebBalance(),
                ROUND_CRD_BALANCE: this.roundCrdBalance(),
                DEB_BALANCE: this.debBalance(),
                CRD_BALANCE: this.crdBalance(),
                NOTES_NO: this.notesNo(),
                ATM_RSRV_AMOUNT: this.atmRsrvAmount(),
                ATM_CARD_NO: this.atmCardNo(),
                EXCEED_AMOUNT: this.exceedAmount(),
                EXCEED_LIMIT_DATE: this.exceedLimitDate(),
                TMP_ATM_RSRV_AMOUNT: this.tmpAtmRsrvAmount(),
                CARD_TYPE: this.cardType(),
                CARD_STATUS: this.cardStatus(),
                CARD_EXP_MONTH: this.cardExpMonth(),
                CARD_EXP_YEAR: this.cardExpYear(),
                CARD_LATIN_NAME: this.cardLatinName(),
                OPP_ACCOUNT_NO: this.oppAccountNo(),
                GEN_DTL: this.genDtl(),
                STOP_END_DATE: this.stopEndDate(),
                CRD_LIMIT_AMOUNT: this.crdLimitAmount(),
                CRD_LIMIT_DATE: this.crdLimitDate(),
                CRD_EXT_AMOUNT: this.crdExtAmount(),
                CRD_EXT_DATE: this.crdExtDate(),
                MONTHS_BEFORE_FREEZE: this.monthsBeforeFreeze(),
                MONTHS_FREEZE_DATE: this.monthsFreezeDate(),
                E_ACCOUNT_NO: this.eAccountNo(),
                O_ACCOUNT_NO: this.oAccountNo(),
                O_BRANCH_NO: this.oBranchNo(),
                CARD_BRANCH_NO: this.cardBranchNo(),
                BAL_MAX_LIMIT: this.balMaxLimit(),
                DAILY_MAX_DEB_LIMIT: this.dailyMaxDebLimit(),
                BAL_MIN_LIMIT: this.balMinLimit(),
            };
            return result;
        }

        _clear() {
            this.accountNo(null);
            this.parent(null);
            this.name(null);
            this.nature(null);
            this.type(null);
            this.roundingPeriod(null);
            this.statementPeriod(null);
            this.currencyNo(null);
            this.status(null);
            this.roundDebBalance(null);
            this.roundCrdBalance(null);
            this.debBalance(null);
            this.crdBalance(null);
            this.notesNo(null);
            this.atmRsrvAmount(null);
            this.atmCardNo(null);
            this.exceedAmount(null);
            this.exceedLimitDate(null);
            this.tmpAtmRsrvAmount(null);
            this.cardType(null);
            this.cardStatus(null);
            this.cardExpMonth(null);
            this.cardExpYear(null);
            this.cardLatinName(null);
            this.oppAccountNo(null);
            this.genDtl(null);
            this.stopEndDate(null);
            this.crdLimitAmount(null);
            this.crdLimitDate(null);
            this.crdExtAmount(null);
            this.crdExtDate(null);
            this.monthsBeforeFreeze(null);
            this.monthsFreezeDate(null);
            this.eAccountNo(null);
            this.oAccountNo(null);
            this.oBranchNo(null);
            this.cardBranchNo(null);
            this.balMaxLimit(null);
            this.dailyMaxDebLimit(null);
            this.balMinLimit(null);

            this.accountNoExists(false);

            this.parentType(null);
            this.accID(null);
            this.amount(null);
            this.oppFlag(null);
            this.interest(null);
            this.accLinks([]);
        }
    }

    return new accounts();
});
