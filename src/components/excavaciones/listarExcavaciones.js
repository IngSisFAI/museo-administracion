import React, {Component} from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';

class listarExcavaciones extends Component {

    constructor(props) {
        super(props);
        this.state = {excavaciones:[]}
       
      }

      componentDidMount(){
        
        if(window.location.search.substring(1)=="")
        { 
            fetch('/api/excavacion')
            .then((response) => {
                return response.json()
              })
              .then((excavacions) => {
                this.setState({ excavaciones: excavacions.excavaciones})
              });
        } 
        else
        {
          const urlParams = new URLSearchParams(window.location.search.substring(1))
          const keyCodigo = urlParams.get('codigo')
          const keyNombre = urlParams.get('nombre')
          var urlQuery=''
          

          if (keyCodigo!=="" && keyNombre!=="")
          {
             
             urlQuery='/api/excavacionFiltro/'+keyCodigo+'&'+keyNombre
          }

          if (keyCodigo!=="" && keyNombre==="")
          {
             
             urlQuery='/api/excavacionFiltroCode/'+keyCodigo
          }

          if (keyCodigo==="" && keyNombre!=="")
          {
             
             urlQuery='/api/excavacionFiltroName/'+keyNombre
          }

          if (keyCodigo==="" && keyNombre==="")
          {
             
             urlQuery='/api/excavacion/'
          }

          fetch(urlQuery)
          .then((response) => {
              return response.json()
            })
            .then((excavacions) => {
              this.setState({ excavaciones: excavacions.excavaciones})
            });


        }     
      }

   render() 
   {
    let imprimir= this.state.excavaciones.map(function(excavacion, i){
        return <tr key={i}><td >{excavacion.codigo}</td>
                   <td >{excavacion.nombre}</td>
                   <td >{(Moment(excavacion.fechaInicio).add(1, 'days')).format('DD/MM/YYYY')}</td>
                   <td >{excavacion.director}</td>
                   <td>
                    <Link to={"/editExcavacion/"+excavacion._id} className="btn btn-outline-primary my-2 my-sm-0">
                            <span className="fa fa-edit" title="Editar"></span>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={"/deleteExcavacion/"+excavacion._id} className="btn btn-outline-danger my-2 my-sm-0">
                            <span className="fa fa-trash" title="Editar"></span>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={"/multimedia/"+excavacion._id} className="btn btn-outline-success my-2 my-sm-0">
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
                              <th>Código</th>
                              <th>Nombre</th>
                              <th>Fecha Inicio</th> 
                              <th>Director</th>
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
export default listarExcavaciones;