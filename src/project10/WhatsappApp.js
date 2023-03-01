import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useEffect, useState} from "react";
import WelcomeComponent from "./components/WelcomeComponent";
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom";
import Login from "./components/Login";

const Airtable = require('airtable');
const base = new Airtable(
    {apiKey: 'patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725'})
    .base('appx04aPv2fM0sc3A');

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

    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        if (firstRender){
            getUsers();
            setFirstRender(false) ;
        }
    }, [firstRender]);

    function getUsers() {
        base('USERS').select({
            view: "Grid view",
            maxRecords: 6
        }).eachPage(function page(records, processNextPage) {
            setUsers(records)
            processNextPage();
        }, function done(err) {
            if (err) console.log(err);
        });
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
                            <ContactListComponent onclick={onClick} profilePhoto={users[userId].get('profilePic')}
                                                  userId={userId}/>
                            {users.length === 0 ? <></> :
                                id === -1 ? <WelcomeComponent/> :
                                    <ConversationComponent profilePic={users[id].get('profilePic')}
                                                           name={users[id].get('username')}
                                                           id={id} userId={userId}/>}
                        </Container>
                }
                />
            </Routes>
        </Router>

    );
}