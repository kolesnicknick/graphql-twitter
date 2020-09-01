const {v4: uuidv4} = require('uuid');

const Mutation = {
  createUser(parent, args, {db}, info) {
    const {age, name, email} = args.data;
    if (db.usrData.some(usr => usr.email === email)) {
      throw new Error('This email is already taken');
    }
    const id = uuidv4();
    const user = {id, name, email, age};
    db.usrData.push(user);

    return user;
  },
  createPost(parent, args, {db, pubsub}, info) {
    const {title, body, author, published} = args.data;
    if (!db.usrData.some(usr => usr.id === author)) {
      throw new Error('This user does not exist');
    }

    const post = {};
    post.id = uuidv4();
    Object.assign(post, {title, body, published, author});

    db.pstData.push(post);

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED',
          data: post,
        }
      });
    }

    return post;
  },

  createComment(parent, args, {db, pubsub}, info) {
    const {text, author, post} = args.data;

    //checks
    if (!db.usrData.some(usr => usr.id === author)) {
      throw new Error('This user does not exist');
    }
    if (!db.pstData.some(pst => pst.id === post)) {
      throw new Error('This Post does not exist');
    }
    if (!(db.pstData.find(pst => pst.id === post).published)) {
      throw new Error('This Post Is not published');
    }

    const comment = {};
    comment.id = uuidv4();
    Object.assign(comment, {text, author, post});
    db.cmtData.push(comment);

    pubsub.publish(`comment ${post}`, {
      comment: {
        data: comment,
        mutation: 'CREATED',
      }
    });

    return comment;
  },

  updateUser(parent, args, {db}, info) {
    const {id, data: {age, name, email}} = args;
    const user = db.usrData.find(usr => usr.id === args.id);
    if (!user) {
      throw new Error('User with specified it not found');
    }
    if (age) {
      user.age = age;
    }
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    return user;
  },

  updatePost(parent, args, {db, pubsub}, info) {
    const {id, data: {title, body, author, published}} = args;

    const post = db.pstData.find(pst => pst.id === args.id);
    if (!post) {
      throw new Error('Post with specified it not found');
    }

    if (title) {
      post.title = title;
    }
    if (body) {
      post.body = body;
    }
    if (author) {
      post.author = author;
    }
    if (typeof published === 'boolean') {
      post.published = published;
    }

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'UDPATED',
          data: post,
        }
      });
    }

    return post;
  },

  updateComment(parent, args, {db, pubsub}, info) {
    const {id, data: {text}} = args;

    const comment = db.cmtData.find(cmt => cmt.id === id);
    if (!comment) {
      throw new Error('Comment with specified it not found');
    }

    if (text) {
      comment.text = text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        data: comment,
        mutation: 'UPDATED',
      }
    });

    return comment;
  },


  deleteUser(parent, args, {db}, info) {
    const usrIndex = db.usrData.findIndex(usr => usr.id === args.id);
    if (usrIndex === -1) {
      throw  new Error('User not found');
    }
    const user = db.usrData[usrIndex];

    // Delete user from array
    db.usrData = db.usrData.filter(usr => usr.id !== args.id);

    // Delete users' posts and its comments from array of posts
    db.pstData = db.pstData.filter(pst => {
      const match = pst.author === args.id;
      if (match) {
        db.cmtData = db.cmtData.filter(cmt => cmt.post !== pst.id);
      }
      return !match;
    });

    // Delete users' comments by id
    db.cmtData = db.cmtData.filter(cmt => cmt.author !== args.id);

    return user;
  },

  deletePost(parent, args, {db, pubsub}, info) {
    const pstIndex = db.pstData.findIndex(pst => pst.id === args.id);
    if (pstIndex === -1) {
      throw  new Error('Post not found');
    }
    const post = db.pstData[pstIndex];
    db.cmtData = db.cmtData.filter(cmt => cmt.post !== args.id);
    db.pstData = db.pstData.filter(pst => pst.id !== args.id);

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'DELETED',
          data: post,
        }
      });
    }

    return post;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const cmtIndex = db.cmtData.findIndex(pst => pst.id === args.id);
    if (cmtIndex === -1) {
      throw  new Error('Comment not found');
    }
    const comment = db.cmtData[cmtIndex];

    db.cmtData = db.cmtData.filter(cmt => cmt.id !== args.id);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        data: comment,
        mutation: 'DELETED',
      }
    });

    return comment;
  }
};

export { Mutation };
