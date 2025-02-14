const express = require("express");
const cors = require("cors");
const globalError = require("./error/error");
const connectDb = require("./db/db");
const config = require("./config/config");
const router = require("./router/product.router");
const fileUpload = require("express-fileupload");
const path = require("path");

// ^ create app
const app = express();

// ^ use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'uploads' directory
app.use(
  "/controller/uploads",
  express.static(path.join(__dirname, "controller/uploads"))
);


// note 
app.use(fileUpload());
app.use(router);

// ^ custom middleware

// ! global error
app.use(globalError);

// * private route
app.get("/private", (req, res) => {
  return res.status(200).json({
    message: "i am private route",
  });
});

//? create root route
app.get("/", (req, res) => {

  console.log("some one get this server");

  res.send({
    message: "this is root route for yessto backend ",
  });
});

// ? mongodb connect
connectDb(config.DB_CONN)
  .then(() => {
    console.log("database connected");
    // app lister
    app.listen(config.PORT, () => {
      console.log(`server is running at ${config.PORT}`);
    });
  })
  .catch((e) => console.log(e));
