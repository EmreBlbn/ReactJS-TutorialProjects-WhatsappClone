import styled from "styled-components";
import {MdGroups} from "react-icons/md";
import {TbCircleDashed} from "react-icons/tb";
import {BiMessageAltDetail} from "react-icons/bi";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useCallback, useEffect, useState} from "react";

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
  max-width: 50%;
  font-size: 14px;
  margin-top: 3px;
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.8);
`;

const LastMessageDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const DoubleTick = styled.img`
  padding-right: 5px;
  padding-top: 4px;
  width: 15px;
  height: 15px;
`

const GreenDot = styled.img`
  margin-top: 4px;
  margin-right: 10px;
  height: 30px;
  width: 30px;
`

function ContactComponent({userData, onclick, userId, allMessages, needUpdate}) {

    const [messages, setMessages] = useState([]);

    const [lastText, setLastText] = useState('');

    const [lastTextTime, setLastTextTime] = useState('');

    const [flag, setFlag] = useState(false);

    const getMessagesByID = useCallback((id) => {
        return allMessages.filter((message) => {
            return (parseInt(message.get('senderId')) === id || parseInt(message.get('receiverId')) === id)
                &&
                (parseInt(message.get('senderId')) === userId || parseInt(message.get('receiverId')) === userId);
        });
    }, [allMessages, userId]);

    const getMessages = useCallback(() => {
        setMessages(getMessagesByID(parseInt(userData.get('userId'))));
        if (messages.length !== 0 && allMessages.length !== 0) {
            setLastText(messages[messages.length - 1].get('msg'));
            setLastTextTime(messages[messages.length - 1].get('sentTime'));
            setFlag(true);
        }
    }, [allMessages.length, getMessagesByID, messages, userData]);

    useEffect(() => {
        if (!flag || needUpdate) {
            getMessages();
        }
    }, [flag, getMessages, needUpdate]);

    return (
        <ContactItem onClick={() => onclick(parseInt(userData.get('userId')))}>
            <ProfileIcon src={userData.get('profilePic')}/>
            <ContactInfo>
                <ContactName>{userData.get('username')}</ContactName>
                <LastMessageDiv>
                    {messages.length !== 0 && parseInt(messages[messages.length - 1].get('senderId')) === userId ?
                        messages[messages.length - 1].get('readed') ?
                            <DoubleTick src={"/profile/readedDoubleTick.png"}/> :
                            <DoubleTick src="/profile/notReadedDoubleTick.png"/> : <></>}
                    <MessageText>{lastText}</MessageText>
                </LastMessageDiv>
            </ContactInfo>
            {messages.length !== 0 && parseInt(messages[messages.length - 1].get('receiverId')) === userId
            && !messages[messages.length - 1].get('readed') ? <GreenDot src={"/profile/greenCircle.png"}/> : <></>}
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

export default function ContactListComponent({onclick, profilePhoto, userId, users, allMessages, needUpdate}) {

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
                    <ContactComponent userData={userData} onclick={onclick} userId={userId} allMessages={allMessages}
                                      needUpdate={needUpdate}/>)
            )}
        </Container>
    );
}
