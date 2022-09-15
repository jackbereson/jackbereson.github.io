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

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ (() => {

eval("//Init tooltips\ntippy(\".link\", {\n  placement: \"bottom\"\n}); //Toggle mode\n\nvar toggle = document.querySelector(\".js-change-theme\");\nvar body = document.querySelector(\"body\");\nvar profile = document.getElementById(\"profile\");\ntoggle.addEventListener(\"click\", function () {\n  if (body.classList.contains(\"text-gray-900\")) {\n    toggle.innerHTML = \"☀️\";\n    body.classList.remove(\"text-gray-900\");\n    body.classList.add(\"text-gray-100\");\n    profile.classList.remove(\"bg-white\");\n    profile.classList.add(\"bg-gray-900\");\n  } else {\n    toggle.innerHTML = \"🌙\";\n    body.classList.remove(\"text-gray-100\");\n    body.classList.add(\"text-gray-900\");\n    profile.classList.remove(\"bg-gray-900\");\n    profile.classList.add(\"bg-white\");\n  }\n});\n\n//# sourceURL=webpack://static-website-template/./src/js/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/main.js"]();
/******/ 	
/******/ })()
;