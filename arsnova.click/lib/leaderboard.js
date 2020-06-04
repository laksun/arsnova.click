import {Session} from 'meteor/session';
import {Router} from 'meteor/iron:router';
import {AnswerOptionCollection} from '/lib/answeroptions/collection.js';
import {ResponsesCollection} from '/lib/responses/collection.js';
import {QuestionGroupCollection} from '/lib/questions/collection.js';

let hashtag = null;
export function init(hashtagVal = Router.current().params.hashtag) {
	hashtag = hashtagVal;
}

function checkIsCorrectSingleChoiceQuestion(response, questionIndex) {
	let hasCorrectAnswer = false;
	AnswerOptionCollection.find({
		isCorrect: true,
		questionIndex: questionIndex,
		inputValue: response.inputValue,
		hashtag: hashtag
	}).fetch().forEach(function (answeroption) {
		hasCorrectAnswer = response.answerOptionNumber.indexOf(answeroption.answerOptionNumber) > -1;
	});
	return hasCorrectAnswer;
}

function checkIsCorrectMultipleChoiceQuestion(response, questionIndex) {
	let hasCorrectAnswer = 0;
	let hasWrongAnswer = 0;
	const allCorrectAnswerOptions = AnswerOptionCollection.find({
		isCorrect: true,
		questionIndex: questionIndex,
		inputValue: response.inputValue,
		hashtag: hashtag
	}).fetch();
	response.answerOptionNumber.every(function (element) {
		const tmpCorrectAnswer = hasCorrectAnswer;
		allCorrectAnswerOptions.every(function (item) {
			if (element === item.answerOptionNumber) {
				hasCorrectAnswer++;
				return false;
			}
			return true;
		});
		if (tmpCorrectAnswer === hasCorrectAnswer) {
			hasWrongAnswer++;
		}
		return true;
	});
	if (hasWrongAnswer > 0) {
		return -1;
	}
	if (hasCorrectAnswer > 0) {
		if (allCorrectAnswerOptions.length === hasCorrectAnswer) {
			return 1;
		} else {
			return 0;
		}
	}
	return -1;
}

function checkIsCorrectRangedQuestion(response, questionIndex) {
	const question = QuestionGroupCollection.findOne({
		hashtag: hashtag
	}).questionList[questionIndex];
	return response.rangedInputValue >= question.rangeMin && response.rangedInputValue <= question.rangeMax;
}

