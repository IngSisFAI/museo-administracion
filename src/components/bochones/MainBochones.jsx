import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandLizard, faPlus } from '@fortawesome/free-solid-svg-icons'
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

var removeItemFromArr = ( arr, item ) => {
  return arr.filter( e => e !== item );
};

class MainBochones extends React.Component {

    constructor(props) {
        super(props);
        this.state = {bochones:[]}
       
    }

 componentDidMount()
 {
    if(!cookies.get('username') && !cookies.get('password'))
    {
        window.location.href='/';
    }
    else
    {
   
      
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/bochon')
         .then((response) => {
                return response.json()
              })
              .then((bochons) => {
                this.setState({ bochones: bochons.bochones})
              }).catch(function(error) {
                 toast.error("Error al consultar. Intente nuevamente.");
                 console.log("Hubo un problema con la petición Fetch:" , error.message);
        });
      }    

  }		


 eliminar (id, idExcavacion)
  {
	  
	 //  var idExcavacion=this.state.idExcavacion
       var bochones=[]
       var item= id

       //Para eliminar el bochon busco los bochones asociados a la excavacion, obtengo el array de los bochones
       //encontrados, elimino ese bochon de la lista, actualizo la excavacion y finalmente elimino el bochon.-
	     axios.get('http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/'+idExcavacion)
       .then(function(response) {
                      
            bochones=response.data.excavacionId.bochonesEncontrados
            var bochonesFinal=removeItemFromArr(bochones,item)

            var data1 = {
              "bochonesEncontrados": bochonesFinal
            }

            axios.put("http://museo.fi.uncoma.edu.ar:3006/api/excavacionBochon/"+idExcavacion, data1, {
                    headers:{
                      'Content-Type': 'application/json'
                    }   
              }).then(response => {
      
								  fetch("http://museo.fi.uncoma.edu.ar:3006/api/bochon/" + id,
								  {
									  method: "delete"
									}
								  )
									.then(function(response) {
									  if (response.ok) {
										toast.success("¡Se eliminó el Bochón con Éxito!");
										setTimeout(() => {
										  window.location.href='/bochones';
										}, 1500);
									  }
									})
									.catch(function(error) {
									  toast.error("Error al eliminar. Intente nuevamente.");
									  console.log("Hubo un problema con la petición Fetch:" , error.message);
									});
			  }).catch((error) => {
				  toast.error("Error al eliminar. Intente nuevamente.");
				   console.log('Error: ', error.message);
			  })
	   }).catch((error) => {
				  toast.error("Error al eliminar. Intente nuevamente.");
				   console.log('Error: ', error.message);
			  }) 
	  
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
                    
                    <legend> <FontAwesomeIcon icon={faHandLizard} /> Gestión de Bochones</legend>
                    <hr/>  
                    <Link to='/addBochon'>
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
                          title: 'Id. Excavacion',
                          field: 'excavacionId',
                          hidden: true
                        },
                        {
                          title: 'Nombre',
                          field: 'nombre'
                        },
                        {
                          title: 'Nro. Campo',
                          field: 'nroCampo'
                        },
                        {
                          title: 'Preparador',
                          field: 'preparador'
                        }
                      ]}
                       data={this.state.bochones}
                       actions={[
                        {
                          icon: 'edit',
                          tooltip: 'Editar Excavación',
                          onClick: (event, rowData) => {
						                   this.props.history.push(`/editBochon/${rowData._id}`); 
							
                          }  
              
                        },
                        {
                          icon: 'delete',
                          tooltip: 'Eliminar Excavación',
                          onClick: (event, rowData) => {
                            // Do save operation
                            if( window.confirm('¿Está seguro de eliminar el Bochón seleccionado?'))
                            {
                              this.eliminar(rowData._id, rowData.excavacionId); 
                              
                            }
                          }
              
                        }

                      ]}
                      options={{
                           filtering:true,
                           exportButton: true,
                           exportFileName:'Listado de Bochones'
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

export default MainBochones    	