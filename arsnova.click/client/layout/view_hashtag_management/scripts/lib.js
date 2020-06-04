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
import {Router} from 'meteor/iron:router';
import {EventManagerCollection} from '/lib/eventmanager/collection.js';
import {HashtagsCollection} from '/lib/hashtags/collection.js';
import {ErrorSplashscreen} from '/client/plugins/splashscreen/scripts/lib.js';
import * as localData from '/lib/local_storage.js';

export let hashtagSplashscreen = null;
export let eventManagerHandle = null;
export let eventManagerTracker = null;
export let eventManagerCollectionObserver = null;

export function setHashtagSplashscreen(instance) {
	hashtagSplashscreen = instance;
}

export function setEventManagerHandle(handle) {
	eventManagerHandle = handle;
}

export function setEventManagerTracker(handle) {
	eventManagerTracker = handle;
}

export function setEventManagerCollectionObserver(handle) {
	eventManagerCollectionObserver = handle;
}

export function findOriginalHashtag(inputHashtag) {
	const loweredHashtag = inputHashtag.toLowerCase();
	let result = "";
	if (loweredHashtag === "demo quiz") {
		return inputHashtag;
	}
	const allHashtags = HashtagsCollection.find().fetch();
	$.each(allHashtags, function (i, originalHashtag) {
		if (originalHashtag.hashtag.toLowerCase() === loweredHashtag) {
			result = originalHashtag.hashtag;
			return false;
		}
	});
	return result;
}

function getIncrementedQuizNameByRef(searchString) {
	let largestIndex = 0;
	const hashtags = HashtagsCollection.find({hashtag: {$regex: (searchString + "*"), $options: 'i'}}).fetch();
	hashtags.every(function (item) {
		const tmpIndex = parseInt(item.hashtag.split(" ").slice(-1));
		if (tmpIndex > largestIndex) {
			largestIndex = tmpIndex;
		}
		return true;
	});
	return largestIndex + 1;
}

export function getNewDemoQuizName() {
	return "Demo Quiz " + getIncrementedQuizNameByRef("demo quiz");
}

export function getNewABCDQuizName() {
	return getIncrementedQuizNameByRef("abcd");
}

export function connectEventManager(hashtag) {
	const connect = function (hashtag) {
		Meteor.subscribe("EventManagerCollection.join", hashtag, function () {
			if (!EventManagerCollection.findOne()) {
				Meteor.call('EventManagerCollection.add', hashtag, function (err) {
					if (err) {
						new ErrorSplashscreen({
							autostart: true,
							errorMessage: "plugins.splashscreen.error.error_messages." + err.reason
						});
						Router.go("/" + hashtag + "/resetToHome");
					}
				});
			} else {
				Meteor.call("EventManagerCollection.setActiveQuestion", hashtag, 0);
			}
			if (sessionStorage.getItem("overrideValidQuestionRedirect")) {
				if (Session.get("questionGroup").isValid() || hashtag.toLowerCase().indexOf("demo quiz") !== -1) {
					const bootstrapQuiz = function () {
						Meteor.call("MemberListCollection.removeFromSession", hashtag);
						Meteor.call("EventManagerCollection.setActiveQuestion", hashtag, 0);
						Meteor.call("EventManagerCollection.setSessionStatus", hashtag, 2);
						Meteor.call('SessionConfiguration.addConfig', Session.get("questionGroup").getConfiguration().serialize());
						Meteor.call("QuestionGroupCollection.persist", Session.get("questionGroup").rewrite().serialize());
						Session.delete("serverDownloadsQuizAssets");
						Router.go("/" + hashtag + "/memberlist");
					};
					if (Meteor.settings.public.useLocalAssetsCache) {
						Session.set("serverDownloadsQuizAssets", true);
						Meteor.call("QuestionGroupCollection.persist", Session.get("questionGroup").serialize(), function () {
							$.post(`/api/downloadQuizAssets?_=${new Date().getTime()}`,
								{
									sessionConfiguration: {
										hashtag: hashtag,
										privateKey: localData.getPrivateKey()
									}
								},
								bootstrapQuiz
							);
						});
					} else {
						bootstrapQuiz();
					}
				} else {
					Router.go("/" + hashtag + "/quizManager");
				}
			} else {
				Router.go("/" + hashtag + "/quizManager");
			}
			sessionStorage.removeItem("overrideValidQuestionRedirect");
		});
	};
	if (Meteor.status().connected) {
		connect(hashtag);
	} else {
		Router.go("/" + hashtag + "/quizManager");
		sessionStorage.removeItem("overrideValidQuestionRedirect");
	}
}

export function addHashtag(questionGroup) {
	if (Meteor.status().connected && !HashtagsCollection.findOne({hashtag: questionGroup.getHashtag()})) {
		Meteor.call('SessionConfiguration.addConfig', questionGroup.getConfiguration().serialize());
		Meteor.call('HashtagsCollection.addHashtag', {
			privateKey: localData.getPrivateKey(),
			hashtag: questionGroup.getHashtag()
		}, function (err) {
			if (!err) {
				localData.addHashtag(questionGroup);
				Session.set("questionGroup", questionGroup);
				connectEventManager(questionGroup.getHashtag());
			}
		});
	} else {
		localData.addHashtag(questionGroup);
		Session.set("questionGroup", questionGroup);
		connectEventManager(questionGroup.getHashtag());
	}
}

export function trimIllegalChars(hashtag) {
	return hashtag.replace(/ /g, "");
}
