import mongoose from 'mongoose';
import { Movie } from '../model/model.js';

let globalFavorites = [];

export const resolvers = {
  Query: {
    movies: async () => {
      try {
        return await Movie.find();
      } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
      }
    },
    movie: async (_, { id }) => {
      try {
        return await Movie.findById(id);
      } catch (error) {
        console.error('Error fetching movie by ID:', error);
        throw new Error('Failed to fetch movie');
      }
    },
    favorites: async () => {
      try {
        // Return the full movie objects for all favorite IDs
        return await Movie.find({ _id: { $in: globalFavorites } });
      } catch (error) {
        console.error('Error fetching favorites:', error);
        throw new Error('Failed to fetch favorites');
      }
    },
  },
  Mutation: {
    addMovie: async (_, { title, release_date, rating, description, poster }) => {
      try {
        const newMovie = new Movie({
          title,
          release_date,
          rating,
          description,
          poster,
        });

        const savedMovie = await newMovie.save();
        return savedMovie;
      } catch (error) {
        console.error('Error adding movie:', error);
        throw new Error('Failed to add movie');
      }
    },
    addFavorite: async (_, { movieId }) => {
      try {
        const movie = await Movie.findById(movieId);
        if (!movie) throw new Error('Movie not found');
        
        // Add movieId to global favorites list if not already present
        if (!globalFavorites.includes(movieId)) {
          globalFavorites.push(movieId);
        }

        // Return the updated list of favorite movie objects
        return await Movie.find({ _id: { $in: globalFavorites } });
      } catch (error) {
        console.error('Error adding favorite:', error);
        throw new Error('Failed to add favorite');
      }
    },
    removeFavorite: async (_, { movieId }) => {
      try {
        const movieIndex = globalFavorites.indexOf(movieId);
        if (movieIndex === -1) {
          throw new Error('Movie not found in favorites');
        }

        // Remove the movieId from the global favorites list
        globalFavorites.splice(movieIndex, 1);

        // Return the updated list of favorite movie objects
        return await Movie.find({ _id: { $in: globalFavorites } });
      } catch (error) {
        console.error('Error removing favorite:', error);
        throw new Error('Failed to remove favorite');
      }
    },
  },
};
