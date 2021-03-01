import mongoose, { Document } from "mongoose";

export interface Data extends Document {
  _id?: mongoose.ObjectId;
  lat: number;
  lng: number;
  tmp: number;
}

export interface User extends Document {
  _id?: mongoose.ObjectId;
  name: string;
  user: string;
  password: string;
  tokenVersion: number;
  data: Data[];
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Payload {
  user: string;
  _id: string;
  role: string;
  iat: number;
  exp: number;
  tokenVersion: number;
}

export interface Role extends mongoose.Document {
  name: string;
  _id?: mongoose.ObjectId;
}
