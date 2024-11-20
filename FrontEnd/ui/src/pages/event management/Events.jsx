import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/events");
        const data = await res.json();

        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);
  console.log("object", events);
  // Group events by district
  const groupByDistrict = (events) => {
    return events.reduce((acc, event) => {
      const district = event.district;
      if (!acc[district]) {
        acc[district] = [];
      }
      acc[district].push(event);
      return acc;
    }, {});
  };

  const groupedEvents = groupByDistrict(events);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[90vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-r from-red-100 to-red-300 w-full h-full">
      <div className="max-w-[1640px] mx-auto">
        {Object.keys(groupedEvents).map((district, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex items-center mt-2">
              <span className="text-lg font-semibold text-gray-600 mr-4">
                {district}
              </span>
              <hr className="flex-grow border-black opacity-50" />
            </div>
            {/* Display all events in a single row */}
            <div className="grid grid-cols-5 gap-4 mt-2 ml-4 ">
              {groupedEvents[district].map((event, idx) => (
                <Link
                  to={`/events/${event._id}`}
                >
                  <div
                    key={idx}
                    className="col-span-1 flex-col m-auto p-5 rounded-lg shadow-lg  duration-50 mb-10 bg-white  "
                  >
                    <div className="w-full flex items-center justify-center">
                      <img
                        src={event.image}
                        alt={event.eventName}
                        className="mb-1 max-h-[200px] max-w-[200px] min-h-[200px] min-w-[200px]"
                      />
                    </div>
                    <hr className="flex-grow border-black opacity-50 w-full" />
                    <div className=" mt-3 ">
                      <div className=" flex text-lg gap-2">
                        <p className=" font-semibold mb-2 text-gray-600 h-full text-sm">
                          Event:
                        </p>
                        <span className="text-sm">{event.eventName}</span>
                      </div>
                      <div className=" flex text-lg gap-2">
                        <p className=" font-semibold mb-2 text-gray-600 h-full text-sm">
                          Date:
                        </p>
                        <span className="text-sm">
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {/* <div className=" flex text-lg gap-2">
                      <p className=" font-semibold mb-2 text-gray-600 h-full">
                        Description:
                      </p>
                      <span>{event.description}</span>
                    </div> */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
