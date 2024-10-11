import React from 'react';
import './App.css';
import Navbar from "./components/navbar/Navbar";
import EventsPage from "./pages/EventsPage";
import Footer from "./components/footer/Footer";
import {ApiProvider} from "./ApiContext";

function App() {
    return (
        <ApiProvider>
            <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
                <Navbar/>
                <EventsPage/>
                <Footer/>
            </div>
        </ApiProvider>
    );
};

export default App;
