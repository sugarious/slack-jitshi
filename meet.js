const { google } = require('googleapis');
const readline = require('readline');

// Replace with your Google API credentials
const credentials = require('./crediantials.json');

// Create an OAuth2 client
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Set up an interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Generate an anonymous Google Meet link
async function generateAnonymousMeetLink() {
  try {
    // Authorize the client with Google
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    // Prompt user to enter the authorization code
    rl.question('Enter the code from that page here: ', async (code) => {
      // Exchange authorization code for access token
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Create a new Google Calendar instance
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      // Define the event parameters
      const event = {
        summary: 'My Anonymous Google Meet Event',
        start: {
          dateTime: '2023-05-30T10:00:00', // Specify the start time of the event
          timeZone: 'Your Time Zone',
        },
        end: {
          dateTime: '2023-05-30T11:00:00', // Specify the end time of the event
          timeZone: 'Your Time Zone',
        },
        conferenceData: {
          createRequest: {
            requestId: 'random-unique-id',
            conferenceSolutionKey: {
              type: 'hangoutsMeet', // Use 'hangoutsMeet' for Google Meet
            },
            guestsCanModify: false,
            guestsCanInviteOthers: false,
            guestsCanSeeOtherGuests: false,
          },
        },
      };

      // Insert the event to create it
      const createdEvent = await calendar.events.insert({
        calendarId: 'primary', // Use 'primary' for the user's primary calendar
        resource: event,
        conferenceDataVersion: 1,
      });

      // Retrieve the anonymous Meet link from the created event
      const meetLink = createdEvent.data.hangoutLink;
      console.log('Anonymous Google Meet link:', meetLink);

      rl.close();
    });
  } catch (error) {
    console.error('Error generating anonymous Meet link:', error);
  }
}

generateAnonymousMeetLink();
