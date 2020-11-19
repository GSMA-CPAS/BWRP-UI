/* eslint-disable */
'use strict';

/*
 MIT License

 Copyright (c) 2019 Stefan Seide

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

/**
 * class to validate passwords against some basic rules. letters are all chars included within the basic and
 * supplemental latin-1 unicode charset (0020 - 00ff)
 *
 * @param {number} [minLength] (optional) minimum length of password, an be set too with min()
 * @param {number} [maxLength] (optional) maximum length of password, an be set too with max()
 * @param {number} [noOfCharsets] (optional) number of different character classes required out of four (digit, upper, lower, special)
 * @constructor
 */
function PwValidator(minLength, maxLength, noOfCharsets) {
  // https://unicode-table.com/en/#basic-latin
  // add some umlauts to the regexes too
  this.reUpper = new RegExp('[A-Z]');
  this.reLower = new RegExp('[a-z]');
  this.reDigit = new RegExp('\\d');
  // points'n'bars'n'stuff from basic latin-1 range of unicode table
  // <space>!"#$%&'()*+,-./
  // :;<=>?@
  // [\]^_`
  // {|}~
  // §
  this.reSpecial = new RegExp(
      '[\u0020-\u002f\u003a-\u0040\u005b-\u0060\u007b-\u007e\u00A7]');
  this.policy = [this._checkNotEmpty];

  if (this._isPositiveNumber(minLength)) {
    this.minLen = minLength;
    this.policy.push(this._checkMin);
  }
  if (this._isPositiveNumber(maxLength)) {
    this.maxLen = maxLength;
    this.policy.push(this._checkMax);
  }
  if (this._isPositiveNumber(noOfCharsets)) {
    this.noOfCharSets = noOfCharsets;
    this.policy.push(this._checkXOf4CharacterSets);
  }
}

/**
 * require minumim length of password. Method can be chained to defined password schema.
 *
 * @param {number} min number of chars
 * @return {PwValidator}
 */
PwValidator.prototype.min = function(min) {
  if (this._isPositiveNumber(min)) {
    this.minLen = min;
    this.policy.push(this._checkMin);
  }
  return this;
};

/**
 * require maximum length of password. Method can be chained to defined password schema.
 *
 * @param {number} max number of chars
 * @return {PwValidator}
 */
PwValidator.prototype.max = function(max) {
  if (this._isPositiveNumber(max)) {
    this.maxLen = max;
    this.policy.push(this._checkMax);
  }
  return this;
};

/**
 * minimum number of character classes (out of four) that needs to be present within the password.  Method can be chained to defined password schema.
 * Known groups are digits, upper-case, lower-case, special chars (!,;...)
 *
 * @param {number} noOfCharsets number between 1 and 4 of character groups this password must use
 * @return {PwValidator}
 */
PwValidator.prototype.noOfCharsets = function(noOfCharsets) {
  if (this._isPositiveNumber(noOfCharsets)) {
    this.noOfCharSets = noOfCharsets;
    this.policy.push(this._checkXOf4CharacterSets);
  }
  return this;
};

/**
 * require at least one digit within the password. Method can be chained to defined password schema.
 *
 * @return {PwValidator}
 */
PwValidator.prototype.digits = function() {
  this.policy.push(this._checkDigit);
  return this;
};

/**
 * require at least one letter (upper or lower case) within the password. Method can be chained to defined password schema.
 * letters are all chars from the basic latin-1 and the latin-1 supplement range of unicode standard (up to 00ff)
 *
 * @return {PwValidator}
 */
PwValidator.prototype.letters = function() {
  this.policy.push(this._checkLetters);
  return this;
};

/**
 * require at least one upper case letter within the password. Method can be chained to defined password schema.
 * All upper case letters of the unicode basic and supplemental latin-1 range are included (up to 00ff).
 *
 * @return {PwValidator}
 */
PwValidator.prototype.uppercase = function() {
  this.policy.push(this._checkUppercase);
  return this;
};

/**
 * require at least one lower case letter within the password. Method can be chained to defined password schema.
 * All lower case letters of the unicode basic and supplemental latin-1 range are included (up to 00ff).
 *
 * @return {PwValidator}
 */
PwValidator.prototype.lowercase = function() {
  this.policy.push(this._checkLowercase);
  return this;
};

