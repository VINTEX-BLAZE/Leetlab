// importing required modules
import mongoose from "mongoose";

// Creating ProblemInPlaylist Schema
const ProblemInPlaylistSchema = new mongoose.Schema(
  {
    playlistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      unique: true,
      required: true,
    },
    problemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Creating a Model from Schema
const ProblemInPlaylist = mongoose.model("ProblemInPlaylist", ProblemInPlaylistSchema);
export default ProblemInPlaylist;
