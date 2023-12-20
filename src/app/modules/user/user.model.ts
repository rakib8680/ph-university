import { model, Schema } from 'mongoose';
import config from '../../config';
import { TUser, userModel } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, userModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    passwordChangedAt:{type:Date},
    needsPasswordChange: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// pre save hook/middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashed password before saving
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// post save hook/middleware
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// static method
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};
// static method
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, userModel>('User', userSchema);
