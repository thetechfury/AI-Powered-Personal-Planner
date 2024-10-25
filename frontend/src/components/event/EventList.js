import React, {useEffect, useRef, useState} from 'react';
import TaskHistoryApi from '../api/TaskHistoryApi'; // Adjust the import path

const EventList = () => {
    const {taskHistory, loading, error, loadMoreMessages} = TaskHistoryApi();
    const [events, setEvents] = useState([]);
    const containerRef = useRef(null); // Ref for the scrollable container

    useEffect(() => {
        if (taskHistory) {
            setEvents(taskHistory); // Directly set the task history results
        }
    }, [taskHistory]);


    const formatTimeWithAmPm = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        let hoursInt = parseInt(hours);
        const period = hoursInt >= 12 ? 'PM' : 'AM';
        if (hoursInt > 12) hoursInt -= 12;
        if (hoursInt === 0) hoursInt = 12;
        return `${hoursInt}:${minutes} ${period}`;
    };

    // Function to handle scroll event
    const handleScroll = () => {
        if (!containerRef.current) return;

        const {scrollTop, scrollHeight, clientHeight} = containerRef.current;

        // Load more messages when scrolled to the bottom
        if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
            loadMoreMessages(); // Trigger the function to load more messages
        }
    };

    useEffect(() => {
        const container = containerRef.current;

        if (container) {
            container.addEventListener('scroll', handleScroll); // Attach scroll event
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll); // Cleanup event listener
            }
        };
    }, [loading]); // Make sure this effect runs again if `loading` changes

    return (
        <div className="p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4 h-[173px] overflow-y-auto" ref={containerRef}>
                <h3 className="text-lg font-semibold mb-3">Task History</h3>
                {loading && events.length === 0 ? (
                    <p className="text-gray-400">Loading...</p>
                ) : events.length === 0 ? (
                    <p className="text-gray-400">No events found.</p>
                ) : (
                    <div className="space-y-3">
                        {events.map((event, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{backgroundColor: event.tag?.color}}
                                ></div>
                                <div>
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-xs text-gray-400">
                                        {formatTimeWithAmPm(event.start_time)} -
                                        {formatTimeWithAmPm(event.end_time)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {loading && <p className="text-gray-400">Loading more...</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;
