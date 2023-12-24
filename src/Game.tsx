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
          {points: 100, question: '\n🎵🔔🎵🔔🪨', size: '22vh', answer: '\'Jingle Bell Rock\''}, 
          {points: 200, question: '\n👁️😴⬜🎄', size: '22vh', answer: '\'I\'m dreaming of a White Christmas\''},
          {points: 300, question: '\nU🧈⌚🐽\nU🧈❌😭', size: '16vh', answer: 'You better watch out, you better not cry\n\'Santa Claus Is Comin’ to Town\''}, 
          {points: 400, question: '\n🔥⬅️🔥😎', size: '21vh', answer:'"Fireside is blazing bright"\n\'This Christmas\''},
          {points: 500, question: '\n🎄🎄⏲️ N👂', size: '18vh', answer: '"Christmas, Christmas time is near"\n\'The Chipmunk Song\''},
        ]
      },
      {
        name: 'Famous Elf-ish',
        rows: [
          {points: 100, question: "", imgSrc: 'https://i.imgur.com/47QzgLN.jpg', size: '14vh', answer: "\n\n\nDobby"}, 
          {points: 200, question: "", imgSrc: 'https://i.imgur.com/nXSIrIo.jpg', size: '14vh', answer: '\n\n\nPapa Elf'}, 
          {points: 300, question: "", imgSrc: 'https://i.imgur.com/EyutnT9.jpg', size: '14vh', answer: '\n\n\nJovie'}, 
          {points: 400, question: "", imgSrc: 'https://i.imgur.com/7uFe3yv.jpg', size: '14vh', answer: '\n\n\nJudy'},
          {points: 500, question: "", imgSrc: 'https://i.imgur.com/l0vIFBy.jpg', size: '14vh', answer: '\n\n\nMartha May Whovier'}, 
        ]
      },
      {
        name: 'Tree Trivia',
        rows: [
          {points: 100, question: "Most families top trees with stars, but some choose a winged ____.", size: '16vh', answer: 'Angel'}, 
          {points: 200, question: "Norwegian families often adorn their trees on ‘Little Christmas Eve’ on what day of Dec?", size: '14vh', answer: "23rd of December"}, 
          {points: 300, question: "Which continental European country supposedly created the Christmas tree tradition?", size: '14vh', answer: 'Germany, 1500s'}, 
          {points: 400, question: "German-American tradition decorates trees with nuts, marzipan cookies, and what fruit?", size: '14vh', answer: 'Apples'}, 
          {points: 500, question: "Before the FDA convinced companies to switch to plastic in 1972, tinsel used to be made out of what poisonous metal?", size: '14vh', answer: 'Lead'}, 
        ]
      },
      {
        name: 'Holiday Hodgepodge',
        rows: [
          {points: 100, question: "In the song 'Silent Night', what words follow 'Silent Night'?", size: '16vh', answer: 'Silent Night \\ Holy Night \\\nAll is calm \\ All is bright'}, 
          {points: 200, question: "According to an animated TV special, who is Rudolph's son?", size: '17vh', answer: 'Robbie the Reindeer'}, 
          {points: 300, question: "Which ballet introduced the celesta for the first time in an orchestral score?", size: '16vh', answer: 'The Nutcracker'}, 
          {points: 400, question: "In the Christmas movie classic, Scrooged, what does Frank Cross (Bill Murray) give his brother for Christmas?", size: '14vh', answer: 'A monogrammed towel'}, 
          {points: 500, question: "Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, Blitzen and Rudolph; which reindeer is named after thunder?", size: '13vh', answer: 'Donner is German for thunder.'}
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