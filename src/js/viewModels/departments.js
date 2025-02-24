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
    'ojs/ojvalidator-numberrange',
    'ojs/ojknockout',
    'ojs/ojinputtext',
    'ojs/ojdatetimepicker',
    'ojs/ojselectcombobox',
    'ojs/ojcheckboxset',
    'ojs/ojtable',
    'ojs/ojtoolbar',
    'ojs/ojbutton',
    'ojs/ojmessages',
    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojlabelvalue',
    'emp-table/loader',
], function (
    Translations,
    ko,
    serviceUtils,
    ArrayDataProvider,
    BufferingDataProvider,
    Context,
    ojconverter_number_1,
    ojconverter_datetime_1,
    NumberRangeValidator
) {
    const _t = Translations.getTranslatedString;
    function DepartmentsViewModel(params) {
      
        this.connected = () => {
            document.title = _t('titles.departments');
        };
        this.disconnected = () => {
            document.title = _t('titles.home');
        };

        this.transitionCompleted = () => {
            // Implement if needed
        };
        this._initAlL_Labels();
        this._initAllObservables();
        this._initAllEventListeners();
    }

    DepartmentsViewModel.prototype._initAlL_Labels = function () {
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

    DepartmentsViewModel.prototype._initAllObservables = async function () {
        this.columns = ko.observableArray([
            {
                field: 'departmentid',
                headerText: _t('labels.id'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-start oj-sm-only-hide',
                className: 'oj-helper-text-align-start oj-sm-only-hide',
                template: 'deptIdTemplate',
                sortable: 'enabled',
                resizable: 'enabled',
                maxWidth:'7rem',
                id: 'depId',
            },
            {
                field: 'departmentname',
                headerText: _t('labels.departmentName'),
                template: 'deptNameTemplate',
                className:'oj-md-down-hide',
                sortable: 'enabled',
                resizable: 'enabled',
                id: 'depName',
            },
            {
                field: 'locationid',
                headerText: _t('labels.location'),
                headerClassName: 'oj-helper-text-align-start',
                className: 'oj-helper-text-align-start oj-sm-only-hide',
                template: 'locIdTemplate',
                sortable: 'enabled',
                resizable: 'enabled',
                id: 'locId',
            },
            {
                field: 'type',
                headerText: _t('labels.type'),
                className: 'oj-sm-only-hide',
                template: 'typeTemplate',
                resizable: 'enabled',
                id: 'type',
            },
            {
                field: 'currency',
                headerText: _t('labels.currency'),
                className: 'oj-sm-only-hide',
                template: 'currencyTemplate',
                resizable: 'enabled',
                id: 'currency',
            },
            {
                field: 'startdate',
                headerClassName:'oj-md-only-hide',
                className: 'oj-sm-only-hide',
                headerText: _t('labels.startDate'),
                template: 'dateTemplate',
                resizable: 'enabled',
                id: 'start',
            },
            {
                //headerText:_t('buttons.action'),
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-end oj-sm-padding-0-vertical',
                template: 'actionTemplate',
                resizable: 'enabled',
                maxWidth:'7rem',
                id: 'action',
            },
        ]);
        this.empTable = document.getElementById('employeesTable');
        this.deptObservableArray = ko.observableArray([]);
        this.dataProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.deptObservableArray, {
                keyAttributes: 'departmentId',
            })
        );

        this.empObservableArray = ko.observableArray([]);
        this.empDtaProvider = new BufferingDataProvider(
            new ArrayDataProvider(this.empObservableArray, {
                keyAttributes: 'id',
            })
        );

        this.departments = new ArrayDataProvider(
            [{ label: 'Sales' }, { label: 'HR' }, { label: 'Marketing' }, { label: 'Finance' }],
            { keyAttributes: 'label' }
        );
        this.editedData = ko.observable('');
        // // NUMBER AND DATE CONVERTER ////
        this.numberConverter = new ojconverter_number_1.IntlNumberConverter();
        // this.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
        //     year: '2-digit',
        //     month: '2-digit',
        //     day: '2-digit',
        // });

        this.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
            formatType: 'date',
            dateFormat: 'medium',
        });
        this.rangeValidator = new NumberRangeValidator({ min: 100, max: 500 });
        this.validators = [this.rangeValidator];
        this.asyncValidation = ko.observable('on');
        this.isDelayDisabled = ko.computed(
            function () {
                return this.asyncValidation() === 'off';
            }.bind(this)
        );
        this.editDelay = ko.observable(200);
        this.editEndDelay = ko.observable(200);
        this.editRow = ko.observable();
        this.displayRow = ko.observable('hidden');
        this.isNavigationMode = ko.computed(() => {
            return this.displayRow() === 'top';
        });

        this.isDisabled = ko.observable(true);
        this.selectionInfo = ko.observable();
        this.selectionInfo.subscribe((newValue) => {
            this._loadDetailData(newValue);
        });

        let depCommand = {
            token: localStorage.getItem('token'),
            schema:'AYMAN.',
            table: 'DEPARTMENTS',
        };

        Promise.all([serviceUtils.ajaxSendRequest('getTable', depCommand)])
            .then(
                function (values) {
                    if (values.length > 0) {
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

    DepartmentsViewModel.prototype._initAllEventListeners = function () {
        this._handleEditRow();
        this._handleAddRow();

        this.selectedChangedListener = (event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                row.values().forEach((value) => {
                    const arr = this.deptObservableArray();
                    // this.selectionInfo(0);
                    this.selectionInfo(arr[value].departmentid);
                    // this._loadDetailData(arr[value].departmentid);
                });
            }
            this.isDisabled(row.values().size === 0);
        };

        this.handleDeleteRow = (event, data) => {
            let delCommand = {
                token: localStorage.getItem('token'),
                schema:'AYMAN.',
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

    DepartmentsViewModel.prototype._handleEditRow = function () {
        this.isRowDataUpdated = () => {
            const propNames = Object.getOwnPropertyNames(this.rowData);
            for (let i = 0; i < propNames.length; i++) {
                if (this.rowData[propNames[i]] !== this.originalData[propNames[i]]) {
                    return true;
                }
            }
            return false;
        };
        // checking for validity of editedTables inside a row
        this.getValidationErrorElementsInRow = (table, editableClassName) => {
            let invalidInputs = [];
            const editedTables = table.querySelectorAll(editableClassName);
            for (let i = 0; i < editedTables.length; i++) {
                const editable = editedTables.item(i);
                editable.validate();
                // Table does not currently support editedTables with async validators
                // so treating editable with 'pending' state as invalid
                if (editable.valid !== 'valid') {
                    invalidInputs.push(editable);
                }
            }
            return invalidInputs;
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
            this.editedData('');
            const myDetail = event.detail;
            if (!myDetail.cancelEdit && !this.cancelEdit) {
                if (this.asyncValidation() === 'on') {
                    myDetail.accept(
                        new Promise(
                            function (resolve, reject) {
                                // the use of 'setTimeout' here is only to simulate the delay of a real asynchronous task
                                setTimeout(
                                    function () {
                                        let invalidInput = this.validateInputs(event, false);
                                        if (invalidInput != null) {
                                            reject();
                                            this.applyFocus(invalidInput);
                                        } else {
                                            let editCommand = {
                                                token: localStorage.getItem('token'),
                                                schema:'AYMAN.',
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
                                                            console.log(values[0]);
                                                            let editData = JSON.parse(values[0]);
                                                            if (editData.error == 'success') {
                                                                myDetail.setUpdatedItem(
                                                                    new Promise((r) => {
                                                                        r({
                                                                            updatedItem: {
                                                                                data: this.rowData,
                                                                                metadata:
                                                                                    myDetail.rowContext.item.metadata,
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
                                    }.bind(this),
                                    this.editEndDelay()
                                );
                            }.bind(this)
                        )
                    );
                } else {
                    let invalidInput = this.validateInputs(event, false);
                    if (invalidInput != null) {
                        event.preventDefault();
                        this.applyFocus(invalidInput);
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
                        resolve({ updatedItem: myDetail.rowContext.item });
                    })
                );
            }
        };

        this.applyFocus = (element) => {
            let busyContext = Context.getContext(document.getElementById('table')).getBusyContext();
            busyContext.whenReady().then(function () {
                element.focus();
            });
        };

        this.handleUpdate = (event, context) => {
            this.editRow({ rowKey: context.key });
            //this.editRow({ rowKey: context.item.data.departmentid });
        };
        this.handleDone = () => {
            this.editRow({ rowKey: null });
        };
        this.handleCancel = () => {
            this.cancelEdit = true;
            this.editRow({ rowKey: null });
        };
    };

    DepartmentsViewModel.prototype._handleAddRow = function () {
        this.addRowData = ko.observable({
            departmentid: undefined,
            departmentname: '',
            locationid: undefined,
            type: '',
            currency: '',
            startdate: '',
        });

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
                                // the use of 'setTimeout' here is only to simulate the delay of a real asynchronous task
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
                let addCommand = {
                    token: localStorage.getItem('token'),
                    schema:'AYMAN.',
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
                                    const editItem = this.dataProvider.getSubmittableItems()[0];
                                    this.dataProvider.setItemStatus(editItem, 'submitting');
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
            }
        };

        this.resetAddRowElements = (table) => {
            const editedTables = table.querySelectorAll('.addRowEditable');
            for (let i = 0; i < editedTables.length; i++) {
                const editable = editedTables.item(i);
                editable.reset();
            }
        };

        this.submitRow = (key) => {
            this.dataProvider.updateItem({
                metadata: { key: key },
                data: this.rowData,
            });
            const editItem = this.dataProvider.getSubmittableItems()[0];
            console.log(editItem);
            this.dataProvider.setItemStatus(editItem, 'submitting');
            for (let idx = 0; idx < this.deptObservableArray().length; idx++) {
                if (this.deptObservableArray()[idx].departmentid === editItem.item.metadata.key) {
                    this.deptObservableArray.splice(idx, 1, editItem.item.data);
                    break;
                }
            }
            // Set the edit item to "submitted" if successful
            this.dataProvider.setItemStatus(editItem, 'submitted');
            this.editedData(JSON.stringify(editItem.item.data));
        };

        this.handleAddSubmit = (event, context) => {
            context.submitAddRow(false);
            this.displayRow('hidden');
        };
        this.handleAddCancel = (event, context) => {
            context.submitAddRow(true);
            this.displayRow('hidden');
        };

        this.handleAddRow = () => {
            this.displayRow() === 'hidden' ? this.displayRow('top') : this.displayRow('hidden');
        };
    };

    DepartmentsViewModel.prototype._loadDetailData = function (master) {
        this.empObservableArray([]);
        let empCommand = {
            token: localStorage.getItem('token'),
            schema:'AYMAN.',
            table: 'EMPLOYEES',
            keys: { department: master },
        };
        let detailTable = document.getElementById('idEmployees');
        detailTable.master = master;
        Promise.all([serviceUtils.ajaxSendRequest('getTable', empCommand)])
            .then(
                function (values) {
                    if (values.length > 0) {
                        let empArray = JSON.parse(values[0]);
                        if (empArray) {
                            this.empObservableArray(empArray);
                        }
                    }
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DepartmentsViewModel;
});
