import styled from "styled-components";
import {SearchContainer, SearchInput} from "./ContactListComponent";
import {useCallback, useEffect, useState} from "react";
import {configureAbly, useChannel} from "@ably-labs/react-hooks";

const Airtable = require('airtable');
const base = new Airtable(
    {apiKey: 'patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725'})
    .base('appx04aPv2fM0sc3A');

configureAbly({key: "TAsQKw.bgo3rw:WUtyaoJqZAevWB9-6gWxZs_I_DgfUdDXJN03vumfPqs", clientId: "21"});

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

const EmojiImageButton = styled(EmojiImage)`
  width: 40px;
  height: 40px;
  opacity: 1;
`

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

const MessageRight = styled.div`
  margin-right: 10px;
  background: #daf8cb;
  max-width: 50%;
  color: #303030;
  padding: 8px 10px;
  font-size: 19px;
  border-radius: .4em;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: #daf8cb;
    border-bottom: 0;
    border-right: 0;
    margin-top: -10px;
    margin-right: -20px;
  }
`;

const MessageLeft = styled.div`
  margin-left: 10px;
  background: white;
  max-width: 50%;
  color: #303030;
  padding: 8px 10px;
  font-size: 19px;
  border-radius: .4em;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-right-color: white;
    border-bottom: 0;
    border-left: 0;
    margin-top: -10px;
    margin-left: -20px;
  }
`;

const MessageTime = styled.div`
  width: 100%;
  justify-content: flex-end;
  display: flex;
  margin-top: 3px;
  font-size: 9px;
`;

const SearchForm = styled.form`
  width: 100%;
`;

const EmojiDiv = styled.div`
  visibility: ${(props) => (props.visibility ? "visible" : "hidden")};
  display: ${(props) => (props.visibility ? "flex" : "none")};
  background: #ededed;
  padding: 10px;
  align-items: center;
  bottom: 0;
`;

const DoubleTick = styled.img`
  justify-content: flex-end;
  width: 15px;
  height: 15px;
  padding-left: 5px;
`;

const DoubleTickDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileNameDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileNameSpan = styled.span`
  font-size: 15px;
`;

const ProfileActiveStatus = styled.span`
  margin-top: 5px;
  font-size: 12px;
  color: ${(props) => (props.active ? "green" : "gray")};
`;

