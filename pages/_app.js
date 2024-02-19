import { OrderContextProvider } from "@/components/OrderContext"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { createGlobalStyle } from "styled-components"
import "../styles/globals.css"

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500&display=swap');
  body {
    background-color: #f0f0f0;
    padding:0;
    margin:0;
    font-family: 'Barlow Condensed', sans-serif;
  }
`

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <ToastContainer />
      <GlobalStyles />
      <SessionProvider session={session}>
        <OrderContextProvider>
          <Component {...pageProps} />
        </OrderContextProvider>
      </SessionProvider>
    </>
  )
}
