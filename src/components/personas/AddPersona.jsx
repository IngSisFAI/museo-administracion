import React from "react";
import { Form, Button, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faUser, faTrash, faTimesCircle, faUpload} from '@fortawesome/free-solid-svg-icons'
import { Link, withRouter} from 'react-router-dom';
import axios from "axios";
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST
const urlImage=process.env.REACT_APP_IMAGEN_PERSONA;
const urlCV=process.env.REACT_APP_DOC_PERSONA;
const rutaImg=process.env.REACT_APP_RUTA_IMG_PERSONA;
const rutaDoc=process.env.REACT_APP_RUTA_DOC_PERSONA;


class AddPersona extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            apellido: "",
            nroDoc: "",
            finicio: "",
            fbaja: "",
            motivo: "",
            titulos: "",
            foto: "",
            id: "",
            extFoto: '',
            validated: false,
            tabbas:false,
            key: 'dbasicos',
            validatedfile: false,
            tabfile:true,
            archivoFoto:null,
            archivoCV: null, 
            idPersona:'', 
            op:'I',
            showSuccess:false,
            showError: false,
            urlImage:'',
            tableImage: null,
            showSuccesscv:false,
            showErrorcv: false,
            urlCV:'',
            tableCV: null,
            extCV:''
          };
        
    }

    componentDidMount()
    {
      if(!cookies.get('user') && !cookies.get('password'))
      {
          window.location.href='/';
      }

    }

    handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };
    
      handleApellidoChange = evt => {
        this.setState({ apellido: evt.target.value });
      };
    
      handleNroDocChange = evt => {
       // this.cambioNumero(evt.target.value);
        this.setState({ nroDoc: evt.target.value });
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

  
    
    
      handleTituloChange = evt => {
        this.setState({ titulos: evt.target.value });
      };


      handleBlur = evt => {
        fetch(urlApi+"/personaDni/" + evt.target.value,{
              method: 'GET', 
              headers: {
                'Authorization': 'Bearer '+cookies.get('token')
              }})
          .then(response => {
            return response.json();
          })
          .then(result => {
               if(typeof result.persona !== 'undefined') { 

                    if(result.persona!==null){
                      toast.error("Existe Persona con ese DNI.");
                      this.setState({ nroDoc: "" });
                      document.getElementById("nroDoc").focus();
                    }
               }
               else{
                    cookies.remove("id", { path: "/" });
                    cookies.remove("nombre", { path: "/" });
                    cookies.remove("apellido", { path: "/" });
                    cookies.remove("user", { path: "/" });
                    cookies.remove("password", { path: "/" });
                    cookies.remove("permiso", { path: "/" });
                    cookies.remove("token", { path: "/" });
                    window.location.href = "/";
               }
         
          }).catch(error=>{
            console.log("Error al consultar personas:", error)
        });
      };



    handleSubmit = (event) => {
          var dniPersona=""
       
          const form = event.currentTarget;
          event.preventDefault();
          if (form.checkValidity() === false) {
            event.stopPropagation();
          }
          else
          {
            const op= this.state.op;
            if(op==='I'){
            var data = {
              nombres: this.state.nombre,
              apellidos: this.state.apellido,
              dni: this.state.nroDoc,
              fechaInicio: this.state.finicio,
              titulos: this.state.titulos,
              foto: '',
              fechaBaja: this.state.fbaja,
              motivoBaja: this.state.motivo,
              curriculum:''
             };
              document.getElementById('guardar').setAttribute('disabled','disabled');
              fetch(urlApi+"/persona", {
                              method: "post",
                              body: JSON.stringify(data),
                              headers: {
                                "Content-Type": "application/json",
                                'Authorization': 'Bearer '+cookies.get('token')
                              }
              }).then(function(response) {
                                if (response.ok) {
                                  console.log("¡Se guardó la Persona con Éxito!");
                                  return response.json();
                                }
              }).then(function(data) {
                                toast.success("¡Se guardó la Persona con Éxito!");  
                                this.setState({ idPersona: data.persona._id, op:'U' });
                                document.getElementById('guardar').removeAttribute('disabled');
                                this.setState({tabfile:false, key:'dfiles'})
                                document.getElementById('nroDoc').setAttribute('disabled','disabled');
                                      
                      
                 }.bind(this))
                .catch(function(error) {
                      toast.error("Error al guardar. Intente nuevamente.");
                      document.getElementById('guardar').removeAttribute('disabled');
                      console.log("Hubo un problema con la petición Fetch:" + error.message
                      );
                    });
            }
            else{

              var data = {
                nombres: this.state.nombre,
                apellidos: this.state.apellido,
                dni: this.state.nroDoc,
                fechaInicio: this.state.finicio,
                titulos: this.state.titulos,
                fechaBaja: this.state.fbaja,
                motivoBaja: this.state.motivo,
               };

              fetch(urlApi+'/persona/'+this.state.idPersona, {
                method: 'put',
                body: JSON.stringify(data),
                headers:{
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer '+cookies.get('token')
                        }      
                })
              .then(function(response) {
                if (response.ok) {
                  toast.success("¡Se actualizaron los datos de la Persona con Éxito!");

                }
              })
              .catch(function(error) {
                toast.error("Error al guardar. Intente nuevamente.");
                console.log('Hubo un problema con la petición Fetch:' + error.message);
              });
            }
          }//else
          this.setState({ validated: true });
    }




  

    handleSelect=(key) =>{
      this.setState({ key: key });
     
    } 

    filehandleChange = (event) => {

      const file=  event.target.files;
      const name=file[0].name;
      const lastDot = name.lastIndexOf('.');
      const ext = name.substring(lastDot + 1); 
      this.setState({archivoFoto: file,  extFoto: ext});
  
       // console.log('SALIDA::', file)
      
      
    }

   

    renderTableDataFoto() {

        let foto= this.state.archivoFoto
       
        if(foto!==null){
          return (
            <tr key={Math.floor(Math.random() * 1000)}>
             <td>
                  <Button variant="danger" type="button" id="eliminarF" onClick={()=> this.eliminarArchivoFoto(this.state.nroDoc+'.'+this.state.extFoto)}>
                  <FontAwesomeIcon icon={faTrash} />
                  </Button>
             </td>
             <td> 
              <a href={this.state.urlImage} disabled target="_blank">{this.state.nroDoc+'.'+this.state.extFoto}</a> 
             </td>
           
          </tr>
          )

        }
        else{

           return (<></>)
        }
       
    }

 

  eliminarArchivoFoto = (dato) => {
    //console.log(dato);

    var opcion = window.confirm("¿Está seguro que desea eliminar el Archivo?");
    var destino = rutaImg + dato;
    if (opcion == true) {

      var data = {
        "foto": ""
      }
      fetch(urlApi+'/persona/' + this.state.idPersona, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {
          if (response.ok) {
            console.log("¡Se actualizaron los datos de la Persona con Éxito!");

          }
        })
        .then(function () {

          fetch(urlApi+'/deleteArchivo', {
            method: 'get',
            headers: {
              'Content-Type': undefined,
              'path': destino,
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {
              console.log(response.msg);
              if ((response.msg).trim() === 'OK') {
                console.log('ok');
                toast.success("¡Se eliminó el Archivo con Éxito!");
                this.setState({ archivoFoto: null, extFoto: '', tableImage: null })

              } else {
                console.log('error');
                toast.error("¡Se produjo un error al eliminar archivo!");
              }
            }.bind(this)).catch(function (error) {
              toast.error("Error al eliminar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });


        }.bind(this))
        .catch(function (error) {
          toast.error("Error al guardar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });

    }

  }

  eliminarArchivoCV = (dato) => {
    //console.log(dato);

    var opcion = window.confirm("¿Está seguro que desea eliminar el Curriculum Vitae?");
    var destino = rutaDoc + dato;
    if (opcion == true) {

      var data = {
        "curriculum": ""
      }
      fetch(urlApi+'/persona/' + this.state.idPersona, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {
          if (response.ok) {
            console.log("¡Se actualizaron los datos de la Persona con Éxito!");

          }
        })
        .then(function () {

          fetch(urlApi+'/deleteArchivo', {
            method: 'get',
            headers: {
              'Content-Type': undefined,
              'path': destino,
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {
              console.log(response.msg);
              if ((response.msg).trim() === 'OK') {
                console.log('ok');
                toast.success("¡Se eliminó el Archivo con Éxito!");
                this.setState({ archivoCV: null, extCV: '', tableCV: null })

              } else {
                console.log('error');
                toast.error("¡Se produjo un error al eliminar archivo!");
              }
            }.bind(this)).catch(function (error) {
              toast.error("Error al eliminar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });


        }.bind(this))
        .catch(function (error) {
          toast.error("Error al guardar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });

    }

  }

  
  

fileCVhandleChange = (event) => {

      const file=  event.target.files;
      const name=file[0].name;
      const lastDot = name.lastIndexOf('.');
      const ext = name.substring(lastDot + 1); 
      this.setState({archivoCV: file,  extCV: ext});

  
}

renderTableDataCV() {

  let cv= this.state.archivoCV
       
  if(cv!==null){
    return (
      <tr key={Math.floor(Math.random() * 1000)}>
       <td>
            <Button variant="danger" type="button" id="eliminarCV" onClick={()=> this.eliminarArchivoCV('cv_'+this.state.nroDoc+'.'+this.state.extCV)}>
            <FontAwesomeIcon icon={faTrash} />
            </Button>
       </td>
       <td> 
        <a href={this.state.urlCV} disabled target="_blank">{'cv_'+this.state.nroDoc+'.'+this.state.extCV}</a> 
       </td>
     
    </tr>
    )

  }
  else{

     return (<></>)
  }
 
}


subirFoto=()=>{
  //console.log(this.state.archivoFoto);
  const MAXIMO_TAMANIO_BYTES = 5000000;
  const types=['image/jpg', 'image/jpeg', 'image/jpe','image/png','image/gif', 'image/bpm', 'image/tif','image/tiff'];
  var foto= this.state.archivoFoto
  if(foto!==null && foto.length!==0){
         var namePhoto =	'/'+this.state.nroDoc+'.'+this.state.extFoto
         var size= foto[0].size;
         var type= foto[0].type;

         if(size>MAXIMO_TAMANIO_BYTES){
             var tamanio=5000000/1000000;
             toast.error("El archivo seleccionado supera los "+tamanio+'Mb. permitidos.');
             document.getElementById('foto').value='';
         }
         else{
           if(!types.includes(type)){
            toast.error("El archivo seleccionado tiene una extensión inválida.");
            document.getElementById('foto').value='';

           }
           else{
            var data1 = {
              foto: namePhoto,
              };
              document.getElementById('subir').setAttribute('disabled','disabled');
              fetch(urlApi+'/persona/'+this.state.idPersona, {
                    method: 'put',
                    body: JSON.stringify(data1),
                    headers:{
                              'Content-Type': 'application/json',  
                              'Authorization': 'Bearer '+cookies.get('token')
                            }      
                    })
                  .then(function(response) {
                    if (response.ok) {
                      console.log("¡Se actualizaron los datos de la Persona con Éxito!");
                      //const destino = rutaImg;                      
                      const data = new FormData();
                      data.append("file", foto[0]);
                    // console.log(foto);
                      
                      axios.post(urlApi+"/uploadArchivo", data, {
                              headers: {
                                "Content-Type": undefined,
                                path: rutaImg,
                                "newfilename": this.state.nroDoc,
                                'Authorization': 'Bearer '+cookies.get('token')
                              }
                            })
                            .then(response => {
                              console.log(response);
                              if(response.statusText==="OK")
                                {
                                  this.setState({showSuccess: true, showError:false, urlImage: urlImage+this.state.nroDoc+'.'+this.state.extFoto});
                                  this.setState({tableImage: this.renderTableDataFoto()})
                                  document.getElementById('foto').value='';
                                }
                                else{
                                  this.setState({showSuccess: false, showError:true});
                                }
                                document.getElementById('subir').removeAttribute('disabled');  
                                
                                setTimeout(() => {
                                  this.setState({showSuccess: false, showError:false});
                                }, 2500);
                  
                  
                              })
                            .catch(error => {
                              this.setState({showSuccess: false, showError:true});
                                console.log(error);
                            });            
                    }
                  }.bind(this))
                  .catch(function(error) {
                    toast.error("Error al guardar. Intente nuevamente.");
                    document.getElementById('subir').removeAttribute('disabled'); 
                    console.log('Hubo un problema con la petición Fetch:' + error.message);
                  });


           }

          
         }
 
          

   
  }else{
    toast.error("Seleccione una foto.");
  }
}

subirCV=()=>{
  const MAXIMO_TAMANIO_BYTES = 5000000;
  const types=['application/pdf'];

  var cv= this.state.archivoCV
  if(cv!==null && cv.length!==0){
         var nameCV =	'/'+'cv_'+this.state.nroDoc+'.'+this.state.extCV
         var size= cv[0].size;
         var type= cv[0].type;
         if(size>MAXIMO_TAMANIO_BYTES){
              var tamanio=5000000/1000000;
              toast.error("El archivo seleccionado supera los "+tamanio+'Mb. permitidos.');
              document.getElementById('foto').value='';
         }
         else{
               
               if(!types.includes(type)){
                  toast.error("El archivo seleccionado tiene una extensión inválida.");
                  document.getElementById('foto').value='';
               }
               else{
                        var data1 = {
                            curriculum: nameCV,
                        };
                        document.getElementById('subirCV').setAttribute('disabled','disabled');
                        fetch(urlApi+'/persona/'+this.state.idPersona, {
                              method: 'put',
                              body: JSON.stringify(data1),
                              headers:{
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '+cookies.get('token')
                                      }      
                              })
                            .then(function(response) {
                              if (response.ok) {
                                console.log("¡Se actualizaron los datos de la Persona con Éxito!");
                              //  const destino = rutaDoc;                      
                                const data = new FormData();
                                data.append("file", cv[0]);
                              // console.log(foto);
                                
                                axios.post(urlApi+"/uploadArchivo", data, {
                                        headers: {
                                          "Content-Type": undefined,
                                          path: rutaDoc,
                                          "newfilename": 'cv_'+this.state.nroDoc,
                                          'Authorization': 'Bearer '+cookies.get('token')
                                        }
                                      })
                                      .then(response => {
                                      //  console.log(response);
                                        if(response.statusText==="OK")
                                          {
                                            this.setState({showSuccesscv: true, showErrorcv:false, urlCV: urlCV+'cv_'+this.state.nroDoc+'.'+this.state.extCV});
                                            this.setState({tableCV: this.renderTableDataCV()})
                                            document.getElementById('curriculum').value='';
                                          }
                                          else{
                                            this.setState({showSuccess: false, showError:true});
                                          }
                                          document.getElementById('subirCV').removeAttribute('disabled');  
                                          
                                          setTimeout(() => {
                                            this.setState({showSuccesscv: false, showErrorcv:false});
                                          }, 2500);
                            
                            
                                        })
                                      .catch(error => {
                                        
                                        console.log(error);
                                      });            
                              }
                            }.bind(this))
                            .catch(function(error) {
                              toast.error("Error al subir el archivo. Intente nuevamente.");
                              document.getElementById('subirCV').removeAttribute('disabled'); 
                              console.log('Hubo un problema con la petición Fetch:' + error.message);
                            });


               }
         }
         
 
         

   
  }else{
    toast.error("Seleccione una Curriculum.");
  }
}
  
    
  render()
  {
    const {validated} = this.state;
    const {validatedfile} = this.state;

       return(
            <>
            <Menu />
            <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faUser} /> Nueva Persona
                    </h3>
                    <hr />

                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        transition={Slide}
                        hideProgressBar={true}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnHover
                        />     

      <Tabs id="tabPersonas" activeKey={this.state.key} onSelect={this.handleSelect}>
      <Tab eventKey="dbasicos" title="Datos Básicos" disabled={this.state.tabbas}>
        <Form id="form" noValidate validated={validated} onSubmit={this.handleSubmit}> 

                  
                       <br/>
                        <Form.Row >
                            <Form.Group className="col-sm-4" controlId="apellido">
                                <Form.Label>Apellido:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Apellido" required onChange={this.handleApellidoChange} value={this.state.apellido}/>
                                <Form.Control.Feedback type="invalid">
                                   Por favor, ingrese Apellido.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="nombre">
                              <Form.Label>Nombres:</Form.Label>
                              <Form.Control type="text" placeholder="Ingrese Nombres" required onChange={this.handleNombreChange} value={this.state.nombre} />
                              <Form.Control.Feedback type="invalid">
                              Por favor, ingrese Nombres.
                              </Form.Control.Feedback>
                           </Form.Group>
                           
                           <Form.Group className="col-sm-4" controlId="nroDoc">
                                    <Form.Label>Nro. Documento:</Form.Label>
                                    <Form.Control type="number" placeholder="DNI" required onChange={this.handleNroDocChange} value={this.state.nroDoc}  onBlur={this.handleBlur}/>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor, ingrese DNI.
                                    </Form.Control.Feedback>
                            </Form.Group>

                        </Form.Row>   

                        <Form.Row >
                            <Form.Group className="col-sm-4" controlId="finicio">
                                    <Form.Label>Fecha Inicio:</Form.Label>
                                    <Form.Control type="date"   value={this.state.finicio} onChange={this.handleFinicioChange}/>
                                
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="fbaja">
                                    <Form.Label>Fecha Baja:</Form.Label>
                                    <Form.Control type="date"  value={this.state.fbaja} onChange={this.handleFbajaChange}/>
                            </Form.Group>

                            <Form.Group className="col-sm-4" controlId="motivo">
                                    <Form.Label>Motivo Baja:</Form.Label>
                                    <Form.Control as="textarea" rows={3}  value={this.state.motivo} onChange={this.handleMotivoChange}/>
                            </Form.Group>

                        </Form.Row>

                        <Form.Row >
                            <Form.Group className="col-sm-12" controlId="titulo">
                                <Form.Label>Título(s):</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese Título(s)" onChange={this.handleTituloChange} value={this.state.titulos}/>
                                
                            </Form.Group>
                        </Form.Row>

                     

                   <hr/>
               
                <Form.Row> 
                    <Form.Group className="mx-sm-3 mb-2">
                              <Button variant="primary" type="submit" id="guardar" >
                              <FontAwesomeIcon icon={faSave} /> Guardar
                              </Button>
                              &nbsp;&nbsp;
                             <Link to='/personas'>
                              <Button variant="danger" type="button" id="volver">
                              <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                              </Button>
                              </Link>
                        </Form.Group>
                  </Form.Row>


                </Form>
             </Tab>

             <Tab eventKey="dfiles" title="Archivos Adjuntos" disabled={this.state.tabfile}>
                     <Form id="form" noValidate validated={validatedfile}> 
                    
                    <br/>   
                     <Form.Row >
                           <Form.Group className="col-sm-12">
                              <Form.Label>Foto:</Form.Label>
                              <input type="file" id="foto" className="form-control"  accept="image/*" onChange={this.filehandleChange.bind(this)}  />
                           </Form.Group>
                           
                        </Form.Row>
                        <Form.Row >
                        <Form.Group className="col-sm-8" controlId="listFoto">
                         <Table border="0">
                            <tbody id="tbodyimage">
                                   {this.state.tableImage}
                            </tbody>
                         </Table>
                      </Form.Group>  
                      </Form.Row>

                      <Form.Row> 
                    <Form.Group className="mx-sm-3 mb-2">
                              <Button variant="primary" type="button" id="subir" onClick={()=>this.subirFoto()} >
                              <FontAwesomeIcon icon={faUpload} /> Subir
                              </Button>
                            
                        </Form.Group>

                        <Form.Group className="col-sm-6">
                          <Alert show={this.state.showSuccess} variant="success">
                              <p>
                                Se subió el archivo con Éxito!!
                              </p>
                            </Alert>

                            <Alert show={this.state.showError} variant="danger">
                              <p>
                                El archivo no se pudo subir. Intente nuevamente.
                              </p>
                            </Alert>
                      </Form.Group>

                       

                  </Form.Row>

          
                   

                        <Form.Row >
                           <Form.Group className="col-sm-12" >
                                <Form.Label>Curriculum Vitae:</Form.Label>
                                <input type="file" id="curriculum" className="form-control"  accept="application/pdf" onChange={this.fileCVhandleChange.bind(this)}  />
                           </Form.Group>
                           
                        </Form.Row>

                        <Form.Row >
                              <Form.Group className="col-sm-8" controlId="listCV">
                              <Table border="0">
                                  <tbody>
                                        {this.state.tableCV}
                                  </tbody>
                              </Table>
                            </Form.Group>  
                      </Form.Row>

                      <Form.Row> 
                    <Form.Group className="mx-sm-3 mb-2">
                              <Button variant="primary" type="button" id="subirCV" onClick={()=>this.subirCV()} >
                              <FontAwesomeIcon icon={faUpload} /> Subir
                              </Button>
                            
                      </Form.Group>

                      <Form.Group className="col-sm-6">
                          <Alert show={this.state.showSuccesscv} variant="success">
                              <p>
                                Se subió el archivo con Éxito!!
                              </p>
                            </Alert>

                            <Alert show={this.state.showErrorcv} variant="danger">
                              <p>
                                El archivo no se pudo subir. Intente nuevamente.
                              </p>
                            </Alert>
                      </Form.Group>

                       

                  </Form.Row>

         

                  </Form>
             </Tab>        

             </Tabs>

              </div>
            </div>  
           </div>
                
            </>
       )

  }
    

}   
export default withRouter(AddPersona); 