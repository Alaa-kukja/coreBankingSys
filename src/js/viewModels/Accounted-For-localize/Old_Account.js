define([
    'ojs/ojtranslation',
    'knockout',

    'ojs/ojlabelvalue',
    'ojs/ojlabel',
    'ojs/ojinputtext',
    'ojs/ojinputnumber',
    'ojs/ojbutton',
    'ojs/ojformlayout',
], function (Translations, ko) {
    const _t = Translations.getTranslatedString;

    function OldAccountViewModel(param) {
        const { router } = param;
        this.router = router;

        this._initAllLabels();
        this._initAllObservables();
        this._initAllActions();
    }

    OldAccountViewModel.prototype._initAllLabels = function () {
        this.accNameLabel = _t('inputs.accName');
        this.accNumLabel = _t('inputs.accNumber');

        this.acceptButton = _t('buttons.apply');
        this.cancelButton = _t('buttons.cancel');
    };

    OldAccountViewModel.prototype._initAllObservables = function () {
        this.accName = ko.observable(' ');
        this.accNum = ko.observable(null);
    };

    OldAccountViewModel.prototype._initAllActions = function () {
        this.acceptAction = () => {};
        this.cancelAction = () => {};
    };
    return OldAccountViewModel;
});
