import React from "react";
import { Form, Button, Badge } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faHandLizard} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();



class AddBochon extends React.Component {
	
	 constructor(props) {
        super(props);
        this.state = {
                nombre:"",
                nroCampo:"",
                selectedExcavacion: null,
                excavaciones:[],
                selectedPreparador: null,
                preparadores:[],
                selectedEjemplar: null,
                ejemplares:[],
                selectedPieza: null,
                piezas:[],
                selectedAcido: null,
                acidos:[],
                selectedTipoPreparacion:null,
                tiposPreparacion:[],
                acidosId:'',
                bochonesEncontrados:[],
				validated: false
        }        
    }
	
 //carga los select al iniciar el componente
     componentDidMount() {

		if(!cookies.get('username') && !cookies.get('password'))
		{
			window.location.href='/';
		}
		else
		{

			fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion')
			.then((response) => {
				return response.json()
			})
			.then((excavacions) => {
				this.setState({excavaciones: excavacions.excavaciones})
			});

			fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
			.then((response) => {
				return response.json()
				})
				.then((persons) => {
				this.setState({preparadores: persons.personas})
				});

				fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplar')
				.then((response) => {
					return response.json()
				})
				.then((ejemplars) => {
					this.setState({ejemplares: ejemplars.ejemplares})
				});

				fetch('http://museo.fi.uncoma.edu.ar:3006/api/acido')
				.then((response) => {
					return response.json()
				})
				.then((acids) => {
					this.setState({acidos: acids.acidos})
				});


				fetch('http://museo.fi.uncoma.edu.ar:3006/api/tipoPreparacion')
				.then((response) => {
					return response.json()
				})
				.then((tipos) => {
					this.setState({tiposPreparacion: tipos.tiposPreparacion})
				});
		}		


    }
    
    handleNombreChange = evt => {
        this.setState({nombre: evt.target.value });
      };

    handleNroCampoChange = evt => {
		  console.log(evt.target.value )
        this.setState({nroCampo: evt.target.value });
      }; 
      
    handleExcavacionChange = (selectedExcavacion) => {
        this.setState({selectedExcavacion});
       // console.log(`Option selected:`, selectedExcavacion );
       
    } 


    handlePreparadorChange = (selectedPreparador) => {
        this.setState({selectedPreparador});
      //  console.log(`Option selected:`, selectedPreparador );
       
    } 

    handleEjemplarChange = (selectedEjemplar) => {
        
      if(selectedEjemplar!==null)
      {		   
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/piezaEjemplar/'+selectedEjemplar.value)
        .then((response) => {
            return response.json()
          })
          .then((pieces) => {
            this.setState({piezas: pieces.pieza , selectedEjemplar , selectedPieza: null});

          });
	  }
      else
	  {
		  this.setState({piezas: [] , selectedEjemplar:null, selectedPieza:null}); 
		  
	  }		  
       
    } 

    handlePiezaChange = (selectedPieza) => {
        this.setState({selectedPieza});
      }

    handleAcidoChange = (selectedAcido) => {
        let acidos = Array.from(selectedAcido, option => option.label);
        this.setState({selectedAcido});
        this.setState({acidosId:acidos});
        console.log(`Option selected:`, acidos );
       
    } 
    
