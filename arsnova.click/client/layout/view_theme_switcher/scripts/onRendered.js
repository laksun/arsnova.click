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
import * as footerElements from "/client/layout/region_footer/scripts/lib.js";
import {themeTracker} from './lib.js';
import * as headerLib from '/client/layout/region_header/lib.js';

Template.themeSwitcher.onRendered(function () {
	footerElements.removeFooterElements();
	if (!Router.current().params.quizName) {
		footerElements.addFooterElement(footerElements.footerElemHome);
		footerElements.addFooterElement(footerElements.footerElemAbout);
		footerElements.addFooterElement(footerElements.footerElemTranslation);
		if (navigator.userAgent.match(/iPad/i) == null) {
			footerElements.addFooterElement(footerElements.footerElemFullscreen);
		}
		footerElements.addFooterElement(footerElements.footerElemHashtagManagement);
	}
	footerElements.footerTracker.changed();
	themeTracker.changed();
	headerLib.calculateHeaderSize();
	headerLib.calculateTitelHeight();
	$('.imagePreviewFile').on("load", function () {
		const themePreviews = $(".themePreview");
		const heights = themePreviews.map(function () {
			return $(this).height();
		}).get();
		const maxHeight = Math.max.apply(null, heights);
		themePreviews.height(maxHeight);
	});
});
