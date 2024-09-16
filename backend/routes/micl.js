const express = require('express')
const router = express.Router()
const axios = require('axios')
const FormData = require('form-data')
const dotenv = require('dotenv');
dotenv.config();

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb/baby_bonus_faq_service]*/
router.post("/api/directQuery", (req, res) => {

    // let queryText = req.body.queryResult.queryText
    let queryText = req.body.question
    const form = new FormData()
    form.append('input', queryText)

    axios.post(`${process.env.MICL_ENDPOINT}/ask_bb/baby_bonus_faq_service`, form, {
      headers: form.getHeaders(),
    })
    .then( response => {
      res.json({reply:response.data.top1})
    })
    .catch( error => {
      res.json({ reply: "MICL server is down", queries:[]})
    })

});

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb_rephrased/baby_bonus_faq_service]*/
router.post("/api/directQueryRephrased", (req, res) => {

    let queryText = req.body.question
    const form = new FormData()
    form.append('input', queryText)

    axios.post(`${process.env.MICL_ENDPOINT}/ask_bb_rephrased/baby_bonus_faq_service`, form, {
      headers: form.getHeaders(),
    })
    .then( response => {
      res.json({reply:response.data.top1})
    })
    .catch( error => {
      res.json({ reply: "MICL server is down", queries:[]})
    })

});

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb_bp/baby_bonus_faq_service]*/
router.post("/api/directQueryBp", (req, res) => {

    let queryText = req.body.question
    const form = new FormData()
    form.append('input', queryText)

    axios.post(`${process.env.MICL_ENDPOINT}/ask_bb_bp/baby_bonus_faq_service`, form, {
      headers: form.getHeaders(),
    })
    .then( response => {
      res.json({reply:response.data.top1})
    })
    .catch( error => {
      res.json({ reply: "MICL server is down", queries:[]})
    })

});

module.exports = router
