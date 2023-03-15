import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useEffect, useState} from "react";
import WelcomeComponent from "./components/WelcomeComponent";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import {useChannel} from "@ably-labs/react-hooks";

const Airtable = require('airtable');
const base = new Airtable(
    {apiKey: 'patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725'})
    .base('appx04aPv2fM0sc3A');

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 99vh;
  width: 100%;
  background: #f8f9fb;
`;

export default function WhatsappApp() {

    const [id, setId] = useState(-1);

    const [userId, setUserId] = useState(-1);

    const [users, setUsers] = useState([]);

    const [allMessages, setAllMessages] = useState([]);

    const [firstRender, setFirstRender] = useState(true);

    const [needUpdate, setNeedUpdate] = useState(false);

    const [activeUsers] = useState([false, false, false, false, false, false]);

    const [channel] = useChannel("WhatsappClone", (message) => {
        let array = message.data.text.split(',');
        let flag = false;
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] === "false" && activeUsers[i]) {
                array[i] = "true";
                flag = true;
            } else if (array[i] === "true" && !activeUsers[i]){
                activeUsers[i] = true;
            }
        }

        let activeId = parseInt(array[array.length - 1]);
        if (activeId !== -1) {
            array[activeId] = "true";
            activeUsers[activeId] = true;
        }

        console.log(message.data.text);
        console.log(activeUsers);

        if (flag) {
            array[array.length - 1] = "-1";
            channel.publish("test-message", {text: `${array}`})
        }
    });

    useEffect(() => {
        if (firstRender) {
            getUsers();
            getAllMessages();
            setFirstRender(false);
        }
    }, [allMessages, firstRender, users]);

    function getUsers() {
        base('USERS').select({
            view: "Grid view"
        }).eachPage(function page(records, processNextPage) {
            setUsers(records)
            processNextPage();
        }, function done(err) {
            if (err) console.log(err);
        });
    }

    function getAllMessages() {
        base('MESSAGES').select({
            view: "Grid view"
        }).eachPage(function page(records, processNextPage) {
            setAllMessages(records);
            processNextPage();
        }, function done(error) {
            if (error) console.log(error);
        });
    }

    function updateAllMessages() {
        setFirstRender(true);
        setNeedUpdate(true);
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
                <Route path="/" element={
                    userId === -1
                        ?
                        <Login selectUser={selectUser} users={users} updateAllMessages={updateAllMessages}
                               channel={channel} activeUsers={activeUsers}/>
                        :
                        <Container>
                            <ContactListComponent onclick={onClick} profilePhoto={users[userId].get('profilePic')}
                                                  userId={userId} users={users} allMessages={allMessages}
                                                  needUpdate={needUpdate}/>
                            {users.length === 0 ? <></> :
                                id === -1 ? <WelcomeComponent/> :
                                    <ConversationComponent profilePic={users[id].get('profilePic')}
                                                           name={users[id].get('username')}
                                                           id={id} userId={userId} allMessages={allMessages}
                                                           updateAllMessages={updateAllMessages}
                                                           activeUsers={activeUsers}/>}
                        </Container>
                }
                />
            </Routes>
        </Router>

    );
}