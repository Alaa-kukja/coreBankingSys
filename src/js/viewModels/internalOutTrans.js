define([
    'ojs/ojtranslation',
    'knockout',
    'ojs/ojarraydataprovider',
    'utils/Service',
    'utils/Core',
    'tables/OrdPeople',
    'tables/Clients',
    'tables/Companies',
    'ojs/ojconverter-number',
    'ojs/ojmodule-element-utils',
    'ojs/ojbufferingdataprovider',

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
    "ojs/ojradioset",
], function (
    Translations,
    ko,
    ArrayDataProvider,
    serviceUtils,
    coreUtils,
    ordPeople,
    cl,
    cm,
    ojconverter_number_1,
    moduleElementUtils,
    BufferingDataProvider
) {

    const _t = Translations.getTranslatedString;
    function internalOutTransViewModel(params) {
        this.connected = () => {
            document.title = _t('titles.internalOutTrans');
        };
        this.disconnected = () => {
            document.title = _t('titles.home');
        };
        this._initAllIds();
        this._initAlL_Labels();
        this._initVariables();
        this._initAllObservable();
        this._initAllEventListeners();
        this._fetchData();
    }

    internalOutTransViewModel.prototype._initAlL_Labels = function () {
        document.title = _t('titles.internalOutTrans');
        this.chooseTransTypeLabel = _t('labels.chooseTransType');
        this.transfererLabel = _t('labels.transferer');
        this.transfererAccLabel = _t('labels.transfererAcc');
        this.transfererNameLabel = _t('labels.transfererName');
        this.senderLabel = _t('labels.sender');
        this.senderAccLabel = _t('labels.senderAcc');
        this.senderNameLabel = _t('labels.senderName');
        this.receiverLabel = _t('labels.receiver');
        this.receiverAccLabel = _t('labels.receiverAcc');
        this.transAmountLabel = _t('labels.transAmount');
        this.descriptionLabel = _t('labels.description');
        this.commPayerLabel = _t('labels.commPayer');
        this.noPayerLabel = _t('labels.noPayer');
        this.commAmountLabel = _t('labels.commAmount');
        this.submitLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
        this.undoLabel = _t('buttons.back');
    };


    internalOutTransViewModel.prototype._initVariables = function () {

    };
    internalOutTransViewModel.prototype._initAllIds = function () {
        this.itsAccountDialog = coreUtils.generateUniqueId();

    };
    internalOutTransViewModel.prototype._initAllObservable = function () {

        this.selectVal = ko.observable();
        transTypeArray = [
            {
                value: 1,
                label: 'transType1',
            },
            {
                value: 2,
                label: 'transType2',
            },
        ];
        this.transTypeDataProvider = new ArrayDataProvider(transTypeArray, {
            keyAttributes: "value"
        });

        this.transferer = ko.observable(null);
        this.transfererAcc = ko.observable(null);
        this.transfererName = ko.observable(null);
        this.sender = ko.observable(null);
        this.senderAcc = ko.observable(null);
        this.senderName = ko.observable(null);
        this.receiver = ko.observable(null);
        this.receiverAcc = ko.observable(null);
        this.transAmount = ko.observable(null);
        this.description = ko.observable(null);
        this.description1 = ko.observable(null);
        this.commPayer = ko.observable(null);
        this.commAmount = ko.observable(null);




        //////////////////////////////////////////////////////////////////////////////////////////
        let vData = [
            { name: _t('labels.accOwner'), id: 'accOwner', icons: 'oj-ux-ico-person-info-search' },
            { name: _t('labels.accDelegacy'), id: 'accDelegacy', icons: 'oj-ux-ico-contact-permission' },
            { name: _t('labels.chequesBook'), id: 'cheques', code: null, icons: 'oj-ux-ico-book' },
        ];
        this.vDataProvider = new ArrayDataProvider(vData, {
            keyAttributes: 'id',
        });

        this.clientData = ko.observableArray([
            { name: _t('labels.members'), code: 3, id: 'members', icons: 'oj-ux-ico-accessibility' },
            { name: _t('labels.legalPerson'), code: 1, id: 'legalPerson', icons: 'oj-ux-ico-customer-request' },
            { name: _t('labels.branch'), code: 2, id: 'branch', icons: 'oj-ux-ico-branch' },
            { name: _t('labels.branchEmployee'), code: 4, id: 'branchEmployee', icons: 'oj-ux-ico-employee' },
        ]);


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
        this.path = ko.observable();
        this.companies = ko.observableArray([]);
        /**
     * init Vertical page control
     */
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



        this.accCardModuleConfig = moduleElementUtils.createConfig({
            name: 'ClientCards/ClientCards',
            params: {
                vSelectedItem: this.vSelectedItem,
                clientData: this.clientData,
                companies: this.companies,
                accLinks: this.accLinks,
                //path: this.router._activeState.path,
            },
        });

        //handel message toast
        this.messages = serviceUtils.message;
        this.autoTimeoutValue = ko.observable('on');
        this.soundValue = ko.observableArray([]);

        //end handling message toast

    };
    internalOutTransViewModel.prototype._initAllEventListeners = function () {

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
        this.handleCancel = () => {
            ordPeople._clear();
            cl._clear();
            cm._clear();
            this.router.go({ path: '' });
        };
        this.handleApply = () => {
            console.log(ordPeople.fields());
            console.log(cl.fields());
            console.log(cm.fields());
        };
        this.handleBack = () => {
            ordPeople._clear();
            cl._clear();
            cm._clear();
            this.router.go({ path: '' });
        };
        this.handleVSelectionAction = (event) => { };
    };
    internalOutTransViewModel.prototype._fetchData = async function () {
        const roundCommand = {
            token: localStorage.getItem('token'),
            table: 'ROUNDING_PERIOD',
        };

        let accCommand = {
            token: localStorage.getItem('token'),
            table: 'ACCOUNTS',
            join: [],
            where: [],
        };
        accCommand.where.push('ACC_ATTRIBUTES.ATTRIBUTE_NO = 111');
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
            serviceUtils.ajaxSendRequest('getTable', roundCommand),
            serviceUtils.ajaxSendRequest('getTable', accCommand),
            serviceUtils.ajaxSendRequest('getTable', cCommand),
        ])
            .then(
                await function (values) {
                    let value;
                    let error;
                    if (values) {
                        if (values.length > 2) {
                            value = coreUtils.parseJSON(values[0]);
                            if (value.error) error = value.console;
                            // else this.roundingArr(value);
                            value = coreUtils.parseJSON(values[1]);
                            if (value.error) error = value.console;
                            //else this.parents(value);
                            value = coreUtils.parseJSON(values[2]);
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

    return internalOutTransViewModel;
}
);
