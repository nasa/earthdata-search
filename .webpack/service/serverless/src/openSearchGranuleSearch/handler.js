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

/***/ "./serverless/src/openSearchGranuleSearch/getOpenSearchGranulesUrl.js":
/*!****************************************************************************!*\
  !*** ./serverless/src/openSearchGranuleSearch/getOpenSearchGranulesUrl.js ***!
  \****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getOpenSearchGranulesUrl\": () => (/* binding */ getOpenSearchGranulesUrl)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fast-xml-parser */ \"fast-xml-parser\");\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fast_xml_parser__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../sharedUtils/getClientId */ \"./sharedUtils/getClientId.js\");\n/* harmony import */ var _sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../sharedUtils/parseError */ \"./sharedUtils/parseError.js\");\n/* harmony import */ var _util_wrapAxios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/wrapAxios */ \"./serverless/src/util/wrapAxios.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\nvar wrappedAxios = (0,_util_wrapAxios__WEBPACK_IMPORTED_MODULE_6__.wrapAxios)((axios__WEBPACK_IMPORTED_MODULE_2___default()));\n/**\n * Get the URL that will be used to retrieve granules from OpenSearch\n * @param {String} collectionId The collection ID to retrieve the url for.\n * @return {Object} An object representing the OpenSearch OSDD or an error message\n */\n\nvar getOpenSearchGranulesUrl = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(collectionId, openSearchOsddUrl) {\n    var osddResponse, config, data, elapsedTime, osddBody, _osddBody$OpenSearchD, opensearchDescription, _opensearchDescriptio, granuleUrls;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            console.log(\"OpenSearch OSDD: \".concat(openSearchOsddUrl));\n            _context.prev = 1;\n            _context.next = 4;\n            return wrappedAxios.get(openSearchOsddUrl, {\n              headers: {\n                'Client-Id': (0,_sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_4__.getClientId)().lambda\n              }\n            });\n\n          case 4:\n            osddResponse = _context.sent;\n            config = osddResponse.config, data = osddResponse.data;\n            elapsedTime = config.elapsedTime;\n            console.log(\"Request for granules URL for OpenSearch collection '\".concat(collectionId, \"' successfully completed in \").concat(elapsedTime, \" ms\"));\n            osddBody = (0,fast_xml_parser__WEBPACK_IMPORTED_MODULE_3__.parse)(data, {\n              attributeNamePrefix: '',\n              ignoreAttributes: false,\n              ignoreNameSpace: true\n            });\n            _osddBody$OpenSearchD = osddBody.OpenSearchDescription, opensearchDescription = _osddBody$OpenSearchD === void 0 ? {} : _osddBody$OpenSearchD;\n            _opensearchDescriptio = opensearchDescription.Url, granuleUrls = _opensearchDescriptio === void 0 ? [] : _opensearchDescriptio;\n\n            if (!Array.isArray(granuleUrls)) {\n              granuleUrls = [granuleUrls];\n            }\n\n            return _context.abrupt(\"return\", {\n              statusCode: osddResponse.status,\n              body: granuleUrls.find(function (url) {\n                return url.type === 'application/atom+xml';\n              })\n            });\n\n          case 15:\n            _context.prev = 15;\n            _context.t0 = _context[\"catch\"](1);\n            return _context.abrupt(\"return\", (0,_sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_5__.parseError)(_context.t0));\n\n          case 18:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, null, [[1, 15]]);\n  }));\n\n  return function getOpenSearchGranulesUrl(_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(wrappedAxios, \"wrappedAxios\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/openSearchGranuleSearch/getOpenSearchGranulesUrl.js\");\n  reactHotLoader.register(getOpenSearchGranulesUrl, \"getOpenSearchGranulesUrl\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/openSearchGranuleSearch/getOpenSearchGranulesUrl.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/openSearchGranuleSearch/getOpenSearchGranulesUrl.js?");

/***/ }),

