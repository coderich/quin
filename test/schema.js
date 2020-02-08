export default {
  typeDefs: `
    scalar Mixed
    enum OnDeleteEnum { cascade nullify restrict }
    enum IndexEnum { unique }
    input IndexInput { name: String type: IndexEnum! on: [String!]! }

    type Person
      @quin
    {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      authored: [Book] @quin(materializeBy: "author")
      emailAddress: String! @quin(enforce: email)
      friends: [Person] @quin(transform: dedupe)
      status: String
      hero: String @quin(transform: richard, onDelete: cascade)
    }

    type Book
      @quin(indexes: [{ names: "uix_bookstore", type: unique, on: ["name"] }]),
    {
      id: ID!
      name: String! @quin(transform: toTitleCase, enforce: bookName)
      price: Float! @quin(enforce: bookPrice)
      author: Person!
      bestSeller: Boolean
      bids: [Int]
      chapters: [Chapter]
    }

    type Chapter
      @quin
    {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      book: Book!
      pages: [Page]
    }

    type Page
      @quin
    {
      id: ID!
      number: Int!
      verbage: String
      chapter: Chapter!
    }

    type BookStore
      @quin
    {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      location: String
      books: [Book]
      building: Building!
    }

    type Library
      @quin
    {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      location: String,
      books: [Book]
      building: Building!
    }

    type Apartment
      @quin
    {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      location: String
      building: Building!
    }

    type Building {
      id: ID!
      year: Int
      type: String!
      tenants: [Person] @quin(transform: dedupe)
      landlord: Person
    }

    type Color
      @quin
    {
      id: ID!
      type: String!
      isDefault: Boolean
    }

    type Art
      @quin
    {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      bids: [Float]
      comments: [String] @quin(enforce: artComment)
    }
  `
};
