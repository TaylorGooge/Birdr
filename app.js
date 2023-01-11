/* eslint-disable max-len */
const express = require('express');
const moment = require('moment');
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 3656;
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const helpers = require('./src/js/helpers');

// ///handlebars setup//////
let handlebars = require('handlebars');
const {engine} = require('express-handlebars');
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './src/views');
const extend = require('handlebars-extend-block');
handlebars = extend(handlebars);

// ///env //////
require('dotenv').config();

// ///api //////
const api = require('./Api/restApi');
const chartApi = require('./Api/chartApi');
const strapiApi = require('./Api/strapiApi');

// ///paths//////
app.use(express.static(path.join(__dirname + '/src/')));
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', api);
app.use('/', chartApi);
app.use('/', strapiApi);
app.set('port', port);

// ///auth0 setup//////
const {auth, requiresAuth} = require('express-openid-connect');
app.set('trust proxy', true);

function getUser(req) {
  return {
    user: req.oidc.isAuthenticated() ? req.oidc.user.nickname : false,
    email: req.oidc.isAuthenticated() ? req.oidc.user.email : false,
    userName: req.oidc.isAuthenticated() ? req.oidc.user.nickname : false,
    givenName: req.oidc.isAuthenticated() ? req.oidc.user.given_name : false,
    familyName: req.oidc.isAuthenticated() ? req.oidc.user.family_name : false,
    picture: req.oidc.isAuthenticated() ? req.oidc.user.picture : false,
    lastLogin: req.oidc.isAuthenticated() ? req.oidc.user.last_login : false,
  };
}

///markdown processing
function toHTML(text){
  var showdown  = require('showdown'),
    converter = new showdown.Converter(),
    text      = text,
    html      = converter.makeHtml(text);
  return html
}

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.secret,
    baseURL: process.env.baseURL,
    clientID: process.env.clientID,
    issuerBaseURL: process.env.issuerBaseURL,
  }),
);
//handlebars helpers
handlebars.registerHelper('var',function(name, value, context){
  this[name] = value;
})

handlebars.registerHelper('repeat', require('handlebars-helper-repeat'));

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

handlebars.registerHelper('formatDate', function(dateString) {
  return new handlebars.SafeString(
      moment(dateString).format("MMM D YYYY").toUpperCase()
  );
});

handlebars.registerHelper("dec", function(value, options)
{
    return parseInt(value) -1 ;
});


// ///routes//////
app.get('/', function(req, res, next) {
  axios.get('http://localhost:1337/api/blogs?sort[0]=publishDate:desc&pagination[limit]=3&populate=*', {
    headers: {
      Authorization:
        `Bearer ${process.env.strapiTestEnv}`,
    },
  })
  .then((res1) => {
    let posts = res1.data.data
    res.render('landing-home', { blog: {posts}, userNav: getUser(req), active: { home: true }});
  })
  .catch((error) => {
    res.render('landing-home', { userNav: getUser(req), active: { home: true }});
    console.log(error);
  })
 
});

app.get('/map', requiresAuth(), function(req, res, next) {
  user = getUser(req);
  if (user.email) {
    axios.get(`${process.env.baseURL}/getloggedAll`)
        .then(function(response) {
          res.render('map', { userNav: getUser(req), active: { map: true }, data: JSON.stringify(helpers.toGeoJson(response.data))});
        });
  }
});

// app.get('/blogpost', function(req, res, next) {
//     axios.get(`http://localhost:1337/api/blogs/${req.query.id}?&populate=deep`, {
//       headers: {
//         Authorization:
//           `Bearer ${process.env.strapiTestEnv}`,
//       },
//     })
//     .then((res1) => {
//       let posts = res1.data.data
//       let postBody = posts.attributes.postBody
//       postBody = toHTML(postBody);
//       posts.attributes.postBody = postBody
//       res.render('blogpost', { blog: {posts}, userNav: getUser(req)});
//     })
//     .catch((error) => {
//       res.render('error404');
//       console.log(error);
//     })
 
// });

app.get('/support', function(req, res, next) {
  res.render('support', { userNav: getUser(req), active: { support: true }});
});

// app.get('/dashboard', function(req, res, next) {
//   res.render('dashboard', { userNav: getUser(req), active: { dashboard: true }});
// });

app.get('/profile', requiresAuth(), function(req, res, next) {
  res.render('profile', {active: "profile" , userNav: getUser(req)});
});

app.get('/about', function(req, res, next) {
  res.render('about', { userNav: getUser(req), active: { about: true }});
});

// app.get('/page-profile-settings', requiresAuth(),  function(req, res, next) {
//   res.render('page-profile-settings', {active: { settings: true, profile: true }, userNav: getUser(req)});
// }); 

// app.get('/help', function(req, res, next) {
//   axios.get(`http://localhost:1337/api/faqs?&populate=*`, {
//       headers: {
//         Authorization:
//           `Bearer ${process.env.strapiTestEnv}`,
//       },
//     })
//     .then((res1) => {
//       let faqs= res1.data.data
//       for (let i=0; i< faqs.length; i++){
//         let answer= faqs[i].attributes.Answer
//         answer = toHTML(answer);
//         faqs[i].attributes.Answer= answer
//       }
//       res.render('help', { active: { help: true }, faq: {faqs}, userNav: getUser(req) });
//     })
//     .catch((error) => {
//       res.render('error404');
//       console.log(error);
//     })
// });
// app.get('/blog', function(req, res, next) {
//   axios.get('http://localhost:1337/api/blogs?pagination[page]=1&pagination[pageSize]=10&&populate=deep', {
//     headers: {
//       Authorization:
//         `Bearer ${process.env.strapiTestEnv}`,
//     },
//   })
//   .then((res1) => {
//     let posts = res1.data.data
//     for (let i=0; i < posts.length ; i++){
//       console.log(posts[1].attributes.author.data.attributes.authorimage.data.attributes.url);
//     }
//     let pagination = res1.data.meta
//     res.render('blog', { blog: {posts}, pagination: {pagination}, userNav: getUser(req)})
//   })
//   .catch((error) => {
//     res.render('comingsoon')
//     console.log(error);
//   })
// });

app.get('/tracking-history',  function(req, res, next) {
  res.render('tracking-history', { userNav: getUser(req), active: { tracking: true }});
});

// app.get('/signup',  function(req, res, next) {
//   res.render('signup', { userNav: getUser(req) });
// });

// app.get('/signin', function(req, res, next) {
//   res.render('signin', { userNav: getUser(req) });
// });

// app.get('/resetpassword', function(req, res, next) {
//   res.render('resetpassword', { userNav: getUser(req) });
// });

app.get('*', function(req, res){
  res.render('error404')
});

// ///create server //////
app.listen(app.get('port'), function() {
  console.log(`Express started on ${process.env.baseURL}; press Ctrl-C to terminate.`);
});

