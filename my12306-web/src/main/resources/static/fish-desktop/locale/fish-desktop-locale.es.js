!function ($) {
  fish.locale['es'] = $.extend(fish.locale['es'], {
    alert: {
      ok: 'De Acuerdo',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      information: 'Información',
      success: 'Éxito',
      warn: 'Peligro',
      error: 'Error',
      prompt: 'Sugerencia'
    }
  });
}(jQuery);
!function ($) {
    fish.locale['es'] = $.extend(fish.locale['es'], {
        blockUI: {
            loading: 'Cargando...'
        }
    });
}(jQuery);
/**
 * Title: common.es.js
 * Description: common.es.js
 * Author: miaocunzhi
 */
!function ($) {
  fish.locale['es'] = $.extend(fish.locale['es'], {
    common: {
      PLZ_SELECT: '---Por favor seleccione---',
      emptyrecords: "No hay registros de vistas",
      loading: "Cargando..."
    }
  });
}(jQuery);
!function ($) {
  fish.locale['es'] = $.extend(fish.locale['es'], {
    datetimepicker: {
      'days': ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
      'daysShort': ["Dom", "Lun", "Mar", "Mier", "Jue", "Vier", "Sab", "Dom"],
      'daysMin': ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
      'months': ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      'monthsShort': ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      'meridiem': ["am", "pm"],
      'suffix': ["st", "nd", "rd", "th"],
      'today': "Hoy",
      'now': "Ahora",
      'ok': "De acuerdo",
      'chooseHour': "Elija hora",
      'chooseMinute': "Elegir minuto",
      'chooseSecond': "Elija segundo"
    }
  });
}(jQuery);
!function ($) {
  fish.locale['es'] = $.extend(fish.locale['es'], {
    endlessScroll: {
      loading: 'Cargando...'
    }
  });
}(jQuery);
!function ($) {
    fish.locale['es'] = $.extend(fish.locale['es'], {
        fileupload: {
            maxNumberOfFiles: 'Máximo número de archivos excedido',
            acceptFileTypes: 'Tipo de archivo no permitido',
            maxFileSize: 'El archivo es muy grande',
            minFileSize: 'El archivo es muy pequeño'
        }
    });
}(jQuery);
!(function($) {
    fish.locale["es"] = $.extend(fish.locale["es"], {
        grid: {
            defaults: {
                recordtext: "Vista {0} - {1} of {2}",
                pgtext: "Página {0} de {1}"
            },
            search: {
                caption: "Búsqueda...",
                Find: "Buscar",
                Reset: "Limpiar",
                odata: [
                    { oper: "eq", text: "igual " },
                    { oper: "ne", text: "no igual a" },
                    { oper: "lt", text: "menor que" },
                    { oper: "le", text: "menor o igual que" },
                    { oper: "gt", text: "mayor que" },
                    { oper: "ge", text: "mayor o igual a" },
                    { oper: "bw", text: "empiece por" },
                    { oper: "bn", text: "no empiece por" },
                    { oper: "in", text: "está en" },
                    { oper: "ni", text: "no está en" },
                    { oper: "ew", text: "termina por" },
                    { oper: "en", text: "no termina por" },
                    { oper: "cn", text: "contiene" },
                    { oper: "nc", text: "no contiene" },
                    { oper: "nu", text: "is null" },
                    { oper: "nn", text: "is not null" }
                ],
                groupOps: [{ op: "AND", text: "todo" }, { op: "OR", text: "cualquier" }],
                operandTitle: "Click to select search operation.",
                resetTitle: "Reset Search Value"
            },
            edit: {
                addCaption: "Agregar registro",
                editCaption: "Editar registro",
                bSubmit: "Enviar",
                bCancel: "Cancelar",
                bClose: "Cerrar",
                saveData: "La información ha cambiado! Desea guardar los cambios?",
                bYes: "Si",
                bNo: "No",
                bExit: "Cancelar",
                msg: {
                    required: "El campo es requerido",
                    number: "Por favor introducir un número válido",
                    minValue: "El valor debe ser mayor que o igual a",
                    maxValue: "El valor debe ser menor que o igual a",
                    email: "No es un correo electrónico válido ",
                    integer: "Por favor, introducir valor entero válido",
                    date: "Por favor, introducir el valor de fecha válido",
                    url: "No es una URL valida. Prefijo requerido ('http://' or 'https://')",
                    nodefined: " No esta definido!",
                    novalue: " Retornar valor es requerido!",
                    customarray: "Función personalizada deberia retornar matriz!",
                    customfcheck:
                        "Función personalizada deberia estar presente en caso de verificación de personalización!"
                }
            },
            view: {
                caption: "Vista de registro",
                bClose: "Cerrar"
            },
            del: {
                caption: "Borrar",
                msg: "Desea borrar el/los registro(s) seleccionado(s)?",
                bSubmit: "Borrar",
                bCancel: "Cancelar"
            },
            nav: {
                edittext: "",
                edittitle: "Editar fila seleccionada",
                addtext: "",
                addtitle: "Agregar nueva fila",
                deltext: "",
                deltitle: "Borrar fila seleccionada",
                searchtext: "",
                searchtitle: "Encontrar registros",
                refreshtext: "",
                refreshtitle: "Recargar cuadricula ",
                alertcap: "Advertencia",
                alerttext: "Por favor, seleccionar fila",
                viewtext: "",
                viewtitle: "Vista de la fila seleccionada"
            },
            col: {
                caption: "Select columns",
                bSubmit: "De acuerdo",
                bCancel: "Cancelar"
            },
            errors: {
                errcap: "Error",
                nourl: "Ninguna url esta definida",
                norecords: "No hay registros para procesar",
                model: "Longitud de colNames <> colModel!"
            },
            formatter: {
                integer: {
                    thousandsSeparator: ",",
                    defaultValue: "0"
                },
                number: {
                    decimalSeparator: ".",
                    thousandsSeparator: ",",
                    decimalPlaces: 2,
                    defaultValue: "0.00"
                },
                currency: {
                    decimalSeparator: ".",
                    thousandsSeparator: ",",
                    decimalPlaces: 2,
                    prefix: "",
                    suffix: "",
                    defaultValue: "0.00"
                },
                //date: {
                //  dayNames: [
                //    "Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat",
                //    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                //  ],
                //  monthNames: [
                //    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                //    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                //  ],
                //  AmPm: ["am", "pm", "AM", "PM"],
                //  S: function(j) {
                //    return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th';
                //  },
                //  parseRe: /[Tt\\\/:_;.,\t\s-]/,
                //  reformatAfterEdit: true
                //},
                baseLinkUrl: "",
                showAction: "",
                target: "",
                checkbox: {
                    disabled: true
                },
                idName: "id"
            },
            columnsFeature: {
                title: "Función de columnas",
                columnName: "Nombre de columna",
                columnWidth: "Ancho de columna",
                invisibleColumns: "Columnas invisibles",
                visibleColumns: "Columnas visibles",
                checkOneVisible: "Al menos una columna debe ser visible. Por favor elija nuevamente."
            },
            exportFeature: {
                title: "Exportar"
            }
        }
    });
})(jQuery);

