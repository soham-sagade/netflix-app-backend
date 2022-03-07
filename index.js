const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./routes/usersRouter');
const movieRouter = require('./routes/moviesRouter');
const listRouter = require('./routes/listsRouter')
dotenv.config();
const PORT = process.env.PORT || 8001;

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(movieRouter);
app.use(listRouter);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
}).then(() => console.log('Db Connected'))
    .catch((error) => console.log(error));

app.listen(PORT , () => {
    console.log('Server Started!');
})