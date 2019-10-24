import React, {Component} from 'react';
import Select from 'react-select';


const optTipos = [
        { value: 'Encontrado', label: 'Encontrado' },
        { value: 'No Encontrado', label: 'No Encontrado' },
        
      ];

function validate(nombre, selectedTipo, dimensionAlto, dimensionAncho, peso, selectedArea, selectedColeccion) {
        // true means invalid, so our conditions got reversed
        return {
          nombre: nombre.length === 0,
          dimensionAlto: dimensionAlto.length === 0,
          dimensionAncho: dimensionAncho.length === 0,
          peso: peso.length === 0,
          selectedTipo:  selectedTipo === null,
          selectedArea:  selectedArea === null,
          selectedColeccion:  selectedColeccion === null,

        };
}
      


class AddEjemplar extends Component {

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
                paises: [],
                selectedPais:null ,
                provincias:[],
                selectedProvincia:null ,
                ciudades:[],
                selectedCiudad:null,
                muestraHome: false,
                areas: [],
                selectedArea: null,
                selectedTipo: null,
                fbaja:"",
                motivo:"",
                ilustracionCompleta:"",
                descripcionIC:"",
                periodo2:"",
                perteneceExca:"",
                fotos:[],
                videos:[],
                colecciones:[],
                selectedColeccion:null 
        }        
       
      }


      //carga los select al iniciar el componente
      componentWillMount() {

          fetch('/api/pais')
          .then((response) => {
              return response.json()
            })
            .then((countries) => {
              this.setState({paises: countries.paises })
            });

        fetch('/api/area')
        .then((response) => {
            return response.json()
          })
          .then((areas2) => {
            this.setState({ areas: areas2.areas })
          });

          fetch('/api/coleccion')
        .then((response) => {
            return response.json()
          })
          .then((collection) => {
            this.setState({ colecciones: collection.colecciones })
          });


      }
      
      //Manejadores de cada campo 
      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };


      handleTipoChange = (selectedTipo) => {
        this.setState({selectedTipo});
        console.log(`Option selected:`, selectedTipo);
       
      }

     /* handleNroColeccionChange = evt => {
        this.cambioNumero(evt.target.value );
      };*/

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


      handleAreasChange = (selectedArea) => {
        this.setState({selectedArea});
        console.log(`Option selected:`, selectedArea );
       
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

      handleMuestraChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivo: evt.target.value });
      };


      // Funciones y manejadores para validar/almacenar datos
      
      canBeSubmitted() {
        const errors = validate(this.state.nombre, this.state.selectedTipo, this.state.dimensionAlto, this.state.dimensionAncho, this.state.peso, this.state.selectedArea );
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }


      handleSubmit = evt => {
			      
        if (this.canBeSubmitted()) 
        {
              evt.preventDefault();

              var idCountry=''
              if(this.state.selectedPais!==null)
              {idCountry=this.state.selectedPais.value}
              
              var idProv=''
              if(this.state.selectedProvincia!==null)
              {idProv=this.state.selectedProvincia.value}
    
              var idCity=''
              if(this.state.selectedCiudad!==null)
              {idCity=this.state.selectedCiudad.value}


              var eraGeo={
                "formacion":this.state.formacion,
                "grupo":this.state.grupo,
                "subgrupo":this.state.subgrupo,
                "edad":this.state.edad,
                "periodo":this.state.periodo,
                "era":this.state.era
              };

              var areaH={
                "nombreArea":this.state.selectedArea.value,
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
                "home": this.state.muestra,
                "descripcion1":this.state.descripcion1,
                "descripcion1A":this.state.descripcion1A,
                "descripcion2":this.state.descripcion2,
                "descripcion3": this.state.descripcion3,  
                "perteneceExca":this.state.perteneceExca
             };

             fetch('api/ejemplar', {
                method: 'post',
                body: JSON.stringify(data),
                headers:{
                          'Content-Type': 'application/json'
                        }      
                })
                .then(function(response) {
                  if(response.ok) {
                    alert("¡Se guardó el Ejemplar con Éxito!");
                    window.location.href="/ejemplares"; 
                  } 
                })
                .catch(function(error) {
                  alert("Error al guardar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch:' + error.message);
                });
          
          return;

        }
    }        


    
      render() 
      {
        

        const errors = validate(this.state.nombre, this.state.selectedTipo, this.state.dimensionAlto, this.state.dimensionAncho, this.state.peso, this.state.selectedArea, this.state.selectedColeccion );
        const isDisabled = Object.keys(errors).some(x => errors[x]);

        const { selectedPais } = this.state; 
        const { selectedProvincia } = this.state; 
        const { selectedCiudad } = this.state;
        const { selectedArea } = this.state;
        const { selectedTipo } = this.state;
        const { selectedColeccion} = this.state;

        let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optAreas = this.state.areas.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optColecciones = this.state.colecciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
   
        return (
          
            <div className="row">
                <div className="col-md-12">
                    <div id="contenido" align="left" className="container">
                        <h3 className="page-header" align="left"><i class="fa fa-paw" aria-hidden="true"></i> Agregar Ejemplar</h3>  
                        <hr/>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}> 
                            <fieldset>
                                <legend >Datos Básicos</legend>
                                <hr/>
                                
                                <div className="input-group">
                                    <div className="col-sm-12">
                                        
                                            <label htmlFor="nombre" >Nombre (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="nombre"
                                                    value={this.state.nombre}
                                                    onChange={this.handleNombreChange} 
                                                     />  
                                    </div>
                                </div>

                                <div className="input-group">

                                <div className="col-sm-4">
                                        
                                        <label htmlFor="tipoEjemplar" >Tipo Ejemplar (*):</label>
                                        <Select name="tipoEjemplar"     
                                                    placeholder={'Seleccione Tipo'}
                                                    options={optTipos} 
                                                    onChange={this.handleTipoChange} 
                                                    value={selectedTipo}
                                                    >
                                                
                                         </Select>

                                </div>

                                   
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="nroColeccion" > Colección (*):</label>
                                            <Select name="nroColeccion"     
                                                    placeholder={'Seleccione Colección'}
                                                    options={optColecciones} 
                                                    onChange={this.handleColeccionesChange} 
                                                    value={selectedColeccion}
                                                    >
                                                
                                            </Select>
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="fechaColeccion" >Fecha Ingreso Colección:</label>
                                            <input type="date" 
                                                    className="form-control" 
                                                    name="fechaColeccion"
                                                    value={this.state.fechaColeccion} 
                                                    onChange={this.handleFechaColeccionChange}
                                                     />  
                                    </div>
                        
                                </div>

                                <div className="input-group">
                                    
                                

                                          <div className="col-sm-4">
                                                <label htmlFor="fbaja">Fecha Baja:</label>
                                                <input name="fbaja" type="date" className="form-control" value={this.state.fbaja}
                                                onChange={this.handleFbajaChange} /> 
                                          </div>

                                          <div className="col-sm-8">
                                                <label htmlFor="motivo">Motivo Baja:</label>
                                                <textarea name="motivo"  className="form-control" value={this.state.motivo } onChange={this.handleMotivoChange} ></textarea> 
                                          </div>


                                    </div>

                                
                                <div className="input-group">
                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="largo" >Dimensión Alto (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="dimensionAlto"
                                                    value={this.state.dimensionAlto}
                                                    onChange={this.handleDimensionAltoChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="dimensionAncho" >Dimensión Largo (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="dimensionAncho"
                                                    value={this.state.dimensionAncho}
                                                    onChange={this.handleDimensionAnchoChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="peso" >Peso (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="peso"
                                                    value={this.state.peso}
                                                    onChange={this.handlePesoChange} 
                                                    />  
                                    </div>
                                </div>  

                                 <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="alimentacion" >Alimentación:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="alimentacion"
                                                    value={this.state.alimentacion}
                                                    onChange={this.handleAlimentacionChange} 
                                                    />  
                                    </div>
                                  </div>  

                                  <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="ubicacion" >Ubicación Museo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="ubicacion"
                                                    value={this.state.ubicacion}
                                                    onChange={this.handleUbicacionChange} 
                                                    />  
                                    </div>
                                  </div> 

                                   <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="descripcion1" >Descripción 1:</label>
                                            <textarea 
                                                    className="form-control" 
                                                    name="descripcion1"
                                                    value={this.state.descripcion1}
                                                    onChange={this.handleDescripcion1Change} 
                                                    >  </textarea>
                                    </div>
                                  </div> 

                                  <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="descripcion1A" >Descripción 1A:</label>
                                           <textarea 
                                                    className="form-control" 
                                                    name="descripcion1A"
                                                    value={this.state.descripcion1A}
                                                    onChange={this.handleDescripcion1AChange} 
                                                    >  </textarea>
                                    </div>
                                  </div> 

                                  <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="descripcion2" >Descripción 2:</label>
                                            <textarea
                                                    className="form-control" 
                                                    name="descripcion2"
                                                    value={this.state.descripcion2}
                                                    onChange={this.handleDescripcion2Change} 
                                                    >  </textarea>
                                    </div>
                                  </div> 

                                  <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="descripcion3" >Descripción 3:</label>
                                            <textarea
                                                    className="form-control" 
                                                    name="descripcion3"
                                                    value={this.state.descripcion3}
                                                    onChange={this.handleDescripcion3Change} 
                                                    >  </textarea>
                                    </div>
                                  </div> 

                                  <br/>   
                                  <legend >Datos Geológicos</legend>
                                <hr/>

                                <div className="input-group">
                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="formacion" >Formación:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="formacion"
                                                    value={this.state.formacion}
                                                    onChange={this.handleFormacionChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="grupo" >Grupo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="grupo"
                                                    value={this.state.grupo}
                                                    onChange={this.handleGrupoChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="subgrupo" >Subgrupo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="subgrupo"
                                                    value={this.state.subgrupo}
                                                    onChange={this.handleSubgrupoChange} 
                                                    />  
                                    </div>
                                </div> 

                                <div className="input-group">
                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="edad" >Edad:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="edad"
                                                    value={this.state.edad}
                                                    onChange={this.handleEdadChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="periodo"> Período:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="periodo"
                                                    value={this.state.periodo}
                                                    onChange={this.handlePeriodoChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="era" >Era:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="era"
                                                    value={this.state.era}
                                                    onChange={this.handleEraChange} 
                                                    />  
                                    </div>
                                </div> 

                                <br/>   
                                  <legend >Taxón</legend>
                                <hr/>

                                <div className="input-group">
                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="reino" >Reino:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="reino"
                                                    value={this.state.reino}
                                                    onChange={this.handleReinoChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="filo"> Filo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="filo"
                                                    value={this.state.filo}
                                                    onChange={this.handleFiloChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="clase" >Clase:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="clase"
                                                    value={this.state.clase}
                                                    onChange={this.handleClaseChange} 
                                                    />  
                                    </div>
                                </div> 

                                <div className="input-group">
                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="orden" >Orden:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="orden"
                                                    value={this.state.orden}
                                                    onChange={this.handleOrdenChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="familia"> Familia:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="familia"
                                                    value={this.state.familia}
                                                    onChange={this.handleFamiliaChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="genero" >Género:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="genero"
                                                    value={this.state.genero}
                                                    onChange={this.handleGeneroChange} 
                                                    />  
                                    </div>
                                </div> 

                                <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="especie" >Especie:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="especie"
                                                    value={this.state.especie}
                                                    onChange={this.handleEspecieChange} 
                                                    />  
                                    </div>
                             </div> 

                             <br/>   
                                  <legend >Área de Hallazgo</legend>
                                <hr/>

                                <div className="input-group">

                                  <div className="col-sm-6">
                                            <label htmlFor="area">Área (*):</label>
                                            <Select name="area"     
                                                    placeholder={'Seleccione Area'}
                                                    options={optAreas} 
                                                    onChange={this.handleAreasChange} 
                                                    value={selectedArea}
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


                                <br/>
                            <div className="form-check">
                                <input type="checkbox" 
                                       className="form-check-input" 
                                       id="muestra" 
                                       name="muestra"
                                       checked={this.state.muestra}
                                       onChange={this.handleMuestraChange.bind(this)}
                                       />
                                <label className="form-check-label" htmlFor="muestra">Muestra en Página Web?</label>
                            </div>

                            <br/>
                              <p>(*) Datos Obligatorios</p>
                            <br/>
                            <div className="form-group">
                                    <div className="col-sm-6">
                                                <button  disabled={isDisabled} className="btn btn-outline-primary my-2 my-sm-0" 
                                                            type="submit" ><span className="fa fa-floppy-o"></span> Registrar</button>
                                                &nbsp;&nbsp;
                                               
												
                                                <a className="btn btn-outline-secondary my-2 my-sm-0" 
                                                href="/ejemplares"><span className="fa fa-level-up"></span> Cancelar</a>
                                    </div>
                            </div>
            
            




                            </fieldset>
                        </form>    
                    </div>
                </div>      
           </div>
        )
      }       

      cambioNumero(event) {
            
        const entrada=event;
        let cant=0;
        for(let x=0; x<entrada.length;x++)
          if (entrada[x]==='0' || entrada[x]==='1' || entrada[x]==='2' 
          || entrada[x]==='3'|| entrada[x]==='4'|| entrada[x]==='5'|| entrada[x]==='6'
          || entrada[x]==='7'|| entrada[x]==='8'|| entrada[x]==='9')
            cant++;
        if (cant===entrada.length)
          this.setState( {
            nroColeccion: entrada
          })
      }

}   
export default AddEjemplar;   