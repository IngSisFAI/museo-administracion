import React, {Component} from 'react';
import Select from 'react-select';
import Moment from 'moment';
import axios from 'axios';


const optTipos = [
        { value: 'Encontrado', label: 'Encontrado' },
        { value: 'No Encontrado', label: 'No Encontrado' },
        
      ];

function validate(nombre, selectedTipo, dimensionAlto, dimensionAncho, peso, selectedArea) {
        // true means invalid, so our conditions got reversed
        return {
          nombre: nombre.length === 0,
          dimensionAlto: dimensionAlto.length === 0,
          dimensionAncho: dimensionAncho.length === 0,
          peso: peso.length === 0,
          selectedTipo:  selectedTipo === null,
          selectedArea:  selectedArea === null,

        };
}
      


class DeleteEjemplar extends Component {

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
                idPais:'',
                idProvincia:'',
                idCiudad:'',
                selectedPais:null ,
                selectedProvincia:null ,
                selectedCiudad:null,
                muestraHome: false,
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
                readyProv: false, //controla que cargue una vez al principio las provincias
                readyCity: false,//controla que cargue una vez al principio las ciudades
                readyPais: false,
                readyArea: false,
                paises: [],
                provincias: [],
                ciudades: [],
                areas: [],
                idArea:"",
                readyTipo: false,
                tipoEjemplar:null
        }        
       
      }


       //Antes de cargar el DOM  
      //*********************** 
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


      }


 //una vez cargado en el DOM
 //*************************
  componentDidMount() {
    fetch('http://localhost:3001/api/ejemplarId/'+this.props.match.params.id)
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
                            idArea:ejemplars.ejemplarId.areaHallazgo.nombreArea,
                            idPais:ejemplars.ejemplarId.areaHallazgo.pais,
                            idProvincia:ejemplars.ejemplarId.areaHallazgo.provincia,
                            idCiudad: ejemplars.ejemplarId.areaHallazgo.ciudad,
                            nroColeccion:ejemplars.ejemplarId.nroColeccion,
                            dimensionAncho:ejemplars.ejemplarId.dimensionLargo,
                            dimensionAlto:ejemplars.ejemplarId.dimensionAlto,
                            peso: ejemplars.ejemplarId.peso,
                            alimentacion:ejemplars.ejemplarId.alimentacion,
                            fechaColeccion:fi,
                            ubicacion:ejemplars.ejemplarId.ubicacionMuseo,
                            fotos:ejemplars.ejemplarId.fotosEjemplar,
                            videos:ejemplars.ejemplarId.videosEjemplar,
                            fechaBaja: fb, 
                            motivo: ejemplars.ejemplarId.motivoBaja,
                            nombre:ejemplars.ejemplarId.nombre,
                            periodo2:ejemplars.ejemplarId.periodo,
                            muestra: ejemplars.ejemplarId.home,
                            descripcion1:ejemplars.ejemplarId.descripcion1,
                            descripcion1A:ejemplars.ejemplarId.descripcion1A,
                            descripcion2:ejemplars.ejemplarId.descripcion2,
                            descripcion3: ejemplars.ejemplarId.descripcion3,  
                            perteneceExca: ejemplars.ejemplarId.perteneceExca
                          
                        })
      });
  }


      
      //Manejadores de cada campo
      //*************************

      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };


      handleTipoChange = (selectedTipo) => {
        this.setState({selectedTipo});
        this.setState({tipoEjemplar:selectedTipo.value});
        console.log(`Option selected:`, selectedTipo);
       
      }

      handleNroColeccionChange = evt => {
        this.cambioNumero(evt.target.value );
      };

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

      handleAreasChange = (selectedArea) => {
        this.setState({selectedArea});
        this.setState({idArea: selectedArea.value});
        console.log(`Option selected:`, selectedArea );
       
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
    console.log(selectedProvincia)

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
      //******************************************************

      canBeSubmitted() {
        const errors = validate(this.state.nombre, this.state.selectedTipo, this.state.dimensionAlto, this.state.dimensionAncho, this.state.peso, this.state.selectedArea );
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }


      //submit para actualizar los datos en la BD
      handleSubmit = evt => {
        if (window.confirm("¿Desea eliminar el Ejemplar seleccionado?"))
        {

              evt.preventDefault();

              const idEj=this.props.match.params.id

               axios.delete('http://localhost:3001/api/ejemplar/'+this.props.match.params.id)
                  .then(function(response) {
                  

                    var destinoImg="public/images/ejemplares/imagenes/"+idEj
                    var destinoVideo="public/images/ejemplares/videos/"+idEj
                    
                     axios.get('http://localhost:9000/'+destinoImg)
                     .then(response1 => {
                       
                           console.log("Imagenes eliminadas.")
                         
                     })
                     .catch(function(error) {
                         alert("Error al eliminar. Intente nuevamente. (1)");
                         console.log('Hubo un problema con la petición Fetch:' + error.message);
                     });

                    
                     axios.get('http://localhost:9000/'+destinoVideo)
                     .then(function(response)  {
                              console.log("Se elimino con exito")
                       })
                      .catch(function(error) {
                               alert("Error al eliminar. Intente nuevamente. (2)" );
                               console.log('Hubo un problema con la petición Fetch:' + error.message);
                     });

                     alert('¡Se eliminó el Ejemplar con Éxito!');
                      window.location.href="/ejemplares";   

                  })
                  .catch(function(error) {
                      alert("Error al eliminar. Intente nuevamente.");
                      console.log('Hubo un problema con la petición Fetch:' + error.message);
                  });
              
              return;
    
        }
             
        
      }       
    
    
  //**** FUNCIONES DE PRECARGA ***/

  traerPais()
  { 
    if(!this.state.readyPais)
    {
      if(this.state.idPais!=='')
      {
        this.setState({readyPais:true});
        fetch('/api/pais')
        .then((response) => {
            return response.json()
          })
          .then((countries) => {
            this.setState({paises: countries.paises});
    
          });

          let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
          var paisArr= optPaises.filter(opt => opt.value===this.state.idPais)
          if(paisArr.length>0)
          {
              this.setState({selectedPais:paisArr[0]}) 

          }
          else{

            this.setState({selectedPais:''}) 
          }

      } 
    }
  }


  traerProvincia()
  { var prov=[]

    if(!this.state.readyProv)
    {  
      if(this.state.idPais!=='' && this.state.idProvincia!=='')
      {
        console.log("Id PAis:",this.state.idPais)
        console.log("Id Provincia:",this.state.idProvincia)
        console.log('/api/provinciaIdPais/'+this.state.idPais)
        this.setState({readyProv:true});
        
    
          fetch('/api/provinciaIdPais/'+this.state.idPais)
          .then((response) => {
              return response.json()
            })
            .then((province) => {
              this.setState({ provincias: province.provincias })
            });
         
          console.log("Provincias:",prov)
          let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
          var provinciaArr= optProvincias.filter(opt => opt.value===this.state.idProvincia)
          console.log("Prov ARR:",provinciaArr)
          if(provinciaArr.length>0)
          {
              this.setState({selectedProvincia:provinciaArr[0]}) 

          }
          else{

            this.setState({selectedProvincia:''}) 
          }

      } 
    }
  }

  

    traerCiudades()
    { 
      if(!this.state.readyCity)
      {
        if(this.state.idProvincia!=='' &&  this.state.idCiudad!=='')
        {
          this.setState({readyCity:true});
          
          fetch('/api/ciudadIdProv/'+this.state.idProvincia)
          .then((response) => {
              return response.json()
            })
            .then((cities) => {
              this.setState({ciudades: cities.ciudades});

            });

            let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );
            var ciudadArr= optCiudades.filter(opt => opt.value===this.state.idCiudad)
            if(ciudadArr.length>0)
            {
                this.setState({selectedCiudad:ciudadArr[0]}) 

            }
            else{

              this.setState({selectedCiudad:''}) 
            }


        
        } 
      }
    } 



    traerAreas() 
    { 
      
      if(!this.state.readyArea)
      {

        if(this.state.idArea!=='')
        { 
          this.setState({readyArea:true}); 
          fetch('/api/area')
          .then((response) => {
              return response.json()
            })
            .then((areas2) => {
              this.setState({ areas: areas2.areas })
            });
            
            let optAreas = this.state.areas.map((opt) => ({ label: opt.nombre, value: opt._id }) );
            var areaArr= optAreas.filter(opt => opt.value===this.state.idArea)
            if(areaArr.length>0)
            {
                this.setState({selectedArea:areaArr[0]}) 

            }
            else{

              this.setState({selectedArea:''}) 
            }
           
        } 
      }     

    }

    traerTipo() 
    {
      if(!this.state.readyTipo)
      { 
        if(this.state.tipoEjemplar!==null)
        {  
           this.setState({readyTipo:true}); 
           var tipoSelect=optTipos.filter(option => option.value === this.state.tipoEjemplar)
           this.setState({selectedTipo:tipoSelect[0]})
        }   
      }
    }



    
      render() 
      {
        

        const errors = validate(this.state.nombre, this.state.selectedTipo, this.state.dimensionAlto, this.state.dimensionAncho, this.state.peso, this.state.selectedArea );
        const isDisabled = Object.keys(errors).some(x => errors[x]);


         this.traerProvincia()
         this.traerCiudades()
         this.traerPais()
         this.traerAreas()
         this.traerTipo()
        
     //  console.log("Area seleccionada:", this.state.selectedArea);
        
      /* console.log("Pais seleccionado:", this.state.selectedPais);
        console.log("Provincia seleccionada:", this.state.selectedProvincia);
        console.log("Ciudad seleccionada:", this.state.selectedCiudad);*/
        

        let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optAreas = this.state.areas.map((opt) => ({ label: opt.nombre, value: opt._id }) );
   
        return (
          
            <div className="row">
                <div className="col-md-12">
                    <div id="contenido" align="left" className="container">
                        <h3 className="page-header" align="left"><i class="fa fa-paw" aria-hidden="true"></i> Eliminar Ejemplar</h3>  
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
                                                    disabled="disabled"
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
                                                    isDisabled
                                                    onChange={this.handleTipoChange} 
                                                    value={optTipos.filter(option => option.value === this.state.tipoEjemplar)}
                                                    >
                                                
                                         </Select>

                                </div>

                                   
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="nroColeccion" >Nro. Colección:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    disabled="disabled"
                                                    name="nroColeccion"
                                                    value={this.state.nroColeccion}
                                                    onChange={this.handleNroColeccionChange} 
                                                     />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="fechaColeccion" >Fecha Ingreso Colección:</label>
                                            <input type="date" 
                                                    disabled="disabled"
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
                                                <input name="fbaja" type="date" disabled="disabled" className="form-control" value={this.state.fbaja}
                                                onChange={this.handleFbajaChange} /> 
                                          </div>

                                          <div className="col-sm-8">
                                                <label htmlFor="motivo">Motivo Baja:</label>
                                                <textarea name="motivo"  disabled="disabled" className="form-control" value={this.state.motivo } onChange={this.handleMotivoChange} ></textarea> 
                                          </div>


                                    </div>

                                
                                <div className="input-group">
                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="largo" >Dimensión Alto (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="dimensionAlto"
                                                    disabled="disabled"
                                                    value={this.state.dimensionAlto}
                                                    onChange={this.handleDimensionAltoChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="dimensionAncho" >Dimensión Largo (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="dimensionAncho"
                                                    disabled="disabled"
                                                    value={this.state.dimensionAncho}
                                                    onChange={this.handleDimensionAnchoChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="peso" >Peso (*):</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="peso"
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    disabled="disabled"
                                                    value={this.state.formacion}
                                                    onChange={this.handleFormacionChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="grupo" >Grupo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="grupo"
                                                    disabled="disabled"
                                                    value={this.state.grupo}
                                                    onChange={this.handleGrupoChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="subgrupo" >Subgrupo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="subgrupo"
                                                    disabled="disabled"
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
                                                    disabled="disabled"
                                                    value={this.state.edad}
                                                    onChange={this.handleEdadChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="periodo"> Período:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="periodo"
                                                    disabled="disabled"
                                                    value={this.state.periodo}
                                                    onChange={this.handlePeriodoChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="era" >Era:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="era"
                                                    disabled="disabled"
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
                                                    disabled="disabled"
                                                    value={this.state.reino}
                                                    onChange={this.handleReinoChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="filo"> Filo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="filo"
                                                    disabled="disabled"
                                                    value={this.state.filo}
                                                    onChange={this.handleFiloChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="clase" >Clase:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="clase"
                                                    disabled="disabled"
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
                                                    disabled="disabled"
                                                    value={this.state.orden}
                                                    onChange={this.handleOrdenChange} 
                                                    />  
                                    </div>
                                    <div className="col-sm-4">
                                        
                                            <label htmlFor="familia"> Familia:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="familia"
                                                    disabled="disabled"
                                                    value={this.state.familia}
                                                    onChange={this.handleFamiliaChange} 
                                                    /> 
                                                    
                                    </div>

                                    <div className="col-sm-4">
                                            
                                            <label htmlFor="genero" >Género:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="genero"
                                                    disabled="disabled"
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
                                                    disabled="disabled"
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
                                                    isDisabled
                                                    onChange={this.handleAreasChange} 
                                                    value={optAreas.filter(option => option.value === this.state.idArea)}
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
                                                    clear   
                                                    placeholder={'Seleccione Provincia'}
                                                    onChange={this.handleProvinciaChange} 
                                                    options={optProvincias}
                                                    isDisabled
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
                                                    isDisabled
                                                    value={optCiudades.filter(option => option.value === this.state.idCiudad)}>
                                               
                                            </Select>
                                
                                        </div>

                                    </div>


                                <br/>
                            <div className="form-check">
                                <input type="checkbox" 
                                       className="form-check-input" 
                                       id="muestra" 
                                       name="muestra"
                                       disabled="disabled"
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
                                    <button   className="btn btn-outline-danger my-2 my-sm-0" 
                                                            type="submit" ><span className="fa fa-trash"></span> Eliminar</button>
                                            
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
export default DeleteEjemplar;   