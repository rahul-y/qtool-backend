module.exports = function (instanceName, instanceDisc,createdBy,cb) {
    var obj=instanceBlueprint();
    obj._id=instanceName;
    obj.Description=instanceDisc;
    obj.CreatedBy=createdBy;
    var timeStamp = Math.floor(Date.now() / 1000);
    obj.TimeStamp=timeStamp;

    cb(obj);

};

var instanceBlueprint = function () {
    return {
        '_id': null,
        'Description': null,
        'TimeStamp': null,
        'CreatedBy':null,
        'questions': []
    }
};




