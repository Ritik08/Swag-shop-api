var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
MongoClient = require('mongodb').MongoClient;
var db = mongoose.connect("mongodb://localhost/swag-shop");
// var db = MongoClient.connect("mongodb://localhost/swag-shop", { useNewUrlParser: true }, { useUnifiedTopology: true });

var Product = require("./model/product");
var Wishlist = require("./model/wishlist");
const wishlist = require("./model/wishlist");
var cors = require('cors')
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/product", function (request, response) {

    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({ error: "Could notsave product" });
        }
        else {
            response.send(savedProduct);
        }
    });
});

app.get("/product", function (request, response) {
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send({ error: "Could not fetch products" });
        }
        else {
            response.send(products);
        }
    });

});
app.get("/wishlist", function (request, response) {
    Wishlist.find({}).populate({ path: "products", model: "Product" }).exec(
        function (err, wishlists) {
            if (err) {
                response.status(500).send({ error: "Could not fetch products" });
            }
            else {
                response.send(wishlists);
            }
        });

});

app.put("/wishlist/product/add", function (request, response) {
    Product.findOne({ _id: request.body.productId }, function (err, product) {
        if (err) {
            response.send(500).status({ error: "Could not add item to wishlist" });
        }
        else {
            Wishlist.update({ _id: request.body.wishlistId }, { $addToSet: { products: product._id } }, function (err, wishlist) {
                if (err) {
                    response.status(500).send({ error: "Could not add item to wishlist1" });
                }
                else {
                    response.send(wishlist)
                }
            })
        }

    })

});

app.post("/wishlist", function (request, response) {

    var wishlist = new Wishlist();
    wishlist.title = request.body.title;
    // product.price = request.body.price;
    wishlist.save(function (err, newWishlist) {
        if (err) {
            response.status(500).send({ error: "Could notsave product" });
        }
        else {
            response.send(newWishlist);
        }
    });
});
app.listen(3000, function () {
    console.log("Swag shop api running on port 3000");
});