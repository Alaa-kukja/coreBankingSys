//

//
define(['knockout', 'utils/Core', 'utils/Service'], function (ko, coreUtils, serviceUtils) {
    class clients {
        /**
         *@description
         * @returns
         */

        constructor() {
            if (!clients.instance) {
                this.clientNo = ko.observable(null);
                this.type = ko.observable(null);
                this.occupation = ko.observable(null);
                this.nationality = ko.observable(null);
                this.address = ko.observable(null);
                this.telephone = ko.observable(null);
                this.idType = ko.observable(null);
                this.sector = ko.observable(null);
                this.activityType = ko.observable(null);
                this.finAbility = ko.observable(null); //solvencyValue
                this.notesNo = ko.observable(null);
                this.idDate = ko.observable(null);
                this.idNo = ko.observable(null);
                this.idSource = ko.observable(null);
                this.idExpDate = ko.observable(null);
                this.resFlag = ko.observable(null);
                this.mobileTelephone = ko.observable(null);
                this.faxNo = ko.observable(null);
                this.pOBox = ko.observable(null);
                this.eMail = ko.observable('');
                this.addrCity = ko.observable(null);
                this.addrRegion = ko.observable(null);
                this.addrStreet = ko.observable(null);
                this.addrBuild = ko.observable(null);
                this.workFor = ko.observable(null);
                this.workTitle = ko.observable(null);
                this.workTelephone = ko.observable(null);
                this.workAddr = ko.observable(null);
                this.id2Date = ko.observable(null);
                this.id2No = ko.observable(null);
                this.id2Source = ko.observable(null);
                this.id2ExpDate = ko.observable(null);
                this.id2Type = ko.observable(null);
                this.crtDate = ko.observable(null);
                this.updtDate = ko.observable(null);
                this.execCrtDate = ko.observable(null);
                this.execUpdtDate = ko.observable(null);
                this.subSector = ko.observable(null);
                this.relPurpose = ko.observable(null);
                this.noteText = ko.observable(null);
                this.docNo1 = ko.observable(null);
                this.docNo2 = ko.observable(null);
                this.lgDocNo1 = ko.observable(null);
                this.lgDocNo2 = ko.observable(null);
                clients.instance = this;
                return clients.instance;
            }
        }

        _ClientDocType(path, subPath, key) {
            switch (key) {
                case 'accOwner':
                    switch (path) {
                        case 'openAccount':
                            switch (subPath) {
                                case 'openSAccount':
                                case 'openSAccountWithInterest':
                                    return 21;
                                default:
                                    return 11;
                            }
                        case 'TermDeposit':
                            return 31;
                        default:
                            null;
                    }

                case 'accDelegacy':
                    switch (path) {
                        case 'openAccount':
                            switch (subPath) {
                                case 'openSAccount':
                                case 'openSAccountWithInterest':
                                    return 23;
                                default:
                                    return 13;
                            }
                        case 'TermDeposit':
                            return 33;
                        default:
                            null;
                    }
                case 'superior':
                    switch (path) {
                        case 'openAccount':
                            switch (subPath) {
                                case 'openSAccount':
                                case 'openSAccountWithInterest':
                                    return 22;
                                default:
                                    return null;
                            }
                        case 'TermDeposit':
                            return 32;
                        default:
                            null;
                    }
                case 'guardian':
                    switch (path) {
                        case 'openAccount':
                            switch (subPath) {
                                case 'openSAccount':
                                case 'openSAccountWithInterest':
                                    return 24;
                                default:
                                    return null;
                            }
                        case 'TermDeposit':
                            return 34;
                        default:
                            null;
                    }

                default:
                    return null;
            }
        }

        async getNewID(toDO = null) {
            const nIdCommand = {
                token: localStorage.getItem('token'),
                table: 'NOTES',
                select: [`MAX(NOTES.NOTES_NO)||'N' ID`],
            };
            const docIdCommand = {
                token: localStorage.getItem('token'),
                table: 'LARGE_OBJECT_DOC',
                select: [`MAX(TO_NUMBER(LARGE_OBJECT_DOC.DOC_NO))||'D' ID`],
            };
            const lgIdCommand = {
                token: localStorage.getItem('token'),
                table: 'LARGE_OBJECTS',
                select: [`MAX(TO_NUMBER(LARGE_OBJECTS.DOC_NO))||'L' ID`],
            };
            const idCommand = {
                token: localStorage.getItem('token'),
                table: 'CLIENTS',
                select: [`MAX(CLIENTS.CLIENT_NO)||'c' ID`],
                union: [],
            };
            idCommand.union.push(nIdCommand);
            idCommand.union.push(lgIdCommand);
            idCommand.union.push(docIdCommand);
            Promise.all([serviceUtils.ajaxSendRequest('getTable', idCommand)])
                .then(
                    await async function (values) {
                        let array;
                        let maxNo;
                        let strMaxNo;
                        if (values) {
                            if (values.length > 0) {
                                array = coreUtils.parseJSON(values[0]);
                                if (array.error) error = array.console;
                                else {
                                    for (let index = 0; index < array.length; index++) {
                                        const element = array[index];
                                        if (element.indexOf('N') > -1) {
                                            this.notesNo(parseInt(element.slice(0, -1)) + 1);
                                        } else {
                                            if (element.indexOf('D') > -1) {
                                                maxNo = parseInt(element.slice(0, -1)) + 1;
                                                strMaxNo = maxNo.toString();
                                                while (strMaxNo.length < 20) {
                                                    strMaxNo = '0' + strMaxNo;
                                                }
                                                this.docNo1(strMaxNo);
                                                maxNo = parseInt(element.slice(0, -1)) + 2;
                                                strMaxNo = maxNo.toString();
                                                while (strMaxNo.length < 20) {
                                                    strMaxNo = '0' + strMaxNo;
                                                }
                                                this.docNo2(strMaxNo);
                                            } else {
                                                if (element.indexOf('L') > -1) {
                                                    maxNo = parseInt(element.slice(0, -1)) + 1;
                                                    strMaxNo = maxNo.toString();
                                                    while (strMaxNo.length < 20) {
                                                        strMaxNo = '0' + strMaxNo;
                                                    }
                                                    this.lgDocNo1(strMaxNo);
                                                    maxNo = parseInt(element.slice(0, -1)) + 2;
                                                    strMaxNo = maxNo.toString();
                                                    while (strMaxNo.length < 20) {
                                                        strMaxNo = '0' + strMaxNo;
                                                    }
                                                    this.lgDocNo2(strMaxNo);
                                                } else this.clientNo(parseInt(element.slice(0, -1)) + 1);
                                            }
                                        }
                                    }
                                    if (toDO != null) await toDO(array);
                                }
                            }
                        }
                        return true;
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                    this.clientTransactions('');
                });
        }

        fields() {
            const result = {
                CLIENT_NO: this.clientNo(),
                TYPE: this.type(),
                OCCUPATION: this.occupation(),
                NATIONALITY: this.nationality(),
                ADDRESS: this.address(),
                TELEPHONE: this.telephone(),
                ID_TYPE: this.idType(),
                SECTOR: this.sector(),
                ACTIVITY_TYPE: this.activityType(),
                FIN_ABILITY: this.finAbility(),
                NOTES_NO: this.notesNo(),
                ID_DATE: this.idDate(),
                ID_NO: this.idNo(),
                ID_SOURCE: this.idSource(),
                ID_EXP_DATE: this.idExpDate(),
                RES_FLAG: this.resFlag(),
                MOBILE_TELEPHONE: this.mobileTelephone(),
                FAX_NO: this.faxNo(),
                P_O_BOX: this.pOBox(),
                E_MAIL: this.eMail(),
                ADDR_CITY: this.addrCity(),
                ADDR_REGION: this.addrRegion(),
                ADDR_STREET: this.addrStreet(),
                ADDR_BUILD: this.addrBuild(),
                WORK_FOR: this.workFor(),
                WORK_TITLE: this.workTitle(),
                WORK_TELEPHONE: this.workTelephone(),
                WORK_ADDR: this.workAddr(),
                ID2_DATE: this.id2Date(),
                ID2_NO: this.id2No(),
                ID2_SOURCE: this.id2Source(),
                ID2_EXP_DATE: this.id2ExpDate(),
                ID2_TYPE: this.id2Type(),
                CRT_DATE: this.crtDate(),
                UPDT_DATE: this.updtDate(),
                EXEC_CRT_DATE: this.execCrtDate(),
                EXEC_UPDT_DATE: this.execUpdtDate(),
                SUB_SECTOR: this.subSector(),
                REL_PURPOSE: this.relPurpose(),
            };
            return result;
        }

        _clear() {
            this.clientNo(null);
            this.type(null);
            this.occupation(null);
            this.nationality(null);
            this.address(null);
            this.telephone(null);
            this.idType(null);
            this.sector(null);
            this.activityType(null);
            this.finAbility(null);
            this.notesNo(null);
            this.idDate(null);
            this.idNo(null);
            this.idSource(null);
            this.idExpDate(null);
            this.resFlag(null);
            this.mobileTelephone(null);
            this.faxNo(null);
            this.pOBox(null);
            this.eMail('');
            this.addrCity(null);
            this.addrRegion(null);
            this.addrStreet(null);
            this.addrBuild(null);
            this.workFor(null);
            this.workTitle(null);
            this.workTelephone(null);
            this.workAddr(null);
            this.id2Date(null);
            this.id2No(null);
            this.id2Source(null);
            this.id2ExpDate(null);
            this.id2Type(null);
            this.crtDate(null);
            this.updtDate(null);
            this.execCrtDate(null);
            this.execUpdtDate(null);
            this.subSector(null);
            this.relPurpose(null);
        }
    }


    const instance = new clients();
    return instance;
});
