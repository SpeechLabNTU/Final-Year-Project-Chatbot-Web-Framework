const express = require('express')
const router = express.Router()
const fs = require('fs')
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

/*Dialogflow Connection*/
router.post("/api/dialogflow", (req, res) => {
  query = req.body.question
  topic = req.body.topic
  dialoflowConnection(query, topic, res)
});

async function dialoflowConnection(query, topic, res) {

  var projectId = ""
  var keyFiledir = ""
  switch (topic) {
    case 'Baby Bonus':
      keyFiledir = process.env.DIALOGFLOW_KEYFILENAME_BABYBONUS
      break
    case 'Covid 19':
      keyFiledir = process.env.DIALOGFLOW_KEYFILENAME_COVID19
      break
    default:
      break
  }

  projectId = JSON.parse(fs.readFileSync(keyFiledir, 'utf-8')).project_id

  const sessionId = uuid.v4();
  const sessionClient = new dialogflow.SessionsClient({
    'keyFilename': keyFiledir,
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'en-US',
      },
    },
  };

  await sessionClient.detectIntent(request).then(responses => {
    // console.log(responses)
    const result = responses[0].queryResult.fulfillmentMessages[0].text.text[0];
    res.json({ reply: result })
  }).catch(err => {
    res.json({ reply: "Unable to reach Dialogflow" })
  })

}

module.exports = router
