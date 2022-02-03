/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./serverless/src/cloudfrontToCloudwatch/handler.js":
/*!**********************************************************!*\
  !*** ./serverless/src/cloudfrontToCloudwatch/handler.js ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! zlib */ \"zlib\");\n/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(zlib__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var array_foreach_async__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! array-foreach-async */ \"array-foreach-async\");\n/* harmony import */ var array_foreach_async__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(array_foreach_async__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../sharedUtils/parseError */ \"./sharedUtils/parseError.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n // Promisify node method\n\nvar gunzip = util__WEBPACK_IMPORTED_MODULE_2___default().promisify((zlib__WEBPACK_IMPORTED_MODULE_3___default().gunzip));\nvar s3;\n/**\n * Process provided Cloudwatch logs triggered by S3\n * @param {Object} event Details about the S3 event\n */\n\nvar cloudfrontToCloudwatch = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee2(event) {\n    var _event$Records, s3Records;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            _event$Records = event.Records, s3Records = _event$Records === void 0 ? [] : _event$Records;\n\n            if (!(s3Records.length === 0)) {\n              _context2.next = 3;\n              break;\n            }\n\n            return _context2.abrupt(\"return\");\n\n          case 3:\n            console.log(\"Processing \".concat(s3Records.length, \" files(s)\"));\n            s3 = new (aws_sdk__WEBPACK_IMPORTED_MODULE_5___default().S3)();\n            _context2.next = 7;\n            return s3Records.forEachAsync( /*#__PURE__*/function () {\n              var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(record) {\n                var s3Record, bucket, object, bucketName, objectKey, s3Object, s3ObjectBody, s3ObjectUnzipped, fileLines;\n                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n                  while (1) {\n                    switch (_context.prev = _context.next) {\n                      case 0:\n                        s3Record = record.s3;\n                        bucket = s3Record.bucket, object = s3Record.object;\n                        bucketName = bucket.name;\n                        objectKey = object.key;\n                        _context.prev = 4;\n                        _context.next = 7;\n                        return s3.getObject({\n                          Bucket: bucketName,\n                          Key: objectKey\n                        }).promise();\n\n                      case 7:\n                        s3Object = _context.sent;\n                        // Extract the body of the object\n                        s3ObjectBody = s3Object.Body; // Unzip the log file\n\n                        _context.next = 11;\n                        return gunzip(s3ObjectBody);\n\n                      case 11:\n                        s3ObjectUnzipped = _context.sent;\n                        // Split the file into individual logs\n                        fileLines = s3ObjectUnzipped.toString().split('\\n'); // Filter out empty lines\n\n                        // Filter out empty lines\n                        fileLines.filter(Boolean).forEach(function (line) {\n                          // Ignore comment lines from AWS\n                          // #Version: 1.0\n                          // #Fields: date time x - edge - location sc - bytes c - ip cs - method cs(Host) cs - uri - stem sc - status cs(Referer) cs(User - Agent) cs - uri - query cs(Cookie) x - edge - result - type x - edge - request - id x - host - header cs - protocol cs - bytes time - taken x - forwarded -for ssl - protocol ssl - cipher x - edge - response - result - type cs - protocol - version fle - status fle - encrypted - fields c - port time - to - first - byte x - edge - detailed - result - type sc - content - type sc - content - len sc - range - start sc - range - end\n                          if (line[0] !== '#') {\n                            console.log(line);\n                          }\n                        });\n                        _context.next = 19;\n                        break;\n\n                      case 16:\n                        _context.prev = 16;\n                        _context.t0 = _context[\"catch\"](4);\n                        (0,_sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_6__.parseError)(_context.t0);\n\n                      case 19:\n                      case \"end\":\n                        return _context.stop();\n                    }\n                  }\n                }, _callee, null, [[4, 16]]);\n              }));\n\n              return function (_x2) {\n                return _ref2.apply(this, arguments);\n              };\n            }());\n\n          case 7:\n          case \"end\":\n            return _context2.stop();\n        }\n      }\n    }, _callee2);\n  }));\n\n  return function cloudfrontToCloudwatch(_x) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar _default = cloudfrontToCloudwatch;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(gunzip, \"gunzip\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/cloudfrontToCloudwatch/handler.js\");\n  reactHotLoader.register(s3, \"s3\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/cloudfrontToCloudwatch/handler.js\");\n  reactHotLoader.register(cloudfrontToCloudwatch, \"cloudfrontToCloudwatch\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/cloudfrontToCloudwatch/handler.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/cloudfrontToCloudwatch/handler.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/cloudfrontToCloudwatch/handler.js?");

/***/ }),

