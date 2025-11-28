import mongoose, { Document, Model, Schema } from "mongoose";
import { IWatchlist } from "../types";

export type WatchlistDocument = Document & IWatchlist;

const WatchlistSchema = new Schema<WatchlistDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        movieId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        posterPath: {
          type: String,
        },
        mediaType: {
          type: String,
          enum: ["movie", "tv"],
          required: true,
        },
        releaseDate: {
          type: String,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Watchlist: Model<WatchlistDocument> =
  (mongoose.models.Watchlist as Model<WatchlistDocument>) ||
  mongoose.model<WatchlistDocument>("Watchlist", WatchlistSchema);

export default Watchlist;
