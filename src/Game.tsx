import React, { useState } from 'react';
import './App.css';
import Question from './Question';

interface IGameState{
  categories: {
    name: string,
    rows: {
      points: number|null,
      question: string,
      size: string,
      answer: string
    }[]
  }[],
  pointSum: number[],
  currentQuestion?: {question: string, categoryI: number, rowI: number, size: string, answer: string}
}

function beginGameState(teams: string[]): IGameState{
  return {
    categories: [
      {
        name: 'Christmas Cine-moji',
        rows: [
          {points: 100, question: 'Plot:\n🎅🦷⛏️🌨️🔴', size: '20vh', answer: 'Rudolph the Red Nose Reindeer'}, 
          {points: 200, question: 'Title (sounds like):\n📅❌🏜️🦀', size: '22vh', answer: 'Year Without a Sandy Claws'}, 
          {points: 300, question: 'Props:\n⏰🍕📼🚂🕷️', size: '22vh', answer: "Home Alone"},
          {points: 400, question: 'Scenes:\n⛰️🐶🍖🎄🎁', size: '22vh', answer:'How the Grinch Stole Christmas'},
          {points: 500, question: 'Plot:\n🦃👴👊⚖️💌🏡', size: '22vh', answer: 'Miracle on 34th St'},
        ]
      },
      {
        name: 'Yultide Lyrics',
        rows: [
          {points: 100, question: "And everyone is singing\n(oh, yeah)\nI hear those sleigh bells ringing (Oh)", size: '14vh', answer: 'All I Want For Christmas Is You'}, 
          {points: 200, question: "Dolls that will talk and will go for a walk \/\nIs the hope of Janice and Jen;", size: '14vh', answer: "It's Beginning to Look a Lot Like Christmas"}, 
          {points: 300, question: "It'll nearly be like a\npicture print \/\nBy Currier and Ives", size: '16vh', answer: 'Sleigh Ride'}, 
          {points: 400, question: "And there it did both stop and stay \/\nRight over the place where Jesus lay.", size: '16vh', answer: 'The First Noel'}, 
          {points: 500, question: "Hurry down the chimney tonight \/\nHurry, tonight", size: '18vh', answer: 'Santa Baby'}, 
        ]
      },
      {
        name: 'Holiday Hodegepodge',
        rows: [
          {points: 100, question: "Which one of Santa's reindeer has the same name as another holiday mascot?", size: '15vh', answer: 'Cupid'}, 
          {points: 200, question: "What did my true love give to me on the eighth day of Christmas?", size: '15vh', answer: '8 Maids a Milking'}, 
          {points: 300, question: "Stars, needle, plate, dendrite, column, lacy, and capped column are the six main types of what?", size: '15vh', answer: 'Snowflakes'}, 
          {points: 400, question: "Which incredibly popular Christmas song was originally written for Thanksgiving in 1857?", size: '15vh', answer: 'Jingle Bells'}, 
          {points: 500, question: "In which modern-day country was the canonical Saint Nicholas born in?", size: '15vh', answer: 'Turkey (Lycia, Asia Minor)'}
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
            currentQuestion: {question: row.question, categoryI: catI, rowI: rowI, size: row.size, answer: row.answer}
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
            </tr>
            <tr>
              {
                [0, 1, 2].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 0)}>{state.categories[cat].rows[0].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 1)}>{state.categories[cat].rows[1].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 2)}>{state.categories[cat].rows[2].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 3)}>{state.categories[cat].rows[3].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2].map((cat) => {
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
            return <div className='App-flex-grow team-display App-flex-v-small'>
              <span>{team}</span>
              <span>{state.pointSum[i]}pts </span>
            </div>
          })
        }
      </div>
      {
        state.currentQuestion != null ? 
        <Question teams={props.teams} question={state.currentQuestion.question} size={state.currentQuestion.size} answer={state.currentQuestion.answer} close={(teamIndexForPoints: number) => {
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