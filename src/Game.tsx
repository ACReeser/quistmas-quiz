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
        name: 'Yummoji',
        rows: [
          {points: 100, question: '\n🦃🦆🐓', size: '22vh', answer: 'Turducken'}, 
          {points: 200, question: '\n🎄🪵', size: '22vh', answer: 'Yule Log'},
          {points: 300, question: '\n🫚🍞👨', size: '22vh', answer: 'Gingerbread Man'},
          {points: 400, question: '\n🌶️🍬🐶', size: '21vh', answer: 'Peppermint Bark'}, 
          {points: 500, question: '\n🍃🔑💩🛎️', size: '21vh', answer:'Figgy Pudding'},
        ]
      },
      {
        name: 'Holiday Horror',
        rows: [
          {points: 100, question: "What fossil fuel does Santa famously leave for \"naughty\" children?", size: '14vh', answer: 'Coal'}, 
          {points: 200, question: " In the song \"It’s the Most Wonderful Time of the Year,\" what 'scary' thing are people doing?", size: '14vh', answer: "Telling ghost stories"}, 
          {points: 300, question: "What horned, Alpine \"Anti-Santa\" carries a sack to kidnap misbehaving kids", size: '14vh', answer: 'Krampus'}, 
          {points: 400, question: "In 1908, which industry began officially designating candle-lit Christmas trees as an 'unacceptable risk'?", size: '16vh', answer: 'Fire insurance industry'}, 
          {points: 500, question: "The predatory Jólakötturinn is a holiday monster from which Atlantic island nation?", size: '16vh', answer: 'Iceland'}, 
        ]
      },
      {
        name: 'Misleading Melodies',
        rows: [
          {points: 100, question: "\"I Saw Three Ships\" states a trio of vessels sailed into which landlocked Holy Land city?", size: '14vh', answer: 'Bethlehem'}, 
          {points: 200, question: "Which winter-winter-winter anthem was composed in the middle of a July 1945 heatwave?", size: '14vh', answer: "Let it Snow! Let it Snow! Let it Snow!"}, 
          {points: 300, question: "In 1780, there were four \"colly birds\" (not calling birds) which were what color", size: '14vh', answer: 'Black'}, 
          {points: 400, question: "\"How All the Welkin Rings\" was the original 1739 line of what Christmas hymn?", size: '16vh', answer: 'Hark! The Herald Angels Sing'}, 
          {points: 500, question: "Which Christmas melody originated as the 1901 Ukrainian New Year’s folk chant \"Shchedryk\"?", size: '16vh', answer: 'Carol of the Bells'}, 
        ]
      },
      {
        name: 'Christmas Crime',
        rows: [
          {points: 100, question: "In the movie Home Alone, the \"Wet Bandits\" earn their nickname by doing what to every house they burgle?", size: '16vh', answer: 'Leaving the water running'}, 
          {points: 200, question: "A man dressed in a Santa suit robbed a San Francisco bank in Dec 2014, using what annual event to blend in and escape?", size: '14vh', answer: "SantaCon"}, 
          {points: 300, question: "Until 1991, it was technically illegal to celebrate Christmas in which Caribbean island nation?", size: '16vh', answer: 'Cuba'}, 
          {points: 400, question: "In 1826, 21 cadets at which military academy were punished for smuggling alcoholic eggnog into a barracks?", size: '14vh', answer: 'West Point'}, 
          {points: 500, question: "In 1659, which North American colony passed a law making Christmas a criminal offense, punishable by a fine of five shillings?", size: '14vh', answer: 'Massachusetts'}, 
        ]
      },
      {
        name: 'Holiday Hodgepodge',
        rows: [
          {points: 100, question: "Famous animator Chuck Jones recolored which holiday villain to green for the 1966 TV special?", size: '14vh', answer: 'The Grinch (from b&w)'}, 
          {points: 200, question: "Legend says a German choirmaster created what treat in 1670 to keep children quiet during long church services?", size: '14vh', answer: 'Candy Cane'}, 
          {points: 300, question: "To deliver presents to every household on Earth in one night, physicists estimate Santa would have to travel at roughly 0.5% of what measure?", size: '14vh', answer: 'Speed of light'}, 
          {points: 400, question: "According to the Guinness World Records, the tallest Christmas tree ever displayed was a 221 ft. Douglas Fir erected in 1950 in what rainy city?", size: '14vh', answer: 'Seattle'}, 
          {points: 500, question: "What is the highest-grossing Christmas movie of all time (when adjusted for inflation), at a cool $1.2 billion?", size: '14vh', answer: 'Home Alone'}
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
              <th>
                {state.categories[4].name}
              </th>
            </tr>
            <tr>
              {
                [0, 1, 2, 3, 4].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 0)}>{state.categories[cat].rows[0].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3, 4].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 1)}>{state.categories[cat].rows[1].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3, 4].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 2)}>{state.categories[cat].rows[2].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3, 4].map((cat) => {
                  return <td onClick={zoomQuestion(cat, 3)}>{state.categories[cat].rows[3].points}</td>
                })
              }
            </tr>
            <tr>
              {
                [0, 1, 2, 3, 4].map((cat) => {
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