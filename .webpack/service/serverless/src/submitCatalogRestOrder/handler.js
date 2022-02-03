/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./serverless/src/submitCatalogRestOrder/handler.js":
/*!**********************************************************!*\
  !*** ./serverless/src/submitCatalogRestOrder/handler.js ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"@babel/runtime/helpers/slicedToArray\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var array_foreach_async__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! array-foreach-async */ \"array-foreach-async\");\n/* harmony import */ var array_foreach_async__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(array_foreach_async__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! fast-xml-parser */ \"fast-xml-parser\");\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(fast_xml_parser__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! qs */ \"qs\");\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _util_echoForms_getBoundingBox__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../util/echoForms/getBoundingBox */ \"./serverless/src/util/echoForms/getBoundingBox.js\");\n/* harmony import */ var _sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../sharedUtils/getClientId */ \"./sharedUtils/getClientId.js\");\n/* harmony import */ var _util_database_getDbConnection__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../util/database/getDbConnection */ \"./serverless/src/util/database/getDbConnection.js\");\n/* harmony import */ var _util_echoForms_getEmail__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../util/echoForms/getEmail */ \"./serverless/src/util/echoForms/getEmail.js\");\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* harmony import */ var _sharedUtils_deployedEnvironment__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../sharedUtils/deployedEnvironment */ \"./sharedUtils/deployedEnvironment.js\");\n/* harmony import */ var _util_echoForms_getNameValuePairsForProjections__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../util/echoForms/getNameValuePairsForProjections */ \"./serverless/src/util/echoForms/getNameValuePairsForProjections.js\");\n/* harmony import */ var _util_echoForms_getNameValuePairsForResample__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../util/echoForms/getNameValuePairsForResample */ \"./serverless/src/util/echoForms/getNameValuePairsForResample.js\");\n/* harmony import */ var _util_echoForms_getShapefile__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../util/echoForms/getShapefile */ \"./serverless/src/util/echoForms/getShapefile.js\");\n/* harmony import */ var _util_echoForms_getSubsetDataLayers__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../util/echoForms/getSubsetDataLayers */ \"./serverless/src/util/echoForms/getSubsetDataLayers.js\");\n/* harmony import */ var _util_echoForms_getSwitchFields__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../util/echoForms/getSwitchFields */ \"./serverless/src/util/echoForms/getSwitchFields.js\");\n/* harmony import */ var _util_echoForms_getTopLevelFields__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../util/echoForms/getTopLevelFields */ \"./serverless/src/util/echoForms/getTopLevelFields.js\");\n/* harmony import */ var _util_obfuscation_obfuscateId__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../util/obfuscation/obfuscateId */ \"./serverless/src/util/obfuscation/obfuscateId.js\");\n/* harmony import */ var _sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../sharedUtils/parseError */ \"./sharedUtils/parseError.js\");\n/* harmony import */ var _sharedUtils_portalPath__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../sharedUtils/portalPath */ \"./sharedUtils/portalPath.js\");\n/* harmony import */ var _sharedUtils_prepareGranuleAccessParams__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../sharedUtils/prepareGranuleAccessParams */ \"./sharedUtils/prepareGranuleAccessParams.js\");\n/* harmony import */ var _util_processPartialShapefile__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../util/processPartialShapefile */ \"./serverless/src/util/processPartialShapefile.js\");\n/* harmony import */ var _util_cmr_readCmrResults__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../util/cmr/readCmrResults */ \"./serverless/src/util/cmr/readCmrResults.js\");\n/* harmony import */ var _util_startOrderStatusUpdateWorkflow__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../util/startOrderStatusUpdateWorkflow */ \"./serverless/src/util/startOrderStatusUpdateWorkflow.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**\n * Submits an order to Catalog Rest (ESI)\n * @param {Object} event Queue messages from SQS\n * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment\n */\n\nvar submitCatalogRestOrder = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee2(event, context) {\n    var dbConnection, _event$Records, sqsRecords;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js\n            // eslint-disable-next-line no-param-reassign\n            context.callbackWaitsForEmptyEventLoop = false; // Retrieve a connection to the database\n\n            _context2.next = 3;\n            return (0,_util_database_getDbConnection__WEBPACK_IMPORTED_MODULE_10__.getDbConnection)();\n\n          case 3:\n            dbConnection = _context2.sent;\n            _event$Records = event.Records, sqsRecords = _event$Records === void 0 ? [] : _event$Records;\n\n            if (!(sqsRecords.length === 0)) {\n              _context2.next = 7;\n              break;\n            }\n\n            return _context2.abrupt(\"return\");\n\n          case 7:\n            console.log(\"Processing \".concat(sqsRecords.length, \" order(s)\"));\n            _context2.next = 10;\n            return sqsRecords.forEachAsync( /*#__PURE__*/function () {\n              var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee(sqsRecord) {\n                var body, _JSON$parse, accessToken, id, retrievalRecord, accessMethod, environment, granuleParams, retrievalId, jsondata, userId, _jsondata$portalId, portalId, shapefileId, selectedFeatures, preparedGranuleParams, granuleResponse, granuleResponseBody, _getEnvironmentConfig, edscHost, obfuscatedRetrievalId, eeLink, edscStatusUrl, model, url, type, shapefileParam, shapefile, orderPayload, orderResponse, orderResponseBody, agentResponse, order, orderId, parsedErrorMessage, _parsedErrorMessage, errorMessage;\n\n                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee$(_context) {\n                  while (1) {\n                    switch (_context.prev = _context.next) {\n                      case 0:\n                        body = sqsRecord.body; // Destruct the payload from SQS\n\n                        // Destruct the payload from SQS\n                        _JSON$parse = JSON.parse(body), accessToken = _JSON$parse.accessToken, id = _JSON$parse.id; // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page\n\n                        _context.next = 4;\n                        return dbConnection('retrieval_orders').first('retrievals.id', 'retrievals.environment', 'retrievals.jsondata', 'retrievals.user_id', 'retrieval_collections.access_method', 'retrieval_orders.granule_params').join('retrieval_collections', {\n                          'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id'\n                        }).join('retrievals', {\n                          'retrieval_collections.retrieval_id': 'retrievals.id'\n                        }).where({\n                          'retrieval_orders.id': id\n                        });\n\n                      case 4:\n                        retrievalRecord = _context.sent;\n                        accessMethod = retrievalRecord.access_method, environment = retrievalRecord.environment, granuleParams = retrievalRecord.granule_params, retrievalId = retrievalRecord.id, jsondata = retrievalRecord.jsondata, userId = retrievalRecord.user_id;\n                        _context.prev = 6;\n                        _jsondata$portalId = jsondata.portalId, portalId = _jsondata$portalId === void 0 ? (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_12__.getApplicationConfig)().defaultPortal : _jsondata$portalId, shapefileId = jsondata.shapefileId, selectedFeatures = jsondata.selectedFeatures;\n                        preparedGranuleParams = (0,_sharedUtils_prepareGranuleAccessParams__WEBPACK_IMPORTED_MODULE_23__.prepareGranuleAccessParams)(granuleParams);\n                        _context.next = 11;\n                        return axios__WEBPACK_IMPORTED_MODULE_5___default()({\n                          url: \"\".concat((0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_12__.getEarthdataConfig)(environment).cmrHost, \"/search/granules.json\"),\n                          params: preparedGranuleParams,\n                          paramsSerializer: function paramsSerializer(params) {\n                            return (0,qs__WEBPACK_IMPORTED_MODULE_7__.stringify)(params, {\n                              indices: false,\n                              arrayFormat: 'brackets'\n                            });\n                          },\n                          headers: {\n                            Authorization: \"Bearer \".concat(accessToken),\n                            'Client-Id': (0,_sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_9__.getClientId)().background\n                          }\n                        });\n\n                      case 11:\n                        granuleResponse = _context.sent;\n                        granuleResponseBody = (0,_util_cmr_readCmrResults__WEBPACK_IMPORTED_MODULE_25__.readCmrResults)('search/granules.json', granuleResponse);\n                        _getEnvironmentConfig = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_12__.getEnvironmentConfig)(), edscHost = _getEnvironmentConfig.edscHost;\n                        obfuscatedRetrievalId = (0,_util_obfuscation_obfuscateId__WEBPACK_IMPORTED_MODULE_20__.obfuscateId)(retrievalId);\n                        eeLink = environment === (0,_sharedUtils_deployedEnvironment__WEBPACK_IMPORTED_MODULE_13__.deployedEnvironment)() ? '' : \"?ee=\".concat(environment); // URL used when submitting the order to inform the user where they can retrieve their order status\n\n                        // URL used when submitting the order to inform the user where they can retrieve their order status\n                        edscStatusUrl = \"\".concat(edscHost).concat((0,_sharedUtils_portalPath__WEBPACK_IMPORTED_MODULE_22__.portalPath)({\n                          portalId: portalId\n                        }), \"/downloads/\").concat(obfuscatedRetrievalId).concat(eeLink);\n                        model = accessMethod.model, url = accessMethod.url, type = accessMethod.type;\n                        console.log('Submitted Model: ', model);\n                        shapefileParam = {};\n\n                        if (!shapefileId) {\n                          _context.next = 25;\n                          break;\n                        }\n\n                        _context.next = 23;\n                        return (0,_util_processPartialShapefile__WEBPACK_IMPORTED_MODULE_24__.processPartialShapefile)(dbConnection, userId, shapefileId, selectedFeatures);\n\n                      case 23:\n                        shapefile = _context.sent;\n                        shapefileParam = (0,_util_echoForms_getShapefile__WEBPACK_IMPORTED_MODULE_16__.getShapefile)(model, shapefile);\n\n                      case 25:\n                        orderPayload = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({\n                          FILE_IDS: granuleResponseBody.map(function (granuleMetadata) {\n                            return granuleMetadata.title;\n                          }).join(','),\n                          CLIENT_STRING: \"To view the status of your request, please see: \".concat(edscStatusUrl)\n                        }, (0,_util_echoForms_getTopLevelFields__WEBPACK_IMPORTED_MODULE_19__.getTopLevelFields)(model)), (0,_util_echoForms_getSwitchFields__WEBPACK_IMPORTED_MODULE_18__.getSwitchFields)(model)), (0,_util_echoForms_getNameValuePairsForProjections__WEBPACK_IMPORTED_MODULE_14__.getNameValuePairsForProjections)(model)), (0,_util_echoForms_getNameValuePairsForResample__WEBPACK_IMPORTED_MODULE_15__.getNameValuePairsForResample)(model)), (0,_util_echoForms_getSubsetDataLayers__WEBPACK_IMPORTED_MODULE_17__.getSubsetDataLayers)(model)), (0,_util_echoForms_getBoundingBox__WEBPACK_IMPORTED_MODULE_8__.getBoundingBox)(model)), (0,_util_echoForms_getEmail__WEBPACK_IMPORTED_MODULE_11__.getEmail)(model)), shapefileParam); // Remove any empty keys\n\n                        // Remove any empty keys\n                        Object.keys(orderPayload).forEach(function (key) {\n                          return (orderPayload[key] == null || orderPayload[key].length === 0) && delete orderPayload[key];\n                        });\n                        _context.next = 29;\n                        return axios__WEBPACK_IMPORTED_MODULE_5___default()({\n                          method: 'post',\n                          url: url,\n                          data: (0,qs__WEBPACK_IMPORTED_MODULE_7__.stringify)(orderPayload, {\n                            indices: false,\n                            arrayFormat: 'brackets'\n                          }),\n                          headers: {\n                            Authorization: \"Bearer \".concat(accessToken),\n                            'Client-Id': (0,_sharedUtils_getClientId__WEBPACK_IMPORTED_MODULE_9__.getClientId)().background\n                          }\n                        });\n\n                      case 29:\n                        orderResponse = _context.sent;\n                        orderResponseBody = (0,fast_xml_parser__WEBPACK_IMPORTED_MODULE_6__.parse)(orderResponse.data, {\n                          ignoreAttributes: false,\n                          attributeNamePrefix: ''\n                        });\n                        agentResponse = orderResponseBody['eesi:agentResponse'];\n                        order = agentResponse.order;\n                        orderId = order.orderId;\n                        _context.next = 36;\n                        return dbConnection('retrieval_orders').update({\n                          order_number: orderId,\n                          state: 'initialized'\n                        }).where({\n                          id: id\n                        });\n\n                      case 36:\n                        _context.next = 38;\n                        return (0,_util_startOrderStatusUpdateWorkflow__WEBPACK_IMPORTED_MODULE_26__.startOrderStatusUpdateWorkflow)(id, accessToken, type);\n\n                      case 38:\n                        _context.next = 47;\n                        break;\n\n                      case 40:\n                        _context.prev = 40;\n                        _context.t0 = _context[\"catch\"](6);\n                        parsedErrorMessage = (0,_sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_21__.parseError)(_context.t0, {\n                          asJSON: false\n                        });\n                        _parsedErrorMessage = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(parsedErrorMessage, 1), errorMessage = _parsedErrorMessage[0];\n                        _context.next = 46;\n                        return dbConnection('retrieval_orders').update({\n                          state: 'create_failed',\n                          error: errorMessage\n                        }).where({\n                          id: id\n                        });\n\n                      case 46:\n                        throw Error(errorMessage);\n\n                      case 47:\n                      case \"end\":\n                        return _context.stop();\n                    }\n                  }\n                }, _callee, null, [[6, 40]]);\n              }));\n\n              return function (_x3) {\n                return _ref2.apply(this, arguments);\n              };\n            }());\n\n          case 10:\n          case \"end\":\n            return _context2.stop();\n        }\n      }\n    }, _callee2);\n  }));\n\n  return function submitCatalogRestOrder(_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar _default = submitCatalogRestOrder;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(submitCatalogRestOrder, \"submitCatalogRestOrder\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/submitCatalogRestOrder/handler.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/submitCatalogRestOrder/handler.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/submitCatalogRestOrder/handler.js?");

