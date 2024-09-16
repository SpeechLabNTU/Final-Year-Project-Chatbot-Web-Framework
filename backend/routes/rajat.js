const express = require('express')
const router = express.Router()
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

router.post("/api/queryEndpoint", (req, res) => {

    let queryText = req.body.question
    let topic = req.body.topic

    let apiEndpoint = ''
    switch (topic){
      case 'Baby Bonus':
        apiEndpoint = process.env.RAJAT_ENDPOINT_BABYBONUS
        break
      case 'Covid 19':
        apiEndpoint = process.env.RAJAT_ENDPOINT_COVID19
        break
      default:
        break
    }

    axios.post(`${apiEndpoint}/ask`, {
      "question": queryText,
    })
    .then( response => {
      res.json({ reply: response.data.result })
    })
    .catch( error => {
      res.json({ reply: "Lab server is down",})
    })

});

module.exports = router