/***/ "./serverless/src/openSearchGranuleSearch/handler.js":
/*!***********************************************************!*\
  !*** ./serverless/src/openSearchGranuleSearch/handler.js ***!
  \***********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* harmony import */ var _sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../sharedUtils/getClientId */ \"./sharedUtils/getClientId.js\");\n/* harmony import */ var _getOpenSearchGranulesUrl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getOpenSearchGranulesUrl */ \"./serverless/src/openSearchGranuleSearch/getOpenSearchGranulesUrl.js\");\n/* harmony import */ var _sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../sharedUtils/parseError */ \"./sharedUtils/parseError.js\");\n/* harmony import */ var _util_pick__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../util/pick */ \"./serverless/src/util/pick.js\");\n/* harmony import */ var _util_cmr_prepareExposeHeaders__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../util/cmr/prepareExposeHeaders */ \"./serverless/src/util/cmr/prepareExposeHeaders.js\");\n/* harmony import */ var _renderOpenSearchTemplate__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./renderOpenSearchTemplate */ \"./serverless/src/openSearchGranuleSearch/renderOpenSearchTemplate.js\");\n/* harmony import */ var _util_requestTimeout__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../util/requestTimeout */ \"./serverless/src/util/requestTimeout.js\");\n/* harmony import */ var _util_wrapAxios__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../util/wrapAxios */ \"./serverless/src/util/wrapAxios.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n\n\n\n\n\nvar wrappedAxios = (0,_util_wrapAxios__WEBPACK_IMPORTED_MODULE_12__.wrapAxios)((axios__WEBPACK_IMPORTED_MODULE_3___default()));\n/**\n * Retrieve granules from OpenSearch\n * @param {Object} event Details about the HTTP request that it received\n */\n\nvar openSearchGranuleSearch = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(event) {\n    var _getApplicationConfig, defaultResponseHeaders, responseHeaders, body, _JSON$parse, params, echoCollectionId, openSearchOsdd, permittedOpenSearchParams, obj, openSearchUrlResponse, _body, parsedResponse, template, renderedTemplate, granuleResponse, config, data, elapsedTime, code, _config, timeout;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            // The headers we'll send back regardless of our response\n            _getApplicationConfig = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__.getApplicationConfig)(), defaultResponseHeaders = _getApplicationConfig.defaultResponseHeaders;\n            responseHeaders = _objectSpread(_objectSpread({}, defaultResponseHeaders), {}, {\n              'Content-Type': 'application/xml'\n            });\n            body = event.body;\n            _JSON$parse = JSON.parse(body), params = _JSON$parse.params;\n            echoCollectionId = params.echoCollectionId, openSearchOsdd = params.openSearchOsdd; // Whitelist parameters supplied by the request\n\n            permittedOpenSearchParams = ['boundingBox', 'echoCollectionId', 'openSearchOsdd', 'pageNum', 'pageSize', 'point', 'temporal'];\n            console.log(\"Parameters received: \".concat(Object.keys(params)));\n            obj = (0,_util_pick__WEBPACK_IMPORTED_MODULE_8__.pick)(params, permittedOpenSearchParams);\n            console.log(\"Filtered parameters: \".concat(Object.keys(obj)));\n            _context.next = 11;\n            return (0,_getOpenSearchGranulesUrl__WEBPACK_IMPORTED_MODULE_6__.getOpenSearchGranulesUrl)(echoCollectionId, openSearchOsdd);\n\n          case 11:\n            openSearchUrlResponse = _context.sent;\n            console.log(\"Completed OSDD request with status \".concat(openSearchUrlResponse.statusCode, \".\"));\n\n            if (!(openSearchUrlResponse.statusCode !== 200)) {\n              _context.next = 17;\n              break;\n            }\n\n            _body = openSearchUrlResponse.body;\n            parsedResponse = JSON.parse(_body);\n            return _context.abrupt(\"return\", {\n              isBase64Encoded: false,\n              statusCode: openSearchUrlResponse.statusCode,\n              headers: responseHeaders,\n              body: JSON.stringify({\n                errors: parsedResponse.errors\n              })\n            });\n\n          case 17:\n            template = openSearchUrlResponse.body.template;\n            renderedTemplate = (0,_renderOpenSearchTemplate__WEBPACK_IMPORTED_MODULE_10__.renderOpenSearchTemplate)(template, obj);\n            console.log(\"OpenSearch Granule Query: \".concat(renderedTemplate));\n            _context.prev = 20;\n            _context.next = 23;\n            return wrappedAxios({\n              method: 'get',\n              url: renderedTemplate,\n              timeout: (0,_util_requestTimeout__WEBPACK_IMPORTED_MODULE_11__.requestTimeout)({\n                definedTimeout: 60\n              }),\n              headers: {\n                'Client-Id': (0,_sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_5__.getClientId)().lambda\n              }\n            });\n\n          case 23:\n            granuleResponse = _context.sent;\n            config = granuleResponse.config, data = granuleResponse.data;\n            elapsedTime = config.elapsedTime;\n            console.log(\"OpenSearch Granule Request took \".concat(elapsedTime, \" ms\"));\n            return _context.abrupt(\"return\", {\n              isBase64Encoded: false,\n              statusCode: granuleResponse.status,\n              headers: _objectSpread(_objectSpread({}, responseHeaders), {}, {\n                'access-control-expose-headers': (0,_util_cmr_prepareExposeHeaders__WEBPACK_IMPORTED_MODULE_9__.prepareExposeHeaders)(responseHeaders)\n              }),\n              body: data\n            });\n\n          case 30:\n            _context.prev = 30;\n            _context.t0 = _context[\"catch\"](20);\n            code = _context.t0.code, _config = _context.t0.config;\n            timeout = _config.timeout; // Handle timeouts specifically so that we can use a more human\n            // readable error, the default uses millisecond\n\n            if (!(code === 'ECONNABORTED')) {\n              _context.next = 36;\n              break;\n            }\n\n            return _context.abrupt(\"return\", {\n              isBase64Encoded: false,\n              headers: defaultResponseHeaders,\n              statusCode: 504,\n              body: JSON.stringify({\n                errors: [\"Timeout of \".concat(timeout / 1000, \"s exceeded\")]\n              })\n            });\n\n          case 36:\n            return _context.abrupt(\"return\", _objectSpread({\n              isBase64Encoded: false,\n              headers: defaultResponseHeaders\n            }, (0,_sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_7__.parseError)(_context.t0)));\n\n          case 37:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, null, [[20, 30]]);\n  }));\n\n  return function openSearchGranuleSearch(_x) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar _default = openSearchGranuleSearch;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(wrappedAxios, \"wrappedAxios\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/openSearchGranuleSearch/handler.js\");\n  reactHotLoader.register(openSearchGranuleSearch, \"openSearchGranuleSearch\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/openSearchGranuleSearch/handler.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/openSearchGranuleSearch/handler.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/openSearchGranuleSearch/handler.js?");

