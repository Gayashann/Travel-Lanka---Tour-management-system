const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Feedback" // Reference to the Feedback model
    },
    replyMessage: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Reply = mongoose.model("Reply", ReplySchema);

module.exports = Reply;
