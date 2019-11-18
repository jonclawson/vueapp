const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const multipart = require("connect-multiparty");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Set Application Port
const PORT = process.env.PORT || 3128;

// create express app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("appSecret", "secretforinvoicingapp");

// Multiparty Middleware
const multipartMiddleware = multipart();

function isEmpty(str) {
  return !str || 0 === str.length;
}

// setup transporter for node mailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "COMPANYEMAIL@gmail.com",
    pass: "companyPASS"
  }
});

const dbpath = "./database/app.db"

// create application routes

app.post("/register", multipartMiddleware, function(req, res) {
  // check to make sure none of the fields are empty
  if (
    isEmpty(req.body.name) ||
    isEmpty(req.body.email) ||
    isEmpty(req.body.company_name) ||
    isEmpty(req.body.password)
  ) {
    return res.json({
      status: false,
      message: "All fields are required"
    });
  }

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let db = new sqlite3.Database(dbpath);
    let sql = `INSERT INTO users(name,email,company_name,password) VALUES('${
      req.body.name
    }','${req.body.email}','${req.body.company_name}','${hash}')`;
    db.run(sql, function(err) {
      if (err) {
        throw err;
      } else {
        let user_id = this.lastID;

        let query = `SELECT * FROM users WHERE id='${user_id}'`;
        db.all(query, [], (err, rows) => {
          if (err) {
            throw err;
          }
          let user = rows[0];
          delete user.password;
          //  create payload for JWT
          const payload = {
            user: user
          };
          // create token
          let token = jwt.sign(payload, app.get("appSecret"), {
            expiresIn: "24h" // expires in 24 hours
          });

          return res.json({
            status: true,
            user: user,
            token: token
          });
        });
      }
    });
    db.close();
  });
});

app.post("/login", multipartMiddleware, function(req, res) {
  let db = new sqlite3.Database(dbpath);
  let sql = `SELECT * from users where email='${req.body.email}'`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.close();

    if (rows.length == 0) {
      return res.json({
        status: false,
        message: "Sorry, wrong email"
      });
    }
    let user = rows[0];

    let authenticated = bcrypt.compareSync(req.body.password, user.password);
    delete user.password;
    if (authenticated) {
      //  create payload for JWT
      const payload = { user: user };
      // create token
      let token = jwt.sign(payload, app.get("appSecret"), {
        expiresIn: "24h" // expires in 24 hours
      });

      return res.json({
        status: true,
        user: user,
        token: token
      });
    }

    return res.json({
      status: false,
      message: "Wrong Password, please retry"
    });
  });
});

// Create middleware for protecting routes
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("appSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

app.post("/sendmail", multipartMiddleware, function(req, res) {
  // get name  and email of sender

  let sender = JSON.parse(req.body.user);
  let recipient = JSON.parse(req.body.recipient);
  console.log(sender.id);
  console.log(recipient.name);
  let mailOptions = {
    from: "COMPANYEMAIL@gmail.com",
    to: recipient.email,
    subject: `Hi, ${recipient.name}. Here's an message from ${
      sender.company_name
    }`,
    text: `You owe ${sender.company_name}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      return res.json({
        status: 200,
        message: `Error sending main to ${recipient.name}`
      });
    } else {
      return res.json({
        status: 200,
        message: `Email sent to ${recipient.name}`
      });
    }
  });
});

app.post("/stories", multipartMiddleware, function(req, res) {
 
  // validate data
  if (isEmpty(req.body.title)) {
    return res.json({
      status: false,
      message: "Story requires title"
    });
  }

  // perform other checks

  // create story
  let db = new sqlite3.Database(dbpath);
  let sql = `INSERT INTO stories(title,body,favorite) VALUES('${req.body.title}','${req.body.body}', '${req.body.favorite}')`;
  
  db.serialize(function() {
    db.run(sql, function(err) {
      if (err) {
        return res.json({
          status: false,
          message: "Sorry, there was an error creating your story :("
        });
      }

      return res.json({
        status: true,
        message: "Story created"
      });
    });
  });
});

app.put("/stories/:id", multipartMiddleware, function(req, res) {
 
  // validate data
  if (isEmpty(req.body.title)) {
    return res.json({
      status: false,
      message: "Story requires title"
    });
  }

  // perform other checks

  // create story
  let db = new sqlite3.Database(dbpath);
  let sql = `UPDATE stories 
  SET title='${req.body.title}',body='${req.body.body}', favorite='${req.body.favorite}' 
  WHERE id=${req.params.id};`;
  
  db.serialize(function() {
    db.run(sql, function(err) {
      if (err) {
        return res.json({
          status: false,
          message: "Sorry, there was an error updating your Story :(",
          error: JSON.stringify(err)
        });
      }

      return res.json({
        status: true,
        message: "Story updated"
      });
    });
  });
});

app.get("/stories", multipartMiddleware, function(req, res) {
  let db = new sqlite3.Database(dbpath);
  let sql = `SELECT * FROM stories`;


  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    return res.json({
      status: true,
      stories: rows
    });
  });
});

app.get("/stories/:id", multipartMiddleware, function(
  req,
  res
) {
  let db = new sqlite3.Database(dbpath);
  let sql = `SELECT * FROM stories WHERE id='${req.params.id}'`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    let story = rows[0];

      return res.json({
        status: true,
        story: story,
    });
  });
});

app.get("/", function(req, res) {
  res.send("<h1>Welcome</h1>");
});

app.listen(PORT, function() {
  console.log(`App running on localhost:${PORT}`);
});
