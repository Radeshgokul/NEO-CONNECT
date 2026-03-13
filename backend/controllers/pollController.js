const Poll = require('../models/Poll');

// @desc    Create a poll
// @route   POST /api/polls
// @access  Secretariat
const createPoll = async (req, res) => {
  const { question, options } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: 'Provide a question and at least two options' });
  }

  const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));

  const newPoll = await Poll.create({
    question,
    options: formattedOptions,
    createdBy: req.user._id,
  });

  res.status(201).json(newPoll);
};

// @desc    Get all active polls
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
  const polls = await Poll.find({}).sort({ createdAt: -1 });
  res.json(polls);
};

// @desc    Vote in a poll
// @route   POST /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
  const { optionId } = req.body;
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    return res.status(404).json({ message: 'Poll not found' });
  }

  // Check if user already voted
  if (poll.voters.includes(req.user._id)) {
    return res.status(400).json({ message: 'You have already voted on this poll' });
  }

  // Find the option
  const option = poll.options.id(optionId);
  if (!option) {
    return res.status(404).json({ message: 'Option not found' });
  }

  option.votes += 1;
  poll.voters.push(req.user._id);

  const updatedPoll = await poll.save();
  res.json(updatedPoll);
};

module.exports = { createPoll, getPolls, votePoll };
