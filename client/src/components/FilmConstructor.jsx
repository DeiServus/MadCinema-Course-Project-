import React, { useContext, useState } from 'react';
import FilmService from '../services/film-service';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { observer } from 'mobx-react-lite';
import '../css/FilmPage.css';
import InputGroup from 'react-bootstrap/InputGroup';
import { Context } from '..';
import { Link } from 'react-router-dom';

const FilmConstructor = () => {
    const [movie, setMovie] = useState({
        name: '',
        year: 0,
        writer: '',
        duration: 0,
        slogan: '',
        description: '',
        budget: 0,
        charge: 0,
        age: 0
    });
    const [genres, setGenres] = useState([]);
    const [image, setImage] = useState('');

    const genreTitles = ["triller", "horror", "romantic", "comedy", "cartoon", "drama", "detective", "action", "fantasy", "adventure"];
    const handleGenreClick = (genre) => {
        if (genres.some((selectedGenre) => selectedGenre.genre === genre)) {
          setGenres(genres.filter((selectedGenre) => selectedGenre.genre !== genre));
        } else {
          setGenres([...genres, { genre }]);
        }
    };


    return movie ? (
    <div className="moviePage">
        <Form>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Название</Form.Label>
                <Form.Control type="text" maxLength="50" placeholder="Введите название" value={movie.name} onChange={(e) => setMovie({...movie, name: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Год выхода</Form.Label>
                <Form.Control type="number" min="1900" placeholder="Введите год выхода" value={movie.year} onChange={(e) => setMovie({...movie, year: e.target.value})}/>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Режисер</Form.Label>
                <Form.Control type="text" maxLength="60" placeholder="Введите имя режисера" value={movie.writer} onChange={(e) => setMovie({...movie, writer: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Длительность в минутах</Form.Label>
                <Form.Control type="number" min="1" placeholder="Введите количество минут" value={movie.duration} onChange={(e) => setMovie({...movie, duration: e.target.value})}/>
                </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Жанры</Form.Label>
                <Form>
                {genreTitles.filter((genre) => !genres.some((g) => g.genre === genre)).map((genre, index) => (
                <Button key={index} variant="primary" size="sm" style={{ margin: "2px" }} onClick={() => handleGenreClick(genre)}>
                    {genre}
                </Button>
                ))}
                </Form>
                <Form>
                    <span>Добавленные: </span>
                {genres.map((genre, index) => (
                <Button key={index} variant="secondary" size="sm" style={{ margin: "2px" }} onClick={() => handleGenreClick(genre.genre)}>
                    {genre.genre}
                </Button>
                ))}
                </Form>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Слоган</Form.Label>
                <Form.Control placeholder="Бла-бла-бла-бла-бла" maxLength="250" value={movie.slogan} onChange={(e) => setMovie({...movie, slogan: e.target.value})}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
                <FloatingLabel controlId="floatingTextarea2" label="Описание">
                    <Form.Control
                        as="textarea"
                        maxLength="500"
                        placeholder="Leave a comment here"
                        style={{ height: '100px' }}
                        value={movie.description}
                        onChange={(e) => setMovie({...movie, description: e.target.value})}
                    />
                </FloatingLabel>
            </Form.Group>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Бюджет</Form.Label>
                <Form.Control type="number" min="1" value={movie.budget} onChange={(e) => setMovie({...movie, budget: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Сборы</Form.Label>
                <Form.Control type="number" min="1" value={movie.charge} onChange={(e) => setMovie({...movie, charge: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Возраст</Form.Label>
                <Form.Control type="number" min="0" max="18" value={movie.age} onChange={(e) => setMovie({...movie, age: e.target.value})}/>
                </Form.Group>
            </Row>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">URI</InputGroup.Text>
                <Form.Control
                placeholder="Изображение"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                />
            </InputGroup>

            <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check type="checkbox" label="Бушь отвечать очком?" />
            </Form.Group>
            <Link>
                <Button variant="primary"
                onClick={async()=>{
                    const film = await FilmService.postFilm(movie.year, movie.duration, movie.name, movie.slogan, movie.description, movie.age, movie.budget, movie.charge, movie.writer)
                    if(film!==undefined){
                        await FilmService.postImage(film.data.film.id, image)
                        genres.forEach(async gen => {
                            await FilmService.putGenres(film.data.film.id, gen.genre)
                        })
                        alert("Все сохранено")
                    }
                }}>
                    Submit
                </Button>
            </Link>
        </Form>
    </div>
    ) : (
        <div>Loading...</div>
    );
};

export default observer(FilmConstructor);