import React, {Component} from 'react';
import Select from 'react-select';


function validate(nombre, codigo, fechaInicio,  selectedExploracion) {
  // true means invalid, so our conditions got reversed
  return {
    nombre: nombre.length === 0,
    codigo: codigo.length === 0,
    fechaInicio: fechaInicio.length === 0,
    selectedExploracion:  selectedExploracion === null
  };
}



class AddExcavacion extends Component {

    constructor(props) {
        super(props);
        this.state = {
                     colectores:[],
                     directores:[],
                     paleontologos:[],
<<<<<<< HEAD
                     bochones: [],
=======
              //       bochones: [],
>>>>>>> 2612c23c0459c228666e70167540712941074266
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
                     selectedDirector: null,
                     selectedPaleontologo: null,
                     muestra: false,
                     puntoGPS: '',
                     idArea: '',
                     bochonesId:''
               };
        
               
      }

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
        console.log(selectedColector);
      }

      handleDirectorChange = (selectedDirector) => {
        this.setState({selectedDirector});
      }

      handlePaleontologoChange = (selectedPaleontologo) => {
        this.setState({selectedPaleontologo});
      }



<<<<<<< HEAD
      handleBochonesChange = (selectedBochones) => {
=======
    /*  handleBochonesChange = (selectedBochones) => {
>>>>>>> 2612c23c0459c228666e70167540712941074266
        let bochons = Array.from(selectedBochones, option => option.value);
        this.setState({selectedBochones});
        this.setState({bochonesId:bochons});
        console.log(`Option selected:`, bochons );
       
<<<<<<< HEAD
      }
=======
      }*/
>>>>>>> 2612c23c0459c228666e70167540712941074266

      handleExploracionesChange = (selectedExploracion) => {
        this.setState({selectedExploracion});
        console.log(`Option selected:`, selectedExploracion );
       
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
            this.setState({provincias: estados.provincias , selectedPais});

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
            this.setState({ciudades: cities.ciudades , selectedProvincia});

          });
      }

      handleCiudadChange = (selectedCiudad) => {
        this.setState({selectedCiudad});
      }


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
<<<<<<< HEAD
                "bochonesEncontrados": this.state.bochonesId,
=======
               // "bochonesEncontrados": this.state.bochonesId,
>>>>>>> 2612c23c0459c228666e70167540712941074266
                "idArea": this.state.idArea,
                "puntoGPS": this.state.puntoGPS,
                "muestraHome": this.state.muestra,
                "idExploracion": idExploracion,
                "idPais":idCountry,
                "idProvincia": idProv,
                "idCiudad":  idCity
               
    
             };
<<<<<<< HEAD
              /*
              var data = {
                "nombre": this.state.nombre,
                "descripcion": this.state.descripcion,
                "codigo": this.state.codigo,
                "fechaInicio": this.state.fechaInicio,
                "fechaBaja": this.state.fbaja, 
                "motivoBaja": this.state.motivoBaja,
                "directorId": this.state.selectedDirector.value,
                "director": this.state.selectedDirector.label,
                "colector": this.state.selectedColector.value,
                "paleontologo": this.state.selectedPaleontologo.value,
                "bochonesEncontrados": this.state.bochonesId,
                "idArea": this.state.idArea,
                "puntoGPS": this.state.puntoGPS,
                "muestraHome": this.state.muestra,
                 "idPais": this.state.selectedPais.value,
                "idExploracion":this.state.selectedExploracion.value,
                "idProvincia": this.state.selectedProvincia.value,
                "idCiudad":  this.state.selectedCiudad.value*/
               /* "idExploracion": {"type": this.state.selectedPais.value, "ref":'Exploracion'},
                "idPais": {"type": this.state.selectedExploracion.value, "ref":'Pais'},
                "idProvincia": {"type": this.state.selectedProvincia.value, "ref":'Provincia'},
                "idCiudad": {"type": this.state.selectedCiudad.value, "ref":'Ciudad'}


        };*/

=======
              
