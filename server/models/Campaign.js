const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    camname: {
        type: String,
        required: true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, {
    timestamps: true
});


module.exports = mongoose.model("Campaign", campaignSchema);