/***/ }),

/***/ "./serverless/src/openSearchGranuleSearch/renderOpenSearchTemplate.js":
/*!****************************************************************************!*\
  !*** ./serverless/src/openSearchGranuleSearch/renderOpenSearchTemplate.js ***!
  \****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"renderOpenSearchTemplate\": () => (/* binding */ renderOpenSearchTemplate)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"@babel/runtime/helpers/slicedToArray\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Replaces all valid keys from the users request within the granule url template provided by OpenSearch\n * @param {String} template - An OpenSearch string template representing the URL to retreive granules with.\n * @param {Object} params - The parameters from the users request to supply to the template.\n * @return {String} A formatted URL with the users request parameters inserted\n */\nvar renderOpenSearchTemplate = function renderOpenSearchTemplate(template, params) {\n  // Ampersands in the URL throw off OpenSearch\n  var renderedTemplate = template.replace(/&amp;/g, '&');\n  var echoCollectionId = params.echoCollectionId,\n      pageNum = params.pageNum,\n      _params$pageSize = params.pageSize,\n      pageSize = _params$pageSize === void 0 ? 20 : _params$pageSize,\n      boundingBox = params.boundingBox,\n      point = params.point,\n      temporal = params.temporal;\n  renderedTemplate = renderedTemplate.replace(/{count\\??}/, pageSize);\n  renderedTemplate = renderedTemplate.replace(/{datasetId\\??}/, echoCollectionId);\n\n  if (pageNum) {\n    var startIndex = (pageNum - 1) * pageSize + 1;\n    renderedTemplate = renderedTemplate.replace(/{startIndex\\??}/, startIndex);\n  }\n\n  if (boundingBox) {\n    renderedTemplate = renderedTemplate.replace(/{geo:box\\??}/, boundingBox);\n  }\n\n  if (point) {\n    // OpenSearch doesn't support point search so to add that functionality to\n    // to our app we use the point and make a tiny bounding box around the point\n    var _point$split = point.split(','),\n        _point$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_point$split, 2),\n        lon = _point$split2[0],\n        lat = _point$split2[1];\n\n    var epsilon = 0.001;\n    var boundingBoxFromPoint = [lon - epsilon, lat - epsilon, lon + epsilon, lat + epsilon].join(',');\n    renderedTemplate = renderedTemplate.replace(/{geo:box\\??}/, boundingBoxFromPoint);\n  }\n\n  if (temporal) {\n    var _temporal$split = temporal.split(','),\n        _temporal$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_temporal$split, 2),\n        timeStart = _temporal$split2[0],\n        timeEnd = _temporal$split2[1];\n\n    renderedTemplate = renderedTemplate.replace(/{time:start\\??}/, timeStart.replace(/\\.\\d{3}Z$/, 'Z'));\n    renderedTemplate = renderedTemplate.replace(/{time:end\\??}/, timeEnd.replace(/\\.\\d{3}Z$/, 'Z'));\n  } // Remove any empty params from the template\n\n\n  return renderedTemplate.replace(/(?<=[?&])[^=]*=\\{[^}]*\\}/g, '').replace(/&{2,}/g, '&').replace(/\\?&/g, '?');\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(renderOpenSearchTemplate, \"renderOpenSearchTemplate\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/openSearchGranuleSearch/renderOpenSearchTemplate.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/openSearchGranuleSearch/renderOpenSearchTemplate.js?");

