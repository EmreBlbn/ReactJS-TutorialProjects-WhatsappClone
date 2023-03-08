import styled from "styled-components";
import {useNavigate} from "react-router-dom";


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
  margin-top: 300px;
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


export default function Login({selectUser, users}) {

    const navigate = useNavigate();

    return (
        <LoginContainer>
            <LoginDiv>
                {users.map((user) => (
                    <UserDiv onClick={() => {
                        selectUser(parseInt(user.get('userId')));
                        navigate('/');
                    }}>
                        <UserPhoto src={user.get('profilePic')}/>
                        <UsernameSpan>{user.get('username')}</UsernameSpan>
                    </UserDiv>
                ))}

            </LoginDiv>
        </LoginContainer>

    );
}