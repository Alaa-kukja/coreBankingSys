define([
    'ojs/ojtranslation',
    'knockout',
    'ojs/ojhtmlutils',
    'utils/Service',
    'utils/Tafqeet',
    'ojs/ojarraydataprovider',
    'ojs/ojbufferingdataprovider',
    'ojs/ojknockouttemplateutils',
    'ojs/ojkeyset',

    'ojs/ojvalidationgroup',
    'ojs/ojformlayout',
    'ojs/ojinputnumber',
    'ojs/ojinputtext',
    'ojs/ojdatetimepicker',
    'ojs/ojlabel',
    'ojs/ojtable',
    'ojs/ojcheckboxset',
    'term-deposit/loader',
], function (
    Translations,
    ko,
    HtmlUtils,
    ServiceUtils,
    tafqeet,
    ArrayDataProvider,
    BufferingDataProvider,
    KnockoutTemplateUtils,
    ojkeyset_1
) {
    const _t = Translations.getTranslatedString;

    function definingInterestRatesViewModel(params) {
        const { router } = params;
        this.router = router;
        console.log(router._activeState.path);

        this._initAllObservable();
        this._initAllLabels();
        this._initFetchData();
        this._initAllVariables();
        this._initAllEvents();
    }

    definingInterestRatesViewModel.prototype._initAllObservable = function () {
        this.interestsArray = ko.observableArray([]);

        this.selectedInterestItem = ko.observable({
            row: new ojkeyset_1.KeySetImpl(),
        });

        this.editRow = ko.observable({ rowKey: null });

        this.searchValue = ko.observable(null);
    };

    definingInterestRatesViewModel.prototype._initAllLabels = function () {
        this.intNoLabel = _t('labels.code') + ' ' + _t('labels.interest');
        this.intActiveLabel = _t('titles.active');
        this.searchLabel = _t('buttons.search');
        this.descrLabel = _t('labels.description');
        this.debtIntRateLabel = _t('labels.rate') + ' ' + _t('labels.interest') + ' ' + _t('titles.debit');
        this.debtIntDaysLabel = _t('labels.NumberOfDaysInYear') + ' ' + _t('titles.debit');
        this.creditIntRateLabel = _t('labels.rate') + ' ' + _t('labels.interest') + ' ' + _t('titles.credit');
        this.creditIntDaysLabel = _t('labels.NumberOfDaysInYear') + ' ' + _t('titles.credit');
        this.debtAccNoLabel = _t('inputs.accNumber') + ' ' + _t('labels.debit');
        this.creditAccNoLabel = _t('inputs.accNumber') + ' ' + _t('labels.credit');
    };

    definingInterestRatesViewModel.prototype._initAllEvents = function () {
        console.log('lololololololo');
        this.prepareEdit = (event) => {
            this.cancelEdit = false;
            const rowContext = event.detail.rowContext;
            this.originalData = Object.assign({}, rowContext.item.data);
            this.rowData = Object.assign({}, rowContext.item.data);
            console.log(this.rowData);
        };

        this.rowEditable = (item) => {
            if (this.disabledKeys.has(item.metadata.key)) {
                return 'off';
            }
            return 'on';
        };

        this.handleUpdate = (event, context) => {
            this.editRow({ rowKey: context.key });
        };

        this.handleDone = () => {
            this.editRow({ rowKey: null });
        };

        this.handleCancel = () => {
            this.cancelEdit = true;
            this.editRow({ rowKey: null });
        };
    };

    definingInterestRatesViewModel.prototype._initAllVariables = function () {
        this.interestsTabDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.interestsArray, {
                keyAttributes: 'intNo',
            })
        );

        this.interestsTableColumns = [
            { headerText: _t('labels.theCode'), field: 'intNo', id: 'cliType' },
            { headerText: _t('titles.active'), field: 'intActive', id: 'intAc' },
            { headerText: _t('titles.more') + ' ' + _t('labels.from'), field: 'moreThan', id: 'more' },
            { headerText: _t('labels.theRate') + ' ' + _t('titles.debit'), field: 'debitInt', id: 'debInt' },
            { headerText: _t('labels.theRate') + ' ' + _t('titles.credit'), field: 'creditInt', id: 'crdInt' },
            { headerText: _t('labels.description'), field: 'descr', id: 'intDescr', maxWidth: '100%', width: '450px' },
            {
                sortable: 'disable',
                width: '5rem',
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-end',
                id: 'action',
            },
        ];

        this.getRowConfig = () => {
            return {
                view: HtmlUtils.stringToNodeArray(rowTemplateText),
                data: this,
            };
        };
    };

    definingInterestRatesViewModel.prototype._initFetchData = function () {
        // Fetch Data For First Table (The Deposits Number Table)

        let DepositNumCommand = {
            token: localStorage.getItem('token'),
            table: 'INTERESTS',
        };

        Promise.all([ServiceUtils.ajaxSendRequest('getTable', DepositNumCommand)])
            .then(
                function (values) {
                    let Array = JSON.parse(values[0]);

                    console.log(Array);
                    if (Array) {
                        this.interestsArray(Array);
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });

        this.InterestChangedListener = (event) => {
            let intNo = Array.from(event.detail.value.row.keys.keys)[0];
            console.log(intNo);
            // for all data in screen
            let ScreenCommand = {
                token: localStorage.getItem('token'),
                table: 'INTERESTS',
                where: [],
            };
            ScreenCommand.where.push(`INTERESTS.INT_NO = ${intNo}`);
            Promise.all([ServiceUtils.ajaxSendRequest('getTable', ScreenCommand)])
                .then(
                    function (values) {
                        let ScreenArray = JSON.parse(values[0]);
                        console.log('ScreenArray :: ' + values);
                        // if (DepositCliArray) {
                        //     this.DepositClientArray(DepositCliArray);
                        // }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        };
    };

    return definingInterestRatesViewModel;
});
