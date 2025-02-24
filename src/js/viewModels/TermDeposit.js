define([
    'ojs/ojtranslation',
    'knockout',
    'utils/Core',
    'utils/Tafqeet',
    'ojs/ojarraydataprovider',
    'ojs/ojkeyset',
    'ojs/ojmodule-element-utils',
    'utils/Service',
    'utils/CommonData',
    'ojs/ojbufferingdataprovider',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'ojs/ojmutablearraydataprovider',

    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojinputtext',
    'ojs/ojlabelvalue',
    'ojs/ojdatetimepicker',
    'ojs/ojinputnumber',
    'ojs/ojcheckboxset',
    'ojs/ojavatar',
    'ojs/ojknockout',
    'ojs/ojdialog',
    'ojs/ojtreeview',
    'ojs/ojradioset',
    'ojs/ojbutton',
    'ojs/ojtable',
    'oj-c/input-text',
    'oj-c/input-number',
    'oj-c/button',
    'oj-c/message-toast',
    'acc-tree/loader',
    'term-deposit/loader',
    'ojs/ojprogress-circle',
], function (
    Translations,
    ko,
    coreUtils,
    tafqeet,
    ArrayDataProvider,
    ojkeyset_1,
    moduleElementUtils,
    serviceUtils,
    commonData,
    BufferingDataProvider,
    responsiveUtils,
    responsiveKnockoutUtils,
    MutableArrayDataProvider
) {
    const _t = Translations.getTranslatedString;

    function TermDepositViewModel(params) {
        const { router } = params;
        this.router = router;
        console.log(router._activeState.path);

        this.connected = function () {
            //drop
            let dropContainer = document.getElementById('dropContainer');

            if (dropContainer) {
                dropContainer.ondragover = dropContainer.ondragenter = function (event) {
                    event.preventDefault();
                };

                dropContainer.ondrop = function (event) {
                    const dropData = event.dataTransfer;
                    let itemData = JSON.parse(dropData.getData('application/ojtreeviewitems+json'));
                    this.accID(parseInt(itemData[0].accountNo));
                    this.accName(itemData[0].name);
                    event.preventDefault();
                }.bind(this);
            }

            //end drop
        };
        this._initAllIds();
        this._initAllLabels();
        this._initObservables();
        this._initFetchData();
        this._initAllVariables();
        this._initAllEvents();
    }

    TermDepositViewModel.prototype._initAllIds = async function () {
        // 4
        this.chooseInterestID = coreUtils.generateUniqueId();
        this.idInterestCodeID = coreUtils.generateUniqueId();
        this.interestRateID = coreUtils.generateUniqueId();
        this.interestDescrID = coreUtils.generateUniqueId();
        //
        this.itsAccountDialog = coreUtils.generateUniqueId();
    };

    TermDepositViewModel.prototype._initAllLabels = function () {
        // 1
        this.SectorLabel = _t('inputs.sector');
        this.Sub_sectorLabel = _t('inputs.subSector');
        this.yearLabel = _t('inputs.year');
        this.monthLabel = _t('inputs.month');
        // 2
        this.amountLabel = _t('inputs.amount');
        this.amountInWritingLabel = _t('inputs.amountSpelling');
        // 3
        //When Deserved It
        this.labelDeserveVal = _t('labels.deserveIt');
        this.labelDeserve1 = _t('labels.deserveIt_1');
        this.labelDeserve2 = _t('labels.deserveIt_2');
        this.labelDeserve3 = _t('labels.deserveIt_3');
        this.labelDeserve4 = _t('labels.deserveIt_4');
        // 4
        this.interestCodeLabel = _t('labels.code') + ' ' + _t('labels.interest');
        this.interestCodeLabel_2 = _t('labels.code') + ' ' + _t('labels.interest') + ' ' + _t('labels.new');
        this.interestRateLabel = _t('labels.herRate');
        this.interestDescrLabel = _t('labels.herDescr');
        ////in Dialog
        this.interestsAvailable = _t('labels.interestsAvailable');
        this.acceptButton = _t('buttons.apply');
        this.cancelButton = _t('buttons.cancel');
        this.selectInterestLabel = _t('labels.select') + ' ' + _t('labels.interest');

        //
        this.accNumberLabel = _t('inputs.accNumber');
        this.accNameLabel = _t('inputs.accName');
        this.backButton = _t('buttons.back');
        this.acceptButton = _t('buttons.apply');
        this.cancelButton = _t('buttons.cancel');
        this.deleteLabel = _t('buttons.delete');
    };

    TermDepositViewModel.prototype._initObservables = function () {
        // 1
        // Sector & subSector & Year & month
        this.sectors = commonData.sectors;
        this.subSectors = commonData.subSectors;

        this.sectorValue = ko.observable(null);
        this.sub_sectorValue = ko.observable(null);
        this.yearValue = ko.observable(null);
        this.monthValue = ko.observable(null);
        // 2
        //amount & amountInWriting
        this.amountVal = ko.observable();
        this.amountInWritingVal = ko.computed(
            function () {
                return tafqeet._tafqeet(this.amountVal());
            }.bind(this)
        );
        // 4
        this.interestCodeValue = ko.observable(null);
        this.interestRateValue = ko.observable(null);
        this.interestDescrValue = ko.observable(null);
        //////in Dialog
        this.availableInterests = ko.observableArray([]);

        this.selected_BA_Item = ko.observable({
            row: new ojkeyset_1.KeySetImpl(),
        });
        this.companies = ko.observableArray([]);
        // from composite
        this.termInterestAccNumVal = ko.observable(null);
        this.termInterestAccNameVal = ko.observable(null);
        this.termBenefitAmountVal = ko.observable(null);
        this.termDepositAccNumVal = ko.observable(null);
        this.termDepositAccNameVal = ko.observable(null);
        this.termDepositDeservedDateVal = ko.observable(null);

        //
        this.clientData = ko.observableArray([
            { name: _t('labels.members'), code: 3, id: 'members', icons: 'oj-ux-ico-accessibility' },
            { name: _t('labels.legalPerson'), code: 1, id: 'legalPerson', icons: 'oj-ux-ico-customer-request' },
            { name: _t('labels.branch'), code: 2, id: 'branch', icons: 'oj-ux-ico-branch' },
            { name: _t('labels.branchEmployee'), code: 4, id: 'branchEmployee', icons: 'oj-ux-ico-employee' },
        ]);
        this.accID = ko.observable();
        this.accName = ko.observable('');
        this.companies = ko.observableArray([]);

        this.selectedName = ko.observable(null);

        this.openAccountTitle = ko.observable('');
        this.vSelectedItem = ko.observable(null);
        this.vSelectedItem.subscribe((newValue) => {
            let dialog = document.querySelector(`#${this.itsAccountDialog}`);
            if (dialog) {
                if (newValue != null) dialog.open();
                else dialog.close();
            }
            if (newValue === 'cheques') this.openAccountTitle(_t('labels.' + newValue + 'Book'));
            else this.openAccountTitle(_t('labels.' + newValue));
        });
        this.H_vSelectedItem = ko.observable(null);

        this.vSelectedItem.subscribe((newValue) => {
            this.vSelectedItem(newValue);
            if (newValue === 'account_fields') this.selectedName(_t('labels.accOwner'));
            else if (newValue === 'account_d') this.selectedName(_t('labels.accDelegacy'));
            else this.selectedName(_t('labels.' + newValue));
        });

        this.messages = serviceUtils.message;
    };

    TermDepositViewModel.prototype._initAllVariables = function () {
        //1
        // Sector & subSector & Year & month

        this.sectorData = new ArrayDataProvider(this.sectors, {
            keyAttributes: 'code',
        });
        this.getItemSector = (item) => {
            this.sectorValue(item.data.shortDescr);
            return `${item.data.shortDescr}`;
        };

        this.sub_sectorData = new ArrayDataProvider(this.subSectors, {
            keyAttributes: 'code',
        });
        this.getItemSub_sector = (item) => {
            this.sub_sectorValue(item.data.shortDescr);
            return `${item.data.shortDescr}`;
        };
        // 4
        //////in Dialog
        //Benefits Available
        this.interestsAvailableData = new ArrayDataProvider(this.availableInterests, {
            keyAttributes: ['intNo', 'creditInt', 'descr'],
        });
        this.interestsTableAvailableColumns = [
            { headerText: _t('labels.theCode'), field: 'intNo', template: 'cellTemplate', id: 'code' },
            { headerText: _t('labels.rate'), field: 'creditInt', template: 'cellTemplate', id: 'cred' },
            { headerText: _t('labels.description'), field: 'descr', template: 'cellTemplate', id: 'desc' },
        ];

        // Data for V-navigation
        let data = [
            {
                name: _t('labels.accOwner'),
                id: 'accOwner',
                icons: 'oj-ux-ico-contact-permission',
            },
            {
                name: _t('labels.superior'),
                id: 'superior',
                icons: ' oj-ux-ico-avatar',
            },
            {
                name: _t('labels.accDelegacy'),
                id: 'accDelegacy',
                icons: 'oj-ux-ico-contact-group-plus',
            },

            {
                name: _t('labels.guardian'),
                id: 'guardian',
                icons: 'oj-ux-ico-adult-child-fill',
            },
        ];
        this.accDataProvider = new ArrayDataProvider(data, {
            keyAttributes: 'id',
        });

        // links definition

        this.accLinks = ko.observableArray([]);
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

        this.accCardModuleConfig = moduleElementUtils.createConfig({
            name: 'ClientCards/ClientCards',
            params: {
                vSelectedItem: this.vSelectedItem,
                clientData: this.clientData,
                companies: this.companies,
                accLinks: this.accLinks,
                path: this.router._activeState.path,
            },
        });
    };

    TermDepositViewModel.prototype._initAllEvents = function () {
        // 4
        /////in Dialog
        this.handleSelectInterest = (eve) => {
            document.getElementById(this.chooseInterestID).open();
        };

        this.selectedChangedListener = (event) => {
            const interestWeSelected = Array.from(event.detail.value.row.keys.keys);
            this.interestCodeValue(interestWeSelected[0][0]);
            if (document.dir == 'rtl') this.interestRateValue(`%${interestWeSelected[0][1]}`);
            else this.interestRateValue(`${interestWeSelected[0][1]}%`);
            this.interestDescrValue(interestWeSelected[0][2]);
        };

        this.handleCancel = () => {
            this.interestCodeValue('');
            this.interestRateValue('');
            this.interestDescrValue('');

            let dialogID = `#${this.chooseInterestID}`;
            if (dialogID) document.querySelector(dialogID).close();
        };

        this.handleApply = () => {
            let dialogID = `#${this.chooseInterestID}`;
            if (dialogID) document.querySelector(dialogID).close();
        };
        //
        this.accountChanged = (event) => {
            console.log(event.detail.accountNo);
            console.log(event.detail.name);
        };

        this.handleDeleteLink = (event, context) => {
            let array = this.accLinks();
            array.splice(context.key, 1);
            this.accLinks(array);
        };

        this.handleCloseMessage = (event) => {
            let data = this.messages.data.slice();
            const closeMessageKey = event.detail.key;
            data = data.filter((message) => message.id !== closeMessageKey);
            this.messages.data = data;
        };

        this.handleScreenApply = () => {};
        this.handleScreenClose = () => {};

        this.backAction = () => {
            this.vSelectedItem(null);
        };
    };

    TermDepositViewModel.prototype._initFetchData = async function () {
        const BACommand = {
            token: localStorage.getItem('token'),
            table: 'interestS',
        };
        const cCommand = {
            token: localStorage.getItem('token'),
            table: 'COMPANIES',
            order: 'CLIENT_NO',
        };
        await Promise.all([
            serviceUtils.ajaxSendRequest('getTable', BACommand),
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
                            else this.availableInterests(value);
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
                console.log(reason);
            });
    };

    return TermDepositViewModel;
});
