import React from "react";
import { Form, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faUser, faImage} from '@fortawesome/free-solid-svg-icons'
import { Link, withRouter} from 'react-router-dom';
import Moment from 'moment';
import axios from 'axios';
import Image from 'react-bootstrap/Image'
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();


var Imagen=""
var urlImagen="http://museoconsulta.fi.uncoma.edu.ar"
class EditPersona extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
                          nombre: "",
                          apellido: "",
                          nroDoc:"",
                          finicio: '',
                          fbaja:null,
                          motivo:" ",
                          selectedOption:null,
                          titulos:"",
                          foto:"",
                          everFocusedNombre: false,
                          everFocusedApellido: false,
                          everFocusedNroDoc: false,
                          inFocus: "",
                          selectedFile: null, 
                          oldFile: "",
                          validated: false,
						  show: false,
						  extFoto: ''
               }
      this.reemplazar = this.reemplazar.bind(this);        
    } 
	
  

 
    
    componentDidMount(){

      if(!cookies.get('username') && !cookies.get('password'))
      {
          window.location.href='/';
      }
      else
      {

       var feBaja=null;
       fetch('http://museo.fi.uncoma.edu.ar:3006/api/personaId/'+this.props.match.params.id)
	   .then(res => res.json())
      .then(
        (response) => {
			console.log(response)
             feBaja=response.personaId.fechaBaja
              if(feBaja!=null)
              {
                  feBaja=(Moment(response.personaId.fechaBaja).add(1, 'days')).format('YYYY-MM-DD');
              }
			  
			  Imagen=urlImagen+"/assets/datos/personal/fotosPersonal"+response.personaId.foto;
			  
			  
			  
			 this.setState({ 
                    nombre: response.personaId.nombres,
					apellido: response.personaId.apellidos,
                    nroDoc: response.personaId.dni,
					finicio: (Moment(response.personaId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
                    fbaja:feBaja,
                    motivo: response.personaId.motivoBaja,
                    titulos: response.personaId.titulos,
                    foto: response.personaId.foto,
					oldFile: response.personaId.foto
					
			 });
          
        }) .catch(error=>{
             console.log("Error:",  error.message)
         });

      }
    } 

      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };
    
      handleApellidoChange = evt => {
        this.setState({ apellido: evt.target.value });
      };
    
      handleNroDocChange = evt => {
       // this.cambioNumero(evt.target.value);
        this.setState({ nroDoc: evt.target.value });
      };
    
      handleFinicioChange = evt => {
        this.setState({ finicio: evt.target.value });
      };
    
      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivo: evt.target.value });
      };

      handleFotoChange = event => {
        console.log(event.target.files[0]);
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
          foto: event.target.value
        });
      };
    
    
      handleTituloChange = evt => {
        this.setState({ titulos: evt.target.value });
      };    handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };
    
      handleApellidoChange = evt => {
        this.setState({ apellido: evt.target.value });
      };
    
      handleNroDocChange = evt => {
       // this.cambioNumero(evt.target.value);
        this.setState({ nroDoc: evt.target.value });
      };
    
      handleFinicioChange = evt => {
        this.setState({ finicio: evt.target.value });
      };
    
      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivo: evt.target.value });
      };

      handleFotoChange = event => {
		 const name = event.target.files[0].name;
         const lastDot = name.lastIndexOf('.');
         const ext = name.substring(lastDot + 1); 
		 
       // console.log('Extensión:', ext)		 
		  
        //console.log(event.target.files[0]);
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
          foto: event.target.value,
		  extFoto: ext
        });
      };
    
    
      handleTituloChange = evt => {
        this.setState({ titulos: evt.target.value });
      };
	  
	  
	 handleClose = evt => {
        this.setState({ show: false });
      };
	  
	  handleShow = evt => {
        this.setState({ show: true });
      };


    handleSubmit = evt => {
       var dniPersona=""      
      const form = evt.currentTarget;
      evt.preventDefault();
      if (form.checkValidity() === false) {
        evt.stopPropagation();
      }
      else
      { 
         
          evt.preventDefault();
             
             // var photo = this.state.foto.replace("C:\\fakepath\\", "\\");
			   //     photo= photo.replace(/\s+/g, "_");
			    //    photo= this.reemplazar(photo);
			 var photo="";
			 if(this.state.selectedFile!==null){
                   photo =	'\\'+this.state.nroDoc+'.'+this.state.extFoto
			 } 
			 else
			 {
				 photo= this.state.oldFile
			 }
              var data = {
                    "nombres": this.state.nombre,
                    "apellidos": this.state.apellido,
                    "dni": this.state.nroDoc,
                    "fechaInicio": this.state.finicio,
                    "titulos": this.state.titulos, 
                    "foto": photo,
                    "fechaBaja": this.state.fbaja, 
                    "motivoBaja": this.state.motivo
                 };
              
			    dniPersona=this.state.nroDoc
			  
                //Guardo la info en BD
				  fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona/'+this.props.match.params.id, {
                    method: 'put',
                    body: JSON.stringify(data),
                    headers:{
                              'Content-Type': 'application/json'
                            }      
                    })
					.then(function(response) {
					  if (response.ok) {
						console.log("¡Se guardó la Persona con Éxito!");
						return response.json();
					  }
					})
          .then(function(data) {
						
				      if(this.state.selectedFile!==null)
				      { //IF 1   
						//subo archivo si se selecciono uno
                        const destino = "/var/www/consulta/html/assets/datos/personal/fotosPersonal" ;
                        const data1 = new FormData() 
                        data1.append('file',this.state.selectedFile)
						
                        
                        axios.post("http://museo.fi.uncoma.edu.ar:3006/api/uploadArchivo", data1, {
                          headers: {
                          "Content-Type": undefined,
                          "path": destino,
						  "newfilename": dniPersona
                          }
                          })
                          .then(response => {
                            return response;
                          })
                          .then (resp => {
							   toast.success("¡Se guardó la Persona con Éxito!");
								 setTimeout(() => {
								  window.location.replace('/personas');
								}, 1500);

                            
                          })
                          .catch(error => {
                            console.log(error);
                          });
							}//IF 1
							else
							{
							   toast.success("¡Se guardó la Persona con Éxito!");
								 setTimeout(() => {
								  window.location.replace('/personas');
								}, 1500);
							}
								
						
                    
                    }.bind(this))
                    .catch(function(error) {
                      toast.error("Error al guardar. Intente nuevamente.");
                      console.log('Hubo un problema con la petición Fetch:' + error.message);
                    });
              
              return;
        }
        this.setState({ validated: true });
       
      };   
    
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
   

  render()
  {
      const {validated} = this.state;   
      return(
          <>
              <Menu />
              <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faUser} /> EditarPersona
                    </h3>
                    <hr />

                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        transition={Slide}
                        hideProgressBar={true}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnHover
                        />     

                        <Form.Row >
                            <Form.Group className="col-sm-4" controlId="apellido">
                                <Form.Label>Apellido:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Apellido" required onChange={this.handleApellidoChange} value={this.state.apellido}/>
                                <Form.Control.Feedback type="invalid">
                                   Por favor, ingrese Apellido.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="nombre">
                              <Form.Label>Nombres:</Form.Label>
                              <Form.Control type="text" placeholder="Ingrese Nombres" required onChange={this.handleNombreChange} value={this.state.nombre} />
                              <Form.Control.Feedback type="invalid">
                              Por favor, ingrese Nombres.
                              </Form.Control.Feedback>
                           </Form.Group>
                           
                           <Form.Group className="col-sm-4" controlId="nroDoc">
                                    <Form.Label>Nro. Documento:</Form.Label>
                                    <Form.Control type="number" placeholder="DNI" required onChange={this.handleNroDocChange} value={this.state.nroDoc}  disabled/>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, ingrese DNI.
                                    </Form.Control.Feedback>
                            </Form.Group>

                        </Form.Row>   

                        <Form.Row >
                            <Form.Group className="col-sm-4" controlId="finicio">
                                    <Form.Label>Fecha Inicio:</Form.Label>
                                    <Form.Control type="date"   value={this.state.finicio} onChange={this.handleFinicioChange}/>
                                
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="fbaja">
                                    <Form.Label>Fecha Baja:</Form.Label>
                                    <Form.Control type="date"  value={this.state.fbaja} onChange={this.handleFbajaChange}/>
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="motivo">
                                    <Form.Label>Motivo Baja:</Form.Label>
                                    <Form.Control as="textarea" rows={3}  value={this.state.motivo} onChange={this.handleMotivoChange}/>
                            </Form.Group>

                        </Form.Row>

                        <Form.Row >
                            <Form.Group className="col-sm-12" controlId="titulo">
                                <Form.Label>Título(s):</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Título(s)" onChange={this.handleTituloChange} value={this.state.titulos}/>
                                
                            </Form.Group>
                        </Form.Row>
 
                        <Form.Row >
                           <Form.Group className="col-sm-12" controlId="foto">
                           <Form.File id="formcheck-api-regular">
                                <Form.File.Label>Foto:</Form.File.Label>
                                <Form.File.Input    accept="image/*"
                                                    onChange={this.handleFotoChange}/>
								<br/>
								 <p style={{color:'#007bff'}}>Archivo Actual: {this.state.foto}</p>					
                           </Form.File>
                           </Form.Group>
                        </Form.Row>
						
						
						<Form.Row >
                           <Form.Group className="col-sm-6" controlId="btnFoto">
                               <Button variant="success" onClick={this.handleShow}>
								   <FontAwesomeIcon icon={faImage} /> Abrir Foto
							  </Button>
                           </Form.Group>
                        </Form.Row>


                   <hr/>
               
                <Form.Row> 
                    <Form.Group className="mx-sm-3 mb-2">
                              <Button variant="primary" type="submit" id="guardar">
                              <FontAwesomeIcon icon={faSave} /> Guardar
                              </Button>
                              &nbsp;&nbsp;
                             <Link to='/personas'>
                              <Button variant="secondary" type="button" id="volver">
                              <FontAwesomeIcon icon={faReply} /> Cancelar
                              </Button>
                              </Link>
                        </Form.Group>
                  </Form.Row>
				  
				  
                  <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    aria-labelledby="example-modal-sizes-title-lg"
                    >
                    <Modal.Header closeButton>
                      <Modal.Title>Imagen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                          <Image src={Imagen} fluid />
                    </Modal.Body>
                    <Modal.Footer>
                      <hr/>
                      Museo de Geología y Paleontología (UNCo.)
                    </Modal.Footer>
                    </Modal>


                </Form>


              </div>
            </div>  
           </div>


          </>

      )

}    

}

export default withRouter(EditPersona);     