    handleTipoPreparacionChange = (selectedTipoPreparacion) => {
        this.setState({selectedTipoPreparacion});
        console.log(`Option selected:`,selectedTipoPreparacion );
       
    } 
	handleSubmit = (event) => {
		 
		
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
		  toast.error('Ingrese datos obligatorios.');
		  if(this.state.selectedExcavacion=="" || this.state.selectedExcavacion==null)
		  {
			 toast.error('Seleccione una Excavación.');  
			  
		  }	
		  
		  if(this.state.selectedPreparador=="" || this.state.selectedPreparador==null)
		  {
			 toast.error('Seleccione una Preparador.');  
			  
		  }	
		  if(this.state.selectedEjemplar=="" || this.state.selectedEjemplar==null)
		  {
			 toast.error('Seleccione un Ejemplar.');  
			  
		  }	
		  if(this.state.selectedPieza=="" || this.state.selectedPieza==null)
		  {
			 toast.error('Seleccione un Pieza.');  
			  
		  }	
			  
		}
        else{
			
			if(this.state.selectedExcavacion=="" || this.state.selectedExcavacion==null)
			{
				 toast.error('Seleccione una Excavación.');  
				  
		    }
            else
			{
				  if(this.state.selectedPreparador=="" || this.state.selectedPreparador==null)
				  {
					 toast.error('Seleccione una Preparador.');  
					  
				  }
                  else	
				  {
					  if(this.state.selectedEjemplar=="" || this.state.selectedEjemplar==null)
					  {
						 toast.error('Seleccione un Ejemplar.');  
						  
					  }
					  else
					  {
						  if(this.state.selectedPieza=="" || this.state.selectedPieza==null)
						  {
							 toast.error('Seleccione un Pieza.');  
							  
						  }
                          else
						  {
							  var idExcavacion=''
							  if(this.state.selectedExcavacion!==null)
							  {idExcavacion=this.state.selectedExcavacion.value}

							  var idEjemplar=''
							  if(this.state.selectedEjemplar!==null)
							  {idEjemplar=this.state.selectedEjemplar.value}

							  var idPieza=''
							  if(this.state.selectedPieza!==null)
							  {idPieza=this.state.selectedPieza.value}

							  var idPreparador=''
							  var preparador=''
							  if(this.state.selectedPreparador!==null)
							  {idPreparador=this.state.selectedPreparador.value
							   preparador=this.state.selectedPreparador.label
							  }

							  var tipoPreparacion=''
							  if(this.state.selectedTipoPreparacion!==null)
							  {tipoPreparacion=this.state.selectedTipoPreparacion.label}

							  var idAcido=''
							  if(this.state.selectedAcido!==null)
							  {idAcido=this.state.selectedAcido.value}


							  var data = {
								"nombre": this.state.nombre,
								"nroCampo": this.state.nroCampo,
								"preparador": preparador,
								"preparadorID": idPreparador,
								"tipoPreparacion": tipoPreparacion, 
								"acidosAplicados": this.state.acidosId,
								"ejemplarAsociado": idEjemplar,
								"excavacionId": idExcavacion,
								"piezaId": idPieza
							  };

							  fetch('http://museo.fi.uncoma.edu.ar:3006/api/bochon', {
								method: 'post',
								body: JSON.stringify(data),
								headers:{
										  'Content-Type': 'application/json'
										}      
								})
								.then(function(response) {
								  if(response.ok) {
									console.log("¡Se guardó el Bochón con Éxito!");
								  
								  } 
								}).then(() => {
									//insertar
									//1.Buscar la excavacion 
									//2. Obtener el array de bochones
									//3.Agregar el id al array 
									//4. actualizar excavaciones
									//modificar : no permito cambiar la excavacion, si quiero modificar elimino y cargo de nuevo
									//eliminar: si elimino bochon lo tengo q eliminar de excavacion
									
									var bochones=[]
									var nombreBochon=this.state.nombre
									axios.get('http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/'+idExcavacion)
									.then(function(response) {
									   bochones=response.data.excavacionId.bochonesEncontrados;
									   var id="";
									   axios.get('http://museo.fi.uncoma.edu.ar:3006/api/bochonUnNombre/'+nombreBochon)
									   .then(function(response) {
										 
											id=response.data.bochon._id;
											//agrego el bochon a arreglo de bochones encontrados
											bochones.push(id)
											var data1 = {
											 "bochonesEncontrados": bochones
											}
					   
											axios.put("http://museo.fi.uncoma.edu.ar:3006/api/excavacionBochon/"+idExcavacion, data1, {
											 headers:{
											   'Content-Type': 'application/json'
											 }   
											}).then(response => {
											  
												  toast.success("¡Se guardó el Bochón con Éxito!");
												  setTimeout(() => {
													 window.location.replace('/bochones');
												  }, 1500);
					   
											  
											})
											.catch(error => {
											  console.log(error);
											});
					   
										 })
										 .catch(function (error) {
										  console.log(error);
										}); 

							  
									})
										.catch(function (error) {
										console.log(error);
									}); 
                
									
									
								})								
								.catch(function(error) {
								  toast.error("Error al guardar. Intente nuevamente.");
								  console.log('Hubo un problema con la petición Fetch:' + error.message);
								});

  
							  
						  }							  
						  
					  }
					  
				  }					  
				
			}				
			
		}		
	
	    this.setState({ validated: true });
	}

