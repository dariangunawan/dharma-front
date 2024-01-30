import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";
import BarsIcon from "./icons/Bars";

const StyledHeader = styled.header`
    background-color: #222;
`;
const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 3;
`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 25px 0;
`;
const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
        display: block;
    ` : `
        display: none;
    `}
    background-color: #222;
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`;
const NavLink = styled(Link)`
    color: #aaa;
    display: block;
    text-decoration: none;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`; 
const NavButton = styled.button`
    background-color: transparent;
    width: 40px;
    height: 40px;
    border: 0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

export default function Header() {
    const {orderServices} = useContext(OrderContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>dharma kreasi</Logo>
                    <StyledNav mobileNavActive={mobileNavActive}>
                        <NavLink href={'/'}>Home</NavLink>
                        <NavLink href={'/account'}>Account</NavLink>
                        <NavLink href={'/orders'}>Orders({orderServices.length})</NavLink>
                    </StyledNav>
                    <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                        <BarsIcon />
                    </NavButton>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}