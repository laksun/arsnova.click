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
import {createTabIndices} from '/client/startup.js';
import * as headerLib from '/client/layout/region_header/lib.js';

export const footerElemTranslation = {
	id: "translation",
	iconClass: "glyphicon glyphicon-globe",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.languages"
};
export const footerElemSound = {
	id: "sound",
	iconClass: "glyphicon glyphicon-music",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.sound",
	selectable: true,
	showIntro: true
};
export const footerElemReadingConfirmation = {
	id: "reading-confirmation",
	iconClass: "glyphicon glyphicon-eye-open",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.reading-confirmation",
	selectable: true,
	showIntro: true
};
export const footerElemTheme = {
	id: "theme",
	iconClass: "glyphicon glyphicon-apple",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.style"
};
export const footerElemImport = {
	id: "import",
	iconClass: "glyphicon glyphicon-import glyphicon-import-style",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.import"
};
export const footerElemHashtagManagement = {
	id: "hashtagManagement",
	iconClass: "glyphicon glyphicon-wrench",
	textClass: "footerElementText",
	textName: "view.hashtag_management.session_management"
};
export const footerElemFullscreen = {
	id: "fullscreen",
	iconClass: "glyphicon glyphicon-fullscreen",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.fullscreen"
};
export const footerElemHome = {
	id: "home",
	iconClass: "glyphicon glyphicon-home",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.home"
};
export const footerElemAbout = {
	id: "about",
	iconClass: "glyphicon glyphicon-info-sign",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.info"
};
export const footerElemQRCode = {
	id: "qr-code",
	iconClass: "glyphicon glyphicon-qrcode",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.qr_code",
	showIntro: true
};
export const footerElemNicknames = {
	id: "nicknames",
	iconClass: "glyphicon glyphicon-sunglasses",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.nicknames",
	selectable: true,
	showIntro: true
};
export const footerElemEditQuiz = {
	id: "edit-quiz",
	iconClass: "glyphicon glyphicon-edit",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.edit_quiz"
};
export const footerElemProductTour = {
	id: "product-tour",
	iconClass: "glyphicon glyphicon-flag",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.show_product_tour",
	selectable: true
};
export const footerElemResponseProgress = {
	id: "response-progress",
	iconClass: "glyphicon glyphicon-object-align-left",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.show_response_progress",
	selectable: true,
	showIntro: true
};
export const footerElemConfidenceSlider = {
	id: "confidence-slider",
	iconClass: "glyphicon glyphicon-dashboard",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.show_confidence_slider",
	selectable: true,
	showIntro: true
};
export const footerElemShowMore = {
	id: "show-more",
	iconClass: "glyphicon glyphicon-option-vertical",
	textClass: "footerElementText",
	textName: "region.footer.footer_bar.show_more"
};
export const productTourTracker = new Tracker.Dependency();
const footerElements = [];
const hiddenFooterElements = {
	selectable: [],
	linkable: []
};

export const footerTracker = new Tracker.Dependency();

export function addFooterElement(footerElement, priority = 100) {
	let hasItem = false;
	$.each(footerElements, function (index, item) {
		if (item.id === footerElement.id) {
			hasItem = true;
			return false;
		}
	});
	if (!hasItem) {
		footerElements.splice(priority, 0, footerElement);
	}
}

export function getCurrentFooterElements() {
	const allElements = $.merge([], footerElements);
	$.merge(allElements, hiddenFooterElements.selectable);
	$.merge(allElements, hiddenFooterElements.linkable);
	return allElements;
}

export function getFooterElementById(id) {
	switch (id) {
		case "translation":
			return footerElemTranslation;
		case "sound":
			return footerElemSound;
		case "reading-confirmation":
			return footerElemReadingConfirmation;
		case "theme":
			return footerElemTheme;
		case "import":
			return footerElemImport;
		case "hashtagManagement":
			return footerElemHashtagManagement;
		case "fullscreen":
			return footerElemFullscreen;
		case "home":
			return footerElemHome;
		case "about":
			return footerElemAbout;
		case "qr-code":
			return footerElemQRCode;
		case "nicknames":
			return footerElemNicknames;
		case "edit-quiz":
			return footerElemEditQuiz;
		case "show-more":
			return footerElemShowMore;
		case "footerElemProductTour":
			return footerElemProductTour;
		case "footerElemResponseProgress":
			return footerElemResponseProgress;
	}
}

export function updateStatefulFooterElements() {
	createTabIndices();
}

export function calculateFooterFontSize() {
	let iconSize = "2rem", textSize = "1.5rem";
	const navbarFooter = $(".navbar-footer");
	const fixedBottom = $('.fixed-bottom');
	$(".footerElemText").css("fontSize", textSize);
	navbarFooter.css({"fontSize": iconSize});
	fixedBottom.css("bottom", navbarFooter.height());
	fixedBottom.show();
	return {
		icon: iconSize,
		text: textSize
	};
}

export function generateFooterElements() {
	$.merge(footerElements, hiddenFooterElements.selectable);
	$.merge(footerElements, hiddenFooterElements.linkable);
	hiddenFooterElements.selectable.splice(0, hiddenFooterElements.selectable.length);
	hiddenFooterElements.linkable.splice(0, hiddenFooterElements.linkable.length);
	let maxElems = 4;
	if ($(document).width() >= 1200) {
		maxElems = 12;
	} else if ($(document).width() >= 992) {
		maxElems = 6;
	}
	const index = $.inArray(footerElemShowMore, footerElements);
	if (index > 0) {
		footerElements.splice(index, 1);
	}
	if (footerElements.length > maxElems) {
		for (let i = footerElements.length - 1; i >= maxElems - 1; i--) {
			hiddenFooterElements[footerElements[i].selectable ? "selectable" : "linkable"].push(footerElements[i]);
			footerElements.splice(i, 1);
		}
		addFooterElement(footerElemShowMore);
	}
	Session.set("footerElements", footerElements);
	Session.set("hiddenFooterElements", hiddenFooterElements);
	return footerElements;
}

export function removeFooterElement(footerElement) {
	let hasFoundItem = false;
	$.each(footerElements, function (index, item) {
		if (item.id === footerElement.id) {
			footerElements.splice(index, 1);
			hasFoundItem = true;
			return false;
		}
	});
	if (hasFoundItem) {
		return;
	}
	$.each(hiddenFooterElements.selectable, function (index, item) {
		if (item.id === footerElement.id) {
			hiddenFooterElements.selectable.splice(index, 1);
			hasFoundItem = true;
			return false;
		}
	});
	if (hasFoundItem) {
		return;
	}
	$.each(hiddenFooterElements.linkable, function (index, item) {
		if (item.id === footerElement.id) {
			hiddenFooterElements.linkable.splice(index, 1);
			return false;
		}
	});
	//footerTracker.changed();
}

export function removeFooterElements() {
	footerElements.splice(0, footerElements.length);
	hiddenFooterElements.selectable.splice(0, hiddenFooterElements.selectable.length);
	hiddenFooterElements.linkable.splice(0, hiddenFooterElements.linkable.length);
	Session.set("footerElements", footerElements);
	Session.set("hiddenFooterElements", hiddenFooterElements);
	//footerTracker.changed();
}

const footerTrackerCallback = function () {
	footerTracker.depend();
	headerLib.titelTracker.depend();
	if ($(window).height() > 400) {
		generateFooterElements();
		updateStatefulFooterElements();
		calculateFooterFontSize();
	}
};

Meteor.defer(function () {
	Tracker.autorun(footerTrackerCallback);
	$(window).on('resize', footerTrackerCallback);
});
