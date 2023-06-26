import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface IUserMethods {
  correctPassword: (payloadPassword: string, userPassword: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument, {}, IUserMethods> {}

const UserSchema: Schema<IUserDocument, IUserModel, IUserMethods> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email.'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirm is required.'],
    // Only works for SAVE.
    validate: {
      validator: function(this: IUserDocument, value: string): boolean {
        return value === this.password;
      },
      message: 'Passwords do not match.'
    }
  }
}, { toObject: { useProjection: true }, toJSON: { useProjection: true } });

// PRE-HOOKS

UserSchema.pre('save', async function(next: mongoose.CallbackWithoutResultAndOptionalError) {
  if(!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field from persisting
  this.set('passwordConfirm', undefined);
  next();
});

UserSchema.methods.correctPassword = async function(payloadPassword: string, userPassword: string) {
  return await bcrypt.compare(payloadPassword, userPassword);
}

const UserModel = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export { UserModel as User };