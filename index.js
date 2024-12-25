import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; 
import typeDefs from './schema/schema.js';  
import { resolvers } from './schema/resolver.js'; 

dotenv.config(); 

const mongoURI = process.env.MONGO_URI;

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://comforting-chebakia-0eed7c.netlify.app', // Production frontend
];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true); // Allow requests with no origin (e.g., mobile apps or Postman)
    }
    return callback(new Error('Not allowed by CORS')); // Reject disallowed origins
  },
  credentials: true, // Allow cookies and headers
}));

app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for testing
  playground: true,    // Enable GraphQL Playground
});

await server.start();
app.use('/graphql', expressMiddleware(server));

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Default route for undefined endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the IMDb Backend API!');
});

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).send('Endpoint not found. Please use /graphql.');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
