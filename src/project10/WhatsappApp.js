import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useState} from "react";
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

    const [contactList, setContactList] = useState([]);

    fetch("./data/contactList.json")
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        console.log(data);
        setContactList(data);
    })

    function onClick(newID) {
        setId(newID);
    }

    return (
        <Container>
            <ContactListComponent onclick={onClick}/>
            {contactList.length === 0 ? <></> :
                id === 0 ? <WelcomeComponent/> :
                <ConversationComponent profilePic={contactList[id - 1].profilePic} name={contactList[id - 1].name}
                                       fileName={`messages${id}.json`}/>}
        </Container>
    );
}