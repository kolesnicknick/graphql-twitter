import { GraphQLServer } from 'graphql-yoga';
const { v4: uuidv4 } = require('uuid');

// Data
const usrData = [
  {
    id: '1',
    name: 'Niko Kole!',
    email: 'kole@gmail.com!',
    age: 26
  }, {
    id: '2',
    name: 'Anti Kafo',
    email: 'antKaf@gmail.com!',
    age: 26
  }, {
    id: '3',
    name: 'Repo Docs',
    email: 'repdoc@gmail.com!',
    age: 26
  },
];

const cmtData = [
  {id: '1', text: 'NICE', author: '1', post: '3',},
  {id: '2', text: 'COOL', author: '3', post: '1',},
  {id: '3', text: 'BAD', author: '1', post: '3',
  }, {id: '4', text: 'GREAT', author: '2', post: '2',}];
const pstData = [
  {
    id: '1',
    title: 'Bad post',
    body: 'huppa luppa',
    published: false,
    author: '2',
  }, {
    id: '2',
    title: 'Good post',
    body: 'No Max Korzh',
    published: true,
    author: '1',
  }, {
    id: '3',
    title: 'Neutral post',
    body: 'Learn JS',
    published: false,
    author: '1',
  },
];

// Type definitions (Schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }
    
    type Mutation {
        createUser(name: String!, email: String!, age: Int!): User!
        createPost(title: String!, body: String!, author: String!, published: Boolean!): Post!
        createComment(text: String!, author: String!, post: String!): Comment!
    }

    type User {
        id: String!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: String!
        title: String
        body: String
        published: Boolean
        author: User!
        comments: [Comment!]!
    }
    
    type Comment {
        id: String!
        text: String!
        post: Post!
        author: User!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      const {query} = args;
      return query ? usrData.filter(usr => usr.name.toLowerCase().includes(query.toLowerCase())) : usrData;
    },
    me() {
      return {id: '1', name: 'Niko', email: 'hello', age: 28};
    },

    comments(parent, args, ctx, info) {
      const {query} = args;
      // return pstData;

      return query ? cmtData.filter(cmt => {
        const q = query.toLowerCase();
        return cmt.text.toLowerCase().includes(q);
      }) : cmtData;
    },

    posts(parent, args, ctx, info) {
      const {query} = args;
      // return pstData;

      return query ? pstData.filter(pst => {
        const q = query.toLowerCase();
        return pst.title.toLowerCase().includes(q) || pst.body.toLowerCase().includes(q);
      }) : pstData;
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const {age, name, email} = args;
      if (usrData.some(usr => usr.email === email)) {
        throw new Error('This email is already taken');
      }
      const id = uuidv4();
      const user = {id, name, email, age};
      usrData.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const {title, body, author, published} = args;
      if (!usrData.some(usr => usr.id === author)) {
        throw new Error('This user does not exist');
      }

      const post = {}
      post.id = uuidv4();
      Object.assign(post, {title, body, published, author});

      pstData.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const {text, author, post} = args

      //checks
      if (!usrData.some(usr => usr.id === author)) {
        throw new Error('This user does not exist');
      }
      if (!pstData.some(pst => pst.id === post)) {
        throw new Error('This Post does not exist');
      }
      if (!(pstData.find(pst => pst.id === post).published)) {
        throw new Error('This Post Is not published');
      }

      const comment = {}
      comment.id = uuidv4();
      Object.assign(comment, {text, author, post});
      cmtData.push(comment);
      return comment;
    },
  },

  Post: {
    comments(parent, args, ctx, info) {
      return cmtData.filter(cmt => cmt.post === parent.id);
    },
    author(parent, args, ctx, info) {
      return usrData.find(usr => usr.id === parent.author);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return usrData.find(usr => usr.id === parent.author);
    },

    post(parent, args, ctx, info) {
      return pstData.find(pst => pst.id === parent.post);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return pstData.filter(pst => pst.author === parent.id);
    }
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => {
  console.log('RUNNING GQL: 8080');
});
