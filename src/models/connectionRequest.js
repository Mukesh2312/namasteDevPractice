const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User", //reference to the User collection 
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

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Invalid connection request!");
    }

    next();
})
const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);

module.exports = {
    ConnectionRequest,
}