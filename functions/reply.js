module.exports = function (reply,user,email,cb) {
    var obj=repliesBlueprint();
    obj.reply=reply;
    obj.userName=user;
    obj.userEmail=email;
    var timeStamp = Math.floor(Date.now() / 1000);
    obj.TimeStamp=timeStamp;
//db.collection('Instances').find({'_id':instanceName});

    cb(obj);

};

var repliesBlueprint = function () {
    return {
        'reply': null,
        'userName': null,
        'userEmail': null,
        'TimeStamp':null
    }
};
