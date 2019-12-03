const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 9000;


http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);

  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  let pathname = path.join(__dirname, sanitizePath);

  fs.stat(pathname, function(err, stat) {
    if(err == null)
    {  
      if(!stat.isFile())
	  {
           
            fs.readdir(pathname,function(err1,files){ 
              if(err1 == null)
              { 
                files.forEach(function(file){
                    var curPath = pathname + "\\" + file;
                    fs.unlink(curPath, function (err2) {
                    if(err2 == null)
                    {
                        console.log('File Delete');
                        fs.rmdir(pathname, function (err3) { 
                          if (err3==null) {
                            console.log('Directorio Borrado');
                          } else if(err3.code == 'ENOENT') {
                            // file does not exist
                           console.log('No Existe ', err3.code);
                          } else {
                                console.log('Some other error: ', err3.code);
                          } 
                          
                        });
                    } else if(err2.code == 'ENOENT') {
                        console.log('No Existe ', err2.code);
                    } else {
                         console.log('Some other error: ', err2.code);
                    }
                    });  
                });
                if (files.length==0)
                {
                  fs.rmdir(pathname, function (err3) {
                    if (err3==null) {
                      console.log('Directorio Borrado');
                    } else if(err3.code == 'ENOENT') {
                      // file does not exist
                     console.log('No Existe ', err3.code);
                    } else {
                          console.log('Some other error: ', err3.code);
                    }    
                  });

                }
              } else if(err1.code == 'ENOENT') {
                      // file does not exist
                     console.log('No Existe ', err1.code);
              } else {
                    console.log('Some other error: ', err1.code);
              } 

            
            });

      }
	  else
	  {
	                var curPath = pathname;
                    fs.unlink(curPath, function (err2) {
                    if(err2 == null)
                    {
                        console.log('File Delete');
                  
                    } else if(err2.code == 'ENOENT') {
                        console.log('No Existe ', err2.code);
                    } else {
                         console.log('Some other error: ', err2.code);
                    }
                    });   
	
	  
	  }
    } else if(err.code == 'ENOENT') {
        // file does not exist
       console.log('No Existe ', err.code);
    } else {
        console.log('Some other error: ', err.code);
    }
 
  });  
 

}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);