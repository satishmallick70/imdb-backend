import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  release_date: String,
  rating: Number,
  description: String,
  poster: String,
  isFavorite: { type: Boolean, default: false }, 
});

export const Movie = mongoose.model('Movie', movieSchema);
