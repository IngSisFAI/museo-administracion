import React from "react";
import { Form, Button, Badge } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faHandLizard} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Select from 'react-select';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class EditBochon extends React.Component {
	
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
                idExcavacion:'',
                idEjemplar:'',
                idPieza:'',
                idPreparador:'',
                idAcidos:[],
                idTipoPreparacion:'',
				validated: false

        }        
    }
	
    //carga los select al iniciar el componente
    componentWillMount() {

        fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion')
        .then((response) => {
            return response.json()
          })
          .then((excavacions) => {
			 var excavaciones=  excavacions.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
            this.setState({excavaciones: excavaciones})
          });

          fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
          .then((response) => {
              return response.json()
            })
            .then((persons) => {
			   var preparadores = persons.personas.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) )	
               this.setState({preparadores: preparadores})
            });

            fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplar')
            .then((response) => {
                return response.json()
              })
              .then((ejemplars) => {
				 var ejemplares=   ejemplars.ejemplares.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
                 this.setState({ejemplares:ejemplares})
              });

            fetch('http://museo.fi.uncoma.edu.ar:3006/api/acido')
            .then((response) => {
                return response.json()
              })
              .then((acids) => {
				 var acidos=   acids.acidos.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
                 this.setState({acidos: acidos})
              });


            fetch('http://museo.fi.uncoma.edu.ar:3006/api/tipoPreparacion')
            .then((response) => {
                return response.json()
              })
              .then((tipos) => {
				 var tiposPreparacion=  tipos.tiposPreparacion.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
                 this.setState({tiposPreparacion: tiposPreparacion})
              });


    }	
	
	  //una vez cargado en el DOM
 //*************************
  componentDidMount() {
	
	if(!cookies.get('username') && !cookies.get('password'))
    {
        window.location.href='/';
    }
    else
    {
	 
		
		fetch('http://museo.fi.uncoma.edu.ar:3006/api/bochonId/'+this.props.match.params.id)
		.then((response) => {
			return response.json()
		})
		.then((bochons) => {
			
			this.traerPiezas(bochons.bochonId.ejemplarAsociado) 
			var excavacionSelect=[]
			var preparadorSelect=[]
			var ejemplarSelect=[]
			var acidoSelect=[]
			var tipoPreparacionSelect=[]
			var piezaSelect=[]
			
			setTimeout(() => {
				
			if(bochons.bochonId.excavacionId!==null && bochons.bochonId.excavacionId!=='')
			{
				excavacionSelect= this.state.excavaciones.filter(option => option.value === bochons.bochonId.excavacionId)
				excavacionSelect=excavacionSelect[0];					 
			}
			else
			{
				excavacionSelect=null	 
				
			}

			if(bochons.bochonId.preparadorID!==null && bochons.bochonId.preparadorID!=='')
			{
				preparadorSelect= this.state.preparadores.filter(option => option.value === bochons.bochonId.preparadorID)
				preparadorSelect=preparadorSelect[0];					 
			}
			else
			{
				preparadorSelect=null 
				
			}

			if(bochons.bochonId.ejemplarAsociado!==null && bochons.bochonId.ejemplarAsociado!=='')
			{
				ejemplarSelect= this.state.ejemplares.filter(option => option.value === bochons.bochonId.ejemplarAsociado)
				ejemplarSelect=ejemplarSelect[0];					 
			}
			else
			{
				ejemplarSelect=null 
				
			}	

			if(bochons.bochonId.acidosAplicados!==null && bochons.bochonId.acidosAplicados!=='')
			{
				acidoSelect= this.state.acidos.filter(({label}) =>  bochons.bochonId.acidosAplicados.includes(label))

			}
			else
			{
				acidoSelect=null
				
			}

			if(bochons.bochonId.tipoPreparacion!==null && bochons.bochonId.tipoPreparacion!=='')
			{
				tipoPreparacionSelect= this.state.tiposPreparacion.filter(option => option.label === bochons.bochonId.tipoPreparacion)
				tipoPreparacionSelect=tipoPreparacionSelect[0];
				
			}
			else
			{
				tipoPreparacionSelect=null
				
			}

			if(bochons.bochonId.piezaId!==null && bochons.bochonId.piezaId!=='')
			{
				piezaSelect= this.state.piezas.filter(option => option.value === bochons.bochonId.piezaId)
				piezaSelect=piezaSelect[0];
			}
			else
			{
				piezaSelect=null 
				
			}		 
			
				
			
			this.setState({   nombre: bochons.bochonId.nombre,
								nroCampo:bochons.bochonId.nroCampo,
								acidosId:bochons.bochonId.acidosAplicados,
								idExcavacion:bochons.bochonId.excavacionId,
								idEjemplar:bochons.bochonId.ejemplarAsociado,
								idPieza:bochons.bochonId.piezaId,
								idPreparador:bochons.bochonId.preparadorID,
								idTipoPreparacion:bochons.bochonId.tipoPreparacion,
								selectedExcavacion: excavacionSelect,
								selectedPreparador: preparadorSelect,
								selectedEjemplar: ejemplarSelect,
								selectedAcido: acidoSelect,
								selectedTipoPreparacion:tipoPreparacionSelect,
								selectedPieza: piezaSelect
							})
			}, 2500) });
	}		
    
  }


