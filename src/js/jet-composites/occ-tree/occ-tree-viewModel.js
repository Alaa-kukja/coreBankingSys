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
    function occTreeViewModel(context) {
        // let element = context.element;

        this.connected = function () {};

        this._initAllIds();
        this._initAllObservable(context);
        this._initAlL_Labels();
        this._initAllVariables(context);
        this._initAllEventListeners(context);
        this._loadNodeChilds('0000', -1);
    }

    occTreeViewModel.prototype._initAllIds = function () {
        this.treeViewOccupations = coreUtils.generateUniqueId();
        this.itsSearchDialog = coreUtils.generateUniqueId();
        this.itsSearchTable = coreUtils.generateUniqueId();
        this.itsIdTabBar = coreUtils.generateUniqueId();
    };

    /**
     * @function _initAllObservable
     * @description
     */

    occTreeViewModel.prototype._initAllObservable = async function (context) {
        // this.clipboardEmpty = ko.observable(true);
        // this.clipboard = new dataTransfer.treeDataTransfer();

        this.loading = ko.observable(true);
        this.occID = ko.observable();
        this.isDisabled = ko.observable(true);
        this.requestTime = ko.observable(0);
        this.srOptions = [
            { value: 'ID', label: _t('labels.id') },
            { value: 'NM', label: _t('inputs.firstName') },
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
            this.handleFill();
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

        this.treeOccupationsData = ko.observableArray([]);

        //start lazy loading

        this.occupationsDataProvider = new ArrayTreeDataProvider(this.treeOccupationsData, {
            keyAttributes: 'occupationNo',
        });

        this.columns = [
            { headerText: _t('labels.id'), id: 'column1', field: 'id', sortable: 'enabled' },
            { headerText: _t('labels.name'), id: 'column2', field: 'label', sortable: 'enabled' },
        ];
        this.dataSource = ko.observable();
        this.serviceURL = ko.observable('');
        this.occupationCol = ko.observable();
        this.srOccupationNo = ko.observable('');
    };

    /**
     * @function _initAlL_Labels
     * @description
     */

    occTreeViewModel.prototype._initAlL_Labels = function () {
        this.searchLabel = _t('buttons.search');
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
        this.srOptionsLabel = _t('labels.searchBy');
    };

    /**
     * @function _initAllEventListeners
     * @description initialize all events
     */

    occTreeViewModel.prototype._initAllEventListeners = function (context) {
        let element = context.element;
        this.selectedChanged = (event) => {
            event.detail.value.keys.keys.forEach(async (value) => {
                let fetchKeys = [value];
                let result = await this.occupationsDataProvider.fetchByKeys({ keys: fetchKeys });

                let params = {
                    detail: {
                        occupationNo: result.results.get(value).data.occupationNo,
                        name: result.results.get(value).data.name,
                        childs: result.results.get(value).data.childs,
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
                    this.occID(value);
                });
            }
        };

        this.handleFill = () => {
            let aWhere = '';
            if (this.srSelectedValue() == 'NM') {
                aWhere = encodeURI(`OCCUPATION.NAME like '%${this.srKey()}%'`);
            } else {
                aWhere = `OCCUPATION.OCCUPATION_NO = '${this.srKey()}'`;
            }
            // const aWhere = encodeURI(`OCCUPATION.NAME like '%${this.srKey()}%'`);

            let srCommand = {
                token: localStorage.getItem('token'),
                table: 'OCCUPATION',
                key: 'OCCUPATION_NO',
                where: aWhere,
            };

            this.serviceURL(serviceUtils.buildGetEndpointURL('getOjTable', srCommand));

            this.occupation = ojmodel_1.Model.extend({
                urlRoot: this.serviceURL,
                idAttribute: 'occupationNo',
            });
            this.srOccupations = new this.occupation();
            this.ManagerCollection = ojmodel_1.Collection.extend({
                url: this.serviceURL(),
                model: this.srOccupations,
                comparator: 'occupationNo',
            });
            this.occupationCol(new this.ManagerCollection());
            this.dataSource(new CollectionDataProvider(this.occupationCol()));
        };

        this.expandArrayNodes = async (nArray) => {
            setTimeout(
                function () {
                    for (let index = 0; index < nArray.length; index++) {
                        const element = nArray[index];
                        if (element != `${this.occID()}`) {
                            this.expanded.add([element]);
                        }
                    }
                    this.selected.clear();
                    this.selected.add([`${this.occID()}`]);
                }.bind(this),
                this.requestTime() * nArray.length
            );
        };
        this.handleApplySearch = async () => {
            let srPromise = new Promise(
                async function (Resolve, Reject) {
                    let nodeTree = {
                        token: localStorage.getItem('token'),
                        table: 'OCCUPATION A',
                        start: `A.OCCUPATION_NO = '${this.occID()}'`,
                        connect: 'PRIOR A.PARENT =  A.OCCUPATION_NO',
                        select: [],
                        join: [],
                        where: [],
                        order: 'TO_NUMBER(A.OCCUPATION_NO)',
                    };
                    nodeTree.select.push('A.OCCUPATION_NO AS ROOT');
                    nodeTree.join.push({
                        table: 'OCCUPATION B',
                        type: 'left',
                        condition: 'B.OCCUPATION_NO = A.PARENT',
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
                    if (`${this.occID()}` != '') {
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
            let currNodeSpan = document.querySelector(`#occNode${event.detail.key}`);
            if (currNodeSpan) {
                if (currNodeSpan.className == '_oj-tree-loading') currNodeSpan.className = 'oj-treeview-item-icon';
            }
        };
        this.handleNodeExpand = async (event) => {
            await this._loadNodeChilds(event.detail.key, -1);
        };

        this.handleTreeSearch = () => {
            this.occID('');
            document.querySelector(`#${this.itsSearchDialog}`).open();
        };
    };

    occTreeViewModel.prototype._initAllVariables = async function (context) {};

    occTreeViewModel.prototype._loadNodeChilds = async function (array, current) {
        let id;
        if (current > -1) {
            id = array[current];
        } else {
            id = array;
        }
        let fetchKeys = [id];
        let value = await this.occupationsDataProvider.fetchByKeys({ keys: fetchKeys });
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
                                let currNodeSpan = document.querySelector(`#occNode${id}`);
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

        if (id == '0000' || (!loaded && ChildsCount > 0)) {
            let occNode = {
                token: localStorage.getItem('token'),
                table: 'OCCUPATION',
                lazyLoading: true,
                select: [],
                join: [],
                where: [],
                order: 'OCCUPATION.PARENT,OCCUPATION.OCCUPATION_NO',
                id: 'occupationNo',
                parent: 'parent',
                value: '0',
            };
            occNode.select.push(
                'OCCUPATION.OCCUPATION_NO,OCCUPATION.PARENT as PARENT,OCCUPATION.NAME,NVL(OCC_TREE.CHILDS,0) as CHILDS'
            );
            occNode.join.push({
                table: 'OCC_TREE',
                type: 'left',
                condition: 'OCCUPATION.OCCUPATION_NO = OCC_TREE.PARENT',
            });

            occNode.where.push(`OCCUPATION.PARENT =  '${id}'`);

            Promise.all([serviceUtils.ajaxSendRequest('getTable', occNode)])
                .then(
                    await async function (values) {
                        let occTreeArray = coreUtils.parseJSON(values[0]);

                        if (occTreeArray) {
                            if (currNode) {
                                for (let index = 0; index < occTreeArray.length; index++) {
                                    currNode.children.push(occTreeArray[index]);
                                }
                                this.treeOccupationsData(this.occupationsDataProvider.treeData());
                            } else {
                                this.treeOccupationsData(occTreeArray);
                            }
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
    return occTreeViewModel;
});
