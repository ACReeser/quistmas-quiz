import React from 'react';
import { useState } from 'react';
import './App.css';

function Question(props: {
    teams: string[],
    teamScores: number[],
    question: string,
    size: string,
    answer: string,
    imgSrc?: string,
    close: (teamIndexForPoints: number, otherTeamIndex?: number) => void,
    currentTeamTurn: number,
    nextTeamTurn: number,
    special?: 'NAUGHTY' | 'NICE',
    specialPoints?: number
}) {
    // Helper to get the scoop order, starting from a random team (not the current team)
    // ENSURES NO DUPLICATE SCOOPS: This creates a randomized array of all team indices
    // EXCEPT the current team. Each team appears exactly once in this array.
    function getRandomScoopOrder() {
        const n = props.teams.length;
        // Filter out the current team - they already had their chance
        const others = Array.from({length: n}, (_, i) => i).filter(i => i !== props.currentTeamTurn);
        // Shuffle using Fisher-Yates algorithm
        for (let i = others.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
        }
        return others;
    }

    const [showSpecialCard, setShowSpecialCard] = useState(props.special != null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [canShowAnswer, setCanShowAnswer] = useState(false);
    const [selectedOtherTeam, setSelectedOtherTeam] = useState<number|null>(null);
    // Initialize scoop order once at component mount - teams will be visited sequentially
    // from this randomized list, ensuring each team gets at most ONE scoop attempt per question
    const [initialScoopOrder] = useState<number[]>(getRandomScoopOrder());
    const [scoopState, setScoopState] = useState<{
        active: boolean,
        scoopTeam: number|null,
        alreadyTried: number[],
        scoopOrder: number[]
    }>({ active: false, scoopTeam: null, alreadyTried: [], scoopOrder: [] });
    const [scoopedBy, setScoopedBy] = useState<number|null>(null);

    const imageDetails = {
        background: props.imgSrc != null ? `url(${props.imgSrc})` : '',
        class: props.imgSrc != null ? 'is-image' : '',
    };
    const answerText = props.imgSrc != null ? props.answer : 'A: ' + props.answer;
    const teamLabelStyle = { color: 'white', fontWeight: 'bold' };

    // Determine which team is currently "active" for answering
    let activeTeamIndex = scoopState.active && scoopState.scoopTeam !== null ? scoopState.scoopTeam : props.currentTeamTurn;
    let activeTeam = props.teams[activeTeamIndex] || '';

    // Determine the next scoop team (for display)
    let nextScoopTeam = '';
    if (scoopState.active && scoopState.scoopOrder.length > 1) {
        nextScoopTeam = props.teams[scoopState.scoopOrder[1]] || '';
    } else if (!scoopState.active && initialScoopOrder.length > 0) {
        nextScoopTeam = props.teams[initialScoopOrder[0]] || '';
    }

    // Handler for "Correct" button
    function handleCorrect() {
        if (showAnswer) return;
        setCanShowAnswer(true);
        setShowAnswer(true);
        // If in scoop mode, record who scooped
        if (scoopState.active && scoopState.scoopTeam !== null) {
            setScoopedBy(scoopState.scoopTeam); // scoop team answered
        } else {
            setScoopedBy(props.currentTeamTurn); // original team answered
        }
        setScoopState({ active: false, scoopTeam: null, alreadyTried: [], scoopOrder: [] });
    }

    // Handler for "Incorrect" button
    function handleIncorrect() {
        if (showAnswer) return;
        // If not in scoop mode, start scoop mode
        if (!scoopState.active) {
            if (initialScoopOrder.length === 0) {
                // No one left to scoop, show the answer and allow Back to Board
                setCanShowAnswer(true);
                setShowAnswer(true);
                setScoopState({ active: false, scoopTeam: null, alreadyTried: [], scoopOrder: [] });
                return;
            }
            setScoopState({
                active: true,
                scoopTeam: initialScoopOrder[0],
                alreadyTried: [props.currentTeamTurn],
                scoopOrder: initialScoopOrder
            });
        } else {
            // In scoop mode, move to next scoop team
            // NO DUPLICATE SCOOPS: We slice off the first team from scoopOrder each time,
            // moving sequentially through the pre-randomized list without repetition
            const { scoopOrder, alreadyTried } = scoopState;
            const newAlreadyTried = [...alreadyTried, scoopOrder[0]];
            const newOrder = scoopOrder.slice(1); // Remove current team, move to next
            if (newOrder.length === 0) {
                // No more teams left to scoop, show the answer and allow Back to Board
                setCanShowAnswer(true);
                setShowAnswer(true);
                setScoopState({ active: false, scoopTeam: null, alreadyTried: [], scoopOrder: [] });
            } else {
                setScoopState({
                    active: true,
                    scoopTeam: newOrder[0],
                    alreadyTried: newAlreadyTried,
                    scoopOrder: newOrder
                });
            }
        }
    }

    // Handler for "Show Answer" button
    function handleShowAnswer() {
        setShowAnswer(true);
                    // Team label for display
                    let teamLabel = '';
                    if (!showAnswer) {
                        teamLabel = activeTeam;
                    } else {
                        // In show answer mode
                        if (scoopState.alreadyTried.length > 0 && scoopState.alreadyTried.length === props.teams.length - 1 && scoopState.scoopTeam !== null) {
                            // All other teams tried, last team scooped
                            teamLabel = `Scooped by: ${activeTeam}`;
                        } else if (scoopState.scoopTeam !== null) {
                            // If scoop mode was active and a team answered
                            teamLabel = `Scooped by: ${activeTeam}`;
                        } else {
                            // Regular answer
                            teamLabel = `Answered by: ${activeTeam}`;
                        }
                    }
    }

    // Handler for "Back to Board" button
    function handleBackToBoard() {
        // If answer was correct, pass the active team index; if not, pass -1 (all wrong)
        if (showAnswer && canShowAnswer && !scoopState.active) {
            // Award points to the team that got it correct
            if (typeof activeTeamIndex === 'number' && !isNaN(activeTeamIndex)) {
                props.close(activeTeamIndex, selectedOtherTeam ?? undefined);
            } else {
                props.close(-1);
            }
        } else {
            // If answer was not correct, or scoop mode ended, treat as all wrong
            props.close(-1);
        }
    }

    return (
        <div className="modal">
            {showSpecialCard ? (
                <div 
                    className={"special-card special-card-" + props.special?.toLowerCase()}
                    onClick={() => setShowSpecialCard(false)}
                >
                    <div className="special-card-text">{props.special}</div>
                </div>
            ) : (
                <>
                    <div className={"question " + imageDetails.class} style={{ fontSize: props.size, backgroundImage: imageDetails.background }}>
                        {showAnswer ? answerText : props.question}
                        {showAnswer && props.special && canShowAnswer && (
                            <div style={{ 
                                fontSize: '5vh', 
                                marginTop: '4vh',
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                gap: '2vh'
                            }}>
                                <span style={{ color: 'white', fontWeight: 'bold' }}>Pick other team:</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center' }}>
                                    {props.teams.map((team, i) => {
                                        if (i === scoopedBy) return null; // Can't pick the team that answered correctly
                                        const currentScore = props.teamScores[i] || 0;
                                        const newScore = currentScore + (props.specialPoints || 0);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedOtherTeam(i)}
                                                style={{
                                                    background: selectedOtherTeam === i ? 'gold' : '#444',
                                                    color: selectedOtherTeam === i ? 'black' : 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '3.5vh',
                                                    minWidth: '40vh',
                                                    padding: '1vh 2vh',
                                                    border: selectedOtherTeam === i ? '3px solid white' : 'none',
                                                    borderRadius: '1vh',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <div>{team}</div>
                                                <div style={{ fontSize: '2.5vh', marginTop: '0.5vh' }}>
                                                    {currentScore} → {newScore}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='App-flex-h' style={{alignItems: 'center', gap: '1em'}}>
                        {props.special && (
                            <span style={{ 
                                ...teamLabelStyle, 
                                fontSize: '1.2em', 
                                margin: '0 1em',
                                padding: '0.3em 0.8em',
                                borderRadius: '0.3em',
                                background: props.special === 'NAUGHTY' ? 'crimson' : 'green'
                            }}>
                                {props.special} ({props.specialPoints != null && props.specialPoints > 0 ? '+' : ''}{props.specialPoints})
                            </span>
                        )}
                        <span style={{ ...teamLabelStyle, fontSize: '1.2em', margin: '0 1em' }}>
                    {!showAnswer
                        ? 'Up: ' + activeTeam
                        : (canShowAnswer && scoopedBy === null)
                            ? 'No points'
                            : (scoopedBy === props.currentTeamTurn)
                                ? `Answered by: ${props.teams[props.currentTeamTurn]}`
                                : (scoopedBy !== null)
                                    ? `Scooped by: ${props.teams[scoopedBy]}`
                                    : 'No points'
                    }
                        </span>
                <button
                    style={{ background: 'green', color: 'white', fontWeight: 'bold', minWidth: 100, marginRight: 8, opacity: !showAnswer ? 1 : 0.5, cursor: !showAnswer ? 'pointer' : 'not-allowed' }}
                    onClick={handleCorrect}
                    disabled={showAnswer}
                >
                    Correct ✅
                </button>
                <button
                    style={{ background: 'crimson', color: 'white', fontWeight: 'bold', minWidth: 100, marginRight: 16, opacity: !showAnswer ? 1 : 0.5, cursor: !showAnswer ? 'pointer' : 'not-allowed' }}
                    onClick={handleIncorrect}
                    disabled={showAnswer}
                >
                    Incorrect ❌
                </button>
                {nextScoopTeam && !showAnswer && (
                    <span style={{ ...teamLabelStyle, fontSize: '1em', marginLeft: 8 }}>
                        Scoop: {nextScoopTeam}
                    </span>
                )}
                {!showAnswer && (<button
                    style={{ background: '#222', color: 'white', fontWeight: 'bold', minWidth: 120 }}
                    onClick={handleShowAnswer}
                >
                    Answer
                </button>
                )}
                {showAnswer && (
                    <button
                        style={{ background: '#222', color: 'white', fontWeight: 'bold', minWidth: 140, marginLeft: 16 }}
                        onClick={handleBackToBoard}
                    >
                        Back to Board
                    </button>
                )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Question;