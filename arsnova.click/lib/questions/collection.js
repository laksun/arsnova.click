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
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {hashtagSchema} from '../hashtags/collection.js';
import * as localData from '/lib/local_storage.js';

/**
 * @summary Constructor for a Collection
 * @locus Anywhere
 * @instancename collection
 * @class
 * @param {String} name The name of the collection.  If null, creates an unmanaged (unsynchronized) local collection.
 * @param {Object} [options]
 * @param {Object} options.connection The server connection that will manage this collection. Uses the default connection if not specified.  Pass the return value of calling [`DDP.connect`](#ddp_connect) to specify a different server. Pass `null` to specify no connection. Unmanaged (`name` is null) collections cannot specify a connection.
 * @param {String} options.idGeneration The method of generating the `_id` fields of new documents in this collection.  Possible values:
 - **`'STRING'`**: random strings
 - **`'MONGO'`**:  random [`Mongo.ObjectID`](#mongo_object_id) values
The default id generation technique is `'STRING'`.
 * @param {Function} options.transform An optional transformation function. Documents will be passed through this function before being returned from `fetch` or `findOne`, and before being passed to callbacks of `observe`, `map`, `forEach`, `allow`, and `deny`. Transforms are *not* applied for the callbacks of `observeChanges` or to cursors returned from publish functions.
 */
export const QuestionGroupCollection = new Mongo.Collection("questionGroup");
export const questionTextSchema = {
	type: String,
	optional: true,
	max: 50000
};
export const timerSchema = {
	type: Number,
	min: 0
};
export const startTimeSchema = {
	type: String,
	optional: true
};
export const rangeMinSchema = {
	type: Number,
	min: 0
};
export const rangeMaxSchema = {
	type: Number,
	min: 0
};
export const correctValueSchema = {
	type: Number,
	min: 0
};
export const isFirstStartSchema = {
	type: Boolean
};

export const questionGroupSchema = new SimpleSchema({
	hashtag: hashtagSchema,
	questionList: {
		/* The index is defined in the EventManager.questionIndex variable. The arrays index represents the questionIndex. */
		type: [Object]
	},
	"questionList.$.hashtag": {
		type: hashtagSchema,
		optional: true
	},
	"questionList.$.type": {
		type: String,
		optional: true
	},
	"questionList.$.isFirstStart": {
		type: isFirstStartSchema,
		optional: true
	},
	"questionList.$.questionText": {
		type: questionTextSchema,
		optional: true
	},
	"questionList.$.questionIndex": {
		type: Number,
		optional: true
	},
	"questionList.$.displayAnswerText": {
		type: Boolean,
		optional: true
	},
	"questionList.$.multipleSelectionEnabled": {
		type: Boolean,
		optional: true
	},
	"questionList.$.answerOptionList": {
		type: [Object],
		optional: true,
		blackbox: true
	},
	"questionList.$.timer": {
		type: timerSchema
	},
	"questionList.$.startTime": {
		type: startTimeSchema,
		optional: true
	},
	"questionList.$.rangeMin": {
		type: rangeMinSchema,
		optional: true
	},
	"questionList.$.rangeMax": {
		type: rangeMaxSchema,
		optional: true
	},
	"questionList.$.correctValue": {
		type: correctValueSchema,
		optional: true
	}
});

QuestionGroupCollection.deny({
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

QuestionGroupCollection.allow({
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
