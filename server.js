const { WebClient } = require('@slack/web-api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3005; // Set the desired port for your bot

const slackToken = <TOKEN-HERE>HERE</TOKEN-HERE>;
const client = new WebClient(slackToken);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/slack/events', async (req, res) => {

    const { challenge, event } = req.body;

    if (challenge) {
        res.send(challenge);
        return;
    }

    const channel = req.body.channel_id;
    try {

        // Generate a unique meeting ID or use any desired format
        const meetingId = `meeting_${req.body.channel_id}_${Date.now()}`;

        // Create the Jitsi Meet URL using the generated meeting ID
        const jitsiUrl = `https://meet.jit.si/${meetingId}`;


        await client.chat.postMessage({
            channel: channel,
            text: `Meeting Subject: ${req.body.text} \nJoin Link: ${jitsiUrl}`,
        });
        console.log("Hello")
    } catch (error) {
        console.error('Error posting message to Slack:', error);
    }

    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Slack bot listening at http://localhost:${port}`);
});
