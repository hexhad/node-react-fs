const { Octokit, App } = require("octokit");
const axios = require("axios");
require("dotenv").config();
const github_auth = process.env.GITHUB_AUTH;
// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({
  auth: `${github_auth}`,
});

// https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28

async function authTest() {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  console.log("Hello, %s", login);
}

async function getLikedList(phone_number, likes) {
  // return await octokit.request("GET /user");
  const { data } = await getMethod("https://api.github.com/users");

  var likedListFullDetail = [];
  if (!!likes?._fieldsProto?.likes) {
    let likeList = [];
    likes._fieldsProto.likes.arrayValue.values.map((e) =>
      likeList.push(e[e.valueType])
    );
    likedListFullDetail = data.filter((item) =>
      likeList.includes(item.id.toString())
    );
    return likedListFullDetail;
  }
  return likedListFullDetail;
}

async function getUser(username) {
  // Return: { login: “”, id: “”, avatar_url: “”, html_url: “”, public_repos, followers }
  // const { data } = await octokit.request("GET /users/{username}", {
  //   username: username,
  // });

  const { data } = await getMethod(`https://api.github.com/users/${username}`);

  const { login, id, avatar_url, public_repos, followers } = data;
  return { login, id, avatar_url, public_repos, followers };
}

async function getUsers(page, per_page, q, likes, mobile) {
  // const { data } = await octokit.request("GET /users", {});
  const { data } = await getMethod("https://api.github.com/users");
  const pageArray = [];
  let searchTerms = !!q ? q.split(",") : ["login", "id", "avatar_url"];

  if (!!!searchTerms.includes(["id"])) {
    searchTerms.push("id", "liked");
  }

  if (!!!searchTerms.includes(["avatar_url"])) {
    searchTerms.push("avatar_url");
  }

  data.map((e) =>
    Object.keys(e).forEach((i) => {
      if (!searchTerms.includes(i)) delete e[i];
    })
  );

  while (data.length) {
    pageArray.push(data.splice(0, per_page || 5));
  }

  if (!!likes?._fieldsProto?.likes) {
    let likeList = [];
    likes._fieldsProto.likes.arrayValue.values.map((e) =>
      likeList.push(e[e.valueType])
    );
    pageArray[page || 0].map((e) => {
      if (likeList.includes(e.id.toString())) e.liked = true;
    });
  }

  let pages = pageArray.length;
  let current_page = page || 0;
  let content = pageArray[page || 0];
  return { content, pages, current_page };
}

async function getMethod(endpoint) {
  return axios.get(endpoint).catch(function (error) {
    console.log(error);
  });
}

module.exports = { authTest, getLikedList, getUser, getUsers };
