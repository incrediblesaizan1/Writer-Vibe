import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  age: Number,
  password: String,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],
  dp: {
    type: String,
    default: "download.jpg"
  }
});

export default mongoose.models.user || mongoose.model("user", userSchema);
