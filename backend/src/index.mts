import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
// import * as jwt from "jsonwebtoken";
import { createClient } from "redis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dataSource from "./config/datasource.mjs";
import {
   CategoryResolver,
   CheckoutResolver,
   ProductResolver,
   UserResolver,
} from "./resolvers/index.mjs";
// import { fillDatabaseIfEmpty } from "./fillDatabaseIfEmpty";

import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
// require("dotenv").config();
const {verify} = jwt;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
   throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables.");
}

export const stripe = new Stripe(stripeSecretKey);
// export const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const redisClient = createClient({
  url: "redis://redis",
});

redisClient.on("error", (err: Error) => {
  console.log("Redis CLient Error", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

const start = async () => {
  await redisClient.connect();

  try {
   await dataSource.initialize();
   console.log("Data source initialized");

   console.log("Running migrations...");
   await dataSource.runMigrations();
   console.log("Migrations completed");
} catch (error) {
   console.error("Error during initialization or migration:", error);
}

//   await dataSource.initialize();
//   await dataSource.runMigrations();

//   await fillDatabaseIfEmpty();

  const schema = await buildSchema({
    resolvers: [
      ProductResolver,
      CategoryResolver,
      UserResolver,
      CheckoutResolver,
    ],
   //  validate:true,
    // authChecker est appelée par TypeGraphQL chaque fois qu'une requête est effectuée sur un champ protégé par un décorateur @Authorized.
     authChecker: ({ context }, roles) => {
        if (roles.length > 0 && context.email) {
           if (roles.includes(context.role)) {
              return true;
           } else return false;
        }
        if (roles.length === 0 && context.email) {
         return true;
        } else return false
     },
  });

  const server = new ApolloServer({ schema,});
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },

    // A chaque requête exécuté, la fonction de contexte va s'enclencher
    context: async ({ req }) => {
      const token = req.headers.authorization?.split("Bearer ")[1];
      console.log("TOKEN : ", token);
      

      if (token) {
        try {
          const payload = verify(token, "mysupersecretkey");
          console.log("PAYLOAD :", payload); // Le payload contient l'email, le role et le username. Voir user.service.ts méthode login. 

          return payload;
        } catch {
          console.log("invalid secret key");
        }
      }
      return {};
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

start();
