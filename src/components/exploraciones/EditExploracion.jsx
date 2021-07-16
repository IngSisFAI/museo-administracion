import React from "react";
import { Form, Button, Tabs, Tab } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faMapMarked, faTimesCircle, faShare } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import ModificarExploracion from '../../areaGeospatial/ModificarExploracion';
import axios from 'axios';
import Moment from 'moment';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import Select from 'react-select';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXPLORACIONES;
const rutaExploraciones = process.env.REACT_APP_RUTA_EXPLORACIONES;


class EditExploracion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nombreArea: "",
      fechaInicio: "",
      fechaTermino: "",
      areaId: "",
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
      tabpicking: true,
      validatedimg: false,
      tabimg: true,
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
      listImages: [],
      foto: null
    };
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
      axios.get('http://museo.fi.uncoma.edu.ar:3006/api/exploracionId/' + this.props.match.params.id, {
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
            selectedIntegrante: integrantesSelect

          });

        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }




  handleNombreChange = (evt) => {
    this.setState({ nombreArea: evt.target.value });
  };

  handleFechaInicioChange = (evt) => {
    this.setState({ fechaInicio: evt.target.value });
  };

  handlefechaTerminoChange = (evt) => {
    this.setState({ fechaTermino: evt.target.value });
  };



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
    const form = document.getElementById("form1");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {


      if (this.state.selectedDirector === null) {
        toast.error('Ingrese un Director.');
      }
      else {

        var data = {
          "nombreArea": this.state.nombreArea,
          "fechaInicio": this.state.fechaInicio,
          "fechaTermino": this.state.fechaTermino,
          "directorId": this.state.selectedDirector.value,
          "integrantesGrupo": this.state.integrantesId
        }

        fetch(urlApi + "/exploracion/" + this.props.match.params.id, {
          method: "put",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + cookies.get('token')
          },
        })
          .then(function (response) {
            if (response.ok) {
              console.log("¡Se guardó la Exploracion con Éxito!");
              this.setState({  key: 'dsolic' });
            
            }
          }.bind(this))
          .catch(function (error) {
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:" + error.message
            );
          });


      }

    }
    this.setState({ validateddbas: true });
  }




  /*handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      var data = {
        "nombre": this.state.nombre,
        "fecha": this.state.fecha
      };



      fetch('http://museo.fi.uncoma.edu.ar:3006/api/exploracion/' + this.props.match.params.id, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          if (response.ok) {
            toast.success("¡Se guardó la Exploracion con Éxito!");
            setTimeout(() => {
              window.location.replace("/exploraciones");
            }, 1500);

          }
        })
        .catch(function (error) {
          toast.error("Error al guardar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch:', error.message);
        });


    }
    this.setState({ validated: true });
  }*/

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
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faMapMarked} /> Editar Exploración
              </h3>
              <hr />

              <Tabs id="tabExploracion" activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey="dbasicos" title="Datos Básicos/Geográficos" disabled={this.state.tabbas}>
                  <Form id="form1" noValidate validated={validateddbas}>


                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="nombre">
                        <Form.Label>Nombre del Área:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Obligatorio"
                          required
                          onChange={this.handleNombreChange}
                          value={this.state.nombreArea}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nombre.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="director">
                        <Form.Label>Director:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          options={this.state.directores.map((opt) => ({
                            label: opt.nombres + " " + opt.apellidos,
                            value: opt._id,
                          }))}
                          onChange={this.handleDirectorChange}
                          value={selectedDirector}
                          isClearable
                        />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="integrantes">
                        <Form.Label>Integrantes Grupo:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          options={this.state.integrantes.map((opt) => ({
                            label: opt.nombres + " " + opt.apellidos,
                            value: opt._id,
                          }))}
                          onChange={this.handleIntegrantesChange}
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
                          onChange={this.handleFechaInicioChange}
                          value={this.state.fechaInicio}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Fecha.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="fechaTermino">
                        <Form.Label>Fecha de Termino:</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={this.handlefechaTerminoChange}
                          value={this.state.fechaTermino}
                        />
                      </Form.Group>
                    </Form.Row>




                    <legend>Datos Geográficos</legend>
                    <hr />
                    <br />
                    <ModificarExploracion exploracionId={this.props.match.params.id} />
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


export default EditExploracion;