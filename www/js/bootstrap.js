var constant = {
    url: 'http://'+location.hostname+'/WebserviceCory/',
    user: {},
    versao: '1.0.0',
    model: '',
    platform: 'Android',
    uuid: '',
    version: '',
    cordova: '',
    connection: ''
};



function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    constant.connection = states[networkState];
}

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
function onDeviceReady() {
    checkConnection();
    constant.model = device.model;
    constant.cordova = device.cordova;
    constant.uuid = device.uuid;
    constant.version = device.version;
    constant.platform = device.platform;
}

console.log(constant);

var _session = {
    get: function (b) {
        var c = null;
        if (localStorage.getItem(b) != "" && localStorage.getItem(b) != undefined && localStorage.getItem(b) != null) {
            c = localStorage.getItem(b)
        } else {
            c = null
        }
        return c
    },
    set: function (e, d) {
        localStorage.setItem(e, d)
    },
    remove: function (b) {
        localStorage.removeItem(b)
    },
    clear: function () {
        localStorage.clear()
    }
};

function validarUser() {
    if (constant.user.id == undefined) {
        constant.user.id = undefined;
        redirect('/');
    }
}

function getUer() {
    var n = '     ';
    if (constant.user.id != undefined) {
        var name = constant.user.apelido;
        var s = name.split(' ');
        var t = s.length;
        n = '';
        if (t > 2) {
            for (var i = 0; i < t; i++) {
                if (i === 0) {
                    n += s[i];
                }
                if (i > 0 && i < (t - 1)) {
                    n += ' ' + s[i][0] + '.';
                }
                if (i === (t - 1)) {
                    n += ' ' + s[i];
                }
            }
        } else {
            n = name;
        }


    }
    return n;
}

function number_format(number, decimals, dec_point, thousands_sep) {

    number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
            };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
                .join('0');
    }
    return s.join(dec);
}


function redirect(url) {
    location.href = url;
}

function date(format, timestamp) {
    var that = this;
    var jsdate, f;
    var txt_words = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    var _pad = function (n, c) {
        n = String(n);
        while (n.length < c) {
            n = '0' + n;
        }
        return n;
    };
    f = {
        d: function () {
            return _pad(f.j(), 2);
        },
        D: function () {
            return f.l()
                    .slice(0, 3);
        },
        j: function () {
            return jsdate.getDate();
        },
        l: function () {
            return txt_words[f.w()] + 'day';
        },
        N: function () {
            return f.w() || 7;
        },
        S: function () {
            var j = f.j();
            var i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                i = 0;
            }
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function () {
            return jsdate.getDay();
        },
        z: function () {
            var a = new Date(f.Y(), f.n() - 1, f.j());
            var b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },
        W: function () {
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            var b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },
        F: function () {
            return txt_words[6 + f.n()];
        },
        m: function () {
            return _pad(f.n(), 2);
        },
        M: function () {
            return f.F()
                    .slice(0, 3);
        },
        n: function () {
            return jsdate.getMonth() + 1;
        },
        t: function () {
            return (new Date(f.Y(), f.n(), 0))
                    .getDate();
        },
        L: function () {
            var j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function () {
            var n = f.n();
            var W = f.W();
            var Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function () {
            return jsdate.getFullYear();
        },
        y: function () {
            return f.Y()
                    .toString()
                    .slice(-2);
        },
        a: function () {
            return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A: function () {
            return f.a()
                    .toUpperCase();
        },
        B: function () {
            var H = jsdate.getUTCHours() * 36e2;
            var i = jsdate.getUTCMinutes() * 60;
            var s = jsdate.getUTCSeconds();
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () {
            return f.G() % 12 || 12;
        },
        G: function () {
            return jsdate.getHours();
        },
        h: function () {
            return _pad(f.g(), 2);
        },
        H: function () {
            return _pad(f.G(), 2);
        },
        i: function () {
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () {
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () {
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },
        e: function () {
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () {
            var a = new Date(f.Y(), 0);
            var c = Date.UTC(f.Y(), 0);
            var b = new Date(f.Y(), 6);
            var d = Date.UTC(f.Y(), 6);
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function () {
            var tzo = jsdate.getTimezoneOffset();
            var a = Math.abs(tzo);
            return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () {
            var O = f.O();
            return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T: function () {
            return 'UTC';
        },
        Z: function () {
            return -jsdate.getTimezoneOffset() * 60;
        },
        c: function () {
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () {
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () {
            return jsdate / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}



