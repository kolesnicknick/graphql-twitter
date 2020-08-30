const User = {
  posts(parent, args, {db}, info) {
    return db.pstData.filter(pst => pst.author === parent.id);
  }
};

export { User };
