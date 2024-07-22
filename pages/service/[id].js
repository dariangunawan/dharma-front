import Button from "@/components/Button"
import Center from "@/components/Center"
import Header from "@/components/Header"
import { OrderContext } from "@/components/OrderContext"
import ServiceReviews from "@/components/ServiceReviews"
// import ServiceImages from "@/components/ServiceImages";
import Title from "@/components/Title"
import WhiteBox from "@/components/WhiteBox"
import { formatNumber } from "@/lib/helpers"
import { mongooseConnect } from "@/lib/mongoose"
import { Service } from "@/models/Service"
import axios from "axios"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin: 40px 0;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
`
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
`
const Price = styled.span`
  font-size: 1.5rem;
`

export default function ServicePage({ service }) {
  const router = useRouter()
  const { addOrder, setOrderId, updateTermin } = useContext(OrderContext)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  function loadReviews() {
    setReviewsLoading(true)
    axios.get("/api/reviews?service=" + service?._id).then((res) => {
      setReviews(res.data)
      setReviewsLoading(false)
    })
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const rating =
    (reviews &&
      reviews.reduce((rowAccumulator, currentItem) => {
        return rowAccumulator + currentItem.stars
      }, 0)) ||
    0

  const finalRating = rating / reviews?.length
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <img style={{ maxWidth: "100%" }} src={service.images?.[0]} />
          </WhiteBox>
          <div>
            <Title>{service.title}</Title>
            <p>{service.description}</p>
            <p>
              ⭐ {(finalRating && finalRating?.toFixed(1)) || 0} (
              {reviews?.length || 0})
            </p>
            <PriceRow>
              <div>
                <Price>{formatNumber(service.price, "Rp ")}</Price>
              </div>
              <div>
                <Button
                  primary
                  onClick={() => {
                    setOrderId(null)
                    updateTermin("termin-1")
                    addOrder(service._id)
                  }}
                >
                  Order
                </Button>
                <Button
                  className="ml-3"
                  primary
                  onClick={() => router.replace("/chat")}
                >
                  Chat
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
        <ServiceReviews service={service} />
      </Center>
    </>
  )
}

export async function getServerSideProps(context) {
  await mongooseConnect()
  const { id } = context.query
  const service = await Service.findById(id)
  return {
    props: {
      service: JSON.parse(JSON.stringify(service)),
    },
  }
}
