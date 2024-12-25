import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    release_date: String!
    rating: Float!
    description: String!
    poster: String!
  }

  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
    favorites: [Movie]  
  }

  type Mutation {
    addMovie(title: String!, release_date: String!, rating: Float!, description: String!, poster: String!): Movie
    addFavorite(movieId: ID!): [Movie]   # Returns full movie objects
    removeFavorite(movieId: ID!): [Movie]   # Returns full movie objects
  }
`;

export default typeDefs;
