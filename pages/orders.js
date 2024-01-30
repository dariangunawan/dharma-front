import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { OrderContext } from "@/components/OrderContext";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top:40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
`;
const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;
const ServiceInfoCell = styled.td`
    padding: 10px 0;
    img {
        max-width: 150px;
        max-height: 150px;
    }
`;
const ServiceImageBox = styled.div`
    max-width: 150px;
    max-height: 150px;
    padding: 2px;
    background-color: #f0f0f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (min-width: 768px) {
        padding: 10px;
    }
`;
const ButtonPosition = styled.div`
    display: flex;
    justify-content: center;
`;

export default function OrderPage() {
    const { orderServices, removeService, clearOrders } = useContext(OrderContext);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
        if (orderServices.length > 0) {
            axios.post('/api/orders', { ids: orderServices })
                .then(response => {
                    setServices(response.data);
                })
        } else {
            setServices([]);
        }
    }, [orderServices]);
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearOrders();
        }
    }, []);
    function removeTheService(id) {
        removeService(id);
    }
    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name, email, company, orderServices,
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
    }
    if (isSuccess) {
        return (
            <>
            <Header />
            <Center>
                <ColumnsWrapper>
                <Box>
                    <h1>Success and thank you!</h1>
                    <p>Your design shall be finished.</p>
                </Box>
                </ColumnsWrapper>
            </Center>
            </>
        );
    }
    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Orders</h2>
                        {!orderServices?.length && (
                            <div>You have no orders.</div>
                        )}
                        {services?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map(service => (
                                        <tr>
                                            <ServiceInfoCell>
                                                <ServiceImageBox>
                                                    <img src={service.images[0]} alt="" />
                                                </ServiceImageBox>
                                                {service.title}
                                            </ServiceInfoCell>
                                            <td>
                                                {orderServices.filter(id => id === service._id).length}
                                            </td>
                                            <td>
                                                Rp{orderServices.filter(id => id === service._id).length * service.price}
                                            </td>
                                            <ButtonPosition>
                                                <Button onClick={() => removeTheService(service._id)}>Remove</Button>
                                            </ButtonPosition>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Box>
                    {!!orderServices?.length && (
                        <Box>
                            <h2>Order information</h2>
                            <Input type="text" placeholder="Name" value={name} onChange={ev => setName(ev.target.value)} />
                            <Input type="text" placeholder="Email" value={email} onChange={ev => setEmail(ev.target.value)} />
                            <Input type="text" placeholder="Company" value={company} onChange={ev => setCompany(ev.target.value)} />
                            <Button black block onClick={goToPayment}>Continue to payment</Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
}