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
    teams: loadTeams(),
    initialCurrentTeam: 0,
    initialNextTeam: 1
  });
  return (
    <div className="App">
      {
        state.view == 'game' ? <Game teams={state.teams} backToMenu={() => {
          setState({view: 'menu', teams: state.teams, initialCurrentTeam: state.initialCurrentTeam, initialNextTeam: state.initialNextTeam});
        }} initialCurrentTeam={state.initialCurrentTeam} initialNextTeam={state.initialNextTeam}></Game> : state.view === 'setTeams' ? <Teams startGame={(teams: string[], initialCurrentTeam: number, initialNextTeam: number) => {
          localStorage.setItem('teams', JSON.stringify(teams));
          localStorage.setItem('points', JSON.stringify([]));
          localStorage.setItem('done', JSON.stringify([]));
          setState({view: 'game', teams: teams, initialCurrentTeam, initialNextTeam})
        }}></Teams> : <header className="App-flex-v App-header">
        <img src="/qqlogo.png"/>
        <a
          className="App-link"
          href="javascript:void(0);"
          onClick={() => {setState({view:'setTeams', teams: state.teams, initialCurrentTeam: state.initialCurrentTeam, initialNextTeam: state.initialNextTeam})}}
        >
          Setup New Game
        </a>
        <a
          className={"App-link "+ (state.teams.length > 1 ? '': 'disabled')}
          href="javascript:void(0);"
          onClick={() => {
            if (state.teams.length > 1) {
              setState({view:'game', teams: state.teams, initialCurrentTeam: state.initialCurrentTeam, initialNextTeam: state.initialNextTeam})}
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
