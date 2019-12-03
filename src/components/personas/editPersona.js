import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import Moment from 'moment';
<<<<<<< HEAD
import Imagen from '../../images/personas/Koala.jpg';
=======
//import Imagen from '../../images/personas';
>>>>>>> 2612c23c0459c228666e70167540712941074266



const opciones = [
    { value: 'Geologo', label: 'Geologo' },
    { value: 'Paleontologo', label: 'Paleontologo' },
    { value: 'Ing. en Petroleo', label: 'Ing. en Petroleo' }
  ]

function validate(nombre, apellido, nroDoc) {
    // true means invalid, so our conditions got reversed
    return {
      nombre: nombre.length === 0,
      apellido: apellido.length === 0,
      nroDoc: nroDoc.length === 0
    };
  }


class editPersona extends React.Component {
      
    constructor(props) {
        super(props);
        this.state = {
                          nombre: "",
                          apellido: "",
                          nroDoc:"",
                          finicio: '',
                          fbaja:null,
                          motivo:" ",
                          selectedOption:null,
<<<<<<< HEAD
                          titulos:[],
=======
                          titulos:"",
>>>>>>> 2612c23c0459c228666e70167540712941074266
                          foto:"",
                          everFocusedNombre: false,
                          everFocusedApellido: false,
                          everFocusedNroDoc: false,
                          inFocus: "",
                          selectedFile: null
               };
       this.cambioNumero = this.cambioNumero.bind(this);

      }

      componentDidMount() {
        var feBaja=null;
        axios.get('http://localhost:3001/api/personaId/'+this.props.match.params.id)
            .then(response => {
             
              feBaja=response.data.personaId.fechaBaja
              if(feBaja!=null)
              {
                  feBaja=(Moment(response.data.personaId.fechaBaja).add(1, 'days')).format('YYYY-MM-DD');
              }
             
               this.setState({ 
                    nombre: response.data.personaId.nombres, 
                    apellido: response.data.personaId.apellidos,
                    nroDoc: response.data.personaId.dni,
                    finicio: (Moment(response.data.personaId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
                    fbaja:feBaja,
                    motivo: response.data.personaId.motivoBaja,
                    titulos: response.data.personaId.titulos,
                    foto: response.data.personaId.foto});
                          
                   
            })
            .catch(function (error) {
                console.log(error);
            })
      }

      onClickHandler = () => {
        const data = new FormData() 
        data.append('file', this.state.selectedFile)
        axios.post("http://localhost:8000/upload", data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
            })
          },
        })
         
    }
       

    
    
      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };
    
      handleApellidoChange = evt => {
        this.setState({ apellido: evt.target.value });
      };

      handleNroDocChange = evt => {
         this.cambioNumero(evt.target.value );
       };

      handleFinicioChange = evt => {
        this.setState({ finicio: evt.target.value });
      };

      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivo: evt.target.value });
      };

      handleFotoChange = event => {
       console.log(event.target.files[0])
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
          foto: event.target.value
        })
      };


