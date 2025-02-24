define([
    'ojs/ojtranslation',
    'knockout',
    'utils/Core',
    'utils/Tafqeet',
    'ojs/ojarraydataprovider',
    'ojs/ojasyncvalidator-numberrange',
    'ojs/ojconverter-number',
    'ojs/ojkeyset',
    'ojs/ojmodule-element-utils',
    'utils/Service',
    'utils/CommonData',
    'ojs/ojbufferingdataprovider',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'ojs/ojmutablearraydataprovider',

    'ojs/ojselectsingle',
    'ojs/ojformlayout',
    'ojs/ojinputtext',
    'ojs/ojlabelvalue',
    'ojs/ojdatetimepicker',
    'ojs/ojinputnumber',
    'ojs/ojcheckboxset',
    'ojs/ojavatar',
    'ojs/ojknockout',
    'ojs/ojdialog',
    'ojs/ojtreeview',
    'ojs/ojradioset',
    'ojs/ojbutton',
    'ojs/ojtable',
    'oj-c/input-text',
    'oj-c/input-number',
    'oj-c/input-date-text',
    'oj-c/button',
    'oj-c/message-toast',
    'ojs/ojprogress-circle',
], function (
    Translations,
    ko,
    coreUtils,
    tafqeet,
    ArrayDataProvider,
    AsyncNumberRangeValidator,
    ojconverter_number_1,
    ojkeyset_1,
    moduleElementUtils,
    serviceUtils,
    commonData,
    BufferingDataProvider,
    responsiveUtils,
    responsiveKnockoutUtils,
    MutableArrayDataProvider
) {
    const _t = Translations.getTranslatedString;

    function ComponentTermDepositViewModel(context) {
        //console.log(context);
        this.connected = function () {
            console.log(context.element);
        };
        this._initAllIds();
        this._initAllLabels();
        this._initObservables(context);
        this._initAllVariables(context);
        this._initAllEvents(context);
    }

    ComponentTermDepositViewModel.prototype._initAllIds = async function () {
        //this.chooseInterestID = coreUtils.generateUniqueId();
        // this.idInterestCodeID = coreUtils.generateUniqueId();
        // this.interestRateID = coreUtils.generateUniqueId();
        // this.interestDescrID = coreUtils.generateUniqueId();
        // this.idInterestCodeID_2 = coreUtils.generateUniqueId();
        // this.interestRateID_2 = coreUtils.generateUniqueId();
        // this.interestDescrID_2 = coreUtils.generateUniqueId();
    };

    ComponentTermDepositViewModel.prototype._initAllLabels = function () {
        // Primary & Sub Numbers
        this.PrimNumberLabel = _t('labels.primNumber');
        this.SubNumberLabel = _t('labels.subNumber');
        // Sector & subsector & Year & month
        this.SectorLabel = _t('inputs.sector');
        this.Sub_sectorLabel = _t('inputs.subSector');
        this.yearLabel = _t('inputs.year');
        this.monthLabel = _t('inputs.month');

        this.firstAmountLabel = _t('inputs.firstAmount');
        // amount & amountInWriting
        this.amountLabel = _t('inputs.amount');
        this.amountInWritingLabel = _t('inputs.amountSpelling');

        this.depositAmountLabel = _t('inputs.depositAmount');

        //The Benefit & Rate & describtion & button for Benefits
        this.interestCodeLabel = _t('labels.code') + ' ' + _t('labels.interest');
        this.interestCodeLabel_2 = _t('labels.code') + ' ' + _t('labels.interest') + ' ' + _t('labels.new');
        this.interestRateLabel = _t('labels.herRate');
        this.interestDescrLabel = _t('labels.herDescr');
        // ////in Dialog
        // this.interestsAvailable = _t('labels.interestsAvailable');
        // this.acceptButton = _t('buttons.apply');
        // this.cancelButton = _t('buttons.cancel');
        // this.selectInterestLabel = _t('labels.select') + ' ' + _t('labels.interest');

        this.deservedInterestLabel = _t('labels.accruedInterest');
        //For Benefits
        this.accNoInterestLabel = _t('labels.accNo') + ' ' + _t('labels.interest');
        this.accNameInterestLabel = _t('labels.hisName');
        this.interestWhenDeserveItLabel = _t('labels.interestWhenDeserveIt');
        this.provisionsAmountLabel = _t('labels.provisionsAmount');

        // For Deposit Date
        this.firstDepositDateLabel = _t('labels.first') + ' ' + _t('labels.depositDate');
        this.depositDateLabel = _t('labels.depositDate');
        this.deserveDateLabel = _t('labels.rightDate');
        this.deservedDateLabel = _t('labels.DateOfDeserveIt');

        //For Deposit
        this.NumOfDepositLabel = _t('labels.accNo') + ' ' + _t('labels.deposit');
        this.NameDepositAccLabel = _t('labels.hisName');
        this.DateOfDeserveItLabel = _t('labels.DateOfDeserveIt');

        // For Account
        this.accNumberLabel = _t('inputs.accNumber');
        this.accNameLabel = _t('inputs.accName');

        // For Previous Benefit
        this.labelPreInterestVal = _t('labels.prepaidInterest');

        this.currentYearInterestLabel = _t('labels.currYearInterest_deposition');
        this.nextYearInterestLabel = _t('labels.nextYearInterest');
        this.sumOfInterestsLabel = _t('labels.sumOfInterests');

        this.incomeTaxLabel = _t('labels.incomeTax');
        this.localAdminLabel = _t('labels.localAdmin');
        this.reconstructLabel = _t('labels.reconstruct');
        this.sumOfDiscountsLabel = _t('labels.sumOf') + ' ' + _t('labels.discounts');
    };

    ComponentTermDepositViewModel.prototype._initObservables = function (context) {
        // Primary & Sub Numbers
        this.PrimNumberVal = ko.observable(null);
        this.SubNumberVal = ko.observable(null);
        // Sector & subSector & Year & month
        //this.sectors = commonData.sectors;
        //this.subSectors = commonData.subSectors;

        this.inputSectorValue = ko.observable(null);
        this.yearValue = ko.observable(null);
        this.monthValue = ko.observable(null);
        this.firstAmountVal = ko.observable(null);
        //amount & amountInWriting
        //console.log(document.getElementsByClassName('amount').value);
        this.amount = ko.observable();
        this.amountText = ko.computed(
            function () {
                return tafqeet._tafqeet(this.amount());
            }.bind(this)
        );

        this.depositAmountVal = ko.observable(null);
        //The Benefit & Rate & description & button for Benefits
        this.interestCodeValue = ko.observable(null);
        this.interestRateValue = ko.observable(null);
        this.interestDescrValue = ko.observable(null);

        this.interestCodeValue_2 = ko.observable(null);
        this.interestRateValue_2 = ko.observable(null);
        this.interestDescrValue_2 = ko.observable(null);
        // //////in Dialog
        // this.availableInterests = ko.observableArray([]);

        // this.selected_BA_Item = ko.observable({
        //     row: new ojkeyset_1.KeySetImpl(),
        // });
        // this.companies = ko.observableArray([]);

        // this.deservedInterestVal = ko.observable(null);

        // For Benefit-1
        this.accNoInterestVal1 = ko.observable(null);
        this.accNameInterestVal1 = ko.observable(null);
        this.interestWhenDeserveItVal = ko.observable(null);
        this.provisionsAmountVal1 = ko.observable(null);

        // For Deposit Date
        this.firstDepositDateVal = ko.observable(null);
        this.DepositDateVal = ko.observable(null);
        this.deserveDateVal = ko.observable(null);
        this.deservedDateVal = ko.observable(null);

        //For Deposit
        this.NumOfDepositVal = ko.observable(null);
        this.NameDepositAccVal = ko.observable(null);
        this.DateOfDeserveItVal = ko.observable(null);

        // this.NumOfDepositVal2 = ko.observable(null);
        // this.NameDepositAccVal2 = ko.observable(null);

        // For Account
        this.accNumberVal = ko.observable(null);
        this.accNameVal = ko.observable(null);

        // For Previous Benefit
        this.currentYearInterestVal = ko.observable(null);
        this.nextYearInterestVal = ko.observable(null);
        this.sumOfInterestsVal = ko.observable(null);

        this.incomeTaxVal = ko.observable(null);
        this.localAdminVal = ko.observable(null);
        this.reconstructVal = ko.observable(null);
        this.sumOfDiscountsVal = ko.observable(null);
    };

    ComponentTermDepositViewModel.prototype._initAllVariables = function (context) {
        this.numberRangeValidator = new AsyncNumberRangeValidator({
            min: 1,
            max: 900,
            hint: {
                inRange: 'Enter a value between {min} and {max}',
            },
            messageDetail: {
                rangeUnderflow: 'Number should be between be at least {min}',
            },
            converter: new ojconverter_number_1.IntlNumberConverter(),
        });
    };

    ComponentTermDepositViewModel.prototype._initAllEvents = function (context) {
        // /////in Dialog
        // this.handleSelectInterest = (eve) => {
        //     document.getElementById(this.chooseInterestID).open();
        // };
        // this.selectedChangedListener = (event) => {
        //     const interestWeSelected = Array.from(event.detail.value.row.keys.keys);
        //     this.interestCodeValue(interestWeSelected[0][0]);
        //     if (document.dir == 'rtl') this.interestRateValue(`%${interestWeSelected[0][1]}`);
        //     else this.interestRateValue(`${interestWeSelected[0][1]}%`);
        //     this.interestDescrValue(interestWeSelected[0][2]);
        // };
        // this.handleCancel = () => {
        //     this.interestCodeValue('');
        //     this.interestRateValue('');
        //     this.interestDescrValue('');
        //     let dialogID = `#${this.chooseInterestID}`;
        //     if (dialogID) document.querySelector(dialogID).close();
        // };
        // this.handleApply = () => {
        //     let dialogID = `#${this.chooseInterestID}`;
        //     if (dialogID) document.querySelector(dialogID).close();
        // };
    };

    return ComponentTermDepositViewModel;
});
