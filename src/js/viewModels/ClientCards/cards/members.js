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
    'tables/OrdPeople',
    'tables/Clients',
    'ojs/ojarraydataprovider',
    'ojs/ojbufferingdataprovider',
    'ojs/ojconverter-number',
    'ojs/ojasyncvalidator-regexp',
    'ojs/ojanimation',

    'ojs/ojknockout',
    'ojs/ojnavigationlist',
    'ojs/ojinputnumber',
    'ojs/ojmodule-element-utils',
    'ojs/ojbutton',
    'ojs/ojvalidationgroup',
    'ojs/ojformlayout',
    'ojs/ojnavigationlist',
    'ojs/ojcheckboxset',
    'oj-c/input-text',
    'oj-c/input-number',
    'oj-c/button',
    'oj-c/select-single',
    'ojs/ojavatar',
    'ojs/ojprogress-circle',
    'occ-tree/loader',
    'oj-c/message-banner',
], function (
    Translations,
    ko,
    coreUtils,
    serviceUtils,
    ordPeopleObject,
    clients,
    ArrayDataProvider,
    BufferingDataProvider,
    ojconverter_number_1,
    AsyncRegExpValidator,
    AnimationUtils
) {
    const _t = Translations.getTranslatedString;

    function membersViewModel(params) {
        this.connected = () => {
            this.clientNo(null);
            this.clientName(null);
            document.title = _t('titles.determineClient') + ' - ' + _t('labels.members');
            let cards = document.getElementsByClassName('_oj-animatable');
            for (let index = 0; index < cards.length; index++) {
                const element = cards[index];
                element.setAttribute('animatable', true);
                element.addEventListener('click', this.flipCard);
            }
            this._readIDBarcode();
            // Implement further logic if needed
        };

        this.disconnected = () => {};

        this._initIds();
        this._initLabels();
        this._initAllObservable(params);
        this._initValidators();
        this._initAllEventListeners();
        this._initAllVariables();
        this._initFetchData();
        this.birthdayValueListener = this._birthdayValueListener.bind(this);
    }

    /**
     * @function _initIds
     * @description Initialize All Ids
     */

    membersViewModel.prototype._initIds = function () {
        this.itsNameID = coreUtils.generateUniqueId();
        this.itsLastNameID = coreUtils.generateUniqueId();
        this.itsFatherID = coreUtils.generateUniqueId();
        this.itsMotherID = coreUtils.generateUniqueId();
        this.itsMotherLastNameID = coreUtils.generateUniqueId();
        this.itsSexID = coreUtils.generateUniqueId();
        this.itsIdNumberID = coreUtils.generateUniqueId();
        this.inputBirthdayID = coreUtils.generateUniqueId();
        this.inputAgeID = coreUtils.generateUniqueId();
        this.itsIdCardID = coreUtils.generateUniqueId();
        this.formValidationGroupID = coreUtils.generateUniqueId();
        this.itsPurposeID = coreUtils.generateUniqueId();
        this.itsHusbandID = coreUtils.generateUniqueId();
        this.itsSourceID = coreUtils.generateUniqueId();
        this.itsNationalNoID = coreUtils.generateUniqueId();
        this.itsExpireDate = coreUtils.generateUniqueId();
        this.itsGrantDate = coreUtils.generateUniqueId();
        this.itsRegPlaceID = coreUtils.generateUniqueId();
        this.itsBirthPlaceID = coreUtils.generateUniqueId();
        this.itsRegNoID = coreUtils.generateUniqueId();
        this.itsBirthDayID = coreUtils.generateUniqueId();
        this.itsNationalityID = coreUtils.generateUniqueId();
        this.emailId = coreUtils.generateUniqueId();
        this.itsPhonID = coreUtils.generateUniqueId();
        this.itsMobileID = coreUtils.generateUniqueId();
        this.itsFaxID = coreUtils.generateUniqueId();
        this.itsPOBoxID = coreUtils.generateUniqueId();
        this.itsAddressID = coreUtils.generateUniqueId();
        this.itsCityID = coreUtils.generateUniqueId();
        this.itsZoneID = coreUtils.generateUniqueId();
        this.itsStreetID = coreUtils.generateUniqueId();
        this.itsBuildingID = coreUtils.generateUniqueId();
        this.itsInternalID = coreUtils.generateUniqueId();
        this.itsDocTypes = coreUtils.generateUniqueId();
        this.itsCompanies = coreUtils.generateUniqueId();
        this.itsIdSector = coreUtils.generateUniqueId();
        this.itsIdSubSector = coreUtils.generateUniqueId();
        this.itsActivity = coreUtils.generateUniqueId();
        this.itsIdSolvency = coreUtils.generateUniqueId();
        this.itsIdClientNotes = coreUtils.generateUniqueId();
        this.itsIdISIC4 = coreUtils.generateUniqueId();
        this.itsIdISIC2 = coreUtils.generateUniqueId();
        this.itsIdEmployer = coreUtils.generateUniqueId();
        this.itsIdWPosition = coreUtils.generateUniqueId();
        this.itsIdWPhone = coreUtils.generateUniqueId();
        this.itsIdWAddress = coreUtils.generateUniqueId();
        this.itsChoseOccupationDialog = coreUtils.generateUniqueId();
        this.pictureAvatarID = coreUtils.generateUniqueId();
        this.pictureImageID = coreUtils.generateUniqueId();
        this.signAvatarID = coreUtils.generateUniqueId();
        this.signImageID = coreUtils.generateUniqueId();
    };

    membersViewModel.prototype._initAllObservable = function (params) {
        const {
            vSelectedItem,
            currClientType,
            sexArray,
            idCards,
            nationalities,
            sectors,
            subSectors,
            activities,
            ordPeople,
            eCommand,
            relation,
            companies,
            validationGroupValid,
            searchMode,
            clientNo,
            clientName,
            isBlackListed,
            purPictureSrc,
            purSignScr,
        } = params;
        this.vSelectedItem = vSelectedItem;
        this.currClientType = currClientType;
        this.sexArray = sexArray;
        this.idCards = idCards;
        this.nationalities = nationalities;
        this.ordPeople = ordPeople;
        this.validationGroupValid = validationGroupValid;
        this.srOrdPeople = ko.observableArray([]);
        this.ordPeople.subscribe((newValue) => {
            this.srOrdPeople(newValue);
        });

        this.srOrdPeople.subscribe((newValue) => {
            if (this.clientNo() != null) this.showAvatars();
        });
        this.eCommand = eCommand;
        this.relation = relation;
        this.sectors = sectors;
        this.subSectors = subSectors;
        this.activities = activities;
        this.searchMode = searchMode;
        this.clientNo = clientNo;
        this.clientNo.subscribe((value) => {
            if (value != null) {
                setTimeout(() => {
                    let cards = document.getElementsByClassName('_oj-animatable');
                    for (let index = 0; index < cards.length; index++) {
                        const element = cards[index];
                        element.setAttribute('animatable', true);
                        element.addEventListener('click', this.flipCard);
                    }
                }, 100);
            }
        });

        this.clientName = clientName;
        this.isBlackListed = isBlackListed;
        this.purPictureSrc = purPictureSrc;
        this.purSignScr = purSignScr;

        //ordPeople
        this.firstNameValue = ordPeopleObject.firstName;
        this.lastNameValue = ordPeopleObject.lastName;
        this.fatherValue = ordPeopleObject.fatherName;
        this.motherValue = ordPeopleObject.motherName;
        this.motherLastNameValue = ordPeopleObject.motherLastName;
        this.sexValue = ordPeopleObject.sex;
        this.husbandValue = ordPeopleObject.husbandName;
        this.nationalNoValue = ordPeopleObject.nationalNo;
        this.regPlaceValue = ordPeopleObject.regPlace;
        this.birthPlaceValue = ordPeopleObject.birthPlace;
        this.regNoValue = ordPeopleObject.regNo;
        this.birthDayValue = ordPeopleObject.birthDate;
        //ordPeople

        //clients
        this.idCardValue = clients.idType;
        this.idNumberValue = clients.idNo;
        this.purposeValue = clients.relPurpose;
        this.sourceValue = clients.idSource;
        this.grantDateValue = clients.idDate;
        this.expireDateValue = clients.idExpDate;
        this.nationalityValue = clients.nationality; //ko.observable(null);
        this.residentValue = ko.observable(null);
        this.emailValue = clients.eMail;
        this.phonValue = clients.telephone;
        this.mobileValue = clients.mobileTelephone;
        this.faxValue = clients.faxNo;
        this.poBoxValue = clients.pOBox;
        this.addressValue = clients.address;
        this.cityValue = clients.addrCity;
        this.zoneValue = clients.addrRegion;
        this.streetValue = clients.addrStreet;
        this.buildingValue = clients.addrBuild;
        //economicEfficiencyValue
        this.sectorValue = clients.sector;
        this.subSectorValue = clients.subSector;

        this.solvencyValue = clients.finAbility;
        this.clientNotes = clients.noteText;
        this.iSIC4Value = clients.occupation;
        this.iSIC2Value = ko.observable(null);
        this.clientEmployer = clients.workFor;
        this.clientWPosition = clients.workTitle;
        this.clientWoPhone = clients.workTelephone;
        this.clientWoAddress = clients.workAddr;
        //economicEfficiencyValue
        //clients
        //economicEfficiencyValue

        this.activityValue = clients.activityType;

        this.sectorDataProvider = new ArrayDataProvider(this.sectors, { keyAttributes: 'code' });
        this.subSectorDataProvider = new ArrayDataProvider(this.subSectors, { keyAttributes: 'code' });
        this.activityDataProvider = new ArrayDataProvider(this.activities, { keyAttributes: 'code' });
        //end of economicEfficiencyValue
        //search Mode
        this.companies = companies;
        this.idBarcodeSent = ko.observable(false);
        this.idBarcodeDone = ko.observable(false);
        this.loading = ko.observable(false);
        this.internalNoValue = ko.observable(0);
        this.srNameValue = ko.observable('');
        this.srFatherValue = ko.observable('');
        this.srLastNameValue = ko.observable('');
        this.srMotherValue = ko.observable('');
        this.srNationalNoValue = ko.observable();
        this.pictureSrc = ko.observable();
        this.signScr = ko.observable();
        this.pictureLoaded = ko.observable(false);
        this.signLoaded = ko.observable(false);

        this.isDisabled = ko.observable(true);
        this.currOccupation = ko.observable();

        this.pictureImage = ko.observable();
        this.signImage = ko.observable();

        this.currOccupation.subscribe((value) => {
            this.isDisabled(value.childs != 0);
        });

        this.srNameValue.subscribe(async () => {
            this.loading(true);
            await this._fillOrdPeople();
        });
        this.srFatherValue.subscribe(async () => {
            this.loading(true);
            await this._fillOrdPeople();
        });
        this.srLastNameValue.subscribe(async () => {
            this.loading(true);
            await this._fillOrdPeople();
        });
        this.srMotherValue.subscribe(async () => {
            this.loading(true);
            await this._fillOrdPeople();
        });
        this.srNationalNoValue.subscribe(async () => {
            this.loading(true);
            this._fillOrdPeople();
        });

        this.isSrParametersValue = ko.observable(null);
        this.docValue = ko.observable(null);
        this.docValue.subscribe(async (newValue) => {
            this.loading(true);
            this._fillOrdPeople();
        });
        this.docArray = ko.observableArray([]);
        this.docDataProvider = new ArrayDataProvider(this.docArray, { keyAttributes: 'code' });

        this.companyValue = ko.observable(null);
        this.companiesDataProvider = new ArrayDataProvider(this.companies, { keyAttributes: 'clientNo' });

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
                minWidth: '7rem',
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
                id: coreUtils.generateUniqueId(),
            },
            {
                field: 'fatherName',
                headerText: _t('inputs.father'),
                weight: 2,
                className: 'oj-helper-text-align-start',
                minWidth: '10rem',
                template: 'fatherTemplate',
                id: coreUtils.generateUniqueId(),
            },
            {
                field: 'motherName',
                headerText: _t('inputs.motherName'),
                className: 'oj-helper-text-align-start',
                minWidth: '8rem',
                weight: 2,
                template: 'motherTemplate',
                id: coreUtils.generateUniqueId(),
            },
        ]);

        this.srOrdPeopleDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.srOrdPeople, {
                keyAttributes: 'clientNo',
            })
        );

        // // NUMBER AND DATE CONVERTER ////
        this.numberConverter = new ojconverter_number_1.IntlNumberConverter({
            style: 'decimal',
            useGrouping: false,
        });

        this.selectionInfo = ko.observable(0);
        //end search Mode

        this.internalNoValue = ko.observable(null);

        this.economicEfficiencyValue = ko.observable(null); //to convert to فعالية اقتصادية

        this.emailAddressMessages = ko.observableArray([]);

        this.sexDataProvider = new ArrayDataProvider(this.sexArray, { keyAttributes: 'code' });

        this.idCardDataProvider = new ArrayDataProvider(this.idCards, { keyAttributes: 'code' });

        this.nationalityDataProvider = new ArrayDataProvider(this.nationalities, { keyAttributes: 'nationalNo' });

        this.ContactPref = { EMAIL: 'email' };
        this.contactPref = ko.observable(this.ContactPref['EMAIL']);
        this.contactPref.subscribe((newValue) => {
            this.clearMessagesOnDependentsOfContactPref(newValue);
        });

        this.messageBannerData = serviceUtils.messageBannerData;
        serviceUtils._closeMessageBanner();
    };

    /**
     * @function _initAllVariables
     * @description Initialize All Variables
     */

    membersViewModel.prototype._initAllVariables = function () {
        this.maxBirthday = '2023-06-01';
        this.minBirthday = '2000-01-01';
    };

    /**
     *
     * @function _birthdayValueListener
     * @param {event}
     *@description Calculates the age based on ISOStrings when birthday changed
     */

    membersViewModel.prototype._birthdayValueListener = function (event) {
        const value = event.detail.value;
        if (value) this.InputAgeValue(this._getAge(value));
    };

    /**
     * @function _initIds
     * @description Initialize All Ids
     */

    membersViewModel.prototype._initLabels = function () {
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
        this.nameLabel = _t('inputs.firstName');
        this.lastNameLabel = _t('inputs.lastName');
        this.fatherLabe = _t('inputs.father');
        this.motherLabe = _t('inputs.motherName');
        this.motherLastNameLabel = _t('inputs.motherLastName');
        this.idNumberLabel = _t('inputs.idNo');
        this.ageLabel = _t('inputs.age');
        this.idCardLabel = _t('inputs.idNo');
        this.sexLabel = _t('inputs.sex');
        this.purposeLabel = _t('inputs.purpose');
        this.husbandLabe = _t('inputs.husband');
        this.sourceLabe = _t('inputs.source');
        this.nationalNoLabel = _t('inputs.nationalNo');
        this.expireDateLabe = _t('inputs.expireDate');
        this.grantDateLabe = _t('inputs.grantDate');
        this.birthDayLabe = _t('inputs.birthDate');
        this.regNoLabel = _t('inputs.regNo');
        this.birthPlaceLabel = _t('inputs.birthPlace');
        this.regPlaceLabel = _t('inputs.regPlace');
        this.nationalityLabel = _t('inputs.nationality');
        this.residentLabel = _t('labels.resident');
        this.emailLabe = _t('inputs.eMail');
        this.phonLabel = _t('inputs.phon');
        this.mobileLabel = _t('inputs.mobile');
        this.faxLabel = _t('inputs.fax');
        this.poBoxLabe = _t('inputs.poBox');
        this.addressLabel = _t('inputs.address');
        this.cityLabel = _t('inputs.city');
        this.zoneLabel = _t('inputs.zone');
        this.streetLabel = _t('inputs.street');
        this.buildingLabe = _t('inputs.building');
        this.signLabel = _t('labels.sign');
        this.imageLabel = _t('labels.image');
        this.searchLabel = _t('buttons.search');
        this.economicEfficiencyLabel = _t('labels.economicEfficiency');
        this.internalLabel = _t('inputs.internal');
        this.newButtonLabel = _t('labels.new');
        this.institutionLabel = _t('labels.company');
        this.sectorLabel = _t('inputs.sector');
        this.subSectorLabel = _t('inputs.subSector');
        this.economistActivityLabel = _t('inputs.activityType');
        this.solvencyLabel = _t('inputs.solvency');
        this.clientNotesLabel = _t('inputs.note');
        this.clientEmployerLabel = _t('inputs.clientEmployer');
        this.clientWPositionLabel = _t('inputs.clientWPosition');
        this.clientWoPhoneLabel = _t('inputs.clientWoPhone');
        this.clientWoAddressLabel = _t('inputs.clientWoAddress');
        this.selectLabel = _t('labels.select');
        this.choseOccupationLabel = _t('labels.choseOccupation');
    };

    /**
     * @function _initAllEventListeners
     * @description Initialize Listeners
     */

    membersViewModel.prototype._initAllEventListeners = function () {
        this.flipCard = async (event) => {
            let element;
            if (event.srcElement.tagName == 'IMG') {
                event.srcElement.setAttribute('data-visible', false);
                element = event.srcElement.parentNode.parentNode;
                if (element.getAttribute('animatable')) {
                    AnimationUtils['flipOut'](element, {
                        flipTarget: 'children',
                        persist: 'all',
                        startAngle: '180deg',
                        endAngle: '0deg',
                    });
                }
            } else {
                element = event.srcElement.parentNode.parentNode.parentNode;
                switch (event.srcElement.parentNode.parentNode.id) {
                    case this.pictureAvatarID:
                        document.getElementById(this.pictureImageID).setAttribute('data-visible', true);
                        await this._readImage(1);
                        break;
                    case this.signAvatarID:
                        document.getElementById(this.signImageID).setAttribute('data-visible', true);
                        await this._readImage(2);
                        break;
                    default:
                        if (element.getAttribute('animatable')) {
                            AnimationUtils['flipOut'](element, {
                                flipTarget: 'children',
                                persist: 'all',
                                startAngle: '0deg',
                                endAngle: '180deg',
                            });
                        }
                        break;
                }
            }
        };

        this.showAvatars = () => {
            this.pictureImage(null);
            this.signImage(null);
            let array = [document.getElementById(this.pictureImageID), document.getElementById(this.signImageID)];
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element) {
                    if (element.getAttribute('data-visible') == 'true') {
                        element.setAttribute('data-visible', 'false');
                        AnimationUtils['flipOut'](element.parentNode, {
                            flipTarget: 'children',
                            persist: 'all',
                            startAngle: '180deg',
                            endAngle: '0deg',
                        });
                    }
                }
            }
        };

        this.handleScanImage = async (event) => {
            const btnID = event.srcElement.id;
            const element = event.srcElement.parentNode;
            if (element.getAttribute('animatable')) {
                AnimationUtils['flipOut'](element, {
                    flipTarget: 'children',
                    persist: 'all',
                    startAngle: '180deg',
                    endAngle: '0deg',
                });
            }
            let imgCommand = {
                indent: 'images',
                params: [],
            };
            if (btnID == 'scanPictureID')
                imgCommand.params.push({
                    name: 'TYPE',
                    data_type: 'boolean',
                    value: 0,
                });
            else
                imgCommand.params.push({
                    name: 'TYPE',
                    data_type: 'boolean',
                    value: 1,
                });
            Promise.all([serviceUtils.ajaxGetLocalData(imgCommand)])
                .then(
                    async function (values) {
                        let array;
                        if (values) {
                            if (values.length > 0) {
                                array = coreUtils.parseJSON(values[0]);
                                if (array.error) {
                                    console.log(array.error);
                                    this.pictureLoaded(false);
                                    this.signLoaded(false);
                                } else {
                                    for (let index = 0; index < array.length; index++) {
                                        const element = array[index];
                                        if (element.name == 'picture') {
                                            if (element.image) {
                                                this.pictureLoaded(true);
                                                this.purPictureSrc(element.image);
                                                this.pictureSrc(
                                                    `data:image/jpg;charset=utf8;base64, ${this.purPictureSrc()}`
                                                );
                                            } else {
                                                this.pictureLoaded(false);
                                                this.purPictureSrc(null);
                                                this.pictureSrc(null);
                                            }
                                        } else {
                                            if (element.image) {
                                                this.signLoaded(true);
                                                this.purSignScr(element.image);
                                                this.signScr(`data:image/jpg;charset=utf8;base64, ${element.image}`);
                                            } else {
                                                this.signLoaded(false);
                                                this.purSignScr(null);
                                                this.signScr(null);
                                            }
                                        }
                                    }
                                    let cards = document.getElementsByClassName('core-image-sign');
                                    for (let index = 0; index < cards.length; index++) {
                                        const element = cards[index];
                                        element.setAttribute('animatable', true);
                                        element.addEventListener('click', this.flipCard);
                                    }
                                }
                            }
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        };
        this.handleSearchParamsChanged = async () => {
            //this.Loading(true);
            await this._fillOrdPeople();
        };

        this.handleCloseMessageBanner = (event) => {
            let data = this.messageBannerData.data.slice();
            const closeMessageKey = event.detail.key;
            data = data.filter((message) => message.id !== closeMessageKey);
            this.messageBannerData.data = data;
        };
        this.ojValidChanged = (event) => {
            this.validationGroupValid(event.detail.value);
            this.clientNo(null);
        };

        this.occTreeSelectedChanged = (event) => {
            this.currOccupation(event.detail);
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
        this.handleSearch = () => {
            this.searchMode(!this.searchMode());
            if (!this.searchMode()) {
                this._readIDBarcode();
            }

            let cards = document.getElementsByClassName('_oj-animatable');
            for (let index = 0; index < cards.length; index++) {
                const element = cards[index];
                element.setAttribute('animatable', true);
                element.addEventListener('click', this.flipCard);
            }

            serviceUtils._closeMessageBanner();
            ordPeopleObject.searchMode(this.searchMode());
        };
        this.handleNewAction = () => {
            this.searchMode(!this.searchMode());
        };

        this.handleChoseISIC2 = () => {
            let dialogID = `#${this.itsChoseOccupationDialog}`;
            if (dialogID) document.querySelector(dialogID).open();
        };

        this.selectedChangedListener = async (event) => {
            const row = event.detail.value.row;
            this.showAvatars();
            let found = false;
            if (row.values().size > 0) {
                row.values().forEach(async (value) => {
                    let keySet = new Set();
                    keySet.add(value);
                    let aValue = await this.srOrdPeopleDataProvider.fetchByKeys({ keys: keySet });
                    const data = aValue.results.get(value).data;

                    serviceUtils._closeMessageBanner();
                    let missingInfo = serviceUtils._collectMissingInfo(data);

                    this.clientNo(data.clientNo);
                    this.clientName(
                        `${data.firstName} ${data.fatherName != null ? data.fatherName : ''} ${data.lastName} ${
                            data.motherName != null ? data.motherName : ''
                        }`
                    );
                    await serviceUtils._getClientTransactions(data.clientNo, this.isBlackListed);

                    serviceUtils._showMessageBanner('warning', _t('labels.missingInfo'), [missingInfo]);

                    const array = this.relation();
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];

                        if (element.clientNo1 == value) {
                            this.companyValue(element.clientNo2);
                            found = true;
                            break;
                        }
                    }
                    if (!found) this.companyValue(null);
                });
            }
            // this.isDisabled(row.values().size === 0);
        };
    };

    /**
     * @function _initValidators
     * @description Initialize Validators
     */

    membersViewModel.prototype._initValidators = function () {
        this.emailValidator = coreUtils.emailValidator;
        this.mobileValidator = coreUtils.mobileValidator;
        this.phoneValidator = coreUtils.phoneValidator;
        this.pNameValidators = coreUtils.pNameValidators;
        this.cNameValidators = coreUtils.cNameValidators;
        this.dateValidator = coreUtils.dateValidator;

        this.nationalNoValidator = [
            new AsyncRegExpValidator({
                pattern: '^([0-9][0-9]{10})$',
                label: _t('Validators.nationalNo.label'),
                hint: _t('Validators.nationalNo.hint'),
                messageSummary: `{label} ${_t('Validators.unAcceptable')}`,
                messageDetail: `{label} ${_t('Validators.unAcceptable')}`,
            }),
        ];
    };

    membersViewModel.prototype.clearMessagesOnDependentsOfContactPref = function (newValue) {
        if (newValue === this.ContactPref['EMAIL']) {
            this.emailAddressMessages([]);
        }
    };

    membersViewModel.prototype._initFetchData = function () {
        const docCommand = {
            token: localStorage.getItem('token'),
            table: 'DOC_TYPE',
            order: 'CODE',
            select: [],
        };
        docCommand.select.push('DISTINCT *');
        serviceUtils.fetchData(docCommand, this.docArray);
    };

    membersViewModel.prototype._fillOrdPeople = async function () {
        serviceUtils._closeMessageBanner();
        this.srOrdPeople([]);
        let srCommand = this.eCommand;
        srCommand.where = [];
        srCommand.join = [];
        srCommand.join.push({
            table: ' ORD_PEOPLE',
            type: 'inner',
            condition: ' (CLIENTS.CLIENT_NO = ORD_PEOPLE.CLIENT_NO)',
        });

        if (this.internalNoValue() != null) srCommand.where.push(`ORD_PEOPLE.CLIENT_NO = ${this.internalNoValue()}`);
        if (this.srNameValue() != '') srCommand.where.push(`FIRST_NAME LIKE '%${this.srNameValue()}%'`);
        if (this.srFatherValue() != '') srCommand.where.push(`FATHER_NAME LIKE '%${this.srFatherValue()}%'`);
        if (this.srLastNameValue() != '') srCommand.where.push(`LAST_NAME LIKE '%${this.srLastNameValue()}%'`);
        if (this.srMotherValue() != '') srCommand.where.push(`MOTHER_NAME LIKE '%${this.srMotherValue()}%'`);
        //if (this.srMotherValue() != '') srCommand.where.push(`MOTHER_NAME LIKE '%${this.srMotherValue()}%'`);
        if (this.srNationalNoValue() != null) srCommand.where.push(`NATIONAL_NO = '${this.srNationalNoValue()}'`);
        if (this.isSrParametersValue() != 'isFalse' && this.docValue() != null) {
            srCommand.join.push({
                table: 'CLIENT_DOC_TYPE',
                type: 'inner',
                condition: 'CLIENTS.CLIENT_NO = CLIENT_DOC',
            });
            srCommand.where.push(`CLIENT_DOC.DOC_TYPE = ${this.docValue()}`);
        }
        const n = srCommand.where.length;
        if (n > 0) await serviceUtils.fetchData(srCommand, this.srOrdPeople, this.loading);
    };

    membersViewModel.prototype._readIDBarcode = async function () {
        //wait for barcode
        if (!this.idBarcodeDone()) {
            let barcodeCommand = {
                indent: 'idBarcode',
                params: [],
            };
            if (!this.idBarcodeSent()) {
                this.idBarcodeSent(true);

                Promise.all([serviceUtils.ajaxGetLocalData(barcodeCommand)])
                    .then(
                        await function (values) {
                            let array;
                            if (values) {
                                if (values.length > 0) {
                                    array = coreUtils.parseJSON(values[0]);
                                    if (array.error) {
                                        console.log(array.error);
                                    } else {
                                        const element = array[0];
                                        ordPeopleObject.firstName(element.name);
                                        ordPeopleObject.lastName(element.lastName);
                                        ordPeopleObject.fatherName(element.fatherName);
                                        ordPeopleObject.motherName(element.motherName);
                                        ordPeopleObject.motherLastName(element.motherLastName);
                                        ordPeopleObject.nationalNo(element.nationalNo);
                                        ordPeopleObject.birthDate(element.birthDate);
                                        ordPeopleObject.birthPlace(element.birthPlace);
                                        this.idBarcodeDone(true);
                                    }
                                }
                            }
                            this.idBarcodeSent(false);
                        }.bind(this)
                    )
                    .catch(
                        function (reason) {
                            this.idBarcodeSent(false);
                            console.log(reason);
                        }.bind(this)
                    );
            }
        }
        //end wait for barcode

        membersViewModel.prototype._readImage = async function (image) {
            if (image == 1 && this.pictureImage() != null) return;
            if (image == 2 && this.signImage() != null) return;

            let imageCommand = {
                token: localStorage.getItem('token'),
                table: 'LARGE_OBJECTS',
                select: [' LARGE_OBJECTS.LO_BLOB'],
                join: [],
                where: [],
            };

            imageCommand.join.push({
                table: 'LARGE_OBJECT_DOC',
                type: 'inner',
                condition: 'LARGE_OBJECT_DOC.LO_DOC_NO = LARGE_OBJECTS.DOC_NO',
            });
            imageCommand.where.push(`LARGE_OBJECT_DOC.LOD_DOC_NO =${this.clientNo()}`);
            imageCommand.where.push(`LARGE_OBJECTS.LO_TYPE =${image}`);

            Promise.all([serviceUtils.ajaxSendRequest('getTable', imageCommand)])
                .then(
                    await function (values) {
                        let array;
                        if (values) {
                            if (values.length > 0) {
                                array = coreUtils.parseJSON(values[0]);

                                if (array.error) {
                                    console.log(array.error);
                                } else {
                                    const element = array[0];
                                    let elm;
                                    if (image == 1) {
                                        if (element == undefined) {
                                            this.pictureImage(null);
                                        } else {
                                            elm = document.getElementById(this.pictureImageID);
                                            this.pictureImage(`data:image/jpg;charset=utf8;base64, ${element}`);
                                        }
                                    } else {
                                        if (element == undefined) {
                                            this.signImage(null);
                                        } else {
                                            elm = document.getElementById(this.signImageID);
                                            this.signImage(`data:image/jpg;charset=utf8;base64, ${element}`);
                                        }  
                                    }
                                    elm = elm.parentNode;
                                    if (element != undefined) {
                                        if (elm.getAttribute('animatable')) {
                                            AnimationUtils['flipOut'](elm, {
                                                flipTarget: 'children',
                                                persist: 'all',
                                                startAngle: '0deg',
                                                endAngle: '180deg',
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }.bind(this)
                )
                .catch(
                    function (reason) {
                        console.log(reason);
                    }.bind(this)
                );
        };
    };
    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return membersViewModel;
});