export default function ConversationComponent({
                                                  profilePic,
                                                  name,
                                                  id,
                                                  userId,
                                                  allMessages,
                                                  updateAllMessages,
                                                  activeUsers
                                              }) {

    const [messages, setMessages] = useState([]);

    const [emojiVisibility, setEmojiVisibility] = useState(false);

    const [fetched, setFetched] = useState(0);

    const [channelUpdate] = useChannel("WhatsappClone", (message) => {
        updateAllMessages();
        setTimeout(() => {
            setFetched(0);
        }, 500);
        console.log(message.data.text);
    });

    const getMessages = useCallback(() => {
        setMessages(
            allMessages.filter((message) => {
                return (parseInt(message.get('senderId')) === id || parseInt(message.get('receiverId')) === id)
                    &&
                    (parseInt(message.get('senderId')) === userId || parseInt(message.get('receiverId')) === userId);
            })
        );
    }, [allMessages, id, userId]);

    const readMessages = useCallback(() => {
        console.log("in readMessages");
        messages.filter((message) => {
            return !message.get('readed') && parseInt(message.get('receiverId')) === userId;
        }).forEach((message) => {
            setFetched(2);
            console.log(message.get('msg'));
            base('MESSAGES').update([
                {
                    "id": message.getId(),
                    "fields": {
                        "msgId": message.get('msgId'),
                        "senderId": message.get('senderId'),
                        "receiverId": message.get('receiverId'),
                        "msg": message.get('msg'),
                        "sentTime": message.get('sentTime'),
                        "readed": true
                    }
                }
            ], function (error, records) {
                if (error) {
                    console.error(error);
                    return;
                }
                records.forEach(function (record) {
                    console.log(record);
                    setTimeout(() => {
                        updateAllMessages();
                    }, 500);
                    setTimeout(() => {
                        channelUpdate.publish("test-message", {text: "Update"});
                        console.log("updated");
                    }, 1000)
                });
            })
        })
    }, [channelUpdate, messages, updateAllMessages, userId])

    useEffect(() => {
        let hasMessage = false;
        for (let i = 0; i < allMessages.length; i++){
            if (parseInt(allMessages[i].get('senderId')) === id || parseInt(allMessages[i].get('receiverId')) === id){
                hasMessage = true;
                i = allMessages.length;
            }
        }
        if (fetched === 0 || (messages.length !== 0 && (parseInt(messages[0].get('senderId')) !== id && parseInt(messages[0].get('receiverId')) !== id))
            || (messages.length === 0 && hasMessage)) {
            getMessages();
            setFetched(1);
        }
        if (fetched === 1) {
            readMessages();
        }
        console.log("Conversation useEffect runs")
    }, [allMessages, fetched, getMessages, id, messages, readMessages, updateAllMessages, userId]);


    function openEmojiDiv(event) {
        event.preventDefault();
        setEmojiVisibility(!emojiVisibility);
    }

    function addEmoji(event, emoji) {
        event.preventDefault();
        event.target.parentNode.parentNode.children[3].children[0].children[1].item.value += emoji;
        setEmojiVisibility(false);
    }

    function submitMessage(event) {
        event.preventDefault();
        const form = event.target;
        const input = form.item;
        const msgId = parseInt(allMessages[allMessages.length - 1].get('msgId')) + 1;
        let hour = new Date().getHours().toString();
        if (hour.length === 1) hour = `0${hour}`;
        let minute = new Date().getMinutes().toString();
        if (minute.length === 1) minute = `0${minute}`;


        base('MESSAGES').create([
            {
                "fields": {
                    "msgId": msgId,
                    "senderId": parseInt(userId),
                    "receiverId": parseInt(id),
                    "msg": input.value,
                    "sentTime": `${hour}:${minute}`,
                    "readed": false
                }
            }
        ], function (error, records) {
            if (error) {
                console.error(error);
                return;
            }
            records.forEach(function (record) {
                console.log(record.getId());
                setTimeout(() => {
                    channelUpdate.publish("test-message", {text: "Update"});
                }, 500);
                setTimeout(() => {
                    setFetched(0)
                }, 1000)
            });
        });

        form.reset();
    }

    return (
        <Container>
            <ProfileHeader>
                <ProfileImage src={profilePic}/>
                <ProfileNameDiv>
                    <ProfileNameSpan>
                        {name}
                    </ProfileNameSpan>
                    <ProfileActiveStatus active={activeUsers[id]}>
                        {activeUsers[id] ? "Online" : "Offline"}
                    </ProfileActiveStatus>
                </ProfileNameDiv>
            </ProfileHeader>
            <MessageContainer>
                {messages.map((messageData) => (
                    <MessageDiv isYours={parseInt(messageData.get('senderId')) === userId}>
                        {parseInt(messageData.get('senderId')) === userId ?
                            <MessageRight>
                                {messageData.get('msg')}
                                <DoubleTickDiv>
                                    <MessageTime>{messageData.get('sentTime')}</MessageTime>
                                    <DoubleTick
                                        src={messageData.get('readed') ? "/profile/readedDoubleTick.png" : "/profile/notReadedDoubleTick.png"}
                                        alt="double tick"/>
                                </DoubleTickDiv>
                            </MessageRight>
                            :
                            <MessageLeft>
                                {messageData.get('msg')}
                                <MessageTime>{messageData.get('sentTime')}</MessageTime>
                            </MessageLeft>
                        }


                    </MessageDiv>
                ))}
            </MessageContainer>
            <EmojiDiv visibility={emojiVisibility}>
                <EmojiImageButton src={"/profile/smile.svg"} onClick={(event) => addEmoji(event, "😁")}/>
                <EmojiImageButton src={"/profile/angry.svg"} onClick={(event) => addEmoji(event, "😡")}/>
                <EmojiImageButton src={"/profile/crying.svg"} onClick={(event) => addEmoji(event, "😢")}/>
                <EmojiImageButton src={"/profile/sunglasses.svg"} onClick={(event) => addEmoji(event, "😎")}/>
                <EmojiImageButton src={"/profile/astonished.svg"} onClick={(event) => addEmoji(event, "😲")}/>
                <EmojiImageButton src={"/profile/heart.svg"} onClick={(event) => addEmoji(event, "❤️")}/>
            </EmojiDiv>
            <ChatBox>
                <SearchContainer>
                    <EmojiImage src={"/profile/data.svg"} onClick={openEmojiDiv}/>
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