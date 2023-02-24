import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useEffect, useState} from "react";
import WelcomeComponent from "./components/WelcomeComponent";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background: #f8f9fb;
`;

export default function WhatsappApp() {

    const [id, setId] = useState(0);

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

    return (
        <Container>
            <ContactListComponent onclick={onClick}/>
            {users.length === 0 ? <></> :
                id === 0 ? <WelcomeComponent/> :
                <ConversationComponent profilePic={users[id - 1].profilepic} name={users[id - 1].username}
                                       id={id}/>}
        </Container>
    );
}