import './App.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { Suspense } from "react";
import CustomNavBar from './components/shared/CustomNavBar';
import Tickets from './components/Tickets';
import Ticket from './components/Ticket';
import TicketsAdd from './components/TicketsAdd';
import Sign from './components/authentication/Sign';
import { ToastContainer } from 'react-toastify';

const App = () => {


    return (
        <Suspense fallback={<h1 children="Loading" />}>
            <CustomNavBar/>
            <Router>
                <Routes>
                    {[
                        {index: true, element: <Tickets/>},
                        {path: "/tickets/", element: <Ticket/>},
                        {path: "/tickets/add/", element: <TicketsAdd/>},
                        {path: "/login/", element: <Sign/>},
                    ].map((route, index) => <Route key={index} {...route}/>)}
                </Routes>
            </Router>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={true}
                theme="colored"
                style={{
                    zIndex: 999999999999999,
                }}
            />
        </Suspense>
    )
}
export default App;

