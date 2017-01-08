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
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import * as headerLib from '/client/layout/region_header/lib.js';
import * as footerElements from "/client/layout/region_footer/scripts/lib.js";
import * as localData from '/lib/local_storage.js';
import {getTooltipForRoute} from "/client/layout/global/scripts/lib.js";
import * as lib from './lib.js';

Template.defaultAnswerOptionTemplate.onRendered(function () {
	if ($(window).width() >= 992) {
		$('#answerOptionText_Number0').focus();
	}
	this.autorun(lib.renderAnsweroptionItems);
	this.autorun(function () {
		headerLib.titelTracker.depend();
		const mainContentContainer = $('#mainContentContainer');
		const previewAnsweroptionImage = $('#previewAnsweroptionImage');
		previewAnsweroptionImage.css("height", mainContentContainer.height() - 2);
		const contentWidth = (previewAnsweroptionImage.width() ? previewAnsweroptionImage.width() : previewAnsweroptionImage.height() / 1.7758186397984888);
		$('#markdownPreviewWrapper').css({
			height: previewAnsweroptionImage.height() - 140,
			width: contentWidth
		});
		$('#previewAnsweroptionContentWrapper').find('.center-block').css({width: contentWidth});
		lib.answerOptionTracker.changed();
	}.bind(this));
	$('#answerOptionWrapper').sortable({
		disabled: $.inArray(Session.get("questionGroup").getQuestionList()[Router.current().params.questionIndex].typeName(),["YesNoSingleChoiceQuestion","TrueFalseSingleChoiceQuestion"]) > -1,
		scroll: false,
		axis: 'y',
		containment: "parent",
		tolerance: "pointer",
		update: function (event, ui) {
			const questionGroup = Session.get("questionGroup");
			const indexTo = ui.item.index();
			const indexFrom = parseInt(ui.item.attr("id"));
			if (ui.item.hasClass("ui-draggable")) {
				ui.item.remove();
				questionGroup.getQuestionList()[Router.current().params.questionIndex].addDefaultAnswerOption(indexTo);
				lib.answerOptionTracker.changed();
			} else {
				const item = questionGroup.getQuestionList()[Router.current().params.questionIndex].getAnswerOptionList()[indexFrom];
				questionGroup.getQuestionList()[Router.current().params.questionIndex].removeAnswerOption(indexFrom);
				questionGroup.getQuestionList()[Router.current().params.questionIndex].addAnswerOption(item, indexTo);
				if (item.getAnswerText() === "") {
					lib.renderAnsweroptionItems();
				}
			}
			Session.set("questionGroup", questionGroup);
			localData.addHashtag(questionGroup);
		}
	});
	$('#default_answer_row').draggable({
		connectToSortable: "#answerOptionWrapper",
		scroll: false,
		axis: 'y',
		helper: "clone",
		revert: "invalid",
		stop: function (event, ui) {
			ui.helper.find('.answer_row_default_text').remove();
			const textFrame = $('.answer_row_text').first().clone().val("");
			ui.helper.append(textFrame);
		}
	});
	footerElements.removeFooterElements();
	footerElements.addFooterElement(footerElements.footerElemHome);
	headerLib.calculateHeaderSize();
	headerLib.calculateTitelHeight();
});

Template.rangedAnswerOptionTemplate.onRendered(function () {
	lib.createSlider(Router.current().params.questionIndex);
	const correctValueInputField = $('#correctValueInput');
	$.each(Session.get("questionGroup").getQuestionList()[Router.current().params.questionIndex].getValidationStackTrace(), function (index, element) {
		if (element.reason === "invalid_correct_value") {
			correctValueInputField.addClass("invalid");
			return false;
		}
	});
	footerElements.removeFooterElements();
	footerElements.addFooterElement(footerElements.footerElemHome);
	headerLib.calculateHeaderSize();
	headerLib.calculateTitelHeight();
	getTooltipForRoute();
});

Template.freeTextAnswerOptionTemplate.onRendered(function () {
	const answerList = Session.get("questionGroup").getQuestionList()[Router.current().params.questionIndex].getAnswerOptionList();
	this.autorun(function () {
		if (Session.get("loading_language")) {
			return;
		}
		Meteor.defer(function () {
			lib.formatFreeTextSettingsButtons();
			answerList.forEach(function (answerOption) {
				const configCaseSensitiveState = answerOption.getConfigCaseSensitive() ? "on" : "off";
				const configTrimWhitespacesState = answerOption.getConfigTrimWhitespaces() ? "on" : "off";
				const configUseKeywordsState = answerOption.getConfigUseKeywords() ? "on" : "off";
				const configUsePunctuationState = answerOption.getConfigUsePunctuation() ? "on" : "off";
				$('#config_case_sensitive_switch').bootstrapToggle(configCaseSensitiveState);
				$('#config_trim_whitespaces_switch').bootstrapToggle(configTrimWhitespacesState);
				$('#config_use_keywords_switch').bootstrapToggle(configUseKeywordsState);
				$('#config_use_punctuation_switch').bootstrapToggle(configUsePunctuationState);
			});
			getTooltipForRoute();
		});
	}.bind(this));
	lib.styleFreetextAnswerOptionValidation(answerList[0].isValid());
	footerElements.removeFooterElements();
	footerElements.addFooterElement(footerElements.footerElemHome);
	headerLib.calculateHeaderSize();
	headerLib.calculateTitelHeight();
});
