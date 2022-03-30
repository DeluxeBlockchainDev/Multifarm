import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import express, { Response } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { getAccountByAuth, getAccountByUsername, getDefaultAccount } from "./services/account";
import {
  AccountResolver,
  UserResolver,
} from "./resolvers/index";

const port = process.env.PORT || 4000;

/**
 * Async StartServer function
 */

export interface Context {
  res: Response;
  accountId: number;
  user: {
    email?: string;
    email_verified?: boolean;
    uid: string;
  };
}

const startServer = async () => {
  /** Create Connection to database before starting server */
  await createConnection().then(fullfilled => {
    console.log("Connected to database successfully", fullfilled.isConnected);
  });

  // Creating executable schema and brings in our various type definitions (schemas) and resolvers
  const schema = await buildSchema({
    resolvers: [
      AccountResolver,
      UserResolver,
    ],
    nullableByDefault: true,
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: async ({ req, res }): Promise<Context> => {
      // If passed in an auth key, return dummy user and account. This is for playground access and code-gen purposes
      if (req.headers["x-auth-key"] === process.env.X_AUTH_KEY) {
        return {
          accountId: 8,
          user: { uid: "cN0JAp5NBJPaGcY45LGnkIY28v73" },
          res,
        };
      }

      // These operations are allowed to happen without having an existing account ID yet (since they happen prior to account creation)
      if (
        req.body.operationName === "CreateNewUser" ||
        req.body.operationName === "isUsernameAvailable"
      ) {
        return { accountId: -1, user: { uid: "cN0JAp5NBJPaGcY45LGnkIY28v73" }, res };
      }

      const idToken = req.headers.authorization.split("Bearer ")[1];

      let accountTag: undefined | string;

      // If the front end is passing a default account to work with, set the tag
      if (req.headers.account && typeof req.headers.account === "string") {
        accountTag = req.headers.account;
      }

      try {
        // Get use from firebase JWT
        const user = {
          uid: 'sample-user-id',
          email: 'sample@email.address',
        }

        if (!!accountTag) {
          // Got an account tag to work with, find account that matches user + tag combo;
          const account = await getAccountByAuth(user.uid, accountTag);
          return { accountId: account.id, user, res };
        } else {
          // If query doesn't have a default account set (ie, first login), we return the users default account
          const account = await getDefaultAccount(user.uid);
          return { accountId: account.id, user, res };
        }
      } catch (error) {
        console.error(error);
        throw new AuthenticationError("Unauthorized");
      }
    },
  });

  /**
   * We're creating an apollo server that sits on top of Express. This will allow
   * us to use any express middleware we might need, espectially things like helmet,
   * cors, and cookies. This will help us track accounts
   */
  const app = express();
  // app.use(helmet());
  app.use(cookieParser());

  const path = process.env.GQLPATH || "/";

  server.applyMiddleware({
    app,
    path,
    bodyParserConfig: {
      limit: "5mb",
    },
  });

  // Start Express Server
  app.listen({ port }, () => {
    console.log(`🚀 HUMBL Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();
