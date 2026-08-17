import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faDownload } from '@fortawesome/free-solid-svg-icons';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import Menu from "../Menu";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const urlApi = process.env.REACT_APP_API_HOST;

class ExportEjemplares extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ejemplares: [] };
  }

  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    } else {
      fetch(urlApi + '/ejemplares', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
      .then(response => response.json())
      .then(ejemplars => {
        this.setState({ ejemplares: ejemplars.ejemplares });
      })
      .catch(error => {
        toast.error("Error al consultar. Intente nuevamente.");
        console.log("Error en la petición Fetch:", error.message);
      });
    }
  }

  handleExportCSV = () => {
    const { ejemplares } = this.state;

    // Encabezados de la tabla
    const headers = [
      "Sigla", "Fecha de Ingreso", "Tipo Colección", "Fecha de Baja", "Motivo de Baja",
      "Formación", "Grupo", "Subgrupo", "Edad", "Período", "Era",
      "Reino", "Filo", "Clase", "Orden", "Familia", "Género", "Especie",
      "Área de Hallazgo", "Ubicación", "Tipo de Intervención", "Autores", "Publicaciones",
      "Observaciones Adicionales"
    ];

    // Convertir los datos en formato CSV con ';' como separador
    const csvRows = [];

    // Agregar encabezados
    csvRows.push(headers.join(";"));

    // Agregar datos de cada ejemplar
    ejemplares.forEach(e => {
      const row = [
        e.sigla,
        e.fechaIngreso,
        e.tipoColeccion,
        e.fechaBaja || "",
        e.motivoBaja || "",
        (e.eraGeologica && e.eraGeologica.formacion) || "",
        (e.eraGeologica && e.eraGeologica.grupo) || "",
        (e.eraGeologica && e.eraGeologica.subgrupo) || "",
        (e.eraGeologica && e.eraGeologica.edad) || "",
        (e.eraGeologica && e.eraGeologica.periodo) || "",
        (e.eraGeologica && e.eraGeologica.era) || "",
        e.taxonReino || "",
        e.taxonFilo || "",
        e.taxonClase || "",
        e.taxonOrden || "",
        e.taxonFamilia || "",
        e.taxonGenero || "",
        e.taxonEspecie || "",
        (e.areaHallazgo && e.areaHallazgo.nombreArea) || "",
        e.ubicacionMuseo || "",
        e.tipoIntervencion || "",
        e.autores || "",
        e.publicaciones || "",
        e.observacionesAdic || ""
      ];
      
      csvRows.push(row.join(";"));
    });

    // Unimos todas las filas con saltos de línea
    const csvString = csvRows.join("\n");

    // Crear un Blob y descargar el archivo
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Inventario.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    return (
      <>
        <Menu />
        <Form>
          <br />
          <ToastContainer position="top-right" autoClose={5000} transition={Slide} hideProgressBar newestOnTop closeOnClick pauseOnHover />
          <Form.Row>
            <div id="contenido" align="left" className="container">
              <legend><FontAwesomeIcon icon={faIdCard} /> Inventario MPCN</legend>
              <hr />

              <MaterialTable
                title="Listado"
                columns={[
                  { title: 'Sigla', field: 'sigla' },
                  { title: 'Fecha de Ingreso', field: 'fechaIngreso' },
                  { title: 'Tipo Colección', field: 'tipoColeccion' },
                  { title: 'Fecha de Baja', field: 'fechaBaja' },
                  { title: 'Motivo de Baja', field: 'motivoBaja' },
                  { title: 'Formación', field: 'eraGeologica.formacion' },
                  { title: 'Grupo', field: 'eraGeologica.grupo' },
                  { title: 'Subgrupo', field: 'eraGeologica.subgrupo' },
                  { title: 'Edad', field: 'eraGeologica.edad' },
                  { title: 'Período', field: 'eraGeologica.periodo' },
                  { title: 'Era', field: 'eraGeologica.era' },
                  { title: 'Reino', field: 'taxonReino' },
                  { title: 'Filo', field: 'taxonFilo' },
                  { title: 'Clase', field: 'taxonClase' },
                  { title: 'Orden', field: 'taxonOrden' },
                  { title: 'Familia', field: 'taxonFamilia' },
                  { title: 'Género', field: 'taxonGenero' },
                  { title: 'Especie', field: 'taxonEspecie' },
                  { title: 'Área de Hallazgo', field: 'areaHallazgo.nombreArea' },
                  { title: 'Ubicación', field: 'ubicacionMuseo' },
                  { title: 'Tipo de Intervención', field: 'tipoIntervencion' },
                  { title: 'Autores', field: 'autores' },
                  { title: 'Publicaciones', field: 'publicaciones' },
                  { title: 'Observaciones Adicionales', field: 'observacionesAdic' }
                ]}
                data={this.state.ejemplares}
                options={{
                  filtering: true,
                  pageSizeOptions: [5, 10, 20, this.state.ejemplares.length]
                }}
                localization={{ header: { actions: 'Acciones' } }}
              />

              <Button variant="primary" onClick={this.handleExportCSV} className="mt-3">
                <FontAwesomeIcon icon={faDownload} /> Exportar CSV
              </Button>
            </div>
          </Form.Row>
        </Form>
      </>
    );
  }
}

export default ExportEjemplares;
