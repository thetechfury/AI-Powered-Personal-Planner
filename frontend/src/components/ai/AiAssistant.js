import {Button} from "@mui/material";
import avatar from "../../assets/head-silhouette-png-24.png";
import Input from "../ui/Input";

const AiAssistant = () => {
    return (
        <div className="p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">AI Assistant</h3>
                <div className="space-y-3 mb-3">
                    <div className="flex items-start space-x-2">
                        <img src={avatar} width="24"/>
                        <div className="bg-gray-700 rounded-lg p-2 text-sm">
                            How can I assist you with your schedule today?
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Type your request..."
                        className=" border-gray-600 flex h-10 rounded-md border border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-transparent text-sm w-full focus:outline-none focus:ring-0"
                    />
                    <Button size="sm" sx={{
                        backgroundColor: '#61dafb',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#41bbdd'
                        }
                    }}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
};
export default AiAssistant;