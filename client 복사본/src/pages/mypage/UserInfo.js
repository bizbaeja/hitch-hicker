import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import CheckDisplayName from "../account/CheckDisplayName";
import H1 from "../../components/ui/H1";

const Userinfo = () => {
  const [isDisabledInfo, setIsDisabledInfo] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const displaynameInputRef = useRef();
  const passwordInputRef = useRef();
  const phoneInputRef = useRef();
  const contentInputRef = useRef();
  const profileuploadInputRef = useRef();

  // displaynameInputRef.current.value = accountInfo.displayName;
  //#region Show validate text
  const [validateDisplayNameText, setValidateDisplayNameText] = useState("");
  const [validatePasswordText, setValidatePasswordText] = useState("");
  const [validatePhoneNumberText, setValidatePhoneNumberText] = useState("");
  //#endregion

  //#region Change validate className
  const [
    validateDisplayNameNoticeClassname,
    setValidateDisplayNameNoticeClassname,
  ] = useState("validate");
  const [validatePasswordNoticeClassname, setValidatePasswordNoticeClassname] =
    useState("validate");
  const [
    validatePhoneNumberNoticeClassname,
    setValidatePhoneNumberNoticeClassname,
  ] = useState("validate");
  //#endregion

  //#region Check validate&Duplicate functions
  const validatePhoneNumber = (phoneNumber) => {
    return String(phoneNumber).match(/^\d{3}-\d{3,4}-\d{4}$/);
  };

  const validatePassword = (password) => {
    return String(password).match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);
  };

  const onClickDuplicateDisplayName = async () => {
    const enteredDisplayName = displaynameInputRef.current.value;
    if (enteredDisplayName.length > 1) {
      const isDuplicateDisplayName = await CheckDisplayName(
        displaynameInputRef.current.value
      );

      setIsDisabledInfo(isDuplicateDisplayName);

      if (isDuplicateDisplayName) {
      }
    } else {
      setValidateDisplayNameText("??? ???????????? 2?????? ?????? ????????? ????????? ");
      setValidateDisplayNameNoticeClassname("validate");
    }
  };
  //#endregion

  //#region OnChanged event for validate
  const onChangedDisplayName = (e) => {
    if (e.target.value.length < 2) {
      setValidateDisplayNameText("??? ???????????? 2?????? ?????? ????????? ????????? ");
      setValidateDisplayNameNoticeClassname("validate");
    } else {
      setValidateDisplayNameText("??? ????????? ????????? ???????????????.");
      setValidateDisplayNameNoticeClassname("HTH-green");
    }
  };

  const onChangedPassword = (e) => {
    const enteredPassword = e.target.value;
    if (validatePassword(enteredPassword) === null) {
      setValidatePasswordText(
        "??? ??????,????????? ????????? ???????????? 6?????? ?????? ??????????????????"
      );
      setValidatePasswordNoticeClassname("validate");
    } else {
      setValidatePasswordText("??? ????????? ???????????? ???????????????.");
      setValidatePasswordNoticeClassname("HTH-green");
    }
  };

  const onChangedPhoneNumber = (e) => {
    if (validatePhoneNumber(e.target.value) === null) {
      setValidatePhoneNumberText("??? 010-0000-0000 ???????????? ????????? ?????????");
      setValidatePhoneNumberNoticeClassname("validate");
    } else {
      setValidatePhoneNumberText("??? ????????? ?????? ???????????????.");
      setValidatePhoneNumberNoticeClassname("HTH-green");
    }
  };

  const onChangedContent = (e) => {
    // setContentText(e.target.value);
  };
  //#endregion

  // if (accountInfo.phone !== null) {
  //   // setPhoneNumberText(accountInfo.phone);
  // }
  // if (accountInfo.content !== null) {
  //   // setContentText(accountInfo.content);
  // }

  const postImg = (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    axios(`${process.env.REACT_APP_URL}/api/images/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        access_hh: sessionStorage.getItem("AccessToken"),
      },
      data: formData,
    })
      .then((res) => {
        // ???????????? ??????.....
        // let testid = res.data.imageId;
        // setImageId(testid);
        // mount.current = true;
        setImageURL(res.data.imageUrl);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.fieldErrors) {
            alert(err.response.data.fieldErrors[0].reason);
          } else if (
            err.response.data.fieldErrors === null &&
            err.response.data.violationErrors
          ) {
            alert(err.response.data.violationErrors[0].reason);
          } else {
            alert(
              "????????? ?????? ???????????? ???????????????... ?????????????????? ?????? ??????????????????.... ???????????????.....???"
            );
          }
        } else if (err.response.status === 0)
          alert(
            "?????? ????????? ?????? ????????? ??? ????????????. ?????? ?????? ?????? ??????????????????"
          );
        else {
          if (
            err.response.data.korMessage ===
            "????????? ???????????????. ?????? ????????? ????????????."
          ) {
            sessionStorage.clear();
            navigate(`/`);
            window.location.reload();
          } else if (err.response.data.korMessage) {
            alert(err.response.data.korMessage);
          } else {
            alert(
              "????????? ?????? ???????????? ???????????????... ?????????????????? ?????? ??????????????????.... ???????????????.....???"
            );
          }
        }
      });
  };

  const usesubmitHandler = (event) => {
    event.preventDefault();

    const enteredDisplayName = displaynameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredPhone = phoneInputRef.current.value;
    const enteredContent = contentInputRef.current.value;

    if (
      validatePasswordNoticeClassname === "validate" ||
      validatePhoneNumberNoticeClassname === "validate"
    ) {
      alert("????????? ????????? ?????????");
      return;
    }

    axios(`${process.env.REACT_APP_URL}/api/members?`, {
      method: "PATCH",
      headers: {
        access_hh: sessionStorage.getItem("AccessToken"),
      },
      data: {
        displayName: enteredDisplayName,
        password: enteredPassword,
        phone: enteredPhone,
        content: enteredContent,
        //TODO useState ??? ????????? url??? ????????????
        profileImage: imageURL,
      },
    })
      .then((res) => {
        if (res.status) {
          alert("??????????????? ?????????????????????");
          navigate("/mypage");
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.fieldErrors) {
            alert(err.response.data.fieldErrors[0].reason);
          } else if (
            err.response.data.fieldErrors === null &&
            err.response.data.violationErrors
          ) {
            alert(err.response.data.violationErrors[0].reason);
          } else {
            alert(
              "????????? ?????? ???????????? ???????????????... ?????????????????? ?????? ??????????????????.... ???????????????.....???"
            );
          }
        } else if (err.response.status === 0)
          alert(
            "?????? ????????? ?????? ????????? ??? ????????????. ?????? ?????? ?????? ??????????????????"
          );
        else {
          if (
            err.response.data.korMessage ===
            "????????? ???????????????. ?????? ????????? ????????????."
          ) {
            sessionStorage.clear();
            navigate(`/`);
            window.location.reload();
          } else if (err.response.data.korMessage) {
            alert(err.response.data.korMessage);
          } else {
            alert(
              "????????? ?????? ???????????? ???????????????... ?????????????????? ?????? ??????????????????.... ???????????????.....???"
            );
          }
        }
      });
  };
  const navigate = useNavigate();

  const memberId = sessionStorage.getItem("memberId");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}/api/members/${memberId}`, {
        headers: {
          access_hh: sessionStorage.getItem("AccessToken"),
        },
      })
      .then((res) => {
        setValidatePhoneNumberNoticeClassname("HTH-green");
        setUserInfo(res.data);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.fieldErrors) {
            alert(err.response.data.fieldErrors[0].reason);
          } else if (
            err.response.data.fieldErrors === null &&
            err.response.data.violationErrors
          ) {
            alert(err.response.data.violationErrors[0].reason);
          } else {
            alert(
              "????????? ?????? ???????????? ???????????????... ?????????????????? ?????? ??????????????????.... ???????????????.....???"
            );
          }
        } else if (err.response.status === 0)
          alert(
            "?????? ????????? ?????? ????????? ??? ????????????. ?????? ?????? ?????? ??????????????????"
          );
        else {
          if (
            err.response.data.korMessage ===
            "????????? ???????????????. ?????? ????????? ????????????."
          ) {
            sessionStorage.clear();
            navigate(`/`);
            window.location.reload();
          } else if (err.response.data.korMessage) {
            alert(err.response.data.korMessage);
          } else {
            alert(
              "????????? ?????? ???????????? ???????????????... ?????????????????? ?????? ??????????????????.... ???????????????.....???"
            );
          }
        }
        window.location.reload();
      });
  }, []);

  return (
    <>
      <H1>userinfo Edit</H1>

      <main>
        <section>
          <PageContainer>
            <ContainerWrap>
              <InputWrapper>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="label-wrapper">
                    <label htmlFor="displayName">User Name</label>
                    <div className="container">
                      <input
                        type="displayName"
                        id="displayName"
                        required
                        ref={displaynameInputRef}
                        onChange={onChangedDisplayName}
                        defaultValue={
                          userInfo !== null ? userInfo.displayName : ""
                        }
                      />
                    </div>
                    <button onClick={onClickDuplicateDisplayName}>
                      ????????????
                    </button>
                    <p className={validateDisplayNameNoticeClassname}>
                      {validateDisplayNameText}
                    </p>

                    <label htmlFor="password">Password</label>
                    <div className="container">
                      <input
                        disabled={isDisabledInfo}
                        className="input-tag"
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                        name="password"
                        autoComplete="off"
                        onChange={onChangedPassword}
                      />
                    </div>
                    <p className={validatePasswordNoticeClassname}>
                      {validatePasswordText}
                    </p>

                    <label htmlFor="phone">Phone Number</label>
                    <div className="container">
                      <input
                        disabled={isDisabledInfo}
                        className="input-tag"
                        type="phone"
                        id="phone"
                        required
                        ref={phoneInputRef}
                        defaultValue={userInfo !== null ? userInfo.phone : ""}
                        onChange={onChangedPhoneNumber}
                        // value={phoneNumberText}
                      />
                    </div>
                    <p className={validatePhoneNumberNoticeClassname}>
                      {validatePhoneNumberText}
                    </p>

                    <label htmlFor="content">????????????</label>
                    <div className="container">
                      <input
                        disabled={isDisabledInfo}
                        className="input-tag"
                        type="textarea"
                        id="content"
                        required
                        ref={contentInputRef}
                        defaultValue={userInfo !== null ? userInfo.content : ""}
                        onChange={onChangedContent}
                      />
                    </div>

                    <label htmlFor="content">????????? ?????? ?????????</label>
                    <div className="container">
                      <input
                        className="input-tag"
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        required
                        multiple="multiple"
                        onChange={postImg}
                        ref={profileuploadInputRef}
                      />
                    </div>
                    <button onClick={usesubmitHandler}>????????????</button>
                    <button onClick={() => navigate("/mypage")}>??????</button>
                  </div>
                </form>
              </InputWrapper>
            </ContainerWrap>
          </PageContainer>
        </section>
      </main>
    </>
  );
};

export default Userinfo;
const PageContainer = styled.div`
 
`;
const ContainerWrap = styled.div`
  
`;
const InputWrapper = styled.div`
  
`;
