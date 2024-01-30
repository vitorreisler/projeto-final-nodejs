const router = require("express").Router();
const { User, validateUser, validateLogin } = require("../model/users.model");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { authorize } = require("../middlewere/auth.mw");
const chalk = require("chalk")



router.post("/", async (req, res) => {
  //validate users input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(chalk.bgRed(error.details[0].message));
    return;
  }

  //validate system
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    console.log(chalk.bgRed("User already exist"));
    res.status(400).send("User already exist");
    return;
  }

  //process
  const newUser = new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
    name: {
      first: req.body.first,
      middle: req.body.middle,
      last: req.body.last,
    },
    image: {
      url: req.body.url
        ? req.body.url
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      alt: req.body.alt,
    },
    address: {
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      houseNumber: req.body.houseNumber,
      zip: req.body.zip,
    },
  });
  console.log(chalk.green(newUser));
  await newUser.save();

  //response
  res.json(
    _.pick(newUser, ["_id", "name", "email", "createdAt", "isBusiness"])
  );
});

router.post("/login", async (req, res) => {
  //validate users input
  const { error } = validateLogin(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    console.log(chalk.bgRed(error.details[0].message));
    return;
  }

  //validate stystem
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password");
    console.log(chalk.bgRed("Invalid email or password"));
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Invalid email password");
    console.log(chalk.bgRed("Invalid email or password"));
    return;
  }
  
  //process
  const token = user.generateAuthToken();
  console.log(chalk.bgGreen("You are onLine"));
  res.json({ token });
});

//FEITO
router.get("/:id", authorize, async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .catch((err) => console.log(chalk.bgRed(err.message)));

  if (!user) {
    res.status(400).send("User not found");
    console.log(chalk.bgRed("User not found"));
    return;
  }
  res.send(user);
  console.log(chalk.green(user));
  return;
});
//FEITO
router.get("/", authorize, async (req, res) => {
  if(req.user.isAdmin){
    const users = await User.find()
      .select("-password")
      .catch((err) => console.log(chalk.bgRed(err.message)));
    if (!users) {
      res.status(400).send("User not found");
      console.log(chalk.bgRed("User not found"));
      return;
    }

    res.json(users);
    console.log(chalk.green(users));
    return
  }
  console.log(chalk.bgRed("Only admin can access"));
  res.status(400).send("Only admin can access")

});

router.put("/:id", authorize, async (req, res) => {
  //validate input user
  const { error } = validateUser(req.body);
  if (error) {
    console.log(chalk.bgRed(error.details[0].message));
    res.status(400).send(error.details[0].message);
    return;
  }

  //validate system
  const user = await User.findOne({ email: req.body.email }).select(
    "-password"
  );

  if (req.user._id !== req.params.id) {
    console.log(chalk.bgRed("You cannot edit another user"));
    res.status(400).send("You cannot edit another user");
    return;
  }
  if (user) {
    console.log(chalk.bgRed("This email is already in use"));
    res.status(400).send("This email is already in use");
    return;
  }

  //process
  const update = {
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
    ...(req.body.url && { "image.url": req.body.url }),
    ...(req.body.alt && { "image.alt": req.body.alt }),
    ...(req.body.first && { "name.first": req.body.first }),
    ...(req.body.middle && { "name.middle": req.body.middle }),
    ...(req.body.last && { "name.last": req.body.last }),
    ...(req.body.country && { "address.country": req.body.country }),
    ...(req.body.state && { "address.state": req.body.state }),
    ...(req.body.city && { "address.city": req.body.city }),
    ...(req.body.street && { "address.street": req.body.street }),
    ...(req.body.houseNumber && {
      "address.houseNumber": req.body.houseNumber,
    }),
    ...(req.body.zip && { "address.zip": req.body.zip }),
  };
  const userUpdate = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
  }).select("-password");

  //response
  console.log(chalk.green(userUpdate));
  res.send(userUpdate);
});

router.patch("/:id", authorize, async (req, res) => {
  //change for business
  if (req.user.isAdmin) {
    const user = await User.findById({ _id: req.params.id });
    const update = {
      isBusiness: !user.isBusiness,
    };
    const patchedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      update,
      { new: true }
    );
    console.log(chalk.green(patchedUser));
    res.send(patchedUser);
    return;
  }
  const user = await User.findOne({ _id: req.user._id }).catch((err) =>{
    console.log(chalk.bgRed(err));
    res.status(400).send("error")
    return
  }
    
  );
  if (!user) {
    console.log(chalk.bgRed("You cannot change a user thats not own you or User not found "));
    res.status(400).send("You cannot change a user thats not own you or User not found ");
    return;
  }
  console.log(user);
  //validate system
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    { isBusiness: !user.isBusiness },
    { new: true }
  )
    .select("-password")
    .catch((err) => console.log(chalk.bgRed(err.message)));

  console.log(chalk.green(updatedUser));
  //response
  res.json(updatedUser);
});

router.delete("/:id", authorize, async (req, res) => {
  if (req.user.isAdmin) {
    const user = await User.findOneAndDelete({ _id: req.params.id })
      .select("-password")
      .catch((err) => console.log(chalk.bgRed(err.message)));
    res.send(user);
    return;
  }
  const user = await User.findOne({  _id: req.user._id })
    .select("-password")
    .catch((err) => console.log(chalk.bgRed(err.message)));

  if (!user) {
    console.log(chalk.bgRed("User not found"));
    res.status(400).send("User not found");
    return;
  }
  await user.deleteOne({ _id: req.params.id }).select("-password");
  console.log(chalk.green(`This user was delete ${user}`));
  res.send(`This user was deleted ${user}`);
  return user;

  //delete user
});

module.exports = router;