>>>>>>> 2612c23c0459c228666e70167540712941074266
             fetch('api/excavacion', {
              method: 'post',
              body: JSON.stringify(data),
              headers:{
                        'Content-Type': 'application/json'
                      }      
              })
              .then(function(response) {
                if(response.ok) {
                  alert("¡Se guardó la Excavacion con Éxito!");
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
        const errors = validate(this.state.nombre, this.state.codigo, this.state.fechaInicio, this.state.selectedExploracion );
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }

      handleBlur = evt => {
        
      
        fetch('/api/excavacionFiltroCode/'+evt.target.value)
        .then((response) => {
            return response.json()
          })
          .then((excavacions) => {
            console.log(excavacions.excavaciones.length)
             if(excavacions.excavaciones.length>0)
              {
                alert("Existe Excavación con ese Código. Ingrese uno correcto."); 
                this.setState({codigo:''});
                document.getElementById('codigo').focus();
              }
             
          });
        

      };


    render() 
    {
      
    const errors = validate(this.state.nombre, this.state.codigo, this.state.fechaInicio, this.state.selectedExploracion);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    const { selectedPais } = this.state; 
    const { selectedProvincia } = this.state; 
    const { selectedCiudad } = this.state;

    const { selectedColector } = this.state; 
    const { selectedDirector } = this.state; 
    const { selectedPaleontologo } = this.state;
    const { selectedExploracion } = this.state;
<<<<<<< HEAD
    const { selectedBochones } = this.state;
=======
   // const { selectedBochones } = this.state;
>>>>>>> 2612c23c0459c228666e70167540712941074266

     
     let optColectores = this.state.colectores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
     let optDirectores = this.state.directores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
     let optPaleontologos = this.state.paleontologos.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
<<<<<<< HEAD
     let optBochones = this.state.bochones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
=======
  //   let optBochones = this.state.bochones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
>>>>>>> 2612c23c0459c228666e70167540712941074266
     let optExploraciones = this.state.exploraciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
     let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );
      


      return (
        <div>
            <div className="row">
                  <div className="col-md-12">
                        <div id="contenido" align="left" className="container">
<<<<<<< HEAD
                            <h3 className="page-header" align="left"> Agregar Excavación</h3>  
=======
                            <h3 className="page-header" align="left"><i class="fa fa-compass" aria-hidden="true"></i>  Agregar Excavación</h3>  
>>>>>>> 2612c23c0459c228666e70167540712941074266
                            <hr/>
                            <form className="form-horizontal" onSubmit={this.handleSubmit}> 
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
                                                id="codigo"
                                                value={this.state.codigo}
                                                onChange={this.handleCodigoChange} 
                                                onBlur={this.handleBlur} />     
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="colector">Colector:</label>
                                        <Select name="colector"  
                                                placeholder={'Seleccione Colector'} 
                                                options={optColectores}
                                                onChange={this.handleColectorChange} 
                                                value={selectedColector}>
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
                                                value={selectedDirector} >
                                            
                                        </Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="paleontologo">Paleontólogo:</label>
                                        <Select name="paleontologo"  
                                                placeholder={'Seleccione Paleontologo'} 
                                                options={optPaleontologos}
                                                onChange={this.handlePaleontologoChange} 
                                                value={selectedPaleontologo}>
                                            
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

<<<<<<< HEAD
                                <div className="input-group">
                                    <div className="col-sm-12">
                                        <label htmlFor="bochones">Bochones Encontrados:</label>
                                        <Select  name="bochones"  
                                                 isMulti
                                                 placeholder={'Seleccione Bochones'} 
                                                 options={optBochones}
                                                 onChange={this.handleBochonesChange} 
                                                 value={selectedBochones}
                                                >
                                        </Select>
                                    </div>
                                </div>
=======

>>>>>>> 2612c23c0459c228666e70167540712941074266

                            </fieldset>
                            <br/>
                            <fieldset>
                                <legend >Datos Geográficos</legend>
                                <hr/>
                                  <h4>**ACA IRIA LO REFERENTE A AREA** </h4>

                                  <div className="input-group">

                                  <div className="col-sm-6">
                                            <label htmlFor="exploracion">Exploración (*):</label>
                                            <Select name="exploracion"     
                                                    placeholder={'Seleccione Exploración'}
                                                    options={optExploraciones} 
                                                    onChange={this.handleExploracionesChange} 
                                                    value={selectedExploracion}
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
                                                    value={selectedPais}
                                                    >
                                                
                                            </Select>
                                
                                        </div>

                                        

                                    </div>


                                  <div className="input-group">
                                        <div className="col-sm-6">
                                            <label htmlFor="provincia">Provincia:</label>
                                            <Select name="provincia"  
                                                    clear   
                                                    placeholder={'Seleccione Provincia'}
                                                    onChange={this.handleProvinciaChange} 
                                                    options={optProvincias}
                                                    value={selectedProvincia}
                                                    
                                                    >
                                                
                                            </Select>
                                
                                        </div>

                                        <div className="col-sm-6">
                                            <label htmlFor="ciudad">Ciudad:</label>
                                            <Select name="ciudad"  
                                                    placeholder={'Seleccione Ciudad'}
                                                    onChange={this.handleCiudadChange} 
                                                    options={optCiudades} 
                                                    value={selectedCiudad}>
                                               
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
                                       onChange={this.handleMuestraChange.bind(this)} />
<<<<<<< HEAD
                                <label className="form-check-label" htmlFor="muestra">Muestra Home</label>
=======
                                <label className="form-check-label" htmlFor="muestra">Muestra en Página Web?</label>
>>>>>>> 2612c23c0459c228666e70167540712941074266
                            </div>

                            <br/>
                              <p>(*) Datos Obligatorios</p>
                            <br/>
                            <div className="form-group">
                                    <div className="col-sm-6">
                                                <button  disabled={isDisabled}  className="btn btn-outline-primary my-2 my-sm-0" 
                                                            type="submit" ><span className="fa fa-floppy-o"></span> Registrar</button>
                                                &nbsp;&nbsp;
                                               
												
                                                <a className="btn btn-outline-secondary my-2 my-sm-0" 
                                                href="/excavaciones"><span className="fa fa-level-up"></span> Cancelar</a>
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
  export default AddExcavacion;