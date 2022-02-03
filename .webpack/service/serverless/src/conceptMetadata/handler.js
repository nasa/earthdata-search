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

/***/ "./serverless/src/conceptMetadata/handler.js":
/*!***************************************************!*\
  !*** ./serverless/src/conceptMetadata/handler.js ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"@babel/runtime/helpers/slicedToArray\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! qs */ \"qs\");\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _util_getEdlConfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/getEdlConfig */ \"./serverless/src/util/getEdlConfig.js\");\n/* harmony import */ var _util_urs_getAccessTokenFromJwtToken__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/urs/getAccessTokenFromJwtToken */ \"./serverless/src/util/urs/getAccessTokenFromJwtToken.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n/**\n * Perform an authenticated CMR Concept Metadata search\n * @param {Object} event Details about the HTTP request that it received\n */\n\nvar conceptMetadata = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().mark(function _callee(event) {\n    var queryStringParameters, earthdataEnvironment, url, jwtToken, _url$split, _url$split2, desiredPath, desiredQueryParams, parsedQueryParams, _yield$getAccessToken, accessToken, edlConfig, client, clientId, conceptUrl;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            queryStringParameters = event.queryStringParameters;\n            earthdataEnvironment = queryStringParameters.ee, url = queryStringParameters.url, jwtToken = queryStringParameters.token;\n            _url$split = url.split('?'), _url$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_url$split, 2), desiredPath = _url$split2[0], desiredQueryParams = _url$split2[1];\n            parsedQueryParams = (0,qs__WEBPACK_IMPORTED_MODULE_4__.parse)(desiredQueryParams);\n            _context.next = 6;\n            return (0,_util_urs_getAccessTokenFromJwtToken__WEBPACK_IMPORTED_MODULE_6__.getAccessTokenFromJwtToken)(jwtToken, earthdataEnvironment);\n\n          case 6:\n            _yield$getAccessToken = _context.sent;\n            accessToken = _yield$getAccessToken.access_token;\n            _context.next = 10;\n            return (0,_util_getEdlConfig__WEBPACK_IMPORTED_MODULE_5__.getEdlConfig)(earthdataEnvironment);\n\n          case 10:\n            edlConfig = _context.sent;\n            client = edlConfig.client;\n            clientId = client.id; // Access tokens used in the URL still require the client id\n\n            conceptUrl = \"\".concat(desiredPath, \"?\").concat((0,qs__WEBPACK_IMPORTED_MODULE_4__.stringify)(_objectSpread(_objectSpread({}, parsedQueryParams), {}, {\n              token: \"\".concat(accessToken, \":\").concat(clientId)\n            }), {\n              encode: false\n            }));\n            return _context.abrupt(\"return\", {\n              statusCode: 307,\n              headers: {\n                Location: conceptUrl\n              }\n            });\n\n          case 15:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function conceptMetadata(_x) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar _default = conceptMetadata;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(conceptMetadata, \"conceptMetadata\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/conceptMetadata/handler.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/conceptMetadata/handler.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/conceptMetadata/handler.js?");

/***/ }),

/***/ "./serverless/src/util/aws/getSecretsManagerConfig.js":
/*!************************************************************!*\
  !*** ./serverless/src/util/aws/getSecretsManagerConfig.js ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getSecretsManagerConfig\": () => (/* binding */ getSecretsManagerConfig)\n/* harmony export */ });\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n/**\n * Returns an environment specific configuration object for Secrets Manager\n * @return {Object} A configuration object for Secrets Manager\n */\nvar getSecretsManagerConfig = function getSecretsManagerConfig() {\n  var productionConfig = {\n    apiVersion: '2017-10-17',\n    region: 'us-east-1'\n  };\n  return productionConfig;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getSecretsManagerConfig, \"getSecretsManagerConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/aws/getSecretsManagerConfig.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/aws/getSecretsManagerConfig.js?");

/***/ }),

/***/ "./serverless/src/util/database/getDbConnection.js":
/*!*********************************************************!*\
  !*** ./serverless/src/util/database/getDbConnection.js ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getDbConnection\": () => (/* binding */ getDbConnection)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! knex */ \"knex\");\n/* harmony import */ var knex__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(knex__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _getDbConnectionConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getDbConnectionConfig */ \"./serverless/src/util/database/getDbConnectionConfig.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n // Initalize a variable to be set once\n\nvar dbConnection;\n/**\n * Returns a Knex database connection object to the EDSC RDS database\n */\n\nvar getDbConnection = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {\n    var dbConnectionConfig;\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            if (!(dbConnection == null)) {\n              _context.next = 5;\n              break;\n            }\n\n            _context.next = 3;\n            return (0,_getDbConnectionConfig__WEBPACK_IMPORTED_MODULE_4__.getDbConnectionConfig)();\n\n          case 3:\n            dbConnectionConfig = _context.sent;\n            dbConnection = knex__WEBPACK_IMPORTED_MODULE_3___default()({\n              client: 'pg',\n              connection: dbConnectionConfig\n            });\n\n          case 5:\n            return _context.abrupt(\"return\", dbConnection);\n\n          case 6:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getDbConnection() {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(dbConnection, \"dbConnection\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnection.js\");\n  reactHotLoader.register(getDbConnection, \"getDbConnection\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnection.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/database/getDbConnection.js?");

