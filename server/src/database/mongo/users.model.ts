import { randomUUID } from 'node:crypto';
import { model, Schema } from 'mongoose';
import { COLLECTION_NAMES, ROLE_VALUES, type Role } from '../../constants/index.js';

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ROLE_VALUES },
    passwordHash: { type: String, required: true, select: false },
  },
  { collection: COLLECTION_NAMES.USERS, timestamps: true, versionKey: false },
);

userSchema.index({ createdAt: -1, _id: -1 });

export const UserModel = model<UserDocument>('User', userSchema);
