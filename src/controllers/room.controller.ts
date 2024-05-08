import express from "express";
import { getRooms, getRoomByName, getRoomById, createRoom } from "../db/rooms";
import { encryptString, decryptString } from "../utils/crypt";
export const addMessageToRoom = async (
  roomName: any,
  user: any,
  message: any
) => {
  try {
    const room = await getRoomByName(roomName as string);

    if (!room) {
      await createRoom({
        name: roomName,
        messages: [
          {
            username: user as string,
            message: encryptString(message as string) ,
          },
        ],
      });
    } else {
      room.messages.push({
        username: user as string,
        message: encryptString(message as string) ,
      });
      await room.save();
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMessagesFromRoom = async (
  req: express.Request,
  res: express.Response
) => {
  const { room } = req.params;

  try {
      const messages = await getRoomByName(room);
        if (!messages) {
            return res.status(404).json({ error: "Room not found" });
      }
      
      const sendingBack = messages.messages.map((message: any) => {
            return {
                username: message.username,
                message: decryptString(message.message),
            };
        });
    return res.status(200).json(sendingBack);
  } catch (error) {
    console.log(error);
    return res.json({ error: "DB Error Not Found" }).sendStatus(400);
  }
};
