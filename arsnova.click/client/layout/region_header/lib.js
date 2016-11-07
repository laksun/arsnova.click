/*
 * This file is part of ARSnova Click.
 * Copyright (C) 2016 The ARSnova Team
 *
 * ARSnova Click is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Click is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Click.  If not, see <http://www.gnu.org/licenses/>.*/

import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';
import * as localData from '/lib/local_storage.js';
import * as memberlistLib from '/client/layout/view_lobby/scripts/lib.js';

export function isEditingQuestion() {
	switch (Router.current().route.getName()) {
		case ":quizName.question":
		case ":quizName.answeroptions":
		case ":quizName.settimer":
		case ":quizName.quizSummary":
			return true;
		default:
			return false;
	}
}

export function addNewQuestion() {
	const questionItem = Session.get("questionGroup");
	const index = questionItem.getQuestionList().length;
	questionItem.addDefaultQuestion();
	Session.set("questionGroup", questionItem);
	localData.addHashtag(questionItem);
	Meteor.call("EventManagerCollection.setActiveQuestion", Router.current().params.quizName, index, function () {
		Router.go("/" + Router.current().params.quizName + "/question");
	});
}

export const titelTracker = new Tracker.Dependency();
export function calculateTitelHeight() {
	var fixedTop = $(".navbar-fixed-top");
	var container = $(".container");
	var footerHeight = $(".fixed-bottom").outerHeight(true) + $(".footer-info-bar").outerHeight();
	var navbarFooterHeight = $('.navbar-fixed-bottom').is(":visible") ? $(".navbar-fixed-bottom").outerHeight() : 0;

	$('.titel').css('margin-top', fixedTop.outerHeight() * 1.1);

	const marginTop = $('.row-padding-bottom').outerHeight(true) || fixedTop.outerHeight() * 1.1;
	var finalHeight = $(window).height() - marginTop - navbarFooterHeight - footerHeight;
	container.css("height", finalHeight);
	if (!$('.row-padding-bottom').outerHeight()) {
		container.css("margin-top", marginTop);
	} else {
		container.css("margin-top", 0);
	}

	titelTracker.changed();
	return {
		height: finalHeight,
		marginTop: fixedTop.outerHeight()
	};
}
Tracker.autorun(function () {
	memberlistLib.memberlistTracker.depend();
	calculateTitelHeight();
});

export function calculateHeaderSize() {
	var titel = $('.header-title').text().trim();
	var titleLength = titel.length;

	var fontSize = "";
	let logoHeight;

	if ($(document).width() > $(document).height()) {
		logoHeight = "8vw";
	} else {
		logoHeight = "8vh";
	}
	$('.arsnova-logo img').css("height", logoHeight);

	if (titleLength <= 15) {
		if ($(document).width() > $(document).height()) {
			if ($(document).width() < 1200) {
				fontSize = "6vw";
			} else {
				fontSize = "5vw";
			}
		} else {
			fontSize = "5vh";
		}
	} else if (titleLength <= 20) {
		if ($(document).width() > $(document).height()) {
			fontSize = "5.5vw";
		} else {
			fontSize = "4vh";
		}
	} else {
		if ($(document).width() > $(document).height()) {
			fontSize = "4vw";
		} else {
			fontSize = "3vh";
		}
	}
	$(".header-title").css({"font-size": fontSize, "line-height": $('.arsnova-logo').height() + "px"});
}
