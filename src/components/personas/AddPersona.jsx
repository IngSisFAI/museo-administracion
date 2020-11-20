import React from "react";
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faUser} from '@fortawesome/free-solid-svg-icons'
import { Link, withRouter} from 'react-router-dom';
import axios from "axios";
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class AddPersona extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            apellido: "",
            nroDoc: "",
            finicio: "",
            fbaja: "",
            motivo: "",
            selectedOption: null,
            titulos: "",
            foto: "",
            everFocusedNombre: false,
            everFocusedApellido: false,
            everFocusedNroDoc: false,
            inFocus: "",
            selectedFile: null,
            id: "",
            validated: false,
			extFoto: ''
          };
         this.reemplazar = this.reemplazar.bind(this);
    }

    componentDidMount()
    {
      if(!cookies.get('username') && !cookies.get('password'))
      {
          window.location.href='/';
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
		 const name = event.target.files[0].name;
         const lastDot = name.lastIndexOf('.');
         const ext = name.substring(lastDot + 1); 
		 
		console.log('Extensión:', ext)  
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


      handleBlur = evt => {
        fetch("http://museo.fi.uncoma.edu.ar:3006/api/personaNroDoc/" + evt.target.value)
          .then(response => {
            return response.json();
          })
          .then(persons => {
            if (persons.personas.length > 0) {
              toast.error("Existe Persona con ese DNI.");
              this.setState({ nroDoc: "" });
              document.getElementById("nroDoc").focus();
            }
          });
      };

      handleSubmit = (event) => {
		  
		var dniPersona=""
		 
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }
        else
        { 
               /* var photo = this.state.foto.replace("C:\\fakepath\\", "\\");
                photo= photo.replace(/\s+/g, "_");
                photo= this.reemplazar(photo);*/
				var photo="";
				if(this.state.selectedFile!==null){
                   photo =	'\\'+this.state.nroDoc+'.'+this.state.extFoto
				} 
                var data = {
                    nombres: this.state.nombre,
                    apellidos: this.state.apellido,
                    dni: this.state.nroDoc,
                    fechaInicio: this.state.finicio,
                    titulos: this.state.titulos,
                    foto: photo,
                    fechaBaja: this.state.fbaja,
                    motivoBaja: this.state.motivo
                 };
                 document.getElementById('guardar').setAttribute('disabled','disabled');
				 dniPersona=this.state.nroDoc
                 
                 fetch("http://museo.fi.uncoma.edu.ar:3006/api/persona", {
                    method: "post",
                    body: JSON.stringify(data),
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }).then(function(response) {
                      if (response.ok) {
                        console.log("¡Se guardó la Persona con Éxito!");
                        return response.json();
                      }
                    }).then(function(data) {
                          if(this.state.selectedFile!==null)
                          { 
                      
                             const archivo = this.state.selectedFile;
                             //const id = data.persona._id;
                             const destino = "/var/www/consulta/html/assets/datos/personal/fotosPersonal";
                             
                             const data1 = new FormData();
                             data1.append("file", archivo);
                             
                             axios.post("http://museo.fi.uncoma.edu.ar:3006/api/uploadArchivo", data1, {
                                      headers: {
                                        "Content-Type": undefined,
                                        path: destino,
										"newfilename": dniPersona
                                      }
                                    })
                                    .then(response => {
                                              
											  toast.success("¡Se guardó la Persona con Éxito! (2)");
							   
											   setTimeout(() => {
												 window.location.replace('/personas');
												}, 1500);
									  
									  
                                            })
                                    .catch(error => {
                                      console.log(error);
                                      document.getElementById('guardar').removeAttribute('disabled');
                                    });
                          }
                          else
                          {
                             toast.success("¡Se guardó la Persona con Éxito! (1)");
							   
                              setTimeout(() => {
                                window.location.href('/personas');
                              }, 1500);
                            
                          }
                             
                      
                    }.bind(this))
                    .catch(function(error) {
                      toast.error("Error al guardar. Intente nuevamente.");
                      document.getElementById('guardar').removeAttribute('disabled');
                      console.log("Hubo un problema con la petición Fetch:" + error.message
                      );
                    });
        
        
        
        }
        this.setState({ validated: true });
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
                       <FontAwesomeIcon icon={faUser} /> Agregar Persona
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
                                    <Form.Control type="number" placeholder="DNI" required onChange={this.handleNroDocChange} value={this.state.nroDoc}  onBlur={this.handleBlur}/>
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
                           <Form.Group className="col-sm-12" controlId="Foto">
                           <Form.File id="formcheck-api-regular">
                                <Form.File.Label>Foto:</Form.File.Label>
                                <Form.File.Input    accept="image/*"
                                                    value={this.state.foto}
                                                    onChange={this.handleFotoChange}/>
                           </Form.File>
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


                </Form>


              </div>
            </div>  
           </div>
                
            </>
       )

  }
    

}   
export default withRouter(AddPersona); 