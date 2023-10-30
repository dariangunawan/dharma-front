import styled from "styled-components";
import Center from "./Center";
import ServiceBox from "./ServiceBox";

const ServicesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; // display columns
    padding-top: 5px;
    gap: 20px;
`;

export default function OurServices({services}) {
    return (
        <Center>
            <h2>Our services</h2>
            <ServicesGrid>
                {services?.length > 0 && services.map(service => (
                    <ServiceBox {...service} />
                ))}
            </ServicesGrid>
        </Center>
    );
}