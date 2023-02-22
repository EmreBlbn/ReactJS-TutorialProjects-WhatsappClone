import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useState} from "react";
import {contactList} from "./Data";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background: #f8f9fb;
`;

export default function WhatsappApp() {

    const [id, setId] = useState(1);

    function onClick(newID) {
        setId(newID);
    }


    return (
        <Container>
            <ContactListComponent onclick={onClick}/>
            <ConversationComponent profilePic={contactList[id - 1].profilePic} name={contactList[id - 1].name}/>
        </Container>
    );
}