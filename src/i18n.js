const helper = require('think-helper');
const cookie = require('cookie');
const i18n2 = require('i18n-2');
module.exports = class i18n {
    extend(options) {
        // var localeConfigs = this.loadLocaleConfigs(options);
        let {app, getLocale, localesMapping, debugLocale} = options;
        let curLocale, i18n;

        function _getLocale() {
            let locale;
            if (!getLocale) {
                var header = this.ctx.request.header;
                if (header && header['accept-language']) {
                    return header['accept-language'].split(',');
                }
                return [];
            }
            if (helper.isObject(getLocale)) {
                switch (getLocale.by) {
                    case 'query':
                        if (!getLocale.reg) {
                            getLocale.reg = new RegExp(`${getLocale.name}=([^&]*)`);
                        }
                        locale = (getLocale.reg.exec(decodeURIComponent(this.ctx.request.url)) || {})[1];
                        return locale ? [locale] : [];
                    case 'cookie':
                        var c = this.ctx.request.header.cookie;
                        if (c) {
                            locale = cookie.parse(c)[getLocale.name];
                        }
                        return locale ? [locale] : [];
                    default:
                        throw new Error('getLocale.by must be value of "header", "query" or  "cookie".');
                }
            } else if (helper.isFunction(getLocale)) {
                return getLocale(this.ctx);
            }
        }

        // Use it however you wish
        function getI18nInstance(locale) {
            if (!locale) {
                locale = debugLocale || localesMapping(this.getLocale());
            }
            if (!helper.isString(locale)) {
                throw new Error('controller.getI18n(locale), locale must be string or undefined');
            }
            if (locale === curLocale && i18n) return i18n;
            curLocale = locale;
            // Load Module and Instantiate
            i18n = new (i18n2)(options);
            return i18n;
        }

        if (app) {
            app.on('viewInit', (view, controller) => {
                let I18n = controller.getI18n();
                view.assign('__', I18n.__.bind(I18n));
            });
        }
        return {
            controller: {
                getLocale: _getLocale,
                getI18n: getI18nInstance
            }
        };
    }
};
