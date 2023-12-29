const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const urouter = require("./routers/user-router");
const frouter = require("./routers/film-router");
const ufrouter = require("./routers/user-film-router");
const rrouter = require("./routers/review-router");
const errorMiddleware = require('./middlewares/error-middleware.js')
const http = require('http');
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use('/api', [ufrouter, urouter, rrouter, frouter]);
app.use(errorMiddleware);

const start =async ()=>{
  try{
    server.listen(5000, async() => {
      console.log("Server is running on port 5000");
    });
  }catch(e){
    console.log(e);
  }
}
start();