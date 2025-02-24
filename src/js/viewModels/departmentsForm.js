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
    'utils/Service',
    'ojs/ojarraydataprovider',
    'ojs/ojbufferingdataprovider',
    'ojs/ojcontext',
    'ojs/ojconverter-number',
    'ojs/ojconverter-datetime',
    'ojs/ojkeyset',
    'ojs/ojvalidationgroup',
    'ojs/ojknockout',
    'ojs/ojinputtext',
    'ojs/ojinputnumber',
    'ojs/ojdatetimepicker',
    'ojs/ojselectcombobox',
    'ojs/ojcheckboxset',
    'ojs/ojtable',
    'ojs/ojbinddom',
    'ojs/ojbutton',
    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojlabelvalue',
], function (
    Translations,
    ko,
    serviceUtils,
    ArrayDataProvider,
    BufferingDataProvider,
    Context,
    ojconverter_number_1,
    ojconverter_datetime_1,
    ojkeyset_1
) {
    const _t = Translations.getTranslatedString;
    class DepartmentsFormVieModel {
        // Below are a set of the ViewModel methods invoked by the oj-module component.
        // Please reference the oj-module jsDoc for additional information.

        /**
         * Optional ViewModel method invoked after the View is inserted into the
         * document DOM.  The application can put logic that requires the DOM being
         * attached here.
         * This method might be called multiple times - after the View is created
         * and inserted into the DOM and after the View is reconnected
         * after being disconnected.
         */
        constructor() {
            this.connected = () => {
                document.title = _t('titles.departments');
            };
            this.disconnected = () => {
                document.title = _t('titles.home');
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            this.transitionCompleted = () => {
                // Implement if needed
            };

            this._initAlL_Labels();
            this._initAllObservables();
            this._initAllVariables();
            this._initAllEventListeners();
        }
    }

    DepartmentsFormVieModel.prototype._initAllObservables = function () {
        this.columns = ko.observableArray([
            {
                field: 'departmentid',
                headerText: _t('labels.id'),
                className: 'oj-helper-text-align-start',
                sortProperty: 'departmentid',
                width: '7rem',
                id: 'depId',
            },
            {
                field: 'departmentname',
                headerText: _t('labels.departmentName'),
                headerClassName: 'oj-sm-only-hide',
                className: 'oj-sm-only-hide',
                sortProperty: 'departmentname',
                id: 'depName',
            },
            {
                field: 'managerid',
                headerText: _t('labels.theManager'),
                headerClassName: 'oj-helper-text-align-start oj-sm-only-hide ',
                className: 'oj-helper-text-align-start oj-sm-only-hide',
                sortProperty: 'managerid',
                id: 'manId',
            },
            {
                field: 'locationid',
                headerText: _t('labels.location'),
                headerClassName: 'oj-helper-text-align-start oj-sm-only-hide ',
                className: 'oj-helper-text-align-start oj-sm-only-hide',
                sortProperty: 'locationid',
                id: 'locId',
            },
            { field: 'type', headerText: _t('labels.type'), sortProperty: 'type', id: 'type' },
            {
                field: 'startdate',
                headerText: _t('labels.startDate'),
                headerClassName: 'oj-sm-only-hide',
                className: 'oj-sm-only-hide',
                sortProperty: 'startdate',
                id: 'start',
            },
            {
                // headerText:_t('buttons.action'),
                sortable: 'disable',
                width: '5rem',
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-end',
                id: 'action',
            },
        ]);

        this.managers = ko.observableArray([]);
        this.managersDataProvider = new ArrayDataProvider(this.managers, { keyAttributes: 'id' });
        this.isDisabled = ko.observable(true);
        this.selectionInfo = ko.observable();
        this.displayRow = ko.observable('hidden');
        this.isNavigationMode = ko.computed(() => {
            return this.displayRow() === 'top';
        });
        this.addRowData = ko.observable({
            departmentid: undefined,
            departmentname: '',
            locationid: undefined,
            type: '',
            currency: '',
            startdate: '',
        });

        this.deptObservableArray = ko.observableArray([]);
        this.dataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.deptObservableArray, {
                keyAttributes: 'departmentid',
            })
        );
        this.departments = new ArrayDataProvider(
            [{ label: 'Sales' }, { label: 'HR' }, { label: 'Marketing' }, { label: 'Finance' }],
            { keyAttributes: 'label' }
        );
        this.asyncValidation = ko.observable('on');
        this.isDelayDisabled = ko.computed(
            function () {
                return this.asyncValidation() === 'off';
            }.bind(this)
        );
        this.editDelay = ko.observable(200);
        this.editEndDelay = ko.observable(200);
        this.disabledKeys = new ojkeyset_1.KeySetImpl([20, 40]);
        // // NUMBER AND DATE CONVERTER ////
        this.numberConverter = new ojconverter_number_1.IntlNumberConverter({ useGrouping: false });
        this.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
            formatType: 'date',
            dateFormat: 'medium',
        });
        this.editRow = ko.observable({ rowKey: null });

        let depCommand = {
            token: localStorage.getItem('token'),
            table: 'DEPARTMENTS',
        };
        let lookupCommand = {
            token: localStorage.getItem('token'),
            table: 'MANAGERS',
            id: 'ID',
            label: 'label',
        };
        Promise.all([
            serviceUtils.ajaxSendRequest('getTable', depCommand),
            serviceUtils.ajaxSendRequest('getLookup', lookupCommand),
        ])
            .then(
                function (values) {
                    if (values.length > 1) {
                        this.managers(JSON.parse(values[1]));
                        let deptArray = JSON.parse(values[0]);
                        if (deptArray) {
                            this.deptObservableArray(deptArray);
                        }
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });
    };

    /**
     * @function _initAllVariables
     * @description initialize all variables
     */

    DepartmentsFormVieModel.prototype._initAllVariables = function () {
        this.managerName = (id) => {
            const managersArr = this.managers();
            let result = '';
            managersArr.forEach((value) => {
                if (value.id == id) result = value.label;
            });
            return result;
        };
    };

    /**
     * @function _initAlL_Labels
     * @description
     */

    DepartmentsFormVieModel.prototype._initAlL_Labels = function () {
        this.departmentIdLabel = _t('labels.id');
        this.departmentNameLabel = _t('labels.departmentName');
        this.deleteRowLabel = _t('buttons.deleteRow');
        this.addRowLabel = _t('buttons.addRow');
        this.startDateLabel = _t('labels.startDate');
        this.currencyLabel = _t('labels.currency');
        this.managerIdLabel = _t('labels.theManager');
        this.typeLabel = _t('labels.type');
        this.locationIdLabel = _t('labels.location');
        this.employeesCountLabel = _t('labels.employeesCount');
        this.ratingLabel = _t('labels.rating');
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
    };

    /**
     * @function _handleAddTableRow
     * @description handle Add Table Row
     */

    DepartmentsFormVieModel.prototype._handleAddTableRow = function () {
        this.validateInputs = (event, isAdd) => {
            let invalidInputs = this.getValidationErrorElementsInRow(
                document.getElementById('table'),
                isAdd ? '.addRowEditable' : '.editable'
            );
            if (invalidInputs.length > 0) {
                return invalidInputs[0];
            } else if (!isAdd) {
                if (this.isRowDataUpdated()) {
                    const key = event.detail.rowContext.item.data.departmentid;
                    this.submitRow(key);
                }
            } else {
                //begin add
                let addCommand = {
                    token: localStorage.getItem('token'),
                    table: 'DEPARTMENTS',
                    indent: 'INSERT',
                    keys: { departmentid: this.addRowData().departmentid },
                    fields: this.addRowData(),
                };
                // the use of 'setTimeout' here is only to simulate the delay of a real asynchronous task
                Promise.all([serviceUtils.ajaxSendRequest('editTable', addCommand)])
                    .then(
                        function (values) {
                            if (values.length > 0) {
                                let editData = JSON.parse(values[0]);
                                if (editData.error == 'success') {
                                    let addItem = {
                                        metadata: { key: this.addRowData().departmentid },
                                        data: this.addRowData(),
                                    };
                                    this.dataProvider.addItem(addItem);
                                    //  const editItem = this.dataProvider.getSubmittableItems()[0];
                                    //  this.dataProvider.setItemStatus(editItem, 'submitting');
                                    this.deptObservableArray.splice(0, 0, editItem.item.data);
                                    this.dataProvider.setItemStatus(editItem, 'submitted');
                                    this.clearRowData();
                                }
                            }
                        }.bind(this)
                    )
                    .catch(function (reason) {
                        console.log(reason);
                    });
                //end add
            }
        };
        this.applyFocus = (element) => {
            let busyContext = Context.getContext(document.getElementById('table')).getBusyContext();
            busyContext.whenReady().then(function () {
                element.focus();
            });
        };

        this.clearRowData = () => {
            this.addRowData({
                departmentid: undefined,
                departmentname: '',
                locationid: undefined,
                type: '',
                currency: '',
                startdate: '',
            });
        };
        this.handleAddCancel = (event, context) => {
            context.submitAddRow(true);
            this.displayRow('hidden');
        };

        this.handleAddSubmit = (event, context) => {
            context.submitAddRow(false);
            this.displayRow('hidden');
        };

        this.handleAddRow = () => {
            this.displayRow() === 'hidden' ? this.displayRow('top') : this.displayRow('hidden');
        };

        this.getValidationErrorElementsInRow = (table, editableClassName) => {
            let invalidInputs = [];
            const editTables = table.querySelectorAll(editableClassName);
            for (let i = 0; i < editTables.length; i++) {
                const editTable = editTables.item(i);
                editTable.validate();
                // Table does not currently support editTables with async validators
                // so treating editable with 'pending' state as invalid
                if (editTable.valid !== 'valid') {
                    invalidInputs.push(editTable);
                }
            }
            return invalidInputs;
        };

        this.resetAddRowElements = (table) => {
            const editedTables = table.querySelectorAll('.addRowEditable');
            for (let i = 0; i < editedTables.length; i++) {
                const editedTable = editedTables.item(i);
                editedTable.reset();
            }
        };

        this.beforeRowAddEndListener = (event) => {
            const detail = event.detail;
            if (detail.cancelAdd === true) {
                this.resetAddRowElements(document.getElementById('table'));
                this.clearRowData();
            } else {
                if (this.asyncValidation() === 'on') {
                    detail.accept(
                        new Promise(
                            function (resolve, reject) {
                                setTimeout(
                                    function () {
                                        let invalidInput = this.validateInputs(event, true);
                                        if (invalidInput != null) {
                                            reject();
                                            this.applyFocus(invalidInput);
                                        } else {
                                            resolve();
                                        }
                                    }.bind(this),
                                    this.editEndDelay()
                                );
                            }.bind(this)
                        )
                    );
                } else {
                    let invalidInput = this.validateInputs(event, true);
                    if (invalidInput != null) {
                        event.preventDefault();
                        this.applyFocus(invalidInput);
                    }
                }
            }
        };
    };

    /**
     * @function _handleEditTableRow
     * @description handle update Table Row
     */

    DepartmentsFormVieModel.prototype._handleEditTableRow = function () {
        this.rowEditable = (item) => {
            if (this.disabledKeys.has(item.metadata.key)) {
                return 'off';
            }
            return 'on';
        };
        this.beforeRowEditListener = (event) => {
            if (this.asyncValidation() === 'on') {
                event.detail.accept(
                    new Promise(
                        function (resolve) {
                            setTimeout(
                                function () {
                                    this.prepareEdit(event);
                                    resolve();
                                }.bind(this),
                                this.editDelay()
                            );
                        }.bind(this)
                    )
                );
            } else {
                this.prepareEdit(event);
            }
        };
        this.prepareEdit = (event) => {
            this.cancelEdit = false;
            const rowContext = event.detail.rowContext;
            this.originalData = Object.assign({}, rowContext.item.data);
            this.rowData = Object.assign({}, rowContext.item.data);
        };
        // handle validation of editable components and when edit has been cancelled
        this.beforeRowEditEndListener = (event) => {
            const myDetail = event.detail;
            if (!myDetail.cancelEdit && !this.cancelEdit) {
                if (this.asyncValidation() === 'on') {
                    myDetail.accept(
                        new Promise(
                            function (resolve, reject) {
                                if (!this.validateEdit(event)) {
                                    reject();
                                } else {
                                    let editCommand = {
                                        token: localStorage.getItem('token'),
                                        table: 'DEPARTMENTS',
                                        indent: 'update',
                                        keys: { departmentid: myDetail.rowContext.item.data.departmentid },
                                        fields: this.rowData,
                                    };
                                    // the use of 'setTimeout' here is only to simulate the delay of a real asynchronous task
                                    Promise.all([serviceUtils.ajaxSendRequest('editTable', editCommand)])
                                        .then(
                                            function (values) {
                                                if (values.length > 0) {
                                                    let editData = JSON.parse(values[0]);
                                                    if (editData.error == 'success') {
                                                        myDetail.setUpdatedItem(
                                                            new Promise((r) => {
                                                                r({
                                                                    updatedItem: {
                                                                        data: this.rowData,
                                                                        metadata: myDetail.rowContext.item.metadata,
                                                                    },
                                                                });
                                                            })
                                                        );

                                                        resolve();
                                                    } else {
                                                        reject();
                                                    }
                                                }
                                            }.bind(this)
                                        )
                                        .catch(function (reason) {
                                            console.log(reason);
                                            reject();
                                        });
                                }
                            }.bind(this)
                        )
                    );
                } else {
                    if (!this.validateEdit(event)) {
                        event.preventDefault();
                    } else {
                        myDetail.setUpdatedItem(
                            new Promise((resolve) => {
                                resolve({
                                    updatedItem: { data: this.rowData, metadata: myDetail.rowContext.item.metadata },
                                });
                            })
                        );
                    }
                }
            } else if (this.cancelEdit) {
                myDetail.setUpdatedItem(
                    new Promise((resolve) => {
                        resolve({ updatedItem: detail.rowContext.item });
                    })
                );
            }
        };
        this.validateEdit = (event) => {
            if (this.hasValidationErrorInRow(document.getElementById('table'))) {
                return false;
            } else {
                if (this.isRowDataUpdated()) {
                    const key = event.detail.rowContext.item.data.departmentid;
                    this.submitRow(key);
                }
                return true;
            }
        };
        this.submitRow = (key) => {
            this.dataProvider.updateItem({
                metadata: { key: key },
                data: this.rowData,
            });
            const editItem = this.dataProvider.getSubmittableItems()[0];
            this.dataProvider.setItemStatus(editItem, 'submitting');
            for (let idx = 0; idx < this.deptObservableArray().length; idx++) {
                if (this.deptObservableArray()[idx].departmentid === editItem.item.metadata.key) {
                    this.deptObservableArray.splice(idx, 1, editItem.item.data);
                    break;
                }
            }
            // Set the edit item to "submitted" if successful
            this.dataProvider.setItemStatus(editItem, 'submitted');
        };
        this.isRowDataUpdated = () => {
            const propNames = Object.getOwnPropertyNames(this.rowData);
            for (let i = 0; i < propNames.length; i++) {
                if (this.rowData[propNames[i]] !== this.originalData[propNames[i]]) {
                    return true;
                }
            }
            return false;
        };
        // checking for validity of editables inside a row
        // return false if one of them is considered as invalid
        this.hasValidationErrorInRow = (table) => {
            const editables = table.querySelectorAll('.editable');
            for (let i = 0; i < editables.length; i++) {
                const editable = editables.item(i);
                // Table does not currently support editables with async validators
                // so treating editable with 'pending' state as invalid
                editable.validate();
            }
            var trackerEdit = document.getElementById('trackerEdit');
            if (trackerEdit.valid === 'valid') {
                return false;
            } else {
                let busyContext = Context.getContext(document.getElementById('table')).getBusyContext();
                busyContext.whenReady().then(function () {
                    trackerEdit.focusOn('@firstInvalidShown');
                });
                return true;
            }
        };
        this.handleUpdate = (event, context) => {
            this.editRow({ rowKey: context.key });
        };
        this.handleDone = () => {
            this.editRow({ rowKey: null });
        };
        this.handleCancel = () => {
            this.cancelEdit = true;
            this.editRow({ rowKey: null });
        };
    };

    /**
     * @function _handleSelectionRow
     * @description handle Selection Table Row
     */

    DepartmentsFormVieModel.prototype._handleSelectionRow = function () {
        this.selectedChangedListener = (event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                row.values().forEach((value) => {
                    console.log(value);
                });
            }
            this.isDisabled(row.values().size === 0);
        };

        this.handleDeleteRow = (event, data) => {
            let delCommand = {
                token: localStorage.getItem('token'),
                table: 'DEPARTMENTS',
                keys: { departmentid: this.selectionInfo() },
            };
            Promise.all([serviceUtils.ajaxSendRequest('deleteRows', delCommand)])
                .then(
                    function (values) {
                        if (values.length > 0) {
                            let editData = JSON.parse(values[0]);
                            if (editData.error == 'success') {
                                let deptArray = this.deptObservableArray();
                                deptArray.forEach((value) => {
                                    if (value.departmentid === this.selectionInfo())
                                        this.deptObservableArray.remove(value);
                                });
                                this.deptObservableArray(deptArray);
                            }
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        };
    };

    /**
     * @function _initAllEventListeners
     * @description initialize all events
     */

    DepartmentsFormVieModel.prototype._initAllEventListeners = function () {
        this._handleAddTableRow();
        this._handleEditTableRow();
        this._handleSelectionRow();
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */

    // (0, ojbootstrap_1.whenDocumentReady)().then(() => {
    //     const vm = new DepartmentsFormVieModel();
    //     const element = document.getElementById('tableWrapper');
    //     ko.applyBindings(vm, element);
    // });
    return DepartmentsFormVieModel;
});
