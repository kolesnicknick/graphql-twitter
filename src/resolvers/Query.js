const Query = {
  users(parent, args, {db}, info) {
    const {query} = args;
    return query ? db.usrData.filter(usr => usr.name.toLowerCase().includes(query.toLowerCase())) : db.usrData;
  },
  me() {
    return {id: '1', name: 'Niko', email: 'hello', age: 28};
  },

  comments(parent, args, {db}, info) {
    const {query} = args;
    // return pstData;

    return query ? db.cmtData.filter(cmt => {
      const q = query.toLowerCase();
      return cmt.text.toLowerCase().includes(q);
    }) : db.cmtData;
  },

  posts(parent, args, {db}, info) {
    const {query} = args;

    return query ? db.pstData.filter(pst => {
      const q = query.toLowerCase();
      return pst.title.toLowerCase().includes(q) || pst.body.toLowerCase().includes(q);
    }) : db.pstData;
  },
};

export { Query };
