const mongoose = require("mongoose");
const { User } = require("../model/users.model");
const { Card } = require("../model/cards.model");
const bcrypt = require("bcrypt")

async function createUser() {
  const user = await User.find();
  if (!user.length) {
    const newUser1 = new User({
      name: { first: "Vitor", middle: "", last: "Reisler" },
      isBusiness: true,
      isAdmin:true,
      phone: 1234567891,
      password: await bcrypt.hash(process.env.ADMIN_PASS, 12),
      email: "vitorAdmin@gmail.com",
      image: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        alt: "Some alt text"
      },
      address: {
        country: "Brazil",
        state: "SP",
        city: "SP",
        street: "vol da pat",
        houseNumber: 123,
      },
    });
    await newUser1.save();

    const newUser2 = new User({
      name: { first: "Vitor", middle: "", last: "Reisler" },
      isBusiness: true,
      phone: 1234567891,
      password: await bcrypt.hash("Aa123456", 12),
      email: "vitorBusiness@gmail.com",
      image: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        alt: "Some alt text"
      },
      address: {
        country: "Brazil",
        state: "SP",
        city: "SP",
        street: "vol da pat",
        houseNumber: 123,
      },
    });
    await newUser2.save();

    const newUser3 = new User({
      name: { first: "Vitor", middle: "", last: "Reisler" },
      isBusiness: false,
      phone: 1234567891,
      password: await bcrypt.hash("Aa123456", 12),
      email: "vitor@gmail.com",
      image: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        alt: "Some alt text"
      },
      address: {
        country: "Brazil",
        state: "SP",
        city: "SP",
        street: "vol da pat",
        houseNumber: 123,
      },
    });
    await newUser3.save();
    return;
  }
  return null;
}

async function createCard() {
  const card = await Card.find();
  if (!card.length) {
    const newCard1 = new Card({
      title: "First Card",
      subtitle: "working",
      description: "A simple Card",
      phone: 1234567891,
      email: "vitor@gmail.com",
      address: {
        country: "Brazil",
        state: "SP",
        city: "SP",
        street: "vol da pat",
        houseNumber: 123,
        zip: 123,
      },
      image:
        "https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    });
    await newCard1.save();

    const newCard2 = new Card({
      title: "second Card",
      subtitle: "working",
      description: "A simple Card",
      phone: 1234567891,
      email: "vitor@gmail.com",
      address: {
        country: "Brazil",
        state: "SP",
        city: "SP",
        street: "vol da pat",
        houseNumber: 123,
        zip: 123,
      },
      image:
        "https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    });
    await newCard2.save();

    const newCard3 = new Card({
      title: "third Card",
      subtitle: "working",
      description: "A simple Card",
      phone: 1234567891,
      email: "vitor@gmail.com",
      address: {
        country: "Brazil",
        state: "SP",
        city: "SP",
        street: "vol da pat",
        houseNumber: 123,
        zip: 123,
      },
      image:
        "https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    });
    await newCard3.save();
    return 
  }
  return null;
}

module.exports = {
  createUser,
  createCard,
};
