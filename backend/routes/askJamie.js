const express = require('express')
const router = express.Router()
const axios = require('axios')
const url = require('url')
var parseString = require('xml2js').parseString
const htmlToText = require('html-to-text')

router.post("/api/askJamieFast", (req, res)=> {

  const askJamie_endpoint = "https://va.ecitizen.gov.sg/flexAnsWS/ifaqservice.asmx/AskWSLanguage"
  let query = req.body.question

  var params = new url.URLSearchParams({
    "ProjectId": 7536554,
    "RecordQuestion": "yes",
    "SessionId": 0,
    "TextLanguage": "en",
    "Question": query,
  })

  // making a content-type: text/xml request to askJamie endpoint
  axios.post(askJamie_endpoint, params.toString())
  .then( response => {
    let xml = response.data
    parseString(xml, (err, result) => {
      // console.log(result.ResponderResponseSet)
      var text_answer
      // If AskJamie responded back with at least 1 response
      if (result.ResponderResponseSet.Count[0] !== '0') {
        text_answer = htmlToText.fromString(
          result.ResponderResponseSet.Responses[0].Response[0].Text[0]['_'],
          {ignoreHref: true, wordwrap: null}  // ignore links
        )
      }
      else {
        text_answer = "I am sorry, your question does not provide enough detail for me to answer. Please rephrase your question."
      }
      res.json({reply: text_answer.trim()})
    })
  }).catch( err => {
    console.log(err)
    res.json({reply: "Could not reach AskJamie."})
  })

});

module.exports = router
