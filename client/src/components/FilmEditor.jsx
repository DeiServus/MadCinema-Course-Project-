import React, { useState, useEffect } from 'react';
import FilmService from '../services/film-service';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import  { useContext } from "react";
import { Context } from "..";
import { observer } from 'mobx-react-lite';
import '../css/FilmPage.css';
import InputGroup from 'react-bootstrap/InputGroup';

const FilmEditor = () => {
    const { fid } = useParams();
    const [movie, setMovie] = useState(null);
    const [imageId, setImageId] = useState(null)
    const {store} = useContext(Context);
    const [genres, setGenres] = useState([]);

    const genreTitles = ["triller", "horror", "romantic", "comedy", "cartoon", "drama", "detective", "action", "fantasy", "adventure"];
    const handleGenreClick = (genre) => {
        if (genres.some((selectedGenre) => selectedGenre.genre === genre)) {
          setGenres(genres.filter((selectedGenre) => selectedGenre.genre !== genre));
          console.log(genres)
        } else {
          setGenres([...genres, { genre }]);
          console.log(genres)
        }
      };

    useEffect(() => {
        const fetchMovie = async () => {
        const response = await FilmService.getFilm(fid);
        const imageResponse = await FilmService.getImage(fid);
        setImageId(imageResponse.data.image.id)
        if(!imageResponse.data.image)
            setMovie({ ...response.data.film, image: "https://topzero.com/wp-content/uploads/2020/06/topzero-products-Malmo-Matte-Black-TZ-PE458M-image-003.jpg"});
        else
            setMovie({ ...response.data.film, image: imageResponse.data.image.uri});
        };
        fetchMovie();
    }, [fid, store.user.id]);

    useEffect(() => {
        const getGenres = async () => {
            const responce = await FilmService.getGenresByFilm(fid);
            setGenres(responce.data.genres);
        }
        getGenres();
    }, [fid]);


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
                <Form.Control type='number' min="0" placeholder="Введите год выхода" value={movie.year} onChange={(e) => setMovie({...movie, year: e.target.value})}/>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Режисер</Form.Label>
                <Form.Control type="text" maxLength="60" placeholder="Введите имя режисера" value={movie.writer} onChange={(e) => setMovie({...movie, writer: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Длительность в минутах</Form.Label>
                <Form.Control type="number" min="0" placeholder="Введите количество минут" value={movie.duration} onChange={(e) => setMovie({...movie, duration: e.target.value})}/>
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
                <Form.Control type='number' min="0" value={movie.budget} onChange={(e) => setMovie({...movie, budget: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Сборы</Form.Label>
                <Form.Control type='number' min="0" value={movie.charge} onChange={(e) => setMovie({...movie, charge: e.target.value})}/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Возраст</Form.Label>
                <Form.Control type='number' min="0" value={movie.age} onChange={(e) => setMovie({...movie, age: e.target.value})}/>
                </Form.Group>
            </Row>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">URI</InputGroup.Text>
                <Form.Control
                placeholder="Изображение"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={movie.image}
                onChange={(e) => setMovie({...movie, image: e.target.value})}
                />
            </InputGroup>

            <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check type="checkbox" label="Бушь отвечать очком?" />
            </Form.Group>

            <Button variant="primary"
            onClick={async(e)=>{
                genres.forEach(async gen => {
                    await FilmService.putGenres(fid, gen.genre)
                })
                await store.putFilm(fid, movie.year, movie.duration, movie.name, movie.slogan, movie.description, movie.age, movie.budget, movie.charge, movie.writer)

                await FilmService.putImage(fid, movie.image)
                alert('Изменения зафиксированы')
                
            }}>
                Submit
            </Button>
        </Form>
    </div>
  ) : (
    <div>Loading...</div>
  );
  
};

export default observer(FilmEditor);