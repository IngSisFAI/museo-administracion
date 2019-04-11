import React, { Component } from 'react';

import Home from './pages/home'

import Personas from './pages/personas'
import AddPersona from './components/personas/addPersona'
import EditPersona from './components/personas/editPersona'
import DeletePersona from './components/personas/deletePersona'

import Excavaciones from './pages/excavaciones'
import AddExcavacion from './components/excavaciones/addExcavacion'
import EditExcavacion from './components/excavaciones/editExcavacion'
import DeleteExcavacion from './components/excavaciones/deleteExcavacion'

import Exploraciones from './pages/exploraciones'
import AddExploracion from './components/exploraciones/addExploracion'
import EditExploracion from './components/exploraciones/editExploracion'
import DeleteExploracion from './components/exploraciones/deleteExploracion'

import { BrowserRouter, Route } from 'react-router-dom'
import Nav from "./components/Navbar"

import './App.css';
import Excavacion from './areaGeospatial/index';


class App extends Component {

  render() {
    return (
      <div className="App">
       
        <BrowserRouter>
          <div>
            <Nav />
            <Route exact path="/" component={Home} />

            <Route path="/personas" component={Personas} />
            <Route path="/addPersona" component={AddPersona} />
            <Route path="/editPersona/:id" component={EditPersona} />
            <Route path="/deletePersona/:id" component={DeletePersona} />

            <Route path="/exploraciones" component={Exploraciones} />
            <Route path="/addExploracion" component={AddExploracion} />
            <Route path="/editExploracion/:id" component={EditExploracion} />
            <Route path="/deleteExploracion/:id" component={DeleteExploracion} />

            <Route path="/excavaciones" component={Excavaciones} />
            <Route path="/addExcavacion" component={AddExcavacion} />
            <Route path="/editExcavacion/:id" component={EditExcavacion} />
            <Route path="/deleteExcavacion/:id" component={DeleteExcavacion} />
          </div>
        </BrowserRouter>
        {/* <Area /> */}
      </div>
    );
  }
}

export default App;
