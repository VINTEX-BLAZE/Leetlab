// importing required modules
import mongoose from "mongoose";

// Creating Playlist Schema
const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      ondelete: "CASCADE",
      required: true,
      unique: true,
    },
    problems: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ProblemInPlaylist",
    },
  },
  { timestamps: true },
);

// creating a cascading delete hook
PlaylistSchema.pre("remove", async function (next) {
  try {
    await ProblemInPlaylist.deleteMany({ playlistID: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

// Creating a Model from Schema
const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
