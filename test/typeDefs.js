export default `
  type Person
    @alias(name: "user")
    @indexes(on: [{ name: "uix_person_name", type: unique, fields: ["name"] }])
  {
    id: ID!
    name: String! @quin(transform: titleCase)
    authored: [Book] @quin(materializeBy: "author")
    emailAddress: String! @quin(valid: email)
    friends: [Person] @quin(onDelete: cascade)
    status: String
  }

  type Book
    @indexes(on: [{ name: "uix_book", type: unique, fields: ["name", "author"] }])
  {
    id: ID!
    name: String! @quin(transform: titleCase, deny: "The Bible")
    price: Float! @quin(range: [0, 100])
    author: Person! @quin(reject: change, onDelete: cascade)
    bestSeller: Boolean
    bids: [Int]
    chapters: [Chapter] @quin(materializeBy: "book")
  }

  type Chapter
    @indexes(on: [{name: "uix_chapter", type: unique, fields: ["name", "book"]}])
  {
    id: ID!
    name: String! @quin(transform: titleCase)
    book: Book! @quin(onDelete: restrict)
    pages: [Page] @quin(materializeBy: "chapter")
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
    name: String! @quin(transform: titleCase)
    location: String
    books: [Book] @quin(onDelete: cascade)
    building: Building! @quin(onDelete: cascade)
  }

  type Library {
    name: String! @quin(transform: titleCase)
    location: String,
    books: [Book] @quin(onDelete: cascade)
    building: Building! @quin(onDelete: cascade)
  }

  type Apartment {
    name: String! @quin(transform: titleCase)
    location: String
    building: Building! @quin(onDelete: cascade)
  }

  type Building {
    year: Int
    type: String! @quin(allow: ["home", "office", "business"])
    tenants: Person @quin(onDelete: cascade)
    landlord: Person @quin(onDelete: nullify)
  }

  type Color {
    type: String! @quin(allow: ["blue", "red", "green", "purple"])
    isDefault: Boolean @quin(distinct: true)
  }

  type Art {
    name: String! @quin(transform: titleCase)
    bids: [Float]
  }
`;
