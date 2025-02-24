//
//
//
define(['knockout', 'utils/Service'], function (ko, serviceUtils) {
    class OrdPeople {
        /**
         *@description
         * @returns
         */

        constructor() {
            if (!OrdPeople.instance) {
                this.clientNo = ko.observable(null);
                this.firstName = ko.observable(null);
                this.lastName = ko.observable(null);
                this.fatherName = ko.observable(null);
                this.motherName = ko.observable(null);
                this.sex = ko.observable(null);
                this.regNo = ko.observable(null);
                this.regPlace = ko.observable(null);
                this.birthDate = ko.observable(null);
                this.birthPlace = ko.observable(null);
                this.empType = ko.observable(null);
                this.nationalNo = ko.observable(null);
                this.husbandName = ko.observable(null);
                this.motherLastName = ko.observable(null);
                this.isExists = ko.observable(false);
                this.isNationalNoExists = ko.observable(false);
                this.searchMode = ko.observable(false);
                this.searchMode.subscribe(() => {
                    this.isExists(false);
                    this.isNationalNoExists(false);
                });
                this.nationalNo.subscribe(async () => {
                    if (!this.searchMode()) await this._isExists();
                });
                OrdPeople.instance = this;
                return OrdPeople.instance;
            }
        }

        fields() {
            const result = {
                CLIENT_NO: this.clientNo(),
                FIRST_NAME: this.firstName(),
                LAST_NAME: this.lastName(),
                FATHER_NAME: this.fatherName(),
                MOTHER_NAME: this.motherName(),
                SEX: this.sex(),
                REG_NO: this.regNo(),
                REG_PLACE: this.regPlace(),
                BIRTH_DATE: this.birthDate(),
                BIRTH_PLACE: this.birthPlace(),
                EMP_TYPE: this.empType(),
                NATIONAL_NO: this.nationalNo(),
                HSBND_WF_NAME: this.husbandName(),
                MOTHER_LAST_NAME: this.motherLastName(),
            };
            return result;
        }

        _clear() {
            this.clientNo(null);
            this.firstName(null);
            this.lastName(null);
            this.fatherName(null);
            this.motherName(null);
            this.sex(null);
            this.regNo(null);
            this.regPlace(null);
            this.birthDate(null);
            this.birthPlace(null);
            this.empType(null);
            this.nationalNo(null);
            this.husbandName(null);
            this.motherLastName(null);
        }
    }

    /**
     * @function _isExists
     * @description check if person exists
     * @param {String} command
     */

    OrdPeople.prototype._isExists = async function () {
        let _isNationalNoExists = async function () {
            serviceUtils._closeMessageBanner();
            let srCommand = {
                token: localStorage.getItem('token'),
                table: 'ORD_PEOPLE',
                where: [],
            };
            if (this.nationalNo() != '') srCommand.where.push(`NATIONAL_NO = '${this.nationalNo()}'`);
            const n = srCommand.where.length;
            if (n > 0) await serviceUtils._isExists(srCommand, this.isNationalNoExists);
            else this.isNationalNoExists(false);
        }.bind(this);
        serviceUtils._closeMessageBanner();
        let srCommand = {
            token: localStorage.getItem('token'),
            table: 'ORD_PEOPLE',
            where: [],
        };

        if (this.firstName() != '') srCommand.where.push(`FIRST_NAME = '${this.firstName()}'`);
        if (this.fatherName() != '') srCommand.where.push(`FATHER_NAME = '${this.fatherName()}'`);
        if (this.lastName() != '') srCommand.where.push(`LAST_NAME = '${this.lastName()}'`);
        if (this.motherName() != '') srCommand.where.push(`MOTHER_NAME = '${this.motherName()}'`);
        if (this.motherLastName() != null) srCommand.where.push(`MOTHER_LAST_NAME = '${this.motherLastName()}'`);
        const n = srCommand.where.length;
        if (n > 0) await serviceUtils._isExists(srCommand, this.isExists, _isNationalNoExists);
        else {
            this.isExists(false);
            await this._isNationalNoExists();
        }
    };

    /**
     * @function _isNationalNoExists
     * @description check if NationalNo exists
     * @param {String} command
     */

    OrdPeople.prototype._isNationalNoExists = async function () {
        serviceUtils._closeMessageBanner();
        let srCommand = {
            token: localStorage.getItem('token'),
            table: 'ORD_PEOPLE',
            where: [],
        };
        if (this.nationalNo() != '') srCommand.where.push(`NATIONAL_NO = '${this.nationalNo()}'`);
        const n = srCommand.where.length;
        if (n > 0) await serviceUtils._isExists(srCommand, this.isNationalNoExists);
        else this.isNationalNoExists(false);
    };

    const instance = new OrdPeople();
    return instance;
});
