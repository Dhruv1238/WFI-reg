import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExhibitorRegistrationPage from './pages/ExhibitorRegistration';
import About from './pages/Test';
import PaymentPage from './pages/Payment';
import Thankyou from './pages/Thankyou';
import VisitorRegistrationPage from './pages/VisitorRegistration';
import Thankyou2 from './pages/ThankyouOffline';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/exhibitors" element={<ExhibitorRegistrationPage />} />
        <Route path="/visitors" element={<VisitorRegistrationPage />} />
        <Route path="/about" element={<About />} />
        <Route path='/payment' element={<PaymentPage/>} />
        <Route path='/thankyou' element={<Thankyou />} />
        <Route path='/thankyou2' element={<Thankyou2 />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;