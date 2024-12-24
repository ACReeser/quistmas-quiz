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
          {points: 100, question: '\n🍎 cy+🚪', size: '22vh', answer: 'Apple Cider'}, 
          {points: 200, question: '\n🌶️🍬 🐮+ca', size: '22vh', answer: 'Peppermint Mocha'},
          {points: 300, question: '\n🌮🔥🍫', size: '22vh', answer: 'Mexican Hot Chocolate'},
          {points: 400, question: '\n🔥🧈 🏃‍♂️-n+m', size: '21vh', answer: 'Hot Buttered Rum'}, 
          {points: 500, question: '\n😾 and 🐭 (names)', size: '21vh', answer:'Tom and Jerry'},
        ]
      },
      {
        name: 'Fa-la-la-la Fauna',
        rows: [
          {points: 100, question: "\nBright and starry reindeer?", size: '14vh', answer: 'Comet'}, 
          {points: 200, question: "\nRobbie the reindeer's nemesis?", size: '14vh', answer: "Blitzen"}, 
          {points: 300, question: "\nDecorates his doghouse with Christmas lights?", size: '14vh', answer: 'Snoopy'}, 
          {points: 400, question: "\nHouse-invading turkey-eating hounds?", size: '16vh', answer: 'Bumpus\'s hound dogs'}, 
          {points: 500, question: "Lost penguin from\n“Santa Claus is Comin' to Town”", size: '18vh', answer: 'Topper'}, 
        ]
      },
      {
        name: 'Christmas Casting',
        rows: [
          {points: 100, question: "Ebenezer Scrooge in\n“The Muppet Christmas Carol\" (1992)", size: '16vh', answer: 'Michael Caine'}, 
          {points: 200, question: "Jovie in\n“Elf\"\n(2003)", size: '16vh', answer: "Zooey Deschanel"}, 
          {points: 300, question: "Gus Polinkski in\n“Home Alone”\n(1990)", size: '16vh', answer: 'Johny Candy'}, 
          {points: 400, question: "Overworked assistant Grace Cooley in “Scrooged”\n(1988)", size: '16vh', answer: 'Alfre Woodard'}, 
          {points: 500, question: "Mrs. Parker in\n“A Christmas Story”\n(1983) ", size: '16vh', answer: 'Melinda Dillon'}, 
        ]
      },
      {
        name: 'Holiday Hodgepodge',
        rows: [
          {points: 100, question: "How many ghosts show themselves to Scrooge in the original A Christmas Carol?", size: '14vh', answer: '4 (Marley, Past, Present, and Future)'}, 
          {points: 200, question: "What was Frosty the Snowman’s nose made out of?", size: '16vh', answer: 'A button'}, 
          {points: 300, question: "What hymn was written by a Pastor when a church organ broke?", size: '16vh', answer: 'Silent Night'}, 
          {points: 400, question: "Which Nordic country donates the Christmas tree in London's Trafalgar Square?", size: '16vh', answer: 'Norway'}, 
          {points: 500, question: "The bones of St. Nicholas of Myra were stolen in 1087 by sailors from this Mediterranean country?", size: '13vh', answer: 'Italy, from the city of Bari'}
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