/***/ }),

/***/ "./serverless/src/util/cmr/prepareExposeHeaders.js":
/*!*********************************************************!*\
  !*** ./serverless/src/util/cmr/prepareExposeHeaders.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"prepareExposeHeaders\": () => (/* binding */ prepareExposeHeaders)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Returns a list of headers to expose to the client response\n * @param {Object} headers The headers that were capable of exposing\n * @return {Array} The headers to expose, separated by a comma\n */\nvar prepareExposeHeaders = function prepareExposeHeaders(headers) {\n  // Add 'jwt-token' to access-control-expose-headers, so the client app can read the JWT\n  var _headers$accessContr = headers['access-control-expose-headers'],\n      exposeHeaders = _headers$accessContr === void 0 ? '' : _headers$accessContr;\n  var exposeHeadersList = exposeHeaders.split(',').filter(Boolean);\n  exposeHeadersList.push('jwt-token');\n  return exposeHeadersList.join(', ');\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(prepareExposeHeaders, \"prepareExposeHeaders\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/cmr/prepareExposeHeaders.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/cmr/prepareExposeHeaders.js?");

/***/ }),

/***/ "./serverless/src/util/pick.js":
/*!*************************************!*\
  !*** ./serverless/src/util/pick.js ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"pick\": () => (/* binding */ pick)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Select only desired keys from a provided object.\n * @param {object} providedObj - An object containing any keys.\n * @param {array} keys - An array of strings that represent the keys to be picked.\n * @return {obj} An object containing only the desired keys.\n */\nvar pick = function pick() {\n  var providedObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  var keys = arguments.length > 1 ? arguments[1] : undefined;\n  var obj = null; // if `null` is provided the default parameter will not be\n  // set so we'll handle it manually\n\n  if (providedObj == null) {\n    obj = {};\n  } else {\n    obj = providedObj;\n  }\n\n  Object.keys(obj).forEach(function (k) {\n    if (!keys.includes(k)) {\n      delete obj[k];\n    }\n  });\n  return obj;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(pick, \"pick\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/pick.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/pick.js?");

/***/ }),

