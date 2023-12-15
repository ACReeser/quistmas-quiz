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
        name: 'Melodymoji',
        rows: [
          {points: 100, question: '\n😁2️⃣🌎🌍🌏', size: '22vh', answer: '\'Joy to the World\''},
          {points: 200, question: '\n❗🎺😇🎶', size: '22vh', answer: '\'Hark the Herald Angels Sing\''}, 
          {points: 300, question: '\n⬆️😮⌚📆', size: '21vh', answer: '\'It\'s the\nMost Wonderful Time of the Year \''}, 
          {points: 400, question: '\n⭕⭐😮⭐🌒', size: '21vh', answer:'"O star of wonder, star of night"\n\'We Three Kings\''},
          {points: 500, question: '\n🍁🫵🦵🦵', size: '22vh', answer: '"Fall on your knees"\n\'O Holy Night\''},
        ]
      },
      {
        name: 'Famous Elves',
        rows: [
          {points: 100, question: "", imgSrc: 'https://i.imgur.com/Fa3CN5a.png', size: '14vh', answer: '\n\n\nBuddy'}, 
          {points: 200, question: "", imgSrc: 'https://i.imgur.com/K6GyyJ8.png', size: '14vh', answer: "\n\n\nBernard"}, 
          {points: 300, question: "", imgSrc: 'https://i.imgur.com/Z9UD8kp.jpg', size: '16vh', answer: '\n\n\nHermey'}, 
          {points: 400, question: "", imgSrc: 'https://i.imgur.com/D3ySiIU.jpg', size: '16vh', answer: '\n\n\nJingle & Jangle'}, 
          {points: 500, question: "", imgSrc: 'https://i.imgur.com/i6Nqpg0.jpg', size: '18vh', answer: 'Wayne\n\n\'Prep & Landing\''}, 
        ]
      },
      {
        name: 'Tree Trivia',
        rows: [
          {points: 100, question: "Europeans in the 17th century lit ____ on their trees.", size: '18vh', answer: 'Candles.'}, 
          {points: 200, question: "Which PNW US state cuts the most trees, at 4.7 million trees a year?", size: '16vh', answer: "Oregon"}, 
          {points: 300, question: "Which U. S. President was the first to decorate a Christmas tree with electric lights?", size: '14vh', answer: 'Grover Cleveland in 1894'}, 
          {points: 400, question: "Which English queen established the Christmas tree tradition in Great Britain?", size: '14vh', answer: 'Queen Victoria in 1848'}, 
          {points: 500, question: "Which store sold the first pre-lit Christmas trees?", size: '18vh', answer: 'Target'}, 
        ]
      },
      {
        name: 'Holiday Hodgepodge',
        rows: [
          {points: 100, question: "In which town was the baby Jesus born?", size: '18vh', answer: 'Bethlehem'}, 
          {points: 200, question: "Who said \"Maybe Christmas doesn't come from a store, maybe Christmas, perhaps means more\"?", size: '14vh', answer: 'The Grinch'}, 
          {points: 300, question: "Which American author wrote \"The Gift of the Magi\"?", size: '16vh', answer: 'O. Henry'}, 
          {points: 400, question: "In which fantasy land is it \"always winter but never Christmas\"?", size: '15vh', answer: 'Narnia'}, 
          {points: 500, question: "In what country is it a tradition to eat Kentucky Fried Chicken (KFC) on Christmas?", size: '15vh', answer: 'Japan. Orders must be placed up to two months in advance.'}
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