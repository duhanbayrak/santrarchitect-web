const express = require('express'),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    nodemon = require("nodemon"),
    PORT = process.env.PORT,
    methodOverride = require("method-override"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session"),
    User = require("./models/userModel"),
    Project = require("./models/ProjectModel"),
    fileUpload = require("express-fileupload"),
    path = require("path");


const dbURL = 'mongodb+srv://duhanbayrak:348415Duhan@duhandb.pylk5.mongodb.net/santrarchitect?retryWrites=true&w=majority';

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true })
    .then((result) => {
        console.log("Bağlantı Kuruldu");
    }).catch((err) => {
        console.log("hata")
        console.log(err);
    });


app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.use(require("express-session")({
    secret: "güvenlik cümlesi",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get("/", (req, res) => {

    Project.find().sort({ date: -1 })
        .then((result) => {
            res.render("index", { projects: result })
        }).catch((err) => {
            console.log(err)
        });
});
app.get("/addNewProject", isLoggedIn,(req, res) => {
    res.render("addNewProject");
});
app.get("/allProjects", (req, res) => {
    Project.find().sort({ date: -1 })
        .then((result) => {
            res.render("allProjects", { projects: result })
        }).catch((err) => {
            console.log(err)
        });
});
app.delete("/allProjects/delete/:id",(req,res) => {
    const id = req.params.id;
    Project.findByIdAndDelete(id)
     .then((result) => {
         res.json({link:"/allProjects"})
     })
      .catch((err) => {
         console.log(err);
      })
 })
app.get("/project/:id", (req, res) => {

    const id = req.params.id
    Project.findById(id)
        .then((result) => {
            res.render("project", { projects: result })
        }).catch((err) => {
            console.log(err)
        });
});
app.post("/test", (req, res) => {
    let image_1 = req.files.image_1;
    let image_2 = req.files.image_2;
    let image_3 = req.files.image_3;
    let image_4 = req.files.image_4;
    let image_5 = req.files.image_5;
    let image_6 = req.files.image_6;


    image_1.mv(path.resolve(__dirname, "./public/assets/img/project", image_1.name));
    image_2.mv(path.resolve(__dirname, "./public/assets/img/project", image_2.name));
    image_3.mv(path.resolve(__dirname, "./public/assets/img/project", image_3.name));
    image_4.mv(path.resolve(__dirname, "./public/assets/img/project", image_4.name));
    image_5.mv(path.resolve(__dirname, "./public/assets/img/project", image_5.name));
    image_6.mv(path.resolve(__dirname, "./public/assets/img/project", image_6.name));


    const newProject = new Project({
        ...req.body,
        image_1: `/assets/img/project/${image_1.name}`,
        image_2: `/assets/img/project/${image_2.name}`,
        image_3: `/assets/img/project/${image_3.name}`,
        image_4: `/assets/img/project/${image_4.name}`,
        image_5: `/assets/img/project/${image_5.name}`,
        image_6: `/assets/img/project/${image_6.name}`

    });

    console.log(req.body)
    newProject.save()
        .then((result) => {

            res.redirect("/addNewProject")
        }).catch((err) => {
            console.log(err);
        });
});
app.get("/admin", isLoggedIn, (req, res) => {
    res.render("admin")
});

app.get("/login", (req, res) => {
    res.render("login")
});
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"

    }), (req, res) => {

    });
app.get("/signup",isLoggedIn, (req, res) => {
    res.render("signup")
});
app.post("/signup",  (req, res) => {
    console.log(req.body)
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/signup")
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        })
    })
});
app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/")
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}



app.listen(PORT, () => console.log(`Example app listening on port port!`));


