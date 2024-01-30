import styled from "styled-components";
import Center from "./Center";

const Bg = styled.div`
   background: linear-gradient(139deg, rgba(34,34,34,1) 32%, rgba(33,37,37,1) 59%, rgba(9,119,121,1) 82%, rgba(6,42,64,1) 96%);
   color: #fff;
   padding: 70px 0;
`;
const Title = styled.h1`
   color: #29b6f6;
   margin:0;
   padding-top: 30px;
   padding-bottom: 25px;
   font-weight: normal;
   font-size: 1.5rem;
   @media screen and (min-width: 768px) {
       font-size: 3rem;
   }
`;
const Spotlight = styled.h2`
   color: #ffca28;
`;

export default function Main() {
    return (
        <Bg>
            <Center>
                <div>
                    <img src="https://i.imgur.com/nYikGVf.png" alt='' />
                </div>
                <Title>YOUR ONE STOP CREATIVE SOLUTION</Title>
                <p>In this saturated world of digital age, there are so much to choose from. No matter how great you are (and we believe you are great), you need your presence to be known.</p>
                <Spotlight>Let us put the spotlight on you.</Spotlight>
            </Center>
        </Bg>
    );
}