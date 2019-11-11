'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapToInstrumentPayload = mapToInstrumentPayload;
exports.mapToTrustedShippingAddressPayload = mapToTrustedShippingAddressPayload;
exports.mapToHeaders = mapToHeaders;

var _utils = require('../../../common/utils');

/**
 * @param {Object} [data={}]
 * @param {Object} data.billingAddress
 * @param {CreditCard} data.creditCard
 * @param {boolean} data.defaultInstrument
 * @param {string} data.providerName
 * @return {Object}
 */
function mapToInstrumentPayload() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var providerName = data.providerName,
        default_instrument = data.defaultInstrument;


    var provider = (0, _utils.omitNil)({ name: providerName });

    return (0, _utils.omitNil)({
        provider: provider,
        credit_card: mapToCreditCard(data),
        billing_address: mapToAddress(data.billingAddress),
        default_instrument: default_instrument
    });
}

/**
 * @param {Object} [data={}]
 * @param {Object} data.shippingAddress
 * @return {Object}
 */
function mapToTrustedShippingAddressPayload() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _utils.omitNil)({
        shipping_address: mapToAddress(data.shippingAddress)
    });
}

/**
 * @param {Object} data
 * @param {string} data.authToken
 * @return {Object}
 */
function mapToHeaders() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        Authorization = _ref.authToken;

    return (0, _utils.omitNil)({
        Authorization: Authorization
    });
}

/**
 * @param {AddressData} address
 * @return {Object}
 */
function mapToAddress() {
    var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var state = mapToState(address.provinceCode, address.province);

    return (0, _utils.omitNil)({
        address_line_1: address.addressLine1,
        address_line_2: address.addressLine2,
        city: address.city,
        company: address.company,
        country_code: address.countryCode,
        email: address.email,
        first_name: address.firstName,
        last_name: address.lastName,
        phone: address.phone,
        postal_code: address.postCode,
        state: state
    });
}

/**
 * @param {string} code
 * @param {string} name
 * @return {Object}
 */
function mapToState(code, name) {
    return (0, _utils.omitNil)({
        code: code,
        name: name
    });
}

/**
 * @param {Object} data
 * @param {CreditCard} data.creditCard
 * @return {Object}
 */
function mapToCreditCard(_ref2) {
    var _ref2$creditCard = _ref2.creditCard,
        creditCard = _ref2$creditCard === undefined ? {} : _ref2$creditCard;

    var threeDSecure = (0, _utils.omitNil)(creditCard.threeDSecure);

    return (0, _utils.omitNil)({
        cardholder_name: creditCard.cardholderName,
        number: creditCard.number,
        month: creditCard.month,
        year: creditCard.year,
        verification_code: creditCard.verificationCode,
        issue_month: creditCard.issueMonth,
        issue_year: creditCard.issueYear,
        issue_number: creditCard.issueNumber,
        track_data: creditCard.trackData,
        is_manual_entry: creditCard.isManualEntry,
        icc_data: creditCard.iccData,
        fallback_reason: creditCard.fallbackReason,
        is_contactless: creditCard.isContactless,
        encrypted_pin_cryptogram: creditCard.encryptedPinCryptogram,
        encrypted_pin_ksn: creditCard.encryptedPinKsn,
        three_d_secure: threeDSecure
    });
}
//# sourceMappingURL=index.js.map