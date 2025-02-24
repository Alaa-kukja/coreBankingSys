/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 'utils/Service','ojs/ojprogress-circle'], function (ko, serviceUtils) {
    function ReportsViewModel() {
        this._initAllObservable();
        this._initAllVariables();
        this._initAllEventListeners();
    }

    /**
     * @function _initAllObservable
     * @description
     */

    ReportsViewModel.prototype._initAllObservable = async function () {
        this.reportHTMLDocument = ko.observable('');
        let htmlDocument;
        let url =
            'http://localhost:6464?BIREPORT&SESSIONID=0!{674F7A83-9F4E-4AF7-B259-3FF61A846C6E}&Design=0!RepWithdrawals_deposits&Internal=3!True';
        htmlDocument = await serviceUtils.externalFetchData(url, 'GET');
        this.reportHTMLDocument(htmlDocument);
    };

    /**
     * @function _initAllVariables
     * @description
     */

    ReportsViewModel.prototype._initAllVariables = function () {};

    /**
     * @function _initAllEventListeners
     * @description
     */

    ReportsViewModel.prototype._initAllEventListeners = function () {
        this.resizeIframe = () => {
            let elm = document.getElementById('reportFrame');
            let aHeight = elm.contentWindow.document.documentElement.scrollHeight + 'px';
            let aWidth = elm.contentWindow.document.getElementsByClassName('spage')[0].style.width;
            let y = parseFloat(aHeight);
            let x = parseFloat(aWidth);
            if (y > window.innerHeight) elm.style.height = aHeight;
            else elm.style.height = window.innerHeight - 5 + 'px';
            if (x > window.innerWidth * 0.85) elm.style.width = aWidth;
            else elm.style.width = window.innerWidth * 0.85 - 11 + 'px';
            
        };
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return ReportsViewModel;
});