/***/ }),

/***/ "./serverless/src/util/aws/getSecretsManagerConfig.js":
/*!************************************************************!*\
  !*** ./serverless/src/util/aws/getSecretsManagerConfig.js ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getSecretsManagerConfig\": () => (/* binding */ getSecretsManagerConfig)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Returns an environment specific configuration object for Secrets Manager\n * @return {Object} A configuration object for Secrets Manager\n */\nvar getSecretsManagerConfig = function getSecretsManagerConfig() {\n  var productionConfig = {\n    apiVersion: '2017-10-17',\n    region: 'us-east-1'\n  };\n  return productionConfig;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getSecretsManagerConfig, \"getSecretsManagerConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/aws/getSecretsManagerConfig.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/aws/getSecretsManagerConfig.js?");

/***/ }),

/***/ "./serverless/src/util/aws/getStepFunctionsConfig.js":
/*!***********************************************************!*\
  !*** ./serverless/src/util/aws/getStepFunctionsConfig.js ***!
  \***********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getStepFunctionsConfig\": () => (/* binding */ getStepFunctionsConfig)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Returns an environment specific configuration object for Step Functions\n * @return {Object} A configuration object for Step Functions\n */\nvar getStepFunctionsConfig = function getStepFunctionsConfig() {\n  var productionConfig = {\n    apiVersion: '2016-11-23'\n  };\n  return productionConfig;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getStepFunctionsConfig, \"getStepFunctionsConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/aws/getStepFunctionsConfig.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/aws/getStepFunctionsConfig.js?");

/***/ }),

/***/ "./serverless/src/util/cmr/readCmrResults.js":
/*!***************************************************!*\
  !*** ./serverless/src/util/cmr/readCmrResults.js ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"readCmrResults\": () => (/* binding */ readCmrResults)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"@babel/runtime/helpers/slicedToArray\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Return the actual result body from the provided CMR response.\n * @param {String} path The path that was used to create the provided request\n * @param {Object} cmrResponse The response object from CMR\n * @return {Array} The results from a successful response object\n */\nvar readCmrResults = function readCmrResults(providedPath, cmrResponse) {\n  var data = cmrResponse.data,\n      status = cmrResponse.status; // Return an empty result for non successful requests\n\n  if (status !== 200) {\n    console.log(data);\n    return [];\n  }\n\n  var _providedPath$split = providedPath.split('.'),\n      _providedPath$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_providedPath$split, 2),\n      path = _providedPath$split2[0],\n      extension = _providedPath$split2[1]; // The collection and granule search endpoint has a different response\n  // than other concepts as does umm_json\n\n\n  if (extension && !extension.includes('umm_json') && (path.includes('collections') || path.includes('granules'))) {\n    var feed = data.feed;\n    var entry = feed.entry;\n    return entry;\n  } // All other endpoints return `items`\n\n\n  var items = data.items;\n  return items;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(readCmrResults, \"readCmrResults\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/cmr/readCmrResults.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/cmr/readCmrResults.js?");

/***/ }),

/***/ "./serverless/src/util/createLimitedShapefile.js":
/*!*******************************************************!*\
  !*** ./serverless/src/util/createLimitedShapefile.js ***!
  \*******************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createLimitedShapefile\": () => (/* binding */ createLimitedShapefile)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Creates a limited shapefile that only contains the shapes that match the provided selectedFeatures\n * @param {Object} file Shapefile\n * @param {Array} selectedFeatures Array of the selected features of the shapefile\n */\nvar createLimitedShapefile = function createLimitedShapefile(file, selectedFeatures) {\n  var newFile = file;\n  var newFeatures = newFile.features.filter(function (feature) {\n    var edscId = feature.edscId;\n    return selectedFeatures.includes(edscId);\n  });\n  newFile.features = newFeatures;\n  return newFile;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(createLimitedShapefile, \"createLimitedShapefile\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/createLimitedShapefile.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/createLimitedShapefile.js?");

/***/ }),

/***/ "./serverless/src/util/database/getDbConnection.js":
/*!*********************************************************!*\
  !*** ./serverless/src/util/database/getDbConnection.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getDbConnection\": () => (/* binding */ getDbConnection)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! knex */ \"knex\");\n/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(knex__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _getDbConnectionConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getDbConnectionConfig */ \"./serverless/src/util/database/getDbConnectionConfig.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n // Initalize a variable to be set once\n\nvar dbConnection;\n/**\n * Returns a Knex database connection object to the EDSC RDS database\n */\n\nvar getDbConnection = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {\n    var dbConnectionConfig;\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            if (!(dbConnection == null)) {\n              _context.next = 5;\n              break;\n            }\n\n            _context.next = 3;\n            return (0,_getDbConnectionConfig__WEBPACK_IMPORTED_MODULE_4__.getDbConnectionConfig)();\n\n          case 3:\n            dbConnectionConfig = _context.sent;\n            dbConnection = knex__WEBPACK_IMPORTED_MODULE_3___default()({\n              client: 'pg',\n              connection: dbConnectionConfig\n            });\n\n          case 5:\n            return _context.abrupt(\"return\", dbConnection);\n\n          case 6:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getDbConnection() {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(dbConnection, \"dbConnection\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnection.js\");\n  reactHotLoader.register(getDbConnection, \"getDbConnection\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnection.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/database/getDbConnection.js?");

/***/ }),