/***/ "./serverless/src/util/requestTimeout.js":
/*!***********************************************!*\
  !*** ./serverless/src/util/requestTimeout.js ***!
  \***********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"requestTimeout\": () => (/* binding */ requestTimeout)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Determine the length of the time to allow an http request to perform\n * @param {Integer} workloadThreshold The time to allow the lambda to do its processing beyond the request time\n */\nvar requestTimeout = function requestTimeout() {\n  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},\n      _ref$definedTimeout = _ref.definedTimeout,\n      definedTimeout = _ref$definedTimeout === void 0 ? process.env.LAMBDA_TIMEOUT : _ref$definedTimeout,\n      _ref$workloadThreshol = _ref.workloadThreshold,\n      workloadThreshold = _ref$workloadThreshol === void 0 ? 10 : _ref$workloadThreshol;\n\n  var lambdaTimeout = parseInt(definedTimeout, 10); // Return the difference between our lambda timeout and the\n  // time required to perform the lambda work\n\n  return (lambdaTimeout - workloadThreshold) * 1000;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(requestTimeout, \"requestTimeout\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/requestTimeout.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/requestTimeout.js?");

/***/ }),

/***/ "./serverless/src/util/wrapAxios.js":
/*!******************************************!*\
  !*** ./serverless/src/util/wrapAxios.js ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"wrapAxios\": () => (/* binding */ wrapAxios)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/* eslint-disable no-param-reassign */\n\n/**\n * Adds interceptors to a provided axios module for use in Lambda\n * @param {Module} axiosModule The imported axios module\n */\nvar wrapAxios = function wrapAxios(axiosModule) {\n  // Add the timing object and request start time during the request\n  axiosModule.interceptors.request.use(function (module) {\n    module.timing = {};\n    module.timing.requestStartedAt = new Date().getTime();\n    return module;\n  }); // Add the request end time and elapsedTime during the response\n\n  axiosModule.interceptors.response.use(function (module) {\n    module.config.timing.requestEndedAt = new Date().getTime();\n    var _module$config = module.config,\n        config = _module$config === void 0 ? {} : _module$config;\n    var _config$timing = config.timing,\n        timing = _config$timing === void 0 ? {} : _config$timing;\n    var requestEndedAt = timing.requestEndedAt,\n        requestStartedAt = timing.requestStartedAt;\n    module.config.elapsedTime = requestEndedAt - requestStartedAt;\n    return module;\n  }); // Return the module with the interceptors applied\n\n  return axiosModule;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(wrapAxios, \"wrapAxios\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/wrapAxios.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/wrapAxios.js?");

/***/ }),

