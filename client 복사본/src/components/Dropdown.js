import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const Dropdown = () => {
  const navigate = useNavigate();

  const mypageHandler = () => {
    navigate("/mypage");
  };
  const mybookmarkHandler = () => {
    navigate("/mybookmark");
  };
  const mypostkHandler = () => {
    navigate("/mypost");
  };
  const mymatchinfokHandler = () => {
    navigate("/mymatchinfo");
  };
  const messagesHandler = () => {
    navigate("/messages");
  };
  return (
    <SideBars>
      <nav>
        <ul>
          <button className="container" onClick={mypageHandler}>
            <li id="home">mypage</li>
          </button>
          <button onClick={mybookmarkHandler}>
            <li id="about">mybookmark</li>
          </button>
          <button onClick={mypostkHandler}>
            <li id="work">mypost</li>
          </button>
          <button onClick={mymatchinfokHandler}>
            <li id="mail">mymatchinfo</li>
          </button>
          <button onClick={messagesHandler}>
            <li id="newmail">messages</li>
          </button>
        </ul>
      </nav>
    </SideBars>
  );
};

export default Dropdown;

const SideBars = styled.div`
  nav {
    background-color: #fff;
    top: 0;
    left: 0;
    ul {
      display: flex;
      justify-content: space-around;
      place-content: center;
      margin: 0 auto;
      height: 50px;
      width: 80%;
    }

    .container {
      text-align: center;
      display: flex;
      flex: 1;
      justify-content: space-around;
    }
  }
`;