/***/ }),

/***/ "./serverless/src/util/database/getDbConnectionConfig.js":
/*!***************************************************************!*\
  !*** ./serverless/src/util/database/getDbConnectionConfig.js ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getDbConnectionConfig\": () => (/* binding */ getDbConnectionConfig)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _getDbCredentials__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getDbCredentials */ \"./serverless/src/util/database/getDbCredentials.js\");\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\nvar connectionConfig;\n/**\n * Returns an object representing a database configuration\n */\n\nvar getDbConnectionConfig = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {\n    var dbCredentials, configObject, _getEnvironmentConfig, dbHost, dbName, dbPort;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            if (!(connectionConfig == null)) {\n              _context.next = 9;\n              break;\n            }\n\n            _context.next = 3;\n            return (0,_getDbCredentials__WEBPACK_IMPORTED_MODULE_3__.getDbCredentials)();\n\n          case 3:\n            dbCredentials = _context.sent;\n            configObject = {\n              user: dbCredentials.username,\n              password: dbCredentials.password\n            };\n\n            if (false) {}\n\n            _getEnvironmentConfig = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__.getEnvironmentConfig)(), dbHost = _getEnvironmentConfig.dbHost, dbName = _getEnvironmentConfig.dbName, dbPort = _getEnvironmentConfig.dbPort;\n            return _context.abrupt(\"return\", _objectSpread(_objectSpread({}, configObject), {}, {\n              host: dbHost,\n              database: dbName,\n              port: dbPort\n            }));\n\n          case 8:\n            connectionConfig = _objectSpread(_objectSpread({}, configObject), {}, {\n              host: process.env.dbEndpoint,\n              database: process.env.dbName,\n              port: process.env.dbPort\n            });\n\n          case 9:\n            return _context.abrupt(\"return\", connectionConfig);\n\n          case 10:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getDbConnectionConfig() {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(connectionConfig, \"connectionConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnectionConfig.js\");\n  reactHotLoader.register(getDbConnectionConfig, \"getDbConnectionConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbConnectionConfig.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/database/getDbConnectionConfig.js?");

/***/ }),

/***/ "./serverless/src/util/database/getDbCredentials.js":
/*!**********************************************************!*\
  !*** ./serverless/src/util/database/getDbCredentials.js ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getDbCredentials\": () => (/* binding */ getDbCredentials)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* harmony import */ var _aws_getSecretsManagerConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../aws/getSecretsManagerConfig */ \"./serverless/src/util/aws/getSecretsManagerConfig.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\nvar dbCredentials;\nvar secretsmanager;\n/**\n * Returns the decrypted database credentials from Secrets Manager\n */\n\nvar getDbCredentials = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {\n    var _getSecretEnvironment, dbUsername, dbPassword, params, secretValue;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            if (!(dbCredentials == null)) {\n              _context.next = 10;\n              break;\n            }\n\n            if (secretsmanager == null) {\n              secretsmanager = new (aws_sdk__WEBPACK_IMPORTED_MODULE_2___default().SecretsManager)((0,_aws_getSecretsManagerConfig__WEBPACK_IMPORTED_MODULE_4__.getSecretsManagerConfig)());\n            }\n\n            if (false) {}\n\n            _getSecretEnvironment = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_3__.getSecretEnvironmentConfig)(\"development\"), dbUsername = _getSecretEnvironment.dbUsername, dbPassword = _getSecretEnvironment.dbPassword;\n            return _context.abrupt(\"return\", {\n              username: dbUsername,\n              password: dbPassword\n            });\n\n          case 5:\n            // If not running in development mode fetch secrets from AWS\n            params = {\n              SecretId: process.env.configSecretId\n            };\n            _context.next = 8;\n            return secretsmanager.getSecretValue(params).promise();\n\n          case 8:\n            secretValue = _context.sent;\n            dbCredentials = JSON.parse(secretValue.SecretString);\n\n          case 10:\n            return _context.abrupt(\"return\", dbCredentials);\n\n          case 11:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getDbCredentials() {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(dbCredentials, \"dbCredentials\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbCredentials.js\");\n  reactHotLoader.register(secretsmanager, \"secretsmanager\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbCredentials.js\");\n  reactHotLoader.register(getDbCredentials, \"getDbCredentials\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/database/getDbCredentials.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/database/getDbCredentials.js?");