/***/ "./serverless/src/util/database/getDbConnectionConfig.js":
/*!***************************************************************!*\
  !*** ./serverless/src/util/database/getDbConnectionConfig.js ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getDbConnectionConfig\": () => (/* binding */ getDbConnectionConfig)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _getDbCredentials__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getDbCredentials */ \"./serverless/src/util/database/getDbCredentials.js\");\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\nvar connectionConfig;\n/**\n * Returns an object representing a database configuration\n */\n\nvar getDbConnectionConfig = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {\n    var dbCredentials, configObject, _getEnvironmentConfig, dbHost, dbName, dbPort;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            if (!(connectionConfig == null)) {\n              _context.next = 9;\n              break;\n            }\n\n            _context.next = 3;\n            return (0,_getDbCredentials__WEBPACK_IMPORTED_MODULE_3__.getDbCredentials)();\n\n          case 3:\n            dbCredentials = _context.sent;\n            configObject = {\n              user: dbCredentials.username,\n              password: dbCredentials.password\n            };\n\n            if (false) {}\n\n            _getEnvironmentConfig = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__.getEnvironmentConfig)(), dbHost = _getEnvironmentConfig.dbHost, dbName = _getEnvironmentConfig.dbName, dbPort = _getEnvironmentConfig.dbPort;\n            return _context.abrupt(\"return\", _objectSpread(_objectSpread({}, configObject), {}, {\n              host: dbHost,\n              database: dbName,\n              port: dbPort\n            }));\n\n          case 8:\n            connectionConfig = _objectSpread(_objectSpread({}, configObject), {}, {\n              host: process.env.dbEndpoint,\n              database: process.env.dbName,\n              port: process.env.dbPort\n            });\n\n          case 9:\n            return _context.abrupt(\"return\", connectionConfig);\n\n          case 10:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getDbConnectionConfig() {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(connectionConfig, \"connectionConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnectionConfig.js\");\n  reactHotLoader.register(getDbConnectionConfig, \"getDbConnectionConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnectionConfig.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/database/getDbConnectionConfig.js?");

/***/ }),

/***/ "./serverless/src/util/database/getDbCredentials.js":
/*!**********************************************************!*\
  !*** ./serverless/src/util/database/getDbCredentials.js ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getDbCredentials\": () => (/* binding */ getDbCredentials)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* harmony import */ var _aws_getSecretsManagerConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../aws/getSecretsManagerConfig */ \"./serverless/src/util/aws/getSecretsManagerConfig.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\nvar dbCredentials;\nvar secretsmanager;\n/**\n * Returns the decrypted database credentials from Secrets Manager\n */\n\nvar getDbCredentials = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {\n    var _getSecretEnvironment, dbUsername, dbPassword, params, secretValue;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            if (!(dbCredentials == null)) {\n              _context.next = 10;\n              break;\n            }\n\n            if (secretsmanager == null) {\n              secretsmanager = new (aws_sdk__WEBPACK_IMPORTED_MODULE_2___default().SecretsManager)((0,_aws_getSecretsManagerConfig__WEBPACK_IMPORTED_MODULE_4__.getSecretsManagerConfig)());\n            }\n\n            if (false) {}\n\n            _getSecretEnvironment = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_3__.getSecretEnvironmentConfig)(\"development\"), dbUsername = _getSecretEnvironment.dbUsername, dbPassword = _getSecretEnvironment.dbPassword;\n            return _context.abrupt(\"return\", {\n              username: dbUsername,\n              password: dbPassword\n            });\n\n          case 5:\n            // If not running in development mode fetch secrets from AWS\n            params = {\n              SecretId: process.env.configSecretId\n            };\n            _context.next = 8;\n            return secretsmanager.getSecretValue(params).promise();\n\n          case 8:\n            secretValue = _context.sent;\n            dbCredentials = JSON.parse(secretValue.SecretString);\n\n          case 10:\n            return _context.abrupt(\"return\", dbCredentials);\n\n          case 11:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getDbCredentials() {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(dbCredentials, \"dbCredentials\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbCredentials.js\");\n  reactHotLoader.register(secretsmanager, \"secretsmanager\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbCredentials.js\");\n  reactHotLoader.register(getDbCredentials, \"getDbCredentials\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbCredentials.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/database/getDbCredentials.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/findFieldElement.js":
/*!***********************************************************!*\
  !*** ./serverless/src/util/echoForms/findFieldElement.js ***!
  \***********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"findFieldElement\": () => (/* binding */ findFieldElement)\n/* harmony export */ });\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xpath */ \"xpath\");\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xpath__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xmldom */ \"xmldom\");\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xmldom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _namespaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./namespaces */ \"./serverless/src/util/echoForms/namespaces.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Find a specific tag in the provided XML string\n * @param {String} xmlDocument ECHO Form xml as a string\n * @param {String} fieldName Name of the tag to look for\n * @param {String} dataType XML namespace\n */\n\nvar findFieldElement = function findFieldElement(xmlDocument, fieldName) {\n  var dataType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ecs';\n  var doc = new xmldom__WEBPACK_IMPORTED_MODULE_1__.DOMParser().parseFromString(xmlDocument);\n  return xpath__WEBPACK_IMPORTED_MODULE_0___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_2__.namespaces)(\"//\".concat(dataType, \":\").concat(fieldName), doc);\n};\n\n__signature__(findFieldElement, \"useNamespaces{}\");\n\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(findFieldElement, \"findFieldElement\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/findFieldElement.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/findFieldElement.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getBoundingBox.js":
/*!*********************************************************!*\
  !*** ./serverless/src/util/echoForms/getBoundingBox.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getBoundingBox\": () => (/* binding */ getBoundingBox)\n/* harmony export */ });\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xpath */ \"xpath\");\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xpath__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xmldom */ \"xmldom\");\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xmldom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _namespaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./namespaces */ \"./serverless/src/util/echoForms/namespaces.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Get bounding box information from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getBoundingBox = function getBoundingBox(xmlDocument) {\n  var doc = new xmldom__WEBPACK_IMPORTED_MODULE_1__.DOMParser().parseFromString(xmlDocument);\n  var boundingBoxes = [];\n  xpath__WEBPACK_IMPORTED_MODULE_0___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_2__.namespaces)('//*[contains(name(),\\'boundingbox\\')]', doc).forEach(function (boxElement) {\n    var box = {};\n    Object.values(boxElement.childNodes).forEach(function (boxElement) {\n      if (boxElement.firstChild) {\n        var firstChildValue = boxElement.firstChild.nodeValue;\n\n        if (boxElement && firstChildValue && boxElement.localName !== 'display') {\n          box[boxElement.localName] = firstChildValue;\n        }\n      }\n    }); // Check that the bounding box has enough values to be considered a bounding box\n\n    if (Object.keys(box).length >= 4) {\n      // Ensure the bounding box is in the correct order\n      boundingBoxes.push(['ullon', 'lrlat', 'lrlon', 'ullat'].map(function (key) {\n        return box[key];\n      }).join(','));\n    }\n  });\n  return {\n    BBOX: boundingBoxes[0]\n  };\n};\n\n__signature__(getBoundingBox, \"useNamespaces{}\");\n\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getBoundingBox, \"getBoundingBox\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getBoundingBox.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getBoundingBox.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getEmail.js":
/*!***************************************************!*\
  !*** ./serverless/src/util/echoForms/getEmail.js ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getEmail\": () => (/* binding */ getEmail)\n/* harmony export */ });\n/* harmony import */ var _getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFieldElementValue */ \"./serverless/src/util/echoForms/getFieldElementValue.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Get the email address from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getEmail = function getEmail(xmlDocument) {\n  var xmlElement = (0,_getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__.getFieldElementValue)(xmlDocument, 'email');\n\n  if (xmlElement.length) {\n    return {\n      EMAIL: xmlElement\n    };\n  }\n\n  return {};\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getEmail, \"getEmail\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getEmail.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getEmail.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getFieldElementValue.js":
/*!***************************************************************!*\
  !*** ./serverless/src/util/echoForms/getFieldElementValue.js ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getFieldElementValue\": () => (/* binding */ getFieldElementValue)\n/* harmony export */ });\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xpath */ \"xpath\");\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xpath__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xmldom */ \"xmldom\");\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xmldom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _namespaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./namespaces */ \"./serverless/src/util/echoForms/namespaces.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Find a specific tag in the provided XML string and return its text value\n * @param {String} xmlDocument ECHO Form xml as a string\n * @param {String} fieldName Name of the tag to look for\n * @param {String} dataType XML namespace\n */\n\nvar getFieldElementValue = function getFieldElementValue(xmlDocument, fieldName) {\n  var dataType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ecs';\n  var doc = new xmldom__WEBPACK_IMPORTED_MODULE_1__.DOMParser().parseFromString(xmlDocument);\n  return xpath__WEBPACK_IMPORTED_MODULE_0___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_2__.namespaces)(\"string(//\".concat(dataType, \":\").concat(fieldName, \")\"), doc);\n};\n\n__signature__(getFieldElementValue, \"useNamespaces{}\");\n\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getFieldElementValue, \"getFieldElementValue\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getFieldElementValue.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getFieldElementValue.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getNameValuePairsForProjections.js":
