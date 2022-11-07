import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const Customers = new Schema(
  {
    username: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    address: String,
    avatar: String,
    bio: String,
    dob: Date
  },
  { timestamps: true }
);

Customers.index({ username: 1, phone: 1, email: 1 });
Customers.plugin(mongoosePaginate);

export { Customers };
