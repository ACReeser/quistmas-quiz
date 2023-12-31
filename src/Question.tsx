import React from 'react';
import { useState } from 'react';
import './App.css';

function Question(props: {
    teams: string[],
    question: string,
    size: string,
    answer: string,
    imgSrc?: string,
    close: (teamIndexForPoints: number) => void
  }) {
    
  const [showQuestion, setQuestionOrAnswer] = useState(true);
  const imageDetails = {
    background: props.imgSrc != null ? `url(${props.imgSrc})` : '',
    class: props.imgSrc != null ? 'is-image' : '',
  };
  const answerText = props.imgSrc != null ? props.answer : 'A: '+props.answer;
  return (
    <div className="modal">
        <div className={"question "+imageDetails.class} style={{'fontSize': props.size, backgroundImage: imageDetails.background}}>
            {
                showQuestion ? props.question : answerText
            }
        </div>
        <div className='App-flex-h'>
            {
                props.teams.map((teamName, i) => {
                    return <button onClick={() => props.close(i)} className="team-name-small">
                        {teamName} ✅
                    </button>
                })
            }
            <button onClick={() => props.close(-1)} className="team-name-small">
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