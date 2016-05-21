import {AbstractAnswerOption} from '../answeroptions/answeroption_abstract.js';
import {DefaultAnswerOption} from '../answeroptions/answeroption_default.js';

const hashtag = Symbol("hashtag");
const questionText = Symbol("questionText");
const timer = Symbol("timer");
const startTime = Symbol("startTime");
const questionIndex = Symbol("questionIndex");
const answerOptionList = Symbol("answerOptionList");

export class AbstractQuestion {
	constructor (options) {
		if (this.constructor === AbstractQuestion) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		if (typeof options === "undefined" || (typeof options.type !== "undefined" && options.type !== this.constructor.name)) {
			throw new TypeError("Invalid construction type");
		}
		if (typeof options.hashtag === "undefined" || typeof options.questionText === "undefined" || typeof options.timer === "undefined" || typeof options.startTime === "undefined" || typeof options.questionIndex === "undefined") {
			throw new Error("Invalid argument list for " + this.constructor.name + " instantiation");
		}
		this[hashtag] = options.hashtag;
		this[questionText] = options.questionText;
		this[timer] = options.timer;
		this[startTime] = options.startTime;
		this[questionIndex] = options.questionIndex;
		this[answerOptionList] = [];
		if (typeof options.answerOptionList === "undefined" || options.answerOptionList.length === 0) {
			for (let i = 0; i < 4; i++) {
				this.addAnswerOption(
					new DefaultAnswerOption({
						hashtag: options.hashtag,
						questionIndex: options.questionIndex,
						answerText: "",
						answerOptionNumber: i,
						isCorrect: 0
					})
				);
			}
		} else {
			for (let i = 0; i < options.answerOptionList.length; i++) {
				if (options.answerOptionList[i] instanceof AbstractAnswerOption) {
					this.addAnswerOption(options.answerOptionList[i]);
				} else {
					if (options.answerOptionList[i] instanceof Object) {
						switch (options.answerOptionList[i].type) {
							case "DefaultAnswerOption":
								this.addAnswerOption(new DefaultAnswerOption(options.answerOptionList[i]));
								break;
						}
					} else {
						throw new Error("Invalid argument list for " + this.constructor.name + " instantiation");
					}
				}
			}
		}
	}

	getHashtag () {
		return this[hashtag];
	}

	setQuestionText (text) {
		if (typeof text !== "string") {
			throw new Error("Invalid argument for Question.setText");
		}
		this[questionText] = text;
	}

	getQuestionText () {
		return this[questionText];
	}

	getQuestionIndex () {
		return this[questionIndex];
	}

	setTimer (time) {
		if (typeof time === "undefined") {
			throw new Error("Invalid argument for Question.setTimer");
		}
		this[timer] = time;
	}

	getTimer () {
		return this[timer];
	}

	setStartTime (time) {
		if (!time || new Date(time) <= new Date()) {
			throw new Error("Invalid argument for Question.setStartTime");
		}
		this[startTime] = time;
	}

	getStartTime () {
		return this[startTime];
	}

	addAnswerOption (answerOption, index) {
		if (typeof answerOption === "undefined" || !(answerOption instanceof AbstractAnswerOption)) {
			throw new Error("Invalid argument for Question.removeAnswerOption");
		}
		if (typeof index === "undefined" || index >= this.getAnswerOptionList().length) {
			this[answerOptionList].push(answerOption);
		} else {
			this[answerOptionList][index] = answerOption;
		}
	}

	removeAnswerOption (index) {
		if (typeof index === "undefined" || index < 0 || index > this.getAnswerOptionList().length) {
			throw new Error("Invalid argument for Question.removeAnswerOption");
		}
		this[answerOptionList].splice(index, 1);
	}

	removeAllAnswerOptions () {
		this[answerOptionList] = [];
	}

	getAnswerOptionList () {
		return this[answerOptionList];
	}

	serialize () {
		let answerOptionListSerialized = [];
		this.getAnswerOptionList().forEach(function (answeroption) { answerOptionListSerialized.push(answeroption.serialize()); });
		return {
			hashtag: this.getHashtag(),
			questionText: this.getQuestionText(),
			type: this.constructor.name,
			timer: this.getTimer(),
			startTime: this.getStartTime(),
			questionIndex: this.getQuestionIndex(),
			answerOptionList: answerOptionListSerialized
		};
	}

	isValid () {
		let answerOptionListValid = false;
		this.getAnswerOptionList().forEach(function (answerOption) {
			if (answerOption.isValid()) {
				answerOptionListValid = true;
			}
		});
		const markdownChars = this.getQuestionText().split().map(function (currentValue) {
			let tmpValue = currentValue;
			tmpValue = tmpValue.replace(/#/g,"");
			tmpValue = tmpValue.replace(/\*/g,"");
			tmpValue = tmpValue.replace(/1./g,"");
			tmpValue = tmpValue.replace(/\[/g,"");
			tmpValue = tmpValue.replace(/\]\(/g,"");
			tmpValue = tmpValue.replace(/\)/g,"");
			tmpValue = tmpValue.replace(/- /g,"");
			tmpValue = tmpValue.replace(/\\\(/g,"");
			tmpValue = tmpValue.replace(/\\\)/g,"");
			tmpValue = tmpValue.replace(/$/g,"");
			tmpValue = tmpValue.replace(/<hlcode>/g,"");
			tmpValue = tmpValue.replace(/<\/hlcode>/g,"");
			tmpValue = tmpValue.replace(/>/g,"");
			return tmpValue.length;
		});
		return answerOptionListValid && markdownChars[0] > 4 && markdownChars[0] < 10001 && this.getTimer() > 5 && this.getTimer() < 261;
	}

	equals (question) {
		if (question instanceof AbstractQuestion) {
			let questionAnswerOptionList = question.getAnswerOptionList();
			if (questionAnswerOptionList.length === this.getAnswerOptionList().length) {
				let isEqual = true;
				for (let i = 0; i < this.getAnswerOptionList().length; i++) {
					if (isEqual && !this.getAnswerOptionList()[i].equals(questionAnswerOptionList[i])) {
						isEqual = false;
					}
				}
				if (question.getTimer() !== this.getTimer() ||
					question.getStartTime() !== this.getStartTime() ||
					question.getHashtag() !== this.getHashtag() ||
					question.getQuestionText() !== this.getQuestionText()) {
					isEqual = false;
				}
				return isEqual;
			}
		}
		return false;
	}

	typeName () {
		return this.constructor.name;
	}

	toJSONValue () {
		return this.serialize();
	}

	addDefaultAnswerOption (index) {
		if (typeof index === "undefined" || index >= this.getAnswerOptionList().length) {
			index = this.getAnswerOptionList().length;
		}
		this.addAnswerOption(
			new DefaultAnswerOption({
				hashtag: this.getHashtag(),
				questionIndex: this.getQuestionIndex(),
				answerText: "",
				answerOptionNumber: index,
				isCorrect: 0
			}),
			index
		);
	}
}
