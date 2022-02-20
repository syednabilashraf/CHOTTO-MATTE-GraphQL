const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLID, GraphQLNonNull} = require('graphql');
const mongoose = require('mongoose')
const Author = require('./models/author.model');
const Book = require('./models/book.model')
//dummy data

const books = [
    {id: 1, name: "book1", genre: "genre1", authorId: 1},
    {id: "2", name: 'book2', genre: 'genre2', authorId: 1},
    {id: "3", name: 'book3', genre: 'genre3', authorId: 3}]

const authors = [{
    id: 1,
    name: 'author1',
    age: '51'
},
{
    id: 2,
    name: 'author2',
    age: '52'
},
{
    id: 3,
    name: 'author3',
    age: '53'
}]

mongoose.connect('mongodb://localhost:27017/reading_list');
const app = express();


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        authorId: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId)
                //return authors.find((author) => author.id == parent.authorId)
            }
        }

    })
})

const AuthorType = new GraphQLObjectType({
    name: 'author',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        bookId: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({authorId: parent.id})
                //return books.filter((book) => book.authorId === parent.id)
            }
        }

    })
})

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLString}},
            resolve(parents, args) {
                //do db stuff here boi
                //return books.find((book) => book.id == args.id);
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                //return authors.find((author) => author.id == args.id);
                return Author.findById(args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parents, args) {
                return Author.find();
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parents, args) {
                return Book.find();
            }
        },

    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save()
            }

        }

    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: Mutation
})

app.use('/graphql', graphqlHTTP(
    {
        schema,
        graphiql: true

    }
))
app.listen(3000, () => {
    console.log('server started')
});