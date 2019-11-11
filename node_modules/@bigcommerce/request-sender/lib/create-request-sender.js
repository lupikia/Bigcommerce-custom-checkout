"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cookie = tslib_1.__importStar(require("js-cookie"));
var payload_transformer_1 = tslib_1.__importDefault(require("./payload-transformer"));
var request_factory_1 = tslib_1.__importDefault(require("./request-factory"));
var request_sender_1 = tslib_1.__importDefault(require("./request-sender"));
function createRequestSender(options) {
    return new request_sender_1.default(new request_factory_1.default(), new payload_transformer_1.default(), cookie, options);
}
exports.default = createRequestSender;
//# sourceMappingURL=create-request-sender.js.map