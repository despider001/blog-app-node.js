var express     = require("express"),
    app         = express(),
    ejs         = require("ejs"),
expressSanitizer = require('express-sanitizer'),
    bodyParser  = require("body-parser"),
methodOverride  = require("method-override"),
    mongoose    = require("mongoose");

    mongoose.connect(process.env.DATABASEURL);
    //mongodb://localhost/blog_app
    //mongodb://sadiq:64a98b67@ds133044.mlab.com:33044/despiderblog
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    
    
    // design schema for blog post
    var blogSchema = new mongoose.Schema({
        title : String,
        image : String,
        description: String,
        created: {type: Date, defult: Date.now}
    });
    // generate a model
    var blogPost = mongoose.model("blogPost", blogSchema);
    
    // blogPost.create({
    //     title: "A.I. Artificial Intelligence",
    //     image: "http://tecnologia.libero.it/img/plchld/ph_tecnologia.jpg",
    //     description: "A robotic boy, the first programmed to love, David (Haley Joel Osment) is adopted as a test case by a Cybertronics employee (Sam Robards) and his wife (Frances O'Connor). Though he gradually becomes their child, a series of unexpected circumstances make this life impossible for David. Without final acceptance by humans or machines, David embarks on a journey to discover where he truly belongs, uncovering a world in which the line between robot and machine is both vast and profoundly thin."
    // }, function(err, post){
    //     if(err){console.log(err);}else{console.log(post);}
    // });
    
    //set index route
    app.get("/blog", function(req, res){
        blogPost.find({}, function(err, posts){
            if(err){console.log(err);}else{
                res.render("index", {posts: posts});
            }
        });
        
    });
    // redirect from "/"
    app.get("/", function(req, res){
        res.redirect("/blog");
    });
    
    // new route
    app.get("/blog/new", function(req, res){
        res.render("new");
    });
    
    //create route
    app.post("/blog", function(req, res){
        req.body.blog.description = req.sanitize(req.body.blog.description);
        blogPost.create(req.body.blog, function(err, post){
            if(err){console.log(err);}else{
                res.redirect("/blog");
            }
        });
    });
    
    //show route
    app.get("/blog/:id", function(req, res){
        blogPost.findById(req.params.id, function(err, post){
            if(err){console.log(err);}else{
                res.render("single-post", {post: post});
            }
        });
    });
    
    // edit route
    app.get("/blog/:id/edit", function(req, res){
        blogPost.findById(req.params.id, function(err, post){
            if(err){console.log(err);}else{
               res.render("edit", {post: post}); 
            }
        });
        
    });
    
    //update route
    app.put("/blog/:id", function(req, res){
        req.body.blog.description = req.sanitize(req.body.blog.description);
        blogPost.findByIdAndUpdate(req.params.id, req.body.blog, function(err, post){
            if(err){console.log(err);}else{
                res.redirect("/blog/"+req.params.id);
            }
        });
    });
    
    //destroy route
    // app.delete("/blog/:id", function(req, res){
    //   blogPost.findByIdAndRemove(req.params.id, function(err, post){
    //       if(err){res.redirect("/blog");}else{
    //           res.redirect("/blog");
    //       } 
    //   }); 
    // });
    
    app.get("*", function(req, res) {
        res.send("You are not authorized for this action!");
    })
    
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("App is running!");
    });