import React, { useEffect, useState} from 'react'
import './Questions.css'
import axios from 'axios'

const API_URL = "http://localhost:3002/questions";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [trueAnswer, setTrueAnswer] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [situation, setSituation] = useState(false);
  const [situation2, setSituation2] = useState(false);
  const [situation3, setSituation3] = useState(false);
  const [timer, setTimer] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [counter, setCounter] = useState(0);
  const [timerId, setTimerId] = useState(0);

  useEffect(() => {
    if (timer === 0 && index < questions.length) {
      resetTimer();
    } else if (index === questions.length) {
      clearInterval(intervalId);
      clearInterval(timerId);
    }
  }, [timer]);

  useEffect(() => {
    getQuestions();
  }, []);

  const getTimer = () => {
    setTimerId(setInterval(startCounter, 1000));
  };

  const startCounter = () => {
    setCounter((counter) => counter + 1);
  };

  const getQuestions = async () => {
    const results1 = await axios.get(API_URL).then((res) => res.data);
    setQuestions(results1);
    setTimer(Number(results1[index].timeout));
  };

  const resetTimer = () => {
    setIndex(index + 1);
    clearInterval(intervalId);
    setTimer(questions[index].timeout);
    updateTimer();
  };
  
  let day = new Date().getDay();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let sum = day + "." + month + "." + year;

  const updateTimer = () => {
    setIntervalId(
      setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000)
    );
  };

  const start = () => {
    updateTimer();
  };

  const nextQuestion = () => {
    if (index < questions.length - 1) {
      // setIndex(index +1)

      resetTimer();
    } else if (index === questions.length - 1) {
      clearInterval(intervalId);
      clearInterval(timerId);
      setSituation3(true);
      setSituation(false);
      setSituation2(false);
    }
  };

  const changeSituation = () => {
    setSituation(true);
    setSituation2(false);
    setSituation3(false);
  };

  const startGame = () => {
    if (window.confirm("Yeni oyuna baslamaq isteyirsiniz?")) {
      setSituation(false);
      setSituation2(true);
      setSituation3(false);
      setIndex(0);
      setTrueAnswer(0);
      setWrong(0);
      setScore(0);
      start();
      getTimer();
    }
  };

  const changeSituation3 = () => {
    setSituation(false);
    setSituation2(false);
    clearInterval(intervalId);
    clearInterval(timerId);
    setSituation3(true);
  };

  const handleAnswer = (answer) => {
    if (
      answer === questions[index].correct_answer &&
      index < questions.length
    ) {
      resetTimer();
      setTrueAnswer(trueAnswer + 1);
      setScore(score + Number(questions[index].score));
    } else if (
      answer !== questions[index].correct_answer &&
      index < questions.length
    ) {
      resetTimer();
      setWrong(wrong + 1);
    }

    if (index === questions.length - 1) {
      clearInterval(intervalId);
      setSituation3(true);
      clearInterval(timerId);
    }
  };

  return (
    <div>
      <div className="container18">
        <div className="header">
          <div className="buttonContainer">
            <button className="button" onClick={changeSituation}>
              Yaris
            </button>
            <button className="button" onClick={changeSituation3}>
              Neticelerim
            </button>
            <button className="button">Hesab Lovhesi</button>
          </div>
        </div>

        <div
          className="welcome"
          style={{ display: situation ? "block" : "none" }}
        >
          <div className="welcomeContainer">
            <span className="welcomeSpan">Yarışa Xoş Gəlmisiniz!</span>
          </div>
          <div className="quideContainer">
            <span className="quide">
              İstifadəçilər yarışda iştirak edərək bilik qiymətləndirmələri üçün
              əlavə ballar qazana bilərlər. Yarış qaydalarına əsasən hər yarış
              25 sualdan hər sual üçün 5 saniyə vaxt ayrılmaqla 2 dəqiqə 25
              saniyə müddətində davam edir. İştirakçı sualı 5 saniyə ərzində
              cavablandırmadığı halda növbəti suala keçid olunur.
            </span>
          </div>
          <div className="start">
            <button className="startButton" onClick={startGame}>
              Yarışa başla
            </button>
          </div>
        </div>

        {questions.length > 0 && index < questions.length && (
          <div
            className="box"
            style={{ display: situation2 ? "block" : "none" }}
          >
            <div className="questions">{questions[index].question}</div>
            <div className="answerBox">
              {questions[index].options.map((ans) => (
                <button className="answer1" onClick={() => handleAnswer(ans)}>
                  {ans}
                </button>
              ))}
            </div>
            <div className="nextButtonContainer">
              <button className="nextButton" onClick={nextQuestion}>
                Novbeti
              </button>
            </div>
            <div className="latestContainer">
              <div className="forScore">{`Sual ucun teyin olunmus bal: ${questions[index].score}`}</div>
              <div className="forTime">{`Sual ucun teyin olunmus vaxt: ${timer}`}</div>
            </div>
          </div>
        )}

        {questions.length < 1 && (
          <h1 style={{ marginLeft: "auto", marginRight: "auto" }}>
            Loading...
          </h1>
        )}
        <div
          className="results"
          style={{ display: situation3 ? "block" : "none" }}
        >
          <div className="top10">
            <span className="top10Span">Son 10 Neticem</span>
          </div>
          <div className="table">
            <div className="tableHeader">
              <div className="siraNom">
                <span>№</span>
              </div>
              <div className="numOfQuestions">
                <span>Suallarin sayi</span>
              </div>
              <div className="trueAnswer">
                <span>Dogru Cavablarin sayi</span>
              </div>
              <div className="wrongAnswer">
                <span>Yalnis Cavablarin sayi</span>
              </div>
              <div className="unanswered">
                <span>Cavablanmamis Suallarin sayi</span>
              </div>
              <div className="totalPoint">
                <span>Toplam Baliniz</span>
              </div>
              <div className="time">
                <span>Muddet</span>
              </div>
              <div className="date">
                <span>Yaradilma Tarixi</span>
              </div>
            </div>
            <div className="resultsTable">
              <div className="siraNom">
                <span>1</span>
              </div>
              <div className="numOfQuestions">
                <span>{questions.length}</span>
              </div>
              <div className="trueAnswer">
                <span>{trueAnswer}</span>
              </div>
              <div className="wrongAnswer">
                <span>{wrong}</span>
              </div>
              <div className="unanswered">
                <span>{questions.length - (trueAnswer + wrong)}</span>
              </div>
              <div className="totalPoint">
                <span>{score}</span>
              </div>
              <div className="time">
                <span>{counter}</span>
              </div>
              <div className="date">
                <span>{sum}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
