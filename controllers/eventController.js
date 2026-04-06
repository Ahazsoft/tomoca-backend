const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'active' });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
