//
//
//
define(['knockout'], function (ko) {
    class Company {
        /**
         *@description
         * @returns
         */

        constructor() {
            if (!Company.instance) {
                this.clientNo = ko.observable(null);
                this.name = ko.observable(null);
                this.type = ko.observable(null);
                this.estDate = ko.observable(null);
                this.regPlace = ko.observable(null);
                this.boardPartner1 = ko.observable(null);
                this.boardPartner2 = ko.observable(null);
                this.boardPartner3 = ko.observable(null);
                this.boardPartner4 = ko.observable(null);
                this.boardPartner5 = ko.observable(null);
                this.boardPartner6 = ko.observable(null);
                this.boardPartner7 = ko.observable(null);
                this.boardPartner8 = ko.observable(null);
                this.boardPartner9 = ko.observable(null);
                this.boardPartner10 = ko.observable(null);
                Company.instance = this;
                return Company.instance;
            }
        }

        fields() {
            const result = {
                CLIENT_NO:this.clientNo(),
                NAME:this.name(),
                TYPE:this.type(),
                EST_DATE:this.estDate(),
                REG_PLACE:this.regPlace(),
                BOARD_PARTNER1:this.boardPartner1(),
                BOARD_PARTNER2:this.boardPartner2(),
                BOARD_PARTNER3:this.boardPartner3(),
                BOARD_PARTNER4:this.boardPartner4(),
                BOARD_PARTNER5:this.boardPartner5(),
                BOARD_PARTNER6:this.boardPartner6(),
                BOARD_PARTNER7:this.boardPartner7(),
                BOARD_PARTNER8:this.boardPartner8(),
                BOARD_PARTNER9:this.boardPartner9(),
                BOARD_PARTNER10:this.boardPartner10(),
            };
            return result;
        }

        _clear() {
            this.clientNo(null);
            this.name(null);
            this.type(null);
            this.estDate(null);
            this.regPlace(null);
            this.boardPartner1(null);
            this.boardPartner2(null);
            this.boardPartner3(null);
            this.boardPartner4(null);
            this.boardPartner5(null);
            this.boardPartner6(null);
            this.boardPartner7(null);
            this.boardPartner8(null);
            this.boardPartner9(null);
            this.boardPartner10(null);
        }
    }

    const instance = new Company();
    return instance;
});
