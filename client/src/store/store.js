import {makeAutoObservable} from 'mobx';
import AuthService from '../services/auth-service';
import axios from 'axios';
import { API_URL } from '../http';
import FilmService from '../services/film-service';
import UserService from '../services/user-service';

export default class Store{
    user = {};
    isAuth = false;
    isReg = false;
    isLoading = false;
    isAdmin = false;
    isActivated = false;
    isBlocked = false;
    constructor(){
        makeAutoObservable(this);
    }

    setBlocked(bool){
        this.isBlocked = bool;
    }

    setActivated(bool){
        this.isActivated = bool;
    }

    setAdmin(bool){
        this.isAdmin = bool;
    }

    setLoading(bool){
        this.isLoading = bool;
    }

    setAuth(bool){
        this.isAuth = bool;
    }

    setUser(user){
        this.user = user;
    }

    setReg(isReg){
        this.isReg = isReg;
    }

    async clickReg(){
        try{
            this.setReg(true);
        } catch(e) {
            console.log(e.response?.data?.message)
        }
    }

    async clickLog(){
        try{
            this.setReg(false);
        } catch(e) {
            console.log(e.response?.data?.message)
        }
    }

    async login(email, password){
        this.setLoading(true);
        try{
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            this.setActivated(response.data.user.isActivated);
            this.setBlocked(response.data.user.isBlocked)
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('name', response.data.user.login);
            localStorage.setItem('auth', true);
            if(localStorage.getItem('role')==="user")
                this.setAdmin(false)
            else
                this.setAdmin(true);
        } catch(e) {
            window.history.pushState({},null,'/login')
            alert(e.response?.data?.message)
        }finally{
            this.setLoading(false);
        }
    }

    async registration(email, password, name){
        //this.setLoading(true);
        try{
            const response = await AuthService.registration(email, password, name);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('role', response.data.user.role_id);
            localStorage.setItem('name', response.data.user.login);
            this.setActivated(false);
            this.setAdmin(false)
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch(e) {
            alert(e.response?.data?.message)
        }finally{
            //this.setLoading(false);
        }
    }

    async logout(){
        this.setLoading(true);
        try{
            await AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            localStorage.removeItem('auth');
            this.setBlocked(false)
            this.setAdmin(false);
            this.setAuth(false);
            this.setUser({});
        } catch(e) {
            console.log(e.response?.data?.message)
        }finally{
            this.setLoading(false);
        }
    }

    async checkAuth(){
        this.setLoading(true);
        try{
            
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true});
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('isauth', true);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch(e) {
            console.log(e.response?.data?.message)
        } finally {
            this.setLoading(false);
        }
    }

    async checkAdmin(){
        this.setLoading(true);
        try{
            localStorage.setItem('isadmin', true);
            this.setAdmin(true)
        } catch(e) {
            console.log(e.response?.data?.message)
        } finally {
            this.setLoading(false);
        }
    }

    async postFilm(year, duration, name, slogan, description, age, budget, charge, writer){
        try{
            await FilmService.postFilm(year, duration, name, slogan, description, age, budget, charge, writer);
        } catch(e) {
            alert(e.response?.data?.message)
        }
    }

    async putFilm(id, year, duration, name, slogan, description, age, budget, charge, writer){
        try {
            await FilmService.putFilm(id, year, duration, name, slogan, description, age, budget, charge, writer);
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }

    async postUser(email, password, login){
        try {
            await UserService.postUser(email, password, login);
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }

    async toFavourite(userId, filmId){
        try {
            await FilmService.toFavourite(userId, filmId);
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }

    async toWatch(userId, filmId){
        try {
            await FilmService.toWatch(userId, filmId);
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }
    async toWatched(userId, filmId){
        try {
            await FilmService.toWatched(userId, filmId);
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }

    async postFilmToCategory(userId, filmId, category){
        try {
            await FilmService.postFilmToCategory(userId, filmId, category);
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }
}