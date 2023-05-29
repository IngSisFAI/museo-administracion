import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//import Menu from "./components/Menu"
import Login from "./components/Login";

import Home from "./components/home";

//Personas
import Personas from "./components/personas/MainPersonas";
import AddPersona from "./components/personas/AddPersona";
import EditPersona from "./components/personas/EditPersona";

//Exploraciones
import Exploraciones from "./components/exploraciones/MainExploraciones";
import AddExploracion from "./components/exploraciones/AddExploracion";
import EditExploracion from "./components/exploraciones/EditExploracion";

//Excavaciones
import Excavaciones from "./components/excavaciones/MainExcavaciones";
import AddExcavacion from "./components/excavaciones/AddExcavacion";
import EditExcavacion from "./components/excavaciones/EditExcavacion";

// Datos DatosGeograficos
import ObtenerExploraciones from "./areaGeospatial/ObtenerExploraciones";

//Ejemplares
import Ejemplares from "./components/ejemplares/MainEjemplares";
import AddEjemplar from "./components/ejemplares/AddEjemplar";
import EditEjemplar from "./components/ejemplares/EditEjemplar";

//Bochones
import Bochones from "./components/bochones/MainBochones";
import AddBochon from "./components/bochones/AddBochon";
import EditBochon from "./components/bochones/EditBochon";

//Usuarios
import Usuarios from "./components/usuarios/MainUsuarios";
import AddUsuario from "./components/usuarios/AddUsuario";
import EditUsuario from "./components/usuarios/EditUsuario";
import ChangePassword from "./components/usuarios/ChangePassword";

//Documentacion
import Documentacion from "./components/documentacion/MainDocumentacion";

//Prestamos
import Prestamos from "./components/prestamos/MainPrestamo";
import AddPrestamo from "./components/prestamos/AddPrestamo";
import EditPrestamo from "./components/prestamos/EditPrestamo";
import ShowPrestamo from "./components/prestamos/ShowPrestamo";

//Exhibiciones
import Exhibiciones from "./components/exhibiciones/MainExhibicion";
import EditExhibicion from "./components/exhibiciones/EditExhibicion";
import AddExhibicion from "./components/exhibiciones/AddExhibicion";
import ShowExhibicion from "./components/exhibiciones/ShowExhibicion";

//Replica
import Replicas from "./components/replicas/MainReplica";
import EditReplica from "./components/replicas/EditReplica";
import AddReplica from "./components/replicas/AddReplica";
import ShowReplica from "./components/replicas/ShowReplica";

//Donación
import AddDonaciones from "./components/donaciones/AddDonaciones";
import EditDonaciones from "./components/donaciones/EditDonaciones";
import Donaciones from "./components/donaciones/MainDonaciones";
import ShowDonaciones from "./components/donaciones/ShowDonaciones";

class App extends Component {
    render() {
        return ( <
            BrowserRouter >
            <
            Switch >
            <
            Route exact path = "/"
            component = { Login }
            />

            <
            Route exact path = "/home"
            component = { Home }
            /> <
            Route path = "/personas"
            component = { Personas }
            /> <
            Route path = "/addPersona"
            component = { AddPersona }
            /> <
            Route path = "/editPersona/:id"
            component = { EditPersona }
            />

            <
            Route path = "/exploraciones"
            component = { Exploraciones }
            /> <
            Route path = "/addExploracion"
            component = { AddExploracion }
            /> <
            Route path = "/editExploracion/:id"
            component = { EditExploracion }
            /> <
            Route path = "/datosGeograficos"
            component = { ObtenerExploraciones }
            />

            <
            Route path = "/excavaciones"
            component = { Excavaciones }
            /> <
            Route path = "/addExcavacion"
            component = { AddExcavacion }
            /> <
            Route path = "/editExcavacion/:id"
            component = { EditExcavacion }
            />

            <
            Route path = "/ejemplares"
            component = { Ejemplares }
            /> <
            Route path = "/addEjemplar"
            component = { AddEjemplar }
            /> <
            Route path = "/editEjemplar/:id"
            component = { EditEjemplar }
            />


            <
            Route path = "/bochones"
            component = { Bochones }
            /> <
            Route path = "/addBochon"
            component = { AddBochon }
            /> <
            Route path = "/editBochon/:id"
            component = { EditBochon }
            />

            <
            Route path = "/documentacion"
            component = { Documentacion }
            />

            <
            Route path = "/prestamos"
            component = { Prestamos }
            /> <
            Route path = "/addPrestamo"
            component = { AddPrestamo }
            /> <
            Route path = "/editPrestamo/:id"
            component = { EditPrestamo }
            /> <
            Route path = "/showPrestamo/:id"
            component = { ShowPrestamo }
            />

            <
            Route path = "/exhibiciones"
            component = { Exhibiciones }
            /> <
            Route path = "/addExhibicion"
            component = { AddExhibicion }
            /> <
            Route path = "/editExhibicion/:id"
            component = { EditExhibicion }
            /> <
            Route path = "/showExhibicion/:id"
            component = { ShowExhibicion }
            />

            <
            Route path = "/replicas"
            component = { Replicas }
            /> <
            Route path = "/addReplica"
            component = { AddReplica }
            /> <
            Route path = "/editReplica/:id"
            component = { EditReplica }
            /> <
            Route path = "/showReplica/:id"
            component = { ShowReplica }
            />

            <
            Route path = "/donaciones"
            component = { Donaciones }
            /> <
            Route path = "/addDonaciones"
            component = { AddDonaciones }
            /> <
            Route path = "/editDonaciones/:id"
            component = { EditDonaciones }
            /> <
            Route path = "/showDonaciones/:id"
            component = { ShowDonaciones }
            />

            <
            Route path = "/usuarios"
            component = { Usuarios }
            /> <
            Route path = "/addUsuario"
            component = { AddUsuario }
            /> <
            Route path = "/editUsuario/:id"
            component = { EditUsuario }
            /> <
            Route path = "/changePassword"
            component = { ChangePassword }
            />

            <
            Route component = { Login }
            /> < /
            Switch > <
            /BrowserRouter>
        );
    }
}

export default App;