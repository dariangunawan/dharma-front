import styled from "styled-components"
import Button from "./Button"
import Link from "next/link"
import { useContext } from "react"
import { OrderContext } from "./OrderContext"
import { formatNumber } from "@/lib/helpers"

const WhiteBox = styled(Link)`
  background-color: white;
  padding: 20px;
  height: 150px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 100px;
    max-height: 150px;
  }
`
const ServiceWrapper = styled.div``
const Title = styled(Link)`
  font-weight: normal;
  font-size: 1rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`
const ServiceInfobox = styled.div`
  margin-top: 10px;
`
const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`

export default function ServiceBox({ _id, title, images, description, price }) {
  const { addOrder } = useContext(OrderContext)
  const url = "/service/" + _id
  return (
    <ServiceWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={images[0]} alt="" />
        </div>
      </WhiteBox>
      <ServiceInfobox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>{formatNumber(price, "Rp ")}</Price>
          <Button onClick={() => addOrder(_id)} primary white>
            Order
          </Button>
        </PriceRow>
      </ServiceInfobox>
    </ServiceWrapper>
  )
}
