export default `
  type Person
    @alias(name: "user")
    @indexes(on: [{ name: "uix_person_name", type: unique, fields: ["name"] }])
  {
    id: ID!
    name: String!
    authored: [Book] @virtual(by: "author")
    emailAddress: String!
    friends: [Person]
    status: String
  }

  type Book
    @indexes(on: [{ name: "uix_book", type: unique, fields: ["name", "author"] }])
  {
    id: ID!
    name: String!
    price: Float!
    author: Person! @immutable @onDelete(op: cascade)
    bestSeller: Boolean
    bids: [Int]
    chapters: [Chapter] @virtual(by: "book")
  }

  type Chapter {
    name: String!
    book: Book!
    pages: [Page] @virtual(by: "chapter")
  }

  type Page {
    number: Int!
    verbage: String
    chapter: Chapter!
  }
`;
