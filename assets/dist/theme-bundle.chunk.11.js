(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ "./assets/js/theme/checkout.js":
/*!*************************************!*\
  !*** ./assets/js/theme/checkout.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Checkout; });
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _bigcommerce_checkout_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @bigcommerce/checkout-sdk */ "./node_modules/@bigcommerce/checkout-sdk/dist/checkout-sdk.js");
/* harmony import */ var _bigcommerce_checkout_sdk__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_bigcommerce_checkout_sdk__WEBPACK_IMPORTED_MODULE_4__);




function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }



var service = Object(_bigcommerce_checkout_sdk__WEBPACK_IMPORTED_MODULE_4__["createCheckoutService"])();

var Checkout =
/*#__PURE__*/
function (_PageManager) {
  _inheritsLoose(Checkout, _PageManager);

  function Checkout(context) {
    var _this;

    _this = _PageManager.call(this, context) || this;
    _this.pepe = "lol";
    return _assertThisInitialized(_this) || _assertThisInitialized(_this);
  }

  var _proto = Checkout.prototype;

  _proto.onReady =
  /*#__PURE__*/
  function () {
    var _onReady = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var state;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return service.loadCheckout();

            case 2:
              state = _context.sent;
              console.log(state.data.getCheckout());

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function onReady() {
      return _onReady.apply(this, arguments);
    }

    return onReady;
  }();

  return Checkout;
}(_page_manager__WEBPACK_IMPORTED_MODULE_3__["default"]);



/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvdGhlbWUvY2hlY2tvdXQuanMiXSwibmFtZXMiOlsic2VydmljZSIsImNyZWF0ZUNoZWNrb3V0U2VydmljZSIsIkNoZWNrb3V0IiwiY29udGV4dCIsInBlcGUiLCJvblJlYWR5IiwibG9hZENoZWNrb3V0Iiwic3RhdGUiLCJjb25zb2xlIiwibG9nIiwiZGF0YSIsImdldENoZWNrb3V0IiwiUGFnZU1hbmFnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQSxJQUFNQSxPQUFPLEdBQUdDLHVGQUFxQixFQUFyQzs7SUFFcUJDLFE7Ozs7O0FBR2pCLG9CQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLG9DQUFNQSxPQUFOO0FBRUEsVUFBS0MsSUFBTCxHQUFZLEtBQVo7QUFDQTtBQUNIOzs7O1NBRUtDLE87Ozs7OzRCQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQ3dCTCxPQUFPLENBQUNNLFlBQVIsRUFEeEI7O0FBQUE7QUFDVUMsbUJBRFY7QUFFSUMscUJBQU8sQ0FBQ0MsR0FBUixDQUFZRixLQUFLLENBQUNHLElBQU4sQ0FBV0MsV0FBWCxFQUFaOztBQUZKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEs7Ozs7Ozs7Ozs7RUFWa0NDLHFEIiwiZmlsZSI6InRoZW1lLWJ1bmRsZS5jaHVuay4xMS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWdlTWFuYWdlciBmcm9tICcuL3BhZ2UtbWFuYWdlcic7XHJcbmltcG9ydCB7IGNyZWF0ZUNoZWNrb3V0U2VydmljZSB9IGZyb20gJ0BiaWdjb21tZXJjZS9jaGVja291dC1zZGsnO1xyXG5cclxuY29uc3Qgc2VydmljZSA9IGNyZWF0ZUNoZWNrb3V0U2VydmljZSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tvdXQgZXh0ZW5kcyBQYWdlTWFuYWdlciB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihjb250ZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5wZXBlID0gXCJsb2xcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblJlYWR5KCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgc2VydmljZS5sb2FkQ2hlY2tvdXQoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzdGF0ZS5kYXRhLmdldENoZWNrb3V0KCkpO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==