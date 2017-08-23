var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var jwt = require('jsonwebtoken');


var Hottie = require('./models/hottie');
var User = require('./models/user');
var Pack = require('./models/pack');
var Sports= require('./models/sports');
var config = require('./config');

var app = express();
app.set('superSecret', config.superSecret);

mongoose.connect('mongodb://admin:admin@ds129183.mlab.com:29183/portablept',
{ useMongoClient: true });




// var hottie = new Hottie({
//     name: "Lệ rơi",
//     age: 24,
//     image: "http://cms.kienthuc.net.vn/uploaded/ngoclinh/2015_06_01/newfolder3/tai-san-sau-mot-nam-doi-doi-than-toc-cua-le-roi-hinh-11.jpg"
//   });
//
// hottie.save();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var apiRoutes = express.Router();


apiRoutes.post('/login', (req, res) => {
  var body = req.body;
  var username = body.phoneNumber; // hieu
  var password = body.password;

  User.findOne({phoneNumber: phoneNumber}, (err, user) => {
    if (err) {
      res.json({success: 0, message: "Database error, could not find user", err: err});
    } else {
      if (!user) {
        res.json({success: 0, message: "User not found" });
      } else {
        var hash = user.password;
        if (bcrypt.compareSync(password, hash)) {

          var token = jwt.sign(user, app.get('superSecret'), { expiresIn : 60*60*24 });

          res.json({success: 1, message: "Login OK", token: token });
        } else {
          res.json({success: 0, message: "Invalid password"});
        }
      }
    }
  });
});


apiRoutes.post('/add-pack', function(req, res) {
  var body = req.body;
  var phoneNumber = body.phoneNumber;
  var purpose= body.purpose;
  var packName=body.packName;
  var coach=body.coach;
  var price=body.price;
  var duration=body.duration;
  var packImgUrl=body.packImgUrl;
  var address=body.address;

  var savePack = function( phoneNumber,purpose,packName,coach,price,duration,packImgUrl,address) {
  var pack = new Pack({
    phoneNumber:phoneNumber,
    purpose:purpose,
    packName:packName,
    coach:coach,
    price:price,
    duration:duration,
    packImgUrl:packImgUrl,
    address:address

  });

  pack.save(function(err, savePack) {
    if (err) {
      res.json({
        success: 0,
        message: 'Saved data failed'
      });
    } else {
      res.json({
        success: 1,
        message: 'Saved data OK',
        data: _.pick(savePack, ['phoneNumber', 'id'])
      });
    }
  });
  };

  Pack.findOne({packName: packName,phoneNumber:phoneNumber}, function(err, user) {
    if (err) {
      res.json({success: 0, message: "Database error, could not find pack"});
    } else {
      if(user) {
        res.json({success: 0, message: "Register failed, duplicate Pack"});
      } else {
        savePack(phoneNumber,purpose,packName,coach,price,duration,packImgUrl,address);
      }
    }
  });
});

apiRoutes.get('/get-pack-add/:searchString',function(req, res){
  Pack.find({purpose:req.params.searchString},function(err,user){
    if (err) {
      res.json({success: 0, message: "Database error, could not find pack"});
    } else {
        res.send(user);
      }
  });

});
apiRoutes.get('/get-pack-all',function(req, res){
  Pack.find({},function(err,user){
    if (err) {
      res.json({success: 0, message: "Database error, could not find pack"});
    } else {
        res.send(user);
      }
  });

});


apiRoutes.get('/search-pack-coach/:searchString',function(req, res){
  Pack.find({ 

       $or: [{phoneNumber: { $regex: new RegExp( req.params.searchString, 'i' ) }},
        {coach: { $regex: new RegExp( req.params.searchString, 'i' ) }},
        {packName: { $regex: new RegExp( req.params.searchString, 'i' ) }},
        {price: { $regex: new RegExp( req.params.searchString, 'i' ) }}]
 
  },function(err,pack){
    if (err) {
      res.json({success: 0, message: "Database error, could not find user"});
    } else {
      User.find({ 
          $and:[
                {$or: [
                  {phoneNumber: { $regex: new RegExp( req.params.searchString, 'i' ) }}, 
                  {name: { $regex: new RegExp( req.params.searchString, 'i' ) }},
                  {packName: { $regex: new RegExp( req.params.searchString, 'i' ) }},
                  {price: { $regex: new RegExp( req.params.searchString, 'i' ) }}
                    ]},
                {role: "HLV"}
              ]
          }
          ,function(err,users){
        if (err) {
          res.json({success: 0, message: "Database error, could not find pack"});
        } else {
            res.json({
              pack, 
              users: users.map(function(user, index){
                return _.pick(user, ["_id", "name","phoneNumber","email","role"]);
              })
            });
          }
      });
      }
  });

});



