const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v4: uuid } = require('uuid');

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int
}

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  ): Book!

  editAuthor(
    name: String!, setBornTo: Int!
  ): Author
}
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async () => Book.find({}),
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) => {
      return books.filter((book) => book.author === root.name).length;
    },
    
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        let author = await Author.findOne({ name: args.author });
    
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
    
        const book = new Book({
          ...args,
          author: author._id, 
        });

        await book.save()
    
        return await book.populate('author');
      } catch (error) {
        throw new Error(`Failed to add book: ${error.message}`);
      }
    },
    editAuthor: (root, args) => {
      const { name, setBornTo } = args;
    
      let existingAuthor = authors.find(a => a.name === name);
    
      if (!existingAuthor) {
        return null;
      }
    
      existingAuthor = { ...existingAuthor, born: setBornTo };
      authors = authors.map(a => (a.name === name ? existingAuthor : a));
    
      return existingAuthor;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
