# Sample Quiz Game Jovo App
A simple True-or-False Quiz Game Alexa Skill, built with Jovo Framework. 

It uses Voice CMS, an open source content management system for voice apps.
Voice CMS can be found here: https://github.com/pialuna/voice-cms
![Voice CMS](https://raw.githubusercontent.com/pialuna/voice-cms/main/docs/voice-cms.png)



## Setup 

```bash
# to run a Jovo app locally, you need to install the Jovo CLI
npm install -g jovo-cli

# install dependencies in the project root
npm install

# run voice app
jovo run

```
The Jovo Framework documentation can be found here: [jovo.tech/docs](https://www.jovo.tech/docs/)



In `src/app.js` the Voice CMS Jovo Plugin is initialized. As options, pass the endpoint of your Voice CMS API and the ID of your project in the CMS.
```javascript
app.use(
	// ...
	new VoiceCMS({ 
		endpoint: "http://localhost:1234", // Your endpoint of the Voice CMS API
		projectId: "604bda3b3d03e334b6a6a33f" // The id of your project in the Voice CMS
	})
);
```

In the app logic in `src/app.js`, you can see how the content from Voice CMS is accessed through a key that is composed like this: `<CollectionName>.<key>.<ColumnName>`

```javascript
this.$speech.addAudio(this.t('Sound.intro.soundbank_url'));

this.$speech.addText(this.t('Responses.welcome.response'));

this.ask(this.$speech);
```
For more information:

Voice CMS: https://github.com/pialuna/voice-cms

Jovo Plugin for Voice CMS: [pialuna/jovo-plugin-voicecms](https://github.com/pialuna/jovo-plugin-voicecms).

Jovo Framework documentation: [jovo.tech/docs](https://www.jovo.tech/docs/)

