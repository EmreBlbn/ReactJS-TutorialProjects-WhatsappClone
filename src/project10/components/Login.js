import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const Airtable = require('airtable');
const base = new Airtable(
    {apiKey: 'patAQiLDt6ApvVmFH.c9569923b72d6ca360cdcc503cc49504bea190f66f0aa5c13290f6807cb3b725'})
    .base('appx04aPv2fM0sc3A');

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 2;
  background-color: darkcyan;
`;

const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  margin-top: 7%;
`;

const UserDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 40%;
  border-bottom: 1px solid #f2f2f2;
  background: white;
  cursor: pointer;
  padding: 15px;

  &:hover {
    background: lightgray;
  }
`;

const UserPhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UsernameSpan = styled.span`
  width: 100%;
  font-size: 16px;
  color: black;
  margin-left: 35px;
  margin-top: 10px;
  justify-content: flex-end;
`;

const NewUserDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  border-bottom: 1px solid #f2f2f2;
  background: white;
  padding: 15px;
  border-top: 2px solid rgba(0, 0, 0, 0.6) !important;

`;

const UserInput = styled.input`
  width: 100%;
  font-size: 17px;
  margin-top: 20px;
`;

const SelectUserDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 15px;
`;

const SelectUserPhotoText = styled.p`
  //margin-top: 22px;
  font-size: 16px;
`

const SelectUserPhoto = styled(UserPhoto)`
  width: 25%;
  height: 70%;
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
  border: ${(props) => (props.isSelected ? '3px solid green' : '')};;
`;

const CreateUserDiv = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: row-reverse;
`;

const CreateUserButton = styled.button`
  display: flex;
  padding: 10px 15px;
  background-color: #4caf50;
  cursor: pointer;
`;


export default function Login({selectUser, users, updateAllMessages, channel, activeUsers}) {

    const navigate = useNavigate();

    const [photoIndex, setPhotoIndex] = useState(-1);

    function select(event, index) {
        if (photoIndex === index) {
            setPhotoIndex(-1);
        } else {
            setPhotoIndex(index);
        }
    }

    function createUserAndLogin(event) {
        if (!event.target.parentNode.parentNode.children[0].item.value) {
            alert("Please Enter Username");
        } else if (photoIndex === -1) {
            alert("Please Choose Profile Photo");
        } else {
            let photo;
            if (photoIndex === 0) photo = "/profile/limon.jpeg";
            else if (photoIndex === 1) photo = "/profile/limon2.jpeg";
            else if (photoIndex === 2) photo = "/profile/pp1.png";
            else if (photoIndex === 3) photo = "/profile/pp2.png";
            else if (photoIndex === 4) photo = "/profile/pp3.jpeg";
            else photo = "/profile/pp4.jpeg";
            let userId = parseInt(users[users.length - 1].get('userId')) + 1;

            base('USERS').create([
                {
                    "fields": {
                        "userId": userId,
                        "username": event.target.parentNode.parentNode.children[0].item.value,
                        "profilePic": photo
                    }
                }
            ], function (error, records) {
                if (error) {
                    console.error(error);
                    return;
                }
                records.forEach(function (record) {
                    console.log(record.getId());
                    updateAllMessages();
                    setTimeout(() => {
                        console.log(users);
                        selectUser(userId);
                        navigate('/');
                    }, 1500);
                });
            });
        }
    }


    return (
        <LoginContainer>
            <LoginDiv>
                {users.map((user) => (
                    <UserDiv onClick={() => {
                        channel.publish("test-message", {text: `${activeUsers},${user.get('userId')}`});
                        selectUser(parseInt(user.get('userId')));
                        navigate('/');
                    }}>
                        <UserPhoto src={user.get('profilePic')}/>
                        <UsernameSpan>{user.get('username')}</UsernameSpan>
                    </UserDiv>
                ))}
                {users.length === 0 ? <></> :
                    <NewUserDiv>
                        Create New User
                        <form>
                            <UserInput placeholder="Enter a username" type="text" name="item"/>
                        </form>
                        <SelectUserDiv>
                            <SelectUserPhotoText>
                                Choose Profile Photo
                            </SelectUserPhotoText>
                            <SelectUserPhoto src="/profile/limon.jpeg" onClick={(event) => select(event, 0)}
                                             isSelected={photoIndex === 0}/>
                            <SelectUserPhoto src="/profile/limon2.jpeg" onClick={(event) => select(event, 1)}
                                             isSelected={photoIndex === 1}/>
                            <SelectUserPhoto src="/profile/pp1.png" onClick={(event) => select(event, 2)}
                                             isSelected={photoIndex === 2}/>
                            <SelectUserPhoto src="/profile/pp2.png" onClick={(event) => select(event, 3)}
                                             isSelected={photoIndex === 3}/>
                            <SelectUserPhoto src="/profile/pp3.jpeg" onClick={(event) => select(event, 4)}
                                             isSelected={photoIndex === 4}/>
                            <SelectUserPhoto src="/profile/pp4.jpeg" onClick={(event) => select(event, 5)}
                                             isSelected={photoIndex === 5}/>
                        </SelectUserDiv>
                        <CreateUserDiv>
                            <CreateUserButton onClick={(event) => createUserAndLogin(event)}>Create
                                User</CreateUserButton>
                        </CreateUserDiv>
                    </NewUserDiv>
                }

            </LoginDiv>
        </LoginContainer>

    );
}