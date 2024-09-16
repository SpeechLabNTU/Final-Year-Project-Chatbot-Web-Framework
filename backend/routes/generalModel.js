const express = require('express');
const mongoose = require('mongoose');
/*  
    GET /models 
    Response:
    {
    "name":"Rushi",
    "model_endpoint":[
        {"topic":"Baby Bonus", "topic_endpoint":"rushi/api/queryEndpoint"},
        {"topic":"Covid 19", "topic_endpoint":"/rushi/api/queryEndpoint"},
        {"topic":"ComCare", "topic_endpoint":"/rushi/api/queryEndpoint"},
        {"topic":"Adoption", "topic_endpoint":"/rushi/api/queryEndpoint"}
    }    
*/
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model_endpoint:[{
        topic: {type: String},
        topic_endpoint: {type: String},
    }]
})
const Model = mongoose.model('Model', modelSchema)

module.exports = () => {
    const router = express.Router()
  
    router.get("/", async (req, res) => { 
        try{
            const models = await Model.find({}, '-_id -__v -model_endpoint._id');
            res.json(models);
        } catch (err) {
            res.json({message: err})
        } 
    });

    router.get('/new', (req, res) => {
        var toProcess = []
        if (Array.isArray(req.body)) {
            toProcess = req.body
        }
        else {
            toProcess = [req.body]
        }
        
            for (var i = 0; i < toProcess.length ; i++) {
            const filter =  Model.findOne({name: toProcess[i].name});
            const update = {model_endpoint: toProcess[i].model_endpoint.map(model_endpoint => {
                                return {
                                    topic: model_endpoint.topic,
                                    topic_endpoint: model_endpoint.topic_endpoint
                                };
                            })};
            const options = {upsert: true, returnOriginal: false};
            Model.findOneAndUpdate(filter, update, options, function(error, model) {
                if (!error) {
                    if (!model) {
                        model = new Model({
                            name: toProcess[i].name,
                            update
                        });
                    }
                    model.save(function(error) {
                        if (!error) {
                            console.log("Model created/updated");
                        } else {
                            throw error;
                        }
                    });
                }
            })
        }
        res.send("Done")

    });
    
    router.delete("/deleteAll", async (req, res) => {
        await Model.deleteMany()
        .then(()=>{
            console.log("Data deleted")
            res.send("Successfully deleted")
        })
        .catch(function(error){console.log(error);});
    });

    router.delete("/:name", async (req, res) => {
        await Model.deleteOne({name: req.params.name}).then(()=>{
            console.log(`${req.params.name} deleted`)
            res.send(`${req.params.name} deleted`)
        }).catch(err=>{
            console.log(err)
        })
    })
    return router
}