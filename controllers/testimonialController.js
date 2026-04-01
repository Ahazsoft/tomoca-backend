const Testimonial = require('../models/Testimonial');

exports.getAllTestimonials = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