traerPiezas(idEjemplar) 
{
	
	  fetch('http://museo.fi.uncoma.edu.ar:3006/api/piezaEjemplar/'+idEjemplar)
        .then((response) => {
            return response.json()
          })
          .then((pieces) => {
			var piezas=   pieces.pieza.map((opt) => ({ label: opt.identificador, value: opt._id }) );  
            this.setState({piezas: piezas});

          });
	
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
			var piezas=   pieces.pieza.map((opt) => ({ label: opt.identificador, value: opt._id }) );  

            this.setState({piezas: piezas , selectedEjemplar, selectedPieza: null});

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
                              var idExcav=''
							  if(this.state.selectedExcavacion!==null)
							  {idExcav=this.state.selectedExcavacion.value}

							  var idEjemp=''
							  if(this.state.selectedEjemplar!==null)
							  {idEjemp=this.state.selectedEjemplar.value}

							  var idP=''
							  if(this.state.selectedPieza!==null)
							  {idP=this.state.selectedPieza.value}

							  var idPrep=''
							  var prepa=''
							  if(this.state.selectedPreparador!==null)
							  {idPrep=this.state.selectedPreparador.value
							   prepa=this.state.selectedPreparador.label
							  }

							  var tipoPrep=''
							  if(this.state.selectedTipoPreparacion!==null)
							  {tipoPrep=this.state.selectedTipoPreparacion.label}

							  var idAc=''
							  if(this.state.selectedAcido!==null)
							  {idAc=this.state.selectedAcido.value}


							  var data = {
								"nombre": this.state.nombre,
								"nroCampo": this.state.nroCampo,
								"preparador": prepa,
								"preparadorID": idPrep,
								"tipoPreparacion": tipoPrep, 
								"acidosAplicados": this.state.acidosId,
								"ejemplarAsociado": idEjemp,
								"excavacionId": idExcav,
								"piezaId": idP
							  };

							  fetch('http://museo.fi.uncoma.edu.ar:3006/api/bochon/'+this.props.match.params.id, {
								method: 'put',
								body: JSON.stringify(data),
								headers:{
										  'Content-Type': 'application/json'
										}      
								})
								.then(function(response) {
								  if(response.ok) {
									toast.success("¡Se actualizó el Bochón con Éxito!");
									 setTimeout(() => {
													 window.location.replace('/bochones');
												  }, 1500);
								  } 
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

render()
{
		const { selectedExcavacion } = this.state;
        const { selectedPreparador } = this.state;
        const { selectedEjemplar } = this.state;
        const { selectedPieza } = this.state;
        const { selectedAcido } = this.state;
        const { selectedTipoPreparacion } = this.state;
		const {validated} = this.state;
		
	  return(<>
	           <Menu />
	           <div className="row">
               <div className="col-md-12">
                 <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faHandLizard} /> Editar Bochón
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
											options={this.state.excavaciones} 
											onChange={this.handleExcavacionChange} 
											value={selectedExcavacion}
											isClearable isDisabled
									  />
							    </Form.Group>		  
					    </Form.Row>	
                        <Form.Row >
							    <Form.Group className="col-sm-12" controlId="ejemplar">
									<Form.Label>Ejemplar (*):</Form.Label>
									 <Select
											placeholder={'Seleccione Ejemplar'}
											options={this.state.ejemplares} 
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
											options={this.state.piezas} 
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
											options={this.state.preparadores} 
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
											options={this.state.tiposPreparacion} 
											onChange={this.handleTipoPreparacionChange} 
											value={selectedTipoPreparacion}
											isClearable
									  />
							    </Form.Group>	
							   <Form.Group className="col-sm-6" controlId="acidosAplicados">
									<Form.Label>Ácidos Aplicados:</Form.Label>
									 <Select
											placeholder={'Seleccione Ácidos Aplicados'}
											options={this.state.acidos} 
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
	         </>)
	
}


}
export default EditBochon;  