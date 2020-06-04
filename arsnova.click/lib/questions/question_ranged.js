import {EJSON} from 'meteor/ejson';
import {AbstractQuestion} from './question_abstract.js';

const rangeMin = Symbol("rangeMin");
const rangeMax = Symbol("rangeMax");
const correctValue = Symbol("correctValue");

export class RangedQuestion extends AbstractQuestion {

	/**
	 * Constructs a RangedQuestion instance
	 * @see AbstractQuestion.constructor()
	 * @param options @see AbstractQuestion.constructor().options
	 * @param options.rangeMin The minimum range which will be accepted as correct
	 * @param options.rangeMax The maximum range which will be accepted as correct
	 * @param options.correctValue The absolute correct value
	 */
	constructor(options) {
		if (typeof options.type !== "undefined" && options.type !== "RangedQuestion") {
			throw new TypeError("Invalid construction type while creating new RangedQuestion");
		}
		super(options);
		this.removeAllAnswerOptions();
		this[rangeMin] = options.rangeMin || 0;
		this[rangeMax] = options.rangeMax || 0;
		this[correctValue] = options.correctValue || 0;
	}

	/**
	 * Sets the maximum allowed range
	 * @param {Number} max The maximum allowed range
	 * @throws {Error} If max is not a Number or max is smaller than or equal to the minimum range
	 */
	setMaxRange(max) {
		if (typeof max !== "number" || max <= this.getMinRange()) {
			throw new Error("Invalid argument list " + max + ", " + this.getMinRange() + " for RangedQuestion.setMaxRange");
		}
		this[rangeMax] = max;
	}

	/**
	 * Sets the minimum allowed range
	 * @param {Number} min The minimum allowed range
	 * @throws {Error} If min is not a Number or min is bigger than or equal to the maximum range
	 */
	setMinRange(min) {
		if (typeof min !== "number" || min >= this.getMaxRange()) {
			throw new Error("Invalid argument list " + min + ", " + this.getMaxRange() + " for RangedQuestion.setMinRange");
		}
		this[rangeMin] = min;
	}

	/**
	 * Sets the minimum and maximum allowed range
	 * @param {Number} min The minimum allowed range
	 * @param {Number} max The maximum allowed range
	 * @throws {Error} If min or max are not Numbers or min is bigger than or equal to max
	 */
	setRange(min, max) {
		if (typeof min !== "number" || typeof max !== "number" || min >= max) {
			throw new Error("Invalid argument list for RangedQuestion.setRange");
		}
		this[rangeMin] = min;
		this[rangeMax] = max;
	}

	/**
	 * Returns the current max range
	 * @returns {Number} The current max range
	 */
	getMaxRange() {
		return this[rangeMax];
	}

	/**
	 * Returns the current min range
	 * @returns {Number} The current min range
	 */
	getMinRange() {
		return this[rangeMin];
	}

	setCorrectValue(value) {
		if (typeof value !== "number") {
			throw new Error("Invalid argument list for RangedQuestion.setCorrectValue");
		}
		this[correctValue] = value;
	}

	getCorrectValue() {
		return this[correctValue];
	}

	/**
	 * Serialized the instance object to a JSON compatible object
	 * @see AbstractQuestion.serialize()
	 * @returns {{hashtag, questionText, type, timer, startTime, questionIndex, answerOptionList}|{hashtag: String, questionText: String, type: AbstractQuestion, timer: Number, startTime: Number, questionIndex: Number, answerOptionList: Array}}
	 */
	serialize() {
		return Object.assign(super.serialize(), {
			type: "RangedQuestion",
			rangeMin: this.getMinRange(),
			rangeMax: this.getMaxRange(),
			correctValue: this.getCorrectValue()
		});
	}

	/**
	 * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
	 * and summarizes their result of calling .isValid(). Checks if the Question has no answers set and if min range is smaller than max range
	 * @see AbstractQuestion.isValid()
	 * @returns {boolean} True, if the complete Question instance is valid, False otherwise
	 */
	isValid() {
		return super.isValid() &&
			this.getAnswerOptionList().length === 0 &&
			this.getMinRange() < this.getMaxRange() &&
			this.getCorrectValue() >= this.getMinRange() &&
			this.getCorrectValue() <= this.getMaxRange();
	}

	/**
	 * Gets the validation error reason from the question and all included answerOptions as a stackable array
	 * @returns {Array} Contains an Object which holds the number of the current question and the reason why the validation has failed
	 */
	getValidationStackTrace() {
		const parentStackTrace = super.getValidationStackTrace();
		const hasValidRange = this.getMinRange() < this.getMaxRange();
		const hasValidCorrectValue = this.getCorrectValue() >= this.getMinRange() && this.getCorrectValue() <= this.getMaxRange();
		if (!hasValidRange) {
			parentStackTrace.push({
				occuredAt: {type: "question", id: this.getQuestionIndex()},
				reason: "invalid_range"
			});
		}
		if (!hasValidCorrectValue) {
			parentStackTrace.push({
				occuredAt: {type: "question", id: this.getQuestionIndex()},
				reason: "invalid_correct_value"
			});
		}
		return parentStackTrace;
	}

	/**
	 * Checks for equivalence relations to another Question instance. Also part of the EJSON interface
	 * @see AbstractQuestion.equals()
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
	 * @param {RangedQuestion} question The Question instance which should be checked
	 * @returns {boolean} True if both instances are completely equal, False otherwise
	 */
	equals(question) {
		return super.equals(question) && question.getMaxRange() === this.getMaxRange() && question.getMinRange() === this.getMinRange() && question.getCorrectValue() === this.getCorrectValue();
	}

	/**
	 * Part of EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-clone
	 * @returns {RangedQuestion} An independent deep copy of the current instance
	 */
	clone() {
		return new RangedQuestion(this.serialize());
	}

	/**
	 * Part of EJSON interface.
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-typeName
	 * @returns {String} The name of the instantiated class
	 */
	typeName() {
		return "RangedQuestion";
	}

	translationReferrer() {
		return "view.questions.ranged_question";
	}
}

/**
 * Adds a custom type to Meteor's EJSON
 * @see http://docs.meteor.com/api/ejson.html#EJSON-addType
 */
EJSON.addType("RangedQuestion", function (value) {
	return new RangedQuestion(value);
});
