define([
    'ojs/ojtranslation',
    'knockout',
    'utils/Core',
    'utils/Tafqeet',
    'ojs/ojarraydataprovider',
    'ojs/ojknockouttemplateutils',
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
    'term-deposit/loader',
    'ojs/ojprogress-circle',
], function (
    Translations,
    ko,
    coreUtils,
    tafqeet,
    ArrayDataProvider,
    KnockoutTemplateUtils,
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

    function registerTermDepositCliRelViewModel(params) {
        const { router } = params;
        this.router = router;
        //     //drop
        //     let dropContainer = document.getElementById('dropContainer');

        //     if (dropContainer) {
        //         dropContainer.ondragover = dropContainer.ondragenter = function (event) {
        //             event.preventDefault();
        //         };

        //         dropContainer.ondrop = function (event) {
        //             const dropData = event.dataTransfer;
        //             let itemData = JSON.parse(dropData.getData('application/ojtreeviewitems+json'));
        //             this.accID(parseInt(itemData[0].accountNo));
        //             this.accName(itemData[0].name);
        //             event.preventDefault();
        //         }.bind(this);
        //     }

        //     //end drop
        // };

        this._initAllIds();
        this._initAllLabels();
        this._initObservables();
        this._initAllVariables();
        this._initAllEvents();
    }

    registerTermDepositCliRelViewModel.prototype._initAllIds = async function () {
        // this.treeViewAccounts = coreUtils.generateUniqueId();
        this.itsAccountDialog = coreUtils.generateUniqueId();
    };

    registerTermDepositCliRelViewModel.prototype._initAllLabels = function () {
        this.typeOfRelationLabel = _t('titles.linkType');
        this.resultButtonLabel = _t('labels.searchResult');
        this.DelResultButtonLabel = _t('buttons.cancel');

        this.specificCliButtonLabel = _t('buttons.specifClient');
        // this.accNumberLabel = _t('inputs.accNumber');
        this.cliNameLabel = _t('inputs.firstName');

        this.AccountsDataLabelVal = _t('labels.accounts');
        this.AccountsDataPropertiesLabel = _t('labels.accountsProp');
        this.backButton = _t('buttons.back');
        this.acceptButton = _t('buttons.apply');
        this.cancelButton = _t('buttons.cancel');
        this.deleteLabel = _t('buttons.delete');
    };

    registerTermDepositCliRelViewModel.prototype._initObservables = function () {
        // 1
        this.termPrimNumberVal = ko.observable(null);
        this.termSubNumberVal = ko.observable(null);

        this.termSectorVal = ko.observable(null);
        this.termYearVal = ko.observable(null);
        this.termMonthVal = ko.observable(null);
        this.termFirstAmountVal = ko.observable(null);
        this.termDepositAmountVal = ko.observable(null);

        this.termFirstDepositDateVal = ko.observable(null);
        this.termDepositDateVal = ko.observable(null);
        this.termDeserveDateVal = ko.observable(null);
        this.termDeservedDateVal = ko.observable(null);

        this.termCliAccNumVal = ko.observable(null);
        this.termCliAccNameVal = ko.observable(null);

        ////////
        this.clicked = ko.observable(false);
        this.cliNameVal = ko.observable(null);

        this.typeOfRelationVal = ko.observable(' ');

        this.accNameVal2 = ko.observable(null);
        this.clientData = ko.observableArray([
            { name: _t('labels.members'), code: 3, id: 'members', icons: 'oj-ux-ico-accessibility' },
            { name: _t('labels.legalPerson'), code: 1, id: 'legalPerson', icons: 'oj-ux-ico-customer-request' },
            { name: _t('labels.branch'), code: 2, id: 'branch', icons: 'oj-ux-ico-branch' },
            { name: _t('labels.branchEmployee'), code: 4, id: 'branchEmployee', icons: 'oj-ux-ico-employee' },
        ]);

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

        this.currAccountNo = ko.observable('');

        // let mdQuery = responsiveUtils.getFrameworkQuery('md-up');
        // if (mdQuery) {
        //     this.medium = responsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
        // }

        this.clientArray = ko.observableArray([]);
    };

    registerTermDepositCliRelViewModel.prototype._initAllVariables = function () {
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
            // { headerText: _t('labels.clientRelId'), field: 'docNoToTran', id: 'cliReId' },
            // { headerText: _t('titles.clientNo'), field: 'clientNo', id: 'cliId' },
        ];
        //Type Of relation & Specific Client

        this.typeOfRel = [
            { value: _t('labels.accOwner'), label: _t('labels.TermDepositOwner') },
            { value: _t('labels.superior'), label: _t('labels.TermDepositSuperior') },
            { value: _t('labels.accDelegacy'), label: _t('labels.TermDepositDelegacy') },
            { value: _t('labels.guardian'), label: _t('labels.TermDepositGuardian') },
        ];
        this.typeOfRelationData = new ArrayDataProvider(this.typeOfRel, {
            keyAttributes: 'value',
        });
        // Data for V-navigation
        let data = [
            {
                name: _t('buttons.specifClient'),
                id: 'accOwner',
            },
        ];
        this.accDataProvider = new ArrayDataProvider(data, {
            keyAttributes: 'id',
        });

        //links definition

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

    registerTermDepositCliRelViewModel.prototype._initAllEvents = function () {
        this.resultButtonAction = () => {
            this.clicked(true);
            this._initFetchData();
        };

        this.DelResultButtonAction = () => {
            this.PrimNumberVal = ko.observable(null);
            this.SubNumberVal = ko.observable(null);
            this.clicked(false);
        };

        this.DelCliNamButtonAction = () => {
            this.cliNameVal(null);
        };
        this.specificCliButtonAction = (newValue) => {
            console.log(newValue);
            let dialog = document.querySelector(`#${this.itsAccountDialog}`);
            if (dialog) {
                if (newValue != null) dialog.open();
                else dialog.close();
            }
            if (newValue === 'cheques') this.openAccountTitle(_t('labels.' + newValue + 'Book'));
            else this.openAccountTitle(_t('labels.' + newValue));
            // this.accNameVal2(this.accNameVal);
        };

        this.handleDeleteLink = (event, context) => {
            let array = this.accLinks();
            array.splice(context.key, 1);
            this.accLinks(array);
        };

        this.accountChanged = (event) => {
            console.log(event.detail.accountNo);
            console.log(event.detail.name);
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

        this.acceptAction = () => {};

        this.cancelAction = () => {};
    };

    registerTermDepositCliRelViewModel.prototype._initFetchData = function () {
        let tableCommand = {
            select: [],
            token: localStorage.getItem('token'),
            table: 'ORD_PEOPLE',
            join: [],
        };
        tableCommand.select.push(
            'ORD_PEOPLE.FIRST_NAME,ORD_PEOPLE.LAST_NAME,ORD_PEOPLE.FATHER_NAME,ORD_PEOPLE.MOTHER_NAME,CLIENT_DOC_TYPE.DESCR'
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
    return registerTermDepositCliRelViewModel;
});
