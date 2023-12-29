import { useContext, useEffect, useState } from "react"
import FilmService from '../services/film-service';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import "../css/FilmCatalog.css";
import Button from 'react-bootstrap/Button';
import { Context } from "..";

const FilmCatalog = () => {
    const [films, setFilmsState] = useState([]);
    const {store} = useContext(Context);

    const getFilms = async () => {
      const response = await FilmService.getFilms();
      const filmsWithImages = await Promise.all(
        response.data.film.map(async film => {
          const imageResponse = await FilmService.getImage(film.id);
          if(!imageResponse.data.image)
            return { ...film, image: "https://topzero.com/wp-content/uploads/2020/06/topzero-products-Malmo-Matte-Black-TZ-PE458M-image-003.jpg"};
          else
          return { ...film, image: imageResponse.data.image.uri};
        })
      );
      setFilmsState(filmsWithImages);
    };

    useEffect(() => {
      getFilms();
    }, [store.user.id]);

    return (
        <div className="movieCatalog">
            {films.map(movie => (
                <div className="movie" key={movie.id}>
                <img src={movie.image} alt={movie.name} />
                <Button variant="link">{movie.name}</Button>
                <p>{movie.year}</p>
                <p>
                    <Link to={`/admin/${movie.id}`}><Button variant="outline-primary">Редактировать</Button></Link>
                    <Button variant="outline-danger" onClick={async()=>{
                      await FilmService.deleteFilmById(movie.id)
                      getFilms();
                    }}>Удалить</Button>
                </p>
                </div>
            ))}
        </div>
    );

}

export default observer(FilmCatalog);