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
    'utils/DataTransfer',
    'ojs/ojarraydataprovider',
    'ojs/ojarraytreedataprovider',
    'ojs/ojknockout-keyset',
    'ojs/ojmodel',
    'ojs/ojcollectiondataprovider',

    'ojs/ojknockout',
    'ojs/ojtable',
    'ojs/ojlabel',
    'ojs/ojbutton',
    'ojs/ojformlayout',
    'ojs/ojcheckboxset',
    'ojs/ojlabelvalue',
    'ojs/ojinputtext',
    'ojs/ojtreeview',
    'oj-c/button',
    'ojs/ojradioset',
], function (
    Translations,
    ko,
    coreUtils,
    serviceUtils,
    dataTransfer,
    ArrayDataProvider,
    ArrayTreeDataProvider,
    koKeyset,
    ojmodel_1,
    CollectionDataProvider
) {
    const _t = Translations.getTranslatedString;
    function accTreeViewModel(context) {
        // let element = context.element;
        //let accTree;
        this.connected = function () {
            //   accTree = element.querySelector('.oj-acc-tree');
            //  if (accTree) accTree.addEventListener('selectedChanged', selectedChanged);
        };

        this._initAllIds();
        this._initAllObservable(context);
        this._initAlL_Labels();
        this._initAllVariables(context);
        this._initAllEventListeners(context);
        this._loadNodeChilds('0', -1);
    }

    accTreeViewModel.prototype._initAllIds = function () {
        this.treeViewAccounts = coreUtils.generateUniqueId();
        this.itsSearchDialog = coreUtils.generateUniqueId();
        this.itsSearchTable = coreUtils.generateUniqueId();
        this.itsIdTabBar = coreUtils.generateUniqueId();
    };

    /**
     * @function _initAllObservable
     * @description
     */

    accTreeViewModel.prototype._initAllObservable = async function (context) {
        // this.clipboardEmpty = ko.observable(true);
        // this.clipboard = new dataTransfer.treeDataTransfer();

        this.loading = ko.observable(true);
        this.accID = ko.observable();
        this.isDisabled = ko.observable(true);
        this.requestTime = ko.observable(0);
        this.srOptions = [
            { value: 'ID', label: _t('labels.id') },
            { value: 'NM', label: _t('inputs.firstName') },
            { value: 'CR', label: _t('labels.ATM_Card') },
        ];

        this.srOptionsDP = new ArrayDataProvider(this.srOptions, {
            keyAttributes: 'value',
        });
        this.srKeyLabel = ko.observable(_t('labels.id'));
        this.srKey = ko.observable();
        this.srKey.subscribe(() => {
            this.dataSource(
                new ArrayDataProvider([], {
                    keyAttributes: 'accountNo',
                })
            );
        });
        this.srSelectedValue = ko.observable('ID');
        this.srSelectedValue.subscribe(async (newValue) => {
            let fetchKeys = [newValue];
            let result = await this.srOptionsDP.fetchByKeys({ keys: fetchKeys });
            this.srKeyLabel(result.results.get(newValue).data.label);
            this.srKey('');
            this.isDisabled(false);
        });

        this.selected = new koKeyset.ObservableKeySet().add([]);
        this.expanded = new koKeyset.ObservableKeySet().add([]);

        this.treeAccountsData = ko.observableArray([]);
        this.leafOnly = (itemContext) => {
            return itemContext.leaf;
        };
        let lookData = [
            {
                name: _t('labels.numView'),
                id: 'idLook',
            },
            {
                name: _t('labels.charView'),
                id: 'idNameLook',
            },
        ];

        this.treeLookItem = ko.observable('idLook');

        this.treeLookDataProvider = new ArrayDataProvider(lookData, {
            keyAttributes: 'id',
        });

        //start lazy loading

        this.accountsDataProvider = new ArrayTreeDataProvider(this.treeAccountsData, {
            keyAttributes: 'accountNo',
        });

        this.columns = [
            { headerText: _t('labels.id'), id: 'column1', field: 'id', sortable: 'enabled' },
            { headerText: _t('labels.name'), id: 'column2', field: 'label', sortable: 'enabled' },
        ];
        this.dataSource = ko.observable();
        this.serviceURL = ko.observable('');
        this.accountCol = ko.observable();
        this.srAccountNo = ko.observable('');
    };

    /**
     * @function _initAlL_Labels
     * @description
     */

    accTreeViewModel.prototype._initAlL_Labels = function () {
        this.searchLabel = _t('buttons.search');
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
        this.srOptionsLabel = _t('labels.searchBy');
    };

    /**
     * @function _initAllEventListeners
     * @description initialize all events
     */

    accTreeViewModel.prototype._initAllEventListeners = function (context) {
        let element = context.element;
        this.selectedChanged = (event) => {
            event.detail.value.keys.keys.forEach(async (value) => {
                let fetchKeys = [value];
                let result = await this.accountsDataProvider.fetchByKeys({ keys: fetchKeys });

                let params = {
                    detail: {
                        accountNo: result.results.get(value).data.accountNo,
                        name: result.results.get(value).data.name,
                    },
                };
                element.dispatchEvent(new CustomEvent('selectedChanged', params));
            });
        };

        this.handleCancelSearch = () => {
            document.querySelector(`#${this.itsSearchDialog}`).close();
        };

        this.tblSelectedChangedListener = async (event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                await row.values().forEach((value) => {
                    this.isDisabled(value === '');
                    this.accID(value);
                });
            }
        };

        this.handleFill = () => {
            let aWhere = '';
            switch (this.srSelectedValue()) {
                case 'NM':
                    aWhere = encodeURI(`ACCOUNTS.NAME like '%${this.srKey()}%'`);
                    break;
                case 'CR':
                    aWhere = `ACCOUNTS.ATM_CARD_NO = ${this.srKey()}`;
                    break;

                default:
                    aWhere = `ACCOUNTS.ACCOUNT_NO = '${this.srKey()}'`;
                    break;
            }
            let srCommand = {
                token: localStorage.getItem('token'),
                table: 'ACCOUNTS',
                key: 'ACCOUNT_NO',
                where: aWhere,
            };

            this.serviceURL(serviceUtils.buildGetEndpointURL('getOjTable', srCommand));

            this.Account = ojmodel_1.Model.extend({
                urlRoot: this.serviceURL,
                idAttribute: 'accountNo',
            });
            this.srAccounts = new this.Account();
            this.ManagerCollection = ojmodel_1.Collection.extend({
                url: this.serviceURL(),
                model: this.srAccounts,
                comparator: 'accountNo',
            });
            this.accountCol(new this.ManagerCollection());
            this.dataSource(new CollectionDataProvider(this.accountCol()));
        };

        this.expandArrayNodes = async (nArray) => {
            setTimeout(
                function () {
                    for (let index = 0; index < nArray.length; index++) {
                        const element = nArray[index];
                        if (element != `${this.accID()}`) {
                            this.expanded.add([element]);
                        }
                    }
                    this.selected.clear();
                    this.selected.add([`${this.accID()}`]);
                }.bind(this),
                this.requestTime() * nArray.length
            );
        };
        this.handleApplySearch = async () => {
            let srPromise = new Promise(
                async function (Resolve, Reject) {
                    let nodeTree = {
                        token: localStorage.getItem('token'),
                        table: 'ACCOUNTS A',
                        start: `TO_NUMBER(A.ACCOUNT_NO) = ${this.accID()}`,
                        connect: 'PRIOR A.PARENT =  A.ACCOUNT_NO',
                        select: [],
                        join: [],
                        where: [],
                        order: 'TO_NUMBER(A.ACCOUNT_NO)',
                    };
                    nodeTree.select.push('A.ACCOUNT_NO AS ROOT');
                    nodeTree.join.push({
                        table: 'ACCOUNTS B',
                        type: 'left',
                        condition: 'B.ACCOUNT_NO = A.PARENT',
                    });

                    Promise.all([serviceUtils.ajaxSendRequest('getTable', nodeTree)])
                        .then(
                            await async function (values) {
                                this.loading(true);
                                let arr = coreUtils.parseJSON(values[0]);
                                if (arr) {
                                    let i = 0;
                                    await this._loadNodeChilds(arr, i);
                                }

                                Resolve(arr);
                            }.bind(this)
                        )
                        .catch(function (reason) {
                            Reject(reason);
                        });
                }.bind(this)
            );

            srPromise.then(
                await async function (value) {
                    if (`${this.accID()}` != '') {
                        await this.expandArrayNodes(value);
                    }
                }.bind(this),
                function (error) {
                    console.log(error);
                }
            );
            this.handleCancelSearch();
        };

        this.handleNodeExpanded = (event) => {
            let currNodeSpan = document.querySelector(`#accNode${event.detail.key}`);
            if (currNodeSpan) {
                if (currNodeSpan.className == '_oj-tree-loading') currNodeSpan.className = 'oj-treeview-item-icon';
            }
        };
        this.handleNodeExpand = async (event) => {
            await this._loadNodeChilds(event.detail.key, -1);
        };

        this.handleTreeSearch = () => {
            this.accID('');
            document.querySelector(`#${this.itsSearchDialog}`).open();
        };
    };

    accTreeViewModel.prototype._initAllVariables = async function (context) {};

    accTreeViewModel.prototype._loadNodeChilds = async function (array, current) {
        let id;
        if (current > -1) {
            id = array[current];
        } else {
            id = array;
        }
        let fetchKeys = [id];
        let value = await this.accountsDataProvider.fetchByKeys({ keys: fetchKeys });
        let currNode;
        let ChildsCount = 0;
        let loaded = false;
        if (value) {
            if (value.results) {
                if (value.results.get(id)) {
                    currNode = value.results.get(id).data;
                    if (currNode) {
                        if (currNode.children) {
                            ChildsCount = currNode.childs;
                            loaded = ChildsCount == currNode.children.length;
                            if (currNode.children.length == 0) {
                                let currNodeSpan = document.querySelector(`#accNode${id}`);
                                if (currNodeSpan) currNodeSpan.className = '_oj-tree-loading';
                            } else if (current > -1) {
                                if (current < array.length) {
                                    current = current + 1;
                                    await this._loadNodeChilds(array, current);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (id == 0 || (!loaded && ChildsCount > 0)) {
            let accNode = {
                token: localStorage.getItem('token'),
                table: 'ACCOUNTS',
                lazyLoading: true,
                select: [],
                join: [],
                where: [],
                order: 'to_number(NVL(ACCOUNTS.PARENT,0)),to_number(ACCOUNTS.ACCOUNT_NO)',
                id: 'accountNo',
                parent: 'parent',
                value: '0',
            };
            accNode.select.push(
                'ACCOUNTS.ACCOUNT_NO,NVL( ACCOUNTS.PARENT,0) as PARENT,ACCOUNTS.NAME,NVL(ACC_TREE.CHILDS,0) as CHILDS'
            );
            accNode.join.push({
                table: 'ACC_TREE',
                type: 'left',
                condition: 'to_number(NVL(ACCOUNTS.ACCOUNT_NO,0)) = ACC_TREE.PARENT',
            });

            accNode.where.push('to_number(NVL(ACCOUNTS.PARENT,0)) = ' + id);

            this.start = Date.now();
            Promise.all([serviceUtils.ajaxSendRequest('getTable', accNode)])
                .then(
                    await async function (values) {
                        let AccountsTreeArray = coreUtils.parseJSON(values[0]);

                        if (AccountsTreeArray) {
                            if (currNode) {
                                for (let index = 0; index < AccountsTreeArray.length; index++) {
                                    currNode.children.push(AccountsTreeArray[index]);
                                }
                                this.treeAccountsData(this.accountsDataProvider.treeData());
                            } else {
                                this.treeAccountsData(AccountsTreeArray);
                            }
                            this.end = Date.now();
                            console.log(`Execution time: ${this.end - this.start} ms`);
                            if (current > -1) {
                                this.loading(false);
                                if (current < array.length) {
                                    current = current + 1;
                                    await this._loadNodeChilds(array, current);
                                }
                            } else {
                                this.requestTime(this.end - this.start);
                                this.loading(false);
                            }

                            //if (currNodeSpan) currNodeSpan.className = 'oj-treeview-item-icon';
                        }
                        return true;
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        }
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return accTreeViewModel;
});
