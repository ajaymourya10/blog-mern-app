const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      required: [true, "Title is required!"],
      type: String,
    },
    category: {
      required: [true, "Category is required!"],
      type: String,
    },
    isLiked: {
      default: false,
      type: Boolean,
    },
    isDisLiked: {
      default: false,
      type: Boolean,
    },
    numberOfViews: {
      default: 0,
      type: Number,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    image: {
      type: String,
      default:
        "https://i.pinimg.com/564x/83/eb/c0/83ebc04b8547558a9f5d55a069363883.jpg",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//compile
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