render(){
	
		const { selectedExcavacion } = this.state;
        const { selectedPreparador } = this.state;
        const { selectedEjemplar } = this.state;
        const { selectedPieza } = this.state;
        const { selectedAcido } = this.state;
        const { selectedTipoPreparacion } = this.state;
		const {validated} = this.state;

        let optExcavacion = this.state.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optPreparador = this.state.preparadores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
        let optEjemplar = this.state.ejemplares.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optPieza = this.state.piezas.map((opt) => ({ label: opt.identificador, value: opt._id }) );
        let optAcido = this.state.acidos.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optTipoPreparacion = this.state.tiposPreparacion.map((opt) => ({ label: opt.nombre, value: opt._id }) );
	
	return(
	         <>
			 <Menu />
			  <div className="row">
               <div className="col-md-12">
                 <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faHandLizard} /> Agregar Bochón
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
					 <fieldset>
                            <legend >Datos Básicos</legend>
							<hr/>
					    <Form.Row >
							  <Form.Group className="col-sm-12" controlId="nombre">
                                <Form.Label>Nombre (*):</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Nombre" autocomplete="off" required onChange={this.handleNombreChange} value={this.state.nombre} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Nombre.
                                </Form.Control.Feedback>
                              </Form.Group>
                        </Form.Row>		
						<Form.Row >
							    <Form.Group className="col-sm-12" controlId="excavacion">
									<Form.Label>Excavación (*):</Form.Label>
									 <Select
											placeholder={'Seleccione Excavación'}
											options={optExcavacion} 
											onChange={this.handleExcavacionChange} 
											value={selectedExcavacion}
											isClearable
									  />
							    </Form.Group>		  
					    </Form.Row>	
                        <Form.Row >
							    <Form.Group className="col-sm-12" controlId="ejemplar">
									<Form.Label>Ejemplar (*):</Form.Label>
									 <Select
											placeholder={'Seleccione Ejemplar'}
											options={optEjemplar} 
											onChange={this.handleEjemplarChange} 
											value={selectedEjemplar}
											isClearable
									  />
							    </Form.Group>		  
					    </Form.Row>	 
                        <Form.Row >
							    <Form.Group className="col-sm-12" controlId="pieza">
									<Form.Label>Pieza Asociada (*):</Form.Label>
									 <Select
											placeholder={'Seleccione Piezas'}
											options={optPieza} 
											onChange={this.handlePiezaChange} 
											value={selectedPieza}
											isClearable
									  />
							    </Form.Group>		  
					    </Form.Row>	 	
                        
						<Form.Row >
							  <Form.Group className="col-sm-6" controlId="nroCampo">
                                <Form.Label>Nro. Campo:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Nro. Campo" autocomplete="off" onChange={this.handleNroCampoChange} value={this.state.nroCampo} />     
                              </Form.Group>
							   <Form.Group className="col-sm-6" controlId="preparador">
									<Form.Label>Preparador (*):</Form.Label>
									 <Select
											placeholder={'Seleccione Preparador'}
											options={optPreparador} 
											onChange={this.handlePreparadorChange} 
											value={selectedPreparador}
											isClearable
									  />
							    </Form.Group>	
                        </Form.Row>	
						<Form.Row >
							 <Form.Group className="col-sm-6" controlId="tipoPreparacion">
									<Form.Label>Tipo Preparación:</Form.Label>
									 <Select
											placeholder={'Seleccione Tipo Preparación'}
											options={optTipoPreparacion} 
											onChange={this.handleTipoPreparacionChange} 
											value={selectedTipoPreparacion}
											isClearable
									  />
							    </Form.Group>	
							   <Form.Group className="col-sm-6" controlId="acidosAplicados">
									<Form.Label>Ácidos Aplicados:</Form.Label>
									 <Select
											placeholder={'Seleccione Ácidos Aplicados'}
											options={optAcido} 
											onChange={this.handleAcidoChange} 
											value={selectedAcido}
											isMulti
									  />
							    </Form.Group>	
                        </Form.Row>	
					<br/>	
					<Badge variant="light">(*) Datos Obligatorios</Badge> {' '}
					<br/>
                     </fieldset>	
                      <hr/>
                      <Form.Row> 
					<Form.Group className="mx-sm-3 mb-2">
								  <Button variant="primary" type="submit" id="guardar">
								  <FontAwesomeIcon icon={faSave} /> Guardar
								  </Button>
								  &nbsp;&nbsp;
								 <Link to='/bochones'>
								  <Button variant="secondary" type="button" id="volver">
								  <FontAwesomeIcon icon={faReply} /> Cancelar
								  </Button>
								  </Link>
							</Form.Group>
					  </Form.Row>					  

					<br/>
                    <br/>									 
					</Form>
                  </div>
                </div>
			  </div>	
			 </>
		  )
}

}
export default AddBochon;  

	
