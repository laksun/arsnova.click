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
import {TAPi18n} from 'meteor/tap:i18n';
import {calculateHeaderSize} from '/client/layout/region_header/lib.js';
import * as localData from '/lib/local_storage.js';
import * as footerElements from "./lib.js";

Template.footer.onRendered(function () {
	footerElements.calculateFooter();
});

Template.showMore.onRendered(function () {
	if (footerElements.getCurrentFooterElements().length === 0 || localStorage.getItem("lastPage") === ":quizName.showMore") {
		const restoredFooters = JSON.parse(sessionStorage.getItem("footerElementsBackup"));
		if (restoredFooters && restoredFooters.length > 0) {
			footerElements.removeFooterElements();
			restoredFooters.forEach(function (item) {
				footerElements.addFooterElement(footerElements.getFooterElementById(item));
			});
		}
	} else {
		const footerList = [];
		footerElements.getCurrentFooterElements().forEach(function (item) {
			footerList.push(item.id);
		});
		sessionStorage.setItem("footerElementsBackup", JSON.stringify(footerList));
	}
	footerElements.calculateFooter();
	$("[name='switch']").bootstrapSwitch({
		size: "small",
		onText: TAPi18n.__("region.footer.show-more.onText"),
		offText: TAPi18n.__("region.footer.show-more.offText"),
		onSwitchChange: function (event, state) {
			switch (event.target.id.replace("_switch", "")) {
				case "reading-confirmation":
					const questionGroup = Session.get("questionGroup");
					questionGroup.getConfiguration().setReadingConfirmationEnabled(state);
					Session.set("questionGroup", questionGroup);
					localData.addHashtag(questionGroup);
					Meteor.call("SessionConfiguration.setReadingConfirmationEnabled",
						Session.get("questionGroup").getHashtag(),
						Session.get("questionGroup").getConfiguration().getReadingConfirmationEnabled()
					);
			}
		}
	});
});

Template.contactHeaderBar.onRendered(function () {
	footerElements.removeFooterElements();
	footerElements.addFooterElement(footerElements.footerElemHome);
	footerElements.addFooterElement(footerElements.footerElemTranslation);
	footerElements.addFooterElement(footerElements.footerElemTheme);
	if (navigator.userAgent.match(/iPad/i) == null) {
		footerElements.addFooterElement(footerElements.footerElemFullscreen);
	}
	footerElements.addFooterElement(footerElements.footerElemHashtagManagement);
	footerElements.calculateFooter();
});

Template.about.onRendered(function () {
	calculateHeaderSize();
	$(window).resize(calculateHeaderSize);
});

Template.agb.onRendered(function () {
	calculateHeaderSize();
	$(window).resize(calculateHeaderSize);
});

Template.dataprivacy.onRendered(function () {
	calculateHeaderSize();
	$(window).resize(calculateHeaderSize);
});

Template.imprint.onRendered(function () {
	calculateHeaderSize();
	$(window).resize(calculateHeaderSize);
});
