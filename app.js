const express = require("express"),
        app   = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb://localhost/tennis_blog_app", {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



//MODEL CONFIG
const blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//    title:  "Test blog",
//     image: "https://ichef.bbci.co.uk/news/660/cpsprodpb/BBA6/production/_101883084_046410358.jpg",
//     body: "Hello welcome to my blog"
// });

app.get("/", (req, res) => {
   res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", (req, res) => {
    Blog.find({}, (err,blogs) => {
       if(err){
           console.log(err);
       }
       else{
           res.render("index", {blogs: blogs});
       }
    });
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",(req, res)=>{
   const id = req.body.blog;
    Blog.create(id, (err, newBlogs) => {
      if(err){
          res.render("new");
      }else{
          res.redirect("/blogs");
          //res.render("/blogs", {blogs: newBlogs})
      }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id, (err, foundBlog) => {
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("Show", {blog: foundBlog});
       }
    });
});


//EDIT ROUTE
app.get("/blogs/:id/edit", (req,res) => {
    const id = req.params.id;
    Blog.findById(id, (err,editBlog) => {
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("edit", {blog: editBlog});
       }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",(req, res) => {
    const id = req.params.id;
    const data = req.body.blog;
    Blog.findByIdAndUpdate(id, data, (err, updateBlog)=>{
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs/" + id);
       }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", (req,res) => {
   const id = req.params.id;
   Blog.findByIdAndRemove(id, err => {
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs");
      }
   });
});

app.listen(process.env.PORT || 3000, process.env.IP);
