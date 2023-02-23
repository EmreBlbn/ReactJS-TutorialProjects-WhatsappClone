import styled from "styled-components";
import {MdGroups} from "react-icons/md";
import {TbCircleDashed} from "react-icons/tb";
import {BiMessageAltDetail} from "react-icons/bi";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useState} from "react";

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


function ContactComponent({userData, onclick}) {
    return (
        <ContactItem onClick={() => onclick(userData.id)}>
            <ProfileIcon src={userData.profilePic}/>
            <ContactInfo>
                <ContactName>{userData.name}</ContactName>
                <MessageText>{userData.lastText}</MessageText>
            </ContactInfo>
            <MessageText>{userData.lastTextTime}</MessageText>
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

export default function ContactListComponent({onclick}) {

    const [contactList, setContactList] = useState([]);

    fetch("./data/contactList.json")
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        setContactList(data);
    });

    return (
        <Container>
            <ProfileInfoDiv>
                <ProfileImage src="/profile/Cockatiel-2.jpg"/>
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
            {contactList.map((userData) => <ContactComponent userData={userData} onclick={onclick}/>)}

        </Container>
    );
}