!function ($) {
  fish.locale['es'] = $.extend(fish.locale['es'], {
      pagination: {
        pgtext:'Página {0} de {1}',
        recordtext:'Vista {0}-{1}/{2}',
        rowtext:'{0}/ Página',
        gotext:'Ir {0}'
    }
  });
}(jQuery);
!function ($) {
    fish.locale['es'] = $.extend(fish.locale['es'], {
        validator: {
            'msg': {
                defaultMsg: "Este campo no es válido.",
                loadingMsg: "Validando...",
                digits: "Por favor ingresar solo digitos.",
                required: "Este campo es requerido.",
                integer: {
                    '*': "Por favor ingresar un entero",
                    '+': "Por favor ingresar un entero positivo.",
                    '+0': "Por favor ingresar un entero positivo o 0.",
                    '-': "Por favor ingresar un entero negativo.",
                    '-0': "Por favor ingresar un entero negativo o 0."
                },
                'float': {
                    '*': 'Por favor ingresar un número flotante.',
                    '+': 'Por favor ingresar un número flotante positivo.',
                    '+0': 'Por favor ingresar un número flotante positivo o 0. ',
                    '-': 'Por favor ingresar un número flotante negativo.',
                    '-0': 'Por favor ingresar un número flotante negativo o 0.'
                },
                match: {
                    eq: "{0} debe ser igual {1}.",
                    neq: "{0}no debe ser igual {1}.",
                    lt: "{0} debe ser menor que {1}.",
                    datelt: "{0} debe estar mas temprano que  {1}.",
                    datelte: "{0} no puede estar mas tarde que el {1}",
                    gt: "{0} debe ser mas grade que {1}.",
                    dategt: "{0} debe estar mas tarde que {1}.",
                    dategte: "{0} no puede estar mas temprano que el {1}",
                    lte: "{0} debe ser menor o igual a {1}.",
                    gte: "{0} debe ser mayor que o igual a {1}."
                },
                range: {
                    rg: "Por favor ingresar un número entre {1} y {2}.",
                    gte: "Por favor ingresar un número mayor que o igual a {1}.",
                    lte: "Por favor ingresar un número menor que o igual a {1}."
                },
                checked: {
                    eq: "Por favor revise {1} articulos.",
                    rg: "Por favor revise entre {1} y {2} articulos.",
                    gte: "Por favor revise al menos {1} articulos.",
                    lte: "Por favor no revise mas que {1} articulos."
                },
                length: {
                    eq: "Por favor ingresar {1} caracteres.",
                    rg: "Por favor ingresar un valor entre {1} y {2} caracteres de largo.",
                    gte: "Por favor ingresar al menos {1} caracteres.",
                    lte: "Por favor ingresar no mas que {1} caracteres."
                }
            },
            'rules': {
                letters: [/^[a-z]+$/i, "{0} puede solo ingresar letras"], //纯字母
                tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, "El formato del telefono es incorrecto"], //办公或家庭电话
                mobile: [/^1[3-9]\d{9}$/, "El formato del número es incorrecto"], //移动电话
                email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, 'El formato del correo electrónico es incorrecto'],
                qq: [/^[1-9]\d{4,}$/, "El formato del número QQ es incorrecto"],
                date: [/^\d{4}-\d{1,2}-\d{1,2}$/, "Por favor ingresar la fecha correcta [aaaa-mm-dd]"],
                time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "Ingresar la hora correcta [hh:mm(:ss)]"],
                datetime: [/^\d{4}-\d{1,2}-\d{1,2} ([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "Por favor ingresar la fecha y hora correctos [aaaa-mm-dd hh:mm(:ss)]"],
                ID_card: [/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, "Por favor ingresar el número de identificacion correcto"],
                url: [/^(https?|ftp):\/\/[^\s]+$/i, "El formato URL es incorrecto"],
                postcode: [/^[1-9]\d{5}$/, " El formato ZIP es incorrecto"],
                chinese: [/^[\u0391-\uFFE5]+$/, "Por favor ingresar el chino "],
                username: [/^\w{3,12}$/, "Por favor ingresar 3-12 digitos, letras"], //用户名
                password: [/^[0-9a-zA-Z]{6,16}$/, "Contraseña desde 6-16 digitos, letras"], //密码
                ip: [/^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/, 'El formato IP es incorrecto.'],

                //可接受的后缀名
                accept: function (element, params) {
                    if (!params) return true;
                    var ext = params[0];
                    return (ext === '*') ||
                        (new RegExp(".(?:" + (ext || "png|jpg|jpeg|gif") + ")$", "i")).test(element.value) ||
                        this.renderMsg("{1} acepta solo sufijos", ext.replace('|', ','));
                }
            }
        }
    });
}(jQuery);