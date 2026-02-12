import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    estimatedTime: {
      type: String,
      required: true
    },
    videoId: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    topic: {
      type: String,
      required: true,
      index: true
    },

    customContent: {
      type: String,
      default: ""
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    includeVideos: {
      type: Boolean,
      default: false
    },

    chapters: {
      type: [chapterSchema],
      validate: [(val) => val.length > 0, "Course must have chapters"]
    },

    progress: {
      completedChapters: {
        type: [Number],
        default: []
      },
      percentage: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
