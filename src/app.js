'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const { VoiceCMS } = require('jovo-plugin-voicecms');

const app = new App();

app.use(
	new Alexa(),
	new GoogleAssistant(),
	new JovoDebugger(),
	new FileDb(),
	new VoiceCMS({ 
		endpoint: "http://localhost:1234", // Endpoint of the Voice CMS API
		projectId: "your project id" // Insert here the ID of your Project in the CMS!
	})
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		this.$user.$data.index = 0;
		this.$user.$data.currentPoints = 0;
		this.$speech.addAudio(this.t('Sound.intro.soundbank_url'));
		this.$speech.addText(this.t('Responses.welcome.response'));
		askQuestion(this);
	},

	NEW_USER() {
		this.$user.$data = {
			index: 0,
			totalPoints: 0,
			currentPoints: 0,
		}
	},

	TrueOrFalseIntent() {
		const input = this.$inputs.answer.id;
		const answer = parseBoolean(input);
		console.log(`input answer:   ${answer}`);
		const correctAnswer = this.t(`Statements.qs${this.$user.$data.index}.answer`);
		console.log(`correct answer: ${correctAnswer}`);
		if (answer === correctAnswer) {
			this.$user.$data.currentPoints++;
			this.$speech.addAudio(this.t('Sound.correct.soundbank_url'));
		} else {
			this.$user.$data.currentPoints--;
			this.$speech.addAudio(this.t('Sound.incorrect.soundbank_url'));
			this.$speech.addText(this.t('Responses.incorrect.response', {
				correctAnswer: correctAnswer
			}));
		}
		this.$user.$data.index++;
		askQuestion(this);
	},

	Unhandled() {
		this.$reprompt.addText(this.t('Responses.reprompt.response'));
		this.ask(this.$reprompt, this.$reprompt);
	},

	END() {
		this.tell(this.t('Responses.goodbye.response'));
	}

});

function askQuestion(jovo) {
	const index = jovo.$user.$data.index;
	console.log(`index: ${index}`);
	const currentStatement = jovo.t(`Statements.qs${index}.statement`);
	console.log(currentStatement);
	// no value found, end of statement list
	if (currentStatement.includes('Statements')) {
		console.log(`end`);
		// count total points
		jovo.$user.$data.totalPoints += jovo.$user.$data.currentPoints;
		jovo.$speech.addAudio(jovo.t('Sound.outro.soundbank_url'));
		jovo.$speech.addText(
			jovo.t('Responses.end.response', {
				currentPoints: jovo.$user.$data.currentPoints,
				totalPoints: jovo.$user.$data.totalPoints
			}));
		jovo.tell(jovo.$speech);
		return;
	}
	jovo.$speech.addAudio(jovo.t('Sound.forward.soundbank_url'));
	jovo.$speech.addText(
		jovo.t('Responses.question.response', {
			statement: currentStatement
		}));
	jovo.$reprompt.addText(jovo.t('Responses.reprompt.response'));
	jovo.ask(jovo.$speech, jovo.$reprompt);
}

function parseBoolean(string) {
	switch (string.trim().toLowerCase()) {
		case "true": return true;
		case "false": return false;
		default: return false;
	}
}

module.exports.app = app;
