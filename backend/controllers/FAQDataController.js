const fs = require('fs')
const csvReader = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);

const intentSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true
  },
  alternatives: [String],
})

const topicScheme = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  }
})

const Intent = mongoose.model('Intent', intentSchema)
const Topic = mongoose.model("Topic", topicScheme)


async function foo() {
  var topic = 'Baby Bonus'
  // var result = (await Intent.findByIdAndUpdate("5fc4c39b80dd8b0e507b5f89", {question: "How to do this"}))
  Intent.find({}, 'question answer alternatives',
    (err, doc) => {
      // console.log(doc)
    })
  // Intent.deleteMany().exec()
  // console.log(result)
}

// Topic.findOne({ topic: 'Baby Bonus' }).then(val => {
//   console.log(val)
// })

foo()


class FAQDataController {

  static async addNewTopic(req, res, next) {
    var topic = req.body.topic

    if (!topic) {
      console.log("Could not add topic, no topic found in request.")
      res.status(400).send("No topic found in request.")
    }

    var result = await Topic.findOne({ topic: topic })

    if (result) {
      console.log("Topic already exists.")
      res.send("Topic already exists.")
    }

    var new_topic = new Topic({ topic: topic })

    new_topic.save((err, doc) => {
      if (err) {
        console.log("Error saving topic", err)
        res.send("Error when adding topic.")
      }
      res.send(`${topic} has been added.`)
    })
  }

  static async deleteTopic(req, res, next) {
    var topic = req.params.topic

    if (!topic) {
      console.log("Could not delete topic, no topic found in request.")
      res.status(400).send("No topic found in request.")
    }

    var result = await Topic.findOne({ topic: topic })

    if (!result) {
      console.log("No such topic exists.")
      res.status(404).send("No such topic exists.")
    }

    Intent.deleteMany({ topic: topic }).exec()
    Topic.deleteOne({ topic: topic }).exec()

    res.send(`${topic} data deleted.`)
  }

  static async deleteAllIntents(req, res, next) {
    var topic = req.params.topic

    if (!topic) {
      console.log("Could not delete intents, no topic found in request.")
      res.status(400).send("No topic found in request.")
    }

    var result = await Topic.findOne({ topic: topic })

    if (!result) {
      console.log("No such topic exists.")
      res.status(404).send("No such topic exists.")
    }

    Intent.deleteMany({ topic: topic }).exec()

    res.send("Intents deleted")
  }

  static async getFAQData(req, res, next) {
    var topic = req.params.topic

    if (!topic) {
      console.log("Could not GET faqdata, no topic found in request.")
      res.status(400).send("No topic found in request.")
    }

    var result = await Topic.findOne({ topic: topic })

    if (!result) {
      console.log("No such topic exists.")
      res.status(404).send("No such topic exists.")
    }

    var intents = (await Intent.find({ topic: topic })
      .sort({ question: 1 })
      .select("question answer alternatives"))
      .map(doc => ({
        id: doc._id,
        question: doc.question,
        answer: doc.answer,
        alternatives: doc.alternatives
      }))
    res.json({ data: intents })
  }

  static async getIntent(req, res, next) {
    var id = req.params.id

    Intent.findById(id, "question answer alternatives",
      (err, doc) => {
        if (err) {
          console.log(err)
          res.status(404).send("Intent not found.")
        }
        var intent = {
          question: doc.question,
          answer: doc.answer,
          alternatives: doc.alternatives,
        }
        res.json({ intent: intent })
      })
  }
  
  static async updateIntent(req, res, next) {
    var id = req.params.id
    var payload = req.body.payload
    
    Intent.findByIdAndUpdate(id, payload, (err, doc) => {
      if (err) {
        console.log(err)
        res.status(404).send("Intent not found.")
      }
      res.send("Update done.")
    })

  }

  static async deleteIntent(req, res, next) {
    var id = req.params.id

    Intent.findByIdAndDelete(id, (err, doc) => {
      if (err) {
        console.log(err)
        res.status(404).send("Intent not found.")
      }
      res.send("Intent deleted.")
    })
  }

  static async createIntent(req, res, next) {
    var payload = req.body.payload
    var topic = payload.topic

    if (!topic) {
      console.log("Could not write faqdata, no topic found in request.")
      res.status(400).send("No topic found in request.")
    }
    
    var new_intent = new Intent(payload)
    new_intent.save()

    res.send("Intent created.")
  }

  static async getFAQTopics(req, res, next) {
    var topics = (await Topic.find().select("topic")).map(doc => doc.topic)
    res.json({ topics: topics })
  }

  static async processCSV(req, res, next) {
    var file = req.file
    var topic = req.body.topic

    fs.createReadStream(file.path)
      .pipe(csvReader(["id", "question", "answer"]))
      .on('data', (data) => {
        var intent = new Intent({
          topic: topic,
          question: data.question,
          answer: data.answer,
          alternatives: []
        })
        intent.save()
      })
      .on('end', () => {
        if (fs.existsSync(file.path)) { // clean original file after converting
          fs.unlinkSync(file.path)
        }
        res.send("Data added.")
      })
  }
}

module.exports = FAQDataController
