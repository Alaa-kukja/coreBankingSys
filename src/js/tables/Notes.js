//
//
//
define(['knockout'], function (ko) {
    class notes {
        /**
         *@description
         * @returns
         */

        constructor() {
            if (!notes.instance) {
                this.notesNo = ko.observable(null);
                this.descr = ko.observable(null);
                notes.instance = this;
                return notes.instance;
            }
        }

        fields() {
            const result = {
                notes_no: this.notesNo(),
                descr: this.descr(),
            };
            return result;
        }

        _clear() {
            this.notesNo(null);
            this.descr(null);
        }
    }

    const instance = new notes();
    return instance;
});
