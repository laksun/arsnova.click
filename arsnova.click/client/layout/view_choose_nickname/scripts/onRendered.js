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

import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {MemberListCollection} from '/lib/member_list/collection.js';
import * as footerElements from "/client/layout/region_footer/scripts/lib.js";
import * as lib from './lib.js';

Template.nick.onRendered(function () {
	const hashtag = Router.current().params.quizName;
	if (MemberListCollection.findOne({hashtag: hashtag, privateKey: localStorage.getItem("privateKey")})) {
		sessionStorage.setItem(hashtag + "nick", MemberListCollection.findOne({
			hashtag: hashtag,
			privateKey: localStorage.getItem("privateKey")
		}).nick);
		Router.go("/" + hashtag + "/memberlist");
	}

	footerElements.removeFooterElements();
	footerElements.footerTracker.changed();
	lib.nickTracker.changed();
});

Template.nickStandardFooter.onRendered(function () {
	$("#forwardButton, #loginViaCas").attr("disabled", "disabled");
	if ($(window).width() >= 992) {
		$('#nickname-input-field').focus();
	}

	footerElements.removeFooterElements();
	footerElements.footerTracker.changed();
	lib.nickTracker.changed();
});

Template.nickLimitedFooter.onRendered(function () {
	footerElements.removeFooterElements();
	footerElements.footerTracker.changed();
	lib.nickTracker.changed();
});

Template.nickLimited.onRendered(function () {
	footerElements.removeFooterElements();
	footerElements.footerTracker.changed();
	lib.nickTracker.changed();
});

