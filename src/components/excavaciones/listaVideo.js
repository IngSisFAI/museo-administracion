import React, { Component } from 'react';

class ListaVideo extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
                     listVideo: [],
                     fileVideo:'',
                     descVideo:''
               };
        
               this.borrarVideo = this.borrarVideo.bind(this);
      }

       // Función que captura el valor de los inputs
  // para setearlo en su respectivo estado
  // Para este caso: tour, pax y price
  handleInputVChange = event => {
    const { target } = event;
    const { name, value } = target;

    this.setState({
      [name]: value
    });
  };

  // Esta función se ejecutará al momento de darle click al botón de "Agregar"
  handleVideosSubmit = event => {
    const { fileVideo, descVideo, listVideo } = this.state;

      console.log('File:',fileVideo);
    // Simple validación para que los campos sean campos requeridos
    if (fileVideo && descVideo) {
      const id = listVideo.length + 1;
      // En los states se agrega un nuevo objeto a "list"
      // y se reinicia el estado de tour, pax y price
      this.setState({
        listVideo: [...listVideo, {id,  fileVideo, descVideo }],
        fileVideo: '',
        descVideo: ''
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
        const { fileVideo, descVideo, listVideo } = this.state;

      return (
        <div>
            <form id="formVideos" onSubmit={this.handleVideosSubmit} className="form-horizontal" > 
            <fieldset>
              
                    <div className="input-group">
                        <div className="col-sm-4">
                            <label htmlFor="fileVideo">Video:</label>
                            <input type="file"  
                                   id="fileVideo" 
                                   name="fileVideo"  
                                   className="form-control-file" 
                                   onChange={this.handleInputVChange} 
                                   value={fileVideo} 
                                   accept="video/*"/>
                        </div>

                        <div className="col-sm-8">
                            <label htmlFor="descVideo">Descripción Video:</label>
                            <input type="text"  
                                   id="descVideo" 
                                   name="descVideo" 
                                   className="form-control"
                                   onChange={this.handleInputVChange} 
                                   value={descVideo}  />
                        </div>

                    

                    </div>
                    <br/>
                    <div className="input-group" >
                        <div className="col-sm-6">
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit" >
                        <span className="fa fa-video-camera"></span> Subir Video </button>
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
                        
                            {listVideo.map(item => (
                                <tr key={item.id}>
                                <td>{item.fileVideo.replace("C:\\fakepath\\", "/")}</td>
                                <td>{item.descVideo}</td>
                                <td>
                                <button onClick={()=>this.borrarVideo(item.id)} className="btn btn-outline-danger my-2 my-sm-0"><span className="fa fa-trash" title="Eliminar"></span></button>
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

    borrarVideo(cod) {
        var temp = this.state.listVideo.filter((el)=>el.id !== cod);
        this.setState({
          listVideo: temp
        })
    }  

}  
export default ListaVideo;