/***/ }),

/***/ "./serverless/src/util/getEdlConfig.js":
/*!*********************************************!*\
  !*** ./serverless/src/util/getEdlConfig.js ***!
  \*********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getEdlConfig\": () => (/* binding */ getEdlConfig)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* harmony import */ var _aws_getSecretsManagerConfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./aws/getSecretsManagerConfig */ \"./serverless/src/util/aws/getSecretsManagerConfig.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\nvar clientConfig = {};\nvar secretsmanager;\n/**\n * Configuration object used by the simple-oauth2 plugin\n */\n\nvar oAuthConfig = function oAuthConfig(earthdataEnvironment) {\n  return {\n    auth: {\n      tokenHost: (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__.getEarthdataConfig)(earthdataEnvironment).edlHost\n    }\n  };\n};\n/**\n * Get the Earthdata Login configuration, from either secret.config.json or AWS\n * @param {Object} edlConfig A previously defined config object, or null if one has not be instantiated\n */\n\n\nvar getEdlConfig = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(earthdataEnvironment) {\n    var environmentConfig, _getSecretEarthdataCo, clientId, password, params, secretValue;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            environmentConfig = clientConfig[earthdataEnvironment];\n\n            if (!(environmentConfig == null)) {\n              _context.next = 12;\n              break;\n            }\n\n            if (secretsmanager == null) {\n              secretsmanager = new (aws_sdk__WEBPACK_IMPORTED_MODULE_3___default().SecretsManager)((0,_aws_getSecretsManagerConfig__WEBPACK_IMPORTED_MODULE_5__.getSecretsManagerConfig)());\n            }\n\n            if (false) {}\n\n            _getSecretEarthdataCo = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_4__.getSecretEarthdataConfig)(earthdataEnvironment), clientId = _getSecretEarthdataCo.clientId, password = _getSecretEarthdataCo.password;\n            return _context.abrupt(\"return\", _objectSpread(_objectSpread({}, oAuthConfig(earthdataEnvironment)), {}, {\n              client: {\n                id: clientId,\n                secret: password\n              }\n            }));\n\n          case 6:\n            console.log(\"Fetching UrsClientConfigSecret_\".concat(earthdataEnvironment));\n            params = {\n              SecretId: \"UrsClientConfigSecret_\".concat(earthdataEnvironment)\n            }; // If not running in development mode fetch secrets from AWS\n\n            _context.next = 10;\n            return secretsmanager.getSecretValue(params).promise();\n\n          case 10:\n            secretValue = _context.sent;\n            clientConfig[earthdataEnvironment] = JSON.parse(secretValue.SecretString);\n\n          case 12:\n            return _context.abrupt(\"return\", _objectSpread(_objectSpread({}, oAuthConfig(earthdataEnvironment)), {}, {\n              client: clientConfig[earthdataEnvironment]\n            }));\n\n          case 13:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getEdlConfig(_x) {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(clientConfig, \"clientConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/getEdlConfig.js\");\n  reactHotLoader.register(secretsmanager, \"secretsmanager\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/getEdlConfig.js\");\n  reactHotLoader.register(oAuthConfig, \"oAuthConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/getEdlConfig.js\");\n  reactHotLoader.register(getEdlConfig, \"getEdlConfig\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/getEdlConfig.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/getEdlConfig.js?");

/***/ }),

/***/ "./serverless/src/util/getVerifiedJwtToken.js":
/*!****************************************************!*\
  !*** ./serverless/src/util/getVerifiedJwtToken.js ***!
  \****************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getVerifiedJwtToken\": () => (/* binding */ getVerifiedJwtToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _sharedUtils_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../sharedUtils/config */ \"./sharedUtils/config.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n/**\n * Verifies the JWT Token and returns the contents\n * @param {String} jwtToken\n */\n\nvar getVerifiedJwtToken = function getVerifiedJwtToken(jwtToken, earthdataEnvironment) {\n  var _getSecretEarthdataCo = (0,_sharedUtils_config__WEBPACK_IMPORTED_MODULE_1__.getSecretEarthdataConfig)(earthdataEnvironment),\n      secret = _getSecretEarthdataCo.secret;\n\n  var verifiedJwtToken = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(jwtToken, secret);\n  return verifiedJwtToken;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getVerifiedJwtToken, \"getVerifiedJwtToken\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/getVerifiedJwtToken.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/getVerifiedJwtToken.js?");

/***/ }),

