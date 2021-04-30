import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faPlus } from '@fortawesome/free-solid-svg-icons'
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class MainEjemplares extends React.Component {

    constructor(props) {
        super(props);
        this.state = {ejemplares:[]}
       
    }

     componentDidMount()
     {
        if(!cookies.get('username') && !cookies.get('password'))
        {
            window.location.href='/';
        }
        else
        {
        
          fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplar')
          .then((response) => {
                  return response.json()
                })
                .then((ejemplars) => {
                  this.setState({ ejemplares: ejemplars.ejemplares})
                }).catch(function(error) {
                  toast.error("Error al consultar. Intente nuevamente.");
                  console.log("Hubo un problema con la petición Fetch:" , error.message);
          });
        } 

     }	

     eliminar (id)
    {
      fetch("http://museo.fi.uncoma.edu.ar:3006/api/ejemplar/" + id,
      {
          method: "delete"
        }
      )
        .then(function(response) {
          if (response.ok) {
            console.log("¡Se eliminó el Ejemplar con Éxito!");
    
          }
        }).then (function (resp){
					    
                        const destino="/var/www/museo-administracion/html/images/ejemplares/"+id+"/";
						fetch('http://museo.fi.uncoma.edu.ar:3006/api/deleteDirectorio', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
						  .then(function(response) {
							  if(response.ok) {
								
								    toast.success('¡Se eliminó el Ejemplar con Éxito!');
									setTimeout(() => {
									  window.location.href='/ejemplares';
									}, 1500)
							  } 
						  })
						  .catch(function(error) {
							  toast.error("Error al eliminar. Intente nuevamente.");
							  console.log('Hubo un problema con la petición Fetch:' + error.message);
						  });
					  
				  })
        .catch(function(error) {
          toast.error("Error al eliminar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });

    }

render()
   {
        return (
             <>
             <Menu />
            <Form>
			<br/>
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
                    
                    <legend> <FontAwesomeIcon icon={faPaw} /> Gestión de Ejemplares</legend>
                    <hr/>  
                    <Link to='/addEjemplar'>
                        <Button variant="primary" type="buttom" >
                            <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>
                    </Link>
                    <br/>
                    <br/>

                    
                    <MaterialTable
                      title="Listado"
                       columns={ [
                        {
                          title: 'Id.',
                          field: '_id',
                          hidden: true
                        },
                        {
                          title: 'Nombre',
                          field: 'nombre'
                        },
                        {
                          title: 'Tipo',
                          field: 'tipoEjemplar'
                        },
                        {
                          title: 'Ubicación Museo',
                          field: 'ubicacionMuseo'
                        }
                      ]}
                       data={this.state.ejemplares}
                       actions={[
                        {
                          icon: 'edit',
                          tooltip: 'Editar Excavación',
                          onClick: (event, rowData) => {
						                   this.props.history.push(`/editEjemplar/${rowData._id}`); 
							
                          }  
              
                        },
                        {
                          icon: 'delete',
                          tooltip: 'Eliminar Excavación',
                          onClick: (event, rowData) => {
                            // Do save operation
                            if( window.confirm('¿Está seguro de eliminar el Ejemplar seleccionado?'))
                            {
                              this.eliminar(rowData._id); 
                              
                            }
                          }
              
                        },
                        {
                            icon: 'view_column',
                            tooltip: 'Subir Archivos',
                            onClick: (event, rowData) => {
                         
						                   this.props.history.push(`/multimediaEjemplar/${rowData._id}`);
                            }
                
                          }

                      ]}
                      options={{
                           filtering:true,
                           exportButton: true,
                           exportFileName:'Listado de Excavaciones'
                      }}
                      localization= {{
                             header:{
                               actions:'Acciones'
                             }
                      }}
                    />
					


                 </div>    
            </Form.Row>             

            </Form>


             </>
        )

   } 	
	
	
}

export default MainEjemplares;    	