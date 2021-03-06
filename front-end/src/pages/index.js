import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useDispatch } from 'react-redux';
import { pallete } from '../lib/style/pallete';
import Logo from '../lib/style/Logo';
import { ACCESS_TOKEN, GO_TO_FEED } from '../modules/user';

const HomeLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 90vh;
`;

const HomeHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-content: center;
  margin-top: 15vh;

  h1 {
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 155%;

    text-align: center;
    margin-bottom: 88px;

    strong {
      font-weight: bold;
    }

    color: ${pallete.primary[1]};
  }

  .logo {
    display: flex;
    justify-content: center;

    width: 100vw;
    transform: translateX(-16px);

    border-bottom: 7px solid ${pallete.primary[1]};

    svg {
      transform: translateY(20px);
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    margin-top: 20px;
  }

  button {
    width: 315px;
    height: 55px;
    border-radius: 14px;
    color: ${pallete.primary[1]};

    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    text-align: center;

    background: ${pallete.primary[3]};
    border: none;
    outline: none;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.15);

    transition: all 0.125s;

    &:active {
      background: ${pallete.primary[2]};
      color: ${pallete.primary[3]};
      border: none;
    }
  }
`;

const Home = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken) {
      dispatch({
        type: GO_TO_FEED,
      });
    }
  }, [accessToken, dispatch]);

  return (
    <HomeLayout>
      <HomeHeader>
        <h1>
          안녕하세요 집사님! <br /> <strong>우동집에 오신걸 환영합니다 'ᴗ'</strong>
        </h1>
        <div className="logo">
          <Logo />
        </div>
      </HomeHeader>
      <ButtonWrapper>
        <Link to="/login">
          <button type="button">로그인</button>
        </Link>
        <Link to="/register">
          <button type="button">회원가입</button>
        </Link>
      </ButtonWrapper>
    </HomeLayout>
  );
};

export default Home;
