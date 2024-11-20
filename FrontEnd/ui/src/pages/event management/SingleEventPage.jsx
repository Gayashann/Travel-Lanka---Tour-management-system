import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleEventPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  console.log(id);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/events/${id}`);
        setEvent(res.data.event);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[90vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center items-center flex-col ">
      <div className="font-bold text-xl text-black">
        <span>{event?.eventName}</span>
      </div>
      <div className="w-[1000px] flex gap-10 mt-5">
        <div>
          <img
            className="w-[500px] h-[400px]"
            src={event?.image}
            alt={event?.eventName}
          />
        </div>
        <div className="flex-1 gap-5 flex flex-col">
          <div>
            <span className="font-bold">Event Date :</span>
            <span className="ml-2">
              {new Date(event?.eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div>
            <span className="font-bold">District :</span>
            <span className="ml-2">
              {event?.district}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Description :</span>
            <span className="">{event?.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleEventPage;
