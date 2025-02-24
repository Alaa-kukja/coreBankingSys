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
    'ojs/ojarraydataprovider',
    'utils/Service',
    'utils/Core',
    'utils/Tafqeet',
    'utils/CommonData',
    'tables/OrdPeople',
    'tables/Clients',
    'tables/Companies',
    'tables/Accounts',
    'tables/Transactions',
    'tables/TransDetails',
    'tables/ClientDoc',
    'tables/AccInterest',
    'ojs/ojconverter-number',
    'ojs/ojmodule-element-utils',
    'ojs/ojbufferingdataprovider',
    'ojs/ojmutablearraydataprovider',

    'ojs/ojkeyset',
    'ojs/ojavatar',
    'ojs/ojcontext',
    'ojs/ojvalidationgroup',
    'ojs/ojknockout',
    'ojs/ojinputtext',
    'ojs/ojinputnumber',
    'ojs/ojdatetimepicker',
    'ojs/ojselectcombobox',
    'ojs/ojcheckboxset',
    'ojs/ojtable',
    'ojs/ojbinddom',
    'oj-c/button',
    'ojs/ojselectsingle',
    'oj-c/select-single',
    'ojs/ojformlayout',
    'ojs/ojlabelvalue',
    'ojs/ojnavigationlist',
    'oj-c/message-toast',
    'ojs/ojmodel',
    'ojs/ojprogress-circle',
], function (
    Translations,
    ko,
    ArrayDataProvider,
    serviceUtils,
    coreUtils,
    tafqeet,
    commonData,
    ordPeople,
    cl,
    cm,
    accounts,
    transaction,
    transDetail,
    clientDoc,
    accInterest,
    ojconverter_number_1,
    moduleElementUtils,
    BufferingDataProvider,
    MutableArrayDataProvider
) {
    const _t = Translations.getTranslatedString;
    function OpenAccountVieModel(params) {
        const { router } = params;
        this.router = router;

        transaction._clear();
        clientDoc._clear();
        transDetail._clear();
        accounts._clear();

        this.connected = async () => {
            //  document.title = 'Open Account';
            let cbArray = document.getElementsByTagName('oj-select-single');
            for (let index = 0; index < cbArray.length; index++) {
                const element = cbArray[index];
                let inputs = element.getElementsByTagName('input');
                for (let i = 0; i < inputs.length; i++) {
                    const e = inputs[i];
                    e.readOnly = true;
                }
            }
            await this._fetchData();
        };
        this.disconnected = () => {
            document.title = _t('titles.home');
        };

        this.transitionCompleted = () => {
            // Implement if needed
        };
        this._initAllIds();
        this._initLabels();
        this._initAllObservable();
        this._initAllEventListeners();
    }

    OpenAccountVieModel.prototype._initAllIds = function () {
        this.itsAccountDialog = coreUtils.generateUniqueId();
        this.itsSexID = coreUtils.generateUniqueId();
    };

    OpenAccountVieModel.prototype._initAllObservable = async function () {
        this.Currencies = commonData.Currencies;
        this.currencyDataProvider = new ArrayDataProvider(this.Currencies, { keyAttributes: 'currencyNo' });
        this.currencyValue = ko.observable(null);
        if (this.Currencies().length == 1) this.currencyValue(this.Currencies()[0].currencyNo);
        this.subPath = ko.observable(this.router._activeState.params.current);
        this.oppFlag = ko.observable(this.router._activeState.params.oppFlag);
        this.subSystem = ko.observable(this.router._activeState.params.subSystem);
        this.funcCode = ko.observable(this.router._activeState.params.funcCode);
        this.isDisabled = ko.computed(
            function () {
                return this.oppFlag() == 2;
            }.bind(this)
        );
        this.clientData = ko.observableArray([
            { name: _t('labels.members'), code: 3, id: 'members', icons: 'oj-ux-ico-accessibility' },
            { name: _t('labels.legalPerson'), code: 1, id: 'legalPerson', icons: 'oj-ux-ico-customer-request' },
            { name: _t('labels.branch'), code: 2, id: 'branch', icons: 'oj-ux-ico-branch' },
            { name: _t('labels.branchEmployee'), code: 4, id: 'branchEmployee', icons: 'oj-ux-ico-employee' },
        ]);

        this.parentsColumns = [
            { headerText: _t('labels.theCode'), field: 'accountNo', template: 'cellTemplate', id: 'accountNo' },
            {
                headerText: _t('labels.name'),
                field: 'name',
                template: 'cellTemplate',
                id: 'nameID',
            },
        ];

        this.getParentsItemText = (itemContext) => {
            return `${itemContext.data.accountNo} - ${itemContext.data.name}`;
        };

        this.interestsColumns = [
            { headerText: _t('labels.theCode'), field: 'intNo', template: 'cellTemplate', id: 'intNo' },
            { headerText: _t('labels.debitPercent'), field: 'creditInt', template: 'cellTemplate', id: 'creditInt' },
            { headerText: _t('labels.creditPercent'), field: 'debitInt', template: 'cellTemplate', id: 'debitInt' },
            {
                headerText: _t('labels.description'),
                field: 'descr',
                template: 'cellTemplate',
                id: 'descr',
            },
        ];

        this.getBenesItemText = (itemContext) => {
            return `${itemContext.data.intNo} - ${itemContext.data.creditInt}% - ${itemContext.data.debitInt}% - ${itemContext.data.descr}`;
        };

        //handel message toast
        //this.messages = serviceUtils.message;
        this.messages = new MutableArrayDataProvider([], {
            keyAttributes: 'id',
        });
        //end handling message toast

        //links definition
        this.accLinks = accounts.accLinks;
        this.accLinks.subscribe((value) => {
            if (value.length > 0) {
                if (this.accNameValue() == null || this.accNameValue() == '') {
                    if (value[0].type == 'accOwner') this.accNameValue(value[0].name);
                }
            }
        });
        this.accLinksDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.accLinks, {
                keyAttributes: 'linkNo',
            })
        );

        this.linkColumns = ko.observableArray([
            {
                field: 'name',
                // weight: 3,
                minWidth: '12rem',
                headerText: _t('titles.clientName'),
                id: 'nameID',
            },
            {
                field: 'lnkName',
                headerText: _t('titles.linkType'),
                minWidth: '12rem',
                id: 'lnkName',
            },
            {
                field: 'clientNo',
                headerText: _t('titles.clientNo'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start',
                id: 'clientNoID',
                minWidth: '12rem',
                maxWidth: '12rem',
            },
            {
                //headerText:_t('buttons.action'),
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-end oj-sm-padding-0-vertical',
                template: 'actionTemplate',
                sortable: 'disabled',
                resizable: 'disabled',
                maxWidth: '7rem',
                id: 'action',
            },
        ]);

        //end links definition

        this.numberConverter = new ojconverter_number_1.IntlNumberConverter();

        this.parentValue = accounts.parent;
        this.accID = accounts.accID;
        this.accNameValue = accounts.name;
        this.interestValue = accounts.interest;
        this.amountValue = accounts.amount;

        this.nAccID = ko.observable(null);
        this.path = ko.observable();
        this.parents = ko.observableArray([]);
        this.parentsDataProvider = new ArrayDataProvider(this.parents, {
            keyAttributes: 'accountNo',
        });

        this.roundingArr = commonData.roundingArr;
        this.roundingValue = ko.observable(null);

        this.roundingDataProvider = new ArrayDataProvider(this.roundingArr, { keyAttributes: 'code' });

        this.companies = ko.observableArray([]);

        this.interests = ko.observableArray([]);
        this.interestDataProvider = new ArrayDataProvider(this.interests, { keyAttributes: 'intNo' });

        this.noteValue = ko.observable(null);

        this.parentValue.subscribe(async (newValue) => {
            let current = {};
            if (newValue) {
                if (newValue > 0) {
                    for (let i = 0; i < this.parents().length; i++) {
                        if (this.parents()[i].accountNo == newValue) {
                            current = this.parents()[i];
                            accounts.parent(current.accountNo);
                            accounts.parentType(current.type);
                            accounts.nature(current.nature);
                            for (let index = 0; index < this.roundingArr().length; index++) {
                                if (this.roundingArr()[index].code === current.roundingPeriod)
                                    this.roundingValue(index);
                            }
                        }
                    }
                    let bCommand = {
                        token: localStorage.getItem('token'),
                        select: [],
                        table: 'ACCOUNTS',
                        join: [],
                        where: [],
                    };
                    bCommand.select.push('interests.*');
                    bCommand.where.push('ACCOUNTS.ACCOUNT_NO = ' + current.accountNo);
                    bCommand.join.push({
                        table: 'GEN_ACC_interest',
                        type: 'inner',
                        condition: 'ACCOUNTS.ACCOUNT_NO = GEN_ACC_interest.ACCOUNT_NO',
                    });
                    bCommand.join.push({
                        table: 'interestS',
                        type: 'inner',
                        condition: 'GEN_ACC_interest.INT_NO = interestS.INT_NO',
                    });

                    let sunCommand = {
                        token: localStorage.getItem('token'),
                        select: [],
                        table: 'ACCOUNTS',
                        join: [],
                        where: [],
                    };
                    sunCommand.select.push(' MAX(ACCOUNTS.ACCOUNT_NO) AS SUN_ID');
                    sunCommand.where.push('PARENT = ' + this.parentValue());

                    if (this.isDisabled()) {
                        await Promise.all([serviceUtils.ajaxSendRequest('getTable', sunCommand)])
                            .then(
                                function (values) {
                                    if (values.length > 0) {
                                        let sunID = coreUtils.parseJSON(values[0]);
                                        if (sunID) {
                                            let tempID = Number(sunID[0]) + 1;
                                            let strTempId = '' + tempID;
                                            let strParentValue = '' + this.parentValue();
                                            strTempId = strTempId.substring(strParentValue.length, strTempId.length);
                                            if (strTempId == '') strTempId = '0000001';
                                            this.accID(strTempId);
                                        }
                                    }
                                    return true;
                                }.bind(this)
                            )
                            .catch(function (reason) {
                                console.log(reason);
                            });
                    } else {
                        await Promise.all([
                            serviceUtils.ajaxSendRequest('getTable', bCommand),
                            serviceUtils.ajaxSendRequest('getTable', sunCommand),
                        ])
                            .then(
                                function (values) {
                                    if (values.length > 1) {
                                        let bArray = coreUtils.parseJSON(values[0]);
                                        if (bArray) {
                                            this.interests(bArray);
                                        }
                                        let sunID = coreUtils.parseJSON(values[1]);
                                        if (sunID) {
                                            let tempID = Number(sunID[0]) + 1;
                                            let strTempId = '' + tempID;
                                            let strParentValue = '' + this.parentValue();
                                            strTempId = strTempId.substring(strParentValue.length, strTempId.length);
                                            if (strTempId == '') strTempId = '0000001';
                                            this.accID(strTempId);
                                        }
                                    }
                                    return true;
                                }.bind(this)
                            )
                            .catch(function (reason) {
                                console.log(reason);
                            });
                    }
                } else this.interests([]);
            } else this.interests([]);
        });

        /**
         * init Vertical page control
         */
        this.openAccountTitle = ko.observable('');
        this.vSelectedItem = ko.observable(null);
        this.hPosition = ko.observable('end');
        this.vPosition = ko.observable('top');
        this.yOffset = ko.observable(20);
        this.xOffset = ko.observable(4);
        this.amountSpellingValue = ko.computed(
            function () {
                return tafqeet._tafqeet(this.amountValue());
            }.bind(this)
        );

        // this.hPosition = ko.observable('center');
        // this.vPosition = ko.observable('center');
        // this.yOffset = ko.observable(0);
        // this.xOffset = ko.observable(0);
        this.vSelectedItem.subscribe((newValue) => {
            if (newValue == null) {
                let dialog = document.querySelector(`#${this.itsAccountDialog}`);
                if (dialog) dialog.close();
            } else {
                if (newValue != 'cheques') {
                    this.hPosition = ko.observable('end');
                    this.vPosition = ko.observable('top');
                    this.yOffset = ko.observable(20);
                    this.xOffset = ko.observable(4);
                } else {
                    this.hPosition = ko.observable('center');
                    this.vPosition = ko.observable('center');
                    this.yOffset = ko.observable(0);
                    this.xOffset = ko.observable(0);
                }
            }
        });

        this.vData = ko.observableArray([]);

        switch (this.subPath()) {
            case 'openSAccount':
            case 'openSAccountWithInterest':
                this.vData([
                    { name: _t('labels.accOwner'), id: 'accOwner', icons: 'oj-ux-ico-contact-permission' },
                    { name: _t('labels.superior'), id: 'superior', icons: ' oj-ux-ico-avatar' },
                    { name: _t('labels.accDelegacy'), id: 'accDelegacy', icons: 'oj-ux-ico-contact-group-plus' },
                    { name: _t('labels.guardian'), id: 'guardian', icons: 'oj-ux-ico-adult-child-fill' },
                    { name: _t('labels.chequesBook'), id: 'cheques', code: null, icons: 'oj-ux-ico-book' },
                ]);
                break;

            default:
                this.vData([
                    { name: _t('labels.accOwner'), id: 'accOwner', icons: 'oj-ux-ico-person-info-search' },
                    { name: _t('labels.accDelegacy'), id: 'accDelegacy', icons: 'oj-ux-ico-contact-permission' },
                    { name: _t('labels.chequesBook'), id: 'cheques', code: null, icons: 'oj-ux-ico-book' },
                ]);
                break;
        }

        this.vDataProvider = new ArrayDataProvider(this.vData(), {
            keyAttributes: 'id',
        });

        this.accCardModuleConfig = moduleElementUtils.createConfig({
            name: 'ClientCards/ClientCards',
            params: {
                vSelectedItem: this.vSelectedItem,
                clientData: this.clientData,
                companies: this.companies,
                accLinks: this.accLinks,
                path: this.router._activeState.path,
                suPath: this.subPath(),
            },
        });
    };

    OpenAccountVieModel.prototype._initLabels = function () {
        this.deleteLabel = _t('buttons.delete');
        this.createLabel = _t('buttons.create');
        this.cancelLabel = _t('buttons.cancel');
        this.parentIDLabel = _t('labels.parent');
        this.IdLabel = _t('labels.id');
        this.accNameLabel = _t('inputs.accName');
        this.roundingIDLabel = _t('labels.roundingPeriod');
        this.AmountLabel = _t('inputs.amount');
        this.interestLabel = _t('labels.interest');
        this.noteLabel = _t('inputs.note');
        this.amountSpellingLabel = _t('inputs.amountSpelling');
        this.currencyLabel = _t('inputs.currency');
    };

    OpenAccountVieModel.prototype._initAllEventListeners = function () {
        this.handleDeleteLink = (event, context) => {
            console.log(context);
            let array = this.accLinks();
            let accNameMustChange = false;
            accNameMustChange = this.accNameValue() == context.row.name;
            array.splice(context.key, 1);
            let found = false;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.type == 'accOwner') {
                    found = true;
                    if (accNameMustChange) this.accNameValue(element.name);
                    break;
                }
            }
            if (found) this.accLinks(array);
            else serviceUtils._showToastMessage(this.messages, 'error', _t('messages.accOwner1MustNotDeleted'));
        };
        this.handleCloseMessage = (event) => {
            let data = this.messages.data.slice();
            const closeMessageKey = event.detail.key;
            data = data.filter((message) => message.id !== closeMessageKey);
            this.messages.data = data;
        };
        this.handleCancel = () => {
            ordPeople._clear();
            cl._clear();
            cm._clear();
            this.router.go({ path: '' });
        };
        this.handelApply = async () => {
            this._check();

            transaction.status(1);
            transaction.subSystem(this.subSystem());
            transaction.functionCode(this.funcCode());
            transaction.currencyNo(this.currencyValue());
            transaction.writer(1); //to be checked
            transaction.execDate(new Date()); //to be checked
            transaction.regDate(transaction.execDate()); //to be checked

            accounts.currencyNo(this.currencyValue());
            accounts.roundingPeriod(this.roundingValue());
            accounts.status(1); //active account
            accounts.oppFlag(this.oppFlag());

            let toDo = async function () {
                transDetail._init(transaction.transNo(), 1, 6, accounts.accountNo(), 0, 1, 1);
                const trDetailCommand = {
                    table: 'TRANS_DETAILS',
                    indent: 'INSERT',
                    keys: { transNo: transDetail.transNo(), detailNo: transDetail.detailNo() },
                    fields: transDetail.fields(),
                };

                const transCommand = {
                    table: 'TRANSACTIONS',
                    indent: 'INSERT',
                    keys: { transNo: transaction.transNo() },
                    fields: transaction.fields(),
                };

                const accCommand = {
                    table: 'ACCOUNTS',
                    doBefore: 'isAccountDataValid',
                    parentType: accounts.parentType(),
                    accID: accounts.accID(),
                    amount: accounts.amount(),
                    oppFlag: accounts.oppFlag(),
                    interest: accounts.interest(),
                    indent: 'INSERT',
                    keys: { accountNo: accounts.accountNo() },
                    fields: accounts.fields(),
                };

                let addCommand = {
                    token: localStorage.getItem('token'),
                    commands: [transCommand, accCommand, trDetailCommand],
                };

                let cdCommand = {};

                for (let index = 0; index < accounts.accLinks().length; index++) {
                    const element = accounts.accLinks()[index];
                    cdCommand.keys = { clientNo: element.clientNo, docNo: accounts.accountNo() };
                    clientDoc.clientNo(element.clientNo);
                    clientDoc.docNo(accounts.accountNo());
                    clientDoc.docType(6);
                    clientDoc.type(element.code);
                    clientDoc.docNoToTran(null);
                    clientDoc.status(1);
                    clientDoc.notesNo(0);
                    clientDoc.utilNo(null);
                    clientDoc.disAmount(null);
                    clientDoc.disFromDate(null);
                    clientDoc.disToDate(null);
                    clientDoc.disCause(null);
                    clientDoc.disAccountNo(null);
                    cdCommand = clientDoc._init(transaction.transNo(), 1, 2, null, 0, 1, 1);
                    addCommand.commands.push(cdCommand);
                }
                console.log(addCommand);
                Promise.all([serviceUtils.ajaxSendRequest('editTables', addCommand)])
                    .then(
                        await function (values) {
                            let value;
                            if (values.length > 0) {
                                value = coreUtils.parseJSON(values[0]);
                                if (value.error) {
                                    if (value.error == 'success')
                                        serviceUtils._showToastMessage(this.messages, 'info', _t('messages.savedOk'));
                                    else {
                                        serviceUtils._showToastMessage(this.messages, 'error', value.error);
                                        console.log(value.console);
                                    }
                                }
                            }
                        }.bind(this)
                    )
                    .catch(function (reason) {
                        console.log(reason);
                    });
            }.bind(this);

            transaction.getNewTransactionNo(toDo);
        };
        this.handleVSelectionAction = (event) => {
            if (this.accLinks().length == 0) {
                if (event.detail.value != 'accOwner') {
                    serviceUtils._showToastMessage(this.messages, 'error', _t('messages.accOwnerNotDefined'));
                    return;
                }
            }
            setTimeout(() => {
                const newValue = event.detail.value;
                let dialog = document.querySelector(`#${this.itsAccountDialog}`);
                if (dialog) {
                    if (newValue != null) dialog.open();
                }
                if (newValue === 'cheques') this.openAccountTitle(_t('labels.' + newValue + 'Book'));
                else this.openAccountTitle(_t('labels.' + newValue));
            }, 100);
        };
        this.preventNonNumbers = (event) => {
            let charCode = event.which ? event.which : event.keyCode;
            let char = String.fromCharCode(charCode);
            // Only allow .0123456789 (and non-display characters)
            let replacedValue = char.replace(/[^0-9\.]/g);
            if (char !== replacedValue) {
                event.preventDefault();
            }
        };
    };

    OpenAccountVieModel.prototype._fetchData = async function () {
        let accCommand = {
            token: localStorage.getItem('token'),
            table: 'ACCOUNTS',
            join: [],
            where: [],
        };
        if (this.subSystem() == 2) accCommand.where.push('ACC_ATTRIBUTES.ATTRIBUTE_NO = 111');
        else accCommand.where.push('ACC_ATTRIBUTES.ATTRIBUTE_NO = 112');
        accCommand.join.push({
            table: 'ACC_ATTRIBUTES',
            type: 'inner',
            condition: 'ACCOUNTS.ACCOUNT_NO = ACC_ATTRIBUTES.ACCOUNT_NO',
        });

        const cCommand = {
            token: localStorage.getItem('token'),
            table: 'COMPANIES',
            order: 'CLIENT_NO',
            select: [],
            join: [],
        };
        cCommand.select.push('COMPANIES.CLIENT_NO');
        cCommand.select.push('COMPANIES.NAME');
        cCommand.select.push('FIN_ABILITY');
        cCommand.select.push('ID_NO');
        cCommand.select.push('ADDRESS');
        cCommand.select.push('ID_TYPE');
        cCommand.join.push({
            table: 'CLIENTS',
            type: 'inner',
            condition: 'CLIENTS.CLIENT_NO = COMPANIES.CLIENT_NO',
        });

        await Promise.all([
            serviceUtils.ajaxSendRequest('getTable', accCommand),
            serviceUtils.ajaxSendRequest('getTable', cCommand),
        ])
            .then(
                await function (values) {
                    let value;
                    let error;
                    if (values) {
                        if (values.length > 1) {
                            value = coreUtils.parseJSON(values[0]);
                            if (value.error) error = value.console;
                            else {
                                this.parents(value);
                            }
                            value = coreUtils.parseJSON(values[1]);
                            if (value.error) error = value.console;
                            else this.companies(value);

                            if (error) serviceUtils._showToastMessage('error', value.console);
                        }
                        return true;
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                // this._showToastMessage('error', reason);
                console.log(reason);
            });
    };

    OpenAccountVieModel.prototype._check = function () {
        if (this.subSystem() == 2) accounts.type(2);
        else accounts.type(3);
        const tempID = this.parentValue() + '' + this.accID();
        if (tempID.length - accounts.parent().length != 7) {
            serviceUtils._showToastMessage(this.messages, 'error', _t('messages.accNoDigitsError'));
            return false;
        }
        accounts.accountNo(this.parentValue() + '' + this.accID());
        if (accounts.accountNo() == '') {
            serviceUtils._showToastMessage(this.messages, 'error', _t('messages.errorParentNotDefined'));
            return false;
        }

        if (accounts.parentType() != 1) {
            serviceUtils._showToastMessage(this.messages, 'error', _t('messages.lastLevelParent'));
            return false;
        }

        if (this.accID() == null || this.accID() == '') {
            serviceUtils._showToastMessage(this.messages, 'error', _t('messages.accIDMustDefined'));
            return false;
        }

        if (accounts.accountNoExists()) {
            serviceUtils._showToastMessage(this.messages, 'error', _t('messages.accountNoExists'));
            return false;
        }
    };

    OpenAccountVieModel.prototype._handelInterest = function () {
        accInterest._init(null,accounts.accountNo(),accounts.interest(),new Date(),1,null);
        const interestCommand = {
            table: 'ACC_INTEREST',
            indent: 'INSERT',
            keys: { docNo: accInterest.docNo() },
            fields: accInterest.fields(),
        };
        return interestCommand;

    };
    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return OpenAccountVieModel;
});
