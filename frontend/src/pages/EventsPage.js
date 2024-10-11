import Search from "../components/ui/Search";
import Calendar from "../components/ui/calendar";
import AiAssistant from '../components/ai/AiAssistant';
import EventList from "../components/event/EventList";

const EventsPage = () => {
    return (
        <main className="flex-1 overflow-y-auto">
            <Search/>
            <Calendar/>
            <AiAssistant/>
            <EventList/>
        </main>
    )
};
export default EventsPage;