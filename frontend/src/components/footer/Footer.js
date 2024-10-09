import {BarChart, CalendarIcon, MessageCircle, Settings} from "lucide-react";

const Footer = () => {
    return (
        <nav className="bg-gray-800 p-4 flex justify-around items-center">
            <CalendarIcon className="w-6 h-6 text-cyan-400"/>
            <MessageCircle className="w-6 h-6 text-gray-400"/>
            <BarChart className="w-6 h-6 text-gray-400"/>
            <Settings className="w-6 h-6 text-gray-400"/>
        </nav>
    )
};
export default Footer;