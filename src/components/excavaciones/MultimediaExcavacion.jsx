import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';


var rutaVideo="";
var idExc= "";
var urlPage="http://museoconsulta.fi.uncoma.edu.ar"

var removeItemFromArr = ( arr, item ) => {

  return arr.filter( e => e._id !== item);
};

var removeItemFromArr2 = ( arr, item ) => {

  return arr.filter( e => e !== item);
};

class MultimediaExcavacion extends Component {

    constructor(props) {
        super(props);

        this.state = {
                 nombreE:"",
                 codigo:"",
                 imagenes:[],
                 videos:[],
                 listImagen: [],
                 listVideo: [],
                 nombre:'',
                 nombreVideo:'',
                 descripcion:'',
                 selectedFile: null,
                 selectedFileVideo: null,
                 foto:"",
                 video:""
        }
        this.deleteImage = this.deleteImage.bind(this);
        this.deleteVideo = this.deleteVideo.bind(this);
		this.reemplazar = this.reemplazar.bind(this);
      
      }

  //una vez cargado en el DOM
componentDidMount() {
    
    fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/'+this.props.match.params.id)
    .then((response) => {
        return response.json()
      })
      .then((excavacions) => {
		  
		    rutaVideo='/images/excavaciones/'+this.props.match.params.id;
            idExc= this.props.match.params.id
        

          this.setState({ nombreE: excavacions.excavacionId.nombre,
                          codigo:excavacions.excavacionId.codigo,
                          imagenes: excavacions.excavacionId.fotosExcavacion,
                          listImagen:excavacions.excavacionId.fotosExcavacion,
                          videos: excavacions.excavacionId.videosExcavacion,
                          listVideo:excavacions.excavacionId.videosExcavacion
                          
                        })
             //console.log("Imagenes:",this.state.listImagen)
      });

      

      

  }

   // Función que captura el valor de los inputs
  // para setearlo en su respectivo estado
  // Para este caso: tour, pax y price
  handleFileChange = event => {
     // console.log("ARCH:",event.target.files[0])

    const { target } = event;
    const { name, value } = target;

    this.setState({
      [name]: value,
      selectedFile: event.target.files[0],
      loaded: 0,
      foto: event.target.value
    });
  };

  //para el video
   handleFileVideoChange = event => {
     // console.log("ARCH:",event.target.files[0])

    const { target } = event;
    const { name, value } = target;

    this.setState({
      [name]: value,
      selectedFileVideo: event.target.files[0],
      loaded: 0,
      video: event.target.value
    });
  };


  handleInputChange = evt => {
        this.setState({descripcion: evt.target.value });
      };

