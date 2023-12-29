import "../css/style.css";
import  { useContext } from "react";
import { Context } from "..";
import { observer } from 'mobx-react-lite';

const Blocked = () => {
    const {store} = useContext(Context);
    return (
      <div >
         <h1>Эх, ваш профиль заблокирован</h1>
         <h3>Ждем ваши извинения здесь: kokokokukareku07@gmail.com</h3>
         <button className="login-button base-button" onClick={()=>store.logout()}>Выйти</button>
      </div>
    );
}

export default observer(Blocked);