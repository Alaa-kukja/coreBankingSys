//
//
//

define([
    'ojs/ojtranslation',
    'knockout',
    'ojs/ojasyncvalidator-length',
    'ojs/ojasyncvalidator-regexp',
    'ojs/ojasyncvalidator-datetimerange',
    'ojs/ojconverterutils-i18n',
], function (
    Translations,
    ko,
    AsyncLengthValidator,
    AsyncRegExpValidator,
    AsyncDateTimeRangeValidator,
    ojconverterutils_i18n_1
) {
    const _t = Translations.getTranslatedString;

    class SilentLengthValidator extends AsyncLengthValidator {
        constructor(options) {
            super(options);
            this.options = options;
        }
        get hint() {
            return '';
        }
    }

    class CoreUtils {
        /**
         *@description A singleton to hold the variable
         * generates an unique id by calling the generate Unique
         * @returns The existing instance.
         */

        constructor() {
            if (!CoreUtils.instance) {
                this.counter = 0;
                CoreUtils.instance = this;
                this._initValidators();
                return CoreUtils.instance;
            }
        }

        /**
         * @function generateUniqueId
         * @description Generates an unique ID.
         * @returns An unique ID based on a internal counter.
         */
        generateUniqueId() {
            return `uid-${this.counter++}`;
        }
        /**
         * @function parseJSON
         * @param value string
         * @description if sting is valid json then return object else return error object.
         * @returns Object
         */

        parseJSON(value) {
            try {
                if (value == '[object Object]') {
                    return { error: 'Error :not valid json', console: 'Not valid json' };
                } else {
                    const n =
                        (value.startsWith('{') && value.endsWith('}')) ||
                        (value.startsWith('[') && value.endsWith(']'));
                    if (!n) return { error: 'Error :not valid json', console: 'Not valid json' };
                    else return JSON.parse(value);
                }
            } catch (e) {
                return { error: 'Error :not valid json', console: value };
            }
        }

        loadExternalLibrary(file) {
            let library = document.createElement('script');
            // set the type attribute
            library.type = 'application/javascript';
            // make the script element load file
            library.src = file;
            // finally insert the element to the body element in order to load the script
            document.body.appendChild(library);
            return library;
        }

        /**
         * @function csvToJsonArray
         * @param csv string
         * @description if sting is valid csv then return object else return error object.
         * @returns Object
         */

        csvToJsonArray(csv, comma) {
            const lines = csv.split('\n');
            const result = [];
            const headers = lines[0].split(comma);
            //headers.splice(headers.length -1,1);
            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                if (lines[i].trim() != '') {
                    const currentLine = lines[i].split(comma);

                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentLine[j];
                    }
                    result.push(obj);
                }
            }
            return result;
            // return JSON.stringify(result); //JSON
        }

        /**
         * @function generateTitle
         * @description Generates an unique ID.
         * @returns String title.
         */
        generateTitle(subTitle) {
            if (subTitle) return `${_t('application.name')}[${_t(subTitle)}]`;
            else return _t('application.name');
        }

        /**
         * @function _checkValidationGroup
         * @param id integer
         * @description show messages on all the components that are invalidHidden, i.e., the required fields that the user has yet to fill out.
         * @returns boolean
         */

        _checkValidationGroup(id) {
            const tracker = document.getElementById(id);
            if (tracker.valid === 'valid') {
                return true;
            } else {
                tracker.showMessages();
                Context.getPageContext()
                    .getBusyContext()
                    .whenReady()
                    .then(() => tracker.focusOn('@firstInvalidShown'));
                return false;
            }
        }
    }

    CoreUtils.prototype.changeLanguage = (languageCode) => {
        Array.from(document.getElementsByClassName('lang')).forEach(function (elem) {
            if (elem.classList.contains('lang-' + languageCode)) {
                elem.style.display = 'initial';
            } else {
                elem.style.display = 'none';
            }
        });
    };

    CoreUtils.prototype._changeLanguage = function (languageCode) {
        const selector = document.getElementById('langSelector');
        selector.addEventListener('change', function (evt) {
            changeLanguage(this.value);
        });

        // detect initial browser language
        const lang = navigator.userLanguage || navigator.language || 'en-us';
        const startLang =
            Array.from(selector.options)
                .map((opt) => opt.value)
                .find((val) => lang.includes(val)) || 'en';
        this.changeLanguage(startLang);

        // updating select with start value
        selector.selectedIndex = Array.from(selector.options)
            .map((opt) => opt.value)
            .indexOf(startLang);

        // fill "The selected language is:"
        document.getElementById('browserLang').innerText = lang;
        document.getElementById('startLang').innerText = startLang;
    };

    CoreUtils.prototype._initValidators = function () {
        this.emailValidator = ko.observableArray([
            new AsyncRegExpValidator({
                pattern:
                    "[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*",
                hint: _t('Validators.email.hint'),
                messageDetail: _t('Validators.email.messageDetail'),
            }),
        ]);

        this.mobileValidator = [
            new AsyncRegExpValidator({
                pattern: '^(09[3-9][0-9]{7})$',
                label: _t('Validators.mobile.label'),
                hint: _t('Validators.mobile.hint'),
                messageSummary: `{label} ${_t('Validators.unAcceptable')}`,
                messageDetail: `{label} ${_t('Validators.unAcceptable')}`,
            }),
        ];

        this.phoneValidator = [
            new AsyncRegExpValidator({
                //pattern:'^0(11|21|31|41|33|14|15|16)\d{7}$',
                pattern: '^(0[1-9][1-9][0-9]{6,7})$',
                label: _t('Validators.phone.label'),
                hint: _t('Validators.phone.hint'),
                messageSummary: `{label} ${_t('Validators.unAcceptable')}`,
                messageDetail: `{label} ${_t('Validators.unAcceptable')}`,
            }),
        ];

        this.pNameValidators = ko.observableArray([
            new SilentLengthValidator({
                min: 2,
                max: 30,
                hint: {
                    inRange: '',
                },
                // hint: {
                //     inRange: _t('Validators.firstName.hint_inRange', '{min}', '{max}'),
                // },
                messageSummary: {
                    tooLong: _t('Validators.firstName.messageSummary_tooLong'),
                    tooShort: _t('Validators.firstName.messageSummary_tooShort'),
                },
                messageDetail: {
                    tooLong: _t('Validators.firstName.messageDetail_tooLong', '{max}'),
                    tooShort: _t('Validators.firstName.messageDetail_tooShort', '{min}'),
                },
            }),

            new AsyncRegExpValidator({
                pattern: '^[a-zA-Z ءآأؤإئابةتثجحخدذرزسشصضطظعغـفقكلمنهوىي ً ٌ ٍ َ ُ ِ ّ ْٹپچڈڑژکگںھ]+$',
                // hint: _t('Validators.name.hint'),
                messageDetail: _t('Validators.name.messageDetail'),
            }),
        ]);

        this.cNameValidators = ko.observableArray([
            new SilentLengthValidator({
                min: 2,
                max: 30,
                hint: {
                    inRange: '',
                },
                // hint: {
                //     inRange: _t('Validators.firstName.hint_inRange', '{min}', '{max}'),
                // },
                messageSummary: {
                    tooLong: _t('Validators.firstName.messageSummary_tooLong'),
                    tooShort: _t('Validators.firstName.messageSummary_tooShort'),
                },
                messageDetail: {
                    tooLong: _t('Validators.firstName.messageDetail_tooLong', '{max}'),
                    tooShort: _t('Validators.firstName.messageDetail_tooShort', '{min}'),
                },
            }),

            new AsyncRegExpValidator({
                pattern: '^[a-zA-Z0..9 ءآأؤإئابةتثجحخدذرزسشصضطظعغـفقكلمنهوىي ً ٌ ٍ َ ُ ِ ّ ْٹپچڈڑژکگںھ]+$',
                // hint: _t('Validators.name.hint'),
                messageDetail: _t('Validators.name.messageDetail'),
            }),
        ]);

        this.nationalNoValidator = [
            new AsyncRegExpValidator({
                pattern: '^([0-9][0-9]{10})$',
                label: _t('Validators.nationalNo.label'),
                hint: _t('Validators.nationalNo.hint'),
                messageSummary: `{label} ${_t('Validators.unAcceptable')}`,
                messageDetail: `{label} ${_t('Validators.unAcceptable')}`,
            }),
        ];

        this.minDate = ko.observable(
            ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date('1900-01-01'))
        );
        this.maxDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date()));

        const dateValidatorMessage = `${_t('Validators.birthday.hint_inRange')} ${this.minDate()} ${_t(
            'labels.and'
        )} ${this.maxDate()}`;
        this.dateValidator = [
            new AsyncDateTimeRangeValidator({
                min: this.minDate(),
                max: this.maxDate(),
                hint: {
                    inRange: dateValidatorMessage,
                    min: this.minDate(),
                    max: this.maxDate(),
                },
                messageDetail: {
                    rangeUnderflow: `${_t('labels.date')} ${_t('Validators.unAcceptable')}`,
                    rangeOverflow: `${_t('labels.date')} ${_t('Validators.unAcceptable')}`,
                },
            }),
        ];
    };

    // creating instance
    const instance = new CoreUtils();
    return instance;
});
