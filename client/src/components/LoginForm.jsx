import React, { useContext, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import RegistrationForm from './RegistrationForm';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { store } = useContext(Context);

  if (store.isReg) {
    return <RegistrationForm />;
  }
  return (
    <div className='wrapper'>
      <div className='container'>
        <span className='title'
          style={{
            margin:"5px 5px 5px 5px"
          }}><h1>MadCinema</h1></span>
        <input
          className='text elem'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type='text'
          placeholder='Email'/>
        <input
          className='text elem'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type='password'
          placeholder='Пароль'/>
        <Button variant="primary"
            style={{
              width:"330px"
            }}
            onClick={() => {
              store.login(email, password);
            }}>Войти
          </Button>
        <span>
          Нет аккаунта?
          <span> </span>
          <Link><span
            className='register-button'
            onClick={() => {
              store.clickReg();
            }}
          >
            Создайте его!
          </span></Link>
        </span>
      </div>
    </div>
  );
};

export default observer(LoginForm);