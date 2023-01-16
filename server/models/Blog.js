const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    required: false,
  },
  status: {
    type: String,
    default: "unmuted"
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
