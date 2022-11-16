const app = require("./index")
const port = process.env.PORT
const errorMiddleware = require("./middlewares/error.middleware")
const mongoose = require('mongoose');

console.log(`Node environment: ${process.env.NODE_ENV}`)

mongoose.connect('mongodb://localhost/demodb2', {family: 4}, (err) => {
    if(err){
        console.log('Error occurred');
    }
    else {
        console.log('connected');
        app.listen(port, () => {
            console.log(`Example app listening at port http://localhost:${port}`)
        })
    }
});


// Error Handler Middleware
app.use(errorMiddleware)
