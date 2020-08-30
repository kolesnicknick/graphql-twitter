const  Post = {
    comments(parent, args, { db } , info) {
    return db.cmtData.filter(cmt => cmt.post === parent.id);
  },
  author(parent, args, { db }, info) {
  return db.usrData.find(usr => usr.id === parent.author);
},
}

export { Post };
