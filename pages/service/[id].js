import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { OrderContext } from "@/components/OrderContext";
import ServiceReviews from "@/components/ServiceReviews";
// import ServiceImages from "@/components/ServiceImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Service } from "@/models/Service";
import { useContext } from "react";
import styled from "styled-components";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin: 40px 0;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
`;
const PriceRow = styled.div`
    display: flex;
    gap: 20px;
`;
const Price = styled.span`
    font-size: 1.5rem;
`;

export default function ServicePage({ service }) {
    const {addOrder} = useContext(OrderContext);
    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <img style={{ maxWidth: '100%' }} src={service.images?.[0]} />
                    </WhiteBox>
                    <div>
                        <Title>{service.title}</Title>
                        <p>{service.description}</p>
                        <PriceRow>
                            <div>
                                <Price>Rp{service.price}</Price>
                            </div>
                            <div>
                                <Button primary onClick={() => addOrder(service._id)}>Order</Button>
                            </div>
                        </PriceRow>
                    </div>
                </ColWrapper>
                <ServiceReviews service={service} />
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const service = await Service.findById(id);
    return {
        props: {
            service: JSON.parse(JSON.stringify(service)),
        }
    }
}