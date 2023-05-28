const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ShoesDataModel = require("../models/shoesData");

const useRandom = () => {
  return Math.floor(Math.random() * 20);
};

router.use(express.json());
mongoose.connect(
  "mongodb+srv://sammitbadodekar:sammit123@cluster0.rnwqbdp.mongodb.net/RunAwaySoles?retryWrites=true&w=majority"
);
router.get("/allShoes", (req, res) => {
  ShoesDataModel.find()
    .skip(useRandom())
    .limit(4)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.get("/lt", (req, res) => {
  ShoesDataModel.aggregate([
    {
      $addFields: {
        price: {
          $toInt: "$price",
        },
      },
    },
    {
      $match: {
        price: { $lt: 100 },
      },
    },
  ])
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
router.get("/specific/:id", (req, res) => {
  const whichShoesToFetch = req.params.id;
  ShoesDataModel.find({ _id: `${whichShoesToFetch}` })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
router.get("/all/:id", (req, res) => {
  const whichShoesToFetch = req.params.id;
  ShoesDataModel.find({ series: `${whichShoesToFetch}` })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.get("/:id", (req, res) => {
  const whichShoesToFetch = req.params.id;
  ShoesDataModel.find({ series: `${whichShoesToFetch}` })
    .limit(4)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
module.exports = router;
