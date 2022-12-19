import React from 'react';
import { useState } from 'react';
import './App.css';

function Teams(props: {
    startGame: (teams: string[]) => void
  }) {
    const [state, setState] = useState<{teams: string[]}>({
        teams: []
    });
    const addTeam = () => {
        setState({
            teams: [
                ...state.teams,
                ''
            ]
        });
    };
  return (
    <div className="App-flex-v ">
        <img src="/qqlogo.png"/>
        <div className='App-flex-v App-flex-grow-p8'>
            {
                state.teams.length === 0 ? <span>No Teams yet</span> : state.teams.map((teamName, i) => {
                    return <label key={i} className='App-flex-grow'>
                        Team {i+1}
                        <input type="text" value={state.teams[i]} onChange={(ev) => { state.teams[i] = ev.target.value; setState({teams: state.teams})}} placeholder={'New Team Name'}/>
                    </label>
                })
            }
        </div>
        <div className='App-flex-h' style={{height: '44px'}}>
            <button onClick={addTeam}>Add Team</button>
            <button onClick={() => {
                    props.startGame(state.teams);
                }} disabled={state.teams.length < 2}>Begin Game</button>
        </div>
    </div>
  );
}

export default Teams;