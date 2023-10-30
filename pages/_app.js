import { OrderContextProvider } from "@/components/OrderContext";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500&display=swap');
  body {
    background-color: #f0f0f0;
    padding:0;
    margin:0;
    font-family: 'Barlow Condensed', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <OrderContextProvider>
        <Component {...pageProps} />
      </OrderContextProvider>
    </>
  );
}
