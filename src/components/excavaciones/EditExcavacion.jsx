import React from "react";
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faCompass} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Select from 'react-select';
import ModificarExcavacion from '../../areaGeospatial/ModificarExcavacion';
import Moment from 'moment';

class EditExcavacion extends React.Component {
	
	  constructor(props) {
    super(props);
    this.state = {
                 colectores:[],
                 directores:[],
                 paleontologos:[],
                 exploraciones: [],
                 paises: [],
                 selectedPais:null ,
                 provincias:[],
                 selectedProvincia:null ,
                 ciudades:[],
                 selectedCiudad:null,
                 nombre:'',
                 descripcion:'',
                 codigo:'',
                 fechaInicio:'',
                 fbaja:'',
                 motivoBaja:'',
                 muestraHome: false,
                 bochones:[],
                 selectedBochones:null,
                 selectedExploracion: null,
                 selectedColector: null,
                 selectedDirector: null ,
                 selectedPaleontologo: null,
                 idProvincia:'',
                 idCiudad:'',
                 bochonesId:[],
                 puntoGpsExcavacion: '',
                 idAreaExcavacion: '',
				 validated: false
           };
       
  }    
  setPuntoGpsExcavacion = puntoGps => this.setState({puntoGpsExcavacion: puntoGps})
  setIdAreaExcavacion = idArea => this.setState({idAreaExcavacion: idArea});
  
