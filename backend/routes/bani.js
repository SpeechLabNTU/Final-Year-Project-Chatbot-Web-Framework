const express = require('express')
const router = express.Router()
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

router.post("/api/queryEndpoint", (req, res) => {

    let queryText = req.body.question

    axios.get(`${process.env.BANI_ENDPOINT}/answer`, {
            params: {
                question: queryText,
            }
        })
        .then(response => {
            let reply = response.data.result
            if (reply === "") {
                reply = "I am sorry, your question does not provide enough detail for me to answer. Please rephrase your question."
            }
            res.json({
                code: response.data.code,
                reply: reply,
                similarQuestions: response.data.similarQuestions,
            })
        })
        .catch(error => {
            res.json({ reply: "Lab server is down", })
        })

});

module.exports = router