/*!**************************************************************************!*\
  !*** ./serverless/src/util/echoForms/getNameValuePairsForProjections.js ***!
  \**************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getNameValuePairsForProjections\": () => (/* binding */ getNameValuePairsForProjections)\n/* harmony export */ });\n/* harmony import */ var _findFieldElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./findFieldElement */ \"./serverless/src/util/echoForms/findFieldElement.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Get projection parameters from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getNameValuePairsForProjections = function getNameValuePairsForProjections(xmlDocument) {\n  var projectionFields = ['PROJECTION_PARAMETERS'];\n  var projectionFieldValues = {};\n  projectionFields.forEach(function (field) {\n    var xmlField = (0,_findFieldElement__WEBPACK_IMPORTED_MODULE_0__.findFieldElement)(xmlDocument, field);\n\n    if (xmlField) {\n      var projectionValues = [];\n      xmlField.forEach(function (xmlElement) {\n        if (xmlElement.childNodes && Object.values(xmlElement.childNodes)) {\n          Object.values(xmlElement.childNodes).forEach(function (leafNode) {\n            if (leafNode.childNodes && Object.values(leafNode.childNodes)) {\n              Object.values(leafNode.childNodes).forEach(function (values) {\n                if (values && values.firstChild) {\n                  projectionValues.push(\"\".concat(values.localName, \":\").concat(values.firstChild.nodeValue));\n                }\n              });\n            }\n          });\n        }\n      });\n      projectionFieldValues[field] = projectionValues.join(',');\n    }\n  });\n  return projectionFieldValues;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getNameValuePairsForProjections, \"getNameValuePairsForProjections\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getNameValuePairsForProjections.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getNameValuePairsForProjections.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getNameValuePairsForResample.js":
/*!***********************************************************************!*\
  !*** ./serverless/src/util/echoForms/getNameValuePairsForResample.js ***!
  \***********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getNameValuePairsForResample\": () => (/* binding */ getNameValuePairsForResample)\n/* harmony export */ });\n/* harmony import */ var _getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFieldElementValue */ \"./serverless/src/util/echoForms/getFieldElementValue.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Get resampling parameters from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getNameValuePairsForResample = function getNameValuePairsForResample(xmlDocument) {\n  var resampleFields = ['RESAMPLE'];\n  var resampleFieldValues = {};\n  resampleFields.forEach(function (fieldName) {\n    var valueField = (0,_getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__.getFieldElementValue)(xmlDocument, \"\".concat(fieldName, \"/*[contains(local-name(),'value')]\"));\n    var dimensionField = (0,_getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__.getFieldElementValue)(xmlDocument, \"\".concat(fieldName, \"/*[contains(local-name(),'dimension')]\"));\n\n    if (dimensionField && valueField) {\n      resampleFieldValues[fieldName] = \"\".concat(dimensionField, \":\").concat(valueField);\n    }\n  });\n  return resampleFieldValues;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getNameValuePairsForResample, \"getNameValuePairsForResample\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getNameValuePairsForResample.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getNameValuePairsForResample.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getShapefile.js":
/*!*******************************************************!*\
  !*** ./serverless/src/util/echoForms/getShapefile.js ***!
  \*******************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getShapefile\": () => (/* binding */ getShapefile)\n/* harmony export */ });\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xpath */ \"xpath\");\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xpath__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xmldom */ \"xmldom\");\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xmldom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _namespaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./namespaces */ \"./serverless/src/util/echoForms/namespaces.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Get shapefile information from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n * @param {String} shapefile Shapefile contents\n */\n\nvar getShapefile = function getShapefile(xmlDocument, shapefile) {\n  if (!shapefile) return null;\n  var doc = new xmldom__WEBPACK_IMPORTED_MODULE_1__.DOMParser().parseFromString(xmlDocument);\n  var useShapefile = false;\n  xpath__WEBPACK_IMPORTED_MODULE_0___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_2__.namespaces)('//*[contains(name(),\\'spatial_subset_shapefile_flag\\')]', doc).forEach(function (spatialSubsetShapefileFlag) {\n    if (spatialSubsetShapefileFlag.firstChild.nodeValue === 'true') useShapefile = true;\n  });\n\n  if (useShapefile) {\n    return {\n      BoundingShape: JSON.stringify(shapefile)\n    };\n  }\n\n  return null;\n};\n\n__signature__(getShapefile, \"useNamespaces{}\");\n\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getShapefile, \"getShapefile\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getShapefile.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getShapefile.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getSubsetDataLayers.js":
/*!**************************************************************!*\
  !*** ./serverless/src/util/echoForms/getSubsetDataLayers.js ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getSubsetDataLayers\": () => (/* binding */ getSubsetDataLayers)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ \"@babel/runtime/helpers/toConsumableArray\");\n/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xpath */ \"xpath\");\n/* harmony import */ var xpath__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xpath__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xmldom */ \"xmldom\");\n/* harmony import */ var xmldom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(xmldom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _namespaces__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./namespaces */ \"./serverless/src/util/echoForms/namespaces.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Get subsetting parameters from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getSubsetDataLayers = function getSubsetDataLayers(xmlDocument) {\n  var doc = new xmldom__WEBPACK_IMPORTED_MODULE_2__.DOMParser().parseFromString(xmlDocument);\n  var objects = xpath__WEBPACK_IMPORTED_MODULE_1___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_3__.namespaces)('//ecs:SUBSET_DATA_LAYERS/*[ecs:subtreeSelected=\\'true\\' and ecs:subtreeSelected=\\'true\\']/@value', doc);\n  var fields = xpath__WEBPACK_IMPORTED_MODULE_1___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_3__.namespaces)('//ecs:SUBSET_DATA_LAYERS/descendant::*[ecs:itemSelected=\\'true\\' and ecs:subtreeSelected=\\'true\\']/@value', doc);\n  var bands = xpath__WEBPACK_IMPORTED_MODULE_1___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_3__.namespaces)('//ecs:SUBSET_DATA_LAYERS/descendant::*[ecs:itemSelected =\\'true\\']/*[ecs:value > 0]', doc).map(__signature__(function (band) {\n    var valueText = band.data;\n    var ecsValue = xpath__WEBPACK_IMPORTED_MODULE_1___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_3__.namespaces)('ecs:value', band);\n    return \"\".concat(valueText, \"[\").concat(ecsValue.data, \"]\");\n  }, \"useNamespaces{}\"));\n  var treeStyleBands = xpath__WEBPACK_IMPORTED_MODULE_1___default().useNamespaces(_namespaces__WEBPACK_IMPORTED_MODULE_3__.namespaces)('//ecs:SUBSET_DATA_LAYERS[@style=\\'tree\\']/descendant::*/text()', doc);\n  var allValues = [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(objects), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(fields), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(bands), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(treeStyleBands)).map(function (bandType) {\n    if (bandType) {\n      return bandType.nodeValue;\n    }\n\n    return null;\n  });\n  return {\n    SUBSET_DATA_LAYERS: allValues.join(',')\n  };\n};\n\n__signature__(getSubsetDataLayers, \"useNamespaces{}\\nuseNamespaces{}\\nuseNamespaces{}\\nuseNamespaces{}\");\n\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getSubsetDataLayers, \"getSubsetDataLayers\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getSubsetDataLayers.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getSubsetDataLayers.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getSwitchFields.js":
/*!**********************************************************!*\
  !*** ./serverless/src/util/echoForms/getSwitchFields.js ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getSwitchFields\": () => (/* binding */ getSwitchFields)\n/* harmony export */ });\n/* harmony import */ var _getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFieldElementValue */ \"./serverless/src/util/echoForms/getFieldElementValue.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\nvar booleanTranslations = {\n  true: 'Y',\n  True: 'Y',\n  TRUE: 'Y',\n  y: 'Y',\n  Y: 'Y',\n  false: 'N',\n  False: 'N',\n  FALSE: 'N',\n  n: 'N',\n  N: 'N'\n};\n/**\n * Get boolean data from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getSwitchFields = function getSwitchFields(xmlDocument) {\n  var switchFields = ['INCLUDE_META'];\n  var switchFieldValues = {};\n  switchFields.forEach(function (field) {\n    switchFieldValues[field] = booleanTranslations[(0,_getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__.getFieldElementValue)(xmlDocument, field).trim()];\n  });\n  return switchFieldValues;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(booleanTranslations, \"booleanTranslations\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getSwitchFields.js\");\n  reactHotLoader.register(getSwitchFields, \"getSwitchFields\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getSwitchFields.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getSwitchFields.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/getTopLevelFields.js":
/*!************************************************************!*\
  !*** ./serverless/src/util/echoForms/getTopLevelFields.js ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getTopLevelFields\": () => (/* binding */ getTopLevelFields)\n/* harmony export */ });\n/* harmony import */ var _getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFieldElementValue */ \"./serverless/src/util/echoForms/getFieldElementValue.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Get the key / value pairs for all top level fields from the provided XML Document\n * @param {String} xmlDocument ECHO Form xml as a string\n */\n\nvar getTopLevelFields = function getTopLevelFields(xmlDocument) {\n  var topLevelFields = ['BBOX', 'CLIENT', 'END', 'FORMAT', 'INCLUDE_META', 'INTERPOLATION', 'META', 'NATIVE_PROJECTION', 'OUTPUT_GRID', 'PROJECTION', 'REQUEST_MODE', 'START', 'SUBAGENT_ID'];\n  var populatedFields = {};\n  topLevelFields.forEach(function (field) {\n    var xmlElement = (0,_getFieldElementValue__WEBPACK_IMPORTED_MODULE_0__.getFieldElementValue)(xmlDocument, field);\n\n    if (xmlElement && xmlElement.length) {\n      populatedFields[field] = xmlElement;\n    }\n  });\n  return populatedFields;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getTopLevelFields, \"getTopLevelFields\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/getTopLevelFields.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/getTopLevelFields.js?");

/***/ }),

