const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const ws = require("ws");

//Cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// //Generate random 5 digit number
// const random = Math.floor(10000 + Math.random() * 80000);
// console.log(random);

const PORT = process.env.PORT || 4000;

//Allow cors
const cors = require("cors");
//Loop of allowed origins
const allowedOrigins = ["http://localhost:3001", "http://localhost:3000", "https://blabla-car.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

//Allow JSON to be parsed
app.use(express.json());

// Enable file upload using express-fileupload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//Allow static files
app.use(express.static(__dirname + "/files"));


//Create websocket server on port 4000
const wss = new ws.Server({ port: "3001" });

//On connection
wss.on("connection", (ws) => {
  //Print connection
  console.log("New client connected");

  //Listen message 
  ws.on("message", (message) => {
    //Print message
    console.log("Received: %s", message);
  });

  //Broadcast message
  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });
});

//Connect to database
const connectDB = require("./config/database");
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Send html file
app.get("/files", (req, res) => {
  res.sendFile(__dirname + "/files/");
});

const apiv1 = "/api/v1";

app.use(`${apiv1}/login`, require("./routes/login"));
app.use(`${apiv1}/register`, require("./routes/register"));
app.use(`${apiv1}/profile`, require("./routes/profile"));
app.use(`${apiv1}/categories`, require("./routes/categories"));
app.use(`${apiv1}/support`, require("./routes/support"));
app.use(`${apiv1}/files`, require("./routes/files"));
app.use(`${apiv1}/report`, require("./routes/report"));
app.use(`${apiv1}/notifications`, require("./routes/notifications"));
app.use(`${apiv1}/users`, require("./routes/users"));

//Vehicles
app.use(`${apiv1}/vehicles`, require("./routes/vehicles"));
app.use(`${apiv1}/v-colors`, require("./routes/v-colors"));
app.use(`${apiv1}/v-dates`, require("./routes/v-years"));
app.use(`${apiv1}/v-kinds`, require("./routes/v-kinds"));
app.use(`${apiv1}/v-types`, require("./routes/v-types"));

// app.use(`${apiv1}/terms`, require("./routes/terms"));
// app.use(`${apiv1}/about`, require("./routes/about"));

//Static files
app.use(express.static("public"));

app.use("/privacy-policy", (req, res) => {
  res.sendFile(__dirname + "/public/privacy-policy.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
}); //Start the server