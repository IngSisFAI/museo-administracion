import React from "react";
import { Form, Button, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faMapMarked, faTimesCircle, faShare, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import ModificarExploracion from '../../areaGeospatial/ModificarExploracion';
import axios from 'axios';
import Moment from 'moment';
import Menu from "../Menu"
import Cookies from 'universal-cookie';
import Select from 'react-select';
import $ from 'jquery';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXPLORACIONES;
const rutaExploraciones = process.env.REACT_APP_RUTA_EXPLORACIONES;


class ShowExploracion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nombreArea: "",
      fechaInicio: "",
      fechaTermino: "",
      directorId: '',
      selectedDirector: null,
      directores: [],
      selectedIntegrante: null,
      integrantes: [],
      key: 'dbasicos',
      validateddbas: false,
      tabbas: false,
      validateddsolic: false,
      tabsolic: false,
      validateddpicking: false,
      tabpicking: false,
      validatedimg: false,
      tabimg: false,
      empresa: '',
      proyectoInvestigacion: '',
      otrasEspecificaciones: '',
      archivoAut: null,
      detalle: '',
      archivosImg: [],
      integrantesGrupo: [],
      exploracionId: '',
      urlArchivo: '',
      showSuccess: false,
      showError: false,
      tableArchivosAut: null,
      listArchivosAut: [],
      showSuccessf: false,
      showErrorf: false,
      tableImagenes: null,
      listImages: []
    };
    this.reemplazar = this.reemplazar.bind(this);
  }


  componentWillMount() {

    fetch(urlApi + '/personas', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((people) => {
        this.setState({
          directores: people.personas, integrantes: people.personas
        });

      }).catch(function (error) {
        toast.error("Error al consultar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:",
          error.message
        );
      });

  }


  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      axios.get(urlApi+'/exploracionId/' + this.props.match.params.id, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {

          var fechaT = "";
          if (response.data.exploracionId.fechaTermino !== "" && response.data.exploracionId.fechaTermino !== null) {
            fechaT = (Moment(response.data.exploracionId.fechaTermino).add(1, 'days')).format('YYYY-MM-DD')
          }

          var directorSelect = [];
          if (response.data.exploracionId.directorId !== null && response.data.exploracionId.directorId !== '') {
            directorSelect = this.state.directores.filter(option => option._id === response.data.exploracionId.directorId)
            directorSelect = directorSelect.map((opt) => ({ label: opt.nombres + ' ' + opt.apellidos, value: opt._id }));
          }

          var integrantesSelect = [];
          if (response.data.exploracionId.integrantesGrupo !== null && response.data.exploracionId.integrantesGrupo !== []) {
            integrantesSelect = this.state.integrantes.filter(({ _id }) => response.data.exploracionId.integrantesGrupo.includes(_id))
            integrantesSelect = integrantesSelect.map((opt) => ({ label: opt.nombres + ' ' + opt.apellidos, value: opt._id }));
          }


          this.setState({
            nombreArea: response.data.exploracionId.nombreArea,
            fechaInicio: (Moment(response.data.exploracionId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
            fechaTermino: fechaT,
            directorId: response.data.exploracionId.directorId,
            integrantesGrupo: response.data.exploracionId.integrantesGrupo,
            empresa: response.data.exploracionId.empresa,
            proyectoInvestigacion: response.data.exploracionId.proyectoInvestigacion,
            otrasEspecificaciones: response.data.exploracionId.otrasEspecificaciones,
            detallePicking: response.data.exploracionId.detallePicking,
            imagenesExploracion: response.data.exploracionId.imagenesExploracion,
            archAutorizaciones: response.data.exploracionId.archAutorizaciones,
            selectedDirector: directorSelect,
            selectedIntegrante: integrantesSelect,
            tableArchivosAut: this.cargarArchivosAut(response.data.exploracionId.archAutorizaciones),
            tableImagenes: this.cargarImagenes(response.data.exploracionId.imagenesExploracion)
          });

        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  handleDirectorChange = (selectedDirector) => {
    this.setState({ selectedDirector });
  };

  handleIntegrantesChange = (selectedIntegrante) => {
    let integrantes = Array.from(selectedIntegrante, option => option.value);
    this.setState({ selectedIntegrante });
    this.setState({ integrantesId: integrantes });

  }

  handleSelect = (key) => {
    this.setState({ key: key });

  }

  handleForm1 = (event) => {
    
    this.setState({ tabsolic: false, key: 'dsolic' });
  }

  handleAntForm2 = (event) => {

    this.setState({ tabbas: false, key: 'dbasicos' });

  }

  handleAntForm4 = (event) => {

    this.setState({ tabpicking: false, key: 'dpicking' });

  }

  handleForm2 = (event) => {

      this.setState({ tabpicking: false, key: 'dpicking'});

  }

  cargarArchivosAut(archivos) {

    return archivos.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <a href={encodeURIComponent(urlArchivo+this.props.match.params.id+'/'+file)} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })


  }
  cargarImagenes(imagenes){
    return imagenes.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })
  }

  renderTableArchivosAut() {


    return this.state.listArchivosAut.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoAut(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })

  }

  renderTableImagenes() {

    return this.state.listImages.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarI" onClick={() => this.eliminarImagen(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })

  }

  

  reemplazar(cadena) {

    var chars = {

      "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",

      "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u", "ñ": "n",

      "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",

      "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U", "Ñ": "N",

      "ä": "a", "ë": "e", "ï": "i", "ö": "o", "ü": "u",

      "Ä": "A", "Ä": "A", "Ë": "E", "Ï": "I", "Ö": "O", "Ü": "U"
    }

    var expr = /[áàéèíìóòúùñäëïöü]/ig;

    var res = cadena.replace(expr, function (e) { return chars[e] });

    return res;

  }


  render() {
    const { validateddbas } = this.state;
    const { validateddsolic } = this.state;
    const { validateddpicking } = this.state;
    const { validatedimg } = this.state;
    const { selectedDirector } = this.state;
    const { selectedIntegrante } = this.state;


    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
            <div className="loader" style={{ display: 'none' }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faMapMarked} /> Editar Exploración
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

              <Tabs id="tabExploracion" activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey="dbasicos" title="Datos Básicos/Geográficos" disabled={this.state.tabbas}>
                  <Form id="form1" noValidate validated={validateddbas}>


                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="nombre">
                        <Form.Label>Nombre del Área:</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          value={this.state.nombreArea}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="director">
                        <Form.Label>Director:</Form.Label>
                        <Select

                          disabled
                          value={selectedDirector}
                          isClearable
                        />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="integrantes">
                        <Form.Label>Integrantes Grupo:</Form.Label>
                        <Select
                          disabled
                          value={selectedIntegrante}
                          isClearable
                          isMulti
                        />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="fechaInicio">
                        <Form.Label>Fecha Inicio:</Form.Label>
                        <Form.Control
                          type="date"
                          required
                          disabled
                          value={this.state.fechaInicio}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="fechaTermino">
                        <Form.Label>Fecha de Termino:</Form.Label>
                        <Form.Control
                          type="date"
                          disabled
                          value={this.state.fechaTermino}
                        />
                      </Form.Group>
                    </Form.Row>




                    <legend>Datos Geográficos</legend>
                    <hr />
                    <br />
                    <ModificarExploracion exploracionId={this.props.match.params.id} show={true} />
                    <br />
                    <br />

                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="outline-secondary" type="button" id="siguiente1" onClick={this.handleForm1}>
                          Siguiente  <FontAwesomeIcon icon={faShare} />
                        </Button>
                        &nbsp;&nbsp;
                        <Link to='/exploraciones'>
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Group>

                    </Form.Row>

                  </Form>
                </Tab>

                <Tab eventKey="dsolic" title="Solicitud/Autorización" disabled={this.state.tabsolic}>
                <Form id="form2" noValidate validated={validateddsolic}>
                   
                   <br />
                   <legend>Solicitud de Exploración</legend>
                   <hr />

                   <Form.Row>
                     <Form.Group className="col-sm-12" controlId="empresa">
                       <Form.Label>Empresa:</Form.Label>
                       <Form.Control
                         type="text"
                         disabled
                         value={this.state.empresa}
                       />
                     </Form.Group>
                   </Form.Row>

                   <Form.Row>
                     <Form.Group className="col-sm-12" controlId="proyecto">
                       <Form.Label>Proyecto de Investigación:</Form.Label>
                       <Form.Control
                         type="text"
                         disabled
                         value={this.state.proyectoInvestigacion}
                       />
                     </Form.Group>
                   </Form.Row>

                   <Form.Row>
                     <Form.Group className="col-sm-12" controlId="otras">
                       <Form.Label>Otras Especificaciones:</Form.Label>
                       <Form.Control
                         as='textarea'
                         disabled
                         value={this.state.otrasEspecificaciones}
                       />
                     </Form.Group>
                   </Form.Row>

                   <legend>Autorizaciones</legend>
                   <hr />

                   <Form.Row>
                     <Form.Group className="col-sm-8" controlId="archivospdf">

                       <Table striped bordered hover responsive>
                         <thead className="thead-dark">
                           <tr>
                             <th>Nombre</th>
                           </tr>
                         </thead>
                         <tbody>
                           {this.state.tableArchivosAut}
                         </tbody>
                       </Table>

                     </Form.Group>
                   </Form.Row>
                   <Form.Row >
                     <Button variant="outline-secondary" type="button" id="anterior2" onClick={this.handleAntForm2}>
                       <FontAwesomeIcon icon={faReply} /> Anterior
                     </Button>
                     &nbsp;
                     <Button variant="outline-secondary" type="button" id="siguiente2" onClick={this.handleForm2}>
                       Siguiente <FontAwesomeIcon icon={faShare} />
                     </Button>
                   </Form.Row>
                 </Form>
                </Tab>

                <Tab eventKey="dpicking" title="Picking" disabled={this.state.tabpicking}>
                  <Form id="form3" noValidate validated={validateddpicking}>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="detalle">
                        <Form.Label>Detalles:</Form.Label>
                        <Form.Control
                          as='textarea'
                          disabled
                          rows={5}
                          value={this.state.detallePicking}
                        />
                      </Form.Group>
                    </Form.Row>
                    <br />
                    <br />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Link to="/exploraciones">
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Volver
                          </Button>
                        </Link>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Tab>

                
                <Tab eventKey="dimg" title="Imágenes" disabled={this.state.tabimg}>
                  <Form id="form4" noValidate validated={validatedimg}>
                    <br />
                    <legend>Imágenes Adjuntas</legend>
                    <hr />

                    <Form.Row>
                      <Form.Group className="col-sm-8" >

                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Nombre</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.tableImagenes}
                          </tbody>
                        </Table>


                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior4" onClick={this.handleAntForm4}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>

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


export default ShowExploracion;