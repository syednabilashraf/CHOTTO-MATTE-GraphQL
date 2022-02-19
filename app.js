const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql');

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
                return authors.find((author) => author.id == parent.authorId)
            }
        }

    })
})

const AuthorType = new GraphQLObjectType({
    name: 'author',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLString},
        bookId: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter((book) => book.authorId === parent.id)
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
                return books.find((book) => book.id == args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return authors.find((author) => author.id == args.id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parents, args) {
                return authors;
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parents, args) {
                return books;
            }
        },

    }
})

const schema = new GraphQLSchema({
    query: rootQuery
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