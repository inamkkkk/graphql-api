const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const authMiddleware = require('./middlewares/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(authMiddleware);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch(err => console.error('MongoDB connection error:', err));