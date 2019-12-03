var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
app.use(cors())
var fs=require('fs')


<<<<<<< HEAD

=======
app.use(express.static('src'));
>>>>>>> 2612c23c0459c228666e70167540712941074266



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var name = req.headers.path
    console.log(req.headers.path)
<<<<<<< HEAD
    fs.mkdir(name, ()=> {
       
=======
    console.log(file.originalname) 
    fs.mkdir(name, ()=> {
>>>>>>> 2612c23c0459c228666e70167540712941074266
            cb(null, name);
    });
},
    filename: function (req, file, cb) {
<<<<<<< HEAD
      cb(null, file.originalname)
=======
      cb(null, file.originalname.replace(/\s+/g,"_"))
>>>>>>> 2612c23c0459c228666e70167540712941074266
    }
  })
  
  var upload = multer({ storage: storage }).array('file')
  
app.get('/',function(req,res){
    return res.send('Hello Server')
})
app.post('/upload',function(req, res) {
    
    upload(req, res, function (err) {

      
     
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
            return res.status(500).json(err)
          // An unknown error occurred when uploading.
        } 
        
<<<<<<< HEAD
        return res.status(200).send(req.file)
=======
        return res.status(200).send(req.file) 
>>>>>>> 2612c23c0459c228666e70167540712941074266
        // Everything went fine.
      })
});

<<<<<<< HEAD
=======



>>>>>>> 2612c23c0459c228666e70167540712941074266
app.listen(8000, function() {
    console.log('App running on port 8000: ');
});