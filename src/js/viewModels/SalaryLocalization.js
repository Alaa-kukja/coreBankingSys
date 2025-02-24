define([
    'ojs/ojtranslation',
    'knockout',
    'ojs/ojmodule-element-utils',
    'ojs/ojarraydataprovider',
    'ojs/ojbufferingdataprovider',
    'utils/Service',
    'utils/Core',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'xlsx',

    'ojs/ojknockout',
    'ojs/ojbutton',
    'ojs/ojinputtext',
    'oj-c/input-text',
    'ojs/ojmodule-element',
    'ojs/ojnavigationlist',
    'ojs/ojlabelvalue',
    'ojs/ojlabel',
    'ojs/ojtable',
    'ojs/ojcheckboxset',
    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojdatetimepicker',
    'ojs/ojinputnumber',
    'oj-c/input-number',
], function (
    Translations,
    ko,
    moduleElementUtils,
    ArrayDataProvider,
    BufferingDataProvider,
    serviceUtils,
    coreUtils,
    responsiveUtils,
    responsiveKnockoutUtils,
    XLSX,
) {
    const _t = Translations.getTranslatedString;

    function salaryLocalizationViewModel(param) {
        const { router } = param;
        this.router = router;

        this.connected = function () {
            //drop
            let dropContainer = document.getElementById('dropContainer');

            if (dropContainer) {
                dropContainer.ondragover = dropContainer.ondragenter = function (event) {
                    event.preventDefault();
                };

                dropContainer.ondrop = async function (event) {
                    const dropData = event.dataTransfer;
                    console.log(dropData.files.length);
                    if (dropData.files.length > 0) await this.readFile(dropData.files[0]);
                    event.preventDefault();
                }.bind(this);
            }
        };

        this.readFile = async (file) => {
            const ext = file.name.split('.').reverse()[0].toUpperCase();

            const reader = new FileReader();
            reader.onload = await function () {
                let aData;
                if (ext === 'SCV') {
                    aData = coreUtils.csvToJsonArray(reader.result, ';');
                    this.tblData(aData);
                } else if (ext === 'XLSX' || ext === 'XLS') {
                    aData = reader.result;
                    let workbook = XLSX.read(aData, {
                        type: 'binary',
                    });
                    workbook.SheetNames.forEach(
                        function (sheetName) {
                            var jObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            this.tblData(jObject);
                        }.bind(this)
                    );
                } else {
                    console.error('File not supported');
                }
            }.bind(this);
            reader.onerror = function () {
                console.error('Error reading the file');
            };
            if (ext === 'CSV') reader.readAsText(file, 'utf-8');
            else reader.readAsBinaryString(file);
        };

        this._initAllIds();
        this._initAllLabels();
        this._initObservables();
        this._initVariables();
        this._initEvents();
        this._initFetchData();
    }
    salaryLocalizationViewModel.prototype._initAllIds = function () {
        this.companyId = coreUtils.generateUniqueId();
        this.itsAccountDialog = coreUtils.generateUniqueId();
    };

    salaryLocalizationViewModel.prototype._initObservables = function () {
        this.discountValue = ko.observable();
        this.discountToDate = ko.observable();
        this.discountFromDate = ko.observable();
        this.discountCause = ko.observable();
        this.accDiscountNo = ko.observable();
        this.accDiscountName = ko.observable();
        this.company = ko.observable(null);
        this.clicked = ko.observable(false);
        
        this.currClientType = ko.observable('legalPerson');
        this.selectedItem2 = ko.observable('New_Account');
        this.checkATM_Card = ko.observable(null);
        this.cardType = ko.observableArray([]);
        this.ATM_CardVal = ko.observable(null);
      
        this.employees = ko.observableArray([]);
        this.companies = ko.observableArray([]);
        this.isDeleteRowDisabled = ko.observable(true);
        this.tblSelected = ko.observable();

        this.tblData = ko.observableArray([]);
        this.tblDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.tblData, {
                keyAttributes: 'accountNo',
            })
        );

        this.isCancelDisabled = ko.computed(
            function () {
                return this.tblData().length == 0;
            }.bind(this)
        );

        this.columns = ko.observableArray([
            {
                field: 'parent',
                headerText: _t('labels.parent'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-start oj-sm-only-hide',
                className: 'oj-helper-text-align-start oj-sm-only-hide',
                template: 'parent',
                sortable: 'enabled',
                resizable: 'enabled',
                maxWidth: '12rem',
                id: 'parent',
            },
            {
                field: 'accOwner',
                headerText: _t('labels.accOwnerLong'),
                template: 'deptNameTemplate',
                className: 'oj-md-down-hide',
                sortable: 'enabled',
                resizable: 'enabled',
                minWidth: '12rem',
                id: 'accOwner',
            },
            {
                field: 'accountNo',
                headerText: _t('labels.hisNo'),
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start oj-sm-only-hide',
                template: 'locIdTemplate',
                sortable: 'enabled',
                resizable: 'enabled',
                id: 'accountNo',
            },
            {
                field: 'interestNO',
                headerText: _t('labels.interestNO'),
                className: 'oj-sm-only-hide',
                template: 'interestNO',
                resizable: 'enabled',
                maxWidth: '12rem',
                id: 'interestNO',
            },
            {
                field: 'accNumber',
                headerText: _t('inputs.accNumber'),
                className: 'oj-sm-only-hide',
                template: 'accNumber',
                resizable: 'enabled',
                id: 'accNumber',
            },
            {
                field: 'ATM_CardType',
                headerClassName: 'oj-md-only-hide',
                className: 'oj-sm-only-hide',
                headerText: _t('labels.ATM_CardType'),
                template: 'ATM_CardType',
                resizable: 'enabled',
                id: 'ATM_CardType',
            },
            {
                field: 'herCode',
                headerClassName: 'oj-md-only-hide',
                className: 'oj-sm-only-hide',
                headerText: _t('labels.herCode'),
                template: 'herCode',
                resizable: 'enabled',
                id: 'start',
            },
            {
                field: 'latinName',
                headerClassName: 'oj-md-only-hide',
                className: 'oj-sm-only-hide',
                headerText: _t('inputs.latinName'),
                template: 'latinName',
                resizable: 'enabled',
                id: 'latinName',
            },
        ]);

        let mdQuery = responsiveUtils.getFrameworkQuery('md-up');
        if (mdQuery) {
            this.medium = responsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
        }

        this.companySelectedItem = ko.observable(null);
        this.companySelectedItem.subscribe((newValue) => {
            let dialog = document.querySelector(`#${this.itsAccountDialog}`);
            if (dialog) {
                if (newValue != null) dialog.open();
                else dialog.close();
            }
        });


        this.companyClientData = ko.observableArray([
             { name: _t('labels.legalPerson'), code: 1, id: 'legalPerson', icons: 'oj-ux-ico-customer-request' },
             { name: _t('labels.branch'), code: 2, id: 'branch', icons: 'oj-ux-ico-branch' },
         ]);

        this.companyAccLinks = ko.observableArray([]);

        this.companyClientModuleConfig = moduleElementUtils.createConfig({
            name: 'ClientCards/ClientCards',
            params: {
                vSelectedItem: this.companySelectedItem,
                clientData: this.companyClientData,
                companies: this.companies,
                accLinks: this.companyAccLinks,
                path: this.router._activeState.path,
            },
        });
       
        this.accOwnerSelectedItem = ko.observable(null);
        this.accOwnerSelectedItem.subscribe((newValue) => {
            let dialog = document.querySelector(`#${this.itsAccountDialog}`);
            if (dialog) {
                if (newValue != null) dialog.open();
                else dialog.close();
            }
        });
    
        this.accOwnerLinks = ko.observableArray([]);

        this.ModuleConfig2 = (item) => {
            return moduleElementUtils.createConfig({
                name: 'Accounted-For-Localize/' + item,
                params: {
                    accLinks:this.accOwnerLinks,
                    companies: this.companies,
                    path: this.router._activeState.path,
                },
            });
        };
    };

    salaryLocalizationViewModel.prototype._initVariables = function () {
    
        const data2 = [
            {
                name: _t('labels.newAccount'),
                id: 'New_Account',
                icons: 'oj-ux-ico-new-version',
            },
            { name: _t('labels.oldAccount'), id: 'Old_Account', icons: 'oj-ux-ico-newspaper' },
        ];

        this.dataProvider2 = new ArrayDataProvider(data2, { keyAttributes: 'id' });

        // ATM_Card Type
        this.ATM_CardDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.cardType, {
                keyAttributes: 'code',
                textFilterAttributes: ['shortDescr', 'lowLimit', 'highLimit', 'comm'],
            })
        );
        this.tableATM_CardColumns = [
            { headerText: _t('labels.shortDescr'), field: 'shortDescr', template: 'cellTemplate', id: 'shDescr' },
            { headerText: _t('labels.lowLimit'), field: 'lowLimit', template: 'cellTemplate', id: 'low' },
            { headerText: _t('labels.highLimit'), field: 'highLimit', template: 'cellTemplate', id: 'high' },
            { headerText: _t('labels.price'), field: 'comm', template: 'cellTemplate', id: 'price' },
        ];

        this.getItemATM_Card = (itemContext) => {
            return `${itemContext.data.shortDescr}    ${itemContext.data.lowLimit}    ${itemContext.data.highLimit}    ${itemContext.data.comm}`;
        };
    };

    salaryLocalizationViewModel.prototype._initAllLabels = function () {
        this.companyButtonVal = _t('labels.company');
        this.acceptButton = _t('buttons.apply');
        this.cancelButton = _t('buttons.cancel');
        this.addButton = _t('buttons.add');
        this.deleteButton = _t('buttons.delete');
        this.fileButton = _t('buttons.file');

        this.labelAccountedVal = _t('labels.accountsToLocalize');
        this.ATM_CardLabel = _t('labels.ATM_Card');
        this.latin_NameLabel = _t('inputs.latinName');
        this.discountLabel = _t('inputs.discount');
        this.discountStart_dateLabel = _t('inputs.fromDate');
        this.discountEnd_dateLabel = _t('inputs.toDate');
        this.Discount_CauseLabel = _t('inputs.discountReason');
        this.AccountLabel = _t('inputs.account');
        this.Account_NameLabel = _t('inputs.accName');
        this.ATM_CardTypeLabel = _t('labels.ATM_CardType');
        this.closeLabel = _t('buttons.close');
        this.applyLabel = _t('buttons.apply');
    };

    salaryLocalizationViewModel.prototype._initEvents = function () {
        this.handleCancelTable = () => {
            this.tblData([]);
        };

        this.handleDeleteRow = () => {
            const array = this.tblData();
            for (let index = 0; index < array.length; index++) {
                if (array[index].accountNo == this.tblSelected()) {
                    array.splice(index, 1);
                }
            }
            this.tblData(array);
        };

        this.selectedChangedListener = (event) => {
            const row = event.detail.value.row;

            if (row.values().size > 0) {
                row.values().forEach((value) => {
                    this.tblSelected(value);
                });
            }
            this.isDeleteRowDisabled(row.values().size === 0);
        };

        this.handleLoadFile = async () => {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Text',
                        accept: {
                            'Excel/*': ['.xls', '.xlsx', '.csv'],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });
            const file = await fileHandle.getFile();
            await this.readFile(file);
        };

        this.handleScreenApply = async () => {
            //const lib1 = coreUtils.loadExternalLibrary('etc/jszip.js');
            //const lib2 = coreUtils.loadExternalLibrary('etc/xlsx.js');
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Text',
                        accept: {
                            'Excel/*': ['.xls', '.xlsx'],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });
            const file = await fileHandle.getFile();
            const ext = file.name.split('.').reverse()[0].toUpperCase();
            console.log(ext);
            //this.parseExcel = function (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary',
                });

                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);
                    console.log(XL_row_object);
                });
            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
            // readAsBinaryString
            // };

            // document.body.removeChild(lib1);
            // document.body.removeChild(lib2);
        };
        this.handleScreenClose = () => {};
        this.handleCancel = () => {
            this.clicked(false);
        };

        this.handleApply = () => {};

        this.companyButtonAction = () => {
           this.companySelectedItem('accOwner');
        };

        this.acceptAction = () => {};
        this.cancelAction = () => {};

        this.selectionAction2 = (event) => {
            this.selectedItem2(event.detail.value);
        };
    };

    salaryLocalizationViewModel.prototype._initFetchData = async function () {
      

      
        // Fetch Card Type Data
        let cardTypeCommand = {
            token: localStorage.getItem('token'),
            table: 'ATM_CARD_TYPE',
        };
        serviceUtils.fetchData(cardTypeCommand, this.cardType);

        let eCommand = {
            token: localStorage.getItem('token'),
            table: 'ORD_PEOPLE',
            where: [],
        };
        eCommand.where.push('ORD_PEOPLE.CLIENT_NO > 21641');
        eCommand.where.push('ROWNUM < 3000');
        serviceUtils.fetchData(eCommand, this.employees);

        const cCommand = {
            token: localStorage.getItem('token'),
            table: 'COMPANIES',
            order: 'CLIENT_NO',
        };
        serviceUtils.fetchData(cCommand, this.companies);
    };

    return salaryLocalizationViewModel;
});
