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
    'jquery',
    'ojs/ojmodel',
    'ojs/ojcollectiondataprovider',
    'ojs/ojarraydataprovider',
    'ojs/ojknockout',
    'ojs/ojtable',
    'ojs/ojcheckboxset',
    'ojs/ojinputnumber',
    'ojs/ojinputtext',
    'ojs/ojdialog',
    'ojs/ojbutton',
    'ojs/ojformlayout',
    'ojs/ojmessages',
], function (Translations, ko, serviceUtils, $, ojmodel_1, CollectionDataProvider, ArrayDataProvider) {
    'use strict';
    const _t = Translations.getTranslatedString;
    function ManagersViewModel() {
        this.connected = () => {
            document.title = _t('titles.managers');
        };
        this.disconnected = () => {
          document.title = _t('titles.home');
        };

        this._initAlL_Labels();
        this._initAllObservables();
        this._initAllVariables();
    }

    ManagersViewModel.prototype._initAllVariables = function () {
        this.findMangerIds = () => {
            let selectedIdsArray = [];
            const divs = document.getElementsByTagName('oj-checkboxset');
            for (let i = 0; i < divs.length; i++) {
                const cbComp = divs[i];
                if (cbComp.value && cbComp.value.length) {
                    selectedIdsArray.push(cbComp.value[0]);
                }
            }
            return selectedIdsArray;
        };
        this.enableDelete = (event) => {
            this.somethingChecked(event && event.detail && event.detail.value && event.detail.value.length);
        };

        this.deleteManager = (event, data) => {
            let managerIds = [];
            managerIds = this.findMangerIds();
            const collection = data.ManagerCol();
            managerIds.forEach((value) => {
                const model = collection.get(value);
                if (model) {
                    collection.remove(model);
                    model.destroy();
                }
            });
            this.enableDelete();
            document.getElementById('table').refresh();
        };
        this.showChangeNameDialog = (vId, event, data) => {
            const currName = data.label;
            this.workingId(vId);
            this.currentManagerName(currName);
            document.getElementById('editDialog').open();
        };
        this.cancelDialog = () => {
            document.getElementById('editDialog').close();
            return true;
        };
        this.updateManagerName = (event) => {
            const currentId = this.workingId();
            const myCollection = this.ManagerCol();
            const myModel = myCollection.get(currentId);
            const newName = this.currentManagerName();

            if (newName != myModel.get('label') && (newName) && (newName.trim() != '')) {
                myModel.save(
                    {
                        label: newName,
                    },
                    {
                        success: (myModel, response, options) => {
                            document.getElementById('editDialog').close();
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            alert('Update failed with: ' + textStatus);
                            document.getElementById('editDialog').close();
                        },
                        wait: true,
                    }
                );
            } else {
                this._showMessage('error', _t('messages.sameFieldValue'));
                document.getElementById('editDialog').close();
            }
        };
        this.addManager = () => {
            const recordAttrs = {
                id: this.newManagerId(),
                label: this.newManagerName(),
            };

            if (recordAttrs.id > 0 && recordAttrs.label.trim() != '') {
                let settings = {
                    wait: true,
                    contentType: 'application/json',
                    success: (model, r) => {
                        console.log(model);
                        console.log(r);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {},
                };

                this.ManagerCol().create(recordAttrs, settings);
            } else {
                this._showMessage('error', _t('messages.emptyFields'));
            }
        };
    };

    ManagersViewModel.prototype._initAlL_Labels = function () {
        this.newManagerLabel = `${_t('labels.manager')} ${_t('labels.new')}`; //+' '+;
        this.deleteRowLabel = _t('buttons.deleteRow');
        this.addRowLabel = _t('buttons.addRow');
        this.nameLabel = _t('inputs.firstName');
        this.mangerIdLabel = _t('labels.id');
        this.newNameLabel = _t('inputs.firstName');
        this.editNameLabel = `${_t('buttons.edit')} ${_t('inputs.firstName')}`;
        this.applyLabel = _t('buttons.apply');
        this.cancelLabel = _t('buttons.cancel');
    };

    ManagersViewModel.prototype._initAllObservables = function () {
        this.columns = [
            { headerText: _t('labels.select'), id: 'column1', sortable: 'disabled' },
            { headerText: _t('labels.id'), id: 'column2', field: 'id', sortable: 'enabled' },
            { headerText: _t('labels.name'), id: 'column3', field: 'label', sortable: 'enabled' },
        ];

        this.messagesDataProvider = ko.observable([]);

        this.messagePosition = {
            my: { vertical: 'top', horizontal: 'end' },
            at: { vertical: 'top', horizontal: 'end' },
            of: 'window',
            offset: {
                y: '100px',
                x: '-100px',
            },
        };

        this.somethingChecked = ko.observable(false);
        this.currentManagerName = ko.observable('default');
        this.newManagerId = ko.observable(555);
        this.newManagerName = ko.observable('');
        this.workingId = ko.observable('');

        let mCommand = {
            token: localStorage.getItem('token'),
            schema: 'AYMAN.',
            table: 'MANAGERS',
            key: 'id',
        };

        this.serviceURL = serviceUtils.buildGetEndpointURL('getOjTable', mCommand);
        this.ManagerCol = ko.observable();
        this.dataSource = ko.observable();
        this.parseSaveDept = (response) => {
            return {
                id: response['id'],
                label: response['label'],
            };
        };
        this.parseDept = (response) => {
            return {
                id: response['id'],
                label: response['label'],
            };
        };
        this.Manager = ojmodel_1.Model.extend({
            urlRoot: this.serviceURL,
            parse: this.parseDept,
            parseSave: this.parseSaveDept,
            idAttribute: 'id',
        });
        this.myDept = new this.Manager();
        this.ManagerCollection = ojmodel_1.Collection.extend({
            url: this.serviceURL,
            model: this.myDept,
            comparator: 'id',
        });
        this.ManagerCol(new this.ManagerCollection());
        this.dataSource(new CollectionDataProvider(this.ManagerCol()));
    };

    ManagersViewModel.prototype._showMessage = function (severity, detail) {
        this.messagesDataProvider(
            new ArrayDataProvider([
                {
                    severity: severity,
                    detail: detail,
                    timestamp: new Date().toISOString(),
                    autoTimeout: 5000,
                },
            ])
        );
    };
    return ManagersViewModel;
});
