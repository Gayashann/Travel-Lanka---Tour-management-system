import Event from "../model/Event.js";
import sendMail from "../utils/sendMail.js";

export const getEvents = async (req, res) => {
  try {
    const events = req.query.search
      ? await Event.find({
          eventName: { $regex: req.query.search, $options: "i" },
        })
      : await Event.find();

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = req.body;

    const newEvent = new Event(event);

    await newEvent.save();

    res.status(201).json({ event: newEvent });

    await sendMail({
      to: req.body.createdBy,
      subject: "Event Created",
      text: `${req.body.eventName} event has been created successfully. Event Date: ${req.body.eventDate} Event Id : ${newEvent._id}`,
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = req.body;

    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    existingEvent.eventName = event.eventName || existingEvent.eventName;
    existingEvent.eventDate = event.eventDate || existingEvent.eventDate;
    existingEvent.district = event.district || existingEvent.district;
    existingEvent.description = event.description || existingEvent.description;
    existingEvent.image = event.image || existingEvent.image;

    const updatedEvent = await existingEvent.save();

    res.status(200).json({ event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
