// Load dependencies.
const babelMinify = require( 'babel-minify' );
const babel = require( '@babel/standalone' );

babel.transformSync = babel.transform;

// URI-encode only a subset of characters. Most user agents are permissive with
// non-reserved characters, so don't obfuscate more than we have to.
const specialCharacters = ["%", '"', "<", ">", "#", "@", " ", "\\&", "\\?"];


const iife = (code) => `void function () {${code}\n}();`;
const minify = (code, mangle) =>
  babelMinify(code, { mangle, deadcode: mangle }, { babel, comments: false })
    .code;
const prefix = (code) => `javascript:${code}`;

const urlencode = (code) =>
  code.replace(
    new RegExp(specialCharacters.join("|"), "g"),
    encodeURIComponent
  );

// Create a bookmarklet.
module.exports = function(code) {
  let result = code;

    result = iife(result);

  // Minify by default
  result = minify(result, true);

  // If code minifies down to nothing, stop processing.
  if (
    "" ===
    result
      .replace(/^"use strict";/, "")
      .replace(/^void function\(\){}\(\);$/, "")
  ) {
    return null;
  }

  // URL-encode by default.
    result = urlencode(result);

  // Add javascript prefix.
  return prefix(result);
};
