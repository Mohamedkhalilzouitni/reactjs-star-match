import React, { useEffect, useState } from 'react';
import './App.css';

const Game =  (props) => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  
  useEffect(() => {
    if(secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active';
  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  }

  const onNumberClick = (number, currentStatus) => {
    if(gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }
    const newCandidateNums = (currentStatus === 'available' ? 
      candidateNums.concat(number) : candidateNums.filter(cn => cn !== number));
    if(utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(n => !newCandidateNums.includes(n));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
      setStars(utils.randomSumIn(newAvailableNums, Math.max(...newAvailableNums)));
    } 
    console.log(number, currentStatus);
  };

  // manually reset the game
  // const resetGame = () => {
  //   setAvailableNums(utils.range(1, 9));
  //   setCandidateNums([]);
  //   setStars(utils.random(1, 9));
  //   setSecondsLeft(10);
  // }

  return (
    <div className='game'>
      <div className='help'>
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className='body'>
        <div className='stars'>
          {gameStatus !== 'active' ?  <PlayAgain playAgain={props.startNewGame} gameStatus={gameStatus}/> : <StarsDisplay count={stars}/>}
        </div>
        <div className='numbers'>
        {utils.range(1, 9).map(number => 
          <NumberButton key={number} 
                        id={number}
                        status={numberStatus(number)}
                        onnClick={onNumberClick} />
                        )}
        </div>
      </div>
      <div className="timer">{`Time Remaining:  ${secondsLeft}`}</div>
    </div>
  );
};

const StarsDisplay = (props) => {
  return (
    <>
    {utils.range(1, props.count).map(starId => <div className='star' key={starId}/>)}
    </>
    
  );
}

const PlayAgain = (props) => {
  return (
    <div className='game-done' style={{color : props.gameStatus === 'won' ? 'green' : 'red'}}>
      {props.gameStatus === 'won' ? <p className='message'>Alhamdolilah You won :)</p> 
        : <p className='message'>Never surrender !!</p>}
      <button onClick={props.playAgain}>Play Again ?</button>
    </div>
  );
}

const NumberButton = (props) => {
  return (
    <button className='number' 
            style={{backgroundColor: colors[props.status]}} 
            onClick={() => props.onnClick(props.id, props.status)}>
      {props.id}
    </button>
  );
}

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return (
  <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />
  );
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min=0, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;