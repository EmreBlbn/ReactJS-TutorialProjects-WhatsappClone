import styled from "styled-components";
import {SearchContainer, SearchInput} from "./ContactListComponent";
import {messagesList} from "../Data";
import {useState} from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 2;
  background: #f6f7f8;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #ededed;
  padding: 15px;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ChatBox = styled.div`
  display: flex;
  background: #f0f0f0;
  padding: 10px;
  align-items: center;
  bottom: 0;
`;

const EmojiImage = styled.img`
  width: 30px;
  height: 28px;
  opacity: 0.4;
  cursor: pointer;
`;

const MessageContainer = styled.div`
  background-image: url("/profile/background-img.png");
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessageDiv = styled.div`
  justify-content: ${(props) => (props.isYours ? 'flex-end' : 'flex-start')};
  display: flex;
  margin: 5px 16px;
`;

const Message = styled.div`
  background: ${(props) => (props.isYours ? '#daf8cb' : 'white')};
  max-width: 50%;
  color: #303030;
  padding: 8px 10px;
  font-size: 19px;
`;

export default function ConversationComponent({profilePic, name}) {

    const [messages, setMessages] = useState(messagesList);

    function addEmoji(event) {
        event.preventDefault();
        const msgList = [...messages, {id: 7, messageType: "TEXT", text: "Test", senderID: 1, addedOn: "12:00 PM"}];
        setMessages(msgList);
        event.target.reset();
    }

    return (
        <Container>
            <ProfileHeader>
                <ProfileImage src={profilePic}/>
                {name}
            </ProfileHeader>
            <MessageContainer>
                {messages.map((messageData) => (
                    <MessageDiv isYours={messageData.senderID === 0}>
                        <Message isYours={messageData.senderID === 0}>{messageData.text}</Message>
                    </MessageDiv>
                ))}
            </MessageContainer>
            <ChatBox>
                <SearchContainer>
                    <EmojiImage src={"/profile/data.svg"} onClick={addEmoji}/>
                    <SearchInput placeholder="Type a message"/>
                </SearchContainer>
            </ChatBox>
        </Container>
    );
}