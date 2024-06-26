import Button from "@/components/Button"
import Center from "@/components/Center"
import Header from "@/components/Header"
import Input from "@/components/Input"
import { OrderContext } from "@/components/OrderContext"
import Select from "@/components/Select"
import Table from "@/components/Table"
import { auth } from "@/lib/firebase"
import axios from "axios"
import { onAuthStateChanged } from "firebase/auth"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
`
const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`
const ServiceInfoCell = styled.td`
  padding: 10px 0;
  img {
    max-width: 150px;
    max-height: 150px;
  }
`
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
`
const ButtonPosition = styled.div`
  display: flex;
  justify-content: center;
`

export default function OrderPage() {
  const { orderServices, removeService, clearOrders } = useContext(OrderContext)
  const [services, setServices] = useState([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [type_order, setTypeOrder] = useState("regular-order")
  const [type_payment, setTypePayment] = useState("termin-1")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  useEffect(() => {
    if (orderServices.length > 0) {
      axios.post("/api/orders", { ids: orderServices }).then((response) => {
        setServices(response.data)
      })
    } else {
      setServices([])
    }
  }, [orderServices])
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true)
      clearOrders()
    }
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        axios.get("/api/auth?userId=" + user.uid).then((res) => {
          setIsLoggedIn(res.data)
          setName(res?.data?.name)
          setEmail(res?.data?.email)
        })
        // User is signed in
        // Redirect to protected routes or display logged-in content
      } else {
        setIsLoggedIn(null)
        // User is not signed in
        console.log("User is not signed in")
        // Redirect to login or registration page
      }
    })
  }, [])
  console.log(orderServices, "orderServices")
  function removeTheService(id) {
    removeService(id)
  }
  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      company,
      type_order,
      type_payment,
      orderServices,
    })
    if (response.data.url) {
      window.location = response.data.url
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
    )
  }
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Orders</h2>
            {!orderServices?.length && <div>You have no orders.</div>}
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
                  {services.map((service) => (
                    <tr>
                      <ServiceInfoCell>
                        <ServiceImageBox>
                          <img src={service.images[0]} alt="" />
                        </ServiceImageBox>
                        {service.title}
                      </ServiceInfoCell>
                      <td>
                        {
                          orderServices.filter((id) => id === service._id)
                            .length
                        }
                      </td>
                      <td>
                        Rp
                        {orderServices.filter((id) => id === service._id)
                          .length * service.price}
                      </td>
                      <ButtonPosition>
                        <Button onClick={() => removeTheService(service._id)}>
                          Remove
                        </Button>
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
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(ev) => setCompany(ev.target.value)}
              />
              <Select
                placeholder="Type Order"
                value={type_order}
                onChange={(ev) => setTypeOrder(ev.target.value)}
              >
                <option value="regular-order">Regular Order</option>
                <option value="ganti-design">Ganti Design</option>
              </Select>
              <Select
                placeholder="Type Payment"
                value={type_payment}
                onChange={(ev) => setTypePayment(ev.target.value)}
              >
                <option value="termin-1">Termin 1</option>
                <option value="termin-2">Termin 2</option>
              </Select>
              <Button black block onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  )
}
