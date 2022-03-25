const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "twitterClone.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const validatePassword = (password) => {
  return password.length > 6;
};


const userObj = (dbObject) => {
  return {
    use_id: dbObject.use_id,
    name: dbObject.name,
    password: dbObject.password,
    gender: dbObject.gender,
  };
};

const FollowerObj = (dbObject) => {
  return {
    follower_id: dbObject.follower_id,
    follower_user_id: dbObject.follower_user_id,
    following_user_id: dbObject.following_user_id,
  };
};

const TweetObj = (dbObject) => {
  return {
    tweet_id: dbObject.tweet_id,
    tweet: dbObject.tweet,
    user_id: dbObject.user_id,
    date_time: dbObject.date_time,
  };
};

const replyObj = (dbObject) => {
  return {
    reply_id: dbObject.reply_id,
    tweet_id: dbObject.tweet_id,
    reply: dbObject.reply,
    user_id: dbObject.user_id,
    date_time: dbObject.date_time,
  };
};

const LikeObj = (dbObject) => {
  return {
    like_id: dbObject.like_id,
    tweet_id: dbObject.tweet_id,
    user_id: dbObject.user_id,
    date_time: dbObject.date_time,
  };
};


app.post("/register", async (request, response) => {
  const { user_id,  name, username, password, gender } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (databaseUser === undefined) {
    const createUserQuery = `
     INSERT INTO
      user (user_id,  name, username, password, gender )
     VALUES
      (
       '${user_id}',
       '${name}',
       '${username}',
       '${hashedPassword}',
       '${gender}'  
      );`;
    if (validatePassword(password)) {
      await database.run(createUserQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

