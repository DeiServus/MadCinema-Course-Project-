import { useContext, useEffect, useState } from "react"
import UserService from '../services/user-service';
import { observer } from 'mobx-react-lite';
import "../css/FilmCatalog.css";
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { Context } from "..";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [text, setText] = useState([]);
    const [email, setEmail] = useState([]);
    const [login, setLogin] = useState([]);
    const [password, setPassword] = useState([]);
    const [id, setId] = useState([]);
    const {store} = useContext(Context);
    useEffect(() => {
      const getUsers = async () => {
        const response = await UserService.getAllUsers();
        setUsers(response.data);
      };
      getUsers();
    }, [text, id, login]);

    return (
        <ListGroup as="ol" numbered>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Добавить пользователя?</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Login</Form.Label>
                                <Form.Control maxLength="250" placeholder="Enter login" onChange={(e) => setLogin(e.target.value)} value={login}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control maxLength="50" type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Enter password</Form.Label>
                                <Form.Control maxLength="250" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                            </Form.Group>

                            <Button variant="primary" type="submit" onClick={
                                async(e)=>{
                                    e.preventDefault();
                                    const user = await store.postUser(email, password, login); 
                                        const response = await UserService.getAllUsers();
                                        const newUser = response.data[response.data.length - 1];
                                        setUsers(prevUsers => [...prevUsers, newUser]);
                                        setEmail("");
                                        setLogin("");
                                        setPassword("");
                                }  
                            }>
                                Submit
                            </Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Form className="d-flex">
                <Form.Control
                    style={{width:"100px"}}
                    type="number"
                    placeholder="id"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setId(e.target.value)}
                    value={id}
                />
                <Form.Control
                    style={{width:"400px"}}
                    type="search"
                    placeholder="логин"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <Button onClick={async(e)=>{
                    e.preventDefault();
                    await UserService.putUser(id, text)
                    setId("");
                    setText("")}}>
                    Изменить логин
                </Button>
            </Form>
            {users.map(user => (
                <div key={user.category}>
                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div style={{float:"left", width:"25%"}}>
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">
                                    Login: {user.login}
                                </div>
                                Email: {user.email}
                            </div>
                        </div>
                        <div style={{float:"right", width:"75%"}}>
                            <div style={{float:"left", width:"20%"}}>
                                {user.isBlocked===false?
                                <Button as="input" type="button" value="Блокировать" onClick={
                                    async()=>{await UserService.block(user.id)
                                    const response = await UserService.getAllUsers();
                                    setUsers(response.data);
                                }}/>:
                                <Button as="input" type="button" value="Разлокировать" onClick={
                                    async()=>{await UserService.block(user.id)
                                    const response = await UserService.getAllUsers();
                                    setUsers(response.data);
                                }}/>}
                            </div>
                            <div style={{float:"right", width:"80%"}}>
                            </div>
                        </div>
                        <Badge bg="primary" pill>
                        ID: {user.id}
                        </Badge>
                    </ListGroup.Item>
                </div>
            ))}
        </ListGroup>
    )
}

export default observer(Users);