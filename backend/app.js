const express = require('express');
const dialogflowRouter = require('./routes/dialogflow');
const miclRouter = require('./routes/micl');
const flaskRouter = require('./routes/flask');
const askJamieRouter = require('./routes/askJamie');
const rajatRouter = require('./routes/rajat.js');
const STT = require('./controllers/MainController');
const upload = require('./upload');
const AC = require('./controllers/AudioController')
const fs = require('fs')

const app = express();

app.use(require('cors')({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/dialog', dialogflowRouter);
app.use('/micl', miclRouter);
app.use('/flask', flaskRouter);
app.use('/jamie', askJamieRouter);
app.use('/rajat', rajatRouter);

app.post('/stream/google', STT.googlestreamByRecording)
app.post('/stream/record', STT.streamByRecording)
app.post('/stream/import', upload.single('file'), STT.streamByImport)

app.post('/api/upload', upload.single('file'), AC.convertToWAV)
app.post('/api/speechlabs', upload.none(), STT.speechLabsHTTPRequest)
app.post('/api/google', upload.none(), STT.googleHTTPRequest)
app.get('/api/deletestorage', (req, res, next) => {
    fs.readdir('./storage', (err,files) => {
        files.forEach( file => { fs.unlinkSync('./storage/'+file) } )
      })
      res.send('done')
    })

module.exports = app