  // Esta función se ejecutará al momento de darle click al botón de "Agregar"
  handleImagenSubmit = event => {
    const { nombre, descripcion, listImagen } = this.state;

     // console.log('File:',nombre);
    //  console.log('Param:', this.props.match.params.id)
    
    // Simple validación para que los campos sean campos requeridos
    if (nombre && descripcion) {
      const id = listImagen.length + 1;
      // En los states se agrega un nuevo objeto a "list"
      // y se reinicia el estado de tour, pax y price
      this.setState({
        listImagen: [...listImagen, {id,  nombre, descripcion }],
        nombre: '',
        descripcion: ''
      });

      //subir archivo al server (IMAGEN)
      //------------------------------------------------------------------------------------------------
   
        const destino= "/var/www/consulta/html/assets/datos/excavaciones/"+this.props.match.params.id
		const data1 = new FormData() 
		data1.append('file',this.state.selectedFile)
								
		axios.post("http://museo.fi.uncoma.edu.ar:3006/api/uploadArchivo", data1, {
				    headers: {
									"Content-Type": undefined,
									path: destino,
									"newfilename": ''
							}
					})
			 .then(response => {
									return response;
						})
			.catch(error => {
								  console.log(error);
								});			

      //------------------------------------------------------------------------------------------------
        //ACTUALIZO TABLA EXCAVACIONES (ARRAY FOTOS)
		
		var imagenesList= this.state.imagenes
		var imageURL="/assets/datos/excavaciones/"+this.props.match.params.id;

        var imagenUp1= this.state.nombre.replace("C:\\fakepath\\", "\\").replace(/\s+/g,"_")
		imagenUp1= this.reemplazar(imagenUp1);
		
		var imagenUp2=this.state.nombre.replace("C:\\fakepath\\", "/").replace(/\s+/g,"_")
		imagenUp2= this.reemplazar(imagenUp2)
		
        var datosImg= {
                    nombre:imagenUp1,
                    descripcion: this.state.descripcion, 
                    url:imageURL+imagenUp2  
               }
         
        imagenesList.push(datosImg)

        var data = {
               fotosExcavacion: imagenesList
        }
        
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion/'+this.props.match.params.id, {
          method: 'put',
          body: JSON.stringify(data),
          headers:{
                    'Content-Type': 'application/json'
                  }      
          })
          .then(function(response) {
            if(response.ok) {
              console.log("¡Se actualizó la Excavacion con Éxito!");
			  window.location.reload()
            } 
          })
          .catch(function(error) {
            alert("Error al guardar. Intente nuevamente.");
            console.log('Hubo un problema con la petición Fetch:' + error.message);
          });




    } else {
      // Si alguno de los inputs se encuentra vacio
      // se mostrará el siguiente mensaje en la consola del navegador
      alert('Por favor, complete todos los campos.');
    }

    // Para que no se refresque la página por el onSubmit del formulario
    event.preventDefault();
  };

  // Esta función se ejecutará al momento de darle click al botón de "Agregar"
  handleVideoSubmit = event => {
    const { nombreVideo, listVideo } = this.state;
    
    // Simple validación para que los campos sean campos requeridos
    if (nombreVideo) {
      const id = listVideo.length + 1;
      // En los states se agrega un nuevo objeto a "list"
      // y se reinicia el estado de tour, pax y price
      this.setState({
        listVideo: [...listVideo,  nombreVideo ],
        nombreVideo: ''
      });

      //subir archivo (video) al server 

      //------------------------------------------------------------------------------------------------
            const destino= "/var/www/consulta/html/assets/datos/excavaciones/"+this.props.match.params.id  
   
            const data1 = new FormData() 
            data1.append('file',this.state.selectedFileVideo)
 
            axios.post("http://museo.fi.uncoma.edu.ar:3006/api/uploadArchivo", data1, {
				    headers: {
									"Content-Type": undefined,
									path: destino,
									"newfilename": ''
							}
					})
				.then(response => {
									return response;
						})
				.catch(error => {
								  console.log(error);
								});	 
					 
					 
					 

      //------------------------------------------------------------------------------------------------
        //ACTUALIZO TABLA EXCAVACIONES (ARRAY VIDEOS)

        var videosList= this.state.videos
       

        var videoSubir=this.state.nombreVideo.replace("C:\\fakepath\\", "\\").replace(/\s+/g,"_")    
        videoSubir= this.reemplazar(videoSubir)		
         
        videosList.push(videoSubir)

        var data = {
              videosExcavacion: videosList
        }
        
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion/'+this.props.match.params.id, {
          method: 'put',
          body: JSON.stringify(data),
          headers:{
                    'Content-Type': 'application/json'
                  }      
          })
          .then(function(response) {
            if(response.ok) {
              console.log("¡Se actualizó la Excavacion con Éxito!");
			  window.location.reload()
            } 
          })
          .catch(function(error) {
            alert("Error al guardar. Intente nuevamente.");
            console.log('Hubo un problema con la petición Fetch:' + error.message);
          });




    } else {
      // Si alguno de los inputs se encuentra vacio
      // se mostrará el siguiente mensaje en la consola del navegador
      alert('Por favor, complete todos los campos.');
    }

    // Para que no se refresque la página por el onSubmit del formulario
    event.preventDefault();
  };

    

 render() 
 {
     const { nombre,descripcion, listImagen } = this.state;
     const { nombreVideo, listVideo } = this.state;

   



     var i=0
     var j=0

        return(
           <>
            <div>
			<br/>
			<ToastContainer
                        position="top-right"
                        autoClose={5000}
                        transition={Slide}
                        hideProgressBar={true}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnHover
                        />  
                <div className="row">
                  <div className="col-md-12">
                        <div id="contenido" align="left" className="container">
                            <h3 className="page-header" align="left"><i class="fa fa-desktop" aria-hidden="true"></i>  Archivos Multimedia </h3> 
                            <h3 className="page-header" align="left"><i class="fa fa-compass" aria-hidden="true"></i>  Excavación: {this.state.nombreE}  ({this.state.codigo}) </h3> 
                            <hr/>
                             <fieldset>
                                <form id="formImages" onSubmit={this.handleImagenSubmit} className="form-horizontal" > 
             <fieldset>
             <h5 className="page-header" align="left"><i class="fa fa fa-file-image-o" aria-hidden="true"></i>  Imágenes </h5>
             <hr/>
              <div className="input-group">
                  <div className="col-sm-4">
                      <label htmlFor="nombre">Archivo:</label>
                      <input  type="file"  
                              id="nombre" 
                              name="nombre" 
                              className="form-control-file"  
                              onChange={this.handleFileChange} 
                              value={nombre} 
                              accept="image/*"/>
                  </div>

                  <div className="col-sm-8">
                      <label htmlFor="descripcion">Descripción Imagen:</label>
                      <input type="text"  
                            id="descripcion" 
                            name="descripcion"  
                            onChange={this.handleInputChange} 
                            value={descripcion}
                            className="form-control"  />
                  </div>

                

              </div>
              <br/>
              <div className="input-group" >
                  <div className="col-sm-6">
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit" >
                    <span className="fa fa-file-image-o"></span> Subir Imagen </button>
                  </div>
              </div>

              <br/>

              <div className="form-group">
                  <div className="col-sm-12">
                    <div className="table-responsive">
                            <table className="table table-bordered table-hover list">
                              <thead className="thead-dark">
                                  <tr>   
                                      <th>Orden</th>            
                                      <th>Archivo</th>
                                      <th>Descripción</th>
                                      <th>Acción</th>
                                  </tr>
                              </thead>
                              <tbody>
                                
                                  {listImagen.map(item => (
                                      <tr key={i}>
                                      <td> {i=i+1} </td>
                                      <td>{item.nombre.replace("C:\\fakepath\\", "\\").replace(/\s+/g,"_")}</td>
                                      <td>{item.descripcion}</td>
                                      <td>
                                        <button type="button" id="elimImagen" onClick={()=>this.deleteImage(item._id, item.nombre)} title="Eliminar Imagen" className="btn btn-outline-danger my-2 my-sm-0"><span className="fa fa-trash" title="Eliminar"></span></button>
                                        &nbsp;&nbsp;
                                        <a href={"#myModal"+i} role="button" title="Ver Imagen" className="btn btn-outline-warning my-2 my-sm-0" 
                                                   data-toggle="modal"><span className="fa fa-eye"></span></a>

                                        <div id={"myModal"+i} className="modal fade" role="dialog">  
                                          <div className="modal-dialog ">
                                              <div className="modal-content">      
                                                  <div className="modal-header">        
                                                            
                                                      <h4 className="modal-title">Foto</h4>      
                                                  </div>      
                                                  <div className="modal-body"><img src={urlPage+item.url} className="img-rounded" alt="Foto" width="400" height="400" />   </div>      
                                                  <div className="modal-footer">        
                                                      <button type="button" className="btn btn-default" data-dismiss="modal">Cerrar</button>     
                                                  </div>  
                                              </div>  
                                          </div>
                                          </div>  
                                      </td>

                                       
                                      </tr>

                                      
                                  ))}
                                      
                            
                                  </tbody>   
                              </table> 
                    </div>
                  </div>
              </div>   

             
              

            </fieldset>
            </form>
                                <br/>
                                <hr/>


          <form id="formVideos" onSubmit={this.handleVideoSubmit} className="form-horizontal" > 
             <fieldset>
             <h5 className="page-header" align="left"><i class="fa fa fa-file-video-o" aria-hidden="true"></i>  Videos </h5>
             <hr/>
              <div className="input-group">
                  <div className="col-sm-6">
                      <label htmlFor="nombreVideo">Archivo:</label>
                      <input  type="file"  
                              id="nombreVideo" 
                              name="nombreVideo" 
                              className="form-control-file"  
                              onChange={this.handleFileVideoChange} 
                              value={nombreVideo} 
                              accept="video/*"/>
                  </div>

                 

              </div>
              <br/>
              <div className="input-group" >
                  <div className="col-sm-6">
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit" >
                    <span className="fa fa-file-video-o"></span> Subir Video </button>
                  </div>
              </div>

              <br/>

              <div className="form-group">
                  <div className="col-sm-12">
                    <div className="table-responsive">
                            <table className="table table-bordered table-hover list">
                              <thead className="thead-dark">
                                  <tr>   
                                      <th>Orden</th>            
                                      <th>Archivo</th>
                                      <th>Acción</th>
                                  </tr>
                              </thead>
                              <tbody>
                                
                                  {listVideo.map(item => (
                                      <tr key={j}>
                                        <td> {j=j+1} </td>
                                        <td>{item.replace("C:\\fakepath\\", "\\").replace(/\s+/g,"_")}</td>
                                        <td>
										    <button  id="elimVideo" type="button" onClick={()=>this.deleteVideo(idExc,item.replace("C:\\fakepath\\", "\\").replace(/\s+/g,"_"))} title="Eliminar Video" className="btn btn-outline-danger my-2 my-sm-0"><span className="fa fa-trash" title="Eliminar"></span></button>
												{/* &nbsp;&nbsp;
                                        <a href={"#myModalv"+j} role="button" title="Ver Video" className="btn btn-outline-warning my-2 my-sm-0" 
                                                   data-toggle="modal"><span className="fa fa-eye"></span></a>

                                          <div id={"myModalv"+j} className="modal fade" role="dialog" >  
                                            <div className="modal-dialog modal-lg" >
                                                <div className="modal-content" >      
                                                    <div className="modal-header">        
                                                              
                                                        <h4 className="modal-title">Video</h4>      
                                                    </div>      
                                                    <div className="modal-body">
                                                      
                                                      <video id={"myVideo"+j} src={rutaVideo+item} width="640" height="360" controls preload="auto"> </video>  
                              
                                                    </div>      
                                                    <div className="modal-footer">        
                                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={()=>this.cerrarVideo(j)}>Cerrar</button>     
                                                    </div>  
                                                </div>  
                                            </div>
										</div>   */}
                                        
                                        </td>
                                      </tr>

                                      
                                  ))}
                                      
                            
                                  </tbody>   
                              </table> 
                    </div>
                  </div>
              </div>   

             
              

            </fieldset>
            </form>
                               
                               
                               
                                <br/>
                            
                            <div className="form-group">
                                    <div className="col-sm-6">
	
                                                <a className="btn btn-outline-secondary my-2 my-sm-0" 
                                                href="/excavaciones"><span className="fa fa-level-up"></span> Volver</a>
                                    </div>
                            </div>
                             </fieldset>  
                        </div>
                    </div>
                </div>              
            </div>
        </>
        )

 }


   deleteVideo(id, nombre)
   {  
   
     if(window.confirm('Esta seguro de eliminar el video seleccionado?'))
	{
      var videoLista=[]
      var idExcavacion=""
      var name=nombre.replace("\\","/")


        axios.get("http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/"+id)
        .then(response => {

                       videoLista=response.data.excavacionId.videosExcavacion   
                       idExcavacion=response.data.excavacionId._id
                       var videosFinal=removeItemFromArr2(videoLista,nombre)

                      var data1 = {
                        "videosExcavacion": videosFinal
                      }

                      axios.put("http://museo.fi.uncoma.edu.ar:3006/api/excavacion/"+idExcavacion, data1, {
                        headers:{
                          'Content-Type': 'application/json'
                        }   
                      }).then(response => {
    
                                   const destino="/var/www/consulta/html/assets/datos/excavaciones/"+idExcavacion+name
									 
                               		  fetch('http://museo.fi.uncoma.edu.ar:3006/api/deleteArchivo', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
									  .then(function(response) {
										  if(response.ok) {
											  toast.success('Se elimino el archivo con exito.');
											  window.location.reload()
										  } 
									  })
									  .catch(function(error) {
										  toast.error("Error al eliminar. Intente nuevamente.");
										  console.log('Hubo un problema con la petición Fetch:', error.message);
									  });  
							
							
                        })
                      .catch(function(error) {
                        toast.error("Error al eliminar. Intente nuevamente.");
                        console.log('Hubo un problema con la petición Fetch:', error.message);
                      });
                          
              })
         .catch(error => {
			             toast.error("Error al eliminar. Intente nuevamente.");
                          console.log(error);
                        });
   
      
      var temp = this.state.listVideo.filter((el)=>el !== nombre);
      this.setState({
                    listVideo: temp
      })                   
     
	}
   }

   cerrarVideo(x)
   {
      
    for(var i = 1; i <= x; i++)
    {
      var mediaElement = document.getElementById("myVideo"+i);
      if(mediaElement!=null)
      {
        mediaElement.pause();
        //mediaElement.src = "";
      }

    } 
    

   }

  deleteImage(cod, name) {
       
	if(window.confirm('Esta seguro de eliminar la imagen seleccioanada?'))
	{	  
        var imageLista=[]
        var idExcavacion=""
        name=name.replace("\\","/")
       
        axios.get("http://museo.fi.uncoma.edu.ar:3006/api/excavacionPorFoto/"+cod)
        .then(response => {
                       
                       imageLista=response.data.excavacion.fotosExcavacion   
                       idExcavacion=response.data.excavacion._id
                       var fotosFinal=removeItemFromArr(imageLista,cod)

                      var data1 = {
                        "fotosExcavacion": fotosFinal
                      }

                      axios.put("http://museo.fi.uncoma.edu.ar:3006/api/excavacion/"+idExcavacion, data1, {
                        headers:{
                          'Content-Type': 'application/json'
                        }   
                      }).then(response => {
						  
						     const destino="/var/www/consulta/html/assets/datos/excavaciones/"+idExcavacion+name
									 
                               		  fetch('http://museo.fi.uncoma.edu.ar:3006/api/deleteArchivo', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
									  .then(function(response) {
										  if(response.ok) {
											  toast.success('Se elimino el archivo con exito.');
										  } 
									  })
									  .catch(function(error) {
										  toast.error("Error al eliminar. Intente nuevamente.");
										  console.log('Hubo un problema con la petición Fetch:' + error.message);
									  });   
    
             
                        })
                      .catch(function(error) {
                        toast.error("Error al actualiza excavacion. Intente nuevamente.");
                        console.log('Hubo un problema con la petición Fetch:' + error.message);
                      });
                          
              })
         .catch(error => {
                          console.log(error);
                        });
   


        var temp = this.state.listImagen.filter((el)=>el._id !== cod);
        this.setState({
          listImagen: temp
        })
	}	
    }  
	
reemplazar(cadena)
{

	var chars={

		"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",

		"à":"a", "è":"e", "ì":"i", "ò":"o", "ù":"u", "ñ":"n",

		"Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U",

		"À":"A", "È":"E", "Ì":"I", "Ò":"O", "Ù":"U", "Ñ":"N", 
		
		"ä": "a", "ë": "e", "ï": "i", "ö": "o", "ü": "u", 
        
		"Ä": "A", "Ä": "A", "Ë": "E","Ï":"I","Ö": "O", "Ü": "U" }

	var expr=/[áàéèíìóòúùñäëïöü]/ig;

	var res=cadena.replace(expr,function(e){return chars[e]});

	return res;

}



}

export default MultimediaExcavacion;
