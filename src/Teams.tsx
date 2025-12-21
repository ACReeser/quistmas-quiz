import React from 'react';
import { useState } from 'react';
import './App.css';

function Teams(props: {
    startGame: (teams: string[], initialCurrentTeam: number, initialNextTeam: number) => void
  }) {
    const [state, setState] = useState<{teams: string[], firstTeam: number}>(
        { teams: ["Team 1", "Team 2"], firstTeam: 0 }
    );
    const addTeam = () => {
        setState({
            ...state,
            teams: [
                ...state.teams,
                ''
            ]
        });
    };
    const handleFirstTeamChange = (idx: number) => {
        setState({
            ...state,
            firstTeam: idx
        });
    };
    const nextTeam = (first: number, teams: string[]) => {
        if (teams.length < 2) return 0;
        return (first + 1) % teams.length;
    };
  return (
    <div className="App-flex-v ">
        <img src="/qqlogo.png"/>
        <div className='App-flex-v App-flex-grow-p8' style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {
                state.teams.length === 0 ? <span>No Teams yet</span> : state.teams.map((teamName, i) => {
                    // Calculate dynamic font size and height based on number of teams
                    const baseFont = 2.2;
                    const minFont = 1.2;
                    const fontSize = `clamp(${minFont}rem, ${baseFont - state.teams.length * 0.2}rem, 3vw)`;
                    const baseHeight = 60;
                    const minHeight = 32;
                    const height = `clamp(${minHeight}px, ${baseHeight - state.teams.length * 4}px, 8vh)`;
                    return <label key={i} className='App-flex-grow' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', width: '100%' }}>
                        <span style={{marginRight: '8px', fontSize}}>T #{i+1}</span>
                        <input
                            type="text"
                            value={state.teams[i]}
                            onChange={(ev) => { const newTeams = [...state.teams]; newTeams[i] = ev.target.value; setState({...state, teams: newTeams})}}
                            placeholder={'New Team Name'}
                            style={{marginRight: '8px', fontSize, height}}
                            tabIndex={3*i+0 }
                        />
                        <input
                            type="radio"
                            name="firstTeam"
                            checked={state.firstTeam === i}
                            onChange={() => handleFirstTeamChange(i)}
                            disabled={state.teams.length < 2}
                            style={{marginRight: '4px', height}}
                        />
                        <span style={{marginLeft: '0.5em', fontSize}} onClick={() => { handleFirstTeamChange(i);}}>First?</span>
                        <button
                            type="button"
                            aria-label="Remove team"
                            style={{marginLeft: '16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5em', color: '#c00', height}}
                            disabled={state.teams.length <= 2}
                            onClick={() => {
                                const newTeams = state.teams.filter((_, idx) => idx !== i);
                                let newFirstTeam = state.firstTeam;
                                // If the removed team was the first team, reset to 0
                                if (i === state.firstTeam) newFirstTeam = 0;
                                // If the removed team was before the first team, decrement firstTeam
                                else if (i < state.firstTeam) newFirstTeam = state.firstTeam - 1;
                                setState({...state, teams: newTeams, firstTeam: newFirstTeam});
                            }}
                        >
                            🗑️
                        </button>
                    </label>
                })
            }
            <button onClick={addTeam} style={{marginBottom: '16px', alignSelf: 'center'}}>Add Team</button>
        </div>
        <div className='App-flex-h' style={{height: '44px'}}>
            <button onClick={() => {
                    props.startGame(state.teams, state.firstTeam, nextTeam(state.firstTeam, state.teams));
                }} disabled={state.teams.length < 2}
                style={{background: 'gold', color: '#333', fontWeight: 'bold', minWidth: 120, alignSelf: 'center'}}
            >Begin Game</button>
        </div>
    </div>
  );
}

export default Teams;