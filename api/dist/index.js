/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! source-map-support */ "source-map-support").install();

__webpack_require__(/*! app-module-path/cwd */ "app-module-path/cwd"); // require("app-module-path").addPath("src/common/node_modules");


var restify = __webpack_require__(/*! restify */ "restify");

var corsMiddleware = __webpack_require__(/*! restify-cors-middleware */ "restify-cors-middleware");

var routers = __webpack_require__(/*! src/routers */ "./src/routers/index.js"); // const models = require("src/common/models");
// const { injectSystemConfiguration } = require("src/common/models/utils");


var _require = __webpack_require__(/*! lodash */ "lodash"),
    compact = _require.compact; // const {
//     createRequestIdentifier,
//     routeLogger
// } = require("src/common/logger/utils");


try {// verify();
} catch (e) {
  console.log(e.message);
  console.log("Exiting");
  process.exit(-1);
}

setup().then(function (server) {
  return server.listen(3000, function () {
    console.log("".concat(server.name, " listening at ").concat(server.url));
  });
});

function setup() {
  // return models.sequelize
  //     .sync()
  //     .then(() => {
  //         console.log("DB connection established successfully.");
  //         return createServer();
  //     })
  //     .catch(e => {
  //         console.log("Couldn't initialise application.");
  //         console.log(e);
  //         process.exit(-1);
  //     });
  return new Promise(function (resolve, reject) {
    var server = createServer();
    resolve(server);
  });

  function createServer() {
    var server = restify.createServer();
    server.name = "api";

    if (true) {
      var cors = corsMiddleware({
        preflightMaxAge: 5,
        origins: ["*"],
        allowHeaders: ["authorization", "x-modpdsc-dataset-token"],
        exposeHeaders: ["authorization", "x-modpdsc-dataset-token"]
      });
      server.pre(cors.preflight);
      server.use(cors.actual);
    }

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.jsonp());
    server.use(restify.plugins.gzipResponse());
    server.use(middlewareApplicator(restify.plugins.bodyParser()));
    server.use(restify.plugins.conditionalRequest()); // server.use(injectSystemConfiguration);
    // server.use(createRequestIdentifier);
    // server.use(routeLogger);
    // routers.wireUpRoutes(server);

    return server;
  }
}

function middlewareApplicator(middleware) {
  return function (req, res, next) {
    var localPaths = ["^/login$", "^/super/login$", "/accounts/.*"];
    var regex;
    var match = localPaths.map(function (p) {
      regex = new RegExp(p, "g");
      return regex.test(req.route.path) ? true : false;
    });

    if (compact(match).length) {
      if (middleware instanceof Array) {
        middleware[0](req, res, function () {
          middleware[1](req, res, next);
        });
      } else {
        middleware(req, res, next);
      }
    } else {
      next();
    }
  };
}

/***/ }),

/***/ "./src/routers/index.js":
/*!******************************!*\
  !*** ./src/routers/index.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var errors = __webpack_require__(/*! restify-errors */ "restify-errors");

module.exports = {};

function handleError(req, error, next) {
  var message = JSON.parse(error.message.split(" - ")[1]).message;

  switch (error.statusCode) {
    case 400:
      return next(new errors.BadRequestError(message));
      break;

    case 401:
      return next(new errors.UnauthorizedError(message));
      break;

    case 403:
      return next(new errors.ForbiddenError(message));
      break;

    case 409:
      return next(new errors.ConflictError(message));
      break;

    case 426:
      return next(new errors.UpgradeRequiredError(message));
      break;

    case 500:
      return next(new errors.InternalServerError(message));
      break;
  }
}

/***/ }),

/***/ "app-module-path/cwd":
/*!**************************************!*\
  !*** external "app-module-path/cwd" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("app-module-path/cwd");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "restify":
/*!**************************!*\
  !*** external "restify" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("restify");

/***/ }),

/***/ "restify-cors-middleware":
/*!******************************************!*\
  !*** external "restify-cors-middleware" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("restify-cors-middleware");

/***/ }),

/***/ "restify-errors":
/*!*********************************!*\
  !*** external "restify-errors" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("restify-errors");

/***/ }),

/***/ "source-map-support":
/*!*************************************!*\
  !*** external "source-map-support" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map