import {EJSON} from 'meteor/ejson';
import {AbstractQuestion} from './question_abstract.js';
import {FreeTextAnswerOption} from '../answeroptions/answeroption_freetext.js';

export class FreeTextQuestion extends AbstractQuestion {

	/**
	 * Constructs a FreeTextQuestion instance
	 * @see AbstractQuestion.constructor()
	 * @param options @see AbstractQuestion.constructor().options
	 */
	constructor(options) {
		if (typeof options.type !== "undefined" && options.type !== "FreeTextQuestion") {
			throw new TypeError("Invalid construction type while creating new FreeTextQuestion");
		}
		super(options);
		if (options.answerOptionList[0] instanceof Object) {
			if (options.answerOptionList[0].type === "FreeTextAnswerOption") {
				this.addAnswerOption(new FreeTextAnswerOption(options.answerOptionList[0]));
			} else {
				this.addDefaultAnswerOption();
			}
		} else {
			this.addDefaultAnswerOption();
		}
	}

	/**
	 * Serialized the instance object to a JSON compatible object
	 * @see AbstractQuestion.serialize()
	 * @returns {{hashtag, questionText, type, timer, startTime, questionIndex, answerOptionList}|{hashtag: String, questionText: String, type: AbstractQuestion, timer: Number, startTime: Number, questionIndex: Number, answerOptionList: Array}}
	 */
	serialize() {
		return Object.assign(super.serialize(), {
			type: "FreeTextQuestion"
		});
	}

	/**
	 * Checks if the properties of this instance are valid. Checks also recursively all including AnswerOption instances
	 * and summarizes their result of calling .isValid().
	 * @see AbstractQuestion.isValid()
	 * @returns {boolean} True, if the complete Question instance is valid, False otherwise
	 */
	isValid() {
		return super.isValid() &&
			this.getAnswerOptionList().length === 1 &&
			this.getAnswerOptionList()[0].isValid();
	}

	addAnswerOption(answerOption) {
		if (typeof answerOption === "undefined" || !(answerOption instanceof FreeTextAnswerOption)) {
			throw new Error("AnswerOptionType must match FreeTextAnswerOption, got: ", answerOption);
		}
		super.addAnswerOption(answerOption, 0);
	}

	/**
	 * Checks for equivalence relations to another Question instance. Also part of the EJSON interface
	 * @see AbstractQuestion.equals()
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
	 * @param {FreeTextQuestion} question The Question instance which should be checked
	 * @returns {boolean} True if both instances are completely equal, False otherwise
	 */
	equals(question) {
		return super.equals(question);
	}

	/**
	 * Part of EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-clone
	 * @returns {FreeTextQuestion} An independent deep copy of the current instance
	 */
	clone() {
		return new FreeTextQuestion(this.serialize());
	}

	/**
	 * Part of EJSON interface.
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-typeName
	 * @returns {String} The name of the instantiated class
	 */
	typeName() {
		return "FreeTextQuestion";
	}

	translationReferrer() {
		return "view.questions.free_text_question";
	}

	/**
	 * Quick way to insert a default AnswerOption to the Question instance.
	 */
	addDefaultAnswerOption() {
		this.addAnswerOption(
			new FreeTextAnswerOption({
				hashtag: this.getHashtag(),
				questionIndex: this.getQuestionIndex(),
				answerText: "",
				answerOptionNumber: 0,
				configCaseSensitive: false,
				configTrimWhitespaces: false,
				configUseKeywords: true,
				configUsePunctuation: false
			})
		);
	}
}

/**
 * Adds a custom type to Meteor's EJSON
 * @see http://docs.meteor.com/api/ejson.html#EJSON-addType
 */
EJSON.addType("FreeTextQuestion", function (value) {
	return new FreeTextQuestion(value);
});
