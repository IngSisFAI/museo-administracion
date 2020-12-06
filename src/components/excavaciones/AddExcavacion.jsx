import React from "react";
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faCompass} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Select from 'react-select';
import CrearExcavacion from '../../areaGeospatial/CrearExcavacion';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class AddExcavacion extends React.Component {

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
                     selectedExploracion: '',
                     selectedColector: null,
                     selectedDirector: null,
                     selectedPaleontologo: null,
                     muestra: false,
                     idAreaExcavacion: '',
                     puntoGpsExcavacion: {},
                     validated: false
               };
      }

      componentDidMount() {

        if(!cookies.get('username') && !cookies.get('password'))
        {
            window.location.href='/';
        }
        else
        {

              fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
              .then((response) => {
                  return response.json()
                })
                .then((empleados) => {
                  this.setState({ colectores: empleados.personas, 
                                  directores: empleados.personas, 
                                  paleontologos: empleados.personas })
                });
            
          fetch('http://museo.fi.uncoma.edu.ar:3006/api/exploracion')
              .then((response) => {
                  return response.json()
                })
                .then((explorations) => {
                  this.setState({ exploraciones: explorations.exploraciones })
                });

                fetch('http://museo.fi.uncoma.edu.ar:3006/api/pais')
                .then((response) => {
                    return response.json()
                  })
                .then((countries) => {
                  this.setState({paises: countries.paises })
                })
         }
        } 

      setIdAreaExcavacion = idArea => this.setState({idAreaExcavacion: idArea})

      setPuntoGpsExcavacion = puntoGps => this.setState({puntoGpsExcavacion: puntoGps})

	  
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

    /*  handlePaisChange= (selectedPais) => { 
	  
	  
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
      }*/
	  
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
			 
              if(this.state.selectedPais!==null)
              {idCountry=this.state.selectedPais.value}
              
              var idProv=''
              if(this.state.selectedProvincia!==null)
              {idProv=this.state.selectedProvincia.value}
    
              var idCity=''
              if(this.state.selectedCiudad!==null)
              {idCity=this.state.selectedCiudad.value}
    
    
    
    
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
                "muestraHome": this.state.muestra,
                "idExploracion": idExploracion,
                "idPais":idCountry,
                "idProvincia": idProv,
                "idCiudad":  idCity,
				"muestraHome": this.state.muestraHome
             };
              
             fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion', {
              method: 'post',
              body: JSON.stringify(data),
              headers:{
                        'Content-Type': 'application/json'
                      }      
              })
              .then(function(response) {
                if(response.ok) {
                  toast.success("¡Se guardó la Excavacion con Éxito!");
                 setTimeout(() => {
									 window.location.replace('/excavaciones');
								  }, 1500);
									  
                } 
              })
              .catch(function(error) {
                toast.error("Error al guardar. Intente nuevamente.");
                console.log('Hubo un problema con la petición Fetch:', error.message);
              });
			  
		  }  
		  
		}

	   this.setState({ validated: true });
	}	
	
	 handleBlur = evt => {
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacionFiltroCode/'+evt.target.value)
        .then((response) => {
            return response.json()
          })
          .then((excavacions) => {
            console.log(excavacions.excavaciones.length)
             if(excavacions.excavaciones.length>0)
              {
                toast.error("Existe Excavación con ese Código. Ingrese uno nuevo."); 
                this.setState({codigo:''});
                document.getElementById('codigo').focus();
              }
          });
      };


    render()
    {
        const {validated} = this.state;
        
        const { selectedColector } = this.state;
        let optColectores = this.state.colectores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );


        const { selectedDirector } = this.state; 
		let optDirectores = this.state.directores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
        
		const { selectedPaleontologo } = this.state;
		let optPaleontologos = this.state.paleontologos.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
		
		const { selectedExploracion } = this.state;
		let optExploraciones = this.state.exploraciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
		
		/*const { selectedPais } = this.state; 
        let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
		
		const { selectedProvincia } = this.state;
		let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
		
		const { selectedCiudad } = this.state;
		let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );*/
		
		
         return(
             <>
               <Menu />
               <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faCompass} /> Agregar Excavación
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
                                <Form.Control type="text" placeholder="Ingrese Código" required onChange={this.handleCodigoChange} value={this.state.codigo} onBlur={this.handleBlur} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Código.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="colector">
                                <Form.Label>Colector:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Colector'} 
                                        options={optColectores}
                                        onChange={this.handleColectorChange} 
                                        value={selectedColector} isClearable />
                                
                            </Form.Group>
                            </Form.Row>
							
							 <Form.Row >
                              <Form.Group className="col-sm-6" controlId="director">
                                <Form.Label>Director:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Director'} 
                                        options={optDirectores}
                                        onChange={this.handleDirectorChange} 
                                        value={selectedDirector} isClearable />
                                
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="paleontologo">
                                <Form.Label>Paleontólogo:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Paleontólogo'} 
                                        options={optPaleontologos}
                                        onChange={this.handlePaleontologoChange} 
                                        value={selectedPaleontologo} isClearable />
                                
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
                      </fieldset> 


                      <fieldset>
                         <legend >Datos Geográficos</legend>
                         <hr/>
						   <Form.Row >
                              <Form.Group className="col-sm-12" controlId="exploracion">
                                <Form.Label>Exploración Asociada:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Exploración'} 
                                        options={optExploraciones}
                                        onChange={this.handleExploracionesChange} 
                                        value={selectedExploracion} 
										required />
                            </Form.Group>
                            </Form.Row>       
                        {/*   <Form.Group className="col-sm-6" controlId="pais"> 
                                <Form.Label>País:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione País'} 
                                        options={optPaises}
                                        onChange={this.handlePaisChange} 
                                        value={selectedPais} isClearable />
                                
                            </Form.Group> /*}
                            </Form.Row>
							
							{/* <Form.Row >
                              <Form.Group className="col-sm-6" controlId="provincia">
                                <Form.Label>Provincia:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Provincia'} 
                                        options={optProvincias}
                                        onChange={this.handleProvinciaChange} 
                                        value={selectedProvincia} isClearable />
                                
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="ciudad">
                                <Form.Label>Ciudad:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Ciudad'} 
                                        options={optCiudades}
                                        onChange={this.handleCiudadChange} 
                                        value={selectedCiudad} isClearable />
                                
                            </Form.Group>
              </Form.Row> */}
							<br/>
							
                              <CrearExcavacion
                                idExploracion={this.state.selectedExploracion.value}
                                setIdAreaExcavacion={this.setIdAreaExcavacion}
                                setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
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
export default AddExcavacion;     