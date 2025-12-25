import React, { useState } from 'react';
import './App.css';
import Question from './Question';

// Randomly assigns NAUGHTY and NICE squares (2 of each) to eligible questions
// Eligible = 200, 300, or 400 point questions (not 100 or 500)
// Evenly distributed across categories and point values
function assignSpecialSquares(categories: IGameState['categories']) {
  // Build list of eligible squares (row indices 1, 2, 3 = 200, 300, 400 points)
  const eligible: {catI: number, rowI: number}[] = [];
  for (let catI = 0; catI < categories.length; catI++) {
    for (let rowI = 1; rowI <= 3; rowI++) { // Skip row 0 (100) and row 4 (500)
      eligible.push({catI, rowI});
    }
  }
  
  // Shuffle the eligible squares using Fisher-Yates algorithm
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }
  
  // Try to pick 4 squares with good distribution
  // Strategy: Pick from shuffled list but try to avoid same category/row when possible
  const picked: {catI: number, rowI: number}[] = [];
  const usedCats = new Set<number>();
  const usedRows = new Set<number>();
  
  // First pass: try to pick with maximum diversity
  for (const square of eligible) {
    if (picked.length >= 4) break;
    if (!usedCats.has(square.catI) && !usedRows.has(square.rowI)) {
      picked.push(square);
      usedCats.add(square.catI);
      usedRows.add(square.rowI);
    }
  }
  
  // Second pass: fill remaining slots with any available squares
  for (const square of eligible) {
    if (picked.length >= 4) break;
    if (!picked.some(p => p.catI === square.catI && p.rowI === square.rowI)) {
      picked.push(square);
    }
  }
  
  // Assign first 2 as NAUGHTY, last 2 as NICE
  // Also compute specialPoints: half of the question points, negative for NAUGHTY, positive for NICE
  for (let i = 0; i < picked.length; i++) {
    const {catI, rowI} = picked[i];
    const isNaughty = i < 2;
    categories[catI].rows[rowI].special = isNaughty ? 'NAUGHTY' : 'NICE';
    const points = categories[catI].rows[rowI].points;
    if (points) {
      categories[catI].rows[rowI].specialPoints = isNaughty ? -Math.floor(points / 2) : Math.floor(points / 2);
    }
  }
}

interface IGameState{
  categories: {
    name: string,
    rows: {
      points: number|null,
      imgSrc?: string,
      question: string,
      size: string,
      answer: string,
      special?: 'NAUGHTY' | 'NICE',
      specialPoints?: number
    }[]
  }[],
  pointSum: number[],
  currentQuestion?: {
    question: string, 
    categoryI: number, 
    rowI: number, 
    size: string, 
    answer: string,
    imgSrc?: string,
    special?: 'NAUGHTY' | 'NICE',
    specialPoints?: number
  },
  currentTeamTurn: number,
  nextTeamTurn: number
}

