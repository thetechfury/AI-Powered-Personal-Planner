import './App.css';
import Navbar from "./components/navbar/Navbar";
import Search from "./components/ui/Search";
import Calendar from "./components/ui/calendar";

function App() {
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            <Navbar/>
            <Search/>
            <Calendar/>
        </div>
    );
}

export default App;
