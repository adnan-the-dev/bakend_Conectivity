const express = require ('express')
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
const helmet = require ('helmet');
const morgan = require ('morgan');
const cors = require('cors');

const app = express();
dotenv.config();
// const {MONGO_URL} = process.env;
// const MONGO_URL = 'mongodb+srv://adnan:apple123@cluster0.afyprvm.mongodb.net/?retryWrites=true&w=majority'
//const MONGO_URL = 'mongodb://192.168.2.138:27017'
 const MONGO_URL = 'mongodb://103.18.20.49:27017/test'

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL, (err)=>{
    if(err){
        console.log("Unable to Connect" , err);
    } else{
        console.log("Connected to MongoDB");
    }
})

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
//middlewares

app.use(cors())


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users' , userRoute);
app.use('/api/auth' , authRoute);
app.use('/api/posts' , postsRoute);


app.listen(8800, ()=>{
    console.log("Backend Server is running");
})
