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
import {HashtagsCollection} from '/lib/hashtags/collection.js';
import {MemberListCollection} from '/lib/member_list/collection.js';
import {ResponsesCollection} from '/lib/responses/collection.js';

Meteor.publish('AllAttendeeUsersList', function (hashtag, privateKey) {
	new SimpleSchema({
		hashtag: {type: String},
		privateKey: {type: String}
	}).validate({hashtag, privateKey});
	if (HashtagsCollection.findOne({hashtag: hashtag}).privateKey !== privateKey) {
		return null;
	}
	const userRefs = [];
	MemberListCollection.find({hashtag: hashtag}).fetch().forEach(function (item) {
		const response = ResponsesCollection.findOne({userNick: item.nick});
		if (response) {
			userRefs.push(item.userRef);
		}
	});
	return Meteor.users.find({_id: {$in: userRefs}});
});
