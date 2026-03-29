import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './EnglishSpellingGame.css';

import correctSoundFile from '../../../assets/effects/pop.mp3';
import wrongSoundFile from '../../../assets/effects/pop.mp3';

import startImage from './start.png';
import questionTiger from './3.png';
import answerTiger from './4.png';
import questionSheep from './5.png';
import answerSheep from './6.png';
import questionRabbit from './7.png';
import answerRabbit from './8.png';
import musicBg from './music-bg.mp3';

type Round = {
  id: number;
  word: string;
  questionImage: string;
  answerImage: string;
};

type Stage = 'intro' | 'question' | 'answer' | 'result';

type PickedLetter = {
  letter: string;
  sourceIndex: number;
};

const shuffleArray = (input: string[]) => {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const EnglishSpellingGame = () => {
  const rounds = useMemo<Round[]>(
    () => [
      { id: 1, word: 'TIGER', questionImage: questionTiger, answerImage: answerTiger },
      { id: 2, word: 'SHEEP', questionImage: questionSheep, answerImage: answerSheep },
      { id: 3, word: 'RABBIT', questionImage: questionRabbit, answerImage: answerRabbit },
    ],
    [],
  );

  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [lettersPicked, setLettersPicked] = useState<PickedLetter[]>([]);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const correctAudio = useRef(new Audio(correctSoundFile));
  const wrongAudio = useRef(new Audio(wrongSoundFile));
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  const currentRound = rounds[index];

  const shuffledLetters = useMemo(() => {
    if (!currentRound) {
      return [];
    }
    return shuffleArray(currentRound.word.split(''));
  }, [currentRound]);

  useEffect(() => {
    if (!bgMusic.current) {
      bgMusic.current = new Audio(musicBg);
      bgMusic.current.loop = true;
      bgMusic.current.volume = 0.3;
    }

    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!bgMusic.current) {
      return;
    }

    if (!musicEnabled || stage === 'intro') {
      bgMusic.current.pause();
      return;
    }

    bgMusic.current.play().catch(() => undefined);
  }, [musicEnabled, stage]);

  const startGame = () => {
    setStage('question');
    setIndex(0);
    setScore(0);
    setLettersPicked([]);
    setIsCorrect(false);
  };

  const pickLetter = (letter: string, i: number) => {
    if (stage !== 'question') {
      return;
    }

    const targetLength = currentRound.word.length;
    if (lettersPicked.length >= targetLength) {
      return;
    }

    if (lettersPicked.some((item) => item.sourceIndex === i)) {
      return;
    }

    setLettersPicked((prev) => [...prev, { letter, sourceIndex: i }]);
  };

  const removeLast = () => {
    setLettersPicked((prev) => prev.slice(0, -1));
  };

  const slots = lettersPicked.map((entry) => entry.letter);

  const submitAnswer = () => {
    if (stage !== 'question') {
      return;
    }

    const userWord = slots.join('');
    const correct = userWord === currentRound.word;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (soundEnabled) {
      const player = correct ? correctAudio.current : wrongAudio.current;
      player.currentTime = 0;
      player.play().catch(() => undefined);
    }

    setStage('answer');
  };

  const goNext = () => {
    if (index < rounds.length - 1) {
      setIndex((prev) => prev + 1);
      setLettersPicked([]);
      setStage('question');
      return;
    }

    setStage('result');
  };

  const replay = () => {
    setStage('intro');
    setIndex(0);
    setLettersPicked([]);
    setScore(0);
    setIsCorrect(false);
    if (bgMusic.current) {
      bgMusic.current.pause();
      bgMusic.current.currentTime = 0;
    }
  };

  const isLetterUsed = (buttonIndex: number) =>
    lettersPicked.some((entry) => entry.sourceIndex === buttonIndex);

  return (
    <div className="spelling-page">
      <Link to="/dashboard" className="spelling-back-btn">
        ← Dashboard
      </Link>

      <div className="spelling-controls">
        <button onClick={() => setSoundEnabled((prev) => !prev)}>
          {soundEnabled ? '🔊 SFX On' : '🔇 SFX Off'}
        </button>
        <button onClick={() => setMusicEnabled((prev) => !prev)}>
          {musicEnabled ? '🎵 Music On' : '🎵 Music Off'}
        </button>
      </div>

      {stage === 'intro' && (
        <div className="spelling-screen" style={{ backgroundImage: `url(${startImage})` }}>
          <div className="title-box">
            <p>ENGLISH SPELLING</p>
            <h1>WORD GAME</h1>
            <button className="spelling-main-btn" onClick={startGame}>
              Start
            </button>
          </div>
        </div>
      )}

      {stage === 'question' && (
        <div className="spelling-screen" style={{ backgroundImage: `url(${currentRound.questionImage})` }}>
          <div className="question-card">
            <h2>USE THE LETTERS TO SPELL THE WORD.</h2>

            <div className="letter-bank">
              {shuffledLetters.map((letter, i) => (
                <button
                  key={`${letter}-${i}`}
                  className="letter-btn"
                  onClick={() => pickLetter(letter, i)}
                  disabled={isLetterUsed(i)}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="slots-row">
              {Array.from({ length: currentRound.word.length }).map((_, i) => (
                <div key={i} className="slot-box">
                  {slots[i] ?? ''}
                </div>
              ))}
            </div>

            <div className="question-actions">
              <button className="spelling-sub-btn" onClick={removeLast} disabled={slots.length === 0}>
                Remove
              </button>
              <button
                className="spelling-main-btn"
                onClick={submitAnswer}
                disabled={slots.length !== currentRound.word.length}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'answer' && (
        <div className="spelling-screen" style={{ backgroundImage: `url(${currentRound.answerImage})` }}>
          <div className="answer-card">
            <h2>THE ANSWER IS...</h2>
            <div className="answer-word">
              {currentRound.word.split('').map((letter, i) => (
                <span key={`${letter}-${i}`}>{letter}</span>
              ))}
            </div>
            <p className={isCorrect ? 'correct' : 'wrong'}>
              {isCorrect ? 'Great job, little star!' : 'Nice try! Let us learn this word.'}
            </p>
            <button className="spelling-main-btn" onClick={goNext}>
              {index === rounds.length - 1 ? 'See Result' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {stage === 'result' && (
        <div className="spelling-result">
          <h2>You Did It!</h2>
          <p>
            Score: {score}/{rounds.length}
          </p>
          <button className="spelling-main-btn" onClick={replay}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default EnglishSpellingGame;
