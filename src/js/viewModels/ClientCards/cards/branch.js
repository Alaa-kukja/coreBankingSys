/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
define([
    'ojs/ojtranslation',
    'knockout',
    'utils/Service',
    'ojs/ojarraydataprovider',
    'ojs/ojbufferingdataprovider',
    'ojs/ojconverter-number',
    'ojs/ojknockout',
    'ojs/ojinputtext',
    'ojs/ojdatetimepicker',
    'ojs/ojselectcombobox',
    'ojs/ojcheckboxset',
    'ojs/ojtable',
    'ojs/ojtoolbar',
    'ojs/ojbutton',
    'ojs/ojmessages',
    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojlabelvalue',
], function (Translations, ko, serviceUtils, ArrayDataProvider, BufferingDataProvider, ojconverter_number_1) {
    const _t = Translations.getTranslatedString;
    function branchViewModel(params) {
        // Below are a set of the ViewModel methods invoked by the oj-module component.
        // Please reference the oj-module jsDoc for additional information.

        /**
         * Optional ViewModel method invoked after the View is inserted into the
         * document DOM.  The application can put logic that requires the DOM being
         * attached here.
         * This method might be called multiple times - after the View is created
         * and inserted into the DOM and after the View is reconnected
         * after being disconnected.
         */
        this.connected = () => {
            this.clientNo(null);
            this.clientName(null);
            document.title = _t('titles.determineClient') + ' - ' + _t('labels.bankBranch');
            // Implement further logic if needed
        };

        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
        this.disconnected = () => {
            // Implement if needed
        };

        /**
         * Optional ViewModel method invoked after transition to the new View is complete.
         * That includes any possible animation between the old and the new View.
         */
        this.transitionCompleted = () => {
            // Implement if needed
        };
        this._initAlL_Labels();
        this._initAllObservables(params);
        this._initAllVariables();
        this._initAllEventListeners();
    }

    branchViewModel.prototype._initAlL_Labels = function () {
        this.departmentIdLabel = _t('labels.id');
        this.departmentNameLabel = _t('labels.departmentName');
        this.deleteRowLabel = _t('buttons.deleteRow');
        this.addRowLabel = _t('buttons.addRow');
        this.startDateLabel = _t('labels.startDate');
        this.currencyLabel = _t('labels.currency');
        this.managerIdLabel = _t('labels.manager');
        this.typeLabel = _t('labels.type');
        this.locationIdLabel = _t('labels.location');
        this.employeesCountLabel = _t('labels.employeesCount');
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
    };

    branchViewModel.prototype._initAllObservables = function (params) {
        const { vSelectedItem, currClientType, branchTypes, cities, branches,clientNo,clientName,isBlackListed} = params;
        this.vSelectedItem = vSelectedItem;
        this.currClientType = currClientType;
        this.branchTypes = branchTypes;
        this.cities = cities;
        this.branches = branches;
        this.clientNo = clientNo;
        this.clientName = clientName;
        this.isBlackListed = isBlackListed;

        this.columns = ko.observableArray([
            {
                field: 'clientNo',
                headerText: _t('labels.id'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start',
                template: 'clientNoTemplate',
                sortable: 'enabled',
                id: 'clientNoID',
                minWidth: '7rem',
                maxWidth: '7rem',
            },
            {
                field: 'branchNo',
                headerText: _t('labels.branchNo'),
                weight: 2,
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start',
                template: 'branchNoTemplate',
                sortable: 'enabled',
                id: 'branchNoID',
                minWidth: '10rem',
                maxWidth: '10rem',
            },
            {
                field: 'name',
               // weight: 3,
                minWidth: '10rem',
                headerText: _t('labels.branchName'),
                template: 'nameTemplate',
                sortable: 'enabled',
                id: 'nameID',
            },
            {
                field: 'type',
                headerText: _t('labels.type'),
              //  weight: 2,
               // minWidth: '10rem',
                template: 'typeTemplate',
                id: 'type',
            },
            {
                field: 'city',
                headerText: _t('inputs.city'),
               // minWidth: '8rem',
              //  weight: 2,
                template: 'cityTemplate',
                id: 'cityID',
            },
        ]);

        this.branchesDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.branches, {
                keyAttributes: 'clientNo',
            })
        );

        // // NUMBER AND DATE CONVERTER ////
        this.numberConverter = new ojconverter_number_1.IntlNumberConverter();
    };

    branchViewModel.prototype._initAllVariables = function () {
        this.getTypeLabel = (value) => {
            for (let index = 0; index < this.branchTypes().length; index++) {
                if (this.branchTypes()[index].code == value) return this.branchTypes()[index].descr;
            }
        };

        this.getCityLabel = (value) => {
            for (let index = 0; index < this.cities().length; index++) {
                if (this.cities()[index].code == value) return this.cities()[index].descr;
            }
        };
    };

    branchViewModel.prototype._initAllEventListeners = function () {
        this.selectedChangedListener =async (event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                row.values().forEach(async (value) => {
                    let keySet = new Set();
                    keySet.add(value);
                    let aValue = await this.branchesDataProvider.fetchByKeys({ keys: keySet });
                    const data = aValue.results.get(value).data;
                    this.clientNo(data.clientNo);
                    this.clientName(data.name);
                });
            }
            this.isDisabled(row.values().size === 0);
        };
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return branchViewModel;
});
