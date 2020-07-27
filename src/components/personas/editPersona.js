import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import Moment from 'moment';
//import Imagen from '../../images/personas';


var Imagen=""

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
                          titulos:"",
                          foto:"",
                          everFocusedNombre: false,
                          everFocusedApellido: false,
                          everFocusedNroDoc: false,
                          inFocus: "",
                          selectedFile: null, 
						  oldFile: null
               };
       this.cambioNumero = this.cambioNumero.bind(this);
	   this.reemplazar = this.reemplazar.bind(this);

      }

      componentDidMount() {
        var feBaja=null;
        axios.get('/api/personaId/'+this.props.match.params.id)
            .then(response => {
             
              feBaja=response.data.personaId.fechaBaja
              if(feBaja!=null)
              {
                  feBaja=(Moment(response.data.personaId.fechaBaja).add(1, 'days')).format('YYYY-MM-DD');
              }
			  
			  Imagen="/images/personas/"+this.props.match.params.id+"/"+response.data.personaId.foto;
			  
             
               this.setState({ 
                    nombre: response.data.personaId.nombres, 
                    apellido: response.data.personaId.apellidos,
                    nroDoc: response.data.personaId.dni,
                    finicio: (Moment(response.data.personaId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
                    fbaja:feBaja,
                    motivo: response.data.personaId.motivoBaja,
                    titulos: response.data.personaId.titulos,
                    foto: response.data.personaId.foto,
					oldFile: response.data.personaId.foto});
                          
                   
            })
            .catch(function (error) {
                console.log(error);
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


      handleTituloChange = evt => {
        this.setState({titulos: evt.target.value });
      };



    
      handleSubmit = evt => {
         
        if (this.canBeSubmitted()) 
        {
             
          evt.preventDefault();
             
             var photo = this.state.foto.replace("C:\\fakepath\\", "\\");
			 photo= photo.replace(/\s+/g, "_");
			 photo= this.reemplazar(photo);
              var data = {
                    "nombres": this.state.nombre,
                    "apellidos": this.state.apellido,
                    "dni": this.state.nroDoc,
                    "fechaInicio": this.state.finicio,
                    "titulos": this.state.titulos, 
                    "foto": photo,
                    "fechaBaja": this.state.fbaja, 
                    "motivoBaja": this.state.motivo
                 };
              
			  
                //Guardo la info en BD
				fetch('/api/persona/'+this.props.match.params.id, {
                    method: 'put',
                    body: JSON.stringify(data),
                    headers:{
                              'Content-Type': 'application/json'
                            }      
                    })
					.then(function(response) {
					  if (response.ok) {
						console.log("¡Se guardó la Persona con Éxito!");
						return response.json();
					  }
					})
                    .then(function(data) {
						
							if(this.state.selectedFile!==null)
				            {   
						        //subo archivo si se selecciono uno
							    const destino= "../museo-administracion/public/images/personas/"+this.props.match.params.id
								const data1 = new FormData() 
								data1.append('file',this.state.selectedFile)
								
								axios.post("/api/uploadArchivo", data1, {
								  headers: {
									"Content-Type": undefined,
									path: destino
								  }
								})
								.then(response => {
									return response;
								})
								.then (resp => {
									//borro foto anterior
									var oldFile=(this.state.oldFile).replace('\\','')
									if (this.state.selectedFile.name!==oldFile && oldFile!=='')
									{	
									  const destino="./../museo-administracion/public/images/personas/"+this.props.match.params.id+"/"+oldFile
									 
                               		  fetch('/api/deleteArchivo', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
									  .then(function(response) {
										  if(response.ok) {
											  console.log('Se eliminaron los archivos con exito.');
											  alert("¡Se guardó la Persona con Éxito!");
											  window.location.href = "/personas";
										  } 
									  })
									  .catch(function(error) {
										  alert("Error al eliminar. Intente nuevamente.");
										  console.log('Hubo un problema con la petición Fetch:' + error.message);
									  });
									}  
									else
									{
										 alert("¡Se guardó la Persona con Éxito!");
								         window.location.href = "/personas";
										 
									}
									
								})
								.catch(error => {
								  console.log(error);
								});
							}
							else
							{
								alert("¡Se guardó la Persona con Éxito!");
								window.location.href="/personas"; 
							}
								
						
                    
                    }.bind(this))
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
        
       
       

         
        return (  <div> 
                  <div className="row">
                  <div className="col-md-12">
                        <div id="contenido" align="left" className="container">
                        <h3 className="page-header" align="left"> <i class="fa fa-users" aria-hidden="true"></i> Editar Persona</h3>  
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
                                         
                                          <input name="titulo" type="text" 
                                                className="form-control" value={this.state.titulos} 
                                                onChange={this.handleTituloChange} /> 
                                            
                                                
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
	  
reemplazar(cadena)
{

	var chars={

		"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",

		"à":"a", "è":"e", "ì":"i", "ò":"o", "ù":"u", "ñ":"n",

		"Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U",

		"À":"A", "È":"E", "Ì":"I", "Ò":"O", "Ù":"U", "Ñ":"N", 
		
		"ä": "a", "ë": "e", "ï": "i", "ö": "o", "ü": "u", 
        
		"Ä": "A", "Ä": "A", "Ë": "E","Ï":"I","Ö": "O", "Ü": "U" }

	var expr=/[áàéèíìóòúùñäëïöü]/ig;

	var res=cadena.replace(expr,function(e){return chars[e]});

	return res;

}

}

export default editPersona;