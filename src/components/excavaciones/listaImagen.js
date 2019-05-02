import React, { Component } from 'react';

class ListaImagen extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
                     listImagen: [],
                     fileImagen:'',
                     descImagen:''
               };
        
               this.borrar = this.borrar.bind(this);
      }

  
    // Función que captura el valor de los inputs
  // para setearlo en su respectivo estado
  // Para este caso: tour, pax y price
  handleInputChange = event => {
    const { target } = event;
    const { name, value } = target;

    this.setState({
      [name]: value
    });
  };

  // Esta función se ejecutará al momento de darle click al botón de "Agregar"
  handleImagenSubmit = event => {
    const { fileImagen, descImagen, listImagen } = this.state;

      console.log('File:',fileImagen);
    // Simple validación para que los campos sean campos requeridos
    if (fileImagen && descImagen) {
      const id = listImagen.length + 1;
      // En los states se agrega un nuevo objeto a "list"
      // y se reinicia el estado de tour, pax y price
      this.setState({
        listImagen: [...listImagen, {id,  fileImagen, descImagen }],
        fileImagen: '',
        descImagen: ''
      });
    } else {
      // Si alguno de los inputs se encuentra vacio
      // se mostrará el siguiente mensaje en la consola del navegador
      console.log('Please complete all fields');
    }

    // Para que no se refresque la página por el onSubmit del formulario
    event.preventDefault();
  };

    render() 
    {
        const { fileImagen, descImagen, listImagen } = this.state;

      return (
        <div>
            <form id="formImages" onSubmit={this.handleImagenSubmit} className="form-horizontal" > 
             <fieldset>
 
    <div className="input-group">
        <div className="col-sm-4">
            <label htmlFor="fileImagen">Imagen:</label>
            <input  type="file"  
                    id="fileImagen" 
                    name="fileImagen" 
                    className="form-control-file"  
                    onChange={this.handleInputChange} 
                    value={fileImagen} 
                    accept="image/*"/>
        </div>

        <div className="col-sm-8">
            <label htmlFor="descImagen">Descripción Imagen:</label>
            <input type="text"  
                   id="descImagen" 
                   name="descImagen"  
                   onChange={this.handleInputChange} 
                   value={descImagen}
                   className="form-control"  />
        </div>

       

    </div>
    <br/>
    <div className="input-group" >
        <div className="col-sm-6">
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" >
           <span className="fa fa-file-image-o"></span> Subir Imagen </button>
        </div>
    </div>

    <br/>

    <div className="form-group">
        <div className="col-sm-6">
           <div className="table-responsive">
                  <table className="table table-bordered table-hover list">
                     <thead className="thead-dark">
                        <tr>               
                            <th>Archivo</th>
                            <th>Descripción</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {listImagen.map(item => (
                            <tr key={item.id}>
                            <td>{item.fileImagen.replace("C:\\fakepath\\", "/")}</td>
                            <td>{item.descImagen}</td>
                            <td>
                               <button onClick={()=>this.borrar(item.id)} className="btn btn-outline-danger my-2 my-sm-0"><span className="fa fa-trash" title="Eliminar"></span></button>
                             </td>
                            </tr>
                        ))}
                            
                  
                        </tbody>   
                    </table> 
           </div>
        </div>
    </div>      
  </fieldset>
   </form>
        </div>
      )
    } 

    borrar(cod) {
        var temp = this.state.listImagen.filter((el)=>el.id !== cod);
        this.setState({
          listImagen: temp
        })
    }  
}
export default ListaImagen;