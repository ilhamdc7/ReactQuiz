import React, { useEffect, useState } from "react";
import "./Main.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://localhost:3002/questions";

const Main = () => {
  const [questions, setQuestions] = useState([]);
  const [model, setModel] = useState(getEmptyModel());
  const [editSituation, setEditSituation] = useState(false);
  const [inputOptionText, setInputoptionText] = useState("");


  const addInput = () => {
    let optionList = model.options;

    if (inputOptionText) {
      optionList.push(inputOptionText);
    }
    setModel({...model, options: optionList})
    // setInputoptions(optionList);

    setInputoptionText("");
  };

  const removeChoice = (index) => {
    let test = [...model.options];
    test.splice(index, 1);
    setModel({...model, options: test})
    // setInputoptions(test);
    // console.log(inputOptionText);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data, status } = await axios.get(API_URL);
      if (data && status == 200) {
        setQuestions(data);
      }
    } catch (error) {
      console.log(error);
    }
    // const results = await axios.get(API_URL)
    // .then(res => res.data)
    // setQuestions(results)
  };

  const deleteData = async (id) => {
    if (window.confirm("Silmek istediyinizden eminsiniz?")) {
      const { data, status } = await axios.delete(
        `http://localhost:3002/questions/${id}`
      );
      if (data && status == 200) {
        getData();
      }
      // const newData = await axios.delete(`http://localhost:3002/questions/${id}`)
      // .then(res => res.data)
      // setQuestions(newData)
    }
  };

  const save = async () => {
    const { id, question, correct_answer, options, score, timeout } = model;
    if (
        question &&
        correct_answer
    ) {
      try {
        if (id) {
            const { data, status } = await axios.put(
                `http://localhost:3002/questions/${id}`,
                model
              );
              console.log(data, status);
        if (data) {
          setEditSituation(false);
          getData();
        }
        } else {
            const { data, status } = await axios.post(
                `http://localhost:3002/questions`,
                model
              );
              console.log(data, status);
        if (data) {
            setEditSituation(false);
          getData();
        }
        }

        
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Butun xanalari doldurun");
    }
  };



const forOpenModal = async(id) => {
    

    const results15 = await axios
      .get(`http://localhost:3002/questions/${id}`)
      .then((res) => res.data);

      console.log('results15', results15);
      setModel(results15)
      // setEditData(results15);
      
    setEditSituation(true)
}


  function handleChange (name, e){
    setModel({ ...model, [name]:  e.target.value })
  }




  const clear = () => {
    setModel(getEmptyModel())
  };

  const test1 = () => {
     setModel(getEmptyModel())
     setEditSituation(true);
  };

  function getEmptyModel() {
      return {
        question: '',
        correct_answer: '',
        options: [],
        score: 0,
        timeout: 0,
      }
  }

  const { question, correct_answer, options, score, timeout } = model;

  return (
    <div>
      <Modal className="modal19" isOpen={editSituation}>
        <div className="modalHeader">
          <div className="modalTitle">
            <span className="modalTitleSpan">Test Əlavə Etmək</span>
          </div>
          <div className="modalClose">
            <button
              className="modalCloseButton"
              onClick={() => setEditSituation(false)}
            >
              Bağla
            </button>
          </div>
        </div>
        <div className="questionTitle1">
          <div className="question2">
            <span className="question2Span">Sual</span>
          </div>
          <input
            className="questionInput"
            placeholder="Sualı daxil edin"
            value={question}
            onChange={(e) => handleChange('question', e)}
          ></input>
        </div>
        <div className="answerContainer1">
          <div className="options">
            <span className="optionsSpan">Seçimlər</span>
          </div>
          <div className="optionsContainer">
            <input
              className="optionsInput"
              placeholder="Seçimi daxil et"
              value={inputOptionText}
              onChange={(e) => setInputoptionText(e.target.value)}
            />
            <button onClick={addInput}>add</button>
            <div className="pushed"> 
              {options.map((a, index) => (
                <p>
                  {a}{" "}
                  <span
                    onClick={() => removeChoice(index)}
                    style={{ cursor: "pointer" }}
                  >
                    [x]{" "}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="options2">
          <div className="menu1">
            <div className="menu1Header">
              <span className="menu1Span">Doğru Cavab</span>
            </div>
            <div className="menu1InputContainer">
              <select
                className="menu1Input"
                value={correct_answer}
                onChange={(e) => handleChange('correct_answer', e)}
              >
                {options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="menu1">
            <div className="menu1Header">
              <span className="menu1Span">TimeOut</span>
            </div>
            <div className="menu1InputContainer">
              <input
                className="menu1Input"
                placeholder="Sual ucun vaxt"
                type="number"
                value={timeout}
                onChange={(e) => handleChange('timeout', e)}
              ></input>
            </div>
          </div>
          <div className="menu1">
            <div className="menu1Header">
              <span className="menu1Span">Score</span>
            </div>
            <div className="menu1InputContainer">
              <input
                className="menu1Input"
                placeholder="Sual ucun xal"
                type="number"
                value={score}
                onChange={(e) => handleChange('score', e)}
              ></input>
            </div>
          </div>
          <div className="buttonContainer1">
            <button className="clear1" onClick={clear}>
              Temizle
            </button>
            <button className="save1" 
            onClick={save}>
              Yadda Saxla
            </button>
          </div>
        </div>
      </Modal>

      <div className="container1">
        <div className="newQuestion">
          <button className="addNewQuestion" onClick={test1}>
            Yeni Sual Elave Et
          </button>
          <Link to="/competition">
            <button className="goCompetition">Yarisa Kec</button>
          </Link>
        </div>

        <table
          className="table table-striped table-bordered mydatatable"
          style={{ backgroundColor: "white", marginTop: "5%" }}
        >
          <thead>
            <tr>
              {/* basliqlar */}
              <th>Suallar</th>
              <th>Düzgün Cavab</th>
              <th>Vaxt</th>
              <th>Xal</th>
              <th>Tarix</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {questions &&
              questions.length &&
              questions.map((question, i) => (
                <tr key={i}>
                  <td>{question.question}</td>
                  <td>{question.correct_answer}</td>
                  <td>{question.timeout}</td>
                  <td>{question.score}</td>
                  <td>Tarix</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      style={{ width: "40%" }}
                      onClick={() => forOpenModal(question.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ width: "40%", float: "right" }}
                      onClick={() => {
                        deleteData(question.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;
