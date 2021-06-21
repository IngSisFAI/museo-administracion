import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Form, Button, Modal, Table} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSave, faPlus, faFileArchive, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();



const columnsMT = [
    {
      title: 'Id.',
      field: '_id',
      hidden: true
    },
    {
      title: 'Tipo Documento',
      field: 'tipoDocumentacion'
    },
    {
      title: 'Nombre',
      field: 'nombre'
    },
    {
        title: 'Año',
        field: 'anio',
        type: "numeric",
        cellStyle: {
            textAlign:'center'
          },
        headerStyle: {
            textAlign:'left'
          },

      },
      {
        title: 'Comentarios',
        field: 'comentarios'
      }
  ];

  const listArchivosTmp=[{
      "id":"1",
      "tipoDocumentacion": "Nota Recibida",
      "nombre": "nota_01_1973.pdf",
      "anio": "1973",
      "comentarios": "Aca iría los comentarios de la nota recibida."
  },
  {
    "id":"2",
    "tipoDocumentacion": "Nota Recibida",
    "nombre": "nota_02_1973.pdf",
    "anio": "1973",
    "comentarios": "Aca iría los comentarios de la nota recibida 2."
},
{
    "id":"3",
    "tipoDocumentacion": "Nota Enviada",
    "nombre": "nota_env_01_1973.pdf",
    "anio": "1973",
    "comentarios": "Aca iría los comentarios de la nota recibida 2."
},
{
  "id":"4",
  "tipoDocumentacion": "Nota Recibida",
  "nombre": "nota_01_1973.pdf",
  "anio": "1973",
  "comentarios": "Aca iría los comentarios de la nota recibida."
},
{
"id":"5",
"tipoDocumentacion": "Nota Recibida",
"nombre": "nota_02_1973.pdf",
"anio": "1973",
"comentarios": "Aca iría los comentarios de la nota recibida 2."
},
{
"id":"6",
"tipoDocumentacion": "Nota Enviada",
"nombre": "nota_env_01_1973.pdf",
"anio": "1973",
"comentarios": "Aca iría los comentarios de la nota recibida 2."
}
]
  


