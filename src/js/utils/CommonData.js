define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class commonData {
        /**
         *@description A singleton to hold the variable
         * generates an unique id by calling the generate Unique
         * @returns The existing instance.
         */

        constructor() {
            this._initAllObservable();
            this._fetchData();
            if (!commonData.instance) {
                commonData.instance = this;
                return commonData.instance;
            }
        }
    }

    commonData.prototype._initAllObservable = function () {
        this.sexArray = ko.observableArray([]);
        this.idCards = ko.observableArray([]);
        this.nationalities = ko.observableArray([]);
        this.companyTypes = ko.observableArray([]);
        this.sectors = ko.observableArray([]);
        this.subSectors = ko.observableArray([]);
        this.activities = ko.observableArray([]);
        this.roundingArr = ko.observableArray([]);
        this.Currencies =  ko.observableArray([]);
    };

    commonData.prototype._fetchData = async function () {
        const idCommand = {
            name:'idCommand',
            token: localStorage.getItem('token'),
            table: 'ID_TYPE',
        };

        const sexCommand = {
            name:'sexCommand',
            token: localStorage.getItem('token'),
            table: 'SEX_TYPE',
        };

        const nCommand = {
            name:'nationalitiesCommand',
            token: localStorage.getItem('token'),
            table: 'NATIONALITIES',
        };

        const cCommand = {
            name:'companyTypesCommand',
            token: localStorage.getItem('token'),
            table: 'COMPANIES_TYPE',
        };

        const sCommand = {
            name:'sectorsCommand',
            token: localStorage.getItem('token'),
            table: 'SECTOR',
        };
        const ssCommand = {
            name:'subSectorsCommand',
            token: localStorage.getItem('token'),
            table: 'SUB_SECTOR',
        };

        const eacCommand = {
            name: 'activityCommand',
            token: localStorage.getItem('token'),
            table: 'ACTIVITY_TYPE',
        };

        const roundCommand ={
            name: 'roundCommand',
            token: localStorage.getItem('token'),
            table: 'ROUNDING_PERIOD',  
        }

        const currCommand ={
            name: 'currencyCommand',
            token: localStorage.getItem('token'),
            table: 'CURRENCIES',
        };

        serviceUtils.fetchCommonData(idCommand, this.idCards);
        serviceUtils.fetchCommonData(sexCommand, this.sexArray);
        serviceUtils.fetchCommonData(nCommand, this.nationalities);
        serviceUtils.fetchCommonData(cCommand, this.companyTypes);
        serviceUtils.fetchCommonData(sCommand, this.sectors);
        serviceUtils.fetchCommonData(ssCommand, this.subSectors);
        serviceUtils.fetchCommonData(eacCommand, this.activities);
        serviceUtils.fetchCommonData(roundCommand, this.roundingArr);
        serviceUtils.fetchCommonData(currCommand, this.Currencies);
    };

    const instance = new commonData();
    return instance;
});
