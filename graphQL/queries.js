const gql = require('graphql-tag');

const listUsers = gql`
query listUsers {
    listUsers {
        items {
        name
        }
    }
}
`;

const getSudent = gql`
  query getStudent($id: ID!) {
    getStudent(id: $id) {
      id
      classRoomId
  }
  }
`;

const getTeacher = gql`
  query getTeacher($id: ID!) {
    getTeacher(id: $id) {
      id
      classRoomId
  }
  }
`;

module.exports = {
    listUsers,
    getSudent,
    getTeacher
}