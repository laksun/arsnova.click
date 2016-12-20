
import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import * as questionLib from '/client/layout/view_questions/scripts/lib.js';

Template.questionTypeView.helpers({
	isCurrentQuestionType: function (type) {
		if (!Session.get("questionGroup")) {
			return;
		}
		return Session.get("questionGroup").getQuestionList()[Router.current().params.questionIndex].typeName() === type;
	},
	questionTypes: function () {
		return questionLib.getQuestionTypes();
	},
	getDescriptionForQuestionType: function (typeName) {
		return "view.question_type.description." + typeName;
	}
});
