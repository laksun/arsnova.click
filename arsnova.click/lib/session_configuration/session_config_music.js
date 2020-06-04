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

const hashtag = Symbol("hashtag");
const isUsingGlobalVolume = Symbol("isUsingGlobalVolume");

const lobbyEnabled = Symbol("lobbyEnabled");
const lobbyTitle = Symbol("lobbyTitle");
const lobbyVolume = Symbol("lobbyVolume");

const countdownRunningEnabled = Symbol("countdownRunningEnabled");
const countdownRunningTitle = Symbol("countdownRunningTitle");
const countdownRunningVolume = Symbol("countdownRunningVolume");

const countdownEndEnabled = Symbol("countdownEndEnabled");
const countdownEndTitle = Symbol("countdownEndTitle");
const countdownEndVolume = Symbol("countdownEndVolume");

export class MusicSessionConfiguration {
	constructor(options = {}) {
		this[hashtag] = options.hashtag;
		this[isUsingGlobalVolume] = typeof options.music.isUsingGlobalVolume === "undefined" ? Meteor.settings.public.default.sessionConfiguration.music.isUsingGlobalVolume : options.music.isUsingGlobalVolume;

		this[lobbyEnabled] = typeof options.music.lobbyEnabled === "undefined" ? Meteor.settings.public.default.sessionConfiguration.music.lobbyEnabled : options.music.lobbyEnabled;
		this[lobbyTitle] = options.music.lobbyTitle || Meteor.settings.public.default.sessionConfiguration.music.lobbyTitle;
		this[lobbyVolume] = options.music.lobbyVolume || Meteor.settings.public.default.sessionConfiguration.music.lobbyVolume;

		this[countdownRunningEnabled] = typeof options.music.countdownRunningEnabled === "undefined" ? Meteor.settings.public.default.sessionConfiguration.music.countdownRunningEnabled : options.music.countdownRunningEnabled;
		this[countdownRunningTitle] = options.music.countdownRunningTitle || Meteor.settings.public.default.sessionConfiguration.music.countdownRunningTitle;
		this[countdownRunningVolume] = options.music.countdownRunningVolume || Meteor.settings.public.default.sessionConfiguration.music.countdownRunningVolume;

		this[countdownEndEnabled] = typeof options.music.countdownEndEnabled === "undefined" ? Meteor.settings.public.default.sessionConfiguration.music.countdownEndEnabled : options.music.countdownEndEnabled;
		this[countdownEndTitle] = options.music.countdownEndTitle || Meteor.settings.public.default.sessionConfiguration.music.countdownEndTitle;
		this[countdownEndVolume] = options.music.countdownEndVolume || Meteor.settings.public.default.sessionConfiguration.music.countdownEndVolume;
	}

	serialize() {
		return {
			hashtag: this.getHashtag(),
			isUsingGlobalVolume: this.getIsUsingGlobalVolume(),

			lobbyEnabled: this.getLobbyEnabled(),
			lobbyTitle: this.getLobbyTitle(),
			lobbyVolume: this.getLobbyVolume(),

			countdownRunningEnabled: this.getCountdownRunningEnabled(),
			countdownRunningTitle: this.getCountdownRunningTitle(),
			countdownRunningVolume: this.getCountdownRunningVolume(),

			countdownEndEnabled: this.getCountdownEndEnabled(),
			countdownEndTitle: this.getCountdownEndTitle(),
			countdownEndVolume: this.getCountdownEndVolume()
		};
	}

	equals(value) {
		return (
			this.getIsUsingGlobalVolume() === value.getIsUsingGlobalVolume() &&

			this.getLobbyEnabled() === value.getLobbyEnabled() &&
			this.getLobbyTitle() === value.getLobbyTitle() &&
			this.getLobbyVolume() === value.getLobbyVolume() &&

			this.getCountdownRunningEnabled() === value.getCountdownRunningEnabled() &&
			this.getCountdownRunningTitle() === value.getCountdownRunningTitle() &&
			this.getCountdownRunningVolume() === value.getCountdownRunningVolume() &&

			this.getCountdownEndEnabled() === value.getCountdownEndEnabled() &&
			this.getCountdownEndTitle() === value.getCountdownEndTitle() &&
			this.getCountdownEndVolume() === value.getCountdownEndVolume()
		);
	}

	getHashtag() {
		return this[hashtag];
	}

	setHashtag(value) {
		this[hashtag] = value;
	}

	/* Global volume settings */

	getGlobalVolume() {
		return this.getIsUsingGlobalVolume() ? this.getLobbyVolume() : null;
	}

	getIsUsingGlobalVolume() {
		return this[isUsingGlobalVolume];
	}

	setGlobalVolume(value) {
		if (typeof value !== "number") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setGlobalVolume");
		}
		this.setLobbyVolume(value);
		this.setCountdownRunningVolume(value);
		this.setCountdownEndVolume(value);
		this.setIsUsingGlobalVolume(true);
	}

	setIsUsingGlobalVolume(value) {
		if (typeof value !== "boolean") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setIsUsingGlobalVolume");
		}
		this[isUsingGlobalVolume] = value;
	}

	/* Lobby sound settings */

	getLobbyEnabled() {
		return this[lobbyEnabled];
	}

	getLobbyTitle() {
		return this[lobbyTitle];
	}

	getLobbyVolume() {
		return this[lobbyVolume];
	}

	setLobbyEnabled(value) {
		if (typeof value !== "boolean") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setLobbyEnabled");
		}
		this[lobbyEnabled] = value;
	}

	setLobbyTitle(value) {
		if (typeof value !== "string") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setLobbyTitle");
		}
		this[lobbyTitle] = value;
	}

	setLobbyVolume(value) {
		if (typeof value !== "number") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setLobbyVolume");
		}
		this[lobbyVolume] = value;
	}

	/* Countdown-Running settings */

	getCountdownRunningEnabled() {
		return this[countdownRunningEnabled];
	}

	getCountdownRunningTitle() {
		return this[countdownRunningTitle];
	}

	getCountdownRunningVolume() {
		return this[countdownRunningVolume];
	}

	setCountdownRunningEnabled(value) {
		if (typeof value !== "boolean") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setCountdownRunningEnabled");
		}
		this[countdownRunningEnabled] = value;
	}

	setCountdownRunningTitle(value) {
		if (typeof value !== "string") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setCountdownRunningTitle");
		}
		this[countdownRunningTitle] = value;
	}

	setCountdownRunningVolume(value) {
		if (typeof value !== "number") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setCountdownRunningVolume");
		}
		this[countdownRunningVolume] = value;
	}

	/* Countdown-Ending settings */

	getCountdownEndEnabled() {
		return this[countdownEndEnabled];
	}

	getCountdownEndTitle() {
		return this[countdownEndTitle];
	}

	getCountdownEndVolume() {
		return this[countdownEndVolume];
	}

	setCountdownEndEnabled(value) {
		if (typeof value !== "boolean") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setCountdownEndEnabled");
		}
		this[countdownEndEnabled] = value;
	}

	setCountdownEndTitle(value) {
		if (typeof value !== "string") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setCountdownEndTitle");
		}
		this[countdownEndTitle] = value;
	}

	setCountdownEndVolume(value) {
		if (typeof value !== "number") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setCountdownEndVolume");
		}
		this[countdownEndVolume] = value;
	}

	static getAvailableMusic() {
		return {
			lobbyMusic: ["Song0", "Song1", "Song2", "Song3"],
			countdownRunning: ["Song0", "Song1", "Song2"],
			countdownEnd: ["Song0", "Song1"]
		};
	}
}
