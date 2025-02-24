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
    'utils/Core',
    'utils/Service',
    'ojs/ojbufferingdataprovider',
    'ojs/ojconverter-number',
    'ojs/ojmodel',
    'ojs/ojcollectiondataprovider',

    'ojs/ojknockout',
    'ojs/ojinputtext',
    'ojs/ojdatetimepicker',
    'ojs/ojselectcombobox',
    'ojs/ojcheckboxset',
    'ojs/ojtable',
    'ojs/ojtoolbar',
    'ojs/ojbutton',
    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojlabelvalue',
    'ojs/ojprogress-circle',
    'oj-c/message-banner',
], function (
    Translations,
    ko,
    CoreUtils,
    serviceUtils,
    BufferingDataProvider,
    ojNumberConverter,
    ojModel,
    CollectionDataProvider,
) {
    const _t = Translations.getTranslatedString;
    function branchEmployeeViewModel(params) {
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
            document.title = _t('titles.determineClient') + ' - ' + _t('labels.branchEmployee');
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

    branchEmployeeViewModel.prototype._initAlL_Labels = function () {
        this.departmentIdLabel = _t('labels.id');
        this.departmentNameLabel = _t('labels.departmentName');
        this.deleteRowLabel = _t('buttons.deleteRow');
        this.addRowLabel = _t('buttons.addRow');
        this.startDateLabel = _t('labels.startDate');
        this.currencyLabel = _t('labels.currency');
        this.managerIdLabel = _t('labels.manager');
        this.typeLabel = _t('labels.type');
        this.locationIdLabel = _t('labels.location');
        this.ordPeopleCountLabel = _t('labels.employeesCount');
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
    };

    branchEmployeeViewModel.prototype._initAllObservables = function (params) {
        const { vSelectedItem, currClientType, ordPeople,clientNo,clientName, isBlackListed} = params;
        this.vSelectedItem = vSelectedItem;
        this.currClientType = currClientType;
        this.ordPeople = ordPeople;
        this.clientNo = clientNo;
        this.clientName = clientName;
        this.isBlackListed = isBlackListed;
        // this.ordPeople.subscribe((newValue) => {
        //     this.ordPeople(newValue);
        // });

        this.columns = ko.observableArray([
            {
                field: 'clientNo',
                headerText: _t('labels.id'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-start',
                template: 'clientNoTemplate',
                sortable: 'enabled',
                id: CoreUtils.generateUniqueId(),
                minWidth: '7rem',
            },
            {
                field: 'profileNo',
                headerText: _t('labels.docNo'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-start',
                template: 'profileNoTemplate',
                sortable: 'enabled',
                id: CoreUtils.generateUniqueId(),
                minWidth: '10rem',
            },
            {
                field: 'firstName',
                headerText: _t('inputs.firstName'),
                weight: 2,
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start',
                template: 'firstNameTemplate',
                sortable: 'enabled',
                id: 'empNameID',
                minWidth: '11rem',
            },
            {
                field: 'lastName',
                weight: 3,
                className: 'oj-helper-text-align-start',
                minWidth: '10rem',
                headerText: _t('inputs.lastName'),
                template: 'lastNameTemplate',
                sortable: 'enabled',
                id: CoreUtils.generateUniqueId(),
            },
            {
                field: 'fatherName',
                headerText: _t('inputs.father'),
                weight: 2,
                className: 'oj-helper-text-align-start',
                minWidth: '10rem',
                template: 'fatherTemplate',
                id: CoreUtils.generateUniqueId(),
            },
            {
                field: 'motherName',
                headerText: _t('inputs.motherName'),
                className: 'oj-helper-text-align-start',
                minWidth: '8rem',
                weight: 2,
                template: 'motherTemplate',
                id: CoreUtils.generateUniqueId(),
            },
        ]);

        this.fetchDelay = ko.observable(4000);

        this.model = ojModel.Model.extend({
            idAttribute: 'clientNo',
        });
        
         const empCommand = {
            token: localStorage.getItem('token'),
            table: 'vBRANCH_EMPLOYEES',
        };
        
        // empCommand.TranslationToJSON = true;
        // empCommand.join[0].condition = encodeURI('(CLIENTS.CLIENT_NO @@ ORD_PEOPLE.CLIENT_NO)'),

        this.collection = new ojModel.Collection(null, {
            url: serviceUtils.buildGetEndpointURL('getTable',empCommand),
            fetchSize: 15,
            model: this.model,
        });


        this.ordPeopleDataProvider = ko.observable(
            new BufferingDataProvider(new CollectionDataProvider(this.collection), this.fetchDelay())
        );

       

        // // NUMBER AND DATE CONVERTER ////
        this.numberConverter = new ojNumberConverter.IntlNumberConverter();

        this.messageBannerData = serviceUtils.messageBannerData;
        serviceUtils._closeMessageBanner();
    };

    branchEmployeeViewModel.prototype._initAllVariables = function () {};

    branchEmployeeViewModel.prototype._initAllEventListeners = function () {
        this.handleCloseMessageBanner = (event) => {
            let data = this.messageBannerData.data.slice();
            const closeMessageKey = event.detail.key;
            data = data.filter((message) => message.id !== closeMessageKey);
            this.messageBannerData.data = data;
        };

        this.selectedChangedListener = async(event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                row.values().forEach(async(value) => {
                    let keySet = new Set();
                    keySet.add(value);
                    let aValue = await this.ordPeopleDataProvider().fetchByKeys({ keys: keySet });
                    const data = aValue.results.get(value).data;
                    serviceUtils._closeMessageBanner();
                    let missingInfo = serviceUtils._collectMissingInfo(data);
                    this.clientNo(data.clientNo);
                    this.clientName(`${data.firstName} ${data.firstName} ${data.fatherName} ${ data.motherName}`);
                    await serviceUtils._getClientTransactions(data.clientNo,this.isBlackListed);
                    serviceUtils._showMessageBanner('warning', _t('labels.missingInfo'), [missingInfo]);
                   
                   
                });
            }
        };
    };


    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return branchEmployeeViewModel;
});
