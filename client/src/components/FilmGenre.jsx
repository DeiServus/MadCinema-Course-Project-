import { useContext, useEffect, useState } from "react"
import FilmService from '../services/film-service';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import "../css/FilmCatalog.css";
import Button from 'react-bootstrap/Button';
import { Context } from "..";

const FilmGenre = () => {
    const [films, setFilmsState] = useState([]);
    const {store} = useContext(Context);
    const {genre} = useParams();

    useEffect(() => {
      const getFilms = async () => {
        const response = await FilmService.getFilmsByGenre(genre);
        const filmsWithImages = await Promise.all(
          response.data.films.map(async film => {
            const imageResponse = await FilmService.getImage(film.id);
            if(!imageResponse.data.image)
                return { ...film, image: "https://topzero.com/wp-content/uploads/2020/06/topzero-products-Malmo-Matte-Black-TZ-PE458M-image-003.jpg"};
            else
                return { ...film, image: imageResponse.data.image.uri};
          })
        );
        setFilmsState(filmsWithImages);
      };
      getFilms();
    }, [store.user.id, genre]);

    return (
              <div className="movieCatalog">
                {films.map(movie => (
                  <div className="movie" key={movie.id}>
                    <Link to={`/films/${movie.id}`}>
                      <img src={movie.image} alt={movie.name} />
                    </Link>
                    <Link to={`/films/${movie.id}`}>
                      <Button variant="link">{movie.name}</Button>
                    </Link>
                    <p>{movie.year}</p>
                  </div>
                ))}
              </div>
    );
}

export default observer(FilmGenre);