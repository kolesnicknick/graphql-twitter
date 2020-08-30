import { GraphQLServer } from 'graphql-yoga';
import db                from './db'
import { User }          from './resolvers/User';
import { Query }         from './resolvers/Query';
import { Mutation }      from './resolvers/Mutation';
import { Post }          from './resolvers/Post';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
  },
  context: {
    db
  }
});

server.start(() => {
  console.log('RUNNING GQL: 8080');
});
