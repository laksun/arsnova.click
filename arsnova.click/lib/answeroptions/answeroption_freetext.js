import {EJSON} from 'meteor/ejson';
import {AbstractAnswerOption} from './answeroption_abstract.js';

const configCaseSensitive = Symbol("configCaseSensitive");
const configTrimWhitespaces = Symbol("configTrimWhitespaces");
const configUseKeywords = Symbol("configUseKeywords");
const configUsePunctuation = Symbol("configUsePunctuation");

const TYPE = "FreeTextAnswerOption";

export class FreeTextAnswerOption extends AbstractAnswerOption {

	/**
	 * Constructs a FreeTextAnswerOption instance
	 * @see AbstractAnswerOption.constructor()
	 * @param {{hashtag:String,questionIndex:Number,answerText:String,answerOptionNumber:Number,type:String,configCaseSensitive:Boolean,configTrimWhitespaces:Boolean,configUseKeywords:Boolean,configUsePunctuation:Boolean}} options An object containing the parameters for creating an AnswerOption instance. The type attribute is optional.
	 */
	constructor(options) {
		if (typeof options.type !== "undefined" && options.type !== TYPE) {
			throw new TypeError("Invalid construction type while creating new " + TYPE + ", got: " + options.type);
		}
		if (typeof options.configCaseSensitive === "undefined" ||
			typeof options.configTrimWhitespaces === "undefined" ||
			typeof options.configUseKeywords === "undefined" ||
			typeof options.configUsePunctuation === "undefined") {
			throw new Error("Invalid parameter list for new " + TYPE + ", got: ", options);
		}
		super(options);
		this[configCaseSensitive] = options.configCaseSensitive;
		this[configTrimWhitespaces] = options.configTrimWhitespaces;
		this[configUseKeywords] = options.configUseKeywords;
		this[configUsePunctuation] = options.configUsePunctuation;
	}

	/**
	 * Sets a specified configuration value
	 * @param configIdentifier {String} The identifier of the config which shall be changed. Must match the config Symbol in snake case
	 * @param configValue {Boolean} The new value of the configuration
	 * @throws ConfigNotFoundError If the specified configIdentifier does not exist
	 * @throws InvalidParameterError If the specified configValue is not of type Boolean
	 */
	setConfig(configIdentifier, configValue) {
		if (typeof configValue !== "boolean") {
			throw new Error("Invalid Parameter");
		}
		switch (configIdentifier) {
			case "config_case_sensitive_switch":
				this.setConfigCaseSensitive(configValue);
				break;
			case "config_trim_whitespaces_switch":
				this.setConfigTrimWhitespaces(configValue);
				break;
			case "config_use_keywords_switch":
				this.setConfigUseKeywords(configValue);
				break;
			case "config_use_punctuation_switch":
				this.setConfigUsePunctuation(configValue);
				break;
			default:
				throw Error("Config not found");
		}
	}

	/**
	 * Gets the currently set configuration as an array containing the values as object
	 * @returns {*[]} The currently set configuration. The Objects contain the configTitle as localized config name and the configEnabled as localized true or false values
	 */
	getConfig() {
		return [
			{
				configTitle: "view.answeroptions.free_text_question.config_case_sensitive",
				configEnabled: "view.answeroptions.free_text_question." + (this.getConfigCaseSensitive() ? "onText" : "offText")
			},
			{
				configTitle: "view.answeroptions.free_text_question.config_trim_whitespaces",
				configEnabled: "view.answeroptions.free_text_question." + (this.getConfigTrimWhitespaces() ? "onText" : "offText")
			},
			{
				configTitle: "view.answeroptions.free_text_question.config_use_keywords",
				configEnabled: "view.answeroptions.free_text_question." + (this.getConfigUseKeywords() ? "onText" : "offText")
			},
			{
				configTitle: "view.answeroptions.free_text_question.config_use_punctuation",
				configEnabled: "view.answeroptions.free_text_question." + (this.getConfigUsePunctuation() ? "onText" : "offText")
			}
		];
	}

	/**
	 * Returns the currently set configuration if the match of the correct answer is case sensitive
	 * @returns {Boolean} The currently set configuration for the case sensitive check
	 */
	getConfigCaseSensitive() {
		return this[configCaseSensitive];
	}

	/**
	 * Sets the currently set configuration if the match of the correct answer is case sensitive
	 * @param {Boolean} newVal The new configuration setting
	 */
	setConfigCaseSensitive(newVal) {
		if (typeof newVal === "undefined" || typeof newVal !== "boolean") {
			throw TypeError("Invalid argument for " + TYPE + ".setConfigCaseSensitive: ", newVal);
		}
		this[configCaseSensitive] = newVal;
	}

