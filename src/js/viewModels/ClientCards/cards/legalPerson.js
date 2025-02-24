/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define([
    'ojs/ojtranslation',
    'knockout',
    'utils/Core',
    'utils/Service',
    'tables/Clients',
    'tables/Companies',
    'ojs/ojarraydataprovider',
    'ojs/ojarraytreedataprovider',
    'ojs/ojbufferingdataprovider',
    'ojs/ojconverter-number',
    'ojs/ojasyncvalidator-length',
    'ojs/ojkeyset',
    'ojs/ojknockout',
    'ojs/ojnavigationlist',
    'ojs/ojinputnumber',
    'ojs/ojmodule-element-utils',
    'oj-c/button',
    'ojs/ojvalidationgroup',
    'ojs/ojformlayout',
    'ojs/ojnavigationlist',
    'ojs/ojcheckboxset',
    'oj-c/input-text',
    'oj-c/select-single',
    'ojs/ojavatar',
    'ojs/ojdialog',
    'ojs/ojtreeview',
    'occ-tree/loader',
    'oj-c/message-banner',
], function (
    Translations,
    ko,
    coreUtils,
    serviceUtils,
    clients,
    cm,
    ArrayDataProvider,
    TreeDataProvider,
    BufferingDataProvider,
    ojconverter_number_1,
    AsyncLengthValidator,
    ojkeyset_1
) {
    const _t = Translations.getTranslatedString;

    class CrossFieldValidator {
        constructor(options) {
            /**
             * If the value of base observable matches baseTriggerValue,
             * then the valueOnDependent cannot be empty.
             *
             * @param {Object} valueOnDependent current value of the dependent
             * observable
             * @returns {boolean|null}
             * @throws ValidationError when validation fails
             */
            this.validate = (valueOnDependent) => {
                let summary,
                    detail,
                    params,
                    validatorOptions = this._options;
                if (validatorOptions) {
                    let baseObs = validatorOptions['base'];
                    if (baseObs) {
                        let baseValue = ko.utils.unwrapObservable(baseObs);
                        let triggerValue = validatorOptions['baseTriggerValue'];
                        // if baseValue matches the triggerValue and value on
                        // dependent observable is empty
                        // throw error
                        if (triggerValue && baseValue && triggerValue === baseValue && !valueOnDependent) {
                            params = { label: validatorOptions['label'] };
                            summary = Translations.applyParameters(
                                bundle['app']['validator-crossField']['summary'],
                                params
                            );
                            detail = Translations.applyParameters(
                                bundle['app']['validator-crossField']['detail'],
                                params
                            );
                            // throw an error duck typing Message
                            throw { summary: summary, detail: detail };
                        }
                    }
                }
                return true;
            };
            this._options = options;
        }
    }

    function legalPersonViewModel(params) {
        this.connected = () => {
            this.clientNo(null);
            this.clientName(null);
            document.title = _t('titles.determineClient') + ' - ' + _t('labels.legalPerson');
            // Implement further logic if needed
        };
        this._initAllIds();
        this._initAll_labels();
        this._initAllObservable(params);
        this._initAllEventListeners();
        this._initAllVariables();
        this._initValidators();
    }

    legalPersonViewModel.prototype._initAllIds = function () {
        this.itsNameID = coreUtils.generateUniqueId();
        this.itsIdTypeID = coreUtils.generateUniqueId();
        this.itsEstablishingID = coreUtils.generateUniqueId();
        this.itsIdNumberID1 = coreUtils.generateUniqueId();
        this.itsIdNumberID2 = coreUtils.generateUniqueId();
        this.itsIdCardID1 = coreUtils.generateUniqueId();
        this.itsIdCardID2 = coreUtils.generateUniqueId();
        this.formValidationGroupID = coreUtils.generateUniqueId();
        this.itsPurposeID = coreUtils.generateUniqueId();
        this.itsExpireDate = coreUtils.generateUniqueId();
        this.itsGrantDate1 = coreUtils.generateUniqueId();
        this.itsGrantDate2 = coreUtils.generateUniqueId();
        this.itsNationalityID = coreUtils.generateUniqueId();
        this.emailId = coreUtils.generateUniqueId();
        this.itsRegPlaceID = coreUtils.generateUniqueId();
        this.itsPhonID = coreUtils.generateUniqueId();
        this.itsMobileID = coreUtils.generateUniqueId();
        this.itsFaxID = coreUtils.generateUniqueId();
        this.itsPOBoxID = coreUtils.generateUniqueId();
        this.itsAddressID = coreUtils.generateUniqueId();
        this.itsCityID = coreUtils.generateUniqueId();
        this.itsZoneID = coreUtils.generateUniqueId();
        this.itsStreetID = coreUtils.generateUniqueId();
        this.itsBuildingID = coreUtils.generateUniqueId();
        this.itsIdISIC4 = coreUtils.generateUniqueId();
        this.itsIdISIC2 = coreUtils.generateUniqueId();
        this.itsShareCapital = coreUtils.generateUniqueId();
        this.itsIdSector = coreUtils.generateUniqueId();
        this.itsIdSubSector = coreUtils.generateUniqueId();
        this.itsActivity = coreUtils.generateUniqueId();
        this.itsChoseOccupationDialog = coreUtils.generateUniqueId();
        this.treeViewOccupation = coreUtils.generateUniqueId();

        this.itsSrInternalID = coreUtils.generateUniqueId();
        this.itsSrNameID = coreUtils.generateUniqueId();
        this.itsSrIdTypeID = coreUtils.generateUniqueId();

    };

    legalPersonViewModel.prototype._initAllObservable = function (params) {
        const {
            vSelectedItem,
            currClientType,
            sexArray,
            idCards,
            nationalities,
            companyTypes,
            companies,
            sectors,
            subSectors,
            activities,
            searchMode,
            clientNo,
            clientName,
            isBlackListed,
            validationGroupValid,
        } = params;
        this.vSelectedItem = vSelectedItem;
        this.currClientType = currClientType;
        this.sexArray = sexArray;
        this.idCards = idCards;
        this.nationalities = nationalities;
        this.companyTypes = companyTypes;
        this.companies = companies;
        this.sectors = sectors;
        this.subSectors = subSectors;
        this.activities = activities;
        this.searchMode = searchMode;
        this.clientNo = clientNo;
        this.clientName = clientName;
        this.isBlackListed = isBlackListed;
        this.validationGroupValid = validationGroupValid;

        this.nameValue = cm.name;
        this.typeValue = cm.type;
        this.establishingDateValue = cm.estDate;

        this.idCardValue1 = clients.idType;
        this.idNumberValue1 = clients.idNo;
        this.grantDateValue1 = clients.idDate;

        this.idCardValue2 = clients.id2Type;
        this.idNumberValue2 = clients.id2No;
        this.grantDateValue2 = clients.id2Date;

        this.purposeValue = clients.relPurpose;

        this.nationalityValue = clients.nationality;
        this.economicEfficiencyValue = ko.observable(null); //to convert to فعالية اقتصادية
        this.emailValue = clients.eMail;
        this.emailAddressMessages = ko.observableArray([]); //message

        this.regPlaceValue = cm.regPlace;
        this.phonValue = clients.telephone;
        this.mobileValue = clients.mobileTelephone;
        this.faxValue = clients.faxNo;
        this.poBoxValue = clients.pOBox;
        this.addressValue = clients.address;
        this.cityValue = clients.addrCity;
        this.zoneValue = clients.addrRegion;
        this.streetValue = clients.addrStreet;
        this.buildingValue = clients.addrBuild;
        
        this.iSIC4Value = clients.occupation;
        this.iSIC2Value = ko.observable(null);

        this.shareCapitalValue = clients.finAbility;
        this.sectorValue = clients.sector;
        this.subSectorValue = clients.subSector;
        this.activityValue = clients.activityType;
        this.member1 = cm.boardPartner1;
        this.member2 = cm.boardPartner2;
        this.member3 = cm.boardPartner3;
        this.member4 = cm.boardPartner4;
        this.member5 = cm.boardPartner5;
        this.member6 = cm.boardPartner6;
        this.member7 = cm.boardPartner7;
        this.member8 = cm.boardPartner8;
        this.member9 = cm.boardPartner9;
        this.member10 = cm.boardPartner10;


        this.companiesHolder = ko.observable(this.companies());

        this.numberConverter = new ojconverter_number_1.IntlNumberConverter();
        this.isDisabled= ko.observable(true);
        this.currOccupation = ko.observable();

        this.currOccupation.subscribe((value) =>{
            this.isDisabled(value.childs != 0)
        });

        this.typeDataProvider = new ArrayDataProvider(this.companyTypes, { keyAttributes: 'code' });

        this.sectorDataProvider = new ArrayDataProvider(this.sectors, { keyAttributes: 'code' });
        this.subSectorDataProvider = new ArrayDataProvider(this.subSectors, { keyAttributes: 'code' });
        this.activityDataProvider = new ArrayDataProvider(this.activities, { keyAttributes: 'code' });

        this.idCardDataProvider = new ArrayDataProvider(this.idCards, { keyAttributes: 'code' });
        this.nationalityDataProvider = new ArrayDataProvider(this.nationalities, { keyAttributes: 'nationalNo' });

        this.ContactPref = { EMAIL: 'email' };
        this.contactPref = ko.observable(this.ContactPref['EMAIL']);
        this.contactPref.subscribe((newValue) => {
            this.clearMessagesOnDependentsOfContactPref(newValue);
        });

        // emailAddress must be set when contact pref is 'email'
        this.emailAddrCRValidator = new CrossFieldValidator({
            base: this.contactPref,
            baseTriggerValue: this.ContactPref['EMAIL'],
            label: 'Email Address',
        });

        //search Mode
        let filterCompanies = function (data, type, name, id) {
            if (type != null) data = data.filter((cm) => cm.idType == type);
            if (name != null) data = data.filter((cm) => cm.name.includes(name));
            if (id != null) data = data.filter((cm) => cm.clientNo == id);
            return data;
        };
        this.srTypeValue = ko.observable(null);
        this.srTypeValue.subscribe((newValue) => {
            let data = this.companiesHolder();
            data = filterCompanies(data, newValue, this.srNameValue(), this.internalNoValue());
            this.companies(data);
        });

        this.srNameValue = ko.observable(null);
        this.srNameValue.subscribe((newValue) => {
            let data = this.companiesHolder();
            data = data.filter((cm) => cm.name != null);
            data = filterCompanies(data, this.srTypeValue(), newValue, this.internalNoValue());
            this.companies(data);
        });
        this.internalNoValue = ko.observable(null);
        this.internalNoValue.subscribe((newValue) => {
            let data = this.companiesHolder();
            data = filterCompanies(data, this.srTypeValue(), this.srNameValue(), newValue);
            this.companies(data);
        });
        this.companiesDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.companies, {
                keyAttributes: 'clientNo',
            })
        );

        this.columns = ko.observableArray([
            {
                field: 'clientNo',
                headerText: _t('labels.id'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-start',
                template: 'clientNoTemplate',
                sortable: 'enabled',
                id: coreUtils.generateUniqueId(),
                maxWidth: '7rem',
            },
            {
                field: 'name',
                headerText: _t('inputs.firstName'),
                weight: 2,
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start',
                template: 'nameTemplate',
                sortable: 'enabled',
                id: coreUtils.generateUniqueId(),
                minWidth: '22rem',
            },
        ]);
        //end search mode

        this.messageBannerData = serviceUtils.messageBannerData;
        serviceUtils._closeMessageBanner();
    };

    legalPersonViewModel.prototype._initAllVariables = function () {
      
    };

    legalPersonViewModel.prototype._initAll_labels = function () {
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
        this.nameLabel = _t('inputs.firstName');
        this.typeLabel = _t('inputs.type');
        this.establishingDateLabe = _t('inputs.establishingDate');
        this.idNumberLabel1 = _t('inputs.idNo') + ' 1';
        this.idNumberLabel2 = _t('inputs.idNo') + ' 2';
        this.ageLabel = _t('inputs.age');
        this.idCardLabel1 = _t('inputs.idNo') + ' 1';
        this.idCardLabel2 = _t('inputs.idNo') + ' 2';
        this.purposeLabel = _t('inputs.purpose');
        this.grantDateLabe1 = _t('inputs.grantDate') + ' 1';
        this.grantDateLabe2 = _t('inputs.grantDate') + ' 2';
        this.nationalityLabel = _t('inputs.nationality');
        this.economicEfficiencyLabel = _t('labels.economicEfficiency');
        this.emailLabe = _t('inputs.eMail');
        this.regPlaceLabel = _t('inputs.regPlace1');
        this.phonLabel = _t('inputs.phon');
        this.mobileLabel = _t('inputs.mobile');
        this.faxLabel = _t('inputs.fax');
        this.poBoxLabe = _t('inputs.poBox');
        this.addressLabel = _t('inputs.address');
        this.cityLabel = _t('inputs.city');
        this.zoneLabel = _t('inputs.zone');
        this.streetLabel = _t('inputs.street');
        this.buildingLabe = _t('inputs.building');
        this.searchLabel = _t('buttons.search');
        this.occupationLabel = _t('inputs.occupation'); //
        this.shareCapitalLabel = _t('inputs.finAbility');
        this.sectorLabel = _t('inputs.sector');
        this.subSectorLabel = _t('inputs.subSector');
        this.economistActivityLabel = _t('inputs.activityType');
        this.foundingMembersLabel = _t('labels.foundingMembers');
        this.choseOccupationLabel = _t('labels.choseOccupation');
        this.internalLabel = _t('inputs.internal');
        this.newButtonLabel = _t('labels.new');
    };

    legalPersonViewModel.prototype._initAllEventListeners = function () {
        this.ojValidChanged = (event) => {
            this.validationGroupValid(event.detail.value);
        };

        this.occTreeSelectedChanged =(event)=>{
            this.currOccupation(event.detail);
            console.log(event);
        };

        this.handleCancel = () => {
            let dialogID = `#${this.itsChoseOccupationDialog}`;
            if (dialogID) document.querySelector(dialogID).close();
        };
        this.handleApply = () => {
            this.iSIC2Value(this.currOccupation().name);
            clients.occupation(this.currOccupation().occupationNo);
            this.handleCancel();
        };
        this.handleChoseISIC2 = () => {
            let dialogID = `#${this.itsChoseOccupationDialog}`;
            if (dialogID) document.querySelector(dialogID).open();
        };
        this.handleSearch = () => {
            this.searchMode(!this.searchMode());
        };

        this.handleNewAction = () => {
            this.searchMode(!this.searchMode());
            serviceUtils._closeMessageBanner();
        };

        this.handleCloseMessageBanner = (event) => {
            let data = this.messageBannerData.data.slice();
            const closeMessageKey = event.detail.key;
            data = data.filter((message) => message.id !== closeMessageKey);
            this.messageBannerData.data = data;
        };

        this.selectedChangedListener = async (event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                row.values().forEach(async (value) => {
                    let keySet = new Set();
                    keySet.add(value);
                    let aValue = await this.companiesDataProvider.fetchByKeys({ keys: keySet });
                    const data = aValue.results.get(value).data;
                    this.clientNo(data.clientNo);
                    this.clientName(data.name);
                    serviceUtils._closeMessageBanner();
                    let missingInfo = serviceUtils._collectMissingInfo(data);
                    await serviceUtils._getClientTransactions(data.clientNo,this.isBlackListed);
                    serviceUtils._showMessageBanner('warning', _t('labels.missingInfo'), [missingInfo]);
                });
            }
        };
    };

    legalPersonViewModel.prototype._initValidators = function () {

        this.emailValidator = coreUtils.emailValidator;   
        this.mobileValidator = coreUtils.mobileValidator;
        this.phoneValidator = coreUtils.phoneValidator;
        this.cNameValidators =coreUtils.cNameValidators;
        this.dateValidator = coreUtils.dateValidator;
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return legalPersonViewModel;
});
