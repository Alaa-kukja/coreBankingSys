/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define([
    'ojs/ojtranslation',
    'ojs/ojcontext',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'knockout',
    'utils/Core',
    'ojs/ojarraydataprovider',
    'ojs/ojarraytreedataprovider',
    'utils/Service',
    'ojs/ojcorerouter',
    'ojs/ojknockoutrouteradapter',
    'ojs/ojurlparamadapter',
    'ojs/ojmodulerouter-adapter',
    'ojs/ojknockout-keyset',

    'login-page/loader',
    'ojs/ojinputtext',
    'ojs/ojbutton',
    'ojs/ojformlayout',
    'ojs/ojknockout',
    'ojs/ojmessages',
    'ojs/ojnavigationlist',
    'ojs/ojmodule-element',
    'oj-c/button',
    'ojs/ojbutton',
    'ojs/ojpopup',
    'ojs/ojselector',
    'oj-c/list-item-layout',
    'ojs/ojlistview',
    'oj-c/select-single',
    'ojs/ojselectsingle',
    'ojs/ojlistitemlayout',
    'ojs/ojprogress-circle',
], function (
    Translations,
    Context,
    ResponsiveUtils,
    ResponsiveKnockoutUtils,
    ko,
    core,
    ArrayDataProvider,
    ArrayTreeDataProvider,
    serviceUtils,
    CoreRouter,
    KnockoutRouterAdapter,
    UrlParamAdapter,
    ModuleRouterAdapter,
    ojknockout_keyset_1
) {
    const _t = Translations.getTranslatedString;
    class ControllerViewModel {
        // Media queries for responsive layouts
        //"host": "185.4.85.73",
        constructor() {
            this.inLoginProcess = ko.observable(false);
            this.loggedIn = ko.observable(false);
            this.userLogin = ko.observable();
            const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
            this.loginPage = document.getElementById('login-page');
            this.header = document.querySelector('.main-header');
            this.footer = document.getElementsByTagName('footer')[0];
            this.mainMenu = document.querySelector('.nav-list-container');
            this.flagIcon = document.getElementById('flagIcon');
            this.appContainer = document.querySelector('#app-container');
            let sessionLang = localStorage.getItem('appLanguage');
            this.bankName = ko.observable('مصرف التسليف');
            if (sessionLang != 'ar-SY') sessionLang = 'en-us';
            this.languageValue = ko.observable(sessionLang);

            this.loggedIn.subscribe((value) => {
                if (value) this.mainMenu.style.visibility = 'visible';
                else this.mainMenu.style.visibility = 'hidden';
            });

            this._initAlL_Labels();
            this._initAllObservables();
            this._initNotifications();
            this._initAllVariables();
            this._initAllEventListeners();
            if (this.loggedIn()) this._checkLoggedIn();
            else this._logout();
            document.title = core.generateTitle();
        }
    }

    /**
     * @function _initAllObservables
     * @description initialize all observables
     */

    ControllerViewModel.prototype._initAllObservables = function () {
        this.navSelection = ko.observable(null);
        this.currItem = ko.observable(null);
        this.currPath = ko.observable('');
        this.currPath.subscribe((value) => {
            const toolButtons = document.getElementById('_oj-tool-buttons-container');
            if (toolButtons) {
                if (value == '') {
                    toolButtons.classList.remove('show');
                    toolButtons.classList.add('hide');
                } else {
                    toolButtons.classList.remove('hide');
                    toolButtons.classList.add('show');
                }
            }
        });
        this.languageDataProvider = new ArrayDataProvider(
            [
                { id: 'ar-SY', label: 'العربية-سورية' },
                { id: 'en-us', label: 'English-UK' },
            ],
            { keyAttributes: 'id' }
        );
        this.languageValue.subscribe(async (newValue) => {
            this._setLanguage(newValue);
            localStorage.setItem('appLanguage', newValue);
            window.location.reload();
        });

        this.atHorizontal = ko.computed(function () {
            if (document.dir == 'rtl') return 'start';
            else return 'end';
        });
        this.myHorizontal = ko.computed(function () {
            if (document.dir == 'rtl') return 'end';
            else return 'start';
        });
        this.onlyIcons = ko.observable(false);
        this.onlyIcons.subscribe((newValue) => {
            if (newValue) {
                this.mainMenu.style.minWidth = '5%';
                this.mainMenu.style.width = '5%';
                this.appContainer.style.width = '94.6%';
                // this.appContainer.style.width = '100%';
            } else {
                this.mainMenu.style.width = '14.99%';
                this.appContainer.style.width = '84.5%';
            }
        });

        this.messagesDataProvider = ko.observable([]);

        this.messagePosition = {
            my: { vertical: 'top', horizontal: 'end' },
            at: { vertical: 'top', horizontal: 'end' },
            of: 'window',
            offset: {
                y: '100px',
                x: '100px',
            },
        };
        this.menuDataProvider = ko.observable(null);
        this.token = ko.observable();
        if (localStorage.getItem('user')) {
            this.userLogin(localStorage.getItem('user'));
            this.loggedIn(true);
            this.header.classList.remove('no-visible');
        }
    };

    /**
     * @function _initAllVariables
     * @description initialize all variables
     */

    ControllerViewModel.prototype._initAllVariables = function () {
        let navData = [
            { path: '', redirect: '' },
            { path: 'departments', detail: { label: _t('router.departments'), iconClass: 'oj-ux-ico-contact-group' } },
            {
                path: 'departmentsForm',
                detail: { label: _t('router.departmentsForm'), iconClass: 'oj-ux-ico-contact-group' },
            },
            { path: 'books', detail: { label: _t('router.books'), iconClass: 'oj-ux-ico-book' } },
            {
                path: 'managers',
                detail: { label: _t('router.managers'), iconClass: 'oj-ux-ico-cash-management-overview' },
            },
            { path: 'accTree', detail: { label: _t('router.accTree'), iconClass: 'oj-ux-ico-tree-view' } },
            { path: 'openAccount', detail: { label: _t('router.openAccount'), iconClass: 'oj-ux-ico-account' } },
            {
                path: 'SalaryLocalization',
                detail: { label: _t('router.SalaryLocalization'), iconClass: 'oj-ux-ico-account' },
            },
            { path: 'TermDeposit', detail: { label: _t('router.TermDeposit'), iconClass: 'oj-ux-ico-account' } },
            {
                path: 'TermDepositWithPreBenefit',
                detail: { label: _t('router.TermDepositWithPreBenefit'), iconClass: 'oj-ux-ico-account' },
            },
            { path: 'pullDepositFor', detail: { label: _t('router.pullDepositFor'), iconClass: 'oj-ux-ico-account' } },
            {
                path: 'freezeTermDeposit',
                detail: { label: _t('router.freezeTermDeposit'), iconClass: 'oj-ux-ico-account' },
            },
            {
                path: 'unFreezeTermDeposit',
                detail: { label: _t('router.unFreezeTermDeposit'), iconClass: 'oj-ux-ico-account' },
            },
            {
                path: 'registerTermDepositCliRel',
                detail: { label: _t('router.registerTermDepositCliRel'), iconClass: 'oj-ux-ico-account' },
            },
            {
                path: 'cancelTermDepositCliRel',
                detail: { label: _t('router.cancelTermDepositCliRel'), iconClass: 'oj-ux-ico-account' },
            },
            {
                path: 'modifyTermDeposit',
                detail: { label: _t('router.modifyTermDeposit'), iconClass: 'oj-ux-ico-account' },
            },
            {
                path: 'procOfTermDeposits',
                detail: { label: _t('router.procOfTermDeposits'), iconClass: 'oj-ux-ico-account' },
            },
            {
                path: 'procUnpaidTermDeposit',
                detail: { label: _t('router.procUnpaidTermDeposit'), iconClass: 'oj-ux-ico-account' },
            },
            { path: 'progLoading', detail: { label: _t('router.progLoading'), iconClass: 'oj-ux-ico-account' } },
            { path: 'about', detail: { label: _t('router.about'), iconClass: 'oj-ux-ico-information-s' } },
            { path: 'help', detail: { label: _t('router.help'), iconClass: 'oj-ux-ico-help' } },
            { path: 'reports', detail: { label: _t('router.reports'), iconClass: 'oj-ux-ico-report' } },
            {
                path: 'definingInterestRates',
                detail: { label: _t('router.definingInterestRates'), iconClass: 'oj-ux-ico-report' },
            },
            {
                path: 'linkingCommissionsToInterest',
                detail: { label: _t('router.linkingCommissionsToInterest'), iconClass: 'oj-ux-ico-report' },
            },
            {
                path: 'definingAccountAttributes',
                detail: { label: _t('router.definingAccountAttributes'), iconClass: 'oj-ux-ico-report' },
            },
            {
                path: 'changePass',
                detail: { label: _t('router.changePass'), iconClass: ' oj-ux-ico-text-input-password' },
            },
            { path: 'internalOutTrans', detail: { label: 'internalOutTrans', iconClass: 'oj-ux-ico-fire' } },

            {
                path: 'definingInterestRates',
                detail: { label: _t('router.definingInterestRates'), iconClass: 'oj-ux-ico-report' },
            },
            {
                path: 'linkingCommissionsToInterest',
                detail: { label: _t('router.linkingCommissionsToInterest'), iconClass: 'oj-ux-ico-report' },
            },
            {
                path: 'definingAccountAttributes',
                detail: { label: _t('router.definingAccountAttributes'), iconClass: 'oj-ux-ico-report' },
            },
        ];
        //
        // Router setup
        this.router = new CoreRouter(navData, {
            urlAdapter: new UrlParamAdapter(),
        });

        this.selection = new KnockoutRouterAdapter(this.router);

        this.router.sync();

        this.moduleAdapter = new ModuleRouterAdapter(this.router);

        // Setup the navDataProvider with the routes, excluding the first redirected
        // route.
        this.navDataProvider = new ArrayDataProvider(navData.slice(0), { keyAttributes: 'path' });
        // Footer
        this.footerLinks = [
            {
                name: _t('contacts.about_us'),
                linkId: 'aboutInfosys',
                linkTarget: 'http://localhost:8000/?ojr=about',
                // linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about',
            },
            {
                name: _t('contacts.contact_us'),
                id: 'contactUs',
                linkTarget: 'http://www.oracle.com/us/corporate/contact/index.html',
            },
            {
                name: _t('contacts.legal_notices'),
                id: 'legalNotices',
                linkTarget: 'http://www.oracle.com/us/legal/index.html',
            },
            {
                name: _t('contacts.terms_of_use'),
                id: 'termsOfUse',
                linkTarget: 'http://www.oracle.com/us/legal/terms/index.html',
            },
            {
                name: _t('contacts.privacy_rights'),
                id: 'yourPrivacyRights',
                linkTarget: 'http://www.oracle.com/us/legal/privacy/index.html',
            },
        ];
    };

    /**
     * @function _initAlL_Labels
     * @description
     */

    ControllerViewModel.prototype._initAlL_Labels = function () {
        this.notificationLabel = _t('labels.notification');
        this.preferences = _t('menus.pref');
        this.help = _t('menus.help');
        this.about = _t('menus.about');
        this.signOut = _t('menus.out');
        this.CopyrightS = _t('contacts.Copyrights');
        this.appTitle = _t('application.title');
        this.languageLabel = _t('inputs.language');
        this.actionLabel = _t('buttons.action');
        this.changePasswordLabel = _t('buttons.changePassword');
        this.homeLabel = _t('titles.home');
        this.blackListLabel = _t('labels.blackList');
        this.noteLabel = _t('inputs.note');
        this.relatedDocumentsLabel = _t('buttons.relatedDocuments');
        this.archivedDocumentsLabel = _t('buttons.archivedDocuments');
        this.executingClientLabel = _t('buttons.executingClient');
    };

    /**
     * @function _initAllEventListeners
     * @description initialize all events
     */

    ControllerViewModel.prototype._initAllEventListeners = function () {
        this.goHome = () => {
            this.router.go({ path: '' });
            this.currPath('');
            this.navSelection(null);
            this.currItem(null);
        };
        this.footerListener = (event, data, bindingContext) => {
            switch (data.data.linkId) {
                case 'aboutInfosys':
                    this.handleAbout();
                    break;

                default:
                    break;
            }
            return !this.loggedIn();
        };
        this.handleChangePassword = () => {
            this.router.go({ path: 'changePass' });
            this.openUserPlate();
        };

        this.handleSignOut = () => {
            this._logout();
        };
        this.handleAbout = () => {
            this.router.go({ path: 'about' });
            this.openUserPlate();
        };
        this.handleHelp = () => {
            this.router.go({ path: 'help' });
            this.openUserPlate();
        };
        this.openUserPlate = () => {
            const popup = document.getElementById('userPlate');
            if (popup.isOpen()) {
                popup.close();
            } else {
                popup.open();
                popup.style.top = '60px';
                setTimeout(() => {
                    popup.style.top = '60px';
                }, 540);
            }
        };

        this.openNotifications = () => {
            let popup = document.getElementById('popupNotifications');
            popup.open('#btnNotifications');
        };

        this.handleMainMenuButtonClicked = () => {
            const isVisible = this.onlyIcons();
            this.onlyIcons(!isVisible);
        };

        this.handleLogin = async (event) => {
            // this.loginPage.addEventListener('loginCallback', (event) => {
            this.header.classList.remove('no-visible');
            if (event.detail.userLogin && event.detail.userPassword) {
                let loginCommand = {
                    params: [],
                    indent: 'LOGIN',
                };
                loginCommand.params.push({
                    name: 'USER',
                    data_type: 'string',
                    value: event.detail.userLogin,
                });
                loginCommand.params.push({
                    name: 'PASS',
                    data_type: 'string',
                    value: event.detail.userPassword,
                });
                Promise.all([serviceUtils.ajaxSendRequest('getUserLogin', loginCommand)])
                    .then(
                        await async function (values) {
                            this.inLoginProcess(true);
                            if (values.length > 0) {
                                let currSession;
                                try {
                                    currSession = core.parseJSON(values[0]);
                                    this.token(currSession.token);
                                    localStorage.setItem('token', currSession.token);
                                    if (currSession.token) {
                                        this._initHomePage(JSON.stringify(currSession.main_menu));
                                        this.userLogin(event.detail.userLogin);
                                        this.loggedIn(true);
                                        this.header.classList.remove('no-visible');
                                        localStorage.setItem('user', event.detail.userLogin);
                                        window.location.reload();
                                    } else {
                                        this.loggedIn(false);
                                        this.header.style.minWidth = '99.8%';
                                        this.header.classList.add('oj-panel');
                                        this.header.classList.add('no-visible');
                                        localStorage.clear();
                                        this._showMessage('error', _t('messages.loginError'));
                                    }
                                    this.inLoginProcess(false);
                                    return true;
                                } catch (error) {
                                    this.inLoginProcess(false);
                                    this._showMessage('error', _t('messages.loginError'));
                                }
                            }
                        }.bind(this)
                    )
                    .catch(
                        function (reason) {
                            this.inLoginProcess(false);
                            this._showMessage('error', _t('messages.callFailed'));
                            localStorage.clear();
                        }.bind(this)
                    );
            }
        };

        this.animationCallback = (context) => {
            // Initial animation
            if (!context.previousViewModel) return 'fade';
            // Animate transitions based on state index
            return this.states[context.previousState.path] < this.states[context.state.path] ? 'pushEnd' : 'pushStart';
        };
        this.handleCollapseAction = (event) => {
            this.router.go({ path: '' });
            this.currPath('');
        };

        this.handleSelectionAction = (event) => {
            if (event) {
                this.currPath(event.detail.value);

                switch (event.detail.value) {
                    case 'departments':
                        this.router.go({ path: 'departments' });
                        break;
                    case 'departmentsForm':
                        this.router.go({ path: 'departmentsForm' });
                        break;
                    case 'books':
                        this.router.go({ path: 'books' });
                        break;
                    case 'managers':
                        this.router.go({ path: 'managers' });
                        break;
                    case 'accTree':
                        this.router.go({ path: 'accTree' });
                        //this.router.go({ path: 'openAccount', params: { router: this.router } });pullDepositFor
                        break;
                    case 'openSAccount':
                        this.router.go({
                            path: 'openAccount',
                            params: { current: event.detail.value, oppFlag: 2, subSystem: 3, funcCode: 2 },
                        });
                        break;
                    case 'openSAccountWithInterest':
                        this.router.go({
                            path: 'openAccount',
                            params: { current: event.detail.value, oppFlag: 1, subSystem: 3, funcCode: 2 },
                        });
                        break;
                    case 'openCAccount':
                        this.router.go({
                            path: 'openAccount',
                            params: { current: event.detail.value, oppFlag: 2, subSystem: 2, funcCode: 2 },
                        });
                        break;
                    case 'openCAccountWithInterest':
                        //  this.router.go({ path: 'openAccount' });
                        this.router.go({
                            path: 'openAccount',
                            params: { current: event.detail.value, oppFlag: 1, subSystem: 2, funcCode: 1 },
                        });
                        break;
                    case 'SalaryLocalization':
                        this.router.go({ path: 'SalaryLocalization' });
                        //this.router.go({ path: 'openAccount', params: { router: this.router } });
                        break;
                    case 'TermDeposit':
                        this.router.go({ path: 'TermDeposit' });
                        break;
                    case 'TermDepositWithPreBenefit':
                        this.router.go({ path: 'TermDepositWithPreBenefit' });
                        break;
                    case 'pullDepositFor':
                        this.router.go({ path: 'pullDepositFor' });
                        break;
                    case 'freezeTermDeposit':
                        this.router.go({ path: 'freezeTermDeposit' });
                        break;
                    case 'unFreezeTermDeposit':
                        this.router.go({ path: 'unFreezeTermDeposit' });
                        break;
                    case 'registerTermDepositCliRel':
                        this.router.go({ path: 'registerTermDepositCliRel' });
                        break;
                    case 'cancelTermDepositCliRel':
                        this.router.go({ path: 'cancelTermDepositCliRel' });
                        break;
                    case 'modifyTermDeposit':
                        this.router.go({ path: 'modifyTermDeposit' });
                        break;
                    case 'procOfTermDeposits':
                        this.router.go({ path: 'procOfTermDeposits' });
                        break;
                    case 'procUnpaidTermDeposit':
                        this.router.go({ path: 'procUnpaidTermDeposit' });
                        break;
                    case 'definingInterestRates':
                        this.router.go({ path: 'definingInterestRates' });
                        break;
                    case 'linkingCommissionsToInterest':
                        this.router.go({ path: 'linkingCommissionsToInterest' });
                        break;
                    case 'definingAccountAttributes':
                        this.router.go({ path: 'definingAccountAttributes' });
                        break;
                    case 'progLoading':
                        this.router.go({ path: 'progLoading' });
                        break;
                    case 'news1':
                        this.router.go({ path: 'reports' });
                        break;
                    case 'internalOutTrans':
                        this.router.go({ path: 'internalOutTrans' });
                        break;
                    case 'definingInterestRates':
                        this.router.go({ path: 'definingInterestRates' });
                        break;
                    case 'linkingCommissionsToInterest':
                        this.router.go({ path: 'linkingCommissionsToInterest' });
                        break;
                    case 'definingAccountAttributes':
                        this.router.go({ path: 'definingAccountAttributes' });
                        break;
                    default:
                        this.router.go({ path: '' });
                        this.currPath('');
                        break;
                }
            }
        };
    };

    /**
     * @function _logout
     * @description
     */

    ControllerViewModel.prototype._logout = function () {
        let logoutCommand = {
            token: localStorage.getItem('token'),
        };
        serviceUtils.ajaxSendRequest('logout', logoutCommand);
        this.router.go({ path: '' });
        this.userLogin(null);
        this.loggedIn(false);
        this.header.style.minWidth = '99.8%';
        this.header.classList.add('oj-panel');
        this.menuDataProvider(new ArrayTreeDataProvider([], { keyAttributes: 'id' }));
        this.selection.path(null);
        localStorage.clear();
        sessionStorage.clear();
        this.footer.classList.add('main-footer');
        localStorage.setItem('appLanguage', this.languageValue());
    };

    /**
     * @function _showMessage
     * @description display the message
     *  @param severity string
     *  @param detail string
     *
     */

    ControllerViewModel.prototype._showMessage = function (severity, detail) {
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

    /**
     * @function _initHomePage
     * @description
     */

    ControllerViewModel.prototype._initHomePage = function (data) {
        let menuData = core.parseJSON(data);
        this.menuDataProvider(new ArrayTreeDataProvider(menuData, { keyAttributes: 'id' }));
        this.selection.path('');
        this.header.style.minWidth = '99.8%';
        this.header.classList.remove('oj-panel');
        localStorage.setItem('main_menu', data);
        this.footer.classList.remove('main-footer');
    };

    ControllerViewModel.prototype._checkLoggedIn = function () {
        let tokenCommand = {
            token: localStorage.getItem('token'),
        };
        Promise.all([serviceUtils.ajaxSendRequest('getToken', tokenCommand)])
            .then(
                function (values) {
                    if (values.length > 0) {
                        let data;
                        try {
                            data = core.parseJSON(values[0]);
                            if (data.error == 'success') {
                                this.token(localStorage.getItem('token'));
                                this.userLogin(localStorage.getItem('user'));
                                this.loggedIn(true);
                                this.header.classList.remove('no-visible');
                                this.inLoginProcess(false);
                                let mainMenuStr = localStorage.getItem('main_menu');
                                if (mainMenuStr) this._initHomePage(mainMenuStr);
                                else {
                                    this.header.classList.add('oj-panel');
                                    this.header.classList.add('no-visible');
                                    this.header.style.minWidth = '99.8%';
                                }
                            } else {
                                this._logout();
                            }
                            return true;
                        } catch (error) {
                            console.log(error);
                            this._logout();
                        }
                    }
                }.bind(this)
            )
            .catch(
                function (reason) {
                    console.log(reason);
                    this._logout();
                }.bind(this)
            );
    };

    ControllerViewModel.prototype._initNotifications = function () {
        this.notificationCounter = ko.observable(3);
        this.data1 = [
            {
                id: 'id1',
                title: 'العنوان',
                defaultSlot: 'مقطع الخط العلوي يعطي إمكانيةاقتطاع النص إذا كان النص طويلًا جدًا مثل هذا.',
                descriptions: 'يوجد عمليات مسجلة يرجى تثبيتها',
                secondarySlot: 'المقطع الثانوي كذلك يعطي إمكانية اقتطاع النص عندما يصبح  النص طويلًا جدًا.',
            },
            {
                id: 'id2',
                title: 'العنوان',
                defaultSlot: 'مقطع الخط العلوي يعطي إمكانيةاقتطاع النص إذا كان النص طويلًا جدًا مثل هذا.',
                descriptions: 'تنفيذ عملية القيد المعاكس لقيد مؤونات فوائد الحسابات.',
                secondarySlot: 'المقطع الثانوي كذلك يعطي إمكانية اقتطاع النص عندما يصبح  النص طويلًا جدًا.',
            },

            {
                id: 'id3',
                title: 'العنوان',
                defaultSlot: 'مقطع الخط العلوي يعطي إمكانية اقتطاع النص إذا كان النص طويلًا جدًا مثل هذا.',
                descriptions: 'حساب جارية انتهى تاريخ تجميدها .',
                secondarySlot: 'المقطع الثانوي كذلك يعطي إمكانية اقتطاع النص عندما يصبح  النص طويلًا جدًا.',
            },
        ];
        this.dataProviderNotifications = new ArrayDataProvider(this.data1, {
            keyAttributes: 'id',
        });

        this.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
    };

    ControllerViewModel.prototype._setLanguage = (value) => {
        if (value == 'ar-SY') {
            document.dir = 'rtl';
        } else {
            document.dir = 'ltr';
        }
        // this.flagIcon.style.display = 'none';
        // this.flagIcon.style.display = 'inline';
    };

    // release the application bootstrap busy state
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();

    return new ControllerViewModel();
});
