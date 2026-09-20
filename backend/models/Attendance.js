const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    attended: {
      type: Number,
      default: 0,
    },

    totalClasses: {
      type: Number,
      default: 0,
    },

    minimumTarget: {
      type: Number,
      default: 75,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Attendance", attendanceSchema);
