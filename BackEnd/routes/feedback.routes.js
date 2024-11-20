const express = require('express');
 
const Feedback = require("../models/Feedback.model.js") ;
const Reply = require("../models/Reply.model.js");


const router = express.Router();

// Create Feedback (POST /add)
router.route("/add").post(async (req, res) => {
  const { username, ratings, service, message, visibility } = req.body;
  const numRatings = Number(ratings);

  const newFeedback = new Feedback({
    username,
    ratings: numRatings,
    service,
    message,
    visibility, // Include visibility option (public/private)
  });

  try {
    await newFeedback.save();
    res.status(200).json("Feedback created successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Feedbacks (GET /feedbacks)
router.get('/', async (req, res) => {
  const userRole = req.query.role; // Get user role from query parameters
  try {
    let feedbacks;

    // Check user role and fetch feedbacks accordingly
    if (userRole === 'admin') {
      feedbacks = await Feedback.find(); // Admin fetches all feedback
    } else {
      feedbacks = await Feedback.find({ visibility: 'public' }); // Regular user fetches only public feedback
    }

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get Feedback by User (Public + Private) (GET /feedbacks/:username)
router.get('/get/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const feedbacks = await Feedback.find({ username }); // Fetch feedback by username
    res.json(feedbacks); // Shows both public and private feedback for the user
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Feedback by ID (GET /get/:id)
router.get('/get/:id', async (req, res) => {
  let feedbackId = req.params.id;
  console.log("Fetching feedback for ID:", feedbackId); // Log the ID
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (feedback) {
      res.status(200).json(feedback);
    } else {
      res.status(404).json("Feedback not found");
    }
  } catch (err) {
    console.error("Error fetching feedback:", err); // Log the error
    res.status(500).json({ message: err.message });
  }
});


// Update Feedback by Username (PUT /update/:username)
router.route("/update/:username").put(async (req, res) => {
  const username = req.params.username; // Use username from the request params
  const { ratings, service, message, visibility } = req.body; // Extract other fields from the request body

  const updatedFeedback = {
    ratings,
    service,
    message,
    visibility,
  };

  try {
    // Find feedback by username and update it
    const feedback = await Feedback.findOneAndUpdate({ username: username }, updatedFeedback, { new: true });
    if (feedback) {
      res.status(200).json(feedback); // Return the updated feedback
    } else {
      res.status(404).json("Feedback not found for this username");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete Feedback (DELETE /delete/:id)
router.route("/delete/:id").delete(async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (feedback) {
      res.status(200).json("Feedback deleted successfully");
    } else {
      res.status(404).json("Feedback not found");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post('/chatbot', (req, res) => {
  const userMessage = req.body.message.toLowerCase(); // Normalize input

  let botReply = "I'm sorry, I didn't understand that."; // Default reply

  // Check user message and set bot reply accordingly
  if (userMessage.includes("how to send feedback to the system in private")) {
      botReply = "To send feedback in private, please navigate to the feedback section and select 'Private' before submitting.";
  } else if (userMessage.includes("what types of feedback can i submit")) {
      botReply = "You can submit various types of feedback, including suggestions, complaints, and compliments.";
  } else if (userMessage.includes("how long does it take to receive a response")) {
      botReply = "Typically, you can expect a response within 48 hours. However, it may vary based on the volume of requests.";
  } else if (userMessage.includes("can i edit or delete my submitted feedback")) {
      botReply = "Yes, you can edit or delete your submitted feedback through your account settings.";
  } else if (userMessage.includes("how can i get a report about five star ratings")) {
      botReply = "You can request a report about five-star ratings through the feedback section or by contacting support.";
  } else if (userMessage.includes("what is the feedback process")) {
      botReply = "The feedback process involves submitting your comments and ratings, which will be reviewed by our team.";
  } else if (userMessage.includes("can i submit anonymous feedback")) {
      botReply = "Yes, you can submit feedback anonymously by selecting the anonymous option in the feedback form.";
  } else if (userMessage.includes("what if my feedback is not addressed")) {
      botReply = "If your feedback is not addressed within the expected time, please reach out to our support team for assistance.";
  } else if (userMessage.includes("how to view my feedback history")) {
      botReply = "You can view your feedback history by logging into your account and navigating to the feedback section.";
  } else if (userMessage.includes("what happens to my feedback after submission")) {
      botReply = "After submission, your feedback is reviewed by our team and considered for improvements to our services.";
  } else if (userMessage.includes("how can i contact support")) {
      botReply = "You can contact support through the 'Contact Us' section on our website; you can find that in the footer.";
  } else {
      botReply = "I didn't quite catch that. Could you please rephrase your question or ask about feedback submission, types, or our response times?";
  }

  // Send response back to the client
  res.json({ reply: botReply });
});

 

// Create a reply to feedback (POST /reply)
router.post("/reply", async (req, res) => {
  const { username, feedbackId, replyMessage } = req.body;

  try {
      const newReply = new Reply({
          username,
          feedbackId,
          replyMessage,
      });

      await newReply.save();
      res.status(200).json("Reply created successfully");
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get replies for feedback by username (GET /replies/:username)
router.get("/replies/:username", async (req, res) => {
  const { username } = req.params;

  try {
      const feedbacks = await Feedback.find({ username }); // Get feedback by username

      const feedbackIds = feedbacks.map(feedback => feedback._id); // Extract feedback IDs

      const replies = await Reply.find({ feedbackId: { $in: feedbackIds } }); // Get replies for those feedbacks
      res.json(replies);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;
