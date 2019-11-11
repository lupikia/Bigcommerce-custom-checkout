"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var timeout_1 = tslib_1.__importDefault(require("./timeout"));
function createTimeout(delay) {
    return new timeout_1.default(delay);
}
exports.default = createTimeout;
//# sourceMappingURL=create-timeout.js.map