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
import SimpleSchema from 'simpl-schema';
import {NicknameCategoriesCollection, nickCategorySchema} from '/lib/nickname_categories/collection.js';
import {userNickSchema} from '/lib/member_list/collection.js';

Meteor.methods({
	'NicknameCategoriesCollection.addNickname': function (name, category) {
		new SimpleSchema({nick: userNickSchema, nickCategory: nickCategorySchema}).validate({
			nick: name,
			nickCategory: category
		});
		NicknameCategoriesCollection.insert({nick: name, nickCategory: category});
	}
});
