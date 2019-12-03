import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';

function validate(nombre, selectedExcavacion, selectedEjemplar, selectedPieza) {
    // true means invalid, so our conditions got reversed
    return {
      nombre: nombre.length === 0,
      selectedExcavacion:  selectedExcavacion === null,
      selectedEjemplar:  selectedEjemplar === null,
      selectedPieza:  selectedPieza === null
    };
}

var removeItemFromArr = ( arr, item ) => {
  return arr.filter( e => e !== item );
};

class DeleteBochon extends Component {

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
                readyExcavacion: false,
                readyEjemplar: false,
                readyAcidos: false,
                readyTipoPreparacion: false,
                readyPreparador: false,
                readyPieza: false

        }        
    }

    //carga los select al iniciar el componente
    componentWillMount() {

        fetch('/api/excavacion')
        .then((response) => {
            return response.json()
          })
          .then((excavacions) => {
            this.setState({excavaciones: excavacions.excavaciones})
          });

          fetch('/api/persona')
          .then((response) => {
              return response.json()
            })
            .then((persons) => {
               this.setState({preparadores: persons.personas})
            });

            fetch('/api/ejemplar')
            .then((response) => {
                return response.json()
              })
              .then((ejemplars) => {
                 this.setState({ejemplares: ejemplars.ejemplares})
              });

            fetch('/api/acido')
            .then((response) => {
                return response.json()
              })
              .then((acids) => {
                 this.setState({acidos: acids.acidos})
              });


            fetch('/api/tipoPreparacion')
            .then((response) => {
                return response.json()
              })
              .then((tipos) => {
                 this.setState({tiposPreparacion: tipos.tiposPreparacion})
              });


    }

    //una vez cargado en el DOM
 //*************************
  componentDidMount() {
    fetch('http://localhost:3001/api/bochonId/'+this.props.match.params.id)
    .then((response) => {
        return response.json()
      })
      .then((bochons) => {
        

          this.setState({   nombre: bochons.bochonId.nombre,
                            nroCampo:bochons.bochonId.nroCampo,
                            acidosId:bochons.bochonId.acidosAplicados,
                            idExcavacion:bochons.bochonId.excavacionId,
                            idEjemplar:bochons.bochonId.ejemplarAsociado,
                            idPieza:bochons.bochonId.piezaId,
                            idPreparador:bochons.bochonId.preparadorID,
                            idTipoPreparacion:bochons.bochonId.tipoPreparacion
                        })
      });
    
  }



    handleNombreChange = evt => {
        this.setState({nombre: evt.target.value });
      };

    handleNroCampoChange = evt => {
        this.setState({nroCampo: evt.target.value });
      }; 
      
    handleExcavacionChange = (selectedExcavacion) => {
        this.setState({selectedExcavacion});
        this.setState({idExcavacion: selectedExcavacion.value});
        console.log(`Option selected:`, selectedExcavacion );
       
    } 


    handlePreparadorChange = (selectedPreparador) => {
        this.setState({selectedPreparador});
        this.setState({idPreparador: selectedPreparador.value});
        console.log(`Option selected:`, selectedPreparador );
       
    } 

    handleEjemplarChange = (selectedEjemplar) => {
        this.setState(prevState => ({
            selectedPieza: null
            }
          ));
        
        fetch('/api/piezaEjemplar/'+selectedEjemplar.value)
        .then((response) => {
            return response.json()
          })
          .then((pieces) => {
            this.setState({piezas: pieces.pieza , selectedEjemplar, idEjemplar: selectedEjemplar.value});

          });
       
    } 

    handlePiezaChange = (selectedPieza) => {
        this.setState({selectedPieza});
        this.setState({idPieza: selectedPieza.value});
      }

    handleAcidoChange = (selectedAcido) => {
        let acidos = Array.from(selectedAcido, option => option.label);
        this.setState({selectedAcido});
        this.setState({acidosId:acidos});
        console.log(`Option selected:`, acidos );
       
    } 
    
    handleTipoPreparacionChange = (selectedTipoPreparacion) => {
        this.setState({selectedTipoPreparacion});
        this.setState({idTipoPreparacion: selectedTipoPreparacion.label});
        console.log(`Option selected:`,selectedTipoPreparacion );
       
    } 

    canBeSubmitted() {
        const errors = validate(this.state.nombre, this.state.selectedExcavacion, this.state.selectedEjemplar, this.state.selectedPieza);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }

  

    
    handleSubmit = evt => {
			      
        if (window.confirm("¿Desea eliminar el Bochón seleccionado?"))
        {

              evt.preventDefault();

              var idExcavacion=this.state.idExcavacion
              var bochones=[]
              var item= this.props.match.params.id

              //Para eliminar el bochon busco los bochones asociados a la excavacion, obtengo el array de los bochones
              //encontrados, elimino ese bochon de la lista, actualizo la excavacion y finalmente elimino el bochon.-

              axios.get('http://localhost:3001/api/excavacionId/'+idExcavacion)
              .then(function(response) {
                      
                  bochones=response.data.excavacionId.bochonesEncontrados

                  var bochonesFinal=removeItemFromArr(bochones,item)

                  var data1 = {
                    "bochonesEncontrados": bochonesFinal
                   }

                   axios.put("http://localhost:3001/api/excavacionBochon/"+idExcavacion, data1, {
                    headers:{
                      'Content-Type': 'application/json'
                    }   
                   }).then(response => {
                     
                    fetch('http://localhost:3001/api/bochon/'+item, {
                      method: 'delete',
                      headers:{
                                'Content-Type': 'application/json'
                              }      
                      })
                      .then(function(response) {
                        if(response.ok) {
                          alert("¡Se eliminó el Bochón con Éxito!");
                          window.location.href="/bochones"; 

                        } 
                      })
                      .catch(function(error) {
                        alert("Error al guardar. Intente nuevamente.");
                        console.log('Hubo un problema con la petición Fetch:' + error.message);
                      });
                    

                     
                   })
                   .catch(error => {
                     console.log(error);
                   });

              })
              .catch(function (error) {
                 console.log(error);
              }); 

          
          return;
        } 


    } 
    
    traerExcavaciones() 
    { 
      
      if(!this.state.readyExcavacion)
      {

        if(this.state.idExcavacion!=='')
        { 
          this.setState({readyExcavacion:true}); 
          fetch('/api/excavacion')
          .then((response) => {
              return response.json()
            })
            .then((excavacions) => {
              this.setState({ excavaciones: excavacions.excavaciones })

            });
            
            
            let optExcavaciones = this.state.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
            var excavacionArr= optExcavaciones.filter(opt => opt.value===this.state.eidExcavacion)
            if(excavacionArr.length>0)
            {
                this.setState({selectedExcavacion:excavacionArr[0]}) 

            }
            else{

              this.setState({selectedExcavacion:''}) 
            }
        } 
      }     

    }

    traerEjemplares() 
    { 
      
      if(!this.state.readyEjemplar)
      {

        if(this.state.idEjemplar!=='')
        { 
          this.setState({readyEjemplar:true}); 
          fetch('/api/ejemplar')
          .then((response) => {
              return response.json()
            })
            .then((ejemplars) => {
              this.setState({ ejemplares: ejemplars.ejemplares })

            });
            
            
            let optEjemplares= this.state.ejemplares.map((opt) => ({ label: opt.nombre, value: opt._id }) );
            var ejemplarArr= optEjemplares.filter(opt => opt.value===this.state.idEjemplar)
            if(ejemplarArr.length>0)
            {
                this.setState({selectedEjemplar:ejemplarArr[0]}) 

            }
            else{

              this.setState({selectedEjemplar:''}) 
            }
        } 
      }     

    }


    traerPreparadores() 
    { 
      
      if(!this.state.readyPreparador)
      {

        if(this.state.idPreparador!=='')
        { 
          this.setState({readyPreparador:true}); 
          fetch('/api/persona')
          .then((response) => {
              return response.json()
            })
            .then((persons) => {
              this.setState({ preparadores: persons.personas})

            });
            
            
            let optPersonas= this.state.preparadores.map((opt) => ({ label: opt.nombre, value: opt._id }) );
            var preparadorArr= optPersonas.filter(opt => opt.value===this.state.idPreparador)
            if(preparadorArr.length>0)
            {
                this.setState({selectedPreparador:preparadorArr[0]}) 

            }
            else{

              this.setState({selectedPreparador:''}) 
            }
        } 
      }     

    }

    traerTiposPreparacion() 
    { 
      
      if(!this.state.readyTipoPreparacion)
      {

        if(this.state.idTipoPreparacion!=='')
        { 
          this.setState({readyTipoPreparacion:true}); 
          fetch('/api/tipoPreparacion')
          .then((response) => {
              return response.json()
            })
            .then((tipos) => {
              this.setState({ tiposPreparacion: tipos.tiposPreparacion})

            });
            
            
            let optTiposPreparacion= this.state.tiposPreparacion.map((opt) => ({ label: opt.nombre, value: opt._id }) );
            var tipoArr= optTiposPreparacion.filter(opt => opt.value===this.state.idTipoPreparacion)
            if(tipoArr.length>0)
            {
                this.setState({selectedTipoPreparacion:tipoArr[0]}) 

            }
            else{

              this.setState({selectedTipoPreparacion:''}) 
            }
        } 
      }     

    }


    traerPiezas()
    { 
      if(!this.state.readyPieza)
      {
        if(this.state.idEjemplar!=='' &&  this.state.idPieza!=='')
        {
          this.setState({readyPieza:true});
          
          fetch('/api/piezaEjemplar/'+this.state.idEjemplar)
          .then((response) => {
              return response.json()
            })
            .then((pieces) => {
              this.setState({piezas: pieces.pieza});

            });

            let optPiezas = this.state.piezas.map((opt) => ({ label: opt.identificador, value: opt._id }) );
            var piezaArr= optPiezas.filter(opt => opt.value===this.state.idPieza)
            if(piezaArr.length>0)
            {
                this.setState({selectedPieza:piezaArr[0]}) 

            }
            else{

              this.setState({selectedPieza:''}) 
            }


        
        } 
      }
    } 



    render() 
    {
        const errors = validate(this.state.nombre, this.state.selectedExcavacion, this.state.selectedEjemplar, this.state.selectedPieza);
        const isDisabled = Object.keys(errors).some(x => errors[x]); 

        this.traerExcavaciones()
        this.traerEjemplares()
        this.traerPreparadores()
        this.traerTiposPreparacion() 
        this.traerPiezas() 

        let optExcavacion = this.state.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optPreparador = this.state.preparadores.map((opt) => ({ label: opt.nombres+" "+opt.apellidos, value: opt._id }) );
        let optEjemplar = this.state.ejemplares.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optPieza = this.state.piezas.map((opt) => ({ label: opt.identificador, value: opt._id }) );
        let optAcido = this.state.acidos.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optTipoPreparacion = this.state.tiposPreparacion.map((opt) => ({ label: opt.nombre, value: opt._id }) );


        return (
            <div className="row">
                <div className="col-md-12">
                    <div id="contenido" align="left" className="container">
                        <h3 className="page-header" align="left"><i className="fa fa-hand-lizard-o" aria-hidden="true"></i>  Eliminar Bochón</h3>  
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
                                    <div className="col-sm-12">
                                            <label htmlFor="excavacion">Excavación (*):</label>
                                            <Select name="excavacion" 
                                                    placeholder={'Seleccione Excavación'}
                                                    options={optExcavacion} 
                                                    isDisabled
                                                    onChange={this.handleExcavacionChange} 
                                                    value={optExcavacion.filter(option => option.value === this.state.idExcavacion)}
                                                    >
                                                
                                            </Select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-12">
                                            <label htmlFor="ejemplar">Ejemplar (*):</label>
                                            <Select name="ejemplar" 
                                                    placeholder={'Seleccione Ejemplar'}
                                                    options={optEjemplar} 
                                                    isDisabled
                                                    onChange={this.handleEjemplarChange} 
                                                    value={optEjemplar.filter(option => option.value === this.state.idEjemplar)}
                                                    >
                                                
                                            </Select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-12">
                                            <label htmlFor="piezas">Pieza Asociada (*):</label>
                                            <Select name="piezas" 
                                                    placeholder={'Seleccione Pieza'}
                                                    onChange={this.handlePiezaChange} 
                                                    options={optPieza}
                                                    isDisabled
                                                    value={optPieza.filter(option => option.value === this.state.idPieza)}
                                                    >
                                            </Select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="col-sm-6">
                                        
                                            <label htmlFor="nroCampo" >Nro. Campo:</label>
                                            <input type="text" 
                                                    className="form-control" 
                                                    name="nroCampo"
                                                    disabled="disabled"
                                                    value={this.state.nroCampo}
                                                    onChange={this.handleNroCampoChange}
                                                     />  
                                    </div>
                                    <div className="col-sm-6">
                                            <label htmlFor="preparador">Preparador:</label>
                                            <Select name="preparador" 
                                                    placeholder={'Seleccione Preparador'}
                                                    options={optPreparador} 
                                                    isDisabled
                                                    onChange={this.handlePreparadorChange} 
                                                    value={optPreparador.filter(option => option.value === this.state.idPreparador)}
                                                    >
                                                
                                            </Select>
                                    </div>
                                </div>

                                
                                <div className="input-group">
                                    <div className="col-sm-12">
                                            
                                            <label htmlFor="tipoPreparacion">Tipo Preparación:</label>
                                            <Select name="tipoPreparacion" 
                                                    placeholder={'Seleccione Tipo'}
                                                    options={optTipoPreparacion} 
                                                    isDisabled
                                                    onChange={this.handleTipoPreparacionChange} 
                                                    value={optTipoPreparacion.filter(option => option.label === this.state.idTipoPreparacion)}
                                                    >
                                            </Select>
                                    </div>
                                </div>
                                
                                  

                                <div className="input-group">
                                    <div className="col-sm-12">
                                      <label htmlFor="acidosAplicados">Acidos Aplicados:</label>
                                      <Select name="acidosAplicados" 
                                                    placeholder={'Seleccione Acido'}
                                                    isMulti
                                                    options={optAcido} 
                                                    isDisabled
                                                    onChange={this.handleAcidoChange} 
                                                    value={optAcido.filter(({label}) => this.state.acidosId.includes(label))}
                                                    >
                                            </Select>
                                    </div>
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
                                                href="/bochones"><span className="fa fa-level-up"></span> Cancelar</a>
                                    </div>
                            </div>

                            </fieldset>    
                        </form>
                    </div>
                </div>
           </div>         
        )
    }
} 
export default DeleteBochon;  