/***/ "./sharedUtils/parseError.js":
/*!***********************************!*\
  !*** ./sharedUtils/parseError.js ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"parseError\": () => (/* binding */ parseError)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ \"@babel/runtime/helpers/typeof\");\n/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fast-xml-parser */ \"fast-xml-parser\");\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Parse and return a lambda friendly response to errors\n * @param {Object} errorObj The error object that was thrown\n * @param {Boolean} shouldLog Whether or not to log the exceptions found\n */\n\nvar parseError = function parseError(errorObj) {\n  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n      _ref$shouldLog = _ref.shouldLog,\n      shouldLog = _ref$shouldLog === void 0 ? true : _ref$shouldLog,\n      _ref$asJSON = _ref.asJSON,\n      asJSON = _ref$asJSON === void 0 ? true : _ref$asJSON,\n      _ref$reThrowError = _ref.reThrowError,\n      reThrowError = _ref$reThrowError === void 0 ? false : _ref$reThrowError,\n      logPrefix = _ref.logPrefix;\n\n  var _errorObj$name = errorObj.name,\n      name = _errorObj$name === void 0 ? 'Error' : _errorObj$name,\n      _errorObj$response = errorObj.response,\n      response = _errorObj$response === void 0 ? {} : _errorObj$response;\n  var errorArray = [];\n  var code = 500;\n\n  if (Object.keys(response).length) {\n    var _response$data = response.data,\n        data = _response$data === void 0 ? {} : _response$data,\n        _response$headers = response.headers,\n        headers = _response$headers === void 0 ? {} : _response$headers,\n        status = response.status,\n        statusText = response.statusText;\n    code = status;\n    var harmonyError = data.description,\n        hucError = data.error,\n        hucSocketError = data.message;\n    var _headers$contentType = headers['content-type'],\n        contentType = _headers$contentType === void 0 ? '' : _headers$contentType;\n\n    if (contentType.indexOf('application/opensearchdescription+xml') > -1) {\n      // OpenSearch collections can return errors in XML, ensure we capture them\n      var osddBody = (0,fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__.parse)(data, {\n        ignoreAttributes: false,\n        attributeNamePrefix: ''\n      });\n      var _osddBody$feed = osddBody.feed,\n          feed = _osddBody$feed === void 0 ? {} : _osddBody$feed,\n          _osddBody$OpenSearchD = osddBody.OpenSearchDescription,\n          description = _osddBody$OpenSearchD === void 0 ? {} : _osddBody$OpenSearchD; // Granule errors will come from within a `feed` element\n\n      var subtitle = feed.subtitle;\n\n      if (description) {\n        var errorMessage = description.Description;\n        errorArray = [errorMessage];\n      }\n\n      if (subtitle) {\n        if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(subtitle) === 'object' && subtitle !== null) {\n          var text = subtitle['#text'];\n          errorArray = [text];\n        } else {\n          errorArray = [subtitle];\n        }\n      }\n    } else if (contentType.indexOf('text/xml') > -1) {\n      // OpenSearch collections can return errors in XML, ensure we capture them\n      var gibsError = (0,fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__.parse)(data, {\n        ignoreAttributes: false,\n        attributeNamePrefix: ''\n      });\n      var report = gibsError.ExceptionReport;\n      var exception = report.Exception;\n      var _errorMessage = exception.ExceptionText;\n      errorArray = [_errorMessage];\n    } else if (harmonyError) {\n      // Harmony uses code/description object in the response\n      errorArray = [harmonyError];\n    } else if (hucError || hucSocketError) {\n      // HUC uses code/description object in the response\n      errorArray = [hucError || hucSocketError];\n    } else if (contentType.indexOf('text/html') > -1) {\n      // If the error is from Axios and the content type is html, build a string error using the status code and status text\n      errorArray = [\"\".concat(name, \" (\").concat(code, \"): \").concat(statusText)];\n    } else {\n      // Default to CMR error response body\n      var _data$errors = data.errors;\n      errorArray = _data$errors === void 0 ? ['Unknown Error'] : _data$errors;\n    }\n\n    if (shouldLog) {\n      // Log each error provided\n      errorArray.forEach(function (message) {\n        var logParts = [logPrefix, \"\".concat(name, \" (\").concat(code, \"): \").concat(message)];\n        console.log(logParts.filter(Boolean).join(' '));\n      });\n    }\n  } else {\n    var logParts = [logPrefix, errorObj.toString()];\n\n    if (shouldLog) {\n      console.log(logParts.filter(Boolean).join(' '));\n    }\n\n    errorArray = [logParts.filter(Boolean).join(' ')];\n  } // If the error needs to be thrown again, do so before returning\n\n\n  if (reThrowError) {\n    throw errorObj;\n  }\n\n  if (asJSON) {\n    return {\n      statusCode: code,\n      body: JSON.stringify({\n        statusCode: code,\n        errors: errorArray\n      })\n    };\n  }\n\n  return errorArray;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(parseError, \"parseError\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/parseError.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/parseError.js?");

/***/ }),

/***/ "@babel/runtime/helpers/asyncToGenerator":
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "@babel/runtime/helpers/typeof":
/*!************************************************!*\
  !*** external "@babel/runtime/helpers/typeof" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/typeof");

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "array-foreach-async":
/*!**************************************!*\
  !*** external "array-foreach-async" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("array-foreach-async");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");

/***/ }),

/***/ "fast-xml-parser":
/*!**********************************!*\
  !*** external "fast-xml-parser" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("fast-xml-parser");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./serverless/src/cloudfrontToCloudwatch/handler.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;