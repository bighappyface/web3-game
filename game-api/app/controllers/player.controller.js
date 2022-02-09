const db = require("../models");
const Player = db.players;

// Create and Save a new Player
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Player
  const player = new Player({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save Player in the database
  player
    .save(player)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player."
      });
    });
};

// Retrieve all Players from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Player.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};

// Find a single Player with an id
exports.findOne = (req, res) => {

  const query = { address: req.params.id };

  Player.findOne(
    query,
    (err, data) => {
      if (err) {
        res
        .status(500)
        .send({ message: "Error retrieving Player with id=" + id });
      }
      else if (!data)
        res.status(404).send({ message: "Not found Player with id " + id });
      else
        res.send(data);
    }
  )
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Player with id " + id });
      else res.send(data);
    })
    .catch(err => {
      
    });
};

// Update a Player by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const query = { address: req.params.id };

  Player.findOneAndUpdate(
    query,
    { $inc : { stars : 1 } },
    { useFindAndModify: false, upsert: true },
    (error, result) => {
      if (error) {
        res.status(500).send({
          message: "Error updating Player with id=" + id
        });
      } else {
        res.send({ message: "Player was updated successfully." })
      }
    }
  );
};

// Delete a Player with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Player.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Player with id=${id}. Maybe Player was not found!`
        });
      } else {
        res.send({
          message: "Player was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Player with id=" + id
      });
    });
};

// Delete all Players from the database.
exports.deleteAll = (req, res) => {
  Player.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Players were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all players."
      });
    });
};

// Find all published Players
exports.findAllPublished = (req, res) => {
  Player.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};