/***/ "./serverless/src/util/echoForms/namespaces.js":
/*!*****************************************************!*\
  !*** ./serverless/src/util/echoForms/namespaces.js ***!
  \*****************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"namespaces\": () => (/* binding */ namespaces)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n// Namespaces used for ECHO Forms\nvar namespaces = {\n  xmlns: 'http://echo.nasa.gov/v9/echoforms',\n  ecs: 'http://ecs.nasa.gov/options',\n  info: 'http://eosdis.nasa.gov/esi/info'\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(namespaces, \"namespaces\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/echoForms/namespaces.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/echoForms/namespaces.js?");

/***/ }),

/***/ "./serverless/src/util/obfuscation/deobfuscateId.js":
/*!**********************************************************!*\
  !*** ./serverless/src/util/obfuscation/deobfuscateId.js ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"deobfuscateId\": () => (/* binding */ deobfuscateId)\n/* harmony export */ });\n/* harmony import */ var scatter_swap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scatter-swap */ \"scatter-swap\");\n/* harmony import */ var scatter_swap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scatter_swap__WEBPACK_IMPORTED_MODULE_0__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Deobfuscate a database ID determine it's original value\n * @param {Integer} value The value to deobfuscate\n */\n\nvar deobfuscateId = function deobfuscateId(value) {\n  var spin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env.obfuscationSpin;\n  return parseInt(new (scatter_swap__WEBPACK_IMPORTED_MODULE_0___default())(value, spin).reverseHash(), 10);\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(deobfuscateId, \"deobfuscateId\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/obfuscation/deobfuscateId.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/obfuscation/deobfuscateId.js?");

/***/ }),

/***/ "./serverless/src/util/obfuscation/obfuscateId.js":
/*!********************************************************!*\
  !*** ./serverless/src/util/obfuscation/obfuscateId.js ***!
  \********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"obfuscateId\": () => (/* binding */ obfuscateId)\n/* harmony export */ });\n/* harmony import */ var scatter_swap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scatter-swap */ \"scatter-swap\");\n/* harmony import */ var scatter_swap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scatter_swap__WEBPACK_IMPORTED_MODULE_0__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Obfuscate a database ID to hide its identity\n * @param {Integer} value The value to be obfuscated\n */\n\nvar obfuscateId = function obfuscateId(value) {\n  var spin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env.obfuscationSpin;\n  return new (scatter_swap__WEBPACK_IMPORTED_MODULE_0___default())(value, spin).hash();\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(obfuscateId, \"obfuscateId\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/obfuscation/obfuscateId.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/obfuscation/obfuscateId.js?");

/***/ }),

/***/ "./serverless/src/util/processPartialShapefile.js":
/*!********************************************************!*\
  !*** ./serverless/src/util/processPartialShapefile.js ***!
  \********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"processPartialShapefile\": () => (/* binding */ processPartialShapefile)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var node_forge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node-forge */ \"node-forge\");\n/* harmony import */ var node_forge__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_forge__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _createLimitedShapefile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createLimitedShapefile */ \"./serverless/src/util/createLimitedShapefile.js\");\n/* harmony import */ var _obfuscation_deobfuscateId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./obfuscation/deobfuscateId */ \"./serverless/src/util/obfuscation/deobfuscateId.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * If a shapefile is provided and a user selected specific features from the file create\n * a child shapefile that only contains the requested features for user in search and subsetting\n * @param {Object} dbConnection A connection to the database provided by the Lambda\n * @param {Integer} userId ID of the user the shapefile belongs to\n * @param {Integer} shapefileId ID of the shapefile that potential features belong to\n * @param {Array} selectedFeatures Array of geojson features from the parent shapefile\n */\n\nvar processPartialShapefile = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(dbConnection, userId, shapefileId, selectedFeatures) {\n    var file, deobfuscatedShapefileId, shapefileRecord, newFile, fileHash, existingShapefileRecord, filename;\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            // Default the response to an undefined object\n            // Deobfuscate the provided shapefile id\n            deobfuscatedShapefileId = (0,_obfuscation_deobfuscateId__WEBPACK_IMPORTED_MODULE_4__.deobfuscateId)(shapefileId, process.env.obfuscationSpinShapefiles);\n            _context.next = 3;\n            return dbConnection('shapefiles').first('file', 'filename').where({\n              id: deobfuscatedShapefileId\n            });\n\n          case 3:\n            shapefileRecord = _context.sent;\n            file = shapefileRecord.file;\n\n            if (!(selectedFeatures && selectedFeatures.length > 0)) {\n              _context.next = 17;\n              break;\n            }\n\n            // Create a new shapefile\n            newFile = (0,_createLimitedShapefile__WEBPACK_IMPORTED_MODULE_3__.createLimitedShapefile)(file, selectedFeatures);\n            file = newFile;\n            fileHash = node_forge__WEBPACK_IMPORTED_MODULE_2___default().md.md5.create();\n            fileHash.update(JSON.stringify(file)); // If the user already used this file, don't save the file again\n\n            _context.next = 12;\n            return dbConnection('shapefiles').first('id').where({\n              file_hash: fileHash,\n              user_id: userId\n            });\n\n          case 12:\n            existingShapefileRecord = _context.sent;\n\n            if (existingShapefileRecord) {\n              _context.next = 17;\n              break;\n            }\n\n            filename = shapefileRecord.filename; // Save new shapefile into database, adding the parent_shapefile_id\n\n            _context.next = 17;\n            return dbConnection('shapefiles').insert({\n              file_hash: fileHash.digest().toHex(),\n              file: file,\n              filename: \"Limited-\".concat(filename),\n              parent_shapefile_id: deobfuscatedShapefileId,\n              selected_features: selectedFeatures,\n              user_id: userId\n            });\n\n          case 17:\n            return _context.abrupt(\"return\", file);\n\n          case 18:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function processPartialShapefile(_x, _x2, _x3, _x4) {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(processPartialShapefile, \"processPartialShapefile\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/processPartialShapefile.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/processPartialShapefile.js?");

/***/ }),

/***/ "./serverless/src/util/startOrderStatusUpdateWorkflow.js":
/*!***************************************************************!*\
  !*** ./serverless/src/util/startOrderStatusUpdateWorkflow.js ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"startOrderStatusUpdateWorkflow\": () => (/* binding */ startOrderStatusUpdateWorkflow)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _aws_getStepFunctionsConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./aws/getStepFunctionsConfig */ \"./serverless/src/util/aws/getStepFunctionsConfig.js\");\n/* harmony import */ var _sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../sharedUtils/parseError */ \"./sharedUtils/parseError.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Initiate an order status workflow\n * @param {String} orderId Database ID for an order to retrieve\n * @param {String} accessToken CMR access token\n */\n\nvar startOrderStatusUpdateWorkflow = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(orderId, accessToken, orderType) {\n    var stepfunctions, stepFunctionResponse;\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.prev = 0;\n            stepfunctions = new (aws_sdk__WEBPACK_IMPORTED_MODULE_2___default().StepFunctions)((0,_aws_getStepFunctionsConfig__WEBPACK_IMPORTED_MODULE_3__.getStepFunctionsConfig)());\n            _context.next = 4;\n            return stepfunctions.startExecution({\n              stateMachineArn: process.env.updateOrderStatusStateMachineArn,\n              input: JSON.stringify({\n                id: orderId,\n                accessToken: accessToken,\n                orderType: orderType\n              })\n            }).promise();\n\n          case 4:\n            stepFunctionResponse = _context.sent;\n            console.log(\"State Machine Invocation (Order ID: \".concat(orderId, \"): \"), stepFunctionResponse);\n            _context.next = 11;\n            break;\n\n          case 8:\n            _context.prev = 8;\n            _context.t0 = _context[\"catch\"](0);\n            (0,_sharedUtils_parseError__WEBPACK_IMPORTED_MODULE_4__.parseError)(_context.t0);\n\n          case 11:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, null, [[0, 8]]);\n  }));\n\n  return function startOrderStatusUpdateWorkflow(_x, _x2, _x3) {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(startOrderStatusUpdateWorkflow, \"startOrderStatusUpdateWorkflow\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/startOrderStatusUpdateWorkflow.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/startOrderStatusUpdateWorkflow.js?");

/***/ }),

/***/ "./sharedUtils/config.js":
/*!*******************************!*\
  !*** ./sharedUtils/config.js ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getApplicationConfig\": () => (/* binding */ getApplicationConfig),\n/* harmony export */   \"getEarthdataConfig\": () => (/* binding */ getEarthdataConfig),\n/* harmony export */   \"getEnvironmentConfig\": () => (/* binding */ getEnvironmentConfig),\n/* harmony export */   \"getSecretEarthdataConfig\": () => (/* binding */ getSecretEarthdataConfig),\n/* harmony export */   \"getSecretEnvironmentConfig\": () => (/* binding */ getSecretEnvironmentConfig),\n/* harmony export */   \"getSecretCypressConfig\": () => (/* binding */ getSecretCypressConfig),\n/* harmony export */   \"getSecretAdminUsers\": () => (/* binding */ getSecretAdminUsers)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _static_config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../static.config.json */ \"./static.config.json\");\n/* harmony import */ var _secret_config_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../secret.config.json */ \"./secret.config.json\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\nvar getConfig = function getConfig() {\n  try {\n    // eslint-disable-next-line global-require, import/no-unresolved\n    var overrideConfig = __webpack_require__(/*! ../overrideStatic.config.json */ \"./overrideStatic.config.json\");\n\n    return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.merge)(_static_config_json__WEBPACK_IMPORTED_MODULE_1__, overrideConfig);\n  } catch (error) {\n    return _static_config_json__WEBPACK_IMPORTED_MODULE_1__;\n  }\n};\n\nvar getApplicationConfig = function getApplicationConfig() {\n  return getConfig().application;\n};\nvar getEarthdataConfig = function getEarthdataConfig(env) {\n  return getConfig().earthdata[env];\n};\nvar getEnvironmentConfig = function getEnvironmentConfig(env) {\n  return getConfig().environment[env || \"development\"];\n};\nvar getSecretEarthdataConfig = function getSecretEarthdataConfig(env) {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.earthdata[env];\n};\nvar getSecretEnvironmentConfig = function getSecretEnvironmentConfig() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.environment[\"development\"];\n};\nvar getSecretCypressConfig = function getSecretCypressConfig() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.cypress;\n};\nvar getSecretAdminUsers = function getSecretAdminUsers() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.admins;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getConfig, \"getConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getApplicationConfig, \"getApplicationConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getEarthdataConfig, \"getEarthdataConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getEnvironmentConfig, \"getEnvironmentConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretEarthdataConfig, \"getSecretEarthdataConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretEnvironmentConfig, \"getSecretEnvironmentConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretCypressConfig, \"getSecretCypressConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretAdminUsers, \"getSecretAdminUsers\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/config.js?");

