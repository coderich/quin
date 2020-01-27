export default `
  type Person
    @alias(name: "user")
    @indexes(on: [{ name: "uix_person_name", type: unique, fields: ["name"] }])
  {
    id: ID!
    name: String! @rules(transform: titleCase)
    authored: [Book] @virtual(by: "author")
    emailAddress: String! @rules(valid: email)
    friends: [Person]
    status: String
  }

  type Book
    @indexes(on: [{ name: "uix_book", type: unique, fields: ["name", "author"] }])
  {
    id: ID!
    name: String! @rules(transform: titleCase, deny: "The Bible")
    price: Float! @rules(range: [0, 100])
    author: Person! @rules(reject: change) @onDelete(op: cascade)
    bestSeller: Boolean
    bids: [Int]
    chapters: [Chapter] @virtual(by: "book")
  }

  type Chapter
    @indexes(on: [{name: "uix_chapter", type: unique, fields: ["name", "book"]}])
  {
    id: ID!
    name: String! @rules(transform: titleCase)
    book: Book!
    pages: [Page] @virtual(by: "chapter")
  }

  type Page
    @indexes(on: [{name: "uix_page", type: unique, fields: ["number", "chapter"]}])
  {
    id: ID!
    number: Int!
    verbage: String
    chapter: Chapter!
  }

  type BookStore {
    name: String! @rules(transform: titleCase)
    location: String
    books: [Book] @onDelete(op: cascade)
    building: Building! @onDelete(op: cascade)
  }

  type Library {
    name: String! @rules(transform: titleCase)
    location: String,
    books: [Book] @onDelete(op: cascade)
    building: Building! @onDelete(op: cascade)
  }

  type Apartment {
    name: String! @rules(transform: titleCase)
    location: String
    building: Building! @onDelete(op: cascade)
  }

  type Building {
    year: Int
    type: String! @rules(allow: ["home", "office", "business"])
    tenants: Person @onDelete(op: cascade)
    landlord: Person @onDelete(op: nullify)
  }

  type Color {
    type: String! @rules(allow: ["blue", "red", "green", "purple"])
  }

  type Art {
    name: String! @rules(transform: titleCase)
    bids: [Float]
  }
`;
