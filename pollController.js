const Poll = require('./Poll');

const createPollGetController = (req, res, next) => {
  res.render('create');
};
const createPollPostController = async (req, res, next) => {
  let { title, description, options } = req.body;

  options = options.map((option) => {
    return (obj = {
      name: option,
      vote: 0,
    });
  });

  let poll = new Poll({
    title,
    description,
    options,
  });

  try {
    await poll.save();
    res.redirect('/polls');
  } catch (error) {
    console.log(error);
  }
};

const getAllPolls = async (req, res, next) => {
  try {
    let polls = await Poll.find();
    res.render('polls', { polls });
  } catch (error) {
    console.log(error);
  }
};

const viewPollGetController = async (req, res, next) => {
  let { id } = req.params;

  try {
    let poll = await Poll.findById(id);
    let options = [...poll.options];

    let result = [];

    options.forEach((option) => {
      let percentage = (option.vote * 100) / poll.totalVote;
      result.push({
        ...option._doc,
        percentage: percentage ? percentage : 0,
      });
    });

    res.render('viewPoll', { poll, result });
  } catch (error) {
    console.log(error);
  }
};

const viewPollPostController = async (req, res, next) => {
  let { id } = req.params;
  let optionId = req.body.option;

  try {
    let poll = await Poll.findById(id);
    let options = [...poll.options];
    let index = options.findIndex((option) => option.id === optionId);
    options[index].vote++;
    let totalVote = poll.totalVote + 1;

    await Poll.findOneAndUpdate(
      { _id: poll._id },
      { $set: { options, totalVote } }
    );

    res.redirect('/polls/' + id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createPollGetController,
  createPollPostController,
  getAllPolls,
  viewPollGetController,
  viewPollPostController,
};
