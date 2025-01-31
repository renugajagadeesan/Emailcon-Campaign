const mongoose = require("mongoose");

const camhistorySchema = new mongoose.Schema({
    campaignname: {
        type: String,
        required: true,
    },
    groupname: {
        type: String,
        required: true,
    },
    totalcount: {
        type: Number,
        required: true,
    },
    sendcount: {
        type: Number,
        required: true,
    },
    senddate: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true, // Automatically stores createdAt and updatedAt
});

module.exports = mongoose.model("Camhistory", camhistorySchema);
