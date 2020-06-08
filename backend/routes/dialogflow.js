const express = require('express')
const router = express.Router()
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

/*Dialogflow Connection*/
router.post("/api/dialogflow", (req,res)=> {
    query = req.body.question
    topic = req.body.topic
    dialoflowConnection(query, topic, res)
});

async function dialoflowConnection(query, topic, res) {

    var projectId = ""
    var keyFiledir = ""
    switch(topic) {
      case 'babybonus':
        projectId = process.env.DIALOGFLOW_PROJECT_ID_BABYBONUS;
        keyFiledir = `keys/${process.env.DIALOGFLOW_KEYFILENAME_BABYBONUS}`
        break
      case 'covid19':
        projectId = process.env.DIALOGFLOW_PROJECT_ID_COVID19;
        keyFiledir = `keys/${process.env.DIALOGFLOW_KEYFILENAME_COVID19}`
        break
      default:
        break
    }

    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient({'keyFilename':keyFiledir});
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: 'en-US',
        },
      },
    };

    await sessionClient.detectIntent(request).then(responses=>{
      // console.log(responses)
      const result = responses[0].queryResult.fulfillmentMessages[0].text.text[0];
      res.json({reply: result})
    }).catch(err=>{
      res.json({reply: "Unable to reach Dialogflow"})
    })

}

module.exports = router