/**
 * function to validate an password against the policy defined before (min(), max(), digit(),...).
 * This method either returns true/false if password is valid or an array with alle String constants
 * defining the rules this password does not match.
 *
 * If option fields "exitFirstFailure" is set the validation ends after the first failed policy.
 * If option field "asList" is set either "null" on success or an Array with strings describing all policy
 * violations found are return.
 *
 * @param {string} password string to validate
 * @param {object} [options] (optional) object with the boolean fields "asList" and "exitFirstFailure"
 * @return {boolean|Array} boolean or Array with error codes
 */
PwValidator.prototype.validate = function validate(password, options) {
  // dont do anything if no string provided
  if (typeof password !== 'string') {
    return ['INVALID_TYPE'];
  }

  const retList = [];

  for (const i in this.policy) {
    if (this.policy.hasOwnProperty(i)) {
      Array.prototype.push.apply(retList, this.policy[i](this, password));
    }
    // fast exit on first error if requested, no more checks done
    if (options && options.exitFirstFailure && retList.length > 0) {
      break;
    }
  }

  // either simple boolean return or list with all error codes found
  if (options && options.asList) {
    return retList.length > 0 ? retList : null;
  } else {
    return retList.length === 0;
  }
};

/**
 * internal function to check if an given number is positive and
 * therefore a valid length
 *
 * @param {number} num number to check
 * @return {boolean}
 * @private
 */
PwValidator.prototype._isPositiveNumber = function(num) {
  return (typeof num === 'number' && num >= 0);
};

//  ----
// internal check function
// -----

/**
 * Check if the give password contains contains at least x of the 4 predefined character sets
 * (digits, lower-case, upper-case, special (other) chars)
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure AT_LEAST_X_OF_4_CHARACTER_SETS
 * @private
 */
PwValidator.prototype._checkXOf4CharacterSets = function _hasXOf4CharacterSets(
    obj, password) {
  if (!obj._isPositiveNumber(obj.noOfCharSets)) obj.noOfCharSets = 3;

  let count = 0;
  if (obj.reLower.test(password)) count++;
  if (count < obj.noOfCharSets && obj.reUpper.test(password)) count++;
  if (count < obj.noOfCharSets && obj.reDigit.test(password)) count++;
  if (count < obj.noOfCharSets && obj.reSpecial.test(password)) count++;

  if (count < obj.noOfCharSets) return ['AT_LEAST_X_OF_4_CHARACTER_SETS'];
  else return [];
};

/**
 * check if given password is an string object and not empty
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure NOT_EMPTY
 * @private
 */
PwValidator.prototype._checkNotEmpty = function(obj, password) {
  if (!password || typeof password !== 'string') {
    return ['NOT_EMPTY'];
  }
  return [];
};

/**
 * check if given passowrd has at lease the min length specfied
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure TO_SHORT
 * @private
 */
PwValidator.prototype._checkMin = function(obj, password) {
  if (password.length && password.length < obj.minLen) return ['TO_SHORT'];
  return [];
};

/**
 * check if given passowrd is not longer than specified
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure TO_LONG
 * @private
 */
PwValidator.prototype._checkMax = function(obj, password) {
  if (password.length && password.length > obj.maxLen) return ['TO_LONG'];
  return [];
};

/**
 * check if given password contains at least one digit
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure NEEDS_DIGIT
 * @private
 */
PwValidator.prototype._checkDigit = function(obj, password) {
  if (!obj.reDigit.test(password)) return ['NEEDS_DIGITS'];
  return [];
};

/**
 * check if given password contains at least one upper case letter
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure NEEDS_UPPERCASE
 * @private
 */
PwValidator.prototype._checkUppercase = function(obj, password) {
  if (!obj.reUpper.test(password)) return ['NEEDS_UPPERCASE'];
  return [];
};

/**
 * check if given password contains at least one lower case letter
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure NEEDS_LOWERCASE
 * @private
 */
PwValidator.prototype._checkLowercase = function(obj, password) {
  if (!obj.reLower.test(password)) return ['NEEDS_LOWERCASE'];
  return [];
};

/**
 * check if given password contains at least one letter (either lower or upper case)
 *
 * @param {PwValidator} obj ref to the PwValidatorObject with config data
 * @param {string} password string to check
 * @return {Array} Array, empty if ok, otherwise string constant for failure NEEDS_LETTERS
 * @private
 */
PwValidator.prototype._checkLetters = function(obj, password) {
  if (!(obj.reUpper.test(password) ||
      obj.reLower.test(password))) return ['NEEDS_LETTERS'];
  return [];
};

module.exports = PwValidator;
