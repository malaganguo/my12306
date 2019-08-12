!function ($) {
  fish.locale['ar'] = $.extend(fish.locale['ar'], {
    alert: {
      ok: 'موافق',
      cancel: 'الغاء',
      confirm: 'تاكيد',
      information: 'معلومات',
      success: 'نجاح',
      warn: 'تحذير',
      error: 'خطأ',
      prompt: 'فوري'
    }
  });
}(jQuery);

!function ($) {
    fish.locale['ar'] = $.extend(fish.locale['ar'], {
        blockUI: {
            loading: '...تحميل'
        }
    });
}(jQuery);
/**
 * Title: common.ar.js
 * Description: common.ar.js
 * Author: miaocunzhi
 */
!function ($) {
  fish.locale['ar'] = $.extend(fish.locale['ar'], {
    common: {
      PLZ_SELECT: '---الرجاء الاختيار---',
      emptyrecords: "لايوجد بيانات",
      loading: '...تحميل'
    }
  });
}(jQuery);
!function ($) {
  fish.locale['ar'] = $.extend(fish.locale['ar'], {
    datetimepicker: {
      'days': ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت", "الاحد"],
      'daysShort': ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت", "الاحد"],
      'daysMin': ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت", "الاحد"],
      'months': ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو", "يوليو", "اغسطس", "سبتمبر", "اكتوبر", "نوفمبر", "ديسمبر"],
      'monthsShort': ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو", "يوليو", "اغسطس", "سبتمبر", "اكتوبر", "نوفمبر", "ديسمبر"],
      'meridiem': ["صباحا", "مساءا"],
      'suffix': ["الاول", "الثاني", "الثالث", "الترتيب"],
      'today': "اليوم",
      'now': "الان",
      'ok': "موافق",
      'chooseHour': "اختر ساعة",
      'chooseMinute': "اختر دقيقه",
      'chooseSecond': "اختر الثاني"
    }
  });
}(jQuery);
!function ($) {
  fish.locale['ar'] = $.extend(fish.locale['ar'], {
    endlessScroll: {
      loading: '...تحميل'
    }
  });
}(jQuery);
!function ($) {
    fish.locale['ar'] = $.extend(fish.locale['ar'], {
        fileupload: {
            maxNumberOfFiles: 'اقصي حد لعدد الملفات المسموح به',
            acceptFileTypes: 'نوع الملف غير مسموح به',
            maxFileSize: 'حجم الملفات كبير جدا',
            minFileSize: 'حجم الملفات صغير جدا'
        }
    });
}(jQuery);
! function($) {

  fish.locale['ar'] = $.extend(fish.locale['ar'], {
    grid: {
      defaults: {
        recordtext: "عرض {0} - {1} من {2}",
        pgtext: "الصفحة {0} من {1}"
      },
      search: {
        caption: '...بحث',
        Find: "ايجاد",
        Reset: "اعادة تعيين",
        odata: [{
          oper: 'eq',
          text: 'يساوي'
        }, {
          oper: 'ne',
          text: 'لايساوي'
        }, {
          oper: 'lt',
          text: 'اقل'
        }, {
          oper: 'le',
          text: 'اقل او يساوي'
        }, {
          oper: 'gt',
          text: 'اكبر'
        }, {
          oper: 'ge',
          text: 'اكبر من او يساوي'
        }, {
          oper: 'bw',
          text: 'يبدأ ب'
        }, {
          oper: 'bn',
          text: 'لايبدأ ب'
        }, {
          oper: 'in',
          text: 'is in'
        }, {
          oper: 'ni',
          text: 'لايوجد ف'
        }, {
          oper: 'ew',
          text: 'ينتهي ب'
        }, {
          oper: 'en',
          text: 'لاينتهي ب'
        }, {
          oper: 'cn',
          text: 'يحتوي'
        }, {
          oper: 'nc',
          text: 'لايحتوي'
        }],
        groupOps: [{
          op: "و",
          text: "كل"
        }, {
          op: "او",
          text: "اي"
        }],
        operandTitle : "Click to select search operation.",
		resetTitle : "Reset Search Value"
      },
      edit: {
        addCaption: "اضافة سجل",
        editCaption: "تعديل سجل",
        bSubmit: "تنفيذ",
        bCancel: "الغاء",
        bClose: "اغلاق",
        saveData: "تم تغيير البيانات!! هل تريد حفظها؟؟",
        bYes: "نعم",
        bNo: "لا",
        bExit: "الغاء",
        msg: {
          required: "الحقل مطلوب",
          number: "الرجاء ادخال رقم بقيمة صحيحة",
          minValue: "القيمة يجب ان تكون اكبر من او تساوي",
          maxValue: "القيمة يجب ان تكون اقل من او يساوي",
          email: "البريد الالكتروني غير صحيح",
          integer: "الرجاء ادخال رقم صحيح",
          date: "الرجاء ادخال تاريخ صحيح",
          url: "//:http او //:https عنوان الرابط غير صحيح , يجب ان يبدأ",
          nodefined: "غير معرف",
          novalue: "القيمة الراجعة مطلوبة",
          customarray: "الدالة يجب ان ترجع مصفوفة",
          customfcheck: "الدالة يجب ان تكون موجودة بوجود حالة الفحص"
        }
      },
      view: {
        caption: "عرض السجلات",
        bClose: "اغلاق"
      },
      del: {
        caption: "حذف",
        msg: "هل تريد حذف السجلات؟",
        bSubmit: "حذف",
        bCancel: "الغاء"
      },
      nav: {
        edittext: "",
        edittitle: "تعديل الصف المختار",
        addtext: "",
        addtitle: "اضافة صف جديد",
        deltext: "",
        deltitle: "حذف الصف المختار",
        searchtext: "",
        searchtitle: "ايجاد سجلات",
        refreshtext: "",
        refreshtitle: "اعادة تحميل الجدول",
        alertcap: "تحذير",
        alerttext: "الرجاء اختيار الصف",
        viewtext: "",
        viewtitle: "عرض الصف المختار"
      },
      col: {
        caption: "اختيار اعمدة",
        bSubmit: "حذف",
        bCancel: "الغاء"
      },
      errors: {
        errcap: "خطأ",
        nourl: "لايوجد رابط",
        norecords: "لايوجد سجلات للمعالجة",
        model: "Length of colNames <> colModel!"
      },
      formatter: {
        integer: {
          thousandsSeparator: ",",
          defaultValue: '0'
        },
        number: {
          decimalSeparator: ".",
          thousandsSeparator: ",",
          decimalPlaces: 2,
          defaultValue: '0.00'
        },
        currency: {
          decimalSeparator: ".",
          thousandsSeparator: ",",
          decimalPlaces: 2,
          prefix: "",
          suffix: "",
          defaultValue: '0.00'
        },
        baseLinkUrl: '',
        showAction: '',
        target: '',
        checkbox: {
          disabled: true
        },
        idName: 'id'
      },
      columnsFeature: {
        title: 'خيارات الاعمدة',
        columnName: 'اسم العمود',
        columnWidth: 'عرض العمود',
        invisibleColumns: 'اعمدة غير مرئية',
        visibleColumns: 'اعمدة مرئية',
        checkOneVisible: 'علي الاقل عمود واحد يجب ان يكون مرئي, الرجاء المحاولة مرة اخري'
      },
      exportFeature: {
        title: 'تصدير'
      }
    }
  });
}(jQuery);
!function ($) {
  fish.locale['ar'] = $.extend(fish.locale['ar'], {
      pagination: {
        pgtext: "الصفحة {0} من {1}",
        recordtext: "عرض {0} - {1} / {2}",
        rowtext: '{0} / الصفحة',
        gotext: 'انتقل إلى {0}'
    }
  });
}(jQuery);
!function ($) {
    fish.locale['ar'] = $.extend(fish.locale['ar'], {
        validator: {
            'msg': {
                defaultMsg: "هذا الحقل غير مقبول",
                loadingMsg: "...فحص القابلية",
                digits: "الرجاء ادخال ارقام فقط",
                required: "هذا الحقل مطلوب",
                integer: {
                    '*': "الرجاء ادخال رقم صحيح",
                    '+': "الرجاء ادخال رقم صحيح موجب",
                    '+0': "الرجاء ادخال رقم صحيح موجب او 0",
                    '-': "الرجاء ادخال رقم صحيح سالب",
                    '-0': "الرجاء ادخال رقم صحيح سالب او 0"
                },
                'float': {
                    '*': 'الرجاء ادخال رقم حقيقي',
                    '+': 'الرجاء ادخال رقم حقيقي موجب',
                    '+0': 'الرجاء ادخال رقم حقيقي موجب او 0',
                    '-': 'الرجاء ادخال رقم حقيقي سالب',
                    '-0': 'الرجاء ادخال رقم حقيقي سالب او 0'
                },
                match: {
                    eq: "{0} يجب أن يكون مساويا ل{1}",
                    neq: "{0} لا يجب أن يكون على قدم المساواة إلى {1}",
                    lt: "{0} يجب أن يكون أقل من {1}",
                    datelt: "{0} يجب أن تكون في وقت سابق من {1}",
                    datelte: "{0} لا يمكن أن يكون في وقت لاحق من {1}",
                    gt: "{0} يجب أن تكون أكبر من {1}",
                    dategt: "{0} يجب أن يكون في وقت لاحق من {1}",
                    dategte: "{0} لا يمكن أن يكون في وقت سابق من {1}",
                    lte: "{0} يجب أن يكون أقل من أو يساوي {1}",
                    gte: "{0} يجب أن تكون أكبر من أو يساوي {1}"
                },
                range: {
                    rg: "يرجى إدخال رقم بين {1} و {2}",
                    gte: "الرجاء إدخال عدد أكبر من أو يساوي {1}",
                    lte: "الرجاء إدخال عدد أقل من أو يساوي {1}"
                },
                checked: {
                    eq: "يرجى التحقق من {1} البنود",
                    rg: "يرجى التحقق من بين {1} و {2} البنود",
                    gte: "يرجى مراجعة على الأقل {1} البنود",
                    lte: "يرجى مراجعة أي أكثر من {1} البنود"
                },
                length: {
                    eq: "الرجاء إدخال {1} حرف",
                    rg: "الرجاء إدخال قيمة بين {1} و {2} حرفا",
                    gte: "الرجاء إدخال ما لا يقل عن {1} حرف",
                    lte: "الرجاء إدخال ما لا يزيد عن {1} حرف"
                }
            },
            'rules': {
                letters: [/^[a-z]+$/i, "{0} يمكن أن تدخل فقط الرسائل"], //纯字母
                tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, "شكل الهاتف غير صحيح"], //办公或家庭电话
                mobile: [/^1[3-9]\d{9}$/, "تنسيق رقم الهاتف غير صحيح"], //移动电话
                email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, 'تنسيق البريد الإلكتروني غير صحيح'],
                qq: [/^[1-9]\d{4,}$/, "صيغة رفم كيو كيو غير صحيحة"],
                date: [/^\d{4}-\d{1,2}-\d{1,2}$/, "yyyy-mm-dd الرجاء ادخال صيغة صحيحة للتاريخ"],
                time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "الرجاء اختيار صيغة للوقت صحيحة hh:ii(:ss)"],
                datetime: [/^\d{4}-\d{1,2}-\d{1,2} ([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "الرجاء اختيار صيغة صحيحة للتاريخ yyyy-mm-dd hh:ii(:ss)"],
                ID_card: [/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, "الرجاء اختيار رقم تعريف صحيح"],
                url: [/^(https?|ftp):\/\/[^\s]+$/i, "صيغة الرابط غير صحيحة"],
                postcode: [/^[1-9]\d{5}$/, "رقم المنطقة غير صحيح"],
                chinese: [/^[\u0391-\uFFE5]+$/, "الرجاء ادخال كتابة صينية"],
                username: [/^\w{3,12}$/, "الرجاء ادخال ارقام من 3-12 رقم او حروف او _"], //用户名
                password: [/^[0-9a-zA-Z]{6,16}$/, "كلمة السر من 6-16  رقم او حروف"], //密码
                ip: [/^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/, 'عنوان IP غير صحيح'],

                //可接受的后缀名
                accept: function (element, params) {
                    if (!params) return true;
                    var ext = params[0];
                    return (ext === '*') ||
                        (new RegExp(".(?:" + (ext || "png|jpg|jpeg|gif") + ")$", "i")).test(element.value) ||
                        this.renderMsg("تقبل اللاحقة فقط {1}", ext.replace('|', ','));
                }
            }
        }
    });
}(jQuery);