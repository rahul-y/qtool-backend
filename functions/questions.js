var mongo=require('mongodb');
var ObjectID = mongo.ObjectID;
module.exports = function (question,createdBy,cb) {
    var obj=questionsBluePrint();
    obj.question=question;
    obj.CreatedBy=createdBy;
    var timeStamp = Math.floor(Date.now() / 1000);
    obj.Timestamp=timeStamp;
    obj._id=new ObjectID();
//db.collection('Instances').find({'_id':instanceName});

    cb(obj);

};

var questionsBluePrint=function(){
    return{
        '_id':null,
        'question':null,
        'votes':null,
        'Timestamp':null,
        'CreatedBy':null,
        "replies":[]
    }
};