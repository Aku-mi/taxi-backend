import mongoose, { Document } from "mongoose";

export interface Data {
  id?: number;
  lat: string;
  lng: string;
  tmp: number;
  uid: string;
}

export interface User extends Document {
  _id?: mongoose.ObjectId;
  name: string;
  user: string;
  password: string;
  tokenVersion: number;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Payload {
  user: string;
  _id: string;
  role: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}

export interface Role extends mongoose.Document {
  name: string;
  _id?: mongoose.ObjectId;
}
