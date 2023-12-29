import React, { useContext, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { store } = useContext(Context);

  if (!store.isReg) {
    return <LoginForm />;
  }

  return (
    <div className='wrapper'>
      <div className='container'>
        <span className='title'
          style={{
            margin:"5px 5px 5px 5px"
          }}><h1>MadCinema</h1></span>
        <input className='text elem' onChange={(e) => setName(e.target.value)} value={name} type='text' placeholder='Имя'/>
        <input className='text elem' onChange={(e) => setEmail(e.target.value)} value={email} type='text' placeholder='Email'/>
        <input className='text elem' onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Пароль'/>
        <Button variant="primary"
            style={{
              width:"330px"
            }} onClick={() => {store.registration(email, password, name); alert("Проверьте почту, а после войдите");
            setEmail(""); setName(""); setPassword("")}}>
          Зарегистрироваться
        </Button>
        <span>
          Уже есть аккаунт?
          <span> </span>
          <Link>
          <span className='register-button' onClick={() => {store.clickLog();}}>
            Войдите!
          </span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default observer(RegistrationForm);