/***/ "./sharedUtils/config.js":
/*!*******************************!*\
  !*** ./sharedUtils/config.js ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getApplicationConfig\": () => (/* binding */ getApplicationConfig),\n/* harmony export */   \"getEarthdataConfig\": () => (/* binding */ getEarthdataConfig),\n/* harmony export */   \"getEnvironmentConfig\": () => (/* binding */ getEnvironmentConfig),\n/* harmony export */   \"getSecretEarthdataConfig\": () => (/* binding */ getSecretEarthdataConfig),\n/* harmony export */   \"getSecretEnvironmentConfig\": () => (/* binding */ getSecretEnvironmentConfig),\n/* harmony export */   \"getSecretCypressConfig\": () => (/* binding */ getSecretCypressConfig),\n/* harmony export */   \"getSecretAdminUsers\": () => (/* binding */ getSecretAdminUsers)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _static_config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../static.config.json */ \"./static.config.json\");\n/* harmony import */ var _secret_config_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../secret.config.json */ \"./secret.config.json\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\nvar getConfig = function getConfig() {\n  try {\n    // eslint-disable-next-line global-require, import/no-unresolved\n    var overrideConfig = __webpack_require__(/*! ../overrideStatic.config.json */ \"./overrideStatic.config.json\");\n\n    return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.merge)(_static_config_json__WEBPACK_IMPORTED_MODULE_1__, overrideConfig);\n  } catch (error) {\n    return _static_config_json__WEBPACK_IMPORTED_MODULE_1__;\n  }\n};\n\nvar getApplicationConfig = function getApplicationConfig() {\n  return getConfig().application;\n};\nvar getEarthdataConfig = function getEarthdataConfig(env) {\n  return getConfig().earthdata[env];\n};\nvar getEnvironmentConfig = function getEnvironmentConfig(env) {\n  return getConfig().environment[env || \"development\"];\n};\nvar getSecretEarthdataConfig = function getSecretEarthdataConfig(env) {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.earthdata[env];\n};\nvar getSecretEnvironmentConfig = function getSecretEnvironmentConfig() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.environment[\"development\"];\n};\nvar getSecretCypressConfig = function getSecretCypressConfig() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.cypress;\n};\nvar getSecretAdminUsers = function getSecretAdminUsers() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.admins;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getConfig, \"getConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getApplicationConfig, \"getApplicationConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getEarthdataConfig, \"getEarthdataConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getEnvironmentConfig, \"getEnvironmentConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretEarthdataConfig, \"getSecretEarthdataConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretEnvironmentConfig, \"getSecretEnvironmentConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretCypressConfig, \"getSecretCypressConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretAdminUsers, \"getSecretAdminUsers\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/config.js?");

/***/ }),

/***/ "./sharedUtils/getClientId.js":
/*!************************************!*\
  !*** ./sharedUtils/getClientId.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getClientId\": () => (/* binding */ getClientId)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Replaces ENV and PORTAL in a clientId string\n * @param {String} clientId - clientId to replace ENV and PORTAL\n * @param {String} envOverride - Optional, override the actual env with supplied value\n */\n\nvar replaceClientIdEnvPortal = function replaceClientIdEnvPortal(clientId, envOverride) {\n  return clientId.replace('ENV', envOverride || (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)().env).replace('PORTAL', (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)().defaultPortal);\n};\n/**\n * Returns the clientId to send with CMR requests\n */\n\n\nvar getClientId = function getClientId() {\n  // Override the Env with 'test' if we are in CI\n  var _getApplicationConfig = (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)(),\n      ciMode = _getApplicationConfig.ciMode,\n      clientId = _getApplicationConfig.clientId;\n\n  var envOverride;\n  if (ciMode) envOverride = 'test';\n  var background = clientId.background,\n      lambda = clientId.lambda,\n      client = clientId.client;\n  clientId.background = replaceClientIdEnvPortal(background, envOverride);\n  clientId.lambda = replaceClientIdEnvPortal(lambda, envOverride);\n  clientId.client = replaceClientIdEnvPortal(client, envOverride);\n  return clientId;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(replaceClientIdEnvPortal, \"replaceClientIdEnvPortal\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/getClientId.js\");\n  reactHotLoader.register(getClientId, \"getClientId\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/getClientId.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/getClientId.js?");

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

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/defineProperty");

/***/ }),

/***/ "@babel/runtime/helpers/slicedToArray":
/*!*******************************************************!*\
  !*** external "@babel/runtime/helpers/slicedToArray" ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/slicedToArray");

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

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "fast-xml-parser":
/*!**********************************!*\
  !*** external "fast-xml-parser" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("fast-xml-parser");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "./overrideStatic.config.json":
/*!************************************!*\
  !*** ./overrideStatic.config.json ***!
  \************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"application\":{\"defaultPortal\":\"edsc\"}}');\n\n//# sourceURL=webpack://earthdata-search/./overrideStatic.config.json?");

/***/ }),

