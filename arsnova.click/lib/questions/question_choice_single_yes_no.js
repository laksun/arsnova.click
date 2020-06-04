import {EJSON} from 'meteor/ejson';
import {TAPi18n} from 'meteor/tap:i18n';
import {SingleChoiceQuestion} from './question_choice_single.js';
import {DefaultAnswerOption} from '../answeroptions/answeroption_default.js';

export class YesNoSingleChoiceQuestion extends SingleChoiceQuestion {

	/**
	 * Constructs a YesNoSingleChoiceQuestion instance
	 * @see AbstractChoiceQuestion.constructor()
	 * @param options
	 */
	constructor(options) {
		if (typeof options.type !== "undefined" && options.type !== "YesNoSingleChoiceQuestion") {
			throw new TypeError("Invalid construction type while creating new YesNoSingleChoiceQuestion");
		}
		if (options.type !== "YesNoSingleChoiceQuestion") {
			options.answerOptionList = [
				new DefaultAnswerOption({
					hashtag: options.hashtag,
					questionIndex: options.questionIndex,
					answerText: TAPi18n.__("lib.questions.question_choice_single_yes_no.yes"),
					answerOptionNumber: 0,
					isCorrect: true
				}),
				new DefaultAnswerOption({
					hashtag: options.hashtag,
					questionIndex: options.questionIndex,
					answerText: TAPi18n.__("lib.questions.question_choice_single_yes_no.no"),
					answerOptionNumber: 1,
					isCorrect: false
				})
			];
		}
		delete options.type;
		super(options);
	}

	/**
	 * Part of EJSON interface
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-clone
	 * @returns {YesNoSingleChoiceQuestion} An independent deep copy of the current instance
	 */
	clone() {
		return new YesNoSingleChoiceQuestion(this.serialize());
	}

	/**
	 * Serialize the instance object to a JSON compatible object
	 * @returns {{hashtag:String,questionText:String,type:AbstractQuestion,timer:Number,startTime:Number,questionIndex:Number,answerOptionList:Array}}
	 */
	serialize() {
		return Object.assign(super.serialize(), {type: "YesNoSingleChoiceQuestion"});
	}

	/**
	 * Part of EJSON interface.
	 * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-typeName
	 * @returns {String} The name of the instantiated class
	 */
	typeName() {
		return "YesNoSingleChoiceQuestion";
	}

	translationReferrer() {
		return "view.questions.single_choice_question_yes_no";
	}

	removeAnswerOption() {
		throw Error("AnswerOptions cannot be modified for this type of Question!");
	}

	addDefaultAnswerOption() {
		throw Error("AnswerOptions cannot be modified for this type of Question!");
	}
}

/**
 * Adds a custom type to Meteor's EJSON
 * @see http://docs.meteor.com/api/ejson.html#EJSON-addType
 */
EJSON.addType("YesNoSingleChoiceQuestion", function (value) {
	return new YesNoSingleChoiceQuestion(value);
});
