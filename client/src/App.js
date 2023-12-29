import FilmCatalog from "./components/FilmCatalog";
import FilmPage from "./components/FilmPage";
import LoginForm from "./components/LoginForm"
import {Navigate, Route, Routes} from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from "react";
import { Context } from ".";
import NotFoundPage from "./components/NotFoundPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/style.css";
import FilmList from "./components/FilmList";
import FilmGenre from "./components/FilmGenre";
import UserHeader from "./components/UserHeader";
import SearchList from "./components/SearchList";
import AdminHeader from "./components/AdminHeader";
import Users from "./components/Users";
import FilmEditor from "./components/FilmEditor";
import AdminCatalog from "./components/AdminCatalog";
import FilmConstructor from "./components/FilmConstructor";
import SortedFilms from "./components/SortedFilms";
import Blocked from "./components/Blocked";

function App() {
  const {store} = useContext(Context);

  store.setActivated(store.user.isActivated)
  store.setAuth(store.isAuth)
  useEffect(()=>{
    if(localStorage.getItem('token')){
      store.checkAuth();
    }
    if(localStorage.getItem('isadmin')){
      store.checkAdmin();
    }
    if(localStorage.getItem('role')==="admin"){
      store.setAdmin(true);
    }
  }, [store])

  if(localStorage.getItem('auth') && store.isAdmin===false){
    return (
      <div className="App">
        <Routes>
          <Route path="/notactivated" element={<NotFoundPage/>}></Route>
          <Route path="/blocked" element={<Blocked/>}></Route>
          <Route path="/films" element={<UserHeader/>}>
            <Route path="/films/:fid" element={<FilmPage />}></Route>
            <Route path="/films/list/:category" element={<FilmList/>}></Route>
            <Route path="/films/genre/:genre" element={<FilmGenre/>}></Route>
            <Route path="/films/search/:text" element={<SearchList/>}></Route>
            <Route path="/films/fvrt" element={<SortedFilms category="favourite"/>}></Route>
            <Route path="/films/wtchd" element={<SortedFilms category="watched"/>}></Route>
            <Route index element={<FilmCatalog />}></Route>
          </Route>
          <Route path="/login" element={<Navigate to={"/films"}/>}></Route>
        </Routes>
      </div>
    );
  }  
  
  if(localStorage.getItem('auth') && store.isAdmin===true){
  return(
      <div className="App">
        <Routes>
          <Route path="*" element={<Navigate to={"/admin"}/>}></Route>
          <Route path="/notactivated" element={<NotFoundPage/>}></Route>
          <Route path="/admin" element={<AdminHeader/>}>
            <Route path="/admin/:fid" element={<FilmEditor />}></Route>
            <Route path="/admin/users" element={<Users/>}></Route>
            <Route path="/admin/add" element={<FilmConstructor/>}></Route>
            <Route path="/admin/search/:text" element={<SearchList/>}></Route>
            <Route index element={<AdminCatalog/>}></Route>
          </Route>
        </Routes></div>
    )
  }
  
  return(
      <Routes>
        <Route path="/login" element={<LoginForm/>}></Route>
        <Route path="*" element={<Navigate to={"/login"}/>}></Route>
      </Routes>
  )
}

export default observer(App);