/***/ "./serverless/src/util/urs/getAccessTokenFromJwtToken.js":
/*!***************************************************************!*\
  !*** ./serverless/src/util/urs/getAccessTokenFromJwtToken.js ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getAccessTokenFromJwtToken\": () => (/* binding */ getAccessTokenFromJwtToken)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _database_getDbConnection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../database/getDbConnection */ \"./serverless/src/util/database/getDbConnection.js\");\n/* harmony import */ var _getVerifiedJwtToken__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../getVerifiedJwtToken */ \"./serverless/src/util/getVerifiedJwtToken.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\n\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n/**\n * Returns the stored access tokens for the user belonging to the jwt token\n */\n\nvar getAccessTokenFromJwtToken = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(jwtToken, earthdataEnvironment) {\n    var dbConnection, _getVerifiedJwtToken, id, existingUserTokens;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return (0,_database_getDbConnection__WEBPACK_IMPORTED_MODULE_2__.getDbConnection)();\n\n          case 2:\n            dbConnection = _context.sent;\n            _getVerifiedJwtToken = (0,_getVerifiedJwtToken__WEBPACK_IMPORTED_MODULE_3__.getVerifiedJwtToken)(jwtToken, earthdataEnvironment), id = _getVerifiedJwtToken.id;\n            _context.next = 6;\n            return dbConnection('user_tokens').first(['access_token', 'refresh_token', 'expires_at', 'user_id']).where({\n              user_id: id\n            }).orderBy('created_at', 'DESC');\n\n          case 6:\n            existingUserTokens = _context.sent;\n            return _context.abrupt(\"return\", existingUserTokens);\n\n          case 8:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function getAccessTokenFromJwtToken(_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}();\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getAccessTokenFromJwtToken, \"getAccessTokenFromJwtToken\", \"/Users/rabbott3/Projects/earthdata-search/serverless/src/util/urs/getAccessTokenFromJwtToken.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./serverless/src/util/urs/getAccessTokenFromJwtToken.js?");

/***/ }),

/***/ "./sharedUtils/config.js":
/*!*******************************!*\
  !*** ./sharedUtils/config.js ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getApplicationConfig\": () => (/* binding */ getApplicationConfig),\n/* harmony export */   \"getEarthdataConfig\": () => (/* binding */ getEarthdataConfig),\n/* harmony export */   \"getEnvironmentConfig\": () => (/* binding */ getEnvironmentConfig),\n/* harmony export */   \"getSecretEarthdataConfig\": () => (/* binding */ getSecretEarthdataConfig),\n/* harmony export */   \"getSecretEnvironmentConfig\": () => (/* binding */ getSecretEnvironmentConfig),\n/* harmony export */   \"getSecretCypressConfig\": () => (/* binding */ getSecretCypressConfig),\n/* harmony export */   \"getSecretAdminUsers\": () => (/* binding */ getSecretAdminUsers)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _static_config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../static.config.json */ \"./static.config.json\");\n/* harmony import */ var _secret_config_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../secret.config.json */ \"./secret.config.json\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\nvar getConfig = function getConfig() {\n  try {\n    // eslint-disable-next-line global-require, import/no-unresolved\n    var overrideConfig = __webpack_require__(/*! ../overrideStatic.config.json */ \"./overrideStatic.config.json\");\n\n    return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.merge)(_static_config_json__WEBPACK_IMPORTED_MODULE_1__, overrideConfig);\n  } catch (error) {\n    return _static_config_json__WEBPACK_IMPORTED_MODULE_1__;\n  }\n};\n\nvar getApplicationConfig = function getApplicationConfig() {\n  return getConfig().application;\n};\nvar getEarthdataConfig = function getEarthdataConfig(env) {\n  return getConfig().earthdata[env];\n};\nvar getEnvironmentConfig = function getEnvironmentConfig(env) {\n  return getConfig().environment[env || \"development\"];\n};\nvar getSecretEarthdataConfig = function getSecretEarthdataConfig(env) {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.earthdata[env];\n};\nvar getSecretEnvironmentConfig = function getSecretEnvironmentConfig() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.environment[\"development\"];\n};\nvar getSecretCypressConfig = function getSecretCypressConfig() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.cypress;\n};\nvar getSecretAdminUsers = function getSecretAdminUsers() {\n  return _secret_config_json__WEBPACK_IMPORTED_MODULE_2__.admins;\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getConfig, \"getConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getApplicationConfig, \"getApplicationConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getEarthdataConfig, \"getEarthdataConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getEnvironmentConfig, \"getEnvironmentConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretEarthdataConfig, \"getSecretEarthdataConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretEnvironmentConfig, \"getSecretEnvironmentConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretCypressConfig, \"getSecretCypressConfig\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n  reactHotLoader.register(getSecretAdminUsers, \"getSecretAdminUsers\", \"/Users/rabbott3/Projects/earthdata-search/sharedUtils/config.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n\n//# sourceURL=webpack://earthdata-search/./sharedUtils/config.js?");

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

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("knex");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "qs":
/*!*********************!*\
  !*** external "qs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("qs");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./serverless/src/conceptMetadata/handler.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;