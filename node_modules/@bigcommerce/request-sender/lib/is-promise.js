"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPromise(promise) {
    return !!promise &&
        (typeof promise === 'object' || typeof promise === 'function') &&
        typeof promise.then === 'function';
}
exports.default = isPromise;
//# sourceMappingURL=is-promise.js.map