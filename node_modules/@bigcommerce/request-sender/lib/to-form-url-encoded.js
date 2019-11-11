"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toFormUrlEncoded(data) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    return Object.keys(data)
        .filter(function (key) { return data[key] !== undefined; })
        .map(function (key) {
        var value = data[key];
        if (typeof value === 'string') {
            return key + "=" + encodeURIComponent(value);
        }
        return key + "=" + encodeURIComponent(JSON.stringify(value) || '');
    })
        .join('&');
}
exports.default = toFormUrlEncoded;
//# sourceMappingURL=to-form-url-encoded.js.map