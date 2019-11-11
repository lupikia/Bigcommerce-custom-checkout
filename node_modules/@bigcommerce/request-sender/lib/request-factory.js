"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var queryString = tslib_1.__importStar(require("query-string"));
var RequestFactory = (function () {
    function RequestFactory() {
    }
    RequestFactory.prototype.createRequest = function (url, options) {
        var xhr = new XMLHttpRequest();
        this._configureRequest(xhr, url, options);
        return xhr;
    };
    RequestFactory.prototype._configureRequest = function (xhr, url, options) {
        if (options === void 0) { options = {}; }
        xhr.open(options.method || 'GET', this._formatUrl(url, options.params), true);
        if (options.headers) {
            this._configureRequestHeaders(xhr, options.headers);
        }
        if (typeof options.credentials === 'boolean') {
            xhr.withCredentials = options.credentials;
        }
        if (typeof options.timeout === 'number') {
            xhr.timeout = options.timeout;
        }
    };
    RequestFactory.prototype._configureRequestHeaders = function (xhr, headers) {
        Object.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
        });
    };
    RequestFactory.prototype._formatUrl = function (url, params) {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }
        return url + "?" + queryString.stringify(params);
    };
    return RequestFactory;
}());
exports.default = RequestFactory;
//# sourceMappingURL=request-factory.js.map