class MainDocumentacion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {personas:[],
             documentacion:[],
             modalAgregar: false,
             anio:'',
             selectedtipoDoc:'',
             comentarios:'',
             archivo: null,
             validated: false
            }
       
    }
	
	

	
	componentDidMount(){
    
      if(!cookies.get('username') && !cookies.get('password'))
      {
          window.location.href='/';
      }
      else
      {
      

          fetch('http://museo.fi.uncoma.edu.ar:3006/api/documentacion')
          .then(res => res.json())
        .then(
          (result) => {
              this.setState({
            documentacion: result.data          
          });
          }).catch(error=>{
              console.log("Error")
          });
      } 

    }


    eliminar (id)
    {
	  var resultPersonas=[];	
      const destino = "/var/www/museo-administracion/html/images/personas/" + id+'/'; 

       fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona/' + id, {
          method: 'DELETE',
        })
        .then(function(response) {
        if (response.ok) {
              console.log("¡Se eliminó a la persona con Éxito!");
        
        }
        }).then( function(res) {
					       fetch('http://museo.fi.uncoma.edu.ar:3006/api/deleteDirectorio', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
						  .then(function(response) {
							  if(response.ok) {
								   console.log('Se eliminaron los archivos con exito.');
								   toast.success("¡Se eliminó la Persona con Éxito!");
					
							  } 
						  })
                          .then( function()
						     {
								  fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
									.then(res => res.json())
								  .then(
									 function(result){
											resultPersonas= result.personas
									}).catch(error=>{
										 console.log("Error:"+ error.message)
									 });
								 
							 }
						  
						   
						  )			  
						  .catch(function(error) { 
							  toast.error("Error al eliminar. Intente nuevamente.");
							  console.log('Hubo un problema con la petición Fetch:' + error.message);
						  });
						
		})
        .catch(function(error) {
                        toast.error("Error al eliminar. Intente nuevamente (1).");
                        console.log('Hubo un problema con la petición Fetch:' + error.message);
         });
		
				setTimeout(() => {
				   this.setState({ personas: resultPersonas });
				}, 2000);		
		

    }

    mostrarModalAgregar = () => {
      
         this.setState({
           modalAgregar: true,
         });
       };
      
       cerrarModalAgregar = () => {
        this.setState({ modalAgregar: false, archivo:null, anio:'',selectedtipoDoc:null, comentarios:'' });
      };

      handleAnioChange = evt => {
        this.setState({ anio: evt.target.value });
      };

      handleTipoDocChange = (selectedtipodoc) => {
          let index=selectedtipodoc.target.selectedIndex
          console.log(selectedtipodoc.target.options[index].text )
          this.setState({ selectedtipodoc: selectedtipodoc.target.options[index].text });
      };

      handleComentariosChange = (evt) => {
        this.setState({ comentarios: evt.target.value });
      };

      filehandleChange = (event) => {

        const file=  event.target.files;
        this.setState({archivo: file});
      
        // console.log('SALIDA::', file)
        //aca deberiamos mover el archivo a la carpeta 
        
      }
      
      renderTableData() {
      
        let file= this.state.archivo
        if(file!==null){
          return (
            <tr key={Math.floor(Math.random() * 1000)}>
             <td>
                  <Button variant="danger" type="button" id="eliminarCV" onClick={()=> this.eliminarArchivo(FileReader)}>
                  <FontAwesomeIcon icon={faTrash} />
                  </Button>
             </td>
             <td>{file[0].name}</td>
           
          </tr>
          )
      
        }
        else{
      
           return (<></>)
        }
       
      }
      
      eliminarArchivo = (dato) => {
        //aca tambien hay que eliminar en la BD y traer los prestamos
       var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
       if (opcion == true) {
          console.log(dato)
          document.getElementById('archivo').value="";
          this.setState({ archivo: null});
        
       }
      };

      insertar= (event)=>{
      
              const form = event.currentTarget;
              event.preventDefault();
              if (form.checkValidity() === false) {
                event.stopPropagation();
              }
              else
              { 
                  var file=this.state.archivo
                  var data={
                    "tipoDocumentacion": this.state.selectedtipodoc,
                    "nombre": file[0].name,
                    "anio": this.state.anio,
                    "comentarios": this.state.comentarios
                  }

                  fetch("http://museo.fi.uncoma.edu.ar:3006/api/saveDocumentacion", {
                    method: "post",
                    body: JSON.stringify(data),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then(function (response) {
                      if (response.ok) {
                      //  this.setState({modalAgregar: false})
                        toast.success("¡Se guardó el Documento con Éxito!");
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      }
                    })
                    .catch(function (error) {
                      toast.error("Error al guardar. Intente nuevamente.");
                      console.log(
                        "Hubo un problema con la petición Fetch:",
                        error.message
                      );
                    });
                  


              }

              this.setState({ validated: true });





       //    this.setState({modalAgregar: false, documentacion:documentacion, anio:'', selectedtipoDoc:'',comentarios:'', archivo:null})
    }

    render() 
    {    
      const {validated} = this.state; 
         return(

            <>
            <Menu />
            <Form  >
            <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        transition={Slide}
                        hideProgressBar={true}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnHover
                        />   
            <Form.Row>
                 <div id="contenido" align="left" className="container">
                    
                    <legend> <FontAwesomeIcon icon={faFileArchive} /> Gestión de Documentación</legend>
                    <hr/>  
                    
                        <Button variant="primary" id="agregar" type="button" onClick={() => this.mostrarModalAgregar()}>
                            <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>
                    
                    <br/>
                    <br/>


                    
                    <MaterialTable
                       title="Listado"
                       columns={columnsMT}
                       data={this.state.documentacion}
                       actions={[
                        {
                          icon: 'edit',
                          tooltip: 'Editar Documento',
                          onClick: (event, rowData) => {
						     this.props.history.push(`/editPersona/${rowData._id}`); ;
							
                          }  
              
                        },
                        {
                          icon: 'delete',
                          tooltip: 'Eliminar Documento',
                          onClick: (event, rowData) => {
                            // Do save operation
                            if( window.confirm('¿Está seguro de eliminar el afiliado seleccionado?'))
                            {
                              this.eliminar(rowData._id); 
                              
                            }
                          }
              
                        }
                        

                      ]}
                      options={{
                           filtering:true,
                           exportButton: true,
                           exportFileName:'Listado de Documentación'
                      }}
                      localization= {{
                             header:{
                               actions:'Acciones'
                             }
                      }}
                    />
					


                 </div>    
            </Form.Row>    


        <Modal
            show={this.state.modalAgregar}
            onHide={() => this.cerrarModalAgregar()}
            backdrop="static"
            keyboard={false}
            size="lg"
        >

        <Modal.Header closeButton>
          <Modal.Title>Nuevo Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={this.insertar}>
            <Form.Row >
                                
                                
                    <Form.Group className="col-sm-4" controlId="anioDoc">
                        <Form.Label>Año:</Form.Label>
                                    <Form.Control type="number" value={this.state.anio}
                                                    onChange={this.handleAnioChange} required/>
                        <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Año.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="col-sm-8" controlId="tipoDoc">
                    <Form.Label>Tipo Documento:</Form.Label>    
                    <Form.Control
                          as="select"
                          onChange={this.handleTipoDocChange} 
                          required
                      >
                           <option  value="">{"Seleccione Opción"}</option>
                          <option key={1} value={1}>{"Nota Enviada"}</option>
                          <option key={2} value={2}>{"Nota Recibida"}</option>
                         
                      </Form.Control>
                       
                        <Form.Control.Feedback type="invalid">
                                Por favor, seleccione opción.
                        </Form.Control.Feedback>
                    </Form.Group>

              </Form.Row>

              <Form.Row >
                <Form.Group className="col-sm-12" >
                                <Form.Label>Archivo:</Form.Label>
                                <input type="file" id="archivo" className="form-control"  accept="application/pdf" onChange={this.filehandleChange.bind(this)}  />
                    </Form.Group> 
             </Form.Row>
             <Form.Row >
                    <Form.Group className="col-sm-8" controlId="listFile">
                        <Table border="0">
                                  <tbody>
                                        {this.renderTableData()}
                                  </tbody>
                        </Table>
                    </Form.Group>  
            </Form.Row>

             <Form.Row>
                  <Form.Group className="col-sm-12" controlId="Comentarios">
                      <Form.Label>Comentarios:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={this.state.comentarios}
                        onChange={this.handleComentariosChange}
                      />
                     </Form.Group>
             </Form.Row>
           
             <Form.Row>
               <Form.Group>
                  <Button variant="primary" id="guardar" type="submit" > 
                      <FontAwesomeIcon icon={faSave} /> Guardar
                  </Button>
                  &nbsp;&nbsp;
                  <Button variant="danger" onClick={() => this.cerrarModalAgregar()}>
                    <FontAwesomeIcon icon={faTimesCircle} /> Cerrar
                  </Button>
                </Form.Group> 
             </Form.Row>
                
         
            </Form>


        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>         

            </Form>
            </>


         )
    }
 


}

export default withRouter(MainDocumentacion);  
