import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

async function bcryptPassword(next) {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
  } catch (error) {
    next(error);
  }
}

UserSchema.pre('save', bcryptPassword);

export default model('User', UserSchema);
