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


app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,  
}));


app.use(express.json());


const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, 
  playground: true,   
});


await server.start();
app.use('/graphql', expressMiddleware(server));


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
