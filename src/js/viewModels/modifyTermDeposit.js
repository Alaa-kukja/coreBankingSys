define([
    'ojs/ojtranslation',
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojknockouttemplateutils',
    'utils/Service',

    'ojs/ojbutton',
    'ojs/ojtable',
    'term-deposit/loader',
], function (Translations, ko, ArrayDataProvider, KnockoutTemplateUtils, serviceUtils) {
    const _t = Translations.getTranslatedString;

    function modifyTermDepositViewModel(params) {
        const { router } = params;
        this.router = router;
        console.log(router._activeState.path);
        this._initAllLabels();
        this._initObservables();
        this._initAllVariables();
        this._initAllEvents();
    }

    modifyTermDepositViewModel.prototype._initAllLabels = function () {
        this.resultButtonLabel = _t('labels.searchResult');
        this.DelResultButtonLabel = _t('buttons.cancel');
    };

    modifyTermDepositViewModel.prototype._initObservables = function () {
        // 1
        this.termPrimNumberVal = ko.observable(null);
        this.termSubNumberVal = ko.observable(null);

        this.termSectorVal = ko.observable(null);
        this.termYearVal = ko.observable(null);
        this.termMonthVal = ko.observable(null);
        this.termFirstAmountVal = ko.observable(null);
        this.termDepositAmountVal = ko.observable(null);

        this.termCurrentYearIntVal = ko.observable(null);
        this.termNextYearIntVal = ko.observable(null);
        this.termSumOfIntVal = ko.observable(null);
        this.termIncomeTaxVal = ko.observable(null);
        this.termLocalAdminVal = ko.observable(null);
        this.termReconstructVal = ko.observable(null);
        this.termSumOfDiscountsVal = ko.observable(null);

        this.termBenefitSymbolVal = ko.observable(null);
        this.creditIntValue = ko.observable(null);
        this.termBenefitDescrVal = ko.observable(null);
        this.termBenefitAmountVal = ko.observable(null);

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

        ////
        this.clicked = ko.observable(false);
        this.clientArray = ko.observableArray([]);
    };

    modifyTermDepositViewModel.prototype._initAllVariables = function () {
        // For Table
        this.clientTableDataProvider = new ArrayDataProvider(this.clientArray, {
            keyAttributes: 'clientNo',
        });

        this.clientTableColumns = [
            {
                headerText: _t('titles.clientName'),
                renderer: KnockoutTemplateUtils.getRenderer('cli_name', true),
                id: 'cliFullNam',
            },
            { headerText: _t('titles.linkType'), field: 'descr', id: 'cliType' },
            { headerText: _t('labels.clientRelId'), field: 'docNoToTran', id: 'cliReId' },
        ];
    };

    modifyTermDepositViewModel.prototype._initAllEvents = function () {
        this.resultButtonAction = () => {
            this.clicked(true);
            this._initFetchData();
        };

        this.DelResultButtonAction = () => {
            //this.PrimNumberVal = ko.observable(null);
            // this.SubNumberVal = ko.observable(null);
            this.clicked(false);
        };
    };

    modifyTermDepositViewModel.prototype._initFetchData = function () {
        let tableCommand = {
            select: [],
            token: localStorage.getItem('token'),
            table: 'ORD_PEOPLE',
            join: [],
        };
        tableCommand.select.push(
            'ORD_PEOPLE.FIRST_NAME,ORD_PEOPLE.LAST_NAME,ORD_PEOPLE.FATHER_NAME,ORD_PEOPLE.MOTHER_NAME,CLIENT_DOC.DOC_NO_TO_TRAN,CLIENT_DOC_TYPE.DESCR'
        );
        tableCommand.join.push({
            table: 'CLIENT_DOC',
            type: 'inner',
            condition: 'ORD_PEOPLE.CLIENT_NO = CLIENT_DOC.CLIENT_NO AND DOC_TYPE = 8 ',
        });
        tableCommand.join.push({
            table: 'CLIENT_DOC_TYPE',
            type: 'inner',
            condition: 'CLIENT_DOC.TYPE = CLIENT_DOC_TYPE.CODE',
        });
        Promise.all([serviceUtils.ajaxSendRequest('getTable', tableCommand)])
            .then(
                function (values) {
                    let TableArray = JSON.parse(values[0]);
                    if (TableArray) {
                        this.clientArray(TableArray);
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });
    };

    return modifyTermDepositViewModel;
});