   //antes de cargar el DOM      
  componentWillMount() {
    fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
    .then((response) => {
        return response.json()
      })
      .then((empleados) => {
		var colectores = empleados.personas.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) )
        var directores = empleados.personas.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) )
        var paleontologos = empleados.personas.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) )		

 		
        this.setState({ colectores: colectores, 
                        directores: directores, 
                        paleontologos: paleontologos })
      });

    fetch('http://museo.fi.uncoma.edu.ar:3006/api/bochon')
    .then((response) => {
        return response.json()
      })
      .then((bochons) => {
        this.setState({ bochones: bochons.bochones })
      });

    fetch('http://museo.fi.uncoma.edu.ar:3006/api/exploracion')
    .then((response) => {
        return response.json()
      })
      .then((explorations) => {
		var exploraciones=  explorations.exploraciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
        this.setState({ exploraciones: exploraciones })
      });

      fetch('http://museo.fi.uncoma.edu.ar:3006/api/pais')
      .then((response) => {
          return response.json()
        })
        .then((countries) => {
		  var paises=  countries.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) ); 	
          this.setState({paises: paises })
        });
  } 

  //una vez cargado en el DOM
  componentDidMount() {


    fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/'+this.props.match.params.id)
    .then((response) => {
        return response.json()
      })
      .then((excavacions) => {
          var fb= excavacions.excavacionId.fechaBaja;
          if(fb!==null)
          {
             fb=(Moment(excavacions.excavacionId.fechaBaja).add(1, 'days')).format('YYYY-MM-DD')
          }
		  
		 
          this.traerProvincias(excavacions.excavacionId.idPais)
		  this.traerCiudades(excavacions.excavacionId.idProvincia)
        
	  
		  var colectorSelect=[]
		  var directorSelect=[]
		  var paleontologoSelect=[]
		  var exploracionSelect=[]
		  var paisSelect=[]
		  var provinciaSelect=[]
          var ciudadSelect=[]		  
		 
	      					 

		 //setTimeout ya que las funciones de provincias y ciudad se ejecutan antes que se seteen los estados
        setTimeout(() => {
		 if(excavacions.excavacionId.colector!==null && excavacions.excavacionId.colector!=='')
		  {
	
			 colectorSelect= this.state.colectores.filter(option => option.value === excavacions.excavacionId.colector)
		     colectorSelect=colectorSelect[0];
			
								 
		  }	 

          
	      if(excavacions.excavacionId.directorId!==null && excavacions.excavacionId.directorId!=='')
		  {
	
			 directorSelect= this.state.directores.filter(option => option.value === excavacions.excavacionId.directorId)
		     directorSelect=directorSelect[0];
			
								 
		  }	

          
	      if(excavacions.excavacionId.paleontologo!==null && excavacions.excavacionId.paleontologo!=='')
		  {
	
			 paleontologoSelect= this.state.paleontologos.filter(option => option.value === excavacions.excavacionId.paleontologo)
		     paleontologoSelect=paleontologoSelect[0];
			
								 
		  }	
          
         
	      if(excavacions.excavacionId.idExploracion!==null && excavacions.excavacionId.idExploracion!=='')
		  {
	
			 exploracionSelect= this.state.exploraciones.filter(option => option.value === excavacions.excavacionId.idExploracion)
		     exploracionSelect=exploracionSelect[0];
			
								 
		  }	

         
	      if(excavacions.excavacionId.idPais!==null && excavacions.excavacionId.idPais!=='')
		  {
	
			 paisSelect= this.state.paises.filter(option => option.value === excavacions.excavacionId.idPais)
		     paisSelect=paisSelect[0];
			
								 
		  }	
		  else
		  { paisSelect=null} 
			
			
          if(excavacions.excavacionId.idProvincia!==null && excavacions.excavacionId.idProvincia!=='')
		  {
	        
			 provinciaSelect= this.state.provincias.filter(option => option.value === excavacions.excavacionId.idProvincia)
		     provinciaSelect=provinciaSelect[0];
		  }	
		  else
		  {
			 provinciaSelect=null 
		  }
		  
		  if(excavacions.excavacionId.idCiudad!==null && excavacions.excavacionId.idCiudad!=='')
		  {
	        
			 ciudadSelect= this.state.ciudades.filter(option => option.value === excavacions.excavacionId.idCiudad)
		     ciudadSelect=ciudadSelect[0];
		  }	
		  else{
			  ciudadSelect=null
		  }
		  
			    this.setState({ nombre: excavacions.excavacionId.nombre,
                          descripcion: excavacions.excavacionId.descripcion,
                          codigo:excavacions.excavacionId.codigo,
                          fechaInicio: (Moment(excavacions.excavacionId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
                          fbaja:fb,
                          motivoBaja: excavacions.excavacionId.motivoBaja, 
                          muestraHome: excavacions.excavacionId.muestraHome,
                          bochonesId:excavacions.excavacionId.bochonesEncontrados,
						  selectedPais: paisSelect,
                          selectedCiudad: ciudadSelect,
                          selectedProvincia: provinciaSelect,
						  selectedExploracion: exploracionSelect,
						  selectedDirector:directorSelect,
                          selectedColector:colectorSelect,
                          selectedPaleontologo: paleontologoSelect,
						  idAreaExcavacion: excavacions.excavacionId.idArea,
						  puntoGpsExcavacion: excavacions.excavacionId.puntoGps

                        })
    
        }, 3000); 	  

       
      });
  }
  
    //**** FUNCIONES DE PRECARGA ***/

  traerProvincias(idPais)
  {
    if(idPais!==null && idPais!=="")
    {		
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/provinciaIdPais/'+idPais)
        .then((response) => {
            return response.json()
          })
          .then((estados) => {
           
           var provincias =estados.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
		   this.setState({provincias: provincias});
    
          });

    }
     else
	 {
		  this.setState({provincias: []}); 
		 
	 }		 
	
    
  }
  
    traerCiudades(idProvincia)
    { 
	  if(idProvincia!==null && idProvincia!=="")
      {
	     fetch('http://museo.fi.uncoma.edu.ar:3006/api/ciudadIdProv/'+idProvincia)
          .then((response) => {
              return response.json()
            })
            .then((cities) => {
		      var ciudades =cities.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );		
              this.setState({ciudades: ciudades });

            });
	  }	
      else
	  {
		  this.setState({ciudades: [] });
	  }		  
  
    } 
	
	
	//**Manejadores**
	
	  handleMuestraChange(evt) {
	   this.setState({ muestraHome: evt.target.checked });
	  }
	  
	 

      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };

      handleDescChange = evt => {
        this.setState({ descripcion: evt.target.value });
      };

      handleCodigoChange = evt => {
        this.setState({ codigo: evt.target.value });
      };

      handleFinicioChange = evt => {
        this.setState({ fechaInicio: evt.target.value });
      };

      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivoBaja: evt.target.value });
      };

      handleColectorChange = (selectedColector) => {
        this.setState({selectedColector});
      }

      handleDirectorChange = (selectedDirector) => {
        this.setState({selectedDirector});
      }

      handlePaleontologoChange = (selectedPaleontologo) => {
        this.setState({selectedPaleontologo});
      }


      handleExploracionesChange = (selectedExploracion) => {
        this.setState({selectedExploracion});		
      }

      handlePaisChange= (selectedPais) => { 
	
		  if(selectedPais!=null)
		  {	  
		  
			  
				this.setState(prevState => ({
					selectedProvincia: null
					}
				  ));
				
				fetch('http://museo.fi.uncoma.edu.ar:3006/api/provinciaIdPais/'+selectedPais.value)
				.then((response) => {
					return response.json()
				  })
				  .then((estados) => {
					var provincias =estados.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
					this.setState({provincias: provincias, selectedPais, ciudades:[]});

				  });
		   }
           else{
			   this.setState({
					selectedPais:null, selectedProvincia:null, selectedCiudad:null, provincias:[], ciudades:[]});
		   }		   
      }

      handleProvinciaChange= (selectedProvincia) => { 


       if(selectedProvincia!=null)
	   {	
			this.setState(prevState => ({
				selectedCiudad: null
				}
			  ));
			
			fetch('http://museo.fi.uncoma.edu.ar:3006/api/ciudadIdProv/'+selectedProvincia.value)
			.then((response) => {
				return response.json()
			  })
			  .then((cities) => {
				var ciudades =cities.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
				this.setState({ciudades: ciudades , selectedProvincia});

			  });
	   }
       else	  
       {
		    this.setState({
				 selectedProvincia:null, selectedCiudad:null,  ciudades:[]});
		   
	   }		   
      
	  
	  }

      handleCiudadChange = (selectedCiudad) => {
			 this.setState({selectedCiudad}) 
      }
    
	 handleSubmit = (event) => {
		 
		
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
		  if(this.state.selectedExploracion=="" || this.state.selectedExploracion==null)
		  {
			 toast.error('Ingrese datos obligatorios. Seleccione una Exploración!');  
			  
		  }	
          else{
			  toast.error('Ingrese datos obligatorios.');
			  
		  }		  
		  
        }
        else
        { 
	      if(this.state.selectedExploracion=="" || this.state.selectedExploracion==null)
		  {
			 toast.error('Seleccione una Exploración!');  
			  
		  }	
		  else
		  {
				  var idDirector=''
				  var nameDirector=''
				  if(this.state.selectedDirector!==null)
				  { idDirector=this.state.selectedDirector.value
					nameDirector=this.state.selectedDirector.label
				  }

				  var idColector=''
				  if(this.state.selectedColector!==null)
				  {idColector=this.state.selectedColector.value}

				  var idPaleontologo=''
				  if(this.state.selectedPaleontologo!==null)
				  {idPaleontologo=this.state.selectedPaleontologo.value}

				  var idExploracion=''
				  if(this.state.selectedExploracion!==null)
				  {idExploracion=this.state.selectedExploracion.value}

					var idCountry=''
  console.log("selected Pais:",this.state.selectedPais)
					  if(this.state.selectedPais!==null )
					  {
						  idCountry=this.state.selectedPais.value
					  }
					  else
					  {
						 if(this.state.selectedPais!==null)
						 {
							idCountry=this.state.selectedPais 
						 }	 
						  
					  }	  
					
					  
					 var idProv=''
					 if(this.state.selectedProvincia!==null )
					  {
						  idProv=this.state.selectedProvincia.value
					  }
					  else
					  {
						 if(this.state.selectedProvincia!==null)
						 {
							idProv=this.state.selectedProvincia
						 }	 
						  
					  }	
			
					  var idCity=''
					   
					  if(this.state.selectedCiudad!=null)
					  {
						  idCity=this.state.selectedCiudad.value
					  }
					  else
					  {
						 if(this.state.selectedCiudad!==null)
						 {
							idCity=this.state.selectedCiudad
						 }	 
						  
					  }	

				  var data = {
					"nombre": this.state.nombre,
					"descripcion": this.state.descripcion,
					"codigo": this.state.codigo,
					"fechaInicio": this.state.fechaInicio,
					"fechaBaja": this.state.fbaja, 
					"motivoBaja": this.state.motivoBaja,
					"directorId": idDirector,
					"director": nameDirector,
					"colector": idColector,
					"paleontologo": idPaleontologo,
					"idArea": this.state.idAreaExcavacion,
					"puntoGPS": this.state.puntoGpsExcavacion,
					"muestraHome": this.state.muestraHome,
					"idExploracion": idExploracion,
					"idPais":idCountry,
					"idProvincia": idProv,
					"idCiudad":  idCity
				 };

				  fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion/'+this.props.match.params.id, {
				  method: 'put',
				  body: JSON.stringify(data),
				  headers:{
							'Content-Type': 'application/json'
						  }      
				  })
				  .then(function(response) {
					if(response.ok) {
					  toast.success("¡Se actualizó la Excavacion con Éxito!");
					   setTimeout(() => {
									 window.location.replace('/excavaciones');
								  }, 1500);
					} 
				  })
				  .catch(function(error) {
					toast.error("Error al guardar. Intente nuevamente.");
					console.log('Hubo un problema con la petición Fetch:' + error.message);
				  });
				  }
		  
		}

	   this.setState({ validated: true });
	}		  
  
  render()
  {
	   const {validated} = this.state; 
	   const {selectedColector} = this.state;
       const {selectedDirector} = this.state;
       const {selectedPaleontologo} = this.state;	
       const {selectedExploracion}= this.state;
	   const {selectedPais}= this.state;
	   const {selectedProvincia}= this.state;
	   const {selectedCiudad}= this.state;
	   
	   
		let optBochones = this.state.bochones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
		
	    
		

		
	  return (
	        <>
			<div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faCompass} /> Editar Excavación
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
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Nombre" required onChange={this.handleNombreChange} value={this.state.nombre} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Nombre.
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Form.Row>
                            
                            <Form.Row >
                            <Form.Group className="col-sm-12" controlId="descripcion">
                                <Form.Label>Descripción:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Descripción"  onChange={this.handleDescChange} value={this.state.descripcion} />
                 
                            </Form.Group>
                            </Form.Row>

                            <Form.Row >
                            <Form.Group className="col-sm-6" controlId="codigo">
                                <Form.Label>Código:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Código" required disabled onChange={this.handleCodigoChange} value={this.state.codigo} onBlur={this.handleBlur} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Código.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="colector">
                                <Form.Label>Colector:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Colector'} 
                                        options={this.state.colectores}
                                        onChange={this.handleColectorChange} 
										value={selectedColector}
										isClearable />
                                
                            </Form.Group>
                            </Form.Row>
							
							 <Form.Row >
                              <Form.Group className="col-sm-6" controlId="director">
                                <Form.Label>Director:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Director'} 
                                        options={this.state.directores}
                                        onChange={this.handleDirectorChange} 
                                        value={selectedDirector} 
										isClearable />
                                
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="paleontologo">
                                <Form.Label>Paleontólogo:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Paleontólogo'} 
                                        options={this.state.paleontologos}
                                        onChange={this.handlePaleontologoChange} 
                                        value={selectedPaleontologo}
										isClearable />
                                
                            </Form.Group>
                            </Form.Row>
							
							<Form.Row >
                            <Form.Group className="col-sm-4" controlId="fechaInicio">
                                    <Form.Label>Fecha Inicio:</Form.Label>
                                    <Form.Control type="date" value={this.state.fechaInicio}
                                                    onChange={this.handleFinicioChange}/>
                                
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="fbaja">
                                    <Form.Label>Fecha Baja:</Form.Label>
                                    <Form.Control type="date"  value={this.state.fbaja} onChange={this.handleFbajaChange}/>
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="motivoBaja">
                                    <Form.Label>Motivo Baja:</Form.Label>
                                    <Form.Control as="textarea" rows={3}  value={this.state.motivoBaja} onChange={this.handleMotivoChange}/>
                            </Form.Group>

                        </Form.Row>
						<Form.Row >
                              <Form.Group className="col-sm-12" controlId="bochones">
                                <Form.Label>Bochones:</Form.Label>
                               <Select  name="bochones"  
                                                 isMulti
                                                 placeholder={'Seleccione Bochones'} 
                                                 options={optBochones}
                                                 isDisabled
                                                 onChange={this.handleBochonesChange} 
                                                 value={optBochones.filter(({value}) => this.state.bochonesId.includes(value))}
                                                />
                            
                            </Form.Group>
						  </Form.Row>	
                      </fieldset> 
					  


                      <fieldset>
                         <legend >Datos Geográficos</legend>
                         <hr/>
						   <Form.Row >
                              <Form.Group className="col-sm-6" controlId="exploracion">
                                <Form.Label>Exploración Asociada:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Exploración'} 
                                        options={this.state.exploraciones}
                                        onChange={this.handleExploracionesChange} 
                                        value={selectedExploracion} 
										isDisabled
										isClearable
										required />
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="pais">
                                <Form.Label>País:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione País'} 
                                        options={this.state.paises}
                                        onChange={this.handlePaisChange} 
										isDisabled
                                        value={selectedPais}
										isClearable />
                                
                            </Form.Group>
                            </Form.Row>
							
							 <Form.Row >
                              <Form.Group className="col-sm-6" controlId="provincia">
                                <Form.Label>Provincia:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Provincia'} 
                                        options={this.state.provincias}
                                        onChange={this.handleProvinciaChange} 
										isDisabled
                                        value={selectedProvincia}
										isClearable />
                                
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="ciudad">
                                <Form.Label>Ciudad:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Ciudad'} 
                                        options={this.state.ciudades}
                                        onChange={this.handleCiudadChange} 
                                        value={selectedCiudad}
										isDisabled
										isClearable />
                                
                            </Form.Group>
                            </Form.Row>
							<br/>
							
                            
							 <ModificarExcavacion
							      idExploracion={this.state.selectedExploracion}
                                  excavacionId={this.props.match.params.id}
                                  setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
                                  setIdAreaExcavacion={this.setIdAreaExcavacion}
                                />
   
 
                            <br/>
							
						
							  <Form.Group controlId="muestra">
									<Form.Check inline 
									            type="checkbox" 
												label="Muestra en Página Web?" 
												checked={this.state.muestraHome}
												onChange={this.handleMuestraChange.bind(this)} 
												/>
						      </Form.Group>
							 
								
					  </fieldset>
                      <hr/>
                      <Form.Row> 
					<Form.Group className="mx-sm-3 mb-2">
								  <Button variant="primary" type="submit" id="guardar">
								  <FontAwesomeIcon icon={faSave} /> Guardar
								  </Button>
								  &nbsp;&nbsp;
								 <Link to='/excavaciones'>
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

export default EditExcavacion;	

