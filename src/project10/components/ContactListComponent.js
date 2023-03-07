import styled from "styled-components";
import {MdGroups} from "react-icons/md";
import {TbCircleDashed} from "react-icons/tb";
import {BiMessageAltDetail} from "react-icons/bi";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useEffect, useState} from "react";

const Airtable = require('airtable');
const base = new Airtable(
    {apiKey: 'patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725'})
    .base('appx04aPv2fM0sc3A');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 0.8;
`;

const ProfileInfoDiv = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 15px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const SearchBox = styled.div`
  display: flex;
  background: #f6f6f6;
  padding: 10px;
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 16px;
  width: 100%;
  padding: 5px 0;
`;

const SearchIcon = styled.img`
  width: 28px;
  height: 28px;
  padding-left: 10px;
`;

export const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  padding-left: 15px;
  font-size: 17px;
  margin-left: 10px;
`;

const ContactItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 94%;
  border-bottom: 1px solid #f2f2f2;
  background: white;
  cursor: pointer;
  padding: 15px;

  &:hover {
    background: lightgray;
  }
`;

const ProfileIcon = styled(ProfileImage)`
  width: 38px;
  height: 38px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 19px;
`;

const ContactName = styled.span`
  width: 100%;
  font-size: 16px;
  color: black;
`;

const MessageText = styled.span`
  width: 20%;
  font-size: 14px;
  margin-top: 3px;
  color: rgba(0, 0, 0, 0.8);
`;

const LastMessageDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const DoubleTick = styled.img`
  padding-top: 4px;
  width: 15px;
  height: 15px;
`

function ContactComponent({userData, onclick, userId}) {

    const [allMessages, setAllMessages] = useState([]);

    const [messages, setMessages] = useState(getMessages(userId));

    const [lastText, setLastText] = useState('');

    const [lastTextTime, setLastTextTime] = useState('');


    useEffect(() => {
        getAllMessages();
    }, [getAllMessages]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getAllMessages() {
        base('MESSAGES').select({
            view: "Grid view"
        }).eachPage(function page(records, processNextPage) {
            setAllMessages(records);
            setMessages(getMessages(parseInt(userData.get('userId'))));
            if (messages.length !== 0) {
                setLastText(messages[messages.length - 1].get('msg'));
                setLastTextTime(messages[messages.length - 1].get('sentTime'));
            }
            processNextPage();
        }, function done(error) {
            if (error) console.log(error);
        });
    }

    function getMessages(id) {
        return allMessages.filter((message) => {
            return (parseInt(message.get('senderId')) === id || parseInt(message.get('receiverId')) === id)
                &&
                (parseInt(message.get('senderId')) === userId || parseInt(message.get('receiverId')) === userId);
        })
    }

    return (
        <ContactItem onClick={() => onclick(parseInt(userData.get('userId')))}>
            <ProfileIcon src={userData.get('profilePic')}/>
            <ContactInfo>
                <ContactName>{userData.get('username')}</ContactName>
                <LastMessageDiv>
                    <MessageText>{lastText}</MessageText>
                    {messages.length !== 0 && parseInt(messages[messages.length - 1].get('senderId')) === userId ?
                        <DoubleTick src={"/profile/readedDoubleTick.png"}/> : <></>}
                </LastMessageDiv>
            </ContactInfo>
            <MessageText>{lastTextTime}</MessageText>
        </ContactItem>
    );
}

const ProfileSymbolContainer = styled.div`
  width: 100%;
  justify-content: flex-end;
  display: flex;
  margin: 5px 16px;
`;

const ProfileSymbolSpan = styled.span`
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 7px 10px;
  position: absolute;
  z-index: 1;
  margin-top: 30px;
`;

const ProfileSymbolDiv = styled.div`
  display: flex;
  padding-left: 20px;

  &:hover ${ProfileSymbolSpan} {
    visibility: visible;
  }
`;

export default function ContactListComponent({onclick, profilePhoto, userId}) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

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

    return (
        <Container>
            <ProfileInfoDiv>
                <ProfileImage src={profilePhoto}/>
                <ProfileSymbolContainer>
                    <ProfileSymbolDiv>
                        <MdGroups size={30}/>
                        <ProfileSymbolSpan>Groups</ProfileSymbolSpan>
                    </ProfileSymbolDiv>
                    <ProfileSymbolDiv>
                        <TbCircleDashed size={30}/>
                        <ProfileSymbolSpan>Status</ProfileSymbolSpan>
                    </ProfileSymbolDiv>
                    <ProfileSymbolDiv>
                        <BiMessageAltDetail size={30}/>
                        <ProfileSymbolSpan>New Chat</ProfileSymbolSpan>
                    </ProfileSymbolDiv>
                    <ProfileSymbolDiv>
                        <BsThreeDotsVertical size={30}/>
                        <ProfileSymbolSpan>Menu</ProfileSymbolSpan>
                    </ProfileSymbolDiv>
                </ProfileSymbolContainer>
            </ProfileInfoDiv>
            <SearchBox>
                <SearchContainer>
                    <SearchIcon src="/profile/search-icon.svg"/>
                    <SearchInput placeholder="Search or start new chat"/>
                </SearchContainer>
            </SearchBox>
            {users.map((userData) =>
                parseInt(userData.get('userId')) !== userId && (
                    <ContactComponent userData={userData} onclick={onclick} userId={userId}/>)
            )}
        </Container>
    );
}
