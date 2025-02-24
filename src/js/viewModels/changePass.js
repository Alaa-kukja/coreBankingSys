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
define(['ojs/ojtranslation','knockout', 'ojs/ojvalidationgroup',], function (Translations,ko) {
    const _t = Translations.getTranslatedString;
    function ChangePassViewModel(receivedParams) {
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

        const { router } = receivedParams;
        this.router = router;

        this.connected = () => {
            document.title = _t('buttons.changePassword');
            // Implement further logic if needed
        };

        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
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

        this._initAllObservable();
        this._initAlL_Labels();
        this._initAllEventListeners();
    }

    /**
     * @function _initAllObservable
     * @description
     */

    ChangePassViewModel.prototype._initAllObservable = async function () {
        this.oldPassword = ko.observable(null);
        this.newPassword = ko.observable(null);
        this.confirm = ko.observable(null);
    };


    /**
     * @function _initAlL_Labels
     * @description
     */

    ChangePassViewModel.prototype._initAlL_Labels = function () {
        this.oldPasswordLabel = _t('inputs.oldPassword');
        this.newPasswordLabel = _t('inputs.newPassword');
        this.confirmLabel = _t('inputs.confirm');
        this.changPasswordLabel = _t('buttons.changePassword');
    };


     /**
     * @function _initAllEventListeners
     * @description initialize all events
     */

     ChangePassViewModel.prototype._initAllEventListeners = function () {
        this.handleBack = () =>{
            this.router.go({ path: '' });
        };
     };


    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return ChangePassViewModel;
});
