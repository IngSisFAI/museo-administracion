import React from "react";
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faPaw} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Select from 'react-select';
import ModificarExcavacion from '../../areaGeospatial/ModificarExcavacion';
import Moment from 'moment';


const optTipos = [
        { value: 'Encontrado', label: 'Encontrado' },
        { value: 'No Encontrado', label: 'No Encontrado' },
        
      ];
	  
	  
class EditEjemplar extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
                nombre:"",
                nroColeccion:"",
                fechaColeccion:"",
                dimensionAlto:"",
                dimensionAncho:"",
                peso:"",
                alimentacion:"",
                ubicacion:"",
                descripcion1:"",
                descripcion1A:"",
                descripcion2:"",
                descripcion3:"",
                formacion:"",
                grupo:"",
                subgrupo:"",
                edad:"",
                periodo:"",
                era:"",
                reino:"",
                filo:"",
                clase:"",
                orden:"",
                familia:"",
                genero:"",
                especie:"",
                selectedPais:null ,
                selectedProvincia:null ,
                selectedCiudad:null,
                muestraHome: false,
                selectedExcavacion: null,
                selectedTipo: null,
                fbaja:"",
                motivo:"",
                ilustracionCompleta:"",
                descripcionIC:"",
                periodo2:"",
                perteneceExca:"",
                fotos:[],
                videos:[],
                paises: [],
                provincias: [],
                ciudades: [],
                excavaciones: [],
                idExcavacion:"",
                tipoEjemplar:null,
                colecciones:[],
                selectedColeccion:null,
				paisesArray:[]
                 
        }        
       
      }
	  
	   //Antes de cargar el DOM  
      //*********************** 
      componentWillMount() {

          fetch('http://museo.fi.uncoma.edu.ar:3006/api/pais')
          .then((response) => {
              return response.json()
            })
            .then((countries) => {
			  var paises=  countries.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) ); 	
              this.setState({paises: paises, paisesArray: paises })
            });

         fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion')
        .then((response) => {
            return response.json()
          })
          .then((excavacions) => {
			 
			 var excavaciones=  excavacions.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }) ); 	
             this.setState({ excavaciones: excavaciones })
          });

           fetch('http://museo.fi.uncoma.edu.ar:3006/api/coleccion')
        .then((response) => {
            return response.json()
          })
          .then((collection) => {
			 var colecciones=  collection.colecciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );  
            this.setState({ colecciones: colecciones })
          });


      }
	  
	  //una vez cargado en el DOM
 //*************************
  componentDidMount() {
	  
		 
		 
		 
    fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplarId/'+this.props.match.params.id)
    .then((response) => {
        return response.json()
      })
      .then((ejemplars) => {
        
        // console.log(ejemplars.ejemplarId.tipoEjemplar);
          var fb= ejemplars.ejemplarId.fechaBaja;
          if(fb!==null)
          {
             fb=(Moment(ejemplars.ejemplarId.fechaBaja).add(1, 'days')).format('YYYY-MM-DD')
	
          }

          var fi= ejemplars.ejemplarId.fechaIngresoColeccion;
          if(fi!==null)
          {
             fi=(Moment(ejemplars.ejemplarId.fechaIngresoColeccion).add(1, 'days')).format('YYYY-MM-DD')
          }

            this.traerProvincias(ejemplars.ejemplarId.areaHallazgo.pais)
		    this.traerCiudades(ejemplars.ejemplarId.areaHallazgo.provincia)
			
			var coleccionSelect=[]
		    var excavacionSelect=[]
		    var paisSelect=[]
		    var provinciaSelect=[]
            var ciudadSelect=[]		  
		 
		 
		  //setTimeout ya que las funciones de provincias y ciudad se ejecutan antes que se seteen los estados
        setTimeout(() => {

          
	      if(ejemplars.ejemplarId.nroColeccion!==null && ejemplars.ejemplarId.nroColeccion!=='')
		  {
	
			 coleccionSelect= this.state.colecciones.filter(option => option.value === ejemplars.ejemplarId.nroColeccion)
		     coleccionSelect=coleccionSelect[0];
			
								 
		  }	
          
         
	      if(ejemplars.ejemplarId.perteneceExca!==null && ejemplars.ejemplarId.perteneceExca!=='')
		  {
	
			 excavacionSelect= this.state.excavaciones.filter(option => option.value === ejemplars.ejemplarId.perteneceExca)
		     excavacionSelect=excavacionSelect[0];
			
								 
		  }	

         
	      if(ejemplars.ejemplarId.areaHallazgo.pais!==null && ejemplars.ejemplarId.areaHallazgo.pais!=='')
		  {
	
			 paisSelect= this.state.paises.filter(option => option.value === ejemplars.ejemplarId.areaHallazgo.pais)
		     paisSelect=paisSelect[0];
			 
		
			
								 
		  }	
			
			
          if(ejemplars.ejemplarId.areaHallazgo.provincia!==null && ejemplars.ejemplarId.areaHallazgo.provincia!=='')
		  {
	        
			 provinciaSelect= this.state.provincias.filter(option => option.value === ejemplars.ejemplarId.areaHallazgo.provincia)
		     provinciaSelect=provinciaSelect[0];
		  }	
		  
		  if(ejemplars.ejemplarId.areaHallazgo.ciudad!==null && ejemplars.ejemplarId.areaHallazgo.ciudad!=='')
		  {
	        
			 ciudadSelect= this.state.ciudades.filter(option => option.value === ejemplars.ejemplarId.areaHallazgo.ciudad)
		     ciudadSelect=ciudadSelect[0];
		  }	
          

          this.setState({   tipoEjemplar: ejemplars.ejemplarId.tipoEjemplar,
                            reino:ejemplars.ejemplarId.taxonReino,
                            filo:ejemplars.ejemplarId.taxonFilo,
                            clase:ejemplars.ejemplarId.taxonClase,
                            orden:ejemplars.ejemplarId.taxonOrden,
                            familia: ejemplars.ejemplarId.taxonFamilia,
                            genero:ejemplars.ejemplarId.taxonGenero,
                            especie:ejemplars.ejemplarId.taxonEspecie,
                            formacion:ejemplars.ejemplarId.eraGeologica.formacion,
                            grupo:ejemplars.ejemplarId.eraGeologica.grupo,
                            subgrupo:ejemplars.ejemplarId.eraGeologica.subgrupo,
                            edad:ejemplars.ejemplarId.eraGeologica.edad,
                            periodo:ejemplars.ejemplarId.eraGeologica.periodo,
                            era:ejemplars.ejemplarId.eraGeologica.era,
                            ilustracionCompleta:ejemplars.ejemplarId.ilustracionCompleta,
                            descripcionIC:ejemplars.ejemplarId.descripcionIC,
                            nroColeccion:ejemplars.ejemplarId.nroColeccion,
                            dimensionAncho:ejemplars.ejemplarId.dimensionLargo,
                            dimensionAlto:ejemplars.ejemplarId.dimensionAlto,
                            peso: ejemplars.ejemplarId.peso,
                            alimentacion:ejemplars.ejemplarId.alimentacion,
                            fechaColeccion:fi,
                            ubicacion:ejemplars.ejemplarId.ubicacionMuseo,
                            fotos:ejemplars.ejemplarId.fotosEjemplar,
                            videos:ejemplars.ejemplarId.videosEjemplar,
                            fbaja: fb, 
                            motivo: ejemplars.ejemplarId.motivoBaja,
                            nombre:ejemplars.ejemplarId.nombre,
                            periodo2:ejemplars.ejemplarId.periodo,
                            muestraHome: ejemplars.ejemplarId.home,
                            descripcion1:ejemplars.ejemplarId.descripcion1,
                            descripcion1A:ejemplars.ejemplarId.descripcion1A,
                            descripcion2:ejemplars.ejemplarId.descripcion2,
                            descripcion3: ejemplars.ejemplarId.descripcion3,  
                            perteneceExca: ejemplars.ejemplarId.perteneceExca,
							selectedPais:paisSelect,
							selectedProvincia:provinciaSelect,
							selectedCiudad:ciudadSelect,
							selectedColeccion:coleccionSelect,
							selectedTipo: ejemplars.ejemplarId.tipoEjemplar,
							selectedExcavacion: excavacionSelect
							
                          
                        })
		},3000)	
      });
  }
  
   //**** FUNCIONES DE PRECARGA ***/

  traerProvincias(idPais)
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
  
    traerCiudades(idProvincia)
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
	
  
   //Manejadores de cada campo 
	  
      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };


      handleTipoChange = (selectedTipo) => {
         this.setState({selectedTipo});
        this.setState({tipoEjemplar:selectedTipo.value});
        console.log(`Option selected:`, selectedTipo);
       
      }

  

       handleColeccionesChange = (selectedColeccion) => {
        this.setState({selectedColeccion});
        console.log(`Option selected:`, selectedColeccion );
       
      }

      handleFechaColeccionChange = evt => {
        this.setState({ fechaColeccion: evt.target.value });
      };

      handleDimensionAltoChange = evt => {
        this.setState({ dimensionAlto: evt.target.value });
      };

      handleDimensionAnchoChange = evt => {
        this.setState({ dimensionAncho: evt.target.value });
      };

      handlePesoChange = evt => {
        this.setState({ peso: evt.target.value });
      };

      handleAlimentacionChange = evt => {
        this.setState({ alimentacion: evt.target.value });
      };

      handleUbicacionChange = evt => {
        this.setState({ ubicacion: evt.target.value });
      };

      handleDescripcion1Change = evt => {
		  
        this.setState({ descripcion1: evt.target.value });
      };

      handleDescripcion1AChange = evt => {
        this.setState({ descripcion1A: evt.target.value });
      };

      handleDescripcion2Change = evt => {
        this.setState({ descripcion2: evt.target.value });
      };

      handleDescripcion3Change = evt => {
        this.setState({ descripcion3: evt.target.value });
      };

      handleFormacionChange = evt => {
        this.setState({ formacion: evt.target.value });
      };

      handleGrupoChange = evt => {
        this.setState({ grupo: evt.target.value });
      };

      handleSubgrupoChange = evt => {
        this.setState({ subgrupo: evt.target.value });
      };

      handleEdadChange = evt => {
        this.setState({ edad: evt.target.value });
      }; 

      handlePeriodoChange = evt => {
        this.setState({ periodo: evt.target.value });
      };

      handleEraChange = evt => {
        this.setState({ era: evt.target.value });
      };
     

      handleReinoChange = evt => {
        this.setState({ reino: evt.target.value });
      };

      handleFiloChange = evt => {
        this.setState({ filo: evt.target.value });
      };

      handleClaseChange = evt => {
        this.setState({clase: evt.target.value });
      };

      handleOrdenChange = evt => {
        this.setState({ orden: evt.target.value });
      };

      handleFamiliaChange = evt => {
        this.setState({ familia: evt.target.value });
      };

      handleGeneroChange = evt => {
        this.setState({ genero: evt.target.value });
      };

      handleEspecieChange = evt => {
        this.setState({ especie: evt.target.value });
      };




       handleExcavacionesChange = (selectedExcavacion) => {
        this.setState({selectedExcavacion});
        
		
		if(selectedExcavacion!==null)
		{
			 fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/'+selectedExcavacion.value)
			 .then((response) => {
                               return response.json()
               })
             .then((result) => {
				 
                 if(result.excavacionId.idPais!=='' && result.excavacionId.idPais!==null)	
                 {					 
					  var paisSelect= this.state.paisesArray.filter(option => option.value === result.excavacionId.idPais)
					  this.setState({selectedPais: paisSelect[0]})		

					  fetch('http://museo.fi.uncoma.edu.ar:3006/api/provinciaIdPais/'+result.excavacionId.idPais)
						.then((response) => {
							return response.json()
						  })
						  .then((estados) => {
							    var provincias =estados.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) ); 
							    this.setState({provincias: estados.provincias});
							    if(result.excavacionId.idProvincia!=='' && result.excavacionId.idProvincia!==null)
								{
							        var provSelect= provincias.filter(option => option.value === result.excavacionId.idProvincia)
							        this.setState({selectedProvincia: provSelect[0]});
									fetch('http://museo.fi.uncoma.edu.ar:3006/api/ciudadIdProv/'+result.excavacionId.idProvincia)
										.then((response) => {
											return response.json()
										  })
										  .then((cities) => {
											     var ciudades =cities.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );
                                                 this.setState({ciudades: cities.ciudades});												 
											     if(result.excavacionId.idCiudad!=='' && result.excavacionId.idCiudad!==null)	
												 {
													var ciudadSelect= ciudades.filter(option => option.value === result.excavacionId.idCiudad);
											        this.setState({selectedCiudad:ciudadSelect[0]});
												 }
												 else{
													this.setState({selectedCiudad: null, ciudades:[]})  
												 }
										  }).catch(function(error) {
												toast.error("Error al consultar (3). Intente nuevamente.");
												console.log('Hubo un problema con la petición Fetch:',error.message);
											  });
														  
								}	
								else{
									
									this.setState({selectedProvincia: null,selectedCiudad: null, provincias: [], ciudades:[]}) 
								}
						   
						 			 
							  
						  }).catch(function(error) {
								toast.error("Error al consultar (2). Intente nuevamente.");
								console.log('Hubo un problema con la petición Fetch:',error.message);
							  });
				 }
				 else {
					 
					this.setState({selectedPais: null, selectedProvincia: null,selectedCiudad: null, provincias: [], ciudades:[]}) 

					 
				 }				 
			  
			  
			  
			  }).catch(function(error) {
					toast.error("Error al consultar (1). Intente nuevamente.");
					console.log('Hubo un problema con la petición Fetch:',error.message);
				  });
			
			
			
		}
        else
		{
			this.setState({selectedPais: null, selectedProvincia: null,selectedCiudad: null, provincias: [], ciudades:[]}) 

		}			
       
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
					this.setState({provincias: estados.provincias, selectedPais});

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
				this.setState({ciudades: cities.ciudades , selectedProvincia});

			  });
	   }
       else	  
       {
		    this.setState({
				 selectedProvincia:null, selectedCiudad:null,  ciudades:[]});
		   
	   }		   
      
	  
	  }

      handleCiudadChange = (selectedCiudad) => {
		 
        this.setState({selectedCiudad});
      }

      handleMuestraChange(evt) {
		  console.log(evt.target.checked)
        this.setState({ muestraHome: evt.target.checked });
      }

      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivo: evt.target.value });
      };
	  
	  
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
		  
		  if(this.state.selectedColeccion=="" || this.state.selectedColeccion==null)
		  {
			 toast.error('Seleccione una Colección.');  
			  
		  }	
			  
		  
        }
        else
        { 
	      if(this.state.selectedExcavacion=="" || this.state.selectedExcavacion==null)
		  {
			 toast.error('Seleccione una Excavación!');  
			  
		  }	
		  else
		  {
			      var idCountry=''
              if(this.state.selectedPais!==null && this.state.selectedPais.value!==undefined)
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
             if(this.state.selectedProvincia!==null && this.state.selectedProvincia.value!==undefined)
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
			  if(this.state.selectedCiudad!=null && this.state.selectedCiudad.value!==undefined)
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
		  
		      var idExcav=''
              if(this.state.selectedExcavacion!==null)
              {idExcav=this.state.selectedExcavacion.value}


            

              var eraGeo={
                "formacion":this.state.formacion,
                "grupo":this.state.grupo,
                "subgrupo":this.state.subgrupo,
                "edad":this.state.edad,
                "periodo":this.state.periodo,
                "era":this.state.era
              };
			  

			  var areaH={
                "pais":idCountry,
                "ciudad":idCity,
                "provincia":idProv
                };
		
              var data = {
                "tipoEjemplar": this.state.selectedTipo.value,
                "taxonReino":this.state.reino,
                "taxonFilo":this.state.filo,
                "taxonClase":this.state.clase,
                "taxonOrden":this.state.orden,
                "taxonFamilia": this.state.familia,
                "taxonGenero":this.state.genero,
                "taxonEspecie":this.state.especie,
                "eraGeologica": eraGeo,
                "ilustracionCompleta":this.state.ilustracionCompleta,
                "descripcionIC":this.state.descripcionIC,
                "areaHallazgo": areaH,
                "nroColeccion":this.state.selectedColeccion.value,
                "dimensionLargo":this.state.dimensionAncho,
                "dimensionAlto":this.state.dimensionAlto,
                "peso": this.state.peso,
                "alimentacion":this.state.alimentacion,
                "fechaIngresoColeccion":this.state.fechaColeccion,
                "ubicacionMuseo":this.state.ubicacion,
                "fotosEjemplar":this.state.fotos,
                "videosEjemplar":this.state.videos,
                "fechaBaja": this.state.fbaja, 
                "motivoBaja": this.state.motivo,
                "nombre":this.state.nombre,
                "periodo":this.state.periodo2,
                "home": this.state.muestraHome,
                "descripcion1":this.state.descripcion1,
                "descripcion1A":this.state.descripcion1A,
                "descripcion2":this.state.descripcion2,
                "descripcion3": this.state.descripcion3,  
                "perteneceExca":idExcav
             };

                fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplar/'+this.props.match.params.id, {
                method: 'put',
                body: JSON.stringify(data),
                headers:{
                            'Content-Type': 'application/json'
                        }      
                })
                .then(function(response) {
                    if(response.ok) {
                    toast.success("¡Se actualizó el Ejemplar con Éxito!");
                     setTimeout(() => {
									 window.location.replace('/ejemplares');
								  }, 1500); 
                    } 
                })
                .catch(function(error) {
                    toast.success("Error al guardar. Intente nuevamente.");
                    console.log('Hubo un problema con la petición Fetch:',  error.message);
                });
			  
			  
		  }  
		  
		}

	   this.setState({ validated: true });
	}	

	  


