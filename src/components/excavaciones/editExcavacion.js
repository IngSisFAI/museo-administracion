import React, {Component} from 'react';
import Select from 'react-select';
import Moment from 'moment';
import ModificarExcavacion from '../../areaGeospatial/ModificarExcavacion';




function validate(nombre, codigo, fechaInicio,  selectedExploracion, idAreaExcavacion,  puntoGpsExcavacion) {
  // true means invalid, so our conditions got reversed
   
  return {
    nombre: nombre.length === 0,
    codigo: codigo ? codigo.length === 0 : false,
    fechaInicio: fechaInicio.length === 0,
    selectedExploracion:  selectedExploracion === null,
	idAreaExcavacion: idAreaExcavacion ==='',
	puntoGpsExcavacion:  puntoGpsExcavacion === {}
  };
}




class EditExcavacion extends Component {

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
<<<<<<< Updated upstream
                 readyProv: false, //controla que cargue una vez al principio las provincias
                 readyCity: false,//controla que cargue una vez al principio las ciudades
                 readyPais: false,
                 puntoGpsExcavacion: '',
                 idAreaExcavacion: '',
                 readyDirector: false,
                 readyColector: false,
                 readyPaleontologo: false,
                 readyExploracion: false
=======
                 puntoGpsExcavacion: '',
                 idAreaExcavacion: ''
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    this.traerProvincias()
    this.traerCiudades()
    this.traerPaises()
    this.traerDirectores()
    this.traerColectores()
    this.traerPaleontologos()
    this.traerExploraciones()
=======

>>>>>>> Stashed changes

    fetch('http://localhost:3001/api/excavacionId/'+this.props.match.params.id)
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
		  
          //console.log("Bochones BD: ",excavacions.excavacionId.bochonesEncontrados)

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
                          selectedPaleontologo: excavacions.excavacionId.paleontologo,
						  idAreaExcavacion: excavacions.excavacionId.idArea,
						  puntoGpsExcavacion: excavacions.excavacionId.puntoGps

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
   // console.log(`Option selected:`, this.state.exploracionId );
   
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
        this.setState({provincias: estados.provincias , selectedPais, idPais:selectedPais.value, ciudades:[], selectedCiudad:null});

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

  setPuntoGpsExcavacion = puntoGps => this.setState({puntoGpsExcavacion: puntoGps})

  setIdAreaExcavacion = idArea => this.setState({idAreaExcavacion: idArea});

