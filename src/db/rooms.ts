import mongoose from 'mongoose';
import RoomModel from '../models/RoomModel';

// User Actions
export const getRooms = () => RoomModel.find();
export const getRoomByName = (name: string) => RoomModel.findOne({ name });
export const getRoomById = (id: string) => RoomModel.findById(id);
export const createRoom = (values: Record<string, any>) => new RoomModel(values).save().then((room) => room.toObject());