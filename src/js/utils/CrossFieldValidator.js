//
//
//
define([], function (options) {
    class CrossFieldValidator {
        constructor(options) {
            /**
             * If the value of base observable matches baseTriggerValue,
             * then the valueOnDependent cannot be empty.
             *
             * @param {Object} valueOnDependent current value of the dependent
             * observable
             * @returns {boolean|null}
             * @throws ValidationError when validation fails
             */
            this.validate = (valueOnDependent) => {
                let summary,
                    detail,
                    params,
                    validatorOptions = this._options;
                if (validatorOptions) {
                    let baseObs = validatorOptions['base'];
                    if (baseObs) {
                        let baseValue = ko.utils.unwrapObservable(baseObs);
                        let triggerValue = validatorOptions['baseTriggerValue'];
                        // if baseValue matches the triggerValue and value on
                        // dependent observable is empty
                        // throw error
                        if (triggerValue && baseValue && triggerValue === baseValue && !valueOnDependent) {
                            params = { label: validatorOptions['label'] };
                            summary = Translations.applyParameters(
                                bundle['app']['validator-crossField']['summary'],
                                params
                            );
                            detail = Translations.applyParameters(
                                bundle['app']['validator-crossField']['detail'],
                                params
                            );
                            // throw an error duck typing Message
                            throw { summary: summary, detail: detail };
                        }
                    }
                }
                return true;
            };
            this._options = options;
        }
    }
    return new CrossFieldValidator(options);
});