render()
{
	   const {validated} = this.state; 
	   const {selectedColeccion} = this.state;
       const {selectedTipo} = this.state;
       const {selectedExcavacion}= this.state;
	   const {selectedPais}= this.state;
	   const {selectedProvincia}= this.state;
	   const {selectedCiudad}= this.state;
	   
	
	 return(
	         <>
			 <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faPaw} /> Editar Ejemplar
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
                                <Form.Control type="text" placeholder="Ingrese Nombre" autocomplete="off" required onChange={this.handleNombreChange} value={this.state.nombre} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Nombre.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Form.Row>
							
							<Form.Row >
							    <Form.Group className="col-sm-4" controlId="tipoEjemplar">
								<Form.Label>Tipo Ejemplar:</Form.Label>
								  <Select  
                                                    placeholder={'Seleccione Tipo'}
                                                    options={optTipos} 
                                                    onChange={this.handleTipoChange} 
                                                    value={optTipos.filter(option => option.value === this.state.tipoEjemplar)}
												
                                                    />
								</Form.Group>
								<Form.Group className="col-sm-4" controlId="coleccion">
								   <Form.Label>Colección:</Form.Label>
								   <Select      
                                                    placeholder={'Seleccione Colección'}
                                                    options={this.state.colecciones} 
                                                    onChange={this.handleColeccionesChange} 
                                                    value={selectedColeccion}
													isClearable
                                                    />
								</Form.Group>
								<Form.Group className="col-sm-4" controlId="fechaColeccion">
								 <Form.Label>Fecha Ingreso Colección:</Form.Label>
                                    <Form.Control type="date" value={this.state.fechaColeccion}
                                                    onChange={this.handleFechaColeccionChange}/>
								</Form.Group>
							
							</Form.Row>
							
							<Form.Row >
							 <Form.Group className="col-sm-4" controlId="fbaja">
                                    <Form.Label>Fecha Baja:</Form.Label>
                                    <Form.Control type="date"  value={this.state.fbaja} onChange={this.handleFbajaChange}/>
                            </Form.Group>

                            <Form.Group className="col-sm-8" controlId="motivo">
                                    <Form.Label>Motivo Baja:</Form.Label>
                                    <Form.Control as="textarea" rows={3}  value={this.state.motivo} onChange={this.handleMotivoChange}/>
                            </Form.Group>
							</Form.Row>
							
							<Form.Row >
							
							<Form.Group className="col-sm-4" controlId="dimensionAlto">
                                <Form.Label>Dimensión Alto:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Alto" autocomplete="off" required onChange={this.handleDimensionAltoChange} value={this.state.dimensionAlto} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Dimensión Alto.
                                </Form.Control.Feedback>
                              </Form.Group>
							  
							  <Form.Group className="col-sm-4" controlId="dimensionAncho">
                                <Form.Label>Dimensión Largo:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Largo" autocomplete="off" required value={this.state.dimensionAncho} onChange={this.handleDimensionAnchoChange} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Largo.
                                </Form.Control.Feedback>
                              </Form.Group>
							  
							  <Form.Group className="col-sm-4" controlId="peso">
                                <Form.Label>Peso:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Peso" autocomplete="off" required onChange={this.handlePesoChange} value={this.state.peso} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Peso.
                                </Form.Control.Feedback>
                              </Form.Group>
							
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="alimentacion">
                                <Form.Label>Alimentación:</Form.Label>
                                <Form.Control type="text" autocomplete="off"   onChange={this.handleAlimentacionChange} value={this.state.alimentacion} />

                               </Form.Group>
							</Form.Row>
							
							<Form.Row>
							   <Form.Group className="col-sm-12" controlId="ubicacion">
                                <Form.Label>Ubicación:</Form.Label>
                                <Form.Control type="text" autocomplete="off"   onChange={this.handleUbicacionChange} value={this.state.ubicacion} />
							   </Form.Group>	
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion1">
                                <Form.Label>Descripción 1:</Form.Label>
                                <Form.Control as="textarea" rows={3}   value={this.state.descripcion1} onChange={this.handleDescripcion1Change} />
                               </Form.Group>
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion1A">
                                <Form.Label>Descripción 1A:</Form.Label>
                                <Form.Control as="textarea" rows={3}  value={this.state.descripcion1A} onChange={this.handleDescripcion1AChange} />
                               </Form.Group>
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion2">
                                <Form.Label>Descripción 2:</Form.Label>
                                <Form.Control as="textarea" rows={3}   value={this.state.descripcion2} onChange={this.handleDescripcion2Change} />
                               </Form.Group>
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion3">
                                <Form.Label>Descripción 3:</Form.Label>
                                <Form.Control as="textarea" rows={3}   value={this.state.descripcion3} onChange={this.handleDescripcion3Change} />
                               </Form.Group>
							</Form.Row>
							
							<br/>   
                              <legend >Datos Geológicos</legend>
                            <hr/>
							
							<Form.Row >
							
							  <Form.Group className="col-sm-4" controlId="formacion">
                                <Form.Label>Formación:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleFormacionChange} value={this.state.formacion} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="grupo">
                                <Form.Label>Grupo:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleGrupoChange} value={this.state.grupo} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="subgrupo">
                                <Form.Label>Subgrupo:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleSubgrupoChange} value={this.state.subgrupo} />
                              </Form.Group>

							</Form.Row>
							
							<Form.Row >
							
							  <Form.Group className="col-sm-4" controlId="edad">
                                <Form.Label>Edad:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleEdadChange} value={this.state.edad} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="perido">
                                <Form.Label>Período:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handlePeriodoChange} value={this.state.periodo} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="era">
                                <Form.Label>Era:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleEraChange} value={this.state.era} />
                              </Form.Group>

							</Form.Row>
							
							<Form.Row >
							
							  <Form.Group className="col-sm-4" controlId="reino">
                                <Form.Label>Reino:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleReinoChange} value={this.state.reino} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="filo">
                                <Form.Label>Filo:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleFiloChange} value={this.state.filo} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="clase">
                                <Form.Label>Clase:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleClaseChange} value={this.state.clase} />
                              </Form.Group>

							</Form.Row>
							
							<Form.Row >
							
							  <Form.Group className="col-sm-4" controlId="orden">
                                <Form.Label>Orden:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleOrdenChange} value={this.state.orden} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="familia">
                                <Form.Label>Familia:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleFamiliaChange} value={this.state.familia} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="genero">
                                <Form.Label>Género:</Form.Label>
                                <Form.Control type="text"  autocomplete="off"  onChange={this.handleGeneroChange} value={this.state.genero} />
                              </Form.Group>

							</Form.Row>
							
							<Form.Row>
							   <Form.Group className="col-sm-12" controlId="especie">
                                <Form.Label>Especie:</Form.Label>
                                <Form.Control type="text" autocomplete="off"  onChange={this.handleEspecieChange} value={this.state.especie} />
							   </Form.Group>	
							</Form.Row>
							
							 <br/>   
                             <legend >Área de Hallazgo</legend>
                             <hr/>
								
							<Form.Row >
							    <Form.Group className="col-sm-6" controlId="excavacion">
									<Form.Label>Excavación:</Form.Label>
									 <Select
											placeholder={'Seleccione Excavación'}
											options={this.state.excavaciones} 
											onChange={this.handleExcavacionesChange} 
											value={selectedExcavacion}
											isClearable
									  />
								</Form.Group>  
							    <Form.Group className="col-sm-6" controlId="pais">
									<Form.Label>País:</Form.Label>
									<Select 
											placeholder={'Seleccione País'} 
											options={this.state.paises}
											onChange={this.handlePaisChange} 
											value={selectedPais} 
											isDisabled
										
									/>
									
								
									
									</Form.Group>
							</Form.Row>
							
							 <Form.Row >
                              <Form.Group className="col-sm-6" controlId="provincia">
                                <Form.Label>Provincia:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Provincia'} 
                                        options={this.state.provincias}
                                        onChange={this.handleProvinciaChange} 
                                        value={selectedProvincia} 
										isDisabled
										
										/>
                                
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="ciudad">
                                <Form.Label>Ciudad:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Ciudad'} 
                                        options={this.state.ciudades}
                                        onChange={this.handleCiudadChange} 
                                        value={selectedCiudad} 
										isDisabled
										
										/>
                                
                            </Form.Group>
                            </Form.Row>
							 <Form.Row >
							 <Form.Group controlId="muestraHome">
									<Form.Check inline 
									            type="checkbox" 
												label="Muestra en Página Web?" 
												checked={this.state.muestraHome}
												onChange={this.handleMuestraChange.bind(this)} 
												/>
						      </Form.Group>
                             </Form.Row>
						 <br/>					 
					     </fieldset>	
                          <hr/>
                      <Form.Row> 
					<Form.Group className="mx-sm-3 mb-2">
								  <Button variant="primary" type="submit" id="guardar">
								  <FontAwesomeIcon icon={faSave} /> Guardar
								  </Button>
								  &nbsp;&nbsp;
								 <Link to='/ejemplares'>
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
export default EditEjemplar;		