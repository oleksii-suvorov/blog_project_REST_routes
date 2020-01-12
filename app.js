const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      methodOverride = require('method-override'),
      expressSanitizer = require("express-sanitizer");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

mongoose.connect("mongodb+srv://oleskiy:adgj1357@cluster0-x1ici.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now }
});

const Blog = mongoose.model("blogs", blogSchema);

app.get("/", function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render("blogs", {blogs});
    }
  });
});

app.get("/blogs/new", function(req,res){
  res.render("new");
});

app.post("/blogs", function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, createdBlog){
    if(err){
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
    } else {
      res.render("blog", {blog: foundBlog});
    }
  });
});

app.get("/blogs/:id/edit", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

app.put("/blogs/:id", function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err, removedBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, () => {
  console.log("Your server has been started at 3000 port!");
});