	/**
	 * Returns the currently set configuration if the match of the correct answer shall trim all whitespaces in the given answer
	 * @returns {Boolean} The currently set configuration for the trim whitespaces check
	 */
	getConfigTrimWhitespaces() {
		return this[configTrimWhitespaces];
	}

	/**
	 * Sets the currently set configuration if the match of the correct answer shall trim all whitespaces in the given answer
	 * @param {Boolean} newVal The new configuration setting
	 */
	setConfigTrimWhitespaces(newVal) {
		if (typeof newVal === "undefined" || typeof newVal !== "boolean") {
			throw TypeError("Invalid type for " + TYPE + ".setConfigTrimWhitespaces: ", newVal);
		}
		this[configTrimWhitespaces] = newVal;
	}

	/**
	 * Returns the currently set configuration if the match of the correct answer shall only check the keywords
	 * @returns {Boolean} The currently set configuration if the answer should only check keywords
	 */
	getConfigUseKeywords() {
		return this[configUseKeywords];
	}

	/**
	 * Sets the currently set configuration if the match of the correct answer shall only check the keywords
	 * @param {Boolean} newVal The new configuration setting
	 */
	setConfigUseKeywords(newVal) {
		if (typeof newVal === "undefined" || typeof newVal !== "boolean") {
			throw TypeError("Invalid type for " + TYPE + ".setConfigUseKeywords: ", newVal);
		}
		this[configUseKeywords] = newVal;
	}

	/**
	 * Returns the currently set configuration if the match of the correct answer shall check the punctuation aswell
	 * @returns {Boolean} The currently set configuration for the use punctuation check
	 */
	getConfigUsePunctuation() {
		return this[configUsePunctuation];
	}

	/**
	 * Sets the currently set configuration if the match of the correct answer shall check the punctuation aswell
	 * @param {Boolean} newVal The new configuration setting
	 */
	setConfigUsePunctuation(newVal) {
		if (typeof newVal === "undefined" || typeof newVal !== "boolean") {
			throw TypeError("Invalid type for " + TYPE + ".setConfigUsePunctuation: ", newVal);
		}
		this[configUsePunctuation] = newVal;
	}

	/**
	 * Part of EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-clone
	 * @returns {FreeTextAnswerOption} An independent deep copy of the current instance
	 */
	clone() {
		return new FreeTextAnswerOption(this.serialize());
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag:String,questionIndex:Number,answerText:String,answerOptionNumber:Number,configCaseSensitive:Boolean,configTrimWhitespaces:Boolean,configUseKeywords:Boolean,configUseKeywords:Boolean,configUsePunctuation:Boolean,type:String}}
	 */
	serialize() {
		return Object.assign(super.serialize(), {
			configCaseSensitive: this.getConfigCaseSensitive(),
			configTrimWhitespaces: this.getConfigTrimWhitespaces(),
			configUseKeywords: this.getConfigUseKeywords(),
			configUsePunctuation: this.getConfigUsePunctuation(),
			type: TYPE
		});
	}

	/**
	 * Checks for equivalence relations to another AnswerOption instance. Also part of the EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
	 * @param {AbstractAnswerOption} answerOption The AnswerOption instance which should be checked
	 * @returns {boolean} True if both instances are completely equal, False otherwise
	 */
	equals(answerOption) {
		return super.equals(answerOption) &&
			answerOption instanceof FreeTextAnswerOption &&
			answerOption.getConfigCaseSensitive() === this.getConfigCaseSensitive() &&
			answerOption.getConfigTrimWhitespaces() === this.getConfigTrimWhitespaces() &&
			answerOption.getConfigUseKeywords() === this.getConfigUseKeywords() &&
			answerOption.getConfigUsePunctuation() === this.getConfigUsePunctuation();
	}

	/**
	 * Part of EJSON interface.
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-typeName
	 * @returns {String} The name of the instantiated class
	 */
	typeName() {
		return TYPE;
	}

	/**
	 * Part of EJSON interface
	 * @see AbstractAnswerOption.serialize()
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-toJSONValue
	 * @returns {{hashtag:String,questionIndex:Number,answerText:String,answerOptionNumber:Number,configCaseSensitive:Boolean,configTrimWhitespaces:Boolean,configUseKeywords:Boolean,configUseKeywords:Boolean,configUsePunctuation:Boolean,type:String}}
	 */
	toJSONValue() {
		return this.serialize();
	}
}

/**
 * Adds a custom type to Meteor's EJSON
 * @see http://docs.meteor.com/api/ejson.html#EJSON-addType
 */
EJSON.addType(TYPE, function (value) {
	return new FreeTextAnswerOption(value);
});
