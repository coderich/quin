export default {
  typeDefs: `
    type Person {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      authored: [Book]
      emailAddress: String! @quin(enforce: email)
      friends: [Person] @quin(transform: dedupe)
      status: String
    }

    type Book {
      id: ID!
      name: String! @quin(transform: toTitleCase, enforce: bookName)
      price: Float! @quin(enforce: bookPrice)
      author: Person!
      bestSeller: Boolean
      bids: [Int]
      chapters: [Chapter]
    }

    type Chapter {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      book: Book!
      pages: [Page]
    }

    type Page {
      id: ID!
      number: Int!
      verbage: String
      chapter: Chapter!
    }

    type BookStore {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      location: String
      books: [Book]
      building: Building!
    }

    type Library {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      location: String,
      books: [Book]
      building: Building!
    }

    type Apartment {
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

    type Color {
      id: ID!
      type: String!
      isDefault: Boolean
    }

    type Art {
      id: ID!
      name: String! @quin(transform: toTitleCase)
      bids: [Float]
      comments: [String] @quin(enforce: artComment)
    }
  `
};