/***/ }),

/***/ "./sharedUtils/deployedEnvironment.js":
/*!********************************************!*\
  !*** ./sharedUtils/deployedEnvironment.js ***!
  \********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"deployedEnvironment\": () => (/* binding */ deployedEnvironment),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Return the CMR environment to use\n */\n\nvar deployedEnvironment = function deployedEnvironment() {\n  var _getApplicationConfig = (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)(),\n      env = _getApplicationConfig.env;\n\n  if (env === 'dev') return 'prod';\n  return env;\n};\nvar _default = deployedEnvironment;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(deployedEnvironment, \"deployedEnvironment\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/deployedEnvironment.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/deployedEnvironment.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/deployedEnvironment.js?");

/***/ }),

/***/ "./sharedUtils/getClientId.js":
/*!************************************!*\
  !*** ./sharedUtils/getClientId.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getClientId\": () => (/* binding */ getClientId)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Replaces ENV and PORTAL in a clientId string\n * @param {String} clientId - clientId to replace ENV and PORTAL\n * @param {String} envOverride - Optional, override the actual env with supplied value\n */\n\nvar replaceClientIdEnvPortal = function replaceClientIdEnvPortal(clientId, envOverride) {\n  return clientId.replace('ENV', envOverride || (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)().env).replace('PORTAL', (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)().defaultPortal);\n};\n/**\n * Returns the clientId to send with CMR requests\n */\n\n\nvar getClientId = function getClientId() {\n  // Override the Env with 'test' if we are in CI\n  var _getApplicationConfig = (0,_config__WEBPACK_IMPORTED_MODULE_0__.getApplicationConfig)(),\n      ciMode = _getApplicationConfig.ciMode,\n      clientId = _getApplicationConfig.clientId;\n\n  var envOverride;\n  if (ciMode) envOverride = 'test';\n  var background = clientId.background,\n      lambda = clientId.lambda,\n      client = clientId.client;\n  clientId.background = replaceClientIdEnvPortal(background, envOverride);\n  clientId.lambda = replaceClientIdEnvPortal(lambda, envOverride);\n  clientId.client = replaceClientIdEnvPortal(client, envOverride);\n  return clientId;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(replaceClientIdEnvPortal, \"replaceClientIdEnvPortal\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/getClientId.js\");\n  reactHotLoader.register(getClientId, \"getClientId\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/getClientId.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/getClientId.js?");

/***/ }),

/***/ "./sharedUtils/parseError.js":
/*!***********************************!*\
  !*** ./sharedUtils/parseError.js ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"parseError\": () => (/* binding */ parseError)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ \"@babel/runtime/helpers/typeof\");\n/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fast-xml-parser */ \"fast-xml-parser\");\n/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Parse and return a lambda friendly response to errors\n * @param {Object} errorObj The error object that was thrown\n * @param {Boolean} shouldLog Whether or not to log the exceptions found\n */\n\nvar parseError = function parseError(errorObj) {\n  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n      _ref$shouldLog = _ref.shouldLog,\n      shouldLog = _ref$shouldLog === void 0 ? true : _ref$shouldLog,\n      _ref$asJSON = _ref.asJSON,\n      asJSON = _ref$asJSON === void 0 ? true : _ref$asJSON,\n      _ref$reThrowError = _ref.reThrowError,\n      reThrowError = _ref$reThrowError === void 0 ? false : _ref$reThrowError,\n      logPrefix = _ref.logPrefix;\n\n  var _errorObj$name = errorObj.name,\n      name = _errorObj$name === void 0 ? 'Error' : _errorObj$name,\n      _errorObj$response = errorObj.response,\n      response = _errorObj$response === void 0 ? {} : _errorObj$response;\n  var errorArray = [];\n  var code = 500;\n\n  if (Object.keys(response).length) {\n    var _response$data = response.data,\n        data = _response$data === void 0 ? {} : _response$data,\n        _response$headers = response.headers,\n        headers = _response$headers === void 0 ? {} : _response$headers,\n        status = response.status,\n        statusText = response.statusText;\n    code = status;\n    var harmonyError = data.description,\n        hucError = data.error,\n        hucSocketError = data.message;\n    var _headers$contentType = headers['content-type'],\n        contentType = _headers$contentType === void 0 ? '' : _headers$contentType;\n\n    if (contentType.indexOf('application/opensearchdescription+xml') > -1) {\n      // OpenSearch collections can return errors in XML, ensure we capture them\n      var osddBody = (0,fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__.parse)(data, {\n        ignoreAttributes: false,\n        attributeNamePrefix: ''\n      });\n      var _osddBody$feed = osddBody.feed,\n          feed = _osddBody$feed === void 0 ? {} : _osddBody$feed,\n          _osddBody$OpenSearchD = osddBody.OpenSearchDescription,\n          description = _osddBody$OpenSearchD === void 0 ? {} : _osddBody$OpenSearchD; // Granule errors will come from within a `feed` element\n\n      var subtitle = feed.subtitle;\n\n      if (description) {\n        var errorMessage = description.Description;\n        errorArray = [errorMessage];\n      }\n\n      if (subtitle) {\n        if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(subtitle) === 'object' && subtitle !== null) {\n          var text = subtitle['#text'];\n          errorArray = [text];\n        } else {\n          errorArray = [subtitle];\n        }\n      }\n    } else if (contentType.indexOf('text/xml') > -1) {\n      // OpenSearch collections can return errors in XML, ensure we capture them\n      var gibsError = (0,fast_xml_parser__WEBPACK_IMPORTED_MODULE_1__.parse)(data, {\n        ignoreAttributes: false,\n        attributeNamePrefix: ''\n      });\n      var report = gibsError.ExceptionReport;\n      var exception = report.Exception;\n      var _errorMessage = exception.ExceptionText;\n      errorArray = [_errorMessage];\n    } else if (harmonyError) {\n      // Harmony uses code/description object in the response\n      errorArray = [harmonyError];\n    } else if (hucError || hucSocketError) {\n      // HUC uses code/description object in the response\n      errorArray = [hucError || hucSocketError];\n    } else if (contentType.indexOf('text/html') > -1) {\n      // If the error is from Axios and the content type is html, build a string error using the status code and status text\n      errorArray = [\"\".concat(name, \" (\").concat(code, \"): \").concat(statusText)];\n    } else {\n      // Default to CMR error response body\n      var _data$errors = data.errors;\n      errorArray = _data$errors === void 0 ? ['Unknown Error'] : _data$errors;\n    }\n\n    if (shouldLog) {\n      // Log each error provided\n      errorArray.forEach(function (message) {\n        var logParts = [logPrefix, \"\".concat(name, \" (\").concat(code, \"): \").concat(message)];\n        console.log(logParts.filter(Boolean).join(' '));\n      });\n    }\n  } else {\n    var logParts = [logPrefix, errorObj.toString()];\n\n    if (shouldLog) {\n      console.log(logParts.filter(Boolean).join(' '));\n    }\n\n    errorArray = [logParts.filter(Boolean).join(' ')];\n  } // If the error needs to be thrown again, do so before returning\n\n\n  if (reThrowError) {\n    throw errorObj;\n  }\n\n  if (asJSON) {\n    return {\n      statusCode: code,\n      body: JSON.stringify({\n        statusCode: code,\n        errors: errorArray\n      })\n    };\n  }\n\n  return errorArray;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(parseError, \"parseError\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/parseError.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/parseError.js?");

/***/ }),

/***/ "./sharedUtils/portalPath.js":
/*!***********************************!*\
  !*** ./sharedUtils/portalPath.js ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"portalPath\": () => (/* binding */ portalPath),\n/* harmony export */   \"portalPathFromState\": () => (/* binding */ portalPathFromState)\n/* harmony export */ });\n/* harmony import */ var _static_src_js_util_portals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../static/src/js/util/portals */ \"./static/src/js/util/portals.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n/**\n * Provides a prefix for links that takes the active portal into account\n * @param {Object} portal Object with a portalId key\n */\n\nvar portalPath = function portalPath(portal) {\n  if (!portal) return '';\n  var _portal$portalId = portal.portalId,\n      portalId = _portal$portalId === void 0 ? '' : _portal$portalId;\n  var portalPath = '';\n  if (!(0,_static_src_js_util_portals__WEBPACK_IMPORTED_MODULE_0__.isDefaultPortal)(portalId)) portalPath = \"/portal/\".concat(portalId);\n  return portalPath;\n};\n/**\n * Wrapper for portalPath() that takes the full Redux state\n * @param {Object} state Redux state\n */\n\nvar portalPathFromState = function portalPathFromState(state) {\n  var portal = state.portal;\n  return portalPath(portal);\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(portalPath, \"portalPath\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/portalPath.js\");\n  reactHotLoader.register(portalPathFromState, \"portalPathFromState\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/portalPath.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/portalPath.js?");

