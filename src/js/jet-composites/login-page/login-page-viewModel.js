define(['ojs/ojtranslation', 'knockout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojformlayout'], function (
    Translations,
    ko
) {
    const _t = Translations.getTranslatedString;
    function loginPageViewModel(context) {
        let element = context.element;
        let LoginButton;

        this.connected = function () {
            LoginButton = element.querySelector('.oj-login-button');
            LoginButton.addEventListener('ojAction', login);
        };

        let login = function (event) {
            let params = {
                detail: { userLogin: this.userLogin(), userPassword: this.userPassword() },
            };
            element.dispatchEvent(new CustomEvent('login', params));
        }.bind(this);

        this._initAllObservable();
        this._initAlL_Labels();
    }

    /**
     * @function _initAllObservable
     * @description
     */

    loginPageViewModel.prototype._initAllObservable = async function () {
        this.userLogin = ko.observable(null);
        this.userPassword = ko.observable(null);
    };

    /**
     * @function _initAlL_Labels
     * @description
     */

    loginPageViewModel.prototype._initAlL_Labels = function () {
        this.userNameLabel = _t('inputs.userName');
        this.passwordLabel = _t('inputs.password');
        this.loginLabel = _t('buttons.login');
        this.loginHint = _t('buttons.login');
        this.appName = _t('application.name');
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return loginPageViewModel;
});
