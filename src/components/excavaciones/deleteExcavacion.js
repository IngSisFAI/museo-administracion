import React, {Component} from 'react';
import Select from 'react-select';
import Moment from 'moment';
import axios from 'axios';



function validate(nombre, codigo, fechaInicio,  selectedExploracion) {
  // true means invalid, so our conditions got reversed
   
  return {
    nombre: nombre.length === 0,
    codigo: codigo.length === 0,
    fechaInicio: fechaInicio.length === 0,
    selectedExploracion:  selectedExploracion === null
  };
}




class DeleteExcavacion extends Component {

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
                 muestra: false,
                 directorId:'',
                 colectorId:'',
                 paleontologoId:'',
                 exploracionId: '',
                 idPais:'',
                 idProvincia:'',
                 idCiudad:'',
                 bochonesId:[],
                 puntoGPS: '',
                 idArea: ''
           };
       
  }

  
 
  //antes de cargar el DOM      
  componentWillMount() {

    fetch('/api/persona')
    .then((response) => {
        return response.json()
      })
      .then((empleados) => {
        this.setState({ colectores: empleados.personas, 
                        directores: empleados.personas, 
                        paleontologos: empleados.personas })
      });

    fetch('/api/bochon')
    .then((response) => {
        return response.json()
      })
      .then((bochons) => {
        this.setState({ bochones: bochons.bochones })
      });

    fetch('/api/exploracion')
    .then((response) => {
        return response.json()
      })
      .then((explorations) => {
        this.setState({ exploraciones: explorations.exploraciones })
      });

      fetch('/api/pais')
      .then((response) => {
          return response.json()
        })
        .then((countries) => {
          this.setState({paises: countries.paises })
        });

        

       

  }


  //una vez cargado en el DOM
  componentDidMount() {
    
    fetch('/api/excavacionId/'+this.props.match.params.id)
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

          this.setState({ nombre: excavacions.excavacionId.nombre,
                          descripcion: excavacions.excavacionId.descripcion,
                          codigo:excavacions.excavacionId.codigo,
                          fechaInicio: (Moment(excavacions.excavacionId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
                          fbaja:fb,
                          motivoBaja: excavacions.excavacionId.motivoBaja, 
                          muestra: excavacions.excavacionId.muestraHome,
                          directorId:excavacions.excavacionId.directorId,
                          colectorId:excavacions.excavacionId.colector,
                          paleontologoId: excavacions.excavacionId.paleontologo,
                          exploracionId: excavacions.excavacionId.idExploracion,
                          idPais: excavacions.excavacionId.idPais,
                          idCiudad: excavacions.excavacionId.idCiudad,
                          idProvincia: excavacions.excavacionId.idProvincia,
                          bochonesId:excavacions.excavacionId.bochonesEncontrados,
						  selectedPais: excavacions.excavacionId.idPais,
                          selectedCiudad: excavacions.excavacionId.idCiudad,
                          selectedProvincia: excavacions.excavacionId.idProvincia,
						  selectedExploracion: excavacions.excavacionId.idExploracion,
						  selectedDirector:excavacions.excavacionId.directorId,
                          selectedColector:excavacions.excavacionId.colector,
                          selectedPaleontologo: excavacions.excavacionId.paleontologo
                          
                        })
      });

     
       

  }


  //************ Manejadores*****************

  handleMuestraChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
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
    this.setState({colectorId: selectedColector.value});
    console.log(selectedColector);
  }

  handleDirectorChange = (selectedDirector) => {
    this.setState({selectedDirector});
    this.setState({directorId: selectedDirector.value});
    console.log(`Option selected:`, selectedDirector );
  }

  handlePaleontologoChange = (selectedPaleontologo) => {
    this.setState({selectedPaleontologo});
    this.setState({paleontologoId: selectedPaleontologo.value});
  }



  handleBochonesChange = (selectedBochones) => {
    let bochons = Array.from(selectedBochones, option => option.value);
    this.setState({selectedBochones});
    this.setState({bochons, bochonesId: bochons});
    console.log(`Option selected:`, bochons);
   
  }

  handleExploracionesChange = (selectedExploracion) => {
    this.setState({selectedExploracion});
    this.setState({exploracionId: selectedExploracion.value});
    console.log(`Option selected:`, this.state.exploracionId );
   
  }


   handlePaisChange= (selectedPais) => { 

    this.setState(prevState => ({
        selectedProvincia: null
        }
      ));
    
    fetch('/api/provinciaIdPais/'+selectedPais.value)
    .then((response) => {
        return response.json()
      })
      .then((estados) => {
        this.setState({provincias: estados.provincias , selectedPais, idPais:selectedPais.value});

      });
  }


  handleProvinciaChange= (selectedProvincia) => { 

    this.setState(prevState => ({
        selectedCiudad: null
        }
      ));
    
    fetch('/api/ciudadIdProv/'+selectedProvincia.value)
    .then((response) => {
        return response.json()
      })
      .then((cities) => {
        this.setState({ciudades: cities.ciudades , selectedProvincia, idProvincia:selectedProvincia.value});

      });
  }

  handleCiudadChange = (selectedCiudad) => {
    this.setState({selectedCiudad, idCiudad: selectedCiudad.value});
  }



 



  //**** FUNCIONES DE PRECARGA ***/
  
  traerProvincias(idPais)
  {
    
        fetch('/api/provinciaIdPais/'+idPais)
        .then((response) => {
            return response.json()
          })
          .then((estados) => {
            this.setState({provincias: estados.provincias});
    
          });

         
	
    
  }
  
    traerCiudades(idProvincia)
    { 
	     fetch('/api/ciudadIdProv/'+idProvincia)
          .then((response) => {
              return response.json()
            })
            .then((cities) => {
              this.setState({ciudades: cities.ciudades });

            });
  
    } 



 
    handleSubmit = evt => {
        if (window.confirm("¿Desea eliminar la excavación seleccionada?"))
        {

              evt.preventDefault();
			  const destino="./../museo-administracion/public/images/excavaciones/"+this.props.match.params.id 
             
			 axios.delete('/api/excavacion/'+this.props.match.params.id)
                  .then(function(response) {
                          return response;
  
                  })
				  .then (function (resp){
					    

						fetch('/api/deleteDirectorio', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
						  .then(function(response) {
							  if(response.ok) {
								    console.log('Se eliminaron los archivos con exito.');
								    alert('¡Se eliminó la Excavación con Éxito!');
									window.location.href="/excavaciones"; 
							  } 
						  })
						  .catch(function(error) {
							  alert("Error al eliminar. Intente nuevamente.");
							  console.log('Hubo un problema con la petición Fetch:' + error.message);
						  });
					  
				  })
                  .catch(function(error) {
                      alert("Error al eliminar. Intente nuevamente.");
                      console.log('Hubo un problema con la petición Fetch:' + error.message);
                  });
              
              return;
    
        }
        
     
    };

    




    render() 
    {
      

     const errors = validate(this.state.nombre, this.state.codigo, this.state.fechaInicio, this.state.selectedExploracion);
     const isDisabled = Object.keys(errors).some(x => errors[x]);


     let optColectores = this.state.colectores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
     let optDirectores = this.state.directores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
     let optPaleontologos = this.state.paleontologos.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
     let optBochones = this.state.bochones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optExploraciones = this.state.exploraciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );

     return (
        <div>
            <div className="row">
                  <div className="col-md-12">
                        <div id="contenido" align="left" className="container">
                            <h3 className="page-header" align="left"><i class="fa fa-compass" aria-hidden="true"></i>  Eliminar Excavación</h3>  
                            <hr/>
                            <form className="form-horizontal" onSubmit={this.handleSubmit} > 
                            <fieldset>
                                <legend >Datos Básicos</legend>
                                <hr/>
                                <div className="input-group">
                                    <div className="col-sm-12">
                                        
                                            <label htmlFor="nombre" >Nombre (*):</label>
                                            <input type="text" 
                                                    className={errors.nombre ? "error" : ""}
                                                    className="form-control" 
                                                    name="nombre"
                                                    disabled="disabled"
                                                    value={this.state.nombre}
                                                    onChange={this.handleNombreChange} />  
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-12">
                                        
                                            <label htmlFor="descripcion" >Descripción:</label>
                                            <textarea 
                                                    className="form-control" 
                                                    name="descripcion"
                                                    disabled="disabled"
                                                    value={this.state.descripcion}
                                                    onChange={this.handleDescChange} 
                                                     ></textarea>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-6">
                                        <label htmlFor="codigo">Código (*):</label>
                                        <input type="text" 
                                                 className={errors.codigo ? "error" : ""}
                                                className="form-control" 
                                                name="codigo"
                                                disabled="disabled"
                                                value={this.state.codigo}
                                                onChange={this.handleCodigoChange}  />     
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="colector">Colector:</label>
                                        <Select name="colector"  
                                                placeholder={'Seleccione Colector'} 
                                                options={optColectores}
                                                isDisabled
                                                onChange={this.handleColectorChange} 
                                                value={optColectores.filter(option => option.value === this.state.colectorId)}>
                                        </Select>

                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-6">
                                        <label htmlFor="director">Director:</label>
                                        <Select name="director"  
                                                placeholder={'Seleccione Director'} 
                                                options={optDirectores}
                                                isDisabled
                                                onChange={this.handleDirectorChange} 
                                                value={optDirectores.filter(option => option.value === this.state.directorId)} 
                                               
                                                >
                                            
                                        </Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="paleontologo">Paleontólogo:</label>
                                        <Select name="paleontologo"  
                                                placeholder={'Seleccione Paleontologo'} 
                                                options={optPaleontologos}
                                                isDisabled
                                                onChange={this.handlePaleontologoChange} 
                                                value={optPaleontologos.filter(option => option.value === this.state.paleontologoId)}>
                                            
                                        </Select>
                                    </div>

                                </div>

                                <div className="input-group">

                                    <div className="col-sm-4">
                                            <label >Fecha Inicio (*):</label>
                                            <input type="date" 
                                                    className={errors.fechaInicio ? "error" : ""}
                                                    className="form-control" 
                                                    name="fechaInicio" 
                                                    disabled="disabled"
                                                    value={this.state.fechaInicio}
                                                    onChange={this.handleFinicioChange}
                                                    />
                                    </div>

                                    <div className="col-sm-4">  
                                        <label >Fecha Baja:</label>
                                        <input type="date" 
                                                className="form-control" 
                                                name="fbaja" 
                                                disabled="disabled"
                                                value={this.state.fbaja}
                                                onChange={this.handleFbajaChange}

                                                  />
                                    </div>
                                

                                    <div className="col-sm-4">
                                            <label >Motivo Baja:</label>
                                            <textarea className="form-control" 
                                                      name="motivoBaja" 
                                                      disabled="disabled"
                                                      value={this.state.motivoBaja}
                                                      onChange={this.handleMotivoChange}>  
                                                    </textarea>

                                                    
                                        
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-12">
                                        <label htmlFor="bochones">Bochones Encontrados:</label>
                                        <Select  name="bochones"  
                                                 isMulti
                                                 placeholder={'Seleccione Bochones'} 
                                                 options={optBochones}
                                                 isDisabled
                                                 onChange={this.handleBochonesChange} 
                                                 value={optBochones.filter(({value}) => this.state.bochonesId.includes(value))}
                                                >
                                        </Select>
                                    </div>
                                </div>

                            </fieldset>
                            <br/>
                            <fieldset>
                                <legend >Datos Geográficos</legend>
                                <hr/>


                                  <div className="input-group">

                                  <div className="col-sm-6">
                                            <label htmlFor="exploracion">Exploración (*):</label>
                                            <Select name="exploracion"     
                                                    placeholder={'Seleccione Exploración'}
                                                    options={optExploraciones} 
                                                    isDisabled
                                                    onChange={this.handleExploracionesChange} 
                                                    value={optExploraciones.filter(option => option.value === this.state.exploracionId)}
                                                    className={errors.selectedExploracion ? "error" : ""}
                                                    >
                                                
                                            </Select>
                                
                                  </div>

                                        <div className="col-sm-6">
                                            <label htmlFor="pais">Pais:</label>
                                            <Select name="pais" 
                                                    name="id"    
                                                    placeholder={'Seleccione Pais'}
                                                    options={optPaises}
                                                    isDisabled
                                                    onChange={this.handlePaisChange} 
                                                    value={optPaises.filter(option => option.value === this.state.idPais)}
                                                    >
                                                
                                            </Select>
                                
                                        </div>

                                        

                                    </div>


                                  <div className="input-group">
                                        <div className="col-sm-6">
                                            <label htmlFor="provincia">Provincia:</label>
                                            <Select name="provincia"  
                                                    placeholder={'Seleccione Provincia'}
                                                    onChange={this.handleProvinciaChange} 
                                                    options={optProvincias}
                                                    value={optProvincias.filter(option => option.value === this.state.idProvincia)}
                                                    isDisabled
                                                    >
                                                
                                            </Select>
                                
                                        </div>

                                        <div className="col-sm-6">
                                            <label htmlFor="ciudad">Ciudad:</label>
                                            <Select name="ciudad"  
                                                    placeholder={'Seleccione Ciudad'}
                                                    onChange={this.handleCiudadChange} 
                                                    options={optCiudades}
                                                    isDisabled 
                                                    value={optCiudades.filter(option => option.value === this.state.idCiudad)}>
                                                    
                                            </Select>
                                
                                        </div>

                                    </div>
                            </fieldset>
                            <br/>
   
 
                            <br/>
                            <div className="form-check">
                                <input type="checkbox" 
                                       className="form-check-input" 
                                       id="muestra" 
                                       name="muestra"
                                       checked={this.state.muestra}
                                       disabled="disabled"
                                       onChange={this.handleMuestraChange.bind(this)} />
                                <label className="form-check-label" htmlFor="muestra">Muestra Home</label>
                            </div>

                            <br/>
                              <p>(*) Datos Obligatorios</p>
                            <br/>
                            <div className="form-group">
                                    <div className="col-sm-6">
                                                <button  disabled={isDisabled}  className="btn btn-outline-danger my-2 my-sm-0" 
                                                            type="submit" ><span className="fa fa-trash"></span> Eliminar</button>
                                                &nbsp;&nbsp;
                                               
												
                                                <a className="btn btn-outline-secondary my-2 my-sm-0" 
                                                href="/excavaciones"><span className="fa fa-level-up"></span> Salir</a>
                                    </div>
                            </div>

                            
                            
                            </form>

                            
                            <br/>
                        </div>
                    </div>
            </div>        
        </div>
      );
    }

 


  }
  export default DeleteExcavacion;