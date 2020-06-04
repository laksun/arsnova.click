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

import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {hashtagSchema} from '../hashtags/collection.js';
import * as localData from '/lib/local_storage.js';

export const SessionConfigurationCollection = new Mongo.Collection("sessionConfiguration");

export const SessionConfigurationSchema = new SimpleSchema({
	hashtag: hashtagSchema,
	theme: {
		type: String
	},
	music: {
		type: Object
	},
	readingConfirmationEnabled: {
		type: Boolean
	},
	showResponseProgress: {
		type: Boolean
	},
	confidenceSliderEnabled: {
		type: Boolean
	},
	"music.isUsingGlobalVolume": {
		type: Boolean
	},
	"music.lobbyEnabled": {
		type: Boolean
	},
	"music.lobbyTitle": {
		type: String
	},
	"music.lobbyVolume": {
		type: Number
	},
	"music.countdownRunningEnabled": {
		type: Boolean
	},
	"music.countdownRunningTitle": {
		type: String
	},
	"music.countdownRunningVolume": {
		type: Number
	},
	"music.countdownEndEnabled": {
		type: Boolean
	},
	"music.countdownEndTitle": {
		type: String
	},
	"music.countdownEndVolume": {
		type: Number
	},
	nicks: {
		type: Object
	},
	"nicks.selectedValues": {
		type: Array // [String]
	},
	"nicks.selectedValues.$": {
		type: String
	},
	"nicks.blockIllegal": {
		type: Boolean
	},
	"nicks.restrictToCASLogin": {
		type: Boolean
	}
});

SessionConfigurationCollection.attachSchema(SessionConfigurationSchema);

SessionConfigurationCollection.deny({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});

SessionConfigurationCollection.allow({
	insert: function (userId, doc) {
		return localData.containsHashtag(doc.hashtag);
	},
	update: function (userId, doc) {
		return localData.containsHashtag(doc.hashtag);
	},
	remove: function (userId, doc) {
		return localData.containsHashtag(doc.hashtag);
	}
});
