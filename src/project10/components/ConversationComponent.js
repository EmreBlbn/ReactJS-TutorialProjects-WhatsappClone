import styled from "styled-components";
import {SearchContainer, SearchInput} from "./ContactListComponent";
import {useEffect, useState} from "react";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 2;
  background: #f6f7f8;
  border-left: 1px solid rgba(0, 0, 0, 0.6) !important;
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
  height: 85%;
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


const SearchForm = styled.form`
  width: 100%;
`;

export default function ConversationComponent({profilePic, name, id, userId}) {

    const [allMessages, setAllMessages] = useState([]);

    const [messages, setMessages] = useState(getMessages(id));

    useEffect(() => {
        getAllMessages();
    }, [getAllMessages]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getAllMessages() {
        fetch('http://localhost:3002/messages')
            .then(response => {
                return response.json();
            })
            .then(data => {
                setAllMessages(data);
                setMessages(getMessages());
            })
    }

    function getMessages() {
        return allMessages.filter((message) => {
            return (parseInt(message.senderid) === id || parseInt(message.receiverid) === id)
                &&
                (parseInt(message.senderid) === userId || parseInt(message.receiverid) === userId);
        })
    }

    function addEmoji(event) {
        event.preventDefault();
        event.target.parentNode.children[1].item.value += "😁"
    }

    function submitMessage(event) {
        event.preventDefault();
        const form = event.target;
        const input = form.item;
        const body = JSON.stringify({
            msgid: `${parseInt(allMessages[allMessages.length -1].msgid) + 1}`,
            senderid: `${userId}`,
            receiverid: `${id}`,
            msg: input.value,
            senttime: `${new Date().getHours()}:${new Date().getMinutes()}`
        });
        console.log(body)
        fetch('http://localhost:3002/messages', {
            method: 'POST',
            body: body,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => {
            return response.json();
        });
        getAllMessages();
        form.reset();
    }

    return (
        <Container>
            <ProfileHeader>
                <ProfileImage src={profilePic}/>
                {name}
            </ProfileHeader>
            <MessageContainer>
                {messages.map((messageData) => (
                    <MessageDiv isYours={parseInt(messageData.senderid) === userId}>
                        <Message isYours={parseInt(messageData.senderid) === userId}>{messageData.msg}</Message>
                    </MessageDiv>
                ))}
            </MessageContainer>
            <ChatBox>
                <SearchContainer>
                    <EmojiImage src={"/profile/data.svg"} onClick={addEmoji}/>
                    <SearchForm onSubmit={submitMessage}>
                        <SearchInput type="text"
                                     name="item"
                                     required={true}
                                     placeholder="Type a message"/>
                    </SearchForm>
                </SearchContainer>
            </ChatBox>
        </Container>
    );
}