const router = require("express").Router();
const { authorize } = require("../middlewere/auth.mw");
const { Card, validateCard } = require("../model/cards.model");
const chalk = require("chalk")

router.get("/my-cards", authorize, async (req, res) => {
  //get my cards
  const card = await Card.find({ user_id: req.user._id });
  if (!card) {
    console.log(chalk.red("No cards to show"));
    res.send("No cards to show");
    return;
  }
  console.log(chalk.green(card));
  res.send(card);
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const found = await Card.findOne({ _id: req.params.id }).catch((err) =>
    console.log(err.message)
  );
  if (!found) {
    console.log(chalk.bgRed("Card not found"));
    res.status(400).send("Card not found");
    return;
  }
  console.log(chalk.green(found));
  res.send(found);
  return;
});

router.get("/", async (req, res) => {
  const allCards = await Card.find();
  console.log(chalk.green(allCards));
  res.json(allCards);
});

router.post("/", authorize, async (req, res) => {
  //validate user input
  if (!req.user.isBusiness) {
    console.log(chalk.bgRed("Must be a business user to post a card"));
    res.status(400).send("Must be a business user to post a card");
    return;
  }
  const { error } = validateCard(req.body);
  if (error) {
    console.log(chalk.bgRed(error.details[0].message));
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system
  const card = await Card.findOne({ email: req.body.email });
  if (card) {
    console.log(chalk.bgRed("This email is already used in a card"));
    res.status(400).send("this email is already used in a card");
    return;
  }
  if (req.user.isBusiness) {
    // process
    const newCard = new Card({
      ...req.body,
      address: {
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        zip: req.body.zip,
      },
      image: {
        url:
          req.body.url ??
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        alt: req.body.alt ?? "Some Card Image"
      },
      user_id: req.user._id,
    });
    console.log(chalk.green(newCard));
    await newCard.save();
    //response
    res.json(newCard);
    return;
  }
  res.status(400).send("Must be a business user to post a card");
});

router.put("/:id", authorize, async (req, res) => {
  //validate input user
  const { error } = validateCard(req.body);
  if (error) {
    console.log(chalk.bgRed(error.details[0].message));
    res.status(400).send(error.details[0].message);
    return;
  }

  //validate system
  const updateCard = {
    ...req.body,
    ...(req.body.country && { "address.country": req.body.country }),
    ...(req.body.state && { "address.state": req.body.state }),
    ...(req.body.city && { "address.city": req.body.city }),
    ...(req.body.street && { "address.street": req.body.street }),
    ...(req.body.houseNumber && {
      "address.houseNumber": req.body.houseNumber,
    }),
    ...(req.body.zip && { "address.zip": req.body.zip }),
    ...(req.body.url && { "image.url": req.body.url }),
    ...(req.body.alt && { "image.alt": req.body.alt }),

  };

  //process
  const card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    updateCard,
    {
      new: true,
    }
  ).catch((err) => console.log(err));
  if (!card) {
    console.log(chalk.bgRed("You cannot dit another cards, only yours"));
    res.status(400).send("You cannot edit another cards, only yours");
    return;
  }

  //response
  console.log(chalk.green(card));
  res.json(card);
});


router.patch("/:id", authorize, async (req, res) => {
  const card = await Card.findOne({ _id: req.params.id }).catch((err) =>
    console.log(chalk.bgRed(err.message))
  );
  if (!card) {
    console.log(chalk.bgRed("Card not found"));
    res.status(400).send("Card not found");
    return;
  }
  if (card.likes.includes(req.user._id)) {
    const index = card.likes.indexOf(req.user._id);
    card.likes.splice(index, 1);
    await card.save()
    console.log(chalk.green(card));
    res.send(card);
    return card;
  }
  const update = {
    likes: [...card.likes, req.user._id],
  };
  const cardLiked = await Card.findOneAndUpdate({ _id: req.params.id }, update, {
    new: true,
  }).catch((err) => console.log(chalk.bgRed(err.message)));
  console.log(chalk.green(cardLiked));
  res.send(cardLiked);
  return card;

  //like a card
});

router.delete("/:id", authorize , async (req, res) => {
  if (req.user.isAdmin) {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
    }).catch((err) => console.log(chalk.bgRed(err.message)));
    res.send(card);
    return card;
  }
  const card = await Card.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  }).catch((err) => console.log(chalk.bgRed(err.message)));
  if (!card) {
    console.log(chalk.bgRed("Does not exist aard with this ID"));
    res.status(400).send("Does not exist a card with this ID");
    return;
  }
  console.log(chalk.green(card));
  res.json(card);
});

module.exports = router;
