import React from "react";
import styled from "styled-components";

const Applicant = () => {
  return (
    <Container>
      <SideBars>
        <section>
          <div className="container">
            <div className="title-wrapper">
              <h4>신청자 명단</h4>
            </div>
            <ul>
              <div className="content">
                <div id="profile">
                  <li>신청자1</li>
                </div>
              </div>
            </ul>
          </div>
        </section>
      </SideBars>
    </Container>
  );
};

export default Applicant;

const SideBars = styled.div`
  #profile {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #777;
    display: inline-block;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: "Noto Sans KR", sans-serif;
  }
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  height: max-content;
  overflow: scroll;

  ::-webkit-scrollbar {
    margin: 0 auto;
    display: none;
  }
  @media screen and (max-width: 575px) {
  }
  // 가로모드 모바일 디바이스 (가로 해상도가 768px 보다 작은 화면에 적용)
  @media screen and (max-width: 768px) {
    width: 768px;
  }
  // 태블릿 디바이스 (가로 해상도가 992px 보다 작은 화면에 적용)
  @media screen and (max-width: 991px) {
  }
`;
const Container = styled.div`
  // 기본 CSS를 작성합니다.
  // 기본으로 작성되는 CSS는 1199px보다 큰 화면에서 작동 됩니다.
  // 세로모드 모바일 디바이스 (가로 해상도가 576px 보다 작은 화면에 적용)

  div .content {
    display: inline-block;
    background-color: #e5dae8;
    width: 250px;
    height: fit-content;
    margin: 5px;
  }
  section {
    display: flex;
    flex-wrap: wrap;
  }
  flex-direction: column;
  body {
    max-width: 1200px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .container {
    display: flex;
    flex: 1;
  }
`;
