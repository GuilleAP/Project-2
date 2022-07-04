// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express 
const express = require("express"); 

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs"); 

//aleix
const app = express(); 

require("./config")(app);
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware



// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "Projecte-2";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const ingredient = require("./routes/ingredient.routes");
app.use("/ingredient", ingredient);

const recipe = require("./routes/recipe.routes");
app.use("/recipe", recipe);

const userSignup = require("./routes/user.routes");
app.use("/", userSignup);

const userLogin = require("./routes/user-log.routes");
app.use("/", userLogin);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
