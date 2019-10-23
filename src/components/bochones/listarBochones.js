import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class listarBochones extends Component {

    constructor(props) {
        super(props);
        this.state = {bochones:[]}
       
      }

      componentDidMount(){
        
        if(window.location.search.substring(1)=="")
        { 
            fetch('/api/bochon')
            .then((response) => {
                return response.json()
              })
              .then((bochons) => {
                this.setState({ bochones: bochons.bochones})
              });
        } 
        else
        {
          const urlParams = new URLSearchParams(window.location.search.substring(1))
          const keyNombre = urlParams.get('nombre')
          var urlQuery=''
          

          if ( keyNombre!=="")
          {
             
             urlQuery='/api/bochonNombre/'+keyNombre
          }
          else
          {

            urlQuery='/api/bochon'
          }

        
          fetch(urlQuery)
          .then((response) => {
              return response.json()
            })
            .then((bochons) => {
              this.setState({ bochones: bochons.bochones})
            });

        }     
      }

   render() 
   {
    let imprimir= this.state.bochones.map(function(bochon, i){
        return <tr key={i}><td >{bochon.nombre}</td>
                   <td >{bochon.nroCampo}</td>
                   <td >{bochon.preparador}</td>
                   <td>
                    <Link to={"/editBochon/"+bochon._id} className="btn btn-outline-primary my-2 my-sm-0">
                            <span className="fa fa-edit" title="Editar"></span>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={"/deleteBochon/"+bochon._id} className="btn btn-outline-danger my-2 my-sm-0">
                            <span className="fa fa-trash" title="Editar"></span>
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
                              <th>Nro. Campo</th>
                              <th>Preparador</th> 
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
export default listarBochones;