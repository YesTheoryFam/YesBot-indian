const mongoose = require('mongoose');



const activityGroupSchema = mongoose.Schema({
    appName: String,
    userIDs: [String],

})


module.exports = mongoose.model("presenceGroup", activityGroupSchema);