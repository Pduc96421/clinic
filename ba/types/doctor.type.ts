import { Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  user_id: Types.ObjectId;
  specialization: string;
  bio?: string;
}