apiRoutes.post('/add-sports', function(req, res) {
  var body = req.body;
  var sportsImgUrl = body.sportsImgUrl;
  var sportsName= body.sportsName;

  var saveSports = function( sportsImgUrl,sportsName) {
  var sports = new Sports({
    sportsImgUrl:sportsImgUrl,
    sportsName:sportsName
  });

  sports.save(function(err, saveSports) {
    if (err) {
      res.json({
        success: 0,
        message: 'Saved data failed'
      });
    } else {
      res.json({
        success: 1,
        message: 'Saved data OK',
        data: _.pick(saveSports, ['sportsName', 'id'])
      });
    }
  });
  };

  Sports.findOne({sportsName: sportsName}, function(err, user) {
    if (err) {
      res.json({success: 0, message: "Database error, could not find  Sports"});
    } else {
      if(user) {
        res.json({success: 0, message: "Register failed, duplicate Sports"});
      } else {
        saveSports(sportsImgUrl,sportsName);
      }
    }
  });
});
apiRoutes.get('/get-sports',function(req, res){
  Sports.find({},function(err,user){
    if (err) {
      res.json({success: 0, message: "Database error, could not find Sports"});
    } else {
        res.send(user);
      }
  });
});



apiRoutes.post('/register', function(req, res) {
  var body = req.body;
  var password = body.password;
  var id= body.id;
  var imgAvata=body.imgAvata;
  var email= body.email;
  var gender= body.gender;
  var birthday=body.birthday;
  var location=body.location;
  var phoneNumber = body.phoneNumber;
  var role = body.role;
  var name=body.name;


  var saveUser = function( password,id,imgAvata,firstName,lastName,email,gender,birthday,location,phoneNumber,role,name) {
  var user = new User({
    password: bcrypt.hashSync(password, 10), // TODO
    id:id,
    imgAvata: imgAvata,
    email: email,
    gender: gender,
    birthday: birthday,
    location:location,
    phoneNumber: phoneNumber,
    role:role,
    name:name
  });

  user.save(function(err, saveUser) {
    if (err) {
      res.json({
        success: 0,
        message: 'Saved data failed'
      });
    } else {
      res.json({
        success: 1,
        message: 'Saved data OK',
        data: _.pick(saveUser, ['phoneNumber', '_id', '__v'])
      });
    }
  });
  };

  User.findOne({phoneNumber: phoneNumber}, function(err, user) {
    if (err) {
      res.json({success: 0, message: "Database error, could not find user"});
    } else {
      if(user) {
        res.json({success: 0, message: "Register failed, duplicate user"});
      } else {
        saveUser( password,id,imgAvata,firstName,lastName,email,gender,birthday,location,phoneNumber,role,name);
      }
    }
  });
});

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    res.json({success: 0, message: "Token not provided deo"});
  } else {
    jwt.verify(token, app.get('superSecret'), function(err, decodedUser) {
        if (err) {
          res.json({success: 0, message: "Could not understand  token", err: err});
        } else {
          req.user = decodedUser;
          next();
        }
    })
  }
});
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/api/testhash', function(req, res) {
  var hash = bcrypt.hashSync('hieuhuhong', 10);
  res.json();
});

app.post('/api/testhash', function(req, res) {
  var password = req.body.password;
  var hash = bcrypt.hashSync('hieuhuhong', 10);

  var result = bcrypt.compareSync(password, hash);

  if (result) {
    res.json({message : "Ahihi"});
  } else {
    res.json({message : "Đi chỗ khác chơi"});
  }
});






apiRoutes.get('/api', function(req, res) {
  res.json({ 'hello': 'world' });
});

apiRoutes.get('/gxtg', function(req, res) {
  var user = req.user;
  Hottie.find(function(err, hotties) {
    if (err) {
      res.json({ success: 0, message: 'Could not get data from mlab' });
    } else {
      res.json(hotties);
    }
  });
});

apiRoutes.post('/gxtg', function(req, res) {
  var body = req.body;

  var name = body.name;
  var age = body.age;
  var image = body.image;

  var hottie = new Hottie({
      name: name,
      age: age,
      image: image
  });

  hottie.save(function(err, addedHottie){
    if (err) {
      res.json({ success: 0, message: 'Could not add record ' + err });
    } else {
      res.json(addedHottie);
    }
  });
});

app.use('/api', apiRoutes);

app.listen(app.get('port'), function() {

  console.log('Node app is running on port', app.get('port'));
});
