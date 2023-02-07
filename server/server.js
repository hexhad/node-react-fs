const express = require("express");
const app = express();
const { db } = require("./firebase.js");
const { FieldValue } = require("firebase-admin/firestore");
const bodyParser = require("body-parser");
const cors = require('cors')
const { genarate_number } = require("./number-gen");
const { sendSms } = require("./twilio");
const { authTest, getLikedList, getUsers, getUser } = require("./github");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

app.get("/api", (req, resp) => {
  resp.json("hello");
});

/**
 * CreateNewAccessCode
 * Parameters: phoneNumber
 * Return: a random 6-digit access code
 * */
app.post("/CreateNewAccessCode", async (req, resp) => {
  const { mobile } = req.body;
  let otp = genarate_number();
  
  // sendSms(mobile,otp); <-- this is the only prob im seeing

  console.log("OTP ::::> ", otp);
  const Path = db.collection("unique-number").doc(mobile);
  const res = await Path.set(
    {
      otp: otp,
    },
    { merge: true }
  );
  resp.status(200).send({ success: true });
});

/**
 * ValidateAccessCode
 * Parameters: accessCode, phoneNumber
 * Return: { success: true }
 * */
app.post("/ValidateAccessCode", async (req, resp) => {
  const { otp, mobile } = req.body;

  const Path = db.collection("unique-number").doc(mobile);
  const data = await Path.get();
  if (!data.exists) {
    return resp.status(404).send({ success: false });
  }
  resp.status(200).send({ success: data.data()?.otp == otp ? true : false });
});

/**
 * searchGithubUsers
 * Parameters: q (search term), page (page number), per_page (results per page)
 * Return: an array of users with login name that contains the search term
 * */
app.get("/searchGithubUsers", async (req, resp) => {
  const { page, per_page, q, phone_number } = req.query;
  var likes = [];

  if (!!phone_number) {
    const Path = db.collection("liked-list").doc(phone_number);
    likes = await Path.get();
  }
  const page_data = await getUsers(page, per_page, q, likes,phone_number);
  if (!!!page_data) {
    return resp.status(404).send({ success: false });
  }
  resp.status(200).send(page_data);
});

/**
 * findhGithubUserProfile
 * Parameters: github_user_id
 * Return: { login: “”, id: “”, avatar_url: “”, html_url: “”, public_repos, followers }
 * */
app.get("/findhGithubUserProfile", async (req, resp) => {
  const { username } = req.query;
  const data = await getUser(username);
  if (!!!data) {
    return resp.status(404).send({ success: false });
  }
  resp.status(200).send(data);
});

/**
 * likeGithubUser
 * Paramaters: phone_number (phone number of the registered user), github_user_id (id of the github profile the user likes)
 * Return: 200 code
 * */
app.post("/likeGithubUser", async (req, resp) => {
  const { phone_number, github_user_id } = req.body;
  const Path = db.collection("liked-list").doc(phone_number);
  const res = await Path.update(
    {
      likes: FieldValue.arrayUnion(github_user_id),
    },
    { merge: true }
  );
  console.log("Respone", res);
  resp.status(200).send({ success: true });
});

/**
 * getUserProfile
 * Paramaters: phone_number (phone number of the registered user)
 * Return: { favorite_github_users: [ user_object, user_object, user_object ] }
 * */
app.get("/getUserProfile", async (req, resp) => {
  const { phone_number } = req.query;
  var likes = [];
  if (!!phone_number) {
    const Path = db.collection("liked-list").doc(phone_number);
    likes = await Path.get();
  }
  const data = await getLikedList(phone_number,likes);
  if (!!!data) {
    return resp.status(404).send({ success: false });
  }
  resp.status(200).send(data);
});

/**
 * APP LISTNING
 */
app.listen(port, () => {
  console.log(`server started => PORT : ${port}`);
});
