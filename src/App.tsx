import React from 'react';
import { useState } from 'react';
import './App.css';
import Game from './Game';
import Teams from './Teams';

function loadTeams(): string[]{
  const ts = localStorage.getItem('teams');
  if (ts != null && ts.length > 0 && ts != 'null'){
    const parsed = JSON.parse(ts);
    if (Array.isArray(parsed))
      return parsed;
    else
      return [];
  } else {
    return [];
  }
}

function App() {
  const [state, setState] = useState({
    view: 'menu',
    teams: loadTeams()
  });
  return (
    <div className="App">
      {
        state.view == 'game' ? <Game teams={state.teams} backToMenu={() => {
          setState({view: 'menu', teams: state.teams});
        }}></Game> : state.view === 'setTeams' ? <Teams startGame={(teams: string[]) => {
          localStorage.setItem('teams', JSON.stringify(teams));
          localStorage.setItem('points', JSON.stringify([]));
          localStorage.setItem('done', JSON.stringify([]));
          setState({view: 'game', teams: teams})
        }}></Teams> : <header className="App-flex-v App-header">
        <img src="/qqlogo.png"/>
        <a
          className="App-link"
          href="javascript:void(0);"
          onClick={() => {setState({view:'setTeams', teams: state.teams})}}
        >
          Setup New Game
        </a>
        <a
          className={"App-link "+ (state.teams.length > 1 ? '': 'disabled')}
          href="javascript:void(0);"
          onClick={() => {
            if (state.teams.length > 1) {
              setState({view:'game', teams: state.teams})}
            }
          }
        >
          Resume Game
        </a>
      </header>      
      }
    </div>
  );
}

export default App;
