import styled from "styled-components";
import {SearchContainer, SearchInput} from "./ContactListComponent";
import {useEffect, useState} from "react";

const Airtable = require('airtable');
const base = new Airtable(
    {apiKey: 'patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725'})
    .base('appx04aPv2fM0sc3A');

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

export default function ConversationComponent({profilePic, name, id, userId}) {

    const [allMessages, setAllMessages] = useState([]);

    const [messages, setMessages] = useState(getMessages(id));

    const [emojiVisibility, setEmojiVisibility] = useState(false);

    useEffect(() => {
        getAllMessages();
    }, [getAllMessages]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getAllMessages() {
        base('MESSAGES').select({
            view: "Grid view"
        }).eachPage(function page(records, processNextPage) {
            setAllMessages(records);
            setMessages(getMessages());
            processNextPage()
        }, function done(error) {
            if (error) console.log(error);
        });
    }

    function getMessages() {
        return allMessages.filter((message) => {
            return (parseInt(message.get('senderId')) === id || parseInt(message.get('receiverId')) === id)
                &&
                (parseInt(message.get('senderId')) === userId || parseInt(message.get('receiverId')) === userId);
        })
    }

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

        base('MESSAGES').create([
            {
                "fields": {
                    "msgId": parseInt(allMessages[allMessages.length - 1].get('msgId')) + 1,
                    "senderId": parseInt(userId),
                    "receiverId": parseInt(id),
                    "msg": input.value,
                    "sentTime": `${new Date().getHours()}:${new Date().getMinutes()}`
                }
            }
        ], function (error, records) {
            if (error) {
                console.error(error);
                return;
            }
            records.forEach(function (record) {
                console.log(record.getId())
            });
        });
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
                    <MessageDiv isYours={parseInt(messageData.get('senderId')) === userId}>
                        {parseInt(messageData.get('senderId')) === userId ?
                            <MessageRight>
                                {messageData.get('msg')}
                                <MessageTime>{messageData.get('sentTime')}</MessageTime>
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