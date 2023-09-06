import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

//db
import db from "./_db.js";

//types
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((g) => g.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((a) => a.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((r) => r.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
  },
  Mutation: {
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(game);
      return game;
    },
    deleteGame(_, args) {
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits };
        }
        return g;
      });
      return db.games.find((g) => g.id === args.id);
    },
  },
};

//serevr setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log("Server ready at port", 4000);

// query GamesQuery{
//   games {
//     id,
//     title
//   }
// }

// query GameQuery($id: ID!) {
//   game(id: $id) {
//      title,
//      platform,
//      reviews {
//        id,
//        rating,
//        content,
//      }
//   }
// }
// variables:
// {
//    "id": "5"
// }

// mutation DeleteMutation($id: ID!) {
//   deleteGame(id: $id) {
//     id,
//     title,
//     platform
//   }
// variables:
// }
// {
//   "id":"2"
// }

// mutation AddMutation($game: AddGameInput!) {
//   addGame(game: $game) {
//     id,
//     title,
//     platform
//   }
// }
// variables:
//   "game": {
//     "title": "new game111",
//     "platform": ["switch", "ps5"]
//   }
// }

// mutation EditMutation($edits: EditGameInput!, $id: ID!) {
//   updateGame(edits: $edits, id: $id) {
//     title,
//     platform
//   }
// }
// variables:
// {
//   "edits": {
//     "title": "new title",
//     "platform": "mobile"
//   },
//   "id": "2"
// }
