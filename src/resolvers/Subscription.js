const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info){
      const post = db.pstData.find(pst => pst.id === postId && pst.published);
      if (!post) { throw new Error('Post not found'); }

      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },

  post: {
    subscribe(parent, args, { db, pubsub }, info){
      return pubsub.asyncIterator(`post`);
    }
  }
}

export { Subscription };
