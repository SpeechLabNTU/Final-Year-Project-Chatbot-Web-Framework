const express = require('express')
const router = express.Router()
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

router.post("/api/queryEndpoint", (req, res) => {

    let queryText = req.body.question
    let topic = req.body.topic

    axios.get(`${process.env.RUSHI_ENDPOINT}/answer`, {
      params: {
        topic: topic,
        question: queryText,
      }
    })
    .then( response => {
      res.json({
        reply: response.data.result,
        similarQuestions: response.data.similarQuestions,
      })
    })
    .catch( error => {
      res.json({ reply: "Lab server is down",})
    })

});

module.exports = router
