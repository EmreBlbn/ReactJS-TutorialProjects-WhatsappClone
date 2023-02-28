import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useEffect, useState} from "react";
import WelcomeComponent from "./components/WelcomeComponent";
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom";
import Login from "./components/Login";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background: #f8f9fb;
`;

export default function WhatsappApp() {

    const [id, setId] = useState(-1);

    const [userId, setUserId] = useState(-1);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        fetch('http://localhost:3002/users')
            .then(response => {
                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
    }

    function onClick(newID) {
        setId(newID);
    }

    function selectUser(newUserId) {
        setUserId(newUserId);
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login selectUser={selectUser}/>}/>
                <Route path="/" element={
                    userId === -1
                        ?
                        <div>
                            <NavLink to="/login">Click to Login</NavLink>
                        </div>
                        :
                        <Container>
                            <ContactListComponent onclick={onClick} profilePhoto={users[userId].profilepic}
                                                  userId={userId}/>
                            {users.length === 0 ? <></> :
                                id === -1 ? <WelcomeComponent/> :
                                    <ConversationComponent profilePic={users[id].profilepic}
                                                           name={users[id].username}
                                                           id={id} userId={userId}/>}
                        </Container>
                }
                />
            </Routes>
        </Router>

    );
}