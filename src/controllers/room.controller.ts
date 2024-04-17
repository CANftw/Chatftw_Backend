import { getRooms, getRoomByName, getRoomById, createRoom } from '../db/rooms'
import { encryptString, decryptString } from '../utils/crypt';
export const addMessageToRoom = async (roomName: any, user: any, message: any) => {
    try {
        const room = await getRoomByName(roomName as string);

        if (!room) {
            await createRoom({
                name: roomName,
                messages: [{
                    username: user as string,
                    message: message as string
                }]
            });
        }
        else {
            room.messages.push({
                username: user as string,
                message: encryptString(message as string) as string
            });
            await room.save();
        }
    }
    catch (error) {
        console.log(error);
    }
}