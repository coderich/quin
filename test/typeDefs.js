export default `
  type Person {
    id: ID!
    name: String!
    authored: [Book] @virtual(by: "author")
    emailAddress: String!
    status: String
  }

  type Book {
    id: ID!
    name: String!
    author: Person! @immutable @onDelete(op: "cascade")
    price: Float!
  }
`;
