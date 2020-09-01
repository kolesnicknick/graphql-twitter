import { GraphQLServer } from 'graphql-yoga';
import db                from './db'
import { User }          from './resolvers/User';
import { Query }         from './resolvers/Query';
import { Mutation }      from './resolvers/Mutation';
import { Post }          from './resolvers/Post';
import { Comment }       from './resolvers/Comment';
import { Subscription }  from './resolvers/Subscription';
import { PubSub }        from 'graphql-subscriptions';

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment,
  },
  context: {
    db,
    pubsub,
  }
});

server.start(() => {
  console.log('RUNNING GQL: 8080');
});
