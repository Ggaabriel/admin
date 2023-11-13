const express = require("express");
const app = express();
var cors = require('cors')
const workersRouter = require("./routers/workersRouter")
const loggerMiddleware = require('./middleware/logger');
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware); 
app.use('/', express.static(__dirname+"/"));
app.use('/',workersRouter);



app.listen(1234, ()=>{
    console.log(`Server is running on port http://localhost:${1234}`);
});