import Header from "@/components/Header"
import Main from "@/components/Main"
import OurServices from "@/components/OurServices"
import { mongooseConnect } from "@/lib/mongoose"
import { Service } from "@/models/Service"

export default function HomePage({ ourServices }) {
  return (
    <div>
      <Header />
      <Main />
      <OurServices services={ourServices} />
    </div>
  )
}

export async function getServerSideProps() {
  await mongooseConnect()
  const ourServices = await Service.find({}, null, { sort: { _id: -1 } })
  return {
    props: {
      ourServices: JSON.parse(JSON.stringify(ourServices)),
    },
  }
}
