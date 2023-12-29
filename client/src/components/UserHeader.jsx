import { observer } from 'mobx-react-lite';
import "../css/style.css";
import { useContext, useState } from "react";
import { Context } from "..";
import {Link, Navigate, Outlet} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Categories from './Categories';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const UserHeader = () => {
    const {store} = useContext(Context);
    const [text, setText] = useState([]);
    if(store.isActivated===false){
     return (<Navigate to={'/notactivated'}/>)
    }
    if(store.isBlocked===true){
        return (<Navigate to={'/blocked'}/>)
    }
    return (
        <div className='wrapper-user-page'>
            <div className='wrapper-aligner'>
            <div className='header-wrapper'>
                <span className='text-returning'>
                {`Приветствуем вас, ${localStorage.getItem('name')}. Ваша почта: ${store.user.email}`}
                </span>
                <Link
                    className='menu-last-item '
                    onClick={() => {
                        store.logout();
                    }}
                >
                <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#121212'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='icon feather-log-out'
                >
                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
                <polyline points='16 17 21 12 16 7'></polyline>
                <line x1='21' y1='12' x2='9' y2='12'></line>
                </svg>
            </Link>
            </div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as={Link} to={`/films`}>MadCinema</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={`/films`}>Каталог</Nav.Link>
                        <Nav.Link as={Link} to={`/films/wtchd`}>Самые просматриваемые</Nav.Link>
                        <Nav.Link as={Link} to={`/films/fvrt`}>Самые любимые</Nav.Link>
                        <NavDropdown title="Жанры" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={`/films/genre/${"comedy"}`}>Комедии</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"horror"}`}>Ужасы</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"triller"}`}>Триллеры</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"drama"}`}>Драмы</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"romantic"}`}>Романтические фильмы</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"action"}`}>Боевики</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"detective"}`}>Детективы</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"fantasy"}`}>Фантастика</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"cartoon"}`}>Мультфильмы</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/films/genre/${"adventure"}`}>Приключения</NavDropdown.Item>
                        </NavDropdown>
                        <Form className="d-flex">
                            <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => {setText(e.target.value);}}
                            value={text}
                            />
                            {text==""?<Link to={`/films/`}>
                                <Button>
                                Search
                                </Button>
                            </Link>:<Link to={`/films/search/${text}`}>
                                <Button>
                                Search
                                </Button>
                            </Link>}
                        </Form>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                <div style={{float:"left", width:"80%"}}><Outlet/></div>
                <div style={{float:"right", width:"20%"}}><Categories  email={store.user.email}/></div>
            </div>
            </div>
        </div>
    );
};

export default observer(UserHeader);