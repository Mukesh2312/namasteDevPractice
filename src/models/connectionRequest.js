const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "accepted", "rejected", "interested"],
            message: `{values} is incorrect status type`
        },
        required: true,
    }
},
    { timestamps: true });


const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);

module.exports = {
    ConnectionRequest,
}