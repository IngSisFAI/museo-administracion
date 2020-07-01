import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';


function validate(nombre, selectedExcavacion, selectedEjemplar, selectedPieza) {
    // true means invalid, so our conditions got reversed
    return {
      nombre: nombre.length === 0,
      selectedExcavacion:  selectedExcavacion === null,
      selectedEjemplar:  selectedEjemplar === null
      
    };
}
//selectedPieza:  selectedPieza === null
class AddBochon extends Component {

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
                bochonesEncontrados:[]
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
    

    handleNombreChange = evt => {
        this.setState({nombre: evt.target.value });
      };

    handleNroCampoChange = evt => {
        this.setState({nroCampo: evt.target.value });
      }; 
      
    handleExcavacionChange = (selectedExcavacion) => {
        this.setState({selectedExcavacion});
        console.log(`Option selected:`, selectedExcavacion );
       
    } 


    handlePreparadorChange = (selectedPreparador) => {
        this.setState({selectedPreparador});
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
            this.setState({piezas: pieces.pieza , selectedEjemplar});

          });
       
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

    canBeSubmitted() {
        const errors = validate(this.state.nombre, this.state.selectedExcavacion, this.state.selectedEjemplar, this.state.selectedPieza);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }
    
    handleSubmit = evt => {
			      
        if (this.canBeSubmitted()) 
        {
              evt.preventDefault();

              var idExcavacion=''
              if(this.state.selectedExcavacion!==null)
              {idExcavacion=this.state.selectedExcavacion.value}

              var idEjemplar=''
              if(this.state.selectedEjemplar!==null)
              {idEjemplar=this.state.selectedEjemplar.value}

              var idPieza=''
              if(this.state.selectedPieza!==null)
              {idPieza=this.state.selectedPieza.value}

              var idPreparador=''
              var preparador=''
              if(this.state.selectedPreparador!==null)
              {idPreparador=this.state.selectedPreparador.value
               preparador=this.state.selectedPreparador.label
              }

              var tipoPreparacion=''
              if(this.state.selectedTipoPreparacion!==null)
              {tipoPreparacion=this.state.selectedTipoPreparacion.label}

              var idAcido=''
              if(this.state.selectedAcido!==null)
              {idAcido=this.state.selectedAcido.value}


              var data = {
                "nombre": this.state.nombre,
                "nroCampo": this.state.nroCampo,
                "preparador": preparador,
                "preparadorID": idPreparador,
                "tipoPreparacion": tipoPreparacion, 
                "acidosAplicados": this.state.acidosId,
                "ejemplarAsociado": idEjemplar,
                "excavacionId": idExcavacion,
                "piezaId": idPieza
              };

              fetch('api/bochon', {
                method: 'post',
                body: JSON.stringify(data),
                headers:{
                          'Content-Type': 'application/json'
                        }      
                })
                .then(function(response) {
                  if(response.ok) {
                    console.log("¡Se guardó el Bochón con Éxito!");
                  //  alert("¡Se guardó el Bochón con Éxito!");
                   // window.location.href="/bochones"; 
                  } 
                })
                .catch(function(error) {
                  alert("Error al guardar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch:' + error.message);
                });

                  //insertar
                ///1.Buscar la excavacion 2. Obtener el array de bochones
                //3.Agregar el id al array 4. actualizar excavaciones
                //modificar : no permito cambiar la excavacion, si quiero modificar elimino y cargo de nuevo
                //eliminar: si elimino bochon lo tengo q eliminar de excavacion
                var bochones=[]
                var nombreBochon=this.state.nombre
                axios.get('api/excavacionId/'+idExcavacion)
                .then(function(response) {
                   bochones=response.data.excavacionId.bochonesEncontrados;
                   var id="";
                   axios.get('api/bochonUnNombre/'+nombreBochon)
                   .then(function(response) {
                     
                        id=response.data.bochon._id;
                        //agrego el bochon a arreglo de bochones encontrados
                        bochones.push(id)
                        var data1 = {
                         "bochonesEncontrados": bochones
                        }
   
                        axios.put("api/excavacionBochon/"+idExcavacion, data1, {
                         headers:{
                           'Content-Type': 'application/json'
                         }   
                        }).then(response => {
                          
                              alert("¡Se guardó el Bochón con Éxito!");
                               window.location.href="/bochones"; 
   
                          
                        })
                        .catch(error => {
                          console.log(error);
                        });
   
                     })
                     .catch(function (error) {
                      console.log(error);
                    }); 

          
                })
                    .catch(function (error) {
                    console.log(error);
                }); 
                
                


          
          return;

              


        }
    }            
    


    render() 
    {
        const errors = validate(this.state.nombre, this.state.selectedExcavacion, this.state.selectedEjemplar, this.state.selectedPieza);
        const isDisabled = Object.keys(errors).some(x => errors[x]); 

        const { selectedExcavacion } = this.state;
        const { selectedPreparador } = this.state;
        const { selectedEjemplar } = this.state;
        const { selectedPieza } = this.state;
        const { selectedAcido } = this.state;
        const { selectedTipoPreparacion } = this.state;

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
                        <h3 className="page-header" align="left"><i className="fa fa-hand-lizard-o" aria-hidden="true"></i>  Agregar Bochón</h3>  
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
                                    <div className="col-sm-12">
                                            <label htmlFor="excavacion">Excavación (*):</label>
                                            <Select name="excavacion" 
                                                    placeholder={'Seleccione Excavación'}
                                                    options={optExcavacion} 
                                                    onChange={this.handleExcavacionChange} 
                                                    value={selectedExcavacion}

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
                                                    onChange={this.handleEjemplarChange} 
                                                    value={selectedEjemplar}
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
                                                    value={selectedPieza}
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
                                                    value={this.state.nroCampo}
                                                    onChange={this.handleNroCampoChange}
                                                     />  
                                    </div>
                                    <div className="col-sm-6">
                                            <label htmlFor="preparador">Preparador:</label>
                                            <Select name="preparador" 
                                                    placeholder={'Seleccione Preparador'}
                                                    options={optPreparador} 
                                                    onChange={this.handlePreparadorChange} 
                                                    value={selectedPreparador}
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
                                                    onChange={this.handleTipoPreparacionChange} 
                                                    value={selectedTipoPreparacion}
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
                                                    onChange={this.handleAcidoChange} 
                                                    value={selectedAcido}
                                                    >
                                            </Select>
                                    </div>
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
export default AddBochon;  