function beginGameState(teams: string[], initialCurrentTeam: number = 0, initialNextTeam: number = 1): IGameState{
  const gameState: IGameState = {
    categories: [
      {
        name: 'Tradit-omoji',
        rows: [
          {points: 100, question: '\n🤢👕🏆', size: '22vh', answer: 'Ugly Sweater Contest'}, 
          {points: 200, question: '\n🧝‍♂️⤵️🐚f', size: '22vh', answer: 'Elf on the Shelf'},
          {points: 300, question: '\n🕵️🎅', size: '22vh', answer: 'Secret Santa'},
          {points: 400, question: '\n🥊🌅', size: '21vh', answer: 'Boxing Day'}, 
          {points: 500, question: '\n♟️🥜🔥', size: '21vh', answer:'Chestnut Roasting'},
        ]
      },
      {
        name: 'Holiday Horror',
        rows: [
          {points: 100, question: "aaa?", size: '14vh', answer: 'Coal'}, 
          {points: 200, question: "aaa?", size: '14vh', answer: "aa ghost stories"}, 
          {points: 300, question: "aaa?", size: '14vh', answer: 'aa'}, 
          {points: 400, question: "aaa?", size: '16vh', answer: 'Fiaare insurance industry'}, 
          {points: 500, question: "aa?", size: '16vh', answer: 'aa'}, 
        ]
      },
      {
        name: 'Misleading Melodies',
        rows: [
          {points: 200, question: "aaa?", size: '14vh', answer: "aaa"}, 
          {points: 300, question: "Which incredibly popular Christmas song was originally written for Thanksgiving in 1857?", size: '15vh', answer: 'Jingle Bells'}, 
          {points: 400, question: "This 1719 hymn was not about Christmas, but about Jesus' return, thus: \"the Lord is come\".", size: '16vh', answer: 'Joy to the World'}, 
          {points: 400, question: "\"Tinkle Bells\" was the original title of which Christmas classic?", size: '14vh', answer: 'Silver Bells'}, 
          {points: 500, question: "aaa?", size: '16vh', answer: 'aaa'}, 
        ]
      },
      {
        name: 'Christmas Crime',
        rows: [
          {points: 100, question: "aaa?", size: '16vh', answer: 'aaa'}, 
          {points: 200, question: "aaa?", size: '14vh', answer: "aaa"}, 
          {points: 300, question: "On Christmas Eve in 1985, two men robbed Mayan and Aztec artifacts from a museum in which North American capital?", size: '16vh', answer: 'Mexico City'}, 
          {points: 400, question: "In the 1920s, a man named John Gluck Jr. ran the \"Santa Claus Association\" that pretended to buy gifts in which major US city?", size: '14vh', answer: 'New York City'}, 
          {points: 500, question: "In 1644, the English Parliament under which head of state officially banned the eating of Christmas plum pudding for being too Catholic?", size: '13vh', answer: 'Oliver Cromwell'}, 
        ]
      },
      {
        name: 'Holiday Hodgepodge',
        rows: [
          {points: 100, question: "According to a 2020 poll by YouGov, 59% of millennials consider which film to be a \"Christmas Movie\"?", size: '14vh', answer: 'Die Hard'}, 
          {points: 200, question: "Sent on December 3, 1992, what two-word holiday greeting was the content of the world’s first-ever SMS text message?", size: '14vh', answer: 'Merry Christmas'}, 
          {points: 300, question: "During WWI, what was the name given to the unofficial series of widespread ceasefires along the Western Front around December 1914?", size: '13vh', answer: 'Christmas Truce'}, 
          {points: 400, question: "?", size: '14vh', answer: 'aaa'}, 
          {points: 500, question: "aaa?", size: '14vh', answer: 'aaa'}
        ]
      }
    ],
    pointSum: teams.map(x => 0),
    currentTeamTurn: initialCurrentTeam,
    nextTeamTurn: initialNextTeam
  };
  
  // Assign NAUGHTY and NICE squares
  assignSpecialSquares(gameState.categories);
  
  return gameState;
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
  backToMenu: () => void,
  initialCurrentTeam?: number,
  initialNextTeam?: number
}) {
  const [state, setState] = useState<IGameState>(() => {
    const template = beginGameState(
      props.teams,
      props.initialCurrentTeam ?? 0,
      props.initialNextTeam ?? ((props.teams.length > 1) ? 1 : 0)
    );
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
              imgSrc: row.imgSrc,
              special: row.special,
              specialPoints: row.specialPoints
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
            return <div className='App-flex-grow team-display App-flex-v-small h-14vh' key={i}>
              <div className="team-display-name">{team}{state.currentTeamTurn === i ? ' 🏁' : ''}</div>
              <div className="team-display-points">{state.pointSum[i]} points</div>
            </div>
          })
        }
      </div>
      {
        state.currentQuestion != null ? 
        <Question 
          teams={props.teams} 
          teamScores={state.pointSum}
          question={state.currentQuestion.question} 
          size={state.currentQuestion.size} 
          answer={state.currentQuestion.answer} 
          imgSrc={state.currentQuestion.imgSrc}
          currentTeamTurn={state.currentTeamTurn}
          nextTeamTurn={state.nextTeamTurn}
          special={state.currentQuestion.special}
          specialPoints={state.currentQuestion.specialPoints}
          close={(teamIndexForPoints: number, naughtyNiceTeamIndex?: number) => {
            const categories = {...state.categories};
            const newPoints = [...state.pointSum];
            let newCurrent = state.currentTeamTurn;
            let newNext = state.nextTeamTurn;
            if (state.currentQuestion){
              if (teamIndexForPoints > -1){
                const questionPoints = categories[state.currentQuestion.categoryI].rows[state.currentQuestion.rowI].points;
                if (questionPoints && newPoints[teamIndexForPoints] != null){
                  newPoints[teamIndexForPoints] += questionPoints;
                }
                // Apply special points to other team if this is a special question
                if (naughtyNiceTeamIndex != null && naughtyNiceTeamIndex >= 0 && state.currentQuestion.specialPoints != null) {
                  if (newPoints[naughtyNiceTeamIndex] != null) {
                    newPoints[naughtyNiceTeamIndex] = Math.max(0, newPoints[naughtyNiceTeamIndex] + state.currentQuestion.specialPoints);
                  }
                }
                localStorage.setItem('points', JSON.stringify(newPoints));
              }
              categories[state.currentQuestion.categoryI].rows[state.currentQuestion.rowI].points = null;
              localStorage.setItem('done', JSON.stringify(loadZeroedQuestions().concat([{cat: state.currentQuestion.categoryI, i: state.currentQuestion.rowI}])));
              // Advance turn if a team was selected
              if (teamIndexForPoints > -1) {
                newCurrent = state.nextTeamTurn;
                newNext = (state.nextTeamTurn + 1) % props.teams.length;
              }
            }
            setState({
              ...state,
              currentQuestion: undefined,
              categories: categories,
              pointSum: newPoints,
              currentTeamTurn: newCurrent,
              nextTeamTurn: newNext
            })
          }}
        ></Question> : null
      }
    </div>
  );
}

export default Game;