export default `
  type Person {
    id: ID!
    name: String!
    authored: [Book]
    emailAddress: String!
    status: String
  }

  type Book {
    id: ID!
    name: String!
    price: Float!
  }
`;
