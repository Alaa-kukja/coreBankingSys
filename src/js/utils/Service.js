//
//
//
define([
    'utils/Core',
    'text!../../json/config.json',
    'ojs/ojmutablearraydataprovider',
    'ojs/ojtranslation',
    'ojs/ojconverterutils-i18n',

    'oj-c/message-banner',
], function (coreUtils, configFile, MutableArrayDataProvider, Translations, ojconverterutils_i18n_1) {
    const config = JSON.parse(configFile);
    const _t = Translations.getTranslatedString;
    class ServiceUtils {
        /**
         *@description
         * @returns
         */

        constructor() {
          //  this.messages = new MutableArrayDataProvider([], {
          //      keyAttributes: 'id',
          //  });

            this.messageBannerData = new MutableArrayDataProvider([], {
                keyAttributes: 'id',
            });
        }

        /**
         * @function buildEndpointURL
         * @description get the API URL according to endpoint.
         * @param {String} endpoint
         * @returns {String}
         */

        buildEndpointURL(endpoint) {
            let url;
            let port;
            port = config.port;
            if (parseInt(port, 0) > 0)
                url = `${config.isSecure ? 'https' : 'http'}://${config.host}:${port}/${config.endpoints[endpoint]}`;
            else url = `${config.isSecure ? 'https' : 'http'}://${config.host}/${config.endpoints[endpoint]}`;
            return url;
        }

        /**
         * @function buildEndpointURL
         * @description get the API URL according to endpoint.
         * @param {String} endpoint
         * @param {object} data
         * @returns {String}
         */

        buildGetEndpointURL(endpoint, data) {
            let command;
            command = JSON.stringify(data);
            command = command.replaceAll('{', '');
            command = command.replaceAll('}', '');
            command = command.replaceAll('"', '');
            command = command.replaceAll(':', '=');
            command = command.replaceAll(',', '&');
            return `${this.buildEndpointURL(endpoint)}?${command}`;
        }

        buildAndEncodeEndpointURL(endpoint, data) {
            let command;
            command = encodeURI(JSON.stringify(data));
            return `${this.buildEndpointURL(endpoint)}?customURL=true&token=${localStorage.getItem(
                'token'
            )}&${command}`;
        }

       

        ajaxSendRequest(endpoint, data = null) {
            const url = this.buildEndpointURL(endpoint);
            return new Promise(function (resolve, reject) {
                if (window.XMLHttpRequest) var xmlHttpReq = new XMLHttpRequest();
                else if (window.ActiveXObject) xmlHttpReq = new ActiveXObject('Microsoft.XMLHTTP');
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4) {
                        if (xmlHttpReq.status == 200) resolve(xmlHttpReq.responseText);
                        else reject('Call 1 Failed');
                    }
                };
                xmlHttpReq.open('POST', url);
                xmlHttpReq.send(JSON.stringify(data));
            });
        }

        ajaxGetLocalData(data) {
            const url = `http://localhost:5000/${data.indent}`;
            return new Promise(function (resolve, reject) {
                if (window.XMLHttpRequest) var xmlHttpReq = new XMLHttpRequest();
                else if (window.ActiveXObject) xmlHttpReq = new ActiveXObject('Microsoft.XMLHTTP');
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4) {
                        if (xmlHttpReq.status == 200) resolve(xmlHttpReq.responseText);
                        else reject('Call 1 Failed');
                    }
                };
                xmlHttpReq.open('POST', url);
                xmlHttpReq.send(JSON.stringify(data));
            });
        }

        /**
         * @function fetchData
         * @description execute the API  request according to the method and endpoint
         * @param {String} command
         * @param {data} observable
         */
        async fetchData(command, data, loading = null) {
            Promise.all([this.ajaxSendRequest('getTable', command)])
                .then(
                    await function (values) {
                        let value;
                        let error;
                        if (values) {
                            if (values.length > 0) {
                                value = coreUtils.parseJSON(values[0]);
                                if (value.error) error = value.console;
                                else data(value);
                            }
                            if (error) this._showToastMessage('error', value.console);
                            if (loading != null) loading(false);
                        }
                        return true;
                    }.bind(this)
                )
                .catch(function (reason) {
                    // this._showToastMessage('error', reason);
                    console.log(reason);
                    if (loading != null) loading(false);
                });
        }

        /**
         * @function _isExists
         * @description execute the API  request according to the method and endpoint
         * @param {String} command
         * @param {observable} result
         */
        _isExists(command, result, toDo = null) {
            Promise.all([this.ajaxSendRequest('getTable', command)])
                .then(
                   async function (values) {
                        let value;
                        if (values) {
                            if (values.length > 0) {
                                value = coreUtils.parseJSON(values[0]);
                                if (value.error) {
                                    result(false);
                                } else {
                                    result(value.length > 0);
                                }
                            }
                        }
                        if (toDo != null) await toDo();
                    }.bind(this)
                )
                .catch(function (reason) {
                    console.log(reason);
                    result(false);
                });
        }

           /**
         * @function _isoDateToString
         * @description execute the API  request according to the method and endpoint
         * @param {value} date
         * @return {String} string
         */

           _isoDateToString(value){
            return ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(value);
           }

              /**
         * @function _isoDate
         * @description execute the API  request according to the method and endpoint
         * @param {value} date
         * @return {String} string
         */

              _isoDate(value){
                return ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIso(value);
               }
    

        /**
         * @function fetchCommonData
         * @description execute the API  request according to the method and endpoint
         * @param {String} command
         * @param {data} observable
         */
        async fetchCommonData(command, data) {
            let value;
            let error;
            let sessionStorageJSON = sessionStorage.getItem(command.name);
            if (sessionStorageJSON) {
                value = coreUtils.parseJSON(sessionStorageJSON);
                if (value.error) error = value.console;
                else data(value);
            } else {
                Promise.all([this.ajaxSendRequest('getTable', command)])
                    .then(
                        await function (values) {
                            if (values) {
                                if (values.length > 0) {
                                    value = coreUtils.parseJSON(values[0]);
                                    if (value.error) error = value.console;
                                    else {
                                        data(value);
                                        sessionStorage.setItem(command.name, values[0]);
                                    }
                                    if (error) this._showToastMessage('error', value.console);
                                }
                            }
                            return true;
                        }.bind(this)
                    )
                    .catch(function (reason) {
                        console.log(reason);
                    });
            }
        }

        async externalFetchData(url, method, data = null) {
            let options = null;
            if (method === 'POST') {
                if (data === null) throw Error('Data is not defined');
                options = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify(data),
                };
            }
            let htmlDocument;
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw Error('Some thing went wrong');
                htmlDocument = await response.text();
            } catch (error) {
                return 'error';
            }
            return htmlDocument;
        }
    }

    ServiceUtils.prototype._showToastMessage = function (message,severity, detail) {
        const data = message.data.slice();
        data.push({
            id: coreUtils.generateUniqueId(),
            severity: severity,
            summary: _t(`messages.${severity}`),
            detail: detail,
            timestamp: new Date().toISOString(),
            autoTimeout: 7000,
            sound: 'default',
        });
        message.data = data;
    };

    ServiceUtils.prototype._showMessageBanner = function (severity, title, detail) {
        setTimeout(() => {
            let msgData = this.messageBannerData.data.slice();

            const n = msgData.push({
                id: severity + 'ID',
                severity: severity,
                summary: title + ':',
                detailList: detail,
            });
            // const message = { ...msgData[n - 1] };
            // console.log(message);
            // for (let index = 0; index < detail.length; index++) {
            //     message.detailList.push(detail[index]);
            // }
            this.messageBannerData.data = msgData;
        }, 5);
    };

    ServiceUtils.prototype._closeMessageBanner = function () {
        this.messageBannerData.data = [];
    };

    ServiceUtils.prototype._collectMissingInfo = function (data) {
        let detail = '';
        let newLine = '';
        let value;
        for (var key in data) {
            // if (!key.includes('boardPartner') && !key.includes('estDate')) {
            value = data[key];
            if (value == '' || value == null) {
                detail = `${detail}${newLine}${_t('inputs.' + key)}`;
                newLine = ' * ';
            }
            // }
        }
        return detail;
    };

    ServiceUtils.prototype._getClientTransactions = async function (newClientNo, isBlackListed) {
        let trCommand = {
            token: localStorage.getItem('token'),
            table: 'CLIENT_DOC',
            select: [],
            join: [],
            where: [],
            order: 'DOC_TYPE.CODE',
        };
        trCommand.select.push('DISTINCT DOC_TYPE.CODE');
        trCommand.select.push('DOC_TYPE.SHORT_DESCR');
        trCommand.select.push('CLIENT_DOC_TYPE.CODE CODE1');

        trCommand.join.push({
            table: 'CLIENT_DOC_TYPE',
            type: 'inner',
            condition: 'CLIENT_DOC.TYPE = CLIENT_DOC_TYPE.CODE',
        });
        trCommand.join.push({
            table: 'DOC_TYPE',
            type: 'inner',
            condition: 'DOC_TYPE.CODE =  CLIENT_DOC.DOC_TYPE',
        });
        trCommand.where.push(`CLIENT_DOC.CLIENT_NO = '${newClientNo}'`);
        trCommand.where.push('CLIENT_DOC.STATUS = 1');

        blockedCommand = {
            token: localStorage.getItem('token'),
            table: 'CLIENT_DOC',
            select: [],
            join: [],
            where: [],
        };

        blockedCommand.select.push('BLOCKED_CLIENTS.*');
        blockedCommand.join.push({
            table: 'BLOCKED_CLIENTS',
            type: 'inner',
            condition: 'CLIENT_DOC.DOC_NO =  BLOCKED_CLIENTS.DOC_NO',
        });
        blockedCommand.where.push('CLIENT_DOC.DOC_TYPE = 22');
        blockedCommand.where.push('CLIENT_DOC.TYPE = 18');
        blockedCommand.where.push('BLOCKED_CLIENTS.STATUS = 1');
        blockedCommand.where.push(`CLIENT_DOC.CLIENT_NO = ${newClientNo}`);

        let blackListCommand = {
            token: localStorage.getItem('token'),
            params: [],
        };
        blackListCommand.params.push({
            name: 'clientno',
            data_type: 'string',
            value: `${newClientNo}`,
        });

        Promise.all([
            this.ajaxSendRequest('getTable', trCommand),
            this.ajaxSendRequest('getTable', blockedCommand),
            this.ajaxSendRequest('checkBlackList', blackListCommand),
        ])
            .then(
                await async function (values) {
                    let array;
                    let error;
                    let aCode;
                    let other = '';
                    let trans = '';
                    if (values) {
                        if (values.length > 2) {
                            //start transactions
                            array = coreUtils.parseJSON(values[0]);
                            if (array.error) error = array.console;
                            else {
                                if (array[0]) {
                                    aCode = array[0].code;
                                    for (let index = 0; index < array.length; index++) {
                                        const element = array[index];
                                        if (aCode != element.code) {
                                            if (trans == '') trans = `  ${element.shortDescr}`;
                                            else trans = `${trans}  ${_t('labels.and')}  ${element.shortDescr}`;
                                            aCode = element.code;
                                            if ((element.code1 = 76)) other = _t('labels.relationshipWithOthers');
                                        }
                                    }
                                }

                                if (other != '') trans = `${trans}  ${_t('labels.and')}  ${trans}`;
                                if (trans != '') this._showMessageBanner('info', _t('labels.transactions'), [trans]);
                            }
                            //end transactions
                            //start blocked
                            array = coreUtils.parseJSON(values[1]);
                            if (array.error) error = array.console;
                            else {
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    const fromDate = new Date(element.fromDate);
                                    const toDate = new Date(element.toDate);
                                    const fromDateText =
                                        ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(fromDate);
                                    const toDateText =
                                        ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(toDate);
                                    trans = `${_t('labels.cause')} ${element.cause} ${_t(
                                        'labels.from'
                                    )} ${fromDateText} ${_t('labels.to')} ${toDateText}`;
                                    if (trans != '') this._showMessageBanner('error', _t('labels.blocked'), [trans]);
                                }
                            }
                            //end blocked

                            //black list
                            array = coreUtils.parseJSON(values[2]);
                            if (array[0].error) {
                                error = array.console;
                                if (isBlackListed) isBlackListed(false);
                            } else {
                                let detail = [];
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    if (isBlackListed) isBlackListed(element.found);
                                    if (element.found) {
                                        trans = `${element.description} ${element.number}`;
                                        detail.push(trans);
                                    }
                                }
                                if (isBlackListed()) this._showMessageBanner('error', _t('labels.blackList'), detail);
                            }
                            //end black list
                        }
                    }
                    return true;
                }.bind(this)
            )
            .catch(function (reason) {
                console.log(reason);
            });
    };

    return new ServiceUtils();
});
