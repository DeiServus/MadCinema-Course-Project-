import React, { useState, useEffect } from 'react';
import FilmService from '../services/film-service';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import  { useContext } from "react";
import { Context } from "..";
import { observer } from 'mobx-react-lite';
import '../css/FilmPage.css';
import '../css/Review.css';
import ReviewService from '../services/review-service';
import ListGroup from 'react-bootstrap/ListGroup';
import UserService from '../services/user-service';


const FilmPage = () => {
  const { fid } = useParams();
  const [movie, setMovie] = useState(null);
  const {store} = useContext(Context);
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [text, setText] = useState('');
  const [genres, setGenres] = useState([]);
  const [modal, setModal] = useState(false);
  const [mark, setMark] = useState(null);
  const [reviewText, setReviewText] = useState(null);
  const [reviews, setReviews] = useState([]);

  const modalClose = () => setModal(false);
  const modalShow = () => setModal(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await FilmService.getFilm(fid);
      const imageResponse = await FilmService.getImage(fid);
      const mark = await ReviewService.getAverageMark(fid);
      const watch = await FilmService.getCountByCategory(fid, "watch")
      const watched = await FilmService.getCountByCategory(fid, "watched")
      const favourite = await FilmService.getCountByCategory(fid, "favourite")
      if(!imageResponse.data.image)
        setMovie({ ...response.data.film, image: "https://topzero.com/wp-content/uploads/2020/06/topzero-products-Malmo-Matte-Black-TZ-PE458M-image-003.jpg"});
      else
        setMovie({ ...response.data.film, image: imageResponse.data.image.uri, mark: mark.data.mark._avg.mark, watch: watch.data, watched: watched.data, favourite: favourite.data});
    };
    fetchMovie();
    const getCategories = async () => {
      const response = await FilmService.getUserCategories(store.user.id);
      setCategories(response.data.films);
    };
    getCategories();
    const getGenres = async () => {
      const responce = await FilmService.getGenresByFilm(fid);
      setGenres(responce.data.genres);
    }
    getGenres();
  }, [fid, store.user.id]);

  useEffect(()=>{
    const getReviews = async() => {
      const response = await ReviewService.getReviewsByFilm(fid);
      const revs = await Promise.all(
        response.data.review.map(async rev => {
          const email = await UserService.getEmailById(rev.userId);
          const name = await UserService.getNameById(rev.userId);
          return { ...rev, email: email.data.email, name: name.data.name};
        })
      );
      setReviews(revs);
    }
    getReviews()
  }, [fid, store.user.id])

  return movie ? (
    <div>
      <div>
        <div style={{float:"left", width:"40%"}} className="moviePage">
          <img src={movie.image} alt={movie.name} style={{margin:"10px 5px 10px 5px"}}/>
          <ButtonGroup className="mb-2" style={{margin:"10px 5px 10px 5px"}}>
            <Button
              onClick={async () => {
                await store.toFavourite(store.user.id,movie.id);
              }}>В избранное</Button>
            <Button
              onClick={async () => {
                await store.toWatch(store.user.id,movie.id);
              }}>Хочу посмотреть</Button>
            <Button
              onClick={async () => {
                await store.toWatched(store.user.id,movie.id);
              }}>Просмотрено</Button>
            <Button onClick={() => handleShow()}>+</Button> 
          </ButtonGroup>
          <Button onClick={modalShow}>Добавить оценку</Button>
        </div>
        <div style={{float:"right", width:"60%"}}>
          <h1>{movie.name}</h1>
          <h5>Рейтинг: {movie.mark?movie.mark:":("}</h5>
          <h5>Просмотрено: {movie.watched} | В избранном: {movie.favourite}</h5>
          <h1>О фильме</h1>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Год выпуска: </span>{movie.year}</p>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Длительность: </span>{movie.duration} минут</p>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Режиссер: </span>{movie.writer}</p>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Бюджет: </span>{movie.budget}$</p>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Сборы: </span>{movie.charge}$</p>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Жанры: </span>
            {genres.map((genre, index) => (
              <span><Link key={index} to={`/films/genre/${genre.genre}`}>{genre.genre}</Link> </span>
            ))}
          </p>
          <p><span style={{color:"GrayText", margin:"5px 0px 5px 0px"}}>Возраст: </span>{movie.age}+</p>
          <h1>Сюжет</h1>
          <p>{movie.description}</p>
          <h2>Рецензии</h2>
          {reviews.map((review, index) => (
            <div class="review" style={{borderBlock:"1px"}}>
              <span class="review-mark">{review.name}<span class="review-text"> ({review.email})</span></span>
              <div class="review-text">{review.text}</div>
              <div class="review-mark">Оценка: {review.mark}</div>
            </div>
          ))}
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Списки</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form className="d-flex">
            <Form.Control maxLength="50" type="search" placeholder="Search"
              onChange={e => setText(e.target.value)} value={text}
              className="me-2" aria-label="Search"
            />
            <Button onClick={async() => {await store.postFilmToCategory(store.user.id, fid, text);}}>
              Добавить
            </Button>
          </Form>
            <ListGroup defaultActiveKey="#link1" style={{padding:"21px 0px 0px 0px"}}>
              {categories.map(category => (
                  <div key={category.category} className="d-flex" style={{padding:"4px"}}>
                  <ListGroup.Item action>{category.category}</ListGroup.Item>
                  <Button onClick={async() => {await store.postFilmToCategory(store.user.id, fid, category.category);}}>+</Button>
                  </div>
              ))}
            </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal
        show={modal}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Форма для рецензии</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Выбирете оценку</Form.Label>
          <Form.Select aria-label="Default select example" onChange={(e) => setMark(e.target.value)}>
            <option>...</option>
            {Array.from({length: 10}, (_, i) => i + 1).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Form.Select>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Напишите отзыв</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={(e) => setReviewText(e.target.value)}/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={async() => {
            if(mark){
              await ReviewService.postReview(store.user.id, fid, mark, reviewText); modalClose()
            }else{
              alert("Нужно выбрать оценку")
            }
            }}>Оценить</Button>
        </Modal.Footer>
      </Modal>
    </div>
  ) : (
    <div>Loading...</div>
  );
  
};

export default observer(FilmPage);