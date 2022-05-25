import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faMapMarked,
  faCompass,
  faSignOutAlt,
  faKey,
  faUserEdit,
  faMap,
  faFileArchive,
  faIdCard,
  faHandshake,
  faDiagnoses,
  faClone,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Menu extends React.Component {
  cerrarSesion = () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("nombre", { path: "/" });
    cookies.remove("apellido", { path: "/" });
    cookies.remove("user", { path: "/" });
    cookies.remove("password", { path: "/" });
    cookies.remove("permiso", { path: "/" });
    window.location.href = "/";
  };
  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to={"/home"}>
            <FontAwesomeIcon icon={faHome} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Catálogo" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to={"/personas"}>
                  <FontAwesomeIcon icon={faUsers} /> Personas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/exploraciones"}>
                  <FontAwesomeIcon icon={faMapMarked} /> Exploraciones
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to={"/excavaciones"}>
                  <FontAwesomeIcon icon={faCompass} /> Excavaciones
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to={"/ejemplares"}>
                  <FontAwesomeIcon icon={faIdCard} /> Inventario MUC
                </NavDropdown.Item>

               
                {/*   <NavDropdown.Item as={Link} to={"/bochones"}>
                  <FontAwesomeIcon icon={faHandLizard} /> Bochones
    </NavDropdown.Item>*/}
                <NavDropdown.Item as={Link} to={"/documentacion"}>
                  <FontAwesomeIcon icon={faFileArchive} /> Documentación
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/datosGeograficos"}>
                  <FontAwesomeIcon icon={faMap} /> Visualizar Datos Geográficos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/prestamos"}>
                  <FontAwesomeIcon icon={faHandshake} /> Préstamos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/exhibiciones"}>
                  <FontAwesomeIcon icon={faDiagnoses} /> Exhibiciones
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/replicas"}>
                  <FontAwesomeIcon icon={faClone} /> Replicas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/donaciones"}>
                  <FontAwesomeIcon icon={faHandHoldingHeart} /> Donaciones
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Sistema" id="basic-nav-dropdown">
                {cookies.get("permiso") == 1 ? (
                  <NavDropdown.Item as={Link} to={"/usuarios"}>
                    <FontAwesomeIcon icon={faUserEdit} /> Usuarios
                  </NavDropdown.Item>
                ) : (
                  ""
                )}
                <NavDropdown.Item as={Link} to={"/changePassword"}>
                  <FontAwesomeIcon icon={faKey} /> Cambiar Contraseña
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.cerrarSesion()}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Bienvenid@ {cookies.get("nombre") + " " + cookies.get("apellido")}
              !
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export default Menu;
