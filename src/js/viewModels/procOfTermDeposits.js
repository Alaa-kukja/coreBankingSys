define([
    'ojs/ojtranslation',
    'knockout',
    'utils/Service',
    'utils/Tafqeet',
    'ojs/ojarraydataprovider',
    'ojs/ojknockouttemplateutils',
    'ojs/ojkeyset',

    'ojs/ojinputnumber',
    'ojs/ojinputtext',
    'oj-c/input-date-text',
    'ojs/ojlabel',
    'ojs/ojtable',
    'ojs/ojcheckboxset',
    'term-deposit/loader',
    // 'oj-c/checkbox',
], function (Translations, ko, ServiceUtils, tafqeet, ArrayDataProvider, KnockoutTemplateUtils, ojkeyset_1) {
    const _t = Translations.getTranslatedString;

    function procOfTermDepositsViewModel(params) {
        const { router } = params;
        this.router = router;
        console.log(router._activeState.path);

        this._initAllObservable();
        this._initAllLabels();
        this._initFetchAllData();
        this._initAllVariables();
        this._initAllEvents();
    }

    procOfTermDepositsViewModel.prototype._initAllObservable = function () {
        // 1
        this.DepositNumArray = ko.observableArray([]);
        this.selectedDepositNumItem = ko.observable({
            row: new ojkeyset_1.KeySetImpl(),
        });

        // 2
        this.termSectorVal = ko.observable(null);
        this.termYearVal = ko.observable(null);
        this.termMonthVal = ko.observable(null);
        this.termFirstAmountVal = ko.observable(null);
        this.termDepositAmountVal = ko.observable(null);

        this.termWriteAmountVal = ko.computed(
            function () {
                return tafqeet._tafqeet(this.termDepositAmountVal());
            }.bind(this)
        );

        this.termBenefitSymbolVal = ko.observable(null);
        this.creditIntValue = ko.observable(null);
        this.termBenefitDescrVal = ko.observable(null);
        this.termBenefitAmountVal = ko.observable(null);

        this.termBenefit2SymbolVal = ko.observable(null);
        this.creditInt2Value = ko.observable(null);
        this.termBenefit2DescrVal = ko.observable(null);
        this.termSppIntAmountVal = ko.observable(null);

        this.termInterestAccNumVal = ko.observable(null);
        this.termInterestAccNameVal = ko.observable(null);

        this.termFirstDepositDateVal = ko.observable(null);
        this.termDepositDateVal = ko.observable(null);
        this.termDeserveDateVal = ko.observable(null);
        this.termDeservedDateVal = ko.observable(null);

        this.termDepositAccNumVal = ko.observable(null);
        this.termDepositAccNameVal = ko.observable(null);

        this.termCliAccNumVal = ko.observable(null);
        this.termCliAccNameVal = ko.observable(null);

        this.termCurrentYearIntVal = ko.observable(null);
        this.termNextYearIntVal = ko.observable(null);
        this.termSumOfIntVal = ko.observable(null);
        this.termIncomeTaxVal = ko.observable(null);
        this.termLocalAdminVal = ko.observable(null);
        this.termReconstructVal = ko.observable(null);
        this.termSumOfDiscountsVal = ko.observable(null);

        //8
        this.DepositClientArray = ko.observableArray([]);
    };

    procOfTermDepositsViewModel.prototype._initAllLabels = function () {
        // 9
        this.checkBoxLabel = _t('labels.correction');

        // 10
        this.acceptButton = _t('buttons.apply');
        this.cancelButton = _t('buttons.cancel');
        this.backButton = _t('buttons.back');
    };

    procOfTermDepositsViewModel.prototype._initAllVariables = function () {
        this.depositNumTabDataProvider = new ArrayDataProvider(this.DepositNumArray, {
            keyAttributes: 'docNo',
        });

        this.depositNumTableColumns = [
            { headerText: _t('labels.primNumber'), field: 'clientDepNo', id: 'primNumD' },
            { headerText: _t('labels.subNumber'), field: 'depNo', id: 'subNumD' },
            { headerText: _t('labels.procMethod'), field: 'descr', id: 'procM' },
        ];

        this.DepositClientTabDataProvider = new ArrayDataProvider(this.DepositClientArray, {
            keyAttributes: 'clientNo',
        });

        this.depositClientTableColumns = [
            {
                headerText: _t('titles.clientName'),
                renderer: KnockoutTemplateUtils.getRenderer('cli_name', true),
                id: 'cliFullNam',
            },
            { headerText: _t('titles.linkType'), field: 'descr', id: 'cliType' },
            { headerText: _t('labels.clientRelId'), field: 'docNoToTran', id: 'cliReId' },
        ];
    };

    procOfTermDepositsViewModel.prototype._initAllEvents = function () {
        this.handleScreenBack = () => {
            this.termSectorVal(null);
            this.termYearVal(null);
            this.termMonthVal(null);
            this.termFirstAmountVal(null);
            this.termDepositAmountVal(null);

            this.termBenefitSymbolVal(null);
            this.creditIntValue(null);
            this.termBenefitDescrVal(null);
            this.termBenefitAmountVal(null);

            this.termBenefit2SymbolVal(null);
            this.creditInt2Value(null);
            this.termBenefit2DescrVal(null);
            this.termSppIntAmountVal(null);

            this.termInterestAccNumVal(null);
            this.termInterestAccNameVal(null);

            this.termFirstDepositDateVal(null);
            this.termDepositDateVal(null);
            this.termDeserveDateVal(null);
            this.termDeservedDateVal(null);

            this.termDepositAccNumVal(null);
            this.termDepositAccNameVal(null);

            this.termCliAccNumVal(null);
            this.termCliAccNameVal(null);
            this.DepositClientArray(null);
        };

        this.handleScreenApply = () => {};
        this.handleScreenClose = () => {};
    };

    procOfTermDepositsViewModel.prototype._initFetchAllData = function () {
        // Fetch Data For First Table (The Deposits Number Table)
        let TableFinal = [];
        let sppAmount = 0;
        let dateNow = new Date();
        let DepositNumCommand = {
            select: [],
            token: localStorage.getItem('token'),
            table: 'DEPOSITS',
            where: [],
            join: [],
            order: 'CLIENT_DEP_NO',
        };
        DepositNumCommand.select.push('DEPOSITS.*,DEPOSITS_KIND.DESCR,INTERESTS.CREDIT_INT');
        DepositNumCommand.where.push('DEPOSITS.STATUS = 1');
        DepositNumCommand.join.push({
            table: 'DEPOSITS_KIND',
            type: 'inner',
            condition: 'DEPOSITS.KIND = DEPOSITS_KIND.CODE',
        });
        DepositNumCommand.join.push({
            table: 'INTERESTS',
            type: 'inner',
            condition: 'INTERESTS.INT_NO = DEPOSITS.INT_NO',
        });

        Promise.all([ServiceUtils.ajaxSendRequest('getTable', DepositNumCommand)])
            .then(
                function (values) {
                    let TableArray = new Set(JSON.parse(values[0]));

                    let date = {};
                    TableArray.forEach((item) => {
                        if (dateNow.getFullYear() > Number(item.dueDate.slice(0, 4))) {
                            //console.log('yes for year');
                        } else if (dateNow.getFullYear() == Number(item.dueDate.slice(0, 4))) {
                            if (dateNow.getMonth() + 1 > Number(item.dueDate.slice(5, 7))) {
                                //console.log('yes for month');
                            } else if (dateNow.getMonth() + 1 == Number(item.dueDate.slice(5, 7))) {
                                if (dateNow.getDate() >= Number(item.dueDate.slice(8, 10))) {
                                    //console.log('yes for Day');
                                } else {
                                    // console.log('No for Day');
                                    TableArray.delete(item);
                                }
                            } else {
                                //console.log('No for Month');
                                TableArray.delete(item);
                            }
                        } else {
                            //console.log('No for Year');
                            TableArray.delete(item);
                        }

                        // for calculate the sppNewAmount
                        if (item.sppIntDate != null) {
                            date.dd = Number(item.sppIntDate.slice(8, 10));
                            date.mm = Number(item.sppIntDate.slice(5, 7));
                            date.yyyy = Number(item.sppIntDate.slice(0, 4));
                            let dateDB = date.dd + '/' + date.mm + '/' + date.yyyy;

                            item.sppIntDate = dateDB;

                            const oneDay = 24 * 60 * 60 * 1000;
                            const firstDate = new Date(date.yyyy, date.mm, date.dd);
                            const secondDate = new Date(
                                dateNow.getFullYear(),
                                dateNow.getMonth() + 1,
                                dateNow.getDate()
                            );

                            const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                            //console.log(diffDays);

                            sppAmount = Math.floor(
                                item.amount * (item.creditInt / 100) * Math.floor(diffDays / 365) - item.sppIntAmount
                            );
                            //console.log('sppAmount   ' + sppAmount);
                            item.sppNewAmount = sppAmount;
                        }
                    });

                    console.log(TableArray);
                    TableFinal = Array.from(TableArray);
                    console.log('TableFinal :: ' + TableArray);

                    if (TableFinal) {
                        this.DepositNumArray(TableFinal);
                        console.log('TableFinal :: ' + this.DepositNumArray());
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });

        // Fetch Data For Second Table (The Deposits Clients Table)
        this.selectedChangedListener = (event) => {
            this.termSectorVal(null);
            this.termYearVal(null);
            this.termMonthVal(null);
            this.termFirstAmountVal(null);
            this.termDepositAmountVal(null);

            this.termBenefitSymbolVal(null);
            this.creditIntValue(null);
            this.termBenefitDescrVal(null);
            this.termBenefitAmountVal(null);

            this.termBenefit2SymbolVal(null);
            this.creditInt2Value(null);
            this.termBenefit2DescrVal(null);
            this.termSppIntAmountVal(null);

            this.termInterestAccNumVal(null);
            this.termInterestAccNameVal(null);

            this.termFirstDepositDateVal(null);
            this.termDepositDateVal(null);
            this.termDeserveDateVal(null);
            this.termDeservedDateVal(null);

            this.termDepositAccNumVal(null);
            this.termDepositAccNameVal(null);

            this.termCliAccNumVal(null);
            this.termCliAccNameVal(null);
            ///////////
            let docNo = Array.from(event.detail.value.row.keys.keys)[0];
            console.log(docNo);
            let DepositClientCommand = {
                token: localStorage.getItem('token'),
                table: 'CLIENT_DOC',
                where: [],
                select: [],
                join: [],
            };
            DepositClientCommand.select.push(
                'ORD_PEOPLE.FIRST_NAME,ORD_PEOPLE.LAST_NAME,ORD_PEOPLE.FATHER_NAME,ORD_PEOPLE.MOTHER_NAME,CLIENT_DOC.DOC_NO_TO_TRAN,CLIENT_DOC_TYPE.DESCR'
            );
            DepositClientCommand.where.push(`CLIENT_DOC.DOC_TYPE = 8 AND CLIENT_DOC.DOC_NO = ${docNo}`);
            DepositClientCommand.join.push({
                table: 'ORD_PEOPLE',
                type: 'inner',
                condition: 'CLIENT_DOC.CLIENT_NO = ORD_PEOPLE.CLIENT_NO',
            });
            DepositClientCommand.join.push({
                table: 'CLIENT_DOC_TYPE',
                type: 'inner',
                condition: 'CLIENT_DOC.TYPE = CLIENT_DOC_TYPE.CODE',
            });
            Promise.all([ServiceUtils.ajaxSendRequest('getTable', DepositClientCommand)])
                .then(
                    function (values) {
                        console.log(values[0]);
                        let DepositCliArray = JSON.parse(values[0]);
                        if (DepositCliArray) {
                            this.DepositClientArray(DepositCliArray);
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });

            // for all data in screen
            let ScreenCommand = {
                select: [],
                token: localStorage.getItem('token'),
                table: 'DEPOSITS',
                where: [],
                join: [],
            };
            ScreenCommand.select.push(
                `DEPOSITS.*,SECTOR.DESCR,INTERESTS.CREDIT_INT,INTERESTS.DESCR AS DESCR_2,DEPOSITS_TYPE.DESCR AS DESCR_3`
            );
            ScreenCommand.where.push(`DEPOSITS.DOC_NO = ${docNo}`);
            ScreenCommand.join.push({
                table: 'INTERESTS',
                type: 'inner',
                condition: 'INTERESTS.INT_NO = DEPOSITS.INT_NO',
            });
            ScreenCommand.join.push({
                table: 'SECTOR',
                type: 'inner',
                condition: 'SECTOR.CODE = DEPOSITS.SECTOR',
            });
            ScreenCommand.join.push({
                table: 'DEPOSITS_TYPE_ACC',
                type: 'inner',
                condition: 'DEPOSITS_TYPE_ACC.ACCOUNT_NO = DEPOSITS.DEP_ACCOUNT_NO',
            });
            ScreenCommand.join.push({
                table: 'DEPOSITS_TYPE',
                type: 'inner',
                condition: 'DEPOSITS_TYPE.CODE = DEPOSITS_TYPE_ACC.DEPOSITS_TYPE',
            });
            Promise.all([ServiceUtils.ajaxSendRequest('getTable', ScreenCommand)])
                .then(
                    function (values) {
                        let ScreenArray = new Set(JSON.parse(values[0]));
                        console.log(ScreenArray);

                        ScreenArray.forEach((item) => {
                            this.termSectorVal(item.descr);
                            this.termYearVal(item.periodYear);
                            this.termMonthVal(item.periodMonth);
                            this.termFirstAmountVal(item.firstAmount);
                            this.termDepositAmountVal(item.amount);
                            this.termWriteAmountVal = ko.computed(
                                function () {
                                    return tafqeet._tafqeet(this.termDepositAmountVal());
                                }.bind(this)
                            );

                            this.termBenefitSymbolVal(item.intNo);
                            this.creditIntValue(item.creditInt);
                            this.termBenefitDescrVal(item.descr2);
                            if (item.sppIntDate != null) {
                                for (let i = 0; i < TableFinal.length; i++) {
                                    if (TableFinal[i].docNo == docNo) {
                                        this.termBenefitAmountVal(
                                            Number(TableFinal[i].sppNewAmount + TableFinal[i].sppIntAmount)
                                        );
                                    }
                                }
                            }

                            this.termBenefit2SymbolVal(item.intNo);
                            this.creditInt2Value(item.creditInt);
                            this.termBenefit2DescrVal(item.descr2);
                            this.termSppIntAmountVal(item.sppIntAmount);

                            this.termInterestAccNumVal(Number(item.intAccountNo));

                            this.termFirstDepositDateVal(new Date(item.firstStartDate).toISOString());
                            this.termDepositDateVal(new Date(item.startDate).toISOString());
                            this.termDeserveDateVal(new Date(item.intStartDate).toISOString());
                            this.termDeservedDateVal(new Date(item.dueDate).toISOString());

                            this.termDepositAccNumVal(Number(item.depAccountNo));
                            this.termDepositAccNameVal(item.descr3);

                            if (item.accountNo != null) {
                                this.termCliAccNumVal(Number(item.accountNo));
                                this.termCliAccNameVal(
                                    `${this.DepositClientArray()[0].firstName}  ${
                                        this.DepositClientArray()[0].fatherName
                                    }  ${this.DepositClientArray()[0].lastName} `
                                );
                            }
                        });
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });

            let Screen_2Command = {
                select: [],
                token: localStorage.getItem('token'),
                table: 'DEPOSITS',
                where: [],
                join: [],
            };
            Screen_2Command.select.push(`ACCOUNTS.NAME`);
            Screen_2Command.where.push(`DEPOSITS.DOC_NO = ${docNo}`);
            Screen_2Command.join.push({
                table: 'ACCOUNTS',
                type: 'inner',
                condition: 'ACCOUNTS.ACCOUNT_NO = DEPOSITS.INT_ACCOUNT_NO',
            });
            Promise.all([ServiceUtils.ajaxSendRequest('getTable', Screen_2Command)])
                .then(
                    function (values) {
                        let Screen_2Array = JSON.parse(values[0]);
                        //console.log('Screen_2Command  ' + Screen_2Array);
                        this.termInterestAccNameVal(Screen_2Array.toString());
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        };
    };
    return procOfTermDepositsViewModel;
});
