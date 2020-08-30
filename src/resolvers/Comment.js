const Comment = {
  author(parent, args, {db}, info) {
    return db.usrData.find(usr => usr.id === parent.author);
  },

  post(parent, args, {db}, info) {
    return db.pstData.find(pst => pst.id === parent.post);
  },
};

export { Comment };
