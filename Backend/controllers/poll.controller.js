import Poll from "../Model/poll.model.js";

// host to create the poll
export const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || typeof question !== "string" || question.trim().length === 0) {
            return res.status(400).json({ success: false, error: "Question is required and must be a string." });
        }

        if (!options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ success: false, error: "At least two options are required." });
        }

        for (const option of options) {
            if (!option.text || typeof option.text !== "string" || option.text.trim().length === 0) {
                return res.status(400).json({ success: false, error: "All options must have non-empty text." });
            }
        }

        const poll = await Poll.create({ question, options, host: req.user.id });
        res.status(201).json({ success: true, poll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// to edit in poll by host
export const editPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        const pollId = req.params.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ success: false, error: "Poll not found." });
        }

        if (poll.host.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Unauthorized: You can only edit your own polls." });
        }

        if (question && (typeof question !== "string" || question.trim().length === 0)) {
            return res.status(400).json({ success: false, error: "Question must be a non-empty string." });
        }

        if (options) {
            if (!Array.isArray(options) || options.length < 2) {
                return res.status(400).json({ success: false, error: "At least two options are required." });
            }
            for (const option of options) {
                if (!option.text || typeof option.text !== "string" || option.text.trim().length === 0) {
                    return res.status(400).json({ success: false, error: "All options must have non-empty text." });
                }
            }
        }

        const updatedPoll = await Poll.findByIdAndUpdate(pollId, { question, options }, { new: true });
        res.status(200).json({ success: true, poll: updatedPoll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// to get list of all the polls by Host
export const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ host: req.user.id });
        res.status(200).json({ success: true, polls });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


// to delete the poll by host
export const deletePoll = async (req, res) => {
    try {
        const pollId = req.params.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ success: false, error: "Poll not found." });
        }

        if (poll.host.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Unauthorized: You can only delete your own polls." });
        }

        await Poll.findByIdAndDelete(pollId);
        res.status(200).json({ success: true, message: "Poll deleted successfully", poll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Public: to get details of a specific poll
export const getPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ success: false, error: "Poll not found." });
        }
        res.status(200).json({ success: true, poll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Public: to vote in a poll
export const vote = async (req, res) => {
    try {
        const { optionId, voterId } = req.body;
        const pollId = req.params.id;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ success: false, error: "Poll not found." });
        }

        // Fairness check 1: Check if IP has already voted
        const hasVotedIP = poll.voters.some(v => v.ip === ip);
        // Fairness check 2: Check if voterId (from localStorage) has already voted
        const hasVotedId = poll.voters.some(v => v.deviceId === voterId);

        if (hasVotedIP || hasVotedId) {
            return res.status(403).json({ success: false, error: "You have already voted in this poll." });
        }

        // Find the option and increment votes
        const option = poll.options.id(optionId);
        if (!option) {
            return res.status(400).json({ success: false, error: "Invalid option selected." });
        }

        option.votes += 1;
        poll.voters.push({ ip, deviceId: voterId });
        await poll.save();

        // Emit real-time update using socket.io
        if (req.io) {
            req.io.emit(`pollUpdate:${pollId}`, poll);
        }

        res.status(200).json({ success: true, poll });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
