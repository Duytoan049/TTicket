const theaterModel = require("../model/theater.model");
const jsend = require("jsend");

const TheaterController = {
  getAllTheaters: async (req, res) => {
    try {
      const { theaters } = await theaterModel.getAllTheaters();
      return res.json(jsend.success({ theaters }));
    } catch (error) {
      console.log(error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  // Các phương thức khác...
};

module.exports = TheaterController;
