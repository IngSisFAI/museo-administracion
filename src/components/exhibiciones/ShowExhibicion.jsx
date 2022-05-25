import React from "react";
import { Form, Button, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import axios from 'axios';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();
//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST
const urlImage = process.env.REACT_APP_IMAGEN_EXHIBICION;
const urlDoc = process.env.REACT_APP_DOC_EXHIBICION;
const rutaImg = process.env.REACT_APP_RUTA_IMG_EXHIBICION;
const rutaDoc = process.env.REACT_APP_RUTA_DOC_EXHIBICION;

class ShowExhibicion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        nroActa: "",
        descripcion: "",
        fecha: "",
        fechaFin:  "",
        ubicacion:  "",
        tipo:  "",
        responsableMuseo:  "",
        responsableRecibe:  "",
        institucion:  "",
        foto: "",
        documentacion: "",

      show: false,
      extFoto: '',
      validated: false,
      tabbas: false,
      key: 'dbasicos',
      validatedfile: false,
      tabfile: false,
      showSuccess: false,
      showError: false,
      showSuccessdoc: false,
      showErrordoc: false,
      archivoFoto: '',
      archivoDoc: '',
      tableDoc: null,
      tableImage: null,
    }
  }

  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      fetch(urlApi + '/exhibicionId/' + this.props.match.params.id,
        {
          headers: {
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
        .then(res => res.json())
        .then(
          (response) => {
            this.setState({
              nroActa: response.exhibicionId.nroActa,
              descripcion: response.exhibicionId.descripcion,
              //fecha: response.replicaId.fecha,
              fecha: (Moment(response.exhibicionId.fecha).add(0, 'days')).format('YYYY-MM-DD'),
              fechaFin: (Moment(response.exhibicionId.fechaFin).add(0, 'days')).format('YYYY-MM-DD'),
                ubicacion:  response.exhibicionId.ubicacion,
                tipo:  response.exhibicionId.tipo,
                responsableMuseo:  response.exhibicionId.responsableMuseo,
                responsableRecibe:  response.exhibicionId.responsableRecibe,
                institucion:  response.exhibicionId.institucion,
                foto: response.exhibicionId.foto,
              documentacion: response.exhibicionId.documentacion,
              tableDoc: this.cargarTableDataDoc(response.exhibicionId.documentacion),
              tableImage: this.cargarTableDataFoto(response.exhibicionId.foto),
            });
          }).catch(error => {
            console.log("Error:", error.message)
          });
    }
  }

  handleSelect = (key) => {
    this.setState({ key: key });
  }

  cargarTableDataDoc(cv) {
    //let cv= this.state.curriculum

    if (cv !== null && cv !== "") {
      return (
        <tr key={Math.floor(Math.random() * 1000)}>
          <td>
            
          </td>
          <td>
            <a href={urlDoc + cv} disabled target="_blank">{cv}</a>
          </td>
        </tr>
      )
    }
    else {
      return (<></>)
    }
  }

  cargarTableDataFoto(foto) {
    // alert(foto);
    if (foto !== null && foto !== "") {
      return (
        <tr key={Math.floor(Math.random() * 1000)}>
          <td>
            
          </td>
          <td>
            <a href={urlImage + foto} disabled target="_blank">{foto}</a>
          </td>
        </tr>
      )
    }
    else {
      return (<></>)
    }
  }


  render() {
    const { validated } = this.state;
    const { validatedfile } = this.state;
    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: 'none' }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faClone} /> Mostrar Replica
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
              <Tabs id="tabReplicas" activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey="dbasicos" title="Datos Básicos" disabled={this.state.tabbas}>
                  <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                    <br />   
                    <Form.Row >
                      <Form.Group className="col-sm-6" controlId="nroActa">
                        <Form.Label>Número Acta:</Form.Label>
                        <Form.Control type="number" placeholder="Ingrese Nro. de Acta"  value={this.state.nroActa} />
                      </Form.Group>
                      <Form.Group className="col-sm-6" controlId="tipo">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control type="text" value={this.state.tipo} />
                      </Form.Group>
                      </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="fecha">
                        <Form.Label>Fecha Inicio:</Form.Label>
                        <Form.Control type="date" value={this.state.fecha}  />
                      </Form.Group>
                      <Form.Group className="col-sm-6" controlId="fechaFin">
                        <Form.Label>Fecha Finalización:</Form.Label>
                        <Form.Control type="date" value={this.state.fechaFin}  />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="responsableMuseo">
                        <Form.Label>Responsable Museo:</Form.Label>
                        <Form.Control type="text" value={this.state.responsableMuseo} />
        
                      </Form.Group>
                      <Form.Group className="col-sm-6" controlId="responsableRecibe">
                        <Form.Label>Responsable recibe:</Form.Label>
                        <Form.Control type="text" value={this.state.responsableRecibe} />
                        
                      </Form.Group>
                    </Form.Row>    
                    <Form.Row >
                    <Form.Group className="col-sm-6" controlId="institucion">
                        <Form.Label>Institución:</Form.Label>
                        <Form.Control type="text"  value={this.state.institucion} />
                        
                      </Form.Group>
                      <Form.Group className="col-sm-6" controlId="responsableRecibe">
                        <Form.Label>Ubicación:</Form.Label>
                        <Form.Control type="text"  value={this.state.ubicacion} />
                        
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="descripcion" >
                      <Form.Label>Descripción:</Form.Label>
                        <Form.Control as="textarea" rows={2} value={this.state.descripcion} />
                      </Form.Group>
                    </Form.Row>
                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Link to='/exhibiciones'>
                        <Button variant="primary" type="button" id="volver">
                          <FontAwesomeIcon icon={faArrowLeft} /> Volver
                        </Button>
                        </Link>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                
                </Tab>
                <Tab eventKey="dfiles" title="Archivos Adjuntos" disabled={this.state.tabfile}>
                  <Form id="form" noValidate validated={validatedfile}>
                    <br />
                    <Form.Row >
                      <Form.Group className="col-sm-12">
                        <Form.Label>Foto(s):</Form.Label>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="listFoto">
                        <Table border="0">
                          <tbody id="tbodyimage">
                            {this.state.tableImage}
                          </tbody>
                        </Table>
                      </Form.Group>
                    
                    <Form.Row >
                      <Form.Group className="col-sm-12" >
                        <Form.Label>Documentación:</Form.Label>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="listDoc">
                        <Table border="0">
                          <tbody>
                            {this.state.tableDoc}
                          </tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>
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

export default withRouter(ShowExhibicion);