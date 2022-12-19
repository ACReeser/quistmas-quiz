import React from 'react';
import { useState } from 'react';
import './App.css';

function Question(props: {
    teams: string[],
    question: string,
    size: string,
    answer: string,
    close: (teamIndexForPoints: number) => void
  }) {
    
  const [showQuestion, setQuestionOrAnswer] = useState(true)
  return (
    <div className="modal">
        <div className="question" style={{'fontSize': props.size}}>
            {
                showQuestion ? props.question : 'A: '+props.answer
            }
        </div>
        <div className='App-flex-h'>
            {
                props.teams.map((teamName, i) => {
                    return <button onClick={() => props.close(i)}>
                        {teamName} ✅
                    </button>
                })
            }
            <button onClick={() => props.close(-1)}>
                All Wrong ❌
            </button>
            <button className='blue' onClick={() => {
                setQuestionOrAnswer(!showQuestion);
            }}>
                {
                    showQuestion ? 'A' : 'Q'
                }
            </button>
        </div>
    </div>
  );
}

export default Question;