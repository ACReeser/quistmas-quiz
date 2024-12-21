import React, { useState } from 'react';
import './App.css';
import Question from './Question';

interface IGameState{
  categories: {
    name: string,
    rows: {
      points: number|null,
      imgSrc?: string,
      question: string,
      size: string,
      answer: string
    }[]
  }[],
  pointSum: number[],
  currentQuestion?: {
    question: string, 
    categoryI: number, 
    rowI: number, 
    size: string, 
    answer: string,
    imgSrc?: string
  }
}

function beginGameState(teams: string[]): IGameState{
  return {
    categories: [
      {
        name: 'Mixolomoji',
        rows: [
          {points: 100, question: '\n🔥🍫', size: '22vh', answer: 'Hot Chocolate'}, 
          {points: 200, question: '\n🍊🍍🍎🪵🌿', size: '22vh', answer: 'Wassail'},
          {points: 300, question: '\n🎄🥊', size: '21vh', answer: 'Christmas Punch'}, 
          {points: 400, question: '\n🌵🥚🧠', size: '21vh', answer:'Spiked Eggnog'},
          {points: 500, question: '\n🫏🍷', size: '22vh', answer: 'Mulled Wine'},
        ]
      },
      {
        name: 'Fa-la-la-la Fauna',
        rows: [
          {points: 100, question: "\nThe Grinch's\ndog / reindeer?", size: '14vh', answer: 'Max'}, 
          {points: 200, question: "\nFormerly unemployed navigator reindeer?", size: '14vh', answer: "Rudolph"}, 
          {points: 300, question: "\nThe Nutcracker's towering nemesis?", size: '16vh', answer: 'The Mouse / Rat King'}, 
          {points: 400, question: "\nHalloween Town's bestest boy?", size: '16vh', answer: 'Zero'}, 
          {points: 500, question: "____ the extended auditory appendaged ungulate?", size: '18vh', answer: 'Nestor'}, 
        ]
      },
      {
        name: 'Christmas Casting',
        rows: [
          {points: 100, question: "The Grinch in\n“How The Grinch Stole Christmas\"\n(2000)", size: '16vh', answer: 'Jim Carrey'}, 
          {points: 200, question: "The Conductor in\n“The Polar Express\"\n(2004)", size: '16vh', answer: "Tom Hanks"}, 
          {points: 300, question: "George Bailey in\n“It’s a Wonderful Life”\n(1946) ", size: '16vh', answer: 'Jimmy Stewart'}, 
          {points: 400, question: "Kate McCallister in\n“Home Alone”\n(1990)", size: '16vh', answer: 'Catherine O\'Haram'}, 
          {points: 500, question: "Shelter manager Karen Allen in “Scrooged”\n(1988)", size: '16vh', answer: 'Karen Allen'}, 
        ]
      },
      {
        name: 'Holiday Hodgepodge',
        rows: [
          {points: 100, question: "What “spy” hides around the house, telling Santa who has been naughty and nice? Elf on a Shelf?", size: '14vh', answer: 'Elf on a Shelf'}, 
          {points: 200, question: "What color are the berries of mistletoe?", size: '16vh', answer: 'White'}, 
          {points: 300, question: "Which Christmas song was the first song broadcast in space?", size: '16vh', answer: 'Jingle Bells'}, 
          {points: 400, question: "Which arid U.S. state is the home to the town of Snowflake?", size: '16vh', answer: 'Arizona'}, 
          {points: 500, question: "In what year did Edison Co. VP Edward Johnson decorate a tree with the first electric Christmas lights? (Closest wins)", size: '13vh', answer: '1882'}
        ]
      }
    ],
    pointSum: teams.map(x => 0)
  }
}

function loadZeroedQuestions(): {cat: number, i: number}[]{
  const ts = localStorage.getItem('done');
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
function loadPoints(): number[]{
  const ts = localStorage.getItem('points');
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

function Game(props: {
  teams: string[],
  backToMenu: () => void
}) {
  const [state, setState] = useState<IGameState>(() => {
    const template = beginGameState(props.teams);
    loadZeroedQuestions().forEach((q) => {
      if (q.cat != null && q.i != null){
        template.categories[q.cat].rows[q.i].points = null;
      }
    });
    loadPoints().forEach((points, i) => {
      if (template.pointSum[i] != null)
        template.pointSum[i] = points;
    });
    return template
  });
  const zoomQuestion = (catI: number, rowI: number) => {
    return () => {
      const cat = state.categories[catI];
      if (cat){
        const row = cat.rows[rowI];
        if (row){
          setState({
            ...state,
            currentQuestion: {
              question: row.question, 
              categoryI: catI, 
              rowI: rowI, 
              size: row.size, 
              answer: row.answer,
              imgSrc: row.imgSrc
            }
          });
        }
      }
    }
  }
  return (
    <div className='App-flex-v'>
      <div>
        <table className='jeopardy'>
          <thead>
            <tr>
              <th>
                {state.categories[0].name}
              </th>
              <th>
                {state.categories[1].name}
              </th>
              <th>
                {state.categories[2].name}
              </th>
              <th>
                {state.categories[3].name}
              </th>
            </tr>
            <tr>
              {
                [0, 1, 2, 3].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 0)}>{state.categories[cat].rows[0].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 1)}>{state.categories[cat].rows[1].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 2)}>{state.categories[cat].rows[2].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 3)}>{state.categories[cat].rows[3].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 4)}>{state.categories[cat].rows[4].points}</td>
                })
              }
            </tr>
          </thead>
        </table>
      </div>
      <div className='App-flex-h'>
        <div className='App-flex-grow'>
          <img src="/qqlogo.png" className='logo-tiny' onClick={() => props.backToMenu()}/>
        </div>
        {
          props.teams.map((team, i) => {
            return <div className='App-flex-grow team-display App-flex-v-small h-14vh'>
              <div className="team-display-name">{team}</div>
              <div className="team-display-points">{state.pointSum[i]} points</div>
            </div>
          })
        }
      </div>
      {
        state.currentQuestion != null ? 
        <Question teams={props.teams} question={state.currentQuestion.question} size={state.currentQuestion.size} answer={state.currentQuestion.answer} imgSrc={state.currentQuestion.imgSrc} close={(teamIndexForPoints: number) => {
          const categories = {...state.categories};
          const newPoints = [...state.pointSum];
          if (state.currentQuestion){
            if (teamIndexForPoints > -1){
              const questionPoints = categories[state.currentQuestion.categoryI].rows[state.currentQuestion.rowI].points;
              if (questionPoints && newPoints[teamIndexForPoints] != null){
                newPoints[teamIndexForPoints] += questionPoints;
                localStorage.setItem('points', JSON.stringify(newPoints));
              }
            }
            categories[state.currentQuestion.categoryI].rows[state.currentQuestion.rowI].points = null;
            localStorage.setItem('done', JSON.stringify(loadZeroedQuestions().concat([{cat: state.currentQuestion.categoryI, i: state.currentQuestion.rowI}])));
          }
          setState({
            ...state,
            currentQuestion: undefined,
            categories: categories,
            pointSum: newPoints
          })
        }}></Question> : null
      }
    </div>
  );
}

export default Game;