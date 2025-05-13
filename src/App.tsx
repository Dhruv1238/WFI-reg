import Footer from "./components/Footer";
import AppRouter from "./Router";
import { LoaderProvider } from "./context/LoaderContext";
import Header from "./components/Header";
import { PriceProvider } from "./context/Price";

function App() {
  return (
    <>
      <LoaderProvider>
        <PriceProvider>
          <Header />
          <AppRouter />
          <Footer />
        </PriceProvider>
      </LoaderProvider>
    </>
  );
}

export default App;
