import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

const eraseDatabaseOnSync = true;

app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        // remove the internal sequelize error message
        // leave only the importan validation error
        const message = error.message
            .replace('SequelizeValidationError: ', '')
            .replace('Validation error: ', '');
        
        return {
            ...error,
            message,
        };
    },
    context: async () => ({
        models,
        me: await models.User.findByLogin('rwieruch'),
    }),
});

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {

    if (eraseDatabaseOnSync) {
        createUsersWithMessages();
    }

    app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
});

const createUsersWithMessages = async () => {
    await models.User.create(
        {
            username: 'rwieruch',
            messages: [
                {
                    text: 'Published the Road to learn React'
                }
            ],
        },
        {
            include: [models.Message],
        }
    );

    await models.User.create(
        {
            username: 'ddavids',
            messages: [
                {
                    text: 'Happy to release...',
                },
                {
                    text: 'Published a complete...',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );
};