import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext } from "react";
import { OrderContext } from "./OrderContext";

const StyledHeader = styled.header`
    background-color: #222;
`;
const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 25px 0;
`;
const StyledNav = styled.nav`
    display: flex;
    gap: 15px;
`;
const NavLink = styled(Link)`
    color: #aaa;
    text-decoration: none;
`;

export default function Header() {
    const {orderServices} = useContext(OrderContext);
    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>dharma kreasi</Logo>
                    <StyledNav>
                        <NavLink href={'/'}>Home</NavLink>
                        <NavLink href={'/account'}>Account</NavLink>
                        <NavLink href={'/orders'}>Orders({orderServices.length})</NavLink>
                    </StyledNav>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}