import {Search} from "lucide-react";
import Input from "./Input";

const SearchBar = () => {
    return (
        <div className="p-4 space-y-6 w-full">
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2"/>
                <Input
                    type="text"
                    placeholder="Search Events"
                    className="flex h-10 rounded-md border border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-transparent border-none text-sm w-full focus:outline-none focus:ring-0"
                />
            </div>
        </div>
    )
};
export default SearchBar;