/***/ "./secret.config.json":
/*!****************************!*\
  !*** ./secret.config.json ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"environment\":{\"test\":{\"apiHost\":\"http://localhost:3001\"},\"development\":{\"dbUsername\":\"\",\"dbPassword\":\"\",\"apiHost\":\"http://localhost:3001/dev\"},\"production\":{}},\"earthdata\":{\"sit\":{\"clientId\":\"kzAY1v0kVjQ7QVpwBw-kLQ\",\"password\":\"OpenSource_EDSC!2\",\"secret\":\"JWT_SIGNING_SECRET_KEY\",\"cmrSystemUsername\":\"edsc.sys\",\"cmrSystemPassword\":\"q4XuuVAHCk85PuxsJmsCgEdmxVtX28M4\"},\"uat\":{\"clientId\":\"K34r-9lYcLrog2soFrljlw\",\"password\":\"OpenSource_EDSC!2\",\"secret\":\"JWT_SIGNING_SECRET_KEY\",\"cmrSystemUsername\":\"edsc.sys\",\"cmrSystemPassword\":\"vgaCg3dV6h5C2b9L4YMDE8kGReGb5inY\"},\"prod\":{\"clientId\":\"0LDz2MRpxLhPK1rDQBf_KA\",\"password\":\"OpenSource_EDSC!2\",\"secret\":\"JWT_SIGNING_SECRET_KEY\",\"cmrSystemUsername\":\"edsc.sys\",\"cmrSystemPassword\":\"hyW2PeGC5zNVH554NHTQWzwuZxR7GcsY\"},\"test\":{\"secret\":\"JWT_SIGNING_SECRET_KEY\"}},\"cypress\":{\"user\":{\"id\":20,\"username\":\"macrouch\"},\"ursProfile\":{\"first_name\":\"Matthew\"}},\"admins\":[\"macrouch\",\"mreese84\",\"rabbott\",\"sarahrogers\",\"trevorlang\"]}');\n\n//# sourceURL=webpack://earthdata-search/./secret.config.json?");

/***/ }),

