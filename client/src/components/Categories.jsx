import { useContext, useEffect, useState } from "react"
import FilmService from '../services/film-service';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import "../css/FilmCatalog.css";
import ListGroup from 'react-bootstrap/ListGroup';
import { Context } from "..";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const {store} = useContext(Context);

    useEffect(() => {
      const getFilms = async () => {
        const response1 = await FilmService.getUserCategories(store.user.id);
        setCategories(response1.data.films);
      };
      getFilms();
    }, [store.user.id]);

    return categories.length!=0?(
            <ListGroup defaultActiveKey="#link1" style={{padding:"21px 0px 0px 0px"}}>
            {categories.map(category => (
                <div key={category.category}>
                    <Link to={`/films/list/${category.category}`}>
                    <ListGroup.Item action>{category.category}</ListGroup.Item>
                    </Link>
                </div>
            ))}
            </ListGroup>
    ):(
      <div className="moviePage">
        <h6 style={{margin:"15px 5px 5px 5px"}}>
          У вас нет списков
        </h6>
      </div>
    )
}

export default observer(Categories);