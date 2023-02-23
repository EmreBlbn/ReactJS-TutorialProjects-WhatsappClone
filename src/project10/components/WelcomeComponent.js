import {Container} from "./ConversationComponent";
import styled from "styled-components";

const WelcomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  margin-top: 300px;
`;

export default function WelcomeComponent(){

    return(
      <Container>
        <WelcomeDiv>
            <img src="/profile/welcome-placeholder.jpeg" alt="Welcome"/>
        </WelcomeDiv>
      </Container>
    );
}