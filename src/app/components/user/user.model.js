import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
    select: false
  }
});

async function bcryptPassword(next) {
  if (this.isModified('password')) {
    try {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
    } catch (error) {
      return next(error);
    }
  }

  return next();
}

UserSchema.pre('save', bcryptPassword);

export default model('User', UserSchema);
