import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Moment from 'moment';



class listarExploraciones extends Component {

  constructor(props) {
    super(props);
    this.state = {exploraciones:[]}
   
  }

  componentDidMount(){
      
    if(window.location.search.substring(1)=="")
    {
        axios.get('api/exploracion')
          .then(response => {
           this.setState({ exploraciones: response.data.exploraciones });
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    else{

      const urlParams = new URLSearchParams(window.location.search.substring(1))
      const keyNombre = urlParams.get('nombre')
  
    
      if(keyNombre!="")
      {  
          axios.get('http://localhost:3001/api/exploracionesFiltro/'+keyNombre)
              .then(response => {
                this.setState({ exploraciones: response.data.exploraciones}); 
                
              })
              .catch(function (error) {
                console.log(error);
              })
      }
      else
      {
            axios.get('api/exploracion')
            .then(response => {
            this.setState({ exploraciones: response.data.exploraciones });
            })
            .catch(function (error) {
              console.log(error);
            })

      }
    }
  }

  
  render() 
  { 
    
    
    // console.log("ARREGLO:",this.state.exploraciones);

      let imprimir= this.state.exploraciones.map(function(exploracion, i){
      return <tr key={i}><td >{exploracion.nombre}</td>
                 <td >{(Moment(exploracion.fecha).add(1, 'days')).format('DD/MM/YYYY')}</td>
                 <td ></td>
                 <td>
                  <Link to={"/editExploracion/"+exploracion._id} className="btn btn-outline-primary my-2 my-sm-0">
                          <span className="fa fa-edit" title="Editar"></span>
                  </Link>
                  &nbsp;&nbsp;
                  <Link to={"/deleteExploracion/"+exploracion._id} className="btn btn-outline-danger my-2 my-sm-0">
                          <span className="fa fa-trash" title="Editar"></span>
                  </Link>
                  
               

                  </td> 
             </tr>});
     
    return (<div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover list">
                   <thead className="thead-dark">
                      <tr>               
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Area</th> 
                            <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {imprimir}
                    </tbody>
                 </table>
              </div>
           </div>);
  }
}
export default listarExploraciones;