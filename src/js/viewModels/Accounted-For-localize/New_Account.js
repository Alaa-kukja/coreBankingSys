define([
    'ojs/ojtranslation',
    'knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojbufferingdataprovider',
    'ojs/ojmodule-element-utils',
    'utils/Service',
    'utils/Core',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',

    'ojs/ojlabelvalue',
    'ojs/ojlabel',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojbutton',
    'ojs/ojnavigationlist',
    'ojs/ojmodule-element',
    'ojs/ojhighlighttext',
    'ojs/ojformlayout',
    'ojs/ojcheckboxset',
], function (
    Translations,
    ko,
    ArrayDataProvider,
    BufferingDataProvider,
    moduleElementUtils,
    ServiceUtils,
    CoreUtils,
    responsiveUtils,
    responsiveKnockoutUtils
) {
    const _t = Translations.getTranslatedString;

    function NewAccountViewModel(params) {
       
        this._initAllIds();
        this._initAllLabels();
        this._initObservables(params);
        this._initVariables();
        this._initFetchData();
        this._initEvents();
    }

    NewAccountViewModel.prototype._initAllIds = function () {
        this.itsAccountDialog = CoreUtils.generateUniqueId();
    };

    NewAccountViewModel.prototype._initAllLabels = function () {
        this.accountOwnerButtonVal = _t('labels.accOwner');
        this.depositLabel = _t('labels.parent');
        this.interestLabel = _t('labels.interest');
    };

    NewAccountViewModel.prototype._initObservables = function (params) {
        const {
            accLinks,
            companies,
            path,  
        } = params;

        this.accOwnerLinks= accLinks;
        this.companies=companies,
        this.path=path,

        this.DepositData = ko.observableArray([]);
        this.DepositVal = ko.observable(null);
       

        this.checkinterest = ko.observable(null);

        this.interestData = ko.observableArray([]);
        this.interestVal = ko.observable(null);

        this.currClientType = ko.observable('members');

        this.accOwnerClientData = ko.observableArray([
            { name: _t('labels.members'), code: 3, id: 'members', icons: 'oj-ux-ico-accessibility' },
            { name: _t('labels.legalPerson'), code: 1, id: 'legalPerson', icons: 'oj-ux-ico-customer-request' },
       
        ]);

        this.accOwnerSelectedItem= ko.observable(null);
        this.accOwnerSelectedItem.subscribe((newValue) => {
            let dialog = document.querySelector(`#${this.itsAccountDialog}`);
            if (dialog) {
                if (newValue != null) dialog.open();
                else dialog.close();
            }
        });

       this.accOwnerLinks = ko.observableArray([]);

       this.accModuleConfig = moduleElementUtils.createConfig({
           name: 'ClientCards/ClientCards',
           params: {
               vSelectedItem: this.accOwnerSelectedItem,
               clientData: this.accOwnerClientData,
               companies: this.companies,
               accLinks: this.accOwnerLinks,
               path: this.path,
           },
       });

       
    };

    NewAccountViewModel.prototype._initEvents = function () {
       
        this.accountOwnerButtonAction = () => {
            this.accOwnerSelectedItem('accOwner');
        };

    
      
    };

    NewAccountViewModel.prototype._initVariables = function () {
        // Deposit
        this.DepositDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.DepositData, {
                keyAttributes: 'accountNo',
                textFilterAttributes: ['accountNo', 'name'],
            })
        );
        this.tableDepositColumns = [
            { headerText: _t('labels.theCode'), field: 'accountNo', template: 'cellTemplate', id: 'num' },
            { headerText: _t('labels.name'), field: 'name', template: 'cellTemplate', id: 'typ' },
        ];
        this.getItemDeposit = (itemContext) => {
            return `${itemContext.data.accountNo}    ${itemContext.data.name}`;
        };
      

        // interest
        this.interestDataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.interestData, {
                keyAttributes: 'intNo',
                textFilterAttributes: ['intNo', 'creditInt', 'debitInt', 'descr'],
            })
        );
        this.tableinterestColumns = [
            { headerText: _t('labels.theCode'), field: 'intNo', template: 'cellTemplate', id: 'code' },
            { headerText: _t('labels.creditPercent'), field: 'creditInt', template: 'cellTemplate', id: 'cred' },
            { headerText: _t('labels.debitPercent'), field: 'debitInt', template: 'cellTemplate', id: 'debt' },
            { headerText: _t('labels.description'), field: 'descr', template: 'cellTemplate', id: 'desc' },
        ];

        this.getIteminterest = (itemContext) => {
            return `${itemContext.data.intNo}    ${itemContext.data.creditInt}    ${itemContext.data.debitInt}    ${itemContext.data.descr}`;
        };
    };

    NewAccountViewModel.prototype._initFetchData = function () {
        /// Fetch Deposit Data ///
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

        Promise.all([ServiceUtils.ajaxSendRequest('getTable', accCommand)])
            .then(
                function (values) {
                    let DepositArray = JSON.parse(values[0]);
                    if (DepositArray) {
                        this.DepositData(DepositArray);
                    }
                    return true;
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });

        /// Fetch interest Data ///
        this.DepositVal.subscribe(async (newValue) => {
            let current = newValue;
            if (current > 0) {
                for (let i = 0; i < this.DepositData().length; i++) {
                    if (this.DepositData()[i].accountNo === current) {
                        let s = this.DepositData()[i].roundingPeriod;
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
            bCommand.select.push('interestS.*');
            bCommand.where.push('ACCOUNTS.ACCOUNT_NO = ' + current);
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

            Promise.all([ServiceUtils.ajaxSendRequest('getTable', bCommand)])
                .then(
                    function (values) {
                        let interestArray = JSON.parse(values[0]);
                        if (interestArray) {
                            this.interestData(interestArray);
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
            //////////////////////////////////////////////////////////////////////////////////////
            let sunCommand = {
                token: localStorage.getItem('token'),
                select: [],
                table: 'ACCOUNTS',
                join: [],
                where: [],
            };
            sunCommand.select.push(' MAX(ACCOUNTS.ACCOUNT_NO) AS SUN_ID');
            sunCommand.where.push('PARENT = ' + current);
            // sunCommand.join.push({
            //     table: 'ROUNDING_PERIOD',
            //     type: 'inner',
            //     condition: 'ACCOUNTS.ROUNDING_PERIOD = ROUNDING_PERIOD.CODE',
            // });

            await Promise.all([
                ServiceUtils.ajaxSendRequest('getTable', bCommand),
                ServiceUtils.ajaxSendRequest('getTable', sunCommand),
            ])
                .then(
                    function (values) {
                        if (values.length > 1) {
                            let bArray = CoreUtils.parseJSON(values[0]);
                            if (bArray) {
                                this.interestData(bArray);
                            }
                            let sunID = CoreUtils.parseJSON(values[1]);
                            if (sunID) {
                                let tempID = Number(sunID[0]) + 1;
                                let strTempId = '' + tempID;
                                let strParentValue = '' + this.DepositVal();
                                strTempId = strTempId.substring(strParentValue.length, strTempId.length);
                                this.accNum(strTempId);
                            }
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
            //     } else this.interests([]);
            // } else this.interests([]);
        });
    };
    return NewAccountViewModel;
});