/***/ }),

/***/ "./sharedUtils/prepareGranuleAccessParams.js":
/*!***************************************************!*\
  !*** ./sharedUtils/prepareGranuleAccessParams.js ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"prepareGranuleAccessParams\": () => (/* binding */ prepareGranuleAccessParams)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Takes granule params and returns the params to be used in a CMR request\n * @param {Object} params Queue messages from SQS\n * @returns {Object} The granule params\n */\nvar prepareGranuleAccessParams = function prepareGranuleAccessParams() {\n  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  var _params$concept_id = params.concept_id,\n      conceptIdsFromParams = _params$concept_id === void 0 ? [] : _params$concept_id; // If there are added granules, return only the added granules. Otherwise, send\n  // all of the granules params.\n\n  if (conceptIdsFromParams.length) {\n    return {\n      concept_id: conceptIdsFromParams,\n      page_size: conceptIdsFromParams.length\n    };\n  }\n\n  return params;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(prepareGranuleAccessParams, \"prepareGranuleAccessParams\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/prepareGranuleAccessParams.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/prepareGranuleAccessParams.js?");

/***/ }),

/***/ "./static/src/js/util/portals.js":
/*!***************************************!*\
  !*** ./static/src/js/util/portals.js ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isDefaultPortal\": () => (/* binding */ isDefaultPortal),\n/* harmony export */   \"getPortalConfig\": () => (/* binding */ getPortalConfig)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/* eslint-disable import/no-dynamic-require, global-require */\n\n\n/**\n * Does the given portalId match the application defaultPortal\n * @param {String} portalId\n */\n\nvar isDefaultPortal = function isDefaultPortal(portalId) {\n  var defaultPortalId = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_1__.getApplicationConfig)().defaultPortal;\n  return portalId === defaultPortalId;\n};\n/**\n * Recursively build the portal config merging the config into the configs parent config\n * @param {Object} json Portal config\n */\n\nvar buildConfig = function buildConfig(json) {\n  var parentConfig = json.parentConfig; // If the current config has a parent, merge the current config into the result of the parents being merged together\n\n  if (parentConfig) {\n    var parentJson = __webpack_require__(\"./portals sync recursive ^\\\\.\\\\/.*\\\\/config\\\\.json$\")(\"./\".concat(parentConfig, \"/config.json\"));\n\n    var parent = buildConfig(parentJson);\n    var merged = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.merge)(parent, json);\n    return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.cloneDeep)(merged);\n  } // If the config doesn't have a parent, merge the current config into the default portal config\n\n\n  var defaultJson = __webpack_require__(/*! ../../../../portals/default/config.json */ \"./portals/default/config.json\");\n\n  return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.merge)(defaultJson, json);\n};\n/**\n * Returns the portal config json\n * @param {String} portalId\n */\n\n\nvar getPortalConfig = function getPortalConfig(portalId) {\n  var portalJson = __webpack_require__(\"./portals sync recursive ^\\\\.\\\\/.*\\\\/config\\\\.json$\")(\"./\".concat(portalId, \"/config.json\"));\n\n  return buildConfig(portalJson);\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(isDefaultPortal, \"isDefaultPortal\", \"/Users/rabbott3/Projects/earthdata-search/static/src/js/util/portals.js\");\n  reactHotLoader.register(buildConfig, \"buildConfig\", \"/Users/rabbott3/Projects/earthdata-search/static/src/js/util/portals.js\");\n  reactHotLoader.register(getPortalConfig, \"getPortalConfig\", \"/Users/rabbott3/Projects/earthdata-search/static/src/js/util/portals.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./static/src/js/util/portals.js?");

/***/ }),

/***/ "./portals sync recursive ^\\.\\/.*\\/config\\.json$":
/*!**********************************************!*\
  !*** ./portals/ sync ^\.\/.*\/config\.json$ ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./above/config.json\": \"./portals/above/config.json\",\n\t\"./airmoss/config.json\": \"./portals/airmoss/config.json\",\n\t\"./amd/config.json\": \"./portals/amd/config.json\",\n\t\"./carve/config.json\": \"./portals/carve/config.json\",\n\t\"./complex/config.json\": \"./portals/complex/config.json\",\n\t\"./cwic/config.json\": \"./portals/cwic/config.json\",\n\t\"./default/config.json\": \"./portals/default/config.json\",\n\t\"./edsc/config.json\": \"./portals/edsc/config.json\",\n\t\"./ghrc/config.json\": \"./portals/ghrc/config.json\",\n\t\"./idn/config.json\": \"./portals/idn/config.json\",\n\t\"./ornldaac/config.json\": \"./portals/ornldaac/config.json\",\n\t\"./podaac-cloud/config.json\": \"./portals/podaac-cloud/config.json\",\n\t\"./podaac/config.json\": \"./portals/podaac/config.json\",\n\t\"./simple/config.json\": \"./portals/simple/config.json\",\n\t\"./soos/config.json\": \"./portals/soos/config.json\",\n\t\"./standardproducts/config.json\": \"./portals/standardproducts/config.json\",\n\t\"./suborbital/config.json\": \"./portals/suborbital/config.json\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./portals sync recursive ^\\\\.\\\\/.*\\\\/config\\\\.json$\";\n\n//# sourceURL=webpack://earthdata-search/./portals/_sync_^\\.\\/.*\\/config\\.json$?");

/***/ }),

/***/ "@babel/runtime/helpers/asyncToGenerator":
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@babel/runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@babel/runtime/helpers/defineProperty");

/***/ }),

/***/ "@babel/runtime/helpers/slicedToArray":
/*!*******************************************************!*\
  !*** external "@babel/runtime/helpers/slicedToArray" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@babel/runtime/helpers/slicedToArray");

/***/ }),

/***/ "@babel/runtime/helpers/toConsumableArray":
/*!***********************************************************!*\
  !*** external "@babel/runtime/helpers/toConsumableArray" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@babel/runtime/helpers/toConsumableArray");

/***/ }),

/***/ "@babel/runtime/helpers/typeof":
/*!************************************************!*\
  !*** external "@babel/runtime/helpers/typeof" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@babel/runtime/helpers/typeof");

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "array-foreach-async":
/*!**************************************!*\
  !*** external "array-foreach-async" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("array-foreach-async");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ "fast-xml-parser":
/*!**********************************!*\
  !*** external "fast-xml-parser" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("fast-xml-parser");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("knex");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("lodash");

/***/ }),

/***/ "node-forge":
/*!*****************************!*\
  !*** external "node-forge" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node-forge");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("pg");

/***/ }),

/***/ "qs":
/*!*********************!*\
  !*** external "qs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("qs");

/***/ }),

/***/ "scatter-swap":
/*!*******************************!*\
  !*** external "scatter-swap" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("scatter-swap");

/***/ }),

/***/ "xmldom":
/*!*************************!*\
  !*** external "xmldom" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("xmldom");

/***/ }),

/***/ "xpath":
/*!************************!*\
  !*** external "xpath" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("xpath");

/***/ }),

/***/ "./overrideStatic.config.json":
/*!************************************!*\
  !*** ./overrideStatic.config.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"application\":{\"defaultPortal\":\"edsc\"}}');\n\n//# sourceURL=webpack://earthdata-search/./overrideStatic.config.json?");

/***/ }),

/***/ "./portals/above/config.json":
/*!***********************************!*\
  !*** ./portals/above/config.json ***!
  \***********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"org\":\"ABoVE\",\"pageTitle\":\"ABoVE\",\"parentConfig\":\"edsc\",\"query\":{\"project\":\"ABoVE\"},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/above/config.json?");

/***/ }),

/***/ "./portals/airmoss/config.json":
/*!*************************************!*\
  !*** ./portals/airmoss/config.json ***!
  \*************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"hasScripts\":true,\"logo\":{\"id\":\"ornl-daac-logo\",\"link\":\"https://airmoss.ornl.gov\",\"title\":\"ORNL DAAC AirMOSS Home\"},\"org\":\"ORNL DAAC\",\"pageTitle\":\"AirMOSS\",\"parentConfig\":\"edsc\",\"query\":{\"project\":\"AirMOSS\",\"hasGranulesOrCwic\":null},\"title\":\"AirMOSS\",\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/airmoss/config.json?");

/***/ }),

/***/ "./portals/amd/config.json":
/*!*********************************!*\
  !*** ./portals/amd/config.json ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"amd-logo\",\"link\":\"https://www.scar.org/data-products/antarctic-master-directory/\",\"title\":\"Antarctic Master Directory\"},\"org\":\"AMD\",\"pageTitle\":\"Antarctic Master Directory\",\"parentConfig\":\"edsc\",\"query\":{\"tagKey\":\"org.scar.amd\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/amd/config.json?");

/***/ }),

/***/ "./portals/carve/config.json":
/*!***********************************!*\
  !*** ./portals/carve/config.json ***!
  \***********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"hasScripts\":true,\"logo\":{\"id\":\"ornl-daac-logo\",\"link\":\"https://carve.ornl.gov\",\"title\":\"ORNL DAAC CARVE Home\"},\"org\":\"ORNL DAAC\",\"pageTitle\":\"CARVE\",\"parentConfig\":\"edsc\",\"query\":{\"project\":\"CARVE\",\"hasGranulesOrCwic\":null},\"title\":\"CARVE\",\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/carve/config.json?");

/***/ }),

/***/ "./portals/complex/config.json":
/*!*************************************!*\
  !*** ./portals/complex/config.json ***!
  \*************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"logo\":{\"image\":\"http://placehold.it/45x24\",\"link\":\"https://example.com/logo\"},\"pageTitle\":\"Complex\",\"parentConfig\":\"edsc\",\"query\":{\"echoCollectionId\":\"C203234523-LAADS\"},\"title\":\"Complex\"}');\n\n//# sourceURL=webpack://earthdata-search/./portals/complex/config.json?");

/***/ }),