<<<<<<< HEAD
      handleChange = (selectedOption) => {
=======
      handleTituloChange = evt => {
        this.setState({titulos: evt.target.value });
      };


     /* handleChange = (selectedOption) => {
>>>>>>> 2612c23c0459c228666e70167540712941074266
        let titulos = Array.from(selectedOption, option => option.value);
        this.setState({selectedOption});
        this.setState({titulos});
        console.log(`Option selected:`, titulos );
       
<<<<<<< HEAD
      }
=======
      }*/
>>>>>>> 2612c23c0459c228666e70167540712941074266


    
      handleSubmit = evt => {
         
        if (this.canBeSubmitted()) 
        {
             
          evt.preventDefault();
             
             
              var data = {
                    "nombres": this.state.nombre,
                    "apellidos": this.state.apellido,
                    "dni": this.state.nroDoc,
                    "fechaInicio": this.state.finicio,
                    "titulos": this.state.titulos, 
                    "foto": this.state.foto.replace("C:\\fakepath\\", "\\"),
                    "fechaBaja": this.state.fbaja, 
                    "motivoBaja": this.state.motivo
                 };
              
                 //Codigo para subir el archivo al server
                 //-----------------------------------------------------------------
<<<<<<< HEAD
                const destino= 'src/images/personas/'+this.props.match.params.id
=======
                const destino= 'public/images/personas/'+this.props.match.params.id
>>>>>>> 2612c23c0459c228666e70167540712941074266

   
                const data1 = new FormData() 
                data1.append('file',this.state.selectedFile)
 
                axios.post("http://localhost:8000/upload", data1, {
                       onUploadProgress: ProgressEvent => {
                         this.setState({
                           loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                         })
                       }, headers: { 
                        'Content-Type': undefined,
                        'path': destino
                      }
                     }); 

              //-----------------------------------------------------------------

              fetch('http://localhost:3001/api/persona/'+this.props.match.params.id, {
                    method: 'put',
                    body: JSON.stringify(data),
                    headers:{
                              'Content-Type': 'application/json'
                            }      
                    })
                    .then(function(response) {
                      if(response.ok) {
                        alert("¡Se guardó la Persona con Éxito!");
                        window.location.href="/personas"; 
                      } 
                    })
                    .catch(function(error) {
                      alert("Error al guardar. Intente nuevamente.");
                      console.log('Hubo un problema con la petición Fetch:' + error.message);
                    });
              
              return;
        }
       
      };
    
      canBeSubmitted() {
        const errors = validate(this.state.nombre, this.state.apellido, this.state.nroDoc);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }
    

      render() 
      {
        const errors = validate(this.state.nombre, this.state.apellido, this.state.nroDoc);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        
<<<<<<< HEAD
        
  
=======
       
       const Imagen="http://localhost:3000/images/personas/"+this.props.match.params.id+'/'+this.state.foto;
>>>>>>> 2612c23c0459c228666e70167540712941074266

         
        return (  <div> 
                  <div className="row">
                  <div className="col-md-12">
                        <div id="contenido" align="left" className="container">
<<<<<<< HEAD
                        <h3 className="page-header" align="left"> Editar Persona</h3>  
=======
                        <h3 className="page-header" align="left"> <i class="fa fa-users" aria-hidden="true"></i> Editar Persona</h3>  
>>>>>>> 2612c23c0459c228666e70167540712941074266
                        <hr/>

                              <form className="form-horizontal" onSubmit={this.handleSubmit}>  
                        
                                    <div className="input-group">
                                          <div className="col-sm-4">
                                                <label htmlFor="apellido">Apellidos:</label>
                                                <input name="apellido" type="text" className={errors.apellido ? "error" : ""} className="form-control" value={this.state.apellido}
                                                       onChange={this.handleApellidoChange} /> 
                                          </div>

                                          <div className="col-sm-4">
                                                <label htmlFor="nombre">Nombres:</label>
                                                <input name="nombre"   className={errors.nombre ? "error" : ""} className= "form-control" value={this.state.nombre}
                                                       onChange={this.handleNombreChange} 
                                                       type="text"  /> 
                                                
                                          </div>

                                          <div className="col-sm-4">
                                                <label htmlFor="nroDoc">Nro. Doc.:</label>
                                                <input name="nroDoc" disabled="disabled" className={errors.nroDoc ? "error" : ""}  className="form-control" value={this.state.nroDoc}
                                                  onChange={this.handleNroDocChange} type="text"  /> 
                                          </div>
                                    
                                    </div>


                                    <div className="input-group">
                                    
                                          <div className="col-sm-4">
                                                <label htmlFor="finicio">Fecha Inicio:</label>
                                                <input name="finicio" type="date" value={this.state.finicio}
                                                className="form-control" 
                                                onChange={this.handleFinicioChange} /> 
                                          </div>

                                          <div className="col-sm-4">
                                                <label htmlFor="fbaja">Fecha Baja:</label>
                                                <input name="fbaja" type="date" value={this.state.fbaja} className="form-control" 
                                                onChange={this.handleFbajaChange} /> 
                                          </div>

                                          <div className="col-sm-4">
                                                <label htmlFor="motivo">Motivo Baja:</label>
                                                <textarea name="motivo"  className="form-control" value={this.state.motivo } onChange={this.handleMotivoChange} ></textarea> 
                                          </div>


                                    </div>

                                    <div className="form-group">
                                    <div className="col-sm-12">
                                          <label htmlFor="titulo">Títulos:</label>
                                         
<<<<<<< HEAD
                                            <Select  name="titulo" 
                                                  placeholder={'Seleccione Titulos'} 
                                                  isMulti
                                                  options={opciones} 
                                                  onChange={this.handleChange} 
                                                  value={this.state.titulos.map(opt => ({ label: opt, value: opt }))}
                                                  />
=======
                                          <input name="titulo" type="text" 
                                                className="form-control" value={this.state.titulos} 
                                                onChange={this.handleTituloChange} /> 
>>>>>>> 2612c23c0459c228666e70167540712941074266
                                            
                                                
                                    </div>   
                                    </div>


                                    <div className="input-group">
                                    
                                          <div className="col-sm-6">
                                                <label htmlFor="foto">Foto:</label>
                                                <input name="foto" type="file" 
                                                       className="form-control-file" 
                                                       accept="image/*"  
                                                       onChange={this.handleFotoChange}/> 
                                                        <p style={{color:'#007bff'}}>Archivo Actual: {this.state.foto}</p>
                                          </div>
                                         
                                     </div>
                                     <br/>

                                     <div className="input-group">     
                                          <div className="col-sm-6">
                                                <a href="#myModal" role="button" className="btn btn-outline-success my-2 my-sm-0" 
                                                   data-toggle="modal"><span className="fa fa-level-up"></span>Abrir Foto Personal</a>
                                           </div>

                                    </div>

                                    <br/>

                                    <div className="form-group">
                                    <div className="col-sm-6">
                                                <button  disabled={isDisabled} className="btn btn-outline-primary my-2 my-sm-0" 
                                                            type="submit"><span className="fa fa-floppy-o"></span> Registrar</button>
                                                &nbsp;&nbsp;
                                               
												
                                                <a className="btn btn-outline-secondary my-2 my-sm-0" 
                                                href="/personas"><span className="fa fa-level-up"></span> Cancelar</a>
                                    </div>
                                    </div>

                                    <div id="myModal" className="modal fade" role="dialog">  
                                        <div className="modal-dialog">
                                            <div className="modal-content">      
                                                <div className="modal-header">        
                                                           
                                                    <h4 className="modal-title">Foto</h4>      
                                                </div>      
                                                <div className="modal-body"><img src={Imagen} className="img-rounded" alt="Foto" width="400" height="400" />   </div>      
                                                <div className="modal-footer">        
                                                    <button type="button" className="btn btn-default" data-dismiss="modal">Cerrar</button>     
                                                </div>  
                                            </div>  
                                        </div>
                                    </div>


                        
                              </form>
                        </div>
                  </div>
                  </div>


                 
                  
                        
            </div>        )
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
            nroDoc: entrada
          })
      }

}

export default editPersona;