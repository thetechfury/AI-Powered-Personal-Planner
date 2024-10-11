const EventList = () => {
    return (
        <div className="p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <div>
                            <p className="font-medium">Team Meeting</p>
                            <p className="text-xs text-gray-400">10:00 AM - 11:00 AM</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div>
                            <p className="font-medium">Project Deadline</p>
                            <p className="text-xs text-gray-400">2:00 PM</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                        <div>
                            <p className="font-medium">Gym Session</p>
                            <p className="text-xs text-gray-400">6:30 PM - 7:30 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default EventList;