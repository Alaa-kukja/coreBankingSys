define({
    application: {
        title: 'النظام المصرفي',
        name: 'النظام المصرفي المتكامل',
        versionNo: 'نسخة رقم :',
    },
    inputs: {
        userName: 'اسم المستخدم',
        password: 'كلمة المرور',
        accName: 'اسم الحساب',
        amount: 'المبلغ',
        note: 'ملاحظات',
        fromNo: 'من رقم',
        toNo: 'إلى رقم',
        firstName: 'الاسم',
        lastName: 'الكنية',
        fullName: 'الاسم',
        father: 'الأب',
        motherName: 'الأم',
        motherLastName: 'كنية الأم',
        birthDate: 'تاريخ الميلاد',
        eMail: 'البريد الإلكتروني',
        age: 'العمر',
        country: 'الدولة',
        state: 'المحافظة',
        sex: 'الجنس',
        idType: 'بطاقة التعريف',
        idNo: 'رقم بطاقة التعريف',
        activityType: 'النشاط الإقتصادي',
        purpose: 'الغرض',
        husband: 'الزوج',
        source: 'المصدر',
        nationalNo: 'الرقم الوطني',
        expireDate: 'تاريخ الإنتهاء',
        grantDate: 'تاريخ المنح',
        regNo: 'رقم القيد',
        birthPlace: 'محل الولادة',
        regPlace: 'محل القيد',
        regPlace1: 'مكان التسجيل',
        nationality: 'الجنسية',
        phon: 'الهاتف',
        mobile: 'موبايل',
        fax: 'فاكس',
        poBox: 'ص.ب',
        address: 'العنوان',
        city: 'المدينة',
        zone: 'المنطقة',
        street: 'الشارع',
        building: 'البناء',
        type: 'النوع',
        establishingDate: 'تاريخ التأسيس',
        finAbility: 'راس المال',
        occupation: 'المهنة',
        sector: 'القطاع',
        subSector: 'القطاع الفرعي',
        language: 'اللغة',
        oldPassword: 'كلمة المرور القديمة',
        newPassword: 'كلمة المرور الجديدة',
        confirm: 'التأكيد',
        internal: 'داخلي',
        accNumber: 'رقم الحساب',

        discount: 'قيمة الحسم',
        fromDate: 'من تاريخ',
        toDate: 'إلى تاريخ',
        discountReason: 'سبب  الحسم',
        account: 'الحساب',
        latinName: 'الاسم الأجنبي',
        year: 'مدة/سنة',
        month: 'مدة/شهر',
        amountSpelling: 'تفقيط المبلغ',
        clientEmployer: 'الجهة الّتي يعمل لديها',
        clientWPosition: 'الصّفة في العمل',
        clientWoPhone: 'هاتف العمل',
        clientWoAddress: 'عنوان جهة العمل',
        solvency: 'الملاءة المالية',

        firstAmount: 'أوّل مبلغ',
        depositAmount: 'مبلغ الوديعة',
        profileNo: 'الرقم الذاتي',
        forDate: 'لغاية تاريخ',
        currency: 'العملة',
    },
    Validators: {
        unAcceptable: 'غير مقبول',
        firstName: {
            hint_inRange: 'يجب أن تحتوي القيمة على {0} من الأحرف على الأقل و لكن لا تزيد عن {1}.',
            messageSummary_tooLong: ' عدد الأحرف كبير جدًا',
            messageSummary_tooShort: ' عدد الأحرف قليل جدًا',
            messageDetail_tooLong: ' عدد الأحرف كبير جدًا. أدخل {1} حرفًا كحد أقصى.',
            messageDetail_tooShort: 'عدد الأحرف منخفض جدًا. أدخل {0} حرفًا على الأقل.',
        },
        name: {
            hint: 'أدخل أحرفًا صالحة للأسماء',
            messageDetail: 'الاحرف الخاصة و الأرقام غير مسموحة',
        },
        email: {
            hint: 'أدخل تنسيق بريد إلكتروني صالح',
            messageDetail: 'ليس تنسيق بريد إلكتروني صالحًا',
        },
        nationalNo: {
            label: 'الرقم الوطني',
            hint: 'أدخل 11 رقمًا بالضبط للرقم الوطني.',
        },
        birthday: {
            hint_inRange: 'أدخل قيمة بين.',
        },
        mobile: {
            label: 'الموبايل',
            hint: 'أدخل رقمًا يبدأ بـ 9، متبوعًا برقم بين 3 و09، ثم سبعة أرقام أخرى بالضبط.',
        },
        phone: {
            label: 'رقم الهاتف',
            hint: 'أدخل رقمًا يبدأ بـ 0، متبوعًا برقمين بين 1 و 9 لرمز المنطقة، ثم 6 إلى 7 أرقام لرقم العميل.',
        },
    },
    buttons: {
        login: 'تسجيل الدخول',
        addRow: 'إصافة سجل',
        deleteRow: 'حذف سجل',
        apply: 'موافق',
        cancel: 'إلغاء الأمر',
        create: 'إنشاء',
        search: 'بحث',
        edit: 'تعديل',
        action: 'الإجراء',
        changePassword: 'تغيير كلمة المرور',
        close: 'إغلاق',
        add: 'اضافة',
        delete: 'حذف',
        back: 'تراجع',
        file: 'ملف',

        specificCli: ' تحديد المسحوب لأمره',
        specifClient: ' تحديد متعامل',
        relatedDocuments: 'الوثائق ذات الصلة',
        archivedDocuments: 'الوثائق المؤرشفة',
        executingClient: 'المتعامل المنفذ',
    },
    menus: {
        pref: 'التفضيلات',
        help: 'مساعدة',
        about: 'حول البرنامج',
        out: 'تسجيل الخروج',
    },
    contacts: {
        about_us: 'حول',
        contact_us: 'اتصل بنا',
        legal_notices: 'معلومات قانونية',
        terms_of_use: 'شروط الاستخدام',
        privacy_rights: 'حقوق النشر',
        Copyrights: 'جميع الحقوق محفوظة لشركة النوري @ 2023-2024',
    },
    messages: {
        error: 'خطأ',
        warning: 'تحذير',
        loginError: 'اسم المستخدم او كلمة المرور غير صحيحة!.',
        callFailed: 'فشل الاتصال بالمخدم',
        serverError: 'مشكلة في المخدم',
        emptyFields: 'يوجد حقول فارغة',
        sameFieldValue: 'قيمة الحقل الجديد ليست مختلفة أو القيمة الجديدة غير صالحة',
        duplicateNationalNo: ' يوجد متعامل بنفس الرقم الوطني',
        duplicateName: 'يوجد متعامل بنفس الاسم',
        duplicateRelation: ' لا يمكن إصافة نفس العلاقة لنفس المتعامل مرتين',
        errorParentNotDefined: 'يجب تحديد رقم حساب العائدية',
        lastLevelParent: 'لا يمكن أن يكون الحساب حساب عائدية لأنه من المستوى الأخير',
        accIDMustDefined: 'يجب تحديد رقم الحساب',
        accountNoExists: 'رقم الحساب موجود',
        accNoDigitsError: 'خظأ في عدد خانات الحساب',
        accOwnerNotDefined: 'يجب تحديد صاحب الحساب أولاً',
        accOwner1MustNotDeleted: 'ًلا يمكن حذف صاحب الحساب الوحيد',
        savedOk:'تم تخزين الحساب بنجاح',
    },
    titles: {
        determineClient: 'تحديد متعامل',
        home: 'الصفحة الرئيسية',
        managers: 'المدراء',
        departments: 'الأقسام',
        clientName: 'اسم المتعامل',
        linkType: 'نوع العلاقة',
        clientNo: 'رقم المتعامل',

        sppIntDate: 'تاريخ مؤونة قديم',
        sppIntAmount: 'مبلغ مؤونة قديم',
        sppNewAmount: 'مبلغ مؤونة جديد',
        benefitTime: 'الفائدة لتاريخه',
        debit: 'المدينة',
        credit: 'الدّائنة',
        active: 'فعّال',
        more: 'الأكبر',
    },
    labels: {
        date: 'التاريخ',
        transactions: 'التعاملات',
        relationshipWithOthers: 'له علاقة مع متعاملين أخرين',
        departmentName: 'اسم القسم',
        location: 'الموقع',
        type: 'النوع',
        startDate: 'تاريخ البداية',
        id: 'الرقم',
        theManager: 'المدير',
        currency: 'العملة',
        employeesCount: 'عدد الموظفين',
        rating: 'التقييم',
        name: 'الإسم',
        salary: 'الراتب',
        select: 'تحديد',
        parent: 'العائدية',
        roundingPeriod: 'فترة التدوير',
        interest: 'الفائدة',
        accOwner: 'المالك',
        accDelegacy: 'المفوض',
        chequesBook: 'دفتر الشيكات',
        branchName: 'اسم الفرع',
        branchNo: 'رقم الفرع',
        male: 'ذكر',
        female: 'أنثى',
        resident: 'مقيم',
        economicEfficiency: 'فعالية اقتصادية',
        foundingMembers: 'أعضاء مجلس الإدارة و الشركاء الرئيسين',
        choseOccupation: 'اختيار مهنة',
        sign: 'التوقيع',
        image: 'الصورة',
        new: 'جديد',
        code: 'رمز',
        theCode: 'الرمز',
        manager: 'مدير',
        debit: 'المدين',
        debitPercent: 'مدين %',
        credit: 'الدّائن ',
        creditPercent: 'دائن %',
        description: 'الوصف',
        company: 'المؤسسة أو الشركة',
        accountsToLocalize: 'الحسابات المراد توطينها',
        members: 'أفراد',
        legalPerson: 'شخصية اعتبارية',
        branch: 'فرع مصرف',
        branchEmployee: 'موظف في الفرع',
        newAccount: 'حساب جديد',
        oldAccount: 'حساب موجود',
        withInterest: 'بفائدة',
        ATM_Card: 'بطاقة الصّرّاف الآلي',
        ATM_CardType: 'نوع البطاقة',
        shortDescr: 'وصف مختصر',
        lowLimit: 'حد أدنى',
        highLimit: 'حد أعلى',
        price: 'ثمن البطاقة',
        deserveIt: 'عند استحقاقها',
        deserveIt_1: 'لا تُجدّد تلقائيّاً و توضع مع فوائدها في حساب المتعامل',
        deserveIt_2: 'تُجدّد تلقائيّاً و توضع فوائدها فقط في حساب المتعامل ',
        deserveIt_3: 'تُجدّد تلقائيّاً مع فوائدها',
        deserveIt_4: 'لا تُجدّد',
        sumOfInterests: 'مجموع الفوائد',
        filter: 'فلترة',
        none: 'بلا',
        and: 'و',
        docNo: 'رقم الإضبارة',
        interestsAvailable: 'الفوائد المعرّفة',
        theRate: 'النّسبة',
        rate: 'نسبة',
        herRate: 'نسبتها',
        herDescr: 'وصفها',
        accNo: 'رقم حساب',
        hisName: 'اسمه',
        interestWhenDeserveIt: 'فائدة عند الاستحقاق',
        DateOfDeserveIt: 'تاريخ الاستحقاق',
        guardian: 'الوصي',
        superior: 'ولي الأمر',
        accounts: 'الحسابات',
        accountsProp: ' تفاصيل الحسابات',
        deposit: 'الوديعة',
        searchBy: 'بحث حسب',
        numView: '1 2 3 4',
        charView: 'أ ب ج د',
        hisNo: 'رقمه',
        accOwnerLong: 'صاحب الحساب',
        interestNO: 'ر.الفائدة',
        herCode: 'رمزها',

        searchResult: 'نتيجة البحث',
        clientRelId: 'مميّز العلاقة',
        CheckBookNum: 'رقم الشيك',
        procMethod: 'طريقة المعالجة',
        new: 'جديد',
        correction: 'تصحيح نسب الفوائد للودائع لأجل',
        TermDepositOwner: 'صاحب وديعة لأجل',
        TermDepositSuperior: 'ولي على وديعة لأجل',
        TermDepositDelegacy: 'وصي على وديعة لأجل',
        TermDepositGuardian: 'مفوّض على وديعة لأجل',
        NumberOfDaysInYear: 'عدد أيام السّنة',
        //Noha
        chooseTransType: 'اختر نوع الحوالة',
        transferer: 'طالب التحويل',
        transfererAcc: 'حسابه',
        transfererName: 'اسمه',
        sender: 'المرسل',
        senderAcc: 'حسابه',
        senderName: 'اسمه',
        receiver: 'المستفيد',
        receiverAcc: 'حسابه',
        transAmount: 'مبلغ الحوالة',
        description: 'الوصف',
        commPayer: 'العمولات والنفقات على',
        noPayer: 'بدون',
        commAmount: 'مبلغ العمولة',
        notification: 'الإشعارات',
        primNumber: 'الرقم الرئيسي',
        subNumber: 'الرقم الفرعي',
        discounts: 'الحسميّات',
        sumOf: 'مجموع',
        incomeTax: 'ضريبة دخل',
        localAdmin: 'إدارة محلّيّة',
        reconstruct: 'إعادة إعمار',
        accruedInterest: 'الفائدة المستحقة',
        provisionsAmount: 'مبلغ المؤونة',
        nextYearInterest: 'فائدة السنة التالية',
        currYearInterest_deposition: 'فائدة السنة إيداع',
        rightDate: 'تاريخ حق',
        depositDate: 'تاريخ إيداع',
        first: 'أوّل',
        prepaidInterest: 'الفائدة المدفوعة مسبقا',
        missingInfo: 'المعلومات الناقصة',
        blocked: 'محروم',
        cause: 'بسبب',
        from: 'من',
        to: 'إلى',
        blackList: 'القائمة السوداء',

        //Noha
    },
    router: {
        departments: 'الأقسام',
        departmentsForm: 'Departments Form',
        books: 'الكتب',
        managers: 'المدراء',
        accTree: 'شجرة الحسابات',
        openAccount: 'فتح حساب',
        SalaryLocalization: 'توطين الرواتب',
        progLoading: 'التحميل التدريجي',
        about: 'حول',
        help: 'مساعدة',
        reports: 'التقارير',
        changePass: 'تغيير كلمة المرور',

        TermDeposit: 'وديعة لأجل',
        TermDepositWithPreBenefit: 'فتح حساب وديعة لأجل  - فائدة مسبقة الدّفع',
        pullDepositFor: 'سحب وديعة لأجل',
        freezeTermDeposit: 'تجميد وديعة لأجل',
        unFreezeTermDeposit: 'فك تجميد وديعة لأجل',
        registerTermDepositCliRel: 'تسجيل علاقة متعامل بوديعة لأجل',
        cancelTermDepositCliRel: 'إلغاء علاقة متعامل بوديعة لأجل',
        modifyTermDeposit: 'تعديل وديعة لأجل',
        procOfTermDeposits: 'معالجة ودائع لأجل مستحقّة-غير مسحوبة ',
        procUnpaidTermDeposit: 'معالجة الودائع المستحقّة-غير المدفوعة ',
        definingInterestRates: 'تعريف نسب الفوائد',
        linkingCommissionsToInterest: 'ربط العمولات بالفوائد',
        definingAccountAttributes: 'تعريف صفات الحسابات',
    },
});
