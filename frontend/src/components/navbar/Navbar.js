import {Menu} from "lucide-react";
import avatar from "../../assets/head-silhouette-png-24.png"
import {useUserApi} from "../../ApiContext";

const Navbar = () => {
    const {user} = useUserApi()
    return (
        <div className='bg-gray-800 p-4 flex justify-between items-center'>
            <Menu className="w-6 h-6 text-gray-400"/>
            <h1 className="text-lg font-bold text-cyan-400">AI Calendar</h1>
            <div className='flex'>
                <div className='text-xs'>{user.session_id}</div>
                {/*<img src={avatar} width="24"/>*/}
            </div>
        </div>
    )
};
export default Navbar;