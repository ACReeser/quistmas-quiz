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
          {points: 100, question: 'Characters:\n💀🐶🧵\n🔊🐛🎅', size: '20vh', answer: 'Nightmare Before Christmas'}, //nightmare before christmas
          {points: 200, question: 'Title:\n☠️💎', size: '25vh', answer: 'Die Hard'}, // Die Hard
          {points: 300, question: 'Props:\n🌝♿💸🎄🔔', size: '25vh', answer: "It's a Wonderful Life"}, //It's a wonderful life
          {points: 400, question: 'Scenes:\n👅🦵🧼🏈🦆', size: '22vh', answer:'A Christmas Story'}, //A Christmas Story
          {points: 500, question: 'Plot:\n💈🚕🎅📨🎶👶', size: '22vh', answer: 'Elf'}, //Elf
        ]
      },
      {
        name: 'Yultide Lyrics',
        rows: [
          {points: 100, question: 'Tiny tots with their eyes all aglow', size: '20vh', answer: 'The Christmas Song'}, //The Christmas Song
          {points: 200, question: 'I wanna wish you a Merry Christmas', size: '20vh', answer: 'Feliz Navidad'}, //Feliz Navidad
          {points: 300, question: 'From angels bending near the earth /\nTo touch their harps of gold', size: '15vh', answer: 'It Came Upon the Midnight Clear'}, //It came upon the midnight clear
          {points: 400, question: 'She\'s candy apple red with a ski for a wheel', size: '20vh', answer: 'Little Saint Nick'}, //Little Saint Nick
          {points: 500, question: 'Voices singing,\nLet\'s be jolly', size: '21vh', answer: 'Rocking Around the Christmas Tree'}, //Rocking around the christmas tree
        ]
      },
      {
        name: 'Holiday Hodegepodge',
        rows: [
          {points: 100, question: "A comet, a conjunction,\nand a 'hypernova' are all hypothetical origins of this bilical nativity spectacle. ", size: '15vh', answer: 'The Star of Bethlehem'}, // star of bethlehem
          {points: 200, question: 'Cookies and candies fill children\'s clogs in this European country.', size: '20vh', answer: 'The Netherlands'}, //Netherlands
          {points: 300, question: 'The common names of the Magi in Western church tradition are Balthazar of Arabia, Caspar of India, and _____ of Persia.', size: '13.5vh', answer: 'Melchior'}, //Melchior
          {points: 400, question: 'Only one ____ in the\nwhole world, joked\nJohnny Carson on this dessert.', size: '16vh', answer: 'Fruitcake'}, //fruitcake
          {points: 500, question: 'Originally an Irish Catholic tradition, this welcoming illumination for travellers and neighbors is now a classic.', size: '14vh', answer: 'A candle in the window'},
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