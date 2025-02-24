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
    'utils/Service',
    'utils/Core',
    'utils/CommonData',
    'ojs/ojarraydataprovider',
    'ojs/ojconverter-number',
    'ojs/ojmodule-element-utils',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'ojs/ojmutablearraydataprovider',
    'tables/OrdPeople',
    'tables/Clients',
    'tables/Companies',
    'tables/Notes',

    'ojs/ojknockout',
    'ojs/ojnavigationlist',
    'ojs/ojinputnumber',
    'ojs/ojmodule-element-utils',
    'oj-c/button',
    'ojs/ojvalidationgroup',
    'ojs/ojformlayout',
    'ojs/ojnavigationlist',
    'oj-c/message-toast',
], function (
    Translations,
    ko,
    serviceUtils,
    coreUtils,
    commonData,
    ArrayDataProvider,
    ojconverter_number_1,
    moduleElementUtils,
    responsiveUtils,
    responsiveKnockoutUtils,
    MutableArrayDataProvider,
    ordPeople,
    clients,
    cm,
    notes
) {
    const _t = Translations.getTranslatedString;
    function clientCardViewModel(params) {
        this.connected = () => {};
        this._initAll_labels();
        this._initAllObservable(params);
        this._initAllEventListeners();
        this._initAllVariables();
        this._fetchData();
    }

    clientCardViewModel.prototype._initAllObservable = async function (params) {
        const { vSelectedItem, clientData, companies, accLinks, path ,suPath} = params;
        this.vSelectedItem = vSelectedItem;
        this.vSelectedName = ko.observable(null);
        this.clientData = clientData;
        this.accLinks = accLinks;
        this.path = path;
        this.suPath = suPath;
        this.companies = companies;

        this.sexArray = commonData.sexArray;
        this.idCards = commonData.idCards;
        this.nationalities = commonData.nationalities;
        this.companyTypes = commonData.companyTypes;
        this.sectors = commonData.sectors;
        this.subSectors = commonData.subSectors;
        this.activities = commonData.activities;

        this.numberConverter = new ojconverter_number_1.IntlNumberConverter();
        this.fromChequeValue = ko.observable(null);
        this.toChequeValue = ko.observable(null);
        this.validationGroupValid = ko.observable(null);
        this.currClientType = ko.observable('members');
        this.currClientType.subscribe(() => {
            this.clientNo(null);
        });
        this.searchMode = ko.observable(false);
        this.searchMode.subscribe(() => {
            this.clientNo(null);
        });
        this.clientNo = ko.observable();
        this.clientName = ko.observable();
        this.isBlackListed = ko.observable(false);

        this.branchTypes = ko.observableArray([]);
        this.cities = ko.observableArray([]);
        this.branches = ko.observableArray([]);
        this.ordPeople = ko.observableArray([]);
        this.relation = ko.observableArray([]);
        this.ClientDocType = ko.observableArray([]);
        this.purPictureSrc = ko.observable();
        this.purSignScr = ko.observable();
        this.messages = new MutableArrayDataProvider([], {
            keyAttributes: 'id',
        });

        this.clientTypeDataProvider = new ArrayDataProvider(this.clientData(), { keyAttributes: 'id' });

        this.cardsModuleConfig = (item) => {
            return moduleElementUtils.createConfig({
                name: 'ClientCards/cards/' + item,
                params: {
                    vSelectedItem: this.vSelectedItem,
                    currClientType: this.currClientType,
                    sexArray: this.sexArray,
                    idCards: this.idCards,
                    nationalities: this.nationalities,
                    companyTypes: this.companyTypes,
                    companies: this.companies,
                    branchTypes: this.branchTypes,
                    cities: this.cities,
                    branches: this.branches,
                    sectors: this.sectors,
                    subSectors: this.subSectors,
                    activities: this.activities,
                    ordPeople: this.ordPeople,
                    eCommand: this.eCommand,
                    relation: this.relation,
                    validationGroupValid: this.validationGroupValid,
                    searchMode: this.searchMode,
                    clientNo: this.clientNo,
                    clientName: this.clientName,
                    isBlackListed: this.isBlackListed,
                    purPictureSrc: this.purPictureSrc,
                    purSignScr: this.purSignScr,
                },
            });
        };
        let mdQuery = responsiveUtils.getFrameworkQuery('md-up');
        if (mdQuery) {
            this.medium = responsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
        }

        this.isDisabled = ko.pureComputed(
            function () {
                let key = this.currClientType();
                result = false;
                switch (key) {
                    case 'members':
                        if (!this.searchMode()) result = this.validationGroupValid() != 'valid';
                        else result = this.clientNo() == null;
                        break;
                    case 'legalPerson':
                        if (!this.searchMode()) result = this.validationGroupValid() != 'valid';
                        else result = this.clientNo() == null;
                        break;
                    default:
                        result = this.clientNo() == null;
                        break;
                }
                return result;
            }.bind(this)
        );
    };
    clientCardViewModel.prototype._initAllVariables = function () {
        this.vSelectedItem.subscribe((newValue) => {
            this.vSelectedItem(newValue);
            if (newValue === 'cheques') this.vSelectedName(_t('labels.' + newValue + 'Book'));
            else this.vSelectedName(_t('labels.' + newValue));
        });
    };

    clientCardViewModel.prototype._initAll_labels = function () {
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
        this.fromChequeLabel = _t('inputs.fromNo');
        this.toChequeLabel = _t('inputs.toNo');
    };

    clientCardViewModel.prototype._initAllEventListeners = function () {
        this.handleCloseMessage = (event) => {
            let data = this.messages.data.slice();
            const closeMessageKey = event.detail.key;
            data = data.filter((message) => message.id !== closeMessageKey);
            this.messages.data = data;
        };
        this.handleCancel = () => {
            this.vSelectedItem(null);
            ordPeople._clear();
            clients._clear();
            cm._clear();
            notes._clear();
        };
        this.handleApply = async () => {
            let ClientCommand;
            let toDO;
            switch (this.currClientType()) {
                case 'legalPerson':
                    if (!this.searchMode()) {
                        toDO = async function (params) {
                            ClientCommand = {
                                table: 'CLIENTS',
                                indent: 'INSERT',
                                keys: { clientNo: clients.clientNo() },
                                fields: clients.fields(),
                            };
                            cm.clientNo(clients.clientNo());
                            const cmCommand = {
                                table: 'COMPANIES',
                                indent: 'INSERT',
                                keys: { ClientNo: clients.clientNo() },
                                fields: cm.fields(),
                            };
                            let keySet = new Set();
                            keySet.add(this.currClientType());

                            let value = await this.clientTypeDataProvider.fetchByKeys({ keys: keySet });
                            ClientCommand.fields.TYPE = value.results.get(this.currClientType()).data.code;
                            const notesCommand = {
                                table: 'NOTES',
                                indent: 'INSERT',
                                keys: { notesNo: clients.notesNo },
                                fields: { notesNo: clients.notesNo(), descr: clients.noteText() },
                            };
                            let addCommand = {
                                token: localStorage.getItem('token'),
                                commands: [cmCommand, ClientCommand],
                            };
                            if (clients.noteText() != null) addCommand.commands.push[notesCommand];
                            Promise.all([serviceUtils.ajaxSendRequest('editTables', addCommand)])
                                .then(
                                    await function (values) {
                                        if (values.length > 0) {
                                            let editData = coreUtils.parseJSON(values[0]);
                                            if (editData.error == 'success') {
                                                this.clientNo(clients.clientNo());
                                                this.clientName(cm.name());
                                                this._initAccLink();
                                                this.vSelectedItem(null);
                                            }
                                            if (editData.error == 'error')
                                                serviceUtils._showToastMessage(
                                                    this.messages,
                                                    'error',
                                                    editData.console
                                                );
                                        }
                                    }.bind(this)
                                )
                                .catch(function (reason) {
                                    console.log(reason);
                                });
                        }.bind(this);

                        await clients.getNewID(toDO);
                    } else {
                        this._initAccLink();
                        this.vSelectedItem(null);
                    }

                    break;

                case 'members':
                    if (!this.searchMode()) {
                        toDO = async function (params) {
                            ClientCommand = {
                                table: 'CLIENTS',
                                indent: 'INSERT',
                                keys: { clientNo: clients.clientNo() },
                                fields: clients.fields(),
                            };
                            ordPeople.clientNo(clients.clientNo());
                            const ordPeopleCommand = {
                                table: 'ORD_PEOPLE',
                                indent: 'INSERT',
                                keys: { ClientNo: clients.clientNo() },
                                fields: ordPeople.fields(),
                            };
                            let keySet = new Set();
                            keySet.add(this.currClientType());

                            let value = await this.clientTypeDataProvider.fetchByKeys({ keys: keySet });
                            ClientCommand.fields.TYPE = value.results.get(this.currClientType()).data.code;
                            const notesCommand = {
                                table: 'NOTES',
                                indent: 'INSERT',
                                keys: { notesNo: clients.notesNo },
                                fields: { notesNo: clients.notesNo(), descr: clients.noteText() },
                            };
                            let addCommand = {
                                token: localStorage.getItem('token'),
                                commands: [ordPeopleCommand, ClientCommand],
                            };
                            if (clients.noteText() != null) addCommand.commands.push(notesCommand);
                            let cerateDate = serviceUtils._isoDate(Date.now());

                            if (this.purSignScr() != null) {
                                let addSignCommand = {
                                    table: 'LARGE_OBJECTS',
                                    BLOB: ['LO_BLOB'],
                                    indent: 'INSERT',
                                    keys: { docNo: clients.lgDocNo2() },
                                    fields: {
                                        DOC_NO: clients.lgDocNo2(),
                                        LO_TYPE: 2,
                                        LO_BLOB: this.purSignScr(),
                                        CREATE_DATE: cerateDate,
                                        STATUS: 1,
                                    },
                                };

                                let addDocSignCommand = {
                                    table: 'LARGE_OBJECT_DOC',
                                    indent: 'INSERT',
                                    keys: { docNo: clients.docNo2() },
                                    fields: {
                                        DOC_NO: clients.docNo2(),
                                        DOC_TYPE: 30,
                                        LOD_DOC_NO: clients.clientNo(),
                                        LO_DOC_NO: clients.lgDocNo2(),
                                        STATUS: 1,
                                    },
                                };
                                addCommand.commands.push(addSignCommand);
                                addCommand.commands.push(addDocSignCommand);
                            }

                            if (this.purPictureSrc() != null) {
                                let addPictureCommand = {
                                    table: 'LARGE_OBJECTS',
                                    BLOB: ['LO_BLOB'],
                                    indent: 'INSERT',
                                    keys: { docNo: clients.lgDocNo1() },
                                    fields: {
                                        DOC_NO: clients.lgDocNo1(),
                                        LO_TYPE: 1,
                                        LO_BLOB: this.purPictureSrc(),
                                        CREATE_DATE: cerateDate,
                                        STATUS: 1,
                                    },
                                };

                                let addDocPictureCommand = {
                                    table: 'LARGE_OBJECT_DOC',
                                    indent: 'INSERT',
                                    keys: { docNo: clients.docNo1() },
                                    fields: {
                                        DOC_NO: clients.docNo1(),
                                        DOC_TYPE: 30,
                                        LOD_DOC_NO: clients.clientNo(),
                                        LO_DOC_NO: clients.lgDocNo1(),
                                        STATUS: 1,
                                    },
                                };
                                addCommand.commands.push(addPictureCommand);
                                addCommand.commands.push(addDocPictureCommand);
                            }
                            Promise.all([serviceUtils.ajaxSendRequest('editTables', addCommand)])
                                .then(
                                    await function (values) {
                                        if (values.length > 0) {
                                            let editData = JSON.parse(values[0]);
                                            if (editData.error == 'success') {
                                                this.clientNo(clients.clientNo());
                                                this.clientName(
                                                    `${ordPeople.firstName()} ${
                                                        ordPeople.fatherName() != null ? ordPeople.fatherName() : ''
                                                    } ${ordPeople.lastName()} ${
                                                        ordPeople.motherName() != null ? ordPeople.motherName() : ''
                                                    }`
                                                    //`${ordPeople.firstName()} ${ordPeople.fatherName()} ${ordPeople.lastName()} ${ordPeople.motherName()}`
                                                );
                                                this._initAccLink();
                                                this.vSelectedItem(null);
                                            } else
                                                serviceUtils._showToastMessage(
                                                    this.messages,
                                                    'error',
                                                    editData.console
                                                );
                                        }
                                    }.bind(this)
                                )
                                .catch(function (reason) {
                                    console.log(reason);
                                });
                        }.bind(this);
                        if (ordPeople.isExists()) {
                            serviceUtils._showToastMessage(this.messages, 'error', _t('messages.duplicateName'));
                            return;
                        }
                        if (ordPeople.isNationalNoExists()) {
                            serviceUtils._showToastMessage(this.messages, 'error',_t('messages.duplicateNationalNo'));
                            return;
                        }
                        await clients.getNewID(toDO);
                    } else {
                        this._initAccLink();
                        this.vSelectedItem(null);
                    }

                    break;

                default:
                    this._initAccLink();
                    this.vSelectedItem(null);
                    break;
            }
        };
        this.handleHSelectionAction = (event) => {};
    };

    clientCardViewModel.prototype._fetchData = async function () {
        let bCommand = {
            token: localStorage.getItem('token'),
            table: 'BRANCHES',
            order: 'BRANCH_NO',
            where: [],
        };

        bCommand.where.push('TYPE = 1');
        //bCommand.where.push('ROWNUM < 350000');

        let btCommand = {
            token: localStorage.getItem('token'),
            table: 'BRANCHES_TYPE',
        };

        let cCommand = {
            token: localStorage.getItem('token'),
            table: 'CITY_TYPE',
        };

        this.eCommand = {
            token: localStorage.getItem('token'),
            table: 'CLIENTS',
            select: [],
            join: [],
            where: [],
        };

        this.eCommand.select.push('DISTINCT ORD_PEOPLE.CLIENT_NO');
        this.eCommand.select.push('FIRST_NAME');
        this.eCommand.select.push('LAST_NAME');
        this.eCommand.select.push('FATHER_NAME');
        this.eCommand.select.push('MOTHER_LAST_NAME');
        this.eCommand.select.push('MOTHER_NAME');
        this.eCommand.select.push('SEX');
        this.eCommand.select.push('BIRTH_PLACE');
        this.eCommand.select.push('BIRTH_DATE');
        this.eCommand.select.push('REG_NO');
        this.eCommand.select.push('REG_PLACE');
        this.eCommand.select.push('OCCUPATION');
        this.eCommand.select.push('NATIONALITY');
        this.eCommand.select.push('ID_TYPE');
        this.eCommand.select.push('ID_NO');
        this.eCommand.select.push('SECTOR');
        this.eCommand.select.push('ACTIVITY_TYPE');
        this.eCommand.select.push('NATIONAL_NO');
        this.eCommand.select.push('E_MAIL');

        this.eCommand.join.push({
            table: ' ORD_PEOPLE',
            type: 'inner',
            condition: encodeURI('(CLIENTS.CLIENT_NO = ORD_PEOPLE.CLIENT_NO)'),
        });

        let cdtCommand = {
            token: localStorage.getItem('token'),
            table: 'CLIENT_DOC_TYPE',
        };

        await Promise.all([
            serviceUtils.ajaxSendRequest('getTable', cCommand),
            serviceUtils.ajaxSendRequest('getTable', btCommand),
            serviceUtils.ajaxSendRequest('getTable', bCommand),
            serviceUtils.ajaxSendRequest('getTable', cdtCommand),
        ])
            .then(
                async function (values) {
                    if (values) {
                        if (values.length > 3) {
                            this.cities(coreUtils.parseJSON(values[0]));
                            this.branchTypes(coreUtils.parseJSON(values[1]));
                            this.branches(coreUtils.parseJSON(values[2]));
                            this.ClientDocType(coreUtils.parseJSON(values[3]));
                        }
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });

        const rCommand = {
            token: localStorage.getItem('token'),
            table: 'CLIENT_RELATION',
        };
        serviceUtils.fetchData(rCommand, this.relation);
    };

    clientCardViewModel.prototype._initAccLink = async function () {
        let code = clients._ClientDocType(this.path,this.suPath,this.vSelectedItem());
        let link = {};
        let lnkArray = this.accLinks();
        for (let i = 0; i < lnkArray.length; i++) {
            const element = lnkArray[i];
            if (element.clientNo == this.clientNo() && element.code == code) {
                serviceUtils._showToastMessage(this.messages, 'error',_t('messages.duplicateRelation'));
                return;
            }
        }
        link.type = this.vSelectedItem();
        link.name = this.clientName();
        link.clientNo = this.clientNo();
        const array = this.ClientDocType();
        if (code != null) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.code == code) {
                    link.code = element.code;
                    link.lnkName = element.descr;
                    break;
                }
            }
        }
        lnkArray.push(link);
        this.accLinks(lnkArray);
        ordPeople._clear();
        clients._clear();
        cm._clear();
        notes._clear();
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return clientCardViewModel;
});
