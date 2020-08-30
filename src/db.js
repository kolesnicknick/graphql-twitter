let usrData = [
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
let cmtData = [
  {id: '1', text: 'NICE', author: '1', post: '3',},
  {id: '2', text: 'COOL', author: '3', post: '1',},
  {
    id: '3', text: 'BAD', author: '1', post: '3',
  }, {id: '4', text: 'GREAT', author: '2', post: '2',}];
let pstData = [
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

export default { usrData, cmtData, pstData }
