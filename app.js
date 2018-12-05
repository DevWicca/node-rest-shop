const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/Routes/products');
const orderRoutes = require('./api/Routes/orders');
const userRoutes = require('./api/Routes/user');

mongoose.connect('mongodb://wicca:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-hffyi.mongodb.net:27017,node-rest-shop-shard-00-01-hffyi.mongodb.net:27017,node-rest-shop-shard-00-02-hffyi.mongodb.net:27017/test?ssl=true&replicaSet=Node-Rest-Shop-shard-0&authSource=admin&retryWrites=true', {
    useNewUrlParser: true
})

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPRIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST,PATCH, DELETE ,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);

});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });

});

module.exports = app;