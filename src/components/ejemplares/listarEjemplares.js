import React, {Component} from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';

class listarEjemplares extends Component {

    constructor(props) {
        super(props);
        this.state = {ejemplares:[]}
       
      }

      componentDidMount()
      {
        if(window.location.search.substring(1)=="")
        { 
            fetch('/api/ejemplar')
            .then((response) => {
                return response.json()
              })
              .then((ejemplars) => {
                this.setState({ ejemplares: ejemplars.ejemplares})
              });
        }
        else
        {
          const urlParams = new URLSearchParams(window.location.search.substring(1))
          const keyNroColeccion = urlParams.get('nroColeccion')
          const keyNombre = urlParams.get('nombre')
          const keyUbicacion = urlParams.get('ubicacion')
          var urlQuery=''

          if (keyNroColeccion!=="" && keyNombre!=="" && keyUbicacion!=="")
          {
             
             urlQuery='/api/ejemplarFiltro/'+keyNroColeccion+'&'+keyNombre+'&'+ keyUbicacion
          }

          
          
          if (keyNroColeccion!=="" && keyNombre!=="" && keyUbicacion==="")
          {
             
             urlQuery='/api/ejemplarFiltroNroColNom/'+keyNroColeccion+'&'+keyNombre
          }

          
          if (keyNroColeccion==="" && keyNombre!=="" && keyUbicacion!=="")
          {
             
             urlQuery='/api/ejemplarFiltroUbicacionNom/'+keyUbicacion+'&'+keyNombre
          }

          if (keyNroColeccion!=="" && keyNombre==="" && keyUbicacion!=="")
          {
             
             urlQuery='/api/ejemplarFiltroUbicacionNroCol/'+keyUbicacion+'&'+keyNroColeccion
          }

              
          
          if (keyNroColeccion!=="" && keyNombre==="" && keyUbicacion==="")
          {
             
             urlQuery='/api/ejemplarFiltroNroColeccion/'+keyNroColeccion
          }

          if (keyNroColeccion==="" && keyNombre!=="" && keyUbicacion==="")
          {
             
             urlQuery='/api/ejemplarFiltroNombre/'+keyNombre
          }

          if (keyNroColeccion==="" && keyNombre==="" && keyUbicacion!=="")
          {
             
             urlQuery='/api/ejemplarFiltroUbicacion/'+keyUbicacion
          }


          if (keyNroColeccion==="" && keyNombre==="" && keyUbicacion==="")
          {
             
             urlQuery='/api/ejemplar'
          
          }

          fetch(urlQuery)
          .then((response) => {
              return response.json()
            })
            .then((ejemplars) => {
              this.setState({ ejemplares: ejemplars.ejemplares})
            });



        }      
     } 

   render() 
   {
    let imprimir= this.state.ejemplares.map(function(ejemplar, i){
        return <tr key={i}><td >{ejemplar.nombre}</td>
                   <td >{ejemplar.tipoEjemplar}</td>
                   <td >{ejemplar.nroColeccion}</td>
                   <td >{ejemplar.ubicacionMuseo}</td>
                   <td>
                    <Link to={"/editEjemplar/"+ejemplar._id} className="btn btn-outline-primary my-2 my-sm-0">
                            <span className="fa fa-edit" title="Editar"></span>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={"/deleteEjemplar/"+ejemplar._id} className="btn btn-outline-danger my-2 my-sm-0">
                            <span className="fa fa-trash" title="Eliminar"></span>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={"/multimediaEjemplar/"+ejemplar._id} className="btn btn-outline-success my-2 my-sm-0">
                            <span className="fa fa-file-video-o" title="Multimedia"></span>
                    </Link>
                    
                 

                    </td> 
               </tr>}); 

       return (
            <div>
                  <div className="table-responsive">
                  <table className="table table-bordered table-hover list">
                     <thead className="thead-dark">
                        <tr>               
                              <th>Nombre</th>
                              <th>Tipo</th>
                              <th>Nro. Colección</th> 
                              <th>Ubicación Museo</th>
                              <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                          {imprimir}
                      </tbody>
                   </table>
                </div>


            </div>
       )
    }      
}
export default listarEjemplares;      