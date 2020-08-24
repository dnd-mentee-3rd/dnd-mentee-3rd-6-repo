import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import firebase from '../../lib/api/firebaseAuth';
import EmailPasswordForm from '../../components/auth/SignUp/EmailPasswordForm';
import IsServantForm from '../../components/auth/SignUp/IsServant';

import {
  IDENTIFY_REQUEST,
  NUMBER_VERIFY_REQUEST,
  IDENTIFY_SUCCESS,
  IDENTIFY_FAILURE,
  NUMBER_VERIFY_SUCCESS,
  NUMBER_VERIFY_FAILURE,
  EMAIL_VALID_REQUEST,
  SIGN_UP_1_REQUEST,
} from '../../modules/user';
import useInput from '../../hooks/useInput';
import IdentifyForm from '../../components/auth/SignUp/IdentifyForm';
import { NEXT_PAGE } from '../../modules/pageNumber';

const SignUpContainer = () => {
  const [username, onChangeUsername] = useInput('');
  const [phoneNumber, onChangePhoneNumber] = useInput('');
  const [authNumber, onChangeAuthNumber] = useInput('');

  const [email, onChangeEmail] = useInput('');
  const [prevEmail, setPrevEmail] = useState('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [timeCheck, setTimeCheck] = useState(false);
  const [time, setTime] = useState(179);
  const [timeString, setTimeString] = useState('');

  const [isServant, setIsServant] = useState(true);

  const dispatch = useDispatch();
  const {
    identifyLoading,
    identifyDone,
    numberVerifyLoading,
    numberVerifyDone,
    emailValidData,
  } = useSelector((state) => state.user);

  const { page } = useSelector((state) => state.pageNumber);

  const emailInputRef = useRef();

  /* 페이지 1 - 리캡챠 설정 */
  const setUpRecaptcha = useCallback(() => {
    firebase.auth().languageCode = 'ko';
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {
        setTimeCheck((prev) => !prev);
      },
    });
  }, []);

  /* 페이지 1 - 인증번호 받기 */
  const onClcikAuthNumber = useCallback(async () => {
    await dispatch({
      type: IDENTIFY_REQUEST,
    });
    await setUpRecaptcha();
    try {
      const koreaPhoneNumber = `+82 ${phoneNumber}`;
      await firebase
        .auth()
        .signInWithPhoneNumber(koreaPhoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          dispatch({
            type: IDENTIFY_SUCCESS,
          });
        });
    } catch (error) {
      dispatch({
        type: IDENTIFY_FAILURE,
        error,
      });
    }
  }, [dispatch, phoneNumber, setUpRecaptcha]);

  /* 페이지 1 - 인증번호 확인 */
  const onSubmitCheckAuthNumber = useCallback(async () => {
    dispatch({
      type: NUMBER_VERIFY_REQUEST,
    });
    try {
      await window.confirmationResult.confirm(authNumber).then((result) => {
        const { user } = result;
        console.log(user);
        // 2페이지 이동
        dispatch({
          type: NUMBER_VERIFY_SUCCESS,
          data: {
            name: username,
            phoneNumber,
          },
        });
      });
    } catch (error) {
      dispatch({
        type: NUMBER_VERIFY_FAILURE,
        error,
      });
      alert('인증번호가 다릅니다.');
    }
  }, [authNumber, dispatch, phoneNumber, username]);

  /* 페이지 2 - 비밀번호 확인 */
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );

  /* 페이지 2 - 이메일 중복 확인 */
  const onFocusCheckEmail = useCallback(() => {
    if (prevEmail === email) {
      return null;
    }
    setPrevEmail(() => email);
    return dispatch({
      type: EMAIL_VALID_REQUEST,
      data: email,
    });
  }, [dispatch, email, prevEmail]);

  /* 페이지 2 - 패스워드 확인 후 다음 페이지 이동 */
  const nextPage2 = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    // 3페이지로 이동
    dispatch({
      type: NEXT_PAGE,
    });
  }, [dispatch, password, passwordCheck]);

  /* 페이지 3 - 집사 확인 후 다음 페이지 이동 */
  const nextPage3 = useCallback(() => {
    dispatch({
      type: SIGN_UP_1_REQUEST,
      data: {
        email,
        password,
        isServant,
      },
    });
  }, [dispatch, email, isServant, password]);

  /* 페이지 1 - 휴대폰 길이 확인 */
  useEffect(() => {
    phoneNumber.length === 11 ? setIsSubmitted((prev) => !prev) : setIsSubmitted(false);
  }, [phoneNumber.length]);

  /* 페이지 1 - 휴대폰 인증 타이머 */
  useEffect(() => {
    if (time > 0 && timeCheck) {
      const timer = setInterval(() => {
        setTime((prevNumber) => prevNumber - 1);
      }, 1000);

      const min = Math.floor(time / 60).toString();
      let sec = (time % 60).toString();
      if (sec.length === 1) sec = `0${sec}`;
      setTimeString(`${min}:${sec}`);

      return () => {
        clearInterval(timer);
      };
    }
    if (time <= 0) {
      setTimeCheck(false);
      setTimeString('시간 초과');
    }
  }, [time, timeCheck]);

  /* 페이지 1 - 휴대폰 인증 완료 후 다음 페이지 */
  useEffect(() => {
    // 2 페이지로 이동
    numberVerifyDone &&
      dispatch({
        type: NEXT_PAGE,
      });
  }, [dispatch, numberVerifyDone]);

  /* 페이지 2 - 이메일 중복확인 */
  useEffect(() => {
    emailValidData && emailInputRef.current.focus();
    if (email !== prevEmail) {
      emailValidData && emailInputRef.current.focus();
    }
  }, [email, emailValidData, prevEmail]);

  return (
    <>
      {page === 1 && (
        <IdentifyForm
          username={username}
          onChangeUsername={onChangeUsername}
          phoneNumber={phoneNumber}
          onChangePhoneNumber={onChangePhoneNumber}
          authNumber={authNumber}
          onChangeAuthNumber={onChangeAuthNumber}
          onClcikAuthNumber={onClcikAuthNumber}
          onSubmitCheckAuthNumber={onSubmitCheckAuthNumber}
          isSubmitted={isSubmitted}
          identifyLoading={identifyLoading}
          numberVerifyLoading={numberVerifyLoading}
          identifyDone={identifyDone}
          timeString={timeString}
        />
      )}
      {page === 2 && (
        <EmailPasswordForm
          email={email}
          onChangeEmail={onChangeEmail}
          password={password}
          onChangePassword={onChangePassword}
          passwordCheck={passwordCheck}
          onChangePasswordCheck={onChangePasswordCheck}
          passwordError={passwordError}
          emailInputRef={emailInputRef}
          emailValidData={emailValidData}
          onFocusCheckEmail={onFocusCheckEmail}
          nextPage2={nextPage2}
        />
      )}
      {page === 3 && (
        <IsServantForm
          username={username}
          isServant={isServant}
          setIsServant={setIsServant}
          nextPage3={nextPage3}
        />
      )}
    </>
  );
};

export default SignUpContainer;