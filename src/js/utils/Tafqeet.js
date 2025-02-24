define(['ojs/ojtranslation'], function (Translations) {
    const _t = Translations.getTranslatedString;
    class tafqeet {
        constructor() {
            
       this.ones = {
            0: 'صفر',
            1: 'واحد',
            2: 'اثنان',
            3: 'ثلاثة',
            4: 'أربعة',
            5: 'خمسة',
            6: 'ستة',
            7: 'سبعة',
            8: 'ثمانية',
            9: 'تسعة',
            10: 'عشرة',
            11: 'أحد عشر',
            12: 'اثنى عشر',
        };
       this.tens = {
            1: 'عشر',
            2: 'عشرون',
            3: 'ثلاثون',
            4: 'أربعون',
            5: 'خمسون',
            6: 'ستون',
            7: 'سبعون',
            8: 'ثمانون',
            9: 'تسعون',
        };
       this.hundreds = {
            0: 'صفر',
            1: 'مائة',
            2: 'مئتان',
            3: 'ثلاثمائة',
            4: 'أربعمائة',
            5: 'خمسمائة',
            6: 'ستمائة',
            7: 'سبعمائة',
            8: 'ثمانمائة',
            9: 'تسعمائة',
        };
        this.thousands = {
            1: 'ألف',
            2: 'ألفان',
            39: 'آلاف',
            1199: 'ألفًا',
        };

        /*
القيم الخاصة بقيم الملايين
* */
        this.millions = {
            1: 'مليون',
            2: 'مليونان',
            39: 'ملايين',
            1199: 'مليونًا',
        };

        /*
القيم الخاصة بقيم المليارات
* */
       this.billions = {
            1: 'مليار',
            2: 'ملياران',
            39: 'مليارات',
            1199: 'مليارًا',
        };

        /*
القيم الخاصة بقيم التريليونات
* */
       this.trillions = {
            1: 'تريليون',
            2: 'تريليونان',
            39: 'تريليونات',
            1199: 'تريليونًا',
        };

            if (!tafqeet.instance) {
                tafqeet.instance = this;
                return tafqeet.instance;
            }
        }

        /**
         *
         * @param {*} number
         * الدالة الخاصة بالآحاد والعشرات
         */
        oneTen(number) {
            /**
             * القيم الافتراضية
             */
            var value = 'صفر';

            //من 0 إلى 12
            if (number <= 12) {
                switch (parseInt(number)) {
                    case 0:
                        value = this.ones['0'];
                        break;
                    case 1:
                        value = this.ones['1'];
                        break;
                    case 2:
                        value = this.ones['2'];
                        break;
                    case 3:
                        value = this.ones['3'];
                        break;
                    case 4:
                        value = this.ones['4'];
                        break;
                    case 5:
                        value = this.ones['5'];
                        break;
                    case 6:
                        value = this.ones['6'];
                        break;
                    case 7:
                        value = this.ones['7'];
                        break;
                    case 8:
                        value = this.ones['8'];
                        break;
                    case 9:
                        value = this.ones['9'];
                        break;
                    case 10:
                        value = this.ones['10'];
                        break;

                    case 11:
                        value = this.ones['11'];
                        break;

                    case 12:
                        value = this.ones['12'];
                        break;
                }
            } else {

            /**
             * إذا كان العدد أكبر من12 وأقل من 99
             * يقوم بجلب القيمة الأولى من العشرات
             * والثانية من الآحاد
             */
                var first = this.getNth(number, 0, 0);

                var second =  this.getNth(number, 1, 1);

                if (this.tens[first] == 'عشر') {
                    value = this.ones[second] + ' ' + this.tens[first];
                } else {
                    value = this.ones[second] + ' و' + this.tens[first];
                }
            }

            return value;
        }

        /**
         *
         * @param {*} number
         * الدالة الخاصة بالمئات
         */
        hundred(number) {
            var value = '';

            /**
             * إذا كان الرقم لا يحتوي على ثلاث منازل
             * سيتم إضافة أصفار إلى يسار الرقم
             */
            while (number.toString().length != 3) {
                number = '0' + number;
            }

            var first =  this.getNth(number, 0, 0);

            /**
             * تحديد قيمة الرقم الأول
             */
            switch (parseInt(first)) {
                case 0:
                    value = this.hundreds['0'];
                    break;
                case 1:
                    value = this.hundreds['1'];
                    break;
                case 2:
                    value = this.hundreds['2'];
                    break;
                case 3:
                    value = this.hundreds['3'];
                    break;
                case 4:
                    value = this.hundreds['4'];
                    break;
                case 5:
                    value = this.hundreds['5'];
                    break;
                case 6:
                    value = this.hundreds['6'];
                    break;
                case 7:
                    value = this.hundreds['7'];
                    break;
                case 8:
                    value = this.hundreds['8'];
                    break;
                case 9:
                    value = this.hundreds['9'];
                    break;
            }

            /**
             * إضافة منزلة العشرات إلى الرقم المفقط
             * باستخدام دالة العشرات السابقة
             */
            value = value + ' و' +  this.oneTen(parseInt( this.getNth(number, 1, 2)));
            return value;
        }

        /**
         *
         * @param {*} number
         * الدالة الخاصة بالآلاف
         */
        thousand(number) {
            return this.thousandsTrillions(
               this. thousands['1'],
               this. thousands['2'],
               this. thousands['39'],
               this. thousands['1199'],
                0,
                parseInt(number),
                this.getNthReverse(number, 4)
            );
        }

        /**
         *
         * @param {*} number
         * الدالة الخاصة بالملايين
         */
        million(number) {
            return this.thousandsTrillions(
                this.millions['1'],
                this.millions['2'],
                this.millions['39'],
                this.millions['1199'],
                3,
                parseInt(number),
                this.getNthReverse(number, 7)
            );
        }

        /**
         *
         * @param {*} number
         * الدالة الخاصة بالمليارات
         */
        billion(number) {
            return this.thousandsTrillions(
                this.billions['1'],
                this.billions['2'],
                this.billions['39'],
                this.billions['1199'],
                6,
                parseInt(number),
                this.getNthReverse(number, 10)
            );
        }

        /**
         *
         * @param {*} number
         * الدالة الخاصة بالترليونات
         */
        trillion(number) {
            return this.thousandsTrillions(
                this.trillions['1'],
                this.trillions['2'],
                this.trillions['39'],
                this.trillions['1199'],
                9,
                parseInt(number),
                this.getNthReverse(number, 13)
            );
        }

        /**
         * هذه الدالة هي الأساسية بالنسبة للأرقام
         * من الآلاف وحتى التريليونات
         * تقوم هذه الدالة بنفس العملية للمنازل السابقة مع اختلاف
         * زيادة عدد المنازل في كل مرة
         * @param {*} one
         * @param {*} two
         * @param {*} three
         * @param {*} eleven
         * @param {*} diff
         * @param {*} number
         * @param {*} other
         */
        thousandsTrillions(one, two, three, eleven, diff, number, other) {
            /**
             * جلب المنازل المتبقية
             */
            other = parseInt(other);
            other = this._tafqeet(other);

            /**
             * إذا كان المتبقي يساوي صفر
             */
            if (other == '') {
                other = 'صفر';
            }

            var value = '';

            number = parseInt(number);

            /**
             * التحقق من طول الرقم
             * لاكتشاف إلى أي منزلة ينتمي
             */
            switch (number.toString().length) {
                /**
                 * ألوف، أو ملايين، أو مليارات، أو تريليونات
                 */
                case 4 + diff:
                    var ones = parseInt( this.getNth(number, 0, 0));
                    switch (ones) {
                        case 1:
                            value = one + ' و' + other;
                            break;
                        case 2:
                            value = two + ' و' + other;
                            break;
                        default:
                            value =  this.oneTen(ones) + ' ' + three + ' و' + other;
                            break;
                    }
                    break;

                /**
                 * عشرات الألوف، أو عشرات الملايين، أو عشرات المليارات، أو عشرات التريليونات
                 */
                case 5 + diff:
                    var tens = parseInt( this.getNth(number, 0, 1));
                    switch (tens) {
                        case 10:
                            value =  this.oneTen(tens) + ' ' + three + ' و' + other;
                            break;
                        default:
                            value =  this.oneTen(tens) + ' ' + eleven + ' و' + other;
                            break;
                    }
                    break;

                /**
                 *مئات الألوف، أو مئات الملايين، أو مئات المليارات
                 */
                case 6 + diff:
                    var hundreds = parseInt( this.getNth(number, 0, 2));

                    var two = parseInt( this.getNth(number, 1, 2));
                    var th = '';
                    switch (two) {
                        case 0:
                            th = one;
                            break;

                        default:
                            th = eleven;
                            break;
                    }
                    switch (tens) {
                        case 100 <= tens <= 199:
                            value = this.hundred(hundreds) + ' ' + th + ' و' + other;
                            break;
                        case 200 <= tens <= 299:
                            value = this.hundred(hundreds) + ' ' + th + ' و' + other;
                            break;
                        default:
                            value = this.hundred(hundreds) + ' ' + th + ' و' + other;
                            break;
                    }
                    break;
            }

            return value;
        }

        /**
         * دالة لجلب أجزاء من الرقم المراد تفقيطه
         */
        getNth(number, first, end) {
            var finalNumber = '';
            for (var i = first; i <= end; i++) {
                finalNumber = finalNumber + String(number).charAt(i);
            }
            return finalNumber;
        }

        /**
         * دالة تجلب أجزاء من الرقم بالعكس
         * @param {*} number
         * @param {*} limit
         */
        getNthReverse(number, limit) {
            var finalNumber = '';
            var x = 1;
            while (x != limit) {
                finalNumber = String(number).charAt(number.toString().length - x) + finalNumber;
                x++;
            }

            return finalNumber;
        }

         /**
         *
         * @param {*} number
         * هذه هي الدالة الرئيسية
         * والتي يتم من خلالها تفقيط الأرقام
         */
         _tafqeet(number) {
            /**
             * متغير لتخزين النص المفقط بداخله
             */

            var value = '';
            number = parseInt(number);
            //التحقق من أن المتغير يحتوي أرقامًا فقط، وأقل من تسعة وتسعين تريليون
            if (number.toString().match(/^[0-9]+$/) != null && number.toString().length <= 14) {
                switch (number.toString().length) {
                    /**
                     * إذا كان العدد من 0 إلى 99
                     */
                    case 1:
                    case 2:
                        value = this.oneTen(number);
                        break;

                    /**
                     * إذا كان العدد من 100 إلى 999
                     */
                    case 3:
                        value = this.hundred(number);
                        break;

                    /**
                     * إذا كان العدد من 1000 إلى 999999
                     * أي يشمل الآلاف وعشرات الألوف ومئات الألوف
                     */
                    case 4:
                    case 5:
                    case 6:
                        value = this.thousand(number);
                        break;

                    /**
                     * إذا كان العدد من 1000000 إلى 999999999
                     * أي يشمل الملايين وعشرات الملايين ومئات الملايين
                     */
                    case 7:
                    case 8:
                    case 9:
                        value = this.million(number);
                        break;

                    /**
                     * إذا كان العدد من 1000000000 إلى 999999999999
                     * أي يشمل المليارات وعشرات المليارات ومئات المليارات
                     */
                    case 10:
                    case 11:
                    case 12:
                        value = this.billion(number);
                        break;

                    /**
                     * إذا كان العدد من 100000000000 إلى 9999999999999
                     * أي يشمل التريليونات وعشرات التريليونات
                     */
                    case 13:
                    case 14:
                    case 15:
                        value = this.trillion(number);
                        break;
                }
            }

            /**
             * هذا السطر يقوم فقط بإزالة بعض الزوائد من النص الأخير
             * تظهر هذه الزوائد نتيجة بعض الفروق في عملية التفقيط
             * ولإزالتها يتم استخدام هذا السطر
             */
            return value
                .replace(/وصفر/g, '')
                .replace(/وundefined/g, '')
                .replace(/ +(?= )/g, '')
                .replace(/صفر و/g, '')
                .replace(/صفر/g, '')
                .replace(/مئتان أ/, 'مائتا أ')
                .replace(/مئتان م/, 'مائتا م');
        }
    }

    const instance = new tafqeet();
    return instance;
});
