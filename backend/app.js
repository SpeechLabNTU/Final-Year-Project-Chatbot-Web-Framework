require("dotenv").config()
const express = require('express');
const dialogflowRouter = require('./routes/dialogflow');
const miclRouter = require('./routes/micl');
const similarityRouter = require('./routes/similarity');
const askJamieRouter = require('./routes/askJamie');
const rajatRouter = require('./routes/rajat.js');
const rushiRouter = require('./routes/rushi.js')
const baniRouter = require('./routes/bani')
const modelsRouter = require('./routes/generalModel')
const STT = require('./controllers/MainController');
const upload = require('./upload');
const AC = require('./controllers/AudioController')
const FAQ = require('./controllers/FAQDataController')

const app = express();

app.use(require('cors')({ origin: true, credentials: true }))
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({ extended: false }))

app.use('/similarity', similarityRouter);
app.use('/dialog', dialogflowRouter);
app.use('/micl', miclRouter);
app.use('/jamie', askJamieRouter);
app.use('/rajat', rajatRouter);
app.use('/rushi', rushiRouter);
app.use('/bani', baniRouter);
app.use('/models', modelsRouter())

app.get('/', (req, res, next)=>{res.json({'status':'success'})})

app.post('/stream/google', STT.streamByRecordingGoogle)
app.post('/stream/aisg', STT.streamByRecordingAISG)
app.post('/stream/import', upload.audio.single('file'), STT.streamByImport)

app.post('/api/upload', upload.audio.single('file'), AC.convertToWAV)
app.post('/api/speechlabs', upload.audio.none(), STT.speechLabsHTTPRequest)
app.post('/api/google', upload.audio.none(), STT.googleHTTPRequest)
app.get('/api/deletestorage', AC.deleteFiles)


app.get('/faqdata/topic/:topic', FAQ.getFAQData)
app.delete('/faqdata/topic/:topic', FAQ.deleteAllIntents)

app.get('/faqdata/id/:id', FAQ.getIntent)
app.delete('/faqdata/id/:id', FAQ.deleteIntent)
app.patch('/faqdata/id/:id', FAQ.updateIntent)
app.post('/faqdata/id', FAQ.createIntent)

app.post('/faqdata/csv', upload.csv.single('file'), FAQ.processCSV)
app.get('/faqtopics', FAQ.getFAQTopics)
app.post('/faqtopics/create', FAQ.addNewTopic)
app.delete('/faqtopics/:topic', FAQ.deleteTopic)

module.exports = app
