/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define([
    'knockout',
    'ojs/ojarraydataprovider',
    'utils/Service',
    'ojs/ojavatar',
    'custom-book/loader',
    'ojs/ojprogress-circle',
], function (ko, ArrayDataProvider, serviceUtils) {
    function booksViewModel(params) {
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
        this.connected = () => {
            document.title = 'Books';
            // Implement further logic if needed
        };

        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
        this.disconnected = () => {
            // Implement if needed
        };

        /**
         * Optional ViewModel method invoked after transition to the new View is complete.
         * That includes any possible animation between the old and the new View.
         */
        this.transitionCompleted = () => {
            // Implement if needed
        };

        this._initAllObservable();
    }

    booksViewModel.prototype._initAllObservable = function () {
        this.booksDataProvider = ko.observable(new ArrayDataProvider([], { keyAttributes: 'id' }));
        setTimeout(() => {
            let bookCommand = {
                token: localStorage.getItem('token'),
                schema:'AYMAN.',
                table: 'BOOKS',
            };

            Promise.all([serviceUtils.ajaxSendRequest('getTable', bookCommand)])
                .then(
                    function (values) {
                        if (values.length > 0) {
                            let booksData = JSON.parse(values[0]);
                            if (booksData)
                                this.booksDataProvider(new ArrayDataProvider(booksData, { keyAttributes: 'id' }));
                        }
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                });
        }, 500);
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return booksViewModel;
});