/***/ "./static.config.json":
/*!****************************!*\
  !*** ./static.config.json ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"application\":{\"version\":\"dev\",\"env\":\"dev\",\"defaultPortal\":\"default\",\"feedbackApp\":\"\",\"analytics\":{\"gtmPropertyId\":\"\",\"localIdentifier\":{\"enabled\":false,\"propertyId\":\"\"}},\"ciMode\":false,\"cmrTagNamespace\":\"edsc.extra.serverless\",\"thumbnailSize\":{\"height\":85,\"width\":85},\"orderStatusRefreshTime\":60000,\"eosdisTagKey\":\"gov.nasa.eosdis\",\"defaultCmrPageSize\":20,\"maxCmrPageSize\":2000,\"granuleLinksPageSize\":\"500\",\"defaultCmrSearchTags\":[\"edsc.*\",\"opensearch.granule.osdd\"],\"defaultMaxOrderSize\":1000000,\"defaultGranulesPerOrder\":2000,\"defaultSpatialDecimalSize\":5,\"ummGranuleVersion\":\"1.5\",\"ummServiceVersion\":\"1.2\",\"temporalDateFormatFull\":\"YYYY-MM-DD HH:mm:ss\",\"temporalDateFormatRange\":\"MM-DD HH:mm:ss\",\"minimumTemporalDateString\":\"1960-01-01 00:00:00\",\"defaultResponseHeaders\":{\"Access-Control-Allow-Origin\":\"*\",\"Access-Control-Allow-Headers\":\"*\",\"Access-Control-Allow-Credentials\":true},\"clientId\":{\"background\":\"eed-PORTAL-ENV-serverless-background\",\"client\":\"eed-PORTAL-ENV-serverless-client\",\"lambda\":\"eed-PORTAL-ENV-serverless-lambda\"}},\"environment\":{\"test\":{\"apiHost\":\"http://localhost:3000\",\"edscHost\":\"http://localhost:8080\",\"jwtToken\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTU3ODQzMzQ3NiwiZWFydGhkYXRhRW52aXJvbm1lbnQiOiJ0ZXN0In0.WPMuvg26HcYGxGYi7Hl9_FO6YiiJNHWalQ35_1oP5do\"},\"development\":{\"dbHost\":\"127.0.0.1\",\"dbName\":\"edsc_dev\",\"dbPort\":5432,\"apiHost\":\"http://localhost:3001/dev\",\"edscHost\":\"http://localhost:8080\"},\"production\":{\"apiHost\":\"http://localhost:3001/dev\",\"edscHost\":\"http://localhost:8080\"}},\"earthdata\":{\"dev\":{},\"test\":{\"cmrHost\":\"https://cmr.earthdata.nasa.gov\",\"echoRestRoot\":\"https://cmr.earthdata.nasa.gov/legacy-services/rest\",\"edlHost\":\"https://urs.earthdata.nasa.gov\",\"csdaHost\":\"https://auth.csdap.uat.earthdatacloud.nasa.gov\",\"graphQlHost\":\"https://graphql.earthdata.nasa.gov\",\"regionHost\":\"https://fts.podaac.earthdata.nasa.gov\",\"opensearchRoot\":\"https://cmr.earthdata.nasa.gov/opensearch\",\"redirectUriPath\":\"/urs_callback\"},\"sit\":{\"cmrHost\":\"https://cmr.sit.earthdata.nasa.gov\",\"echoRestRoot\":\"https://cmr.sit.earthdata.nasa.gov/legacy-services/rest\",\"edlHost\":\"https://sit.urs.earthdata.nasa.gov\",\"csdaHost\":\"https://auth.csdap.uat.earthdatacloud.nasa.gov\",\"graphQlHost\":\"https://graphql.sit.earthdata.nasa.gov\",\"regionHost\":\"https://d2dwjhzkooeayk.cloudfront.net\",\"opensearchRoot\":\"https://cmr.sit.earthdata.nasa.gov/opensearch\",\"redirectUriPath\":\"/urs_callback\"},\"uat\":{\"cmrHost\":\"https://cmr.uat.earthdata.nasa.gov\",\"echoRestRoot\":\"https://cmr.uat.earthdata.nasa.gov/legacy-services/rest\",\"edlHost\":\"https://uat.urs.earthdata.nasa.gov\",\"csdaHost\":\"https://auth.csdap.uat.earthdatacloud.nasa.gov\",\"graphQlHost\":\"https://graphql.uat.earthdata.nasa.gov\",\"regionHost\":\"https://fts.podaac.uat.earthdata.nasa.gov\",\"opensearchRoot\":\"https://cmr.uat.earthdata.nasa.gov/opensearch\",\"redirectUriPath\":\"/urs_callback\"},\"prod\":{\"cmrHost\":\"https://cmr.earthdata.nasa.gov\",\"echoRestRoot\":\"https://cmr.earthdata.nasa.gov/legacy-services/rest\",\"edlHost\":\"https://urs.earthdata.nasa.gov\",\"csdaHost\":\"https://auth.csdap.uat.earthdatacloud.nasa.gov\",\"graphQlHost\":\"https://graphql.earthdata.nasa.gov\",\"regionHost\":\"https://fts.podaac.earthdata.nasa.gov\",\"opensearchRoot\":\"https://cmr.earthdata.nasa.gov/opensearch\",\"redirectUriPath\":\"/urs_callback\"}}}');\n\n//# sourceURL=webpack://earthdata-search/./static.config.json?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./serverless/src/openSearchGranuleSearch/handler.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;