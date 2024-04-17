import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    messages: [{
        username: { type: String, required: true },
        message: { type: String, required: true }
    }]
});

const RoomModel = mongoose.model('Room', RoomSchema);

export default RoomModel;