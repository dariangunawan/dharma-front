import { createContext, useEffect, useState } from "react";

export const OrderContext = createContext({});

export function OrderContextProvider({children}) {
    const ls = typeof window !== "undefined" ? window.localStorage : null; // keep the order numbers
    const [orderServices, setOrderServices] = useState([]);
    useEffect(() => {
        if (orderServices?.length > 0) {
            ls?.setItem('orders', JSON.stringify(orderServices))
        }
    }, [orderServices]);
    useEffect(() => {
        if (ls && ls.getItem('orders')) {
            setOrderServices(JSON.parse(ls.getItem('orders')));
        }
    }, []);
    function addOrder(serviceId) {
        setOrderServices(prev => [...prev, serviceId]);
    }
    function removeService(serviceId) {
        setOrderServices(prev => {
            const pos = prev.indexOf(serviceId);
            if (pos !== -1) {
                return prev.filter((value,index) => index !== pos);
            }
            return prev;
        })
    }
    function clearOrders() {
        setOrderServices([]);
    }
    return (
        <OrderContext.Provider value={{ orderServices, setOrderServices, addOrder, removeService, clearOrders }}>
            {children}
        </OrderContext.Provider>
    );
}