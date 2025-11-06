import mongoose from "mongoose";

export const EVENT_STATUS = {
  BUSY: "BUSY",
  SWAPPABLE: "SWAPPABLE",
  SWAP_PENDING: "SWAP_PENDING",
};

const eventSchema = new mongoose.Schema(
  {
    owner:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title:     { type: String, required: true, maxlength: 140 },
    startTime: { type: Date, required: true },
    endTime:   { type: Date, required: true },
    status:    { type: String, enum: Object.values(EVENT_STATUS), default: EVENT_STATUS.BUSY }
  },
  { timestamps: true }
);

eventSchema.pre("validate", function (next) {
  if (this.endTime <= this.startTime) return next(new Error("endTime must be after startTime"));
  next();
});

export default mongoose.model("Event", eventSchema);
