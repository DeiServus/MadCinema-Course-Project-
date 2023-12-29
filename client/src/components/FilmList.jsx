import { useContext, useEffect, useState } from "react"
import FilmService from '../services/film-service';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import "../css/FilmCatalog.css";
import Button from 'react-bootstrap/Button';
import { Context } from "..";

const FilmList = () => {
    const [films, setFilms] = useState([]);
    const {store} = useContext(Context);
    const {category} = useParams();

    useEffect(() => {
      const getFilms = async () => {
        const response = await FilmService.getFilmsByCategory(store.user.id, category);
        const filmsWithImages = await Promise.all(
          response.data.films.map(async film => {
            const imageResponse = await FilmService.getImage(film.filmId);
            if(!imageResponse.data.image)
                return { ...film, image: "https://topzero.com/wp-content/uploads/2020/06/topzero-products-Malmo-Matte-Black-TZ-PE458M-image-003.jpg"};
            else
                return { ...film, image: imageResponse.data.image.uri};
          })
        );
        setFilms(filmsWithImages);
      };
      getFilms();
    }, [store.user.id, category]);

    return (
            <div className="movieCatalog">
              {films.map(movie => (
                <div className="movie" key={movie.films.id}>
                  <Link to={`/films/${movie.films.id}`}>
                    <img src={movie.image} alt={movie.films.name} />
                  </Link>
                  
                  <Link to={`/films/${movie.films.id}`}>
                    <Button variant="link">{movie.films.name}</Button>
                  </Link>
                  <p>{movie.films.year}</p>
                  <Button variant="secondary" size="sm" onClick={()=>{
                    FilmService.deleteFromCategory(movie.films.id, category, store.user.id)
                    setFilms(films.filter(film => film.films.id !== movie.films.id));
                  }}>
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
    );
}

export default observer(FilmList);