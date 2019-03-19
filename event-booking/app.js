const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema,  } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql', graphqlHttp({
    schema: buildSchema(`
        type Query {
            events: [String!]!
        }

        type Mutation {
            createEvent(name: String): String
        }

        schema {
            query: Query
            mutation: Mutation
        }
    `),
    rootValue: {
        events: () => {
           return ['Romantic Cooking', 'Sailing', 'All night coding'] 
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3007);