/***/ "./portals/cwic/config.json":
/*!**********************************!*\
  !*** ./portals/cwic/config.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"ceos-logo\",\"link\":\"http://ceos.org/ourwork/workinggroups/wgiss/access/cwic/\",\"title\":\"CEOS Home\"},\"org\":\"CWIC\",\"pageTitle\":\"CWIC\",\"parentConfig\":\"edsc\",\"query\":{\"tagKey\":\"org.ceos.wgiss.cwic.granules.prod\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/cwic/config.json?");

/***/ }),

/***/ "./portals/default/config.json":
/*!*************************************!*\
  !*** ./portals/default/config.json ***!
  \*************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"features\":{\"advancedSearch\":false,\"authentication\":false,\"featureFacets\":{\"showAvailableFromAwsCloud\":false,\"showCustomizable\":false,\"showMapImagery\":false,\"showNearRealTime\":true}},\"footer\":{\"displayVersion\":false,\"attributionText\":\"\",\"primaryLinks\":[],\"secondaryLinks\":[]},\"hasScripts\":false,\"hasStyles\":false,\"logo\":{},\"org\":\"Site Name\",\"pageTitle\":\"\",\"query\":{},\"title\":\"Search\",\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false,\"showTophat\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/default/config.json?");

/***/ }),

/***/ "./portals/edsc/config.json":
/*!**********************************!*\
  !*** ./portals/edsc/config.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"features\":{\"advancedSearch\":true,\"authentication\":true,\"featureFacets\":{\"showAvailableFromAwsCloud\":true,\"showCustomizable\":true,\"showMapImagery\":true,\"showNearRealTime\":true}},\"footer\":{\"displayVersion\":true,\"attributionText\":\"NASA Official: Stephen Berrick\",\"primaryLinks\":[{\"title\":\"FOIA\",\"href\":\"http://www.nasa.gov/FOIA/index.html\"},{\"title\":\"NASA Privacy Policy\",\"href\":\"http://www.nasa.gov/about/highlights/HP_Privacy.html\"},{\"title\":\"USA.gov\",\"href\":\"http://www.usa.gov\"}],\"secondaryLinks\":[{\"title\":\"Earthdata Access: A Section 508 accessible alternative\",\"href\":\"https://access.earthdata.nasa.gov/\"}]},\"hasScripts\":false,\"hasStyles\":false,\"org\":\"Earthdata\",\"pageTitle\":\"Earthdata Search\",\"title\":\"Search\",\"ui\":{\"showOnlyGranulesCheckbox\":true,\"showNonEosdisCheckbox\":true,\"showTophat\":true}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/edsc/config.json?");

/***/ }),

/***/ "./portals/ghrc/config.json":
/*!**********************************!*\
  !*** ./portals/ghrc/config.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"hasScripts\":true,\"logo\":{\"id\":\"ghrc-logo\",\"link\":\"https://ghrc.nsstc.nasa.gov/home\",\"title\":\"GHRC Home\"},\"org\":\"GHRC\",\"pageTitle\":\"GHRC\",\"parentConfig\":\"edsc\",\"query\":{\"dataCenter\":\"NASA/MSFC/GHRC\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/ghrc/config.json?");

/***/ }),

/***/ "./portals/idn/config.json":
/*!*********************************!*\
  !*** ./portals/idn/config.json ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"idn-logo\",\"link\":\"https://idn.ceos.org/\",\"title\":\"CEOS IDN Search\"},\"org\":\"IDN\",\"pageTitle\":\"IDN\",\"parentConfig\":\"edsc\",\"query\":{\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/idn/config.json?");

/***/ }),

/***/ "./portals/ornldaac/config.json":
/*!**************************************!*\
  !*** ./portals/ornldaac/config.json ***!
  \**************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"hasScripts\":true,\"logo\":{\"id\":\"ornl-daac-logo\",\"link\":\"https://daac.ornl.gov\",\"title\":\"ORNL DAAC Home\"},\"org\":\"ORNL DAAC\",\"pageTitle\":\"ORNL DAAC\",\"parentConfig\":\"edsc\",\"query\":{\"dataCenter\":\"ORNL_DAAC\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/ornldaac/config.json?");

/***/ }),

/***/ "./portals/podaac-cloud/config.json":
/*!******************************************!*\
  !*** ./portals/podaac-cloud/config.json ***!
  \******************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"podaac-logo\",\"link\":\"https://podaac.jpl.nasa.gov\",\"title\":\"PO.DAAC Home\"},\"org\":\"PO.DAAC Cloud\",\"pageTitle\":\"PO.DAAC Cloud\",\"parentConfig\":\"edsc\",\"query\":{\"provider\":\"POCLOUD\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/podaac-cloud/config.json?");

/***/ }),

/***/ "./portals/podaac/config.json":
/*!************************************!*\
  !*** ./portals/podaac/config.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"podaac-logo\",\"link\":\"https://podaac.jpl.nasa.gov\",\"title\":\"PO.DAAC Home\"},\"org\":\"PO.DAAC\",\"pageTitle\":\"PO.DAAC\",\"parentConfig\":\"edsc\",\"query\":{\"dataCenter\":\"NASA/JPL/PODAAC\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/podaac/config.json?");

/***/ }),

/***/ "./portals/simple/config.json":
/*!************************************!*\
  !*** ./portals/simple/config.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"parentConfig\":\"edsc\",\"query\":{\"echoCollectionId\":\"C203234523-LAADS\"}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/simple/config.json?");

/***/ }),

/***/ "./portals/soos/config.json":
/*!**********************************!*\
  !*** ./portals/soos/config.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"SOOS-logo\",\"link\":\"http://www.soos.aq\",\"title\":\"SOOS Metadata Search\"},\"org\":\"SOOS\",\"pageTitle\":\"Southern Ocean Observing System\",\"parentConfig\":\"edsc\",\"query\":{\"tagKey\":\"aq.soos\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/soos/config.json?");

/***/ }),

/***/ "./portals/standardproducts/config.json":
/*!**********************************************!*\
  !*** ./portals/standardproducts/config.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"org\":\"Standard Products\",\"pageTitle\":\"Standard Products\",\"parentConfig\":\"edsc\",\"query\":{\"tagKey\":\"gov.nasa.eosdis.standardproduct\",\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/standardproducts/config.json?");

/***/ }),

/***/ "./portals/suborbital/config.json":
/*!****************************************!*\
  !*** ./portals/suborbital/config.json ***!
  \****************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"hasStyles\":true,\"logo\":{\"id\":\"suborbital-logo\",\"link\":\"https://earthdata.nasa.gov/esds/impact/admg/the-airborne-inventory\",\"title\":\"Sub-Orbital Catalog\"},\"org\":\"Sub-Orbital Catalog\",\"pageTitle\":\"NASA Sub-Orbital Catalog\",\"parentConfig\":\"edsc\",\"query\":{\"tagKey\":[\"gov.nasa.impact.*\"],\"hasGranulesOrCwic\":null},\"ui\":{\"showOnlyGranulesCheckbox\":false,\"showNonEosdisCheckbox\":false}}');\n\n//# sourceURL=webpack://earthdata-search/./portals/suborbital/config.json?");

/***/ }),

/***/ "./secret.config.json":
/*!****************************!*\
  !*** ./secret.config.json ***!
  \****************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"environment\":{\"test\":{\"apiHost\":\"http://localhost:3001\"},\"development\":{\"dbUsername\":\"\",\"dbPassword\":\"\",\"apiHost\":\"http://localhost:3001/dev\"},\"production\":{}},\"earthdata\":{\"sit\":{\"clientId\":\"kzAY1v0kVjQ7QVpwBw-kLQ\",\"password\":\"OpenSource_EDSC!2\",\"secret\":\"JWT_SIGNING_SECRET_KEY\",\"cmrSystemUsername\":\"edsc.sys\",\"cmrSystemPassword\":\"q4XuuVAHCk85PuxsJmsCgEdmxVtX28M4\"},\"uat\":{\"clientId\":\"K34r-9lYcLrog2soFrljlw\",\"password\":\"OpenSource_EDSC!2\",\"secret\":\"JWT_SIGNING_SECRET_KEY\",\"cmrSystemUsername\":\"edsc.sys\",\"cmrSystemPassword\":\"vgaCg3dV6h5C2b9L4YMDE8kGReGb5inY\"},\"prod\":{\"clientId\":\"0LDz2MRpxLhPK1rDQBf_KA\",\"password\":\"OpenSource_EDSC!2\",\"secret\":\"JWT_SIGNING_SECRET_KEY\",\"cmrSystemUsername\":\"edsc.sys\",\"cmrSystemPassword\":\"hyW2PeGC5zNVH554NHTQWzwuZxR7GcsY\"},\"test\":{\"secret\":\"JWT_SIGNING_SECRET_KEY\"}},\"cypress\":{\"user\":{\"id\":20,\"username\":\"macrouch\"},\"ursProfile\":{\"first_name\":\"Matthew\"}},\"admins\":[\"macrouch\",\"mreese84\",\"rabbott\",\"sarahrogers\",\"trevorlang\"]}');\n\n//# sourceURL=webpack://earthdata-search/./secret.config.json?");

/***/ }),

/***/ "./static.config.json":
/*!****************************!*\
  !*** ./static.config.json ***!
  \****************************/
/***/ ((module) => {

"use strict";
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
/******/ 	var __webpack_exports__ = __webpack_require__("./serverless/src/submitCatalogRestOrder/handler.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;