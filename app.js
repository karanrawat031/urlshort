var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port    = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/fccurl');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


var urlSchema = new mongoose.Schema({
    url:String,
    hash:Number
});

var Url = mongoose.model('Url',urlSchema);

//landing route
app.get('/',function(req,res){
   res.redirect('/home');
});

//index route
app.get('/home',function(req,res){
   Url.find({},function(err,urls){
     if(err){
     	console.log(err);
     	console.log('Something Went OFF');
     }else{
       res.render('index',{urls:urls});
     }
   });	
});

//new route for adding url
app.get('/home/new',function(req,res){
  res.render('new');
});

function generate(){
   var num = Math.floor(100000 + Math.random() * 900000);
   return num.toString().substring(0, 4);
}

//create route for adding url in database
app.post('/home',function(req,res){
  var url = req.body.url;
  var hash = generate();
  Url.create({url:url,hash:hash},function(err,created){
    if(err){
      console.log(err);
      res.redirect('/home');
    }else{
      res.redirect('/home');
    }
  });
});

//route for redirecting hash variables to specific sites
app.get('/home/:hash',function(req,res){
  Url.findOne({hash:req.params.hash},function(err,found){
    if(err){
      console.log(err);
      res.redirect('back');
    }else{
      res.redirect(found.url);
    }
  });
});

app.listen(port);
console.log('The magic happens on port ' + port);