function checkIsCorrectFreeTextQuestion(response, questionIndex) {
	const answerOption = AnswerOptionCollection.findOne({
			hashtag: hashtag,
			questionIndex: questionIndex
		}) || Session.get("questionGroup").getQuestionList()[questionIndex].getAnswerOptionList()[0].serialize();
	let userHasRightAnswers = false;
	const clonedResponse = JSON.parse(JSON.stringify(response));
	if (!answerOption.configCaseSensitive) {
		answerOption.answerText = answerOption.answerText.toLowerCase();
		clonedResponse.freeTextInputValue = clonedResponse.freeTextInputValue.toLowerCase();
	}
	if (!answerOption.configUsePunctuation) {
		answerOption.answerText = answerOption.answerText.replace(/(\.)*(,)*(!)*(")*(;)*(\?)*/g, "");
		clonedResponse.freeTextInputValue = clonedResponse.freeTextInputValue.replace(/(\.)*(,)*(!)*(")*(;)*(\?)*/g, "");
	}
	if (answerOption.configUseKeywords) {
		if (!answerOption.configTrimWhitespaces) {
			answerOption.answerText = answerOption.answerText.replace(/ /g, "");
			clonedResponse.freeTextInputValue = clonedResponse.freeTextInputValue.replace(/ /g, "");
		}
		userHasRightAnswers = answerOption.answerText === clonedResponse.freeTextInputValue;
	} else {
		let hasCorrectKeywords = true;
		answerOption.answerText.split(" ").forEach(function (keyword) {
			if (clonedResponse.freeTextInputValue.indexOf(keyword) === -1) {
				hasCorrectKeywords = false;
			}
		});
		userHasRightAnswers = hasCorrectKeywords;
	}
	return userHasRightAnswers;
}

export function isCorrectResponse(response, question, questionIndex) {
	switch (question.type) {
		case "SingleChoiceQuestion":
		case "YesNoSingleChoiceQuestion":
		case "TrueFalseSingleChoiceQuestion":
			return checkIsCorrectSingleChoiceQuestion(response, questionIndex);
		case "MultipleChoiceQuestion":
			return checkIsCorrectMultipleChoiceQuestion(response, questionIndex);
		case "SurveyQuestion":
		case "ABCDSingleChoiceQuestion":
			return true;
		case "RangedQuestion":
			return checkIsCorrectRangedQuestion(response, questionIndex);
		case "FreeTextQuestion":
			return checkIsCorrectFreeTextQuestion(response, questionIndex);
		default:
			throw new Error("Unsupported question type while checking correct response");
	}
}

export function objectToArray(obj) {
	const keyList = Object.keys(obj);
	return keyList.map(function (value, index) {
		return {
			nick: keyList[index],
			responseTime: obj[value].responseTime,
			confidenceValue: obj[value].confidenceValue,
			correctQuestions: obj[value].correctQuestions,
			numberOfEntries: obj[value].numberOfEntries
		};
	});
}

export function getLeaderboardItemsByIndex(questionIndex) {
	const question = QuestionGroupCollection.findOne({
		hashtag: hashtag
	}).questionList[questionIndex];
	const result = {};
	if (["SurveyQuestion"].indexOf(question.type) === -1) {
		ResponsesCollection.find({
			hashtag: hashtag,
			questionIndex: questionIndex
		}).forEach(function (item) {
			const isCorrect = isCorrectResponse(item, question, questionIndex);
			if (typeof result[item.userNick] === "undefined") {
				result[item.userNick] = {
					responseTime: 0,
					confidenceValue: -1,
					confidenceValueEntries: 0,
					correctQuestions: isCorrect === true || isCorrect > 0 ? [questionIndex + 1] : [],
					numberOfEntries: 1
				};
			}
			result[item.userNick].responseTime += item.responseTime;
			if (item.confidenceValue > -1) {
				result[item.userNick].confidenceValue = item.confidenceValue;
				result[item.userNick].confidenceValueEntries = 1;
			}
		});
	}
	return result;
}

export function getAllLeaderboardItems(keepAllNicks = false) {
	const questionList = QuestionGroupCollection.findOne({hashtag: hashtag}).questionList;
	const questionCount = questionList.filter(function (item) {
		return ["SurveyQuestion"].indexOf(item.type) === -1;
	}).length;
	let allItems = getLeaderboardItemsByIndex(0);
	for (let i = 1; i < questionList.length; i++) {
		const tmpItems = getLeaderboardItemsByIndex(i);
		for (const o in tmpItems) {
			if (tmpItems.hasOwnProperty(o)) {
				if (typeof allItems[o] === "undefined") {
					allItems[o] = {
						responseTime: 0,
						confidenceValue: 0,
						confidenceValueEntries: 0,
						correctQuestions: [],
						numberOfEntries: 0
					};
				}
				allItems[o].responseTime += tmpItems[o].responseTime;
				if (tmpItems[o].confidenceValue > -1) {
					allItems[o].confidenceValue += tmpItems[o].confidenceValue;
					allItems[o].confidenceValueEntries += 1;
				}
				if (tmpItems[o].correctQuestions.length > 0) {
					allItems[o].correctQuestions.push(i + 1);
				}
				allItems[o].numberOfEntries += 1;
			}
		}
	}
	for (const key in allItems) {
		if (allItems.hasOwnProperty(key)) {
			allItems[key].confidenceValue = allItems[key].confidenceValue / allItems[key].confidenceValueEntries;
		}
	}
	if (!keepAllNicks) {
		for (const o in allItems) {
			if (allItems.hasOwnProperty(o) && allItems[o].correctQuestions.length !== questionCount) {
				delete allItems[o];
			}
		}
	}
	return allItems;
}
