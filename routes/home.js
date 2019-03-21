var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var instance = require('../functions/Instance');
var questions=require('../functions/questions');
var reply=require('../functions/reply');
var jsonParser = bodyParser.json();
var ObjectID = require('mongodb').ObjectID;
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient=require('mongodb').MongoClient;

router.get('/fetch-instances', function(req, res, next) {
    MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', function (err, client) {
        var db = client.db('qtool');
        if (err) {
            return err;
        }
        db.collection('Instances').aggregate([
            {$project:{"_id":1,"Description":1,"TimeStamp":1}},{$sort:{"TimeStamp":-1}}]).toArray(function (err, docs) {
            if (err) {
                db.close();
                return res.send(err);
            }
           res.send(docs);
            client.close();
        });

    });

});



router.get('/fetch-questions', function(req, res, next) {
    var instanceName=req.query.name;
    MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', function (err, client) {
        var db = client.db('qtool');
        if (err) {
            return err;
        }
        db.collection('Instances').find({"_id":instanceName},{"questions":1}).toArray(function (err, docs) {
            if (err) {
                db.close();
                return res.send(err);
            }
            res.send(docs[0].questions);
            client.close();
        });

    });

});






router.post('/store-instances',jsonParser, function(req, res, next) {
     var instanceName = req.body.name;
    var instanceDisc = req.body.desc;//instance Discription
    var createdBy=req.body.user;
    MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', function (err, client) {
        var db = client.db('qtool');
        if (err) {
            return err;
        }
        instance(instanceName, instanceDisc,createdBy,(final)=>{
            db.collection('Instances').insert(final, function (err) {
                if (err) {
                    res.send(err);
                }
            res.send("stored");
                });
            });
        client.close();
    });


});





router.post('/store-question',jsonParser, function(req, res, next) {
    var instanceName = req.body.name;
    var question=req.body.ques;
    var createdBy=req.body.user;
    MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', function (err, client) {
        var db = client.db('qtool');
        if (err) {
            return err;
        }
        questions(question,createdBy,(final)=>{
            db.collection('Instances').update({"_id": instanceName},{"$push": {"questions": final}});
        });
        res.send("question stored");
        client.close();
    });


});



router.post('/store-reply',jsonParser, function(req, res, next) {
    var instanceName = req.body.name;
    var quesId=req.body.questionId;
    var response=req.body.reply;
    var userName=req.body.user;
    var userEmail=req.body.email;
    MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', function (err, client) {
        var db = client.db('qtool');
        if (err) {
            return err;
        }
        reply(response,userName,userEmail,(final)=>{
            db.collection('Instances').update({ "_id": instanceName, "questions._id":ObjectID(quesId) }, { "$push": {"questions.$.replies": final}});
        });
        res.send("Response stored");
        client.close();
    });


});








module.exports = router;