  //SUBMIT para almacenar la info en la BD
  handleSubmit = evt => {
    if (this.canBeSubmitted()) 
    {
          evt.preventDefault();
          
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

<<<<<<< Updated upstream
          var idCountry=''
          if(this.state.selectedPais!==null)
          {idCountry=this.state.selectedPais.value}
          
          var idProv=''
          if(this.state.selectedProvincia!==null)
          {idProv=this.state.selectedProvincia.value}

          var idCity=''
          if(this.state.selectedCiudad!==null)
          {idCity=this.state.selectedCiudad.value}
=======
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
>>>>>>> Stashed changes

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
            "idCiudad":  idCity
         };

          fetch('http://localhost:3001/api/excavacion/'+this.props.match.params.id, {
          method: 'put',
          body: JSON.stringify(data),
          headers:{
                    'Content-Type': 'application/json'
                  }      
          })
          .then(function(response) {
            if(response.ok) {
              alert("¡Se actualizó la Excavacion con Éxito!");
              window.location.href="/excavaciones"; 
            } 
          })
          .catch(function(error) {
            alert("Error al guardar. Intente nuevamente.");
            console.log('Hubo un problema con la petición Fetch:' + error.message);
          });
    
    return;

         
    }
  }      

  canBeSubmitted() {
    const errors = validate(this.state.nombre, this.state.codigo, this.state.fechaInicio, this.state.selectedExploracion, this.state.idAreaExcavacion,  this.state.puntoGpsExcavacion );
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
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

<<<<<<< Updated upstream
    traerDirectores()
    { 
      
      if(!this.state.readyDirector)
      {

        if(this.state.directorId!=='')
        { 
          this.setState({readyDirector:true}); 
          fetch('/api/persona')
          .then((response) => {
              return response.json()
            })
            .then((empleados) => {
              this.setState({ directores: empleados.personas })

            });
            
            
            let optDirectores = this.state.directores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
            var directorArr= optDirectores.filter(opt => opt.value===this.state.directorId)
            if(directorArr.length>0)
            {
                this.setState({selectedDirector:directorArr[0]}) 

            }
            else{

              this.setState({selectedDirector:''}) 
            }
        } 
      }     

    }


    traerColectores()
    { 
      
      if(!this.state.readyColector)
      {

        if(this.state.colectorId!=='')
        { 
          this.setState({readyColector:true}); 
          fetch('/api/persona')
          .then((response) => {
              return response.json()
            })
            .then((empleados) => {
              this.setState({ colectores: empleados.personas })

            });
            
            
            let optColectores = this.state.colectores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
            var colectorArr= optColectores.filter(opt => opt.value===this.state.colectorId)
            if(colectorArr.length>0)
            {
                this.setState({selectedColector:colectorArr[0]}) 

            }
            else{

              this.setState({selectedColector:''}) 
            }
        } 
      }     

    }

    traerPaleontologos()
    { 
      
      if(!this.state.readyPaleontologo)
      {

        if(this.state.paleontologoId!=='')
        { 
          this.setState({readyPaleontologo:true}); 
          fetch('/api/persona')
          .then((response) => {
              return response.json()
            })
            .then((empleados) => {
              this.setState({ paleontologos: empleados.personas })

            });
            
            
            let optPaleontologo = this.state.paleontologos.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
            var paleontologoArr= optPaleontologo.filter(opt => opt.value===this.state.paleontologoId)
            if(paleontologoArr.length>0)
            {
                this.setState({selectedPaleontologo:paleontologoArr[0]}) 

            }
            else{

              this.setState({selectedPaleontologo:''}) 
            }
        } 
      }     

    }

    traerExploraciones() 
    { 
      
      if(!this.state.readyExploracion)
      {

        if(this.state.exploracionId!=='')
        { 
          this.setState({readyExploracion:true}); 
          fetch('/api/exploracion')
          .then((response) => {
              return response.json()
            })
            .then((exploracions) => {
              this.setState({ exploraciones: exploracions.exploraciones })

            });
            
            
            let optExploraciones = this.state.exploraciones.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
            var exploracionArr= optExploraciones.filter(opt => opt.value===this.state.exploracionId)
            if(exploracionArr.length>0)
            {
                this.setState({selectedExploracion:exploracionArr[0]}) 

            }
            else{

              this.setState({selectedExploracion:''}) 
            }
        } 
      }     

    }


    render() {
     const errors = validate(this.state.nombre, this.state.codigo, this.state.fechaInicio, this.state.selectedExploracion);
     const isDisabled = Object.keys(errors).some(x => errors[x]);
=======
 


    render() {
     const errors = validate(this.state.nombre, this.state.codigo, this.state.fechaInicio, this.state.selectedExploracion , this.state.idAreaExcavacion,  this.state.puntoGpsExcavacion);
     const isDisabled = Object.keys(errors).some(x => errors[x]);
	 
>>>>>>> Stashed changes

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
           
            <br/>
            <br/>
            <div className="row">
                  <div className="col-md-12">
                        <div id="contenido" align="left" className="container">
                            <h3 className="page-header" align="left"><i class="fa fa-compass" aria-hidden="true"></i>  Editar Excavación</h3>  
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
                                                value={this.state.codigo}
                                                disabled="disabled"
                                                onChange={this.handleCodigoChange}  />     
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="colector">Colector:</label>
                                        <Select name="colector"  
                                                placeholder={'Seleccione Colector'} 
                                                options={optColectores}
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
                                                    value={this.state.fechaInicio}
                                                    onChange={this.handleFinicioChange}
                                                    />
                                    </div>

                                    <div className="col-sm-4">  
                                        <label >Fecha Baja:</label>
                                        <input type="date" 
                                                className="form-control" 
                                                name="fbaja" 
                                                value={this.state.fbaja}
                                                onChange={this.handleFbajaChange}

                                                  />
                                    </div>
                                

                                    <div className="col-sm-4">
                                            <label >Motivo Baja:</label>
                                            <textarea className="form-control" 
                                                      name="motivoBaja" 
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
<<<<<<< Updated upstream
                                <ModificarExcavacion
                                  excavacionId={this.props.match.params.id}
                                  setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
                                  setIdAreaExcavacion={this.setIdAreaExcavacion}
                                />
=======
                               
>>>>>>> Stashed changes

                                  <div className="input-group">

                                  <div className="col-sm-6">
                                            <label htmlFor="exploracion">Exploración (*):</label>
                                            <Select name="exploracion"     
                                                    placeholder={'Seleccione Exploración'}
                                                    options={optExploraciones} 
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
                                                    
                                                    >
                                                
                                            </Select>
                                
                                        </div>

                                        <div className="col-sm-6">
                                            <label htmlFor="ciudad">Ciudad:</label>
                                            <Select name="ciudad"  
                                                    placeholder={'Seleccione Ciudad'}
                                                    onChange={this.handleCiudadChange} 
                                                    options={optCiudades} 
                                                    value={optCiudades.filter(option => option.value === this.state.idCiudad)}>
                                               
                                            </Select>
                                
                                        </div>

                                    </div>
                            </fieldset>
                            <br/>
							
							 <ModificarExcavacion
							      idExploracion={this.state.selectedExploracion}
                                  excavacionId={this.props.match.params.id}
                                  setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
                                  setIdAreaExcavacion={this.setIdAreaExcavacion}
                                />
   
 
                            <br/>
                            <div className="form-check">
                                <input type="checkbox" 
                                       className="form-check-input" 
                                       id="muestra" 
                                       name="muestra"
                                       checked={this.state.muestra}
                                       onChange={this.handleMuestraChange.bind(this)} />
                                <label className="form-check-label" htmlFor="muestra">Muestra en Página Web?</label>
                            </div>

                            <br/>

                            <br/>
                              <p>(*) Datos Obligatorios</p>
                            <br/>
                            <div className="form-group">
                                    <div className="col-sm-6">
                                                <button  disabled={isDisabled}  className="btn btn-outline-primary my-2 my-sm-0" 
                                                            type="submit" ><span className="fa fa-floppy-o"></span> Actualizar</button>
                                                &nbsp;&nbsp;
                                               
												
                                                <a className="btn btn-outline-secondary my-2 my-sm-0" 
                                                href="/excavaciones"><span className="fa fa-level-up"></span> Cancelar</a>
                                    </div>
                            </div>
                            </form>

                            <br/>
                            <br/>
                            

                            <br/>
                        </div>
                    </div>
            </div>        
        </div>
      );
    }

 


  }
  export default EditExcavacion;