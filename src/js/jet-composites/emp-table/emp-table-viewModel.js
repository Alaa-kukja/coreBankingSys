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
], function (
    Translations,
    ko,
    serviceUtils,
    ArrayDataProvider,
    BufferingDataProvider,
    Context,
    ojconverter_number_1,
    ojconverter_datetime_1
) {
    const _t = Translations.getTranslatedString;
    function empTableViewModel(context) {
        this._initAlL_Labels();
        this._initAllObservables(context);
        this._initAllEventListeners(context);
    }

    empTableViewModel.prototype._initAlL_Labels = function () {
        this.deleteRowLabel = _t('buttons.deleteRow');
        this.addRowLabel = _t('buttons.addRow');
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
    };

    empTableViewModel.prototype._initAllObservables = function (context) {
        this.empObservableArray = ko.observableArray(context.properties.empArray);
        //this.empObservableArray = context.properties.empArray;
        // this.empObservableArray.subscribe((newValue) => {
        //     this.empObservableArray(newValue);
        // });
        this.dataProvider = context.properties.empData;
        this.columns = ko.observableArray([
            {
                field: 'id',
                headerText: _t('labels.id'),
                showRequired: true,
                headerClassName: 'oj-helper-text-align-end oj-sm-only-hide',
                className: 'oj-helper-text-align-start',
                template: 'empIdTemplate',
                sortable: 'enabled',
                id: 'empId',
                resizable: 'enabled',
                maxWidth: '7rem',
            },
            {
                field: 'name',
                headerText: _t('labels.name'),
                template: 'empNameTemplate',
                className: 'oj-sm-only-hide',
                sortable: 'enabled',
                resizable: 'enabled',
                id: 'empName',
            },
            {
                field: 'startdate',
                
                headerText: _t('labels.startDate'),
                className: 'oj-sm-only-hide',
                template: 'dateTemplate',
                resizable: 'enabled',
                id: 'start',
            },
            {
                field: 'salary',
                headerText: _t('labels.salary'),
                headerClassName: 'oj-helper-text-align-start oj-sm-only-hide',
                className: 'oj-helper-text-align-start',
                template: 'salaryTemplate',
                sortable: 'enabled',
                resizable: 'enabled',
                id: 'empSalary',
            },
            {
              //  headerText:  _t('buttons.action'),
                width: '6.2rem',
                headerClassName: 'oj-helper-text-align-end',
                className: 'oj-helper-text-align-end oj-sm-padding-0-vertical oj-sm-only-hide',
                template: 'actionTemplate',
                resizable: 'enabled',
                id: 'action',
            },
        ]);

        this.editedData = ko.observable('');

        this.numberConverter = new ojconverter_number_1.IntlNumberConverter();

        this.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
            formatType: 'date',
            dateFormat: 'medium',
        });

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
    };

    empTableViewModel.prototype._initAllEventListeners = function (context) {
        this._handleEditRow();
        this._handleAddRow(context);
        this.selectedChangedListener = (event) => {
            const row = event.detail.value.row;
            if (row.values().size > 0) {
                row.values().forEach((value) => {
                    this.selectionInfo(value);
                });
            }
            this.isDisabled(row.values().size === 0);
        };

        this.handleDeleteRow = (event, data) => {
            let delCommand = {
                token: localStorage.getItem('token'),
                schema:'AYMAN.',
                table: 'EMPLOYEES',
                keys: { id: this.selectionInfo() },
            };
            Promise.all([serviceUtils.ajaxSendRequest('deleteRows', delCommand)])
                .then(
                    function (values) {
                        if (values.length > 0) {
                            let editData = JSON.parse(values[0]);
                            if (editData.error == 'success') {
                                let deptArray = this.empObservableArray();
                                let deletedValue;
                                deptArray.forEach((value) => {
                                    console.log(value); 
                                    if (value.id === this.selectionInfo()) {
                                       
                                        deletedValue = value;
                                        this.empObservableArray.remove(value);
                                    }
                                });
                                this.dataProvider.removeItem({
                                    metadata: { key: deletedValue.id },
                                    data: deletedValue,
                                });
                                let params = {
                                    detail: deletedValue,
                                };
                            }
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        };
    };

    empTableViewModel.prototype._handleEditRow = function () {
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
                                                table: 'EMPLOYEES',
                                                indent: 'update',
                                                keys: { id: myDetail.rowContext.item.data.id },
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
            //this.editRow({ rowKey: context.item.data.id });
        };
        this.handleDone = () => {
            this.editRow({ rowKey: null });
        };
        this.handleCancel = () => {
            this.cancelEdit = true;
            this.editRow({ rowKey: null });
        };
    };

    empTableViewModel.prototype._handleAddRow = function (context) {
        this.addRowData = ko.observable({
            id: undefined,
            name: '',
            department: context.properties.master,
            startdate: '',
            salary: undefined,
        });
        this.clearRowData = () => {
            this.addRowData({
                id: undefined,
                name: '',
                department: context.properties.master,
                startdate: '',
                salary: undefined,
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
                    const key = event.detail.rowContext.item.data.id;
                    this.submitRow(key);
                }
            } else {
                let addCommand = {
                    token: localStorage.getItem('token'),
                    schema:'AYMAN.',
                    table: 'EMPLOYEES',
                    indent: 'INSERT',
                    keys: { id: this.addRowData().id },
                    fields: this.addRowData(),
                };
                addCommand.fields.department = context.properties.master;
                // the use of 'setTimeout' here is only to simulate the delay of a real asynchronous task
                Promise.all([serviceUtils.ajaxSendRequest('editTable', addCommand)])
                    .then(
                        function (values) {
                            if (values.length > 0) {
                                console.log(values[0]);
                                let editData = JSON.parse(values[0]);
                                if (editData.error == 'success') {
                                    let addItem = {
                                        metadata: { key: this.addRowData().id },
                                        data: this.addRowData(),
                                    };
                                 //   console.log(this.addRowData());
                                    this.dataProvider.addItem(addItem);
                                   // console.log(addItem);
                                    const editItem = this.dataProvider.getSubmittableItems()[0];
                                   //  console.log(editItem);
                                    this.dataProvider.setItemStatus(editItem, 'submitting');
                                    this.empObservableArray.splice(0, 0, editItem.item.data);
                                   // console.log(this.empObservableArray());
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
            this.dataProvider.setItemStatus(editItem, 'submitting');
            for (let idx = 0; idx < this.empObservableArray().length; idx++) {
                if (this.empObservableArray()[idx].id === editItem.item.metadata.key) {
                    this.empObservableArray.splice(idx, 1, editItem.item.data);
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

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return empTableViewModel;
});
