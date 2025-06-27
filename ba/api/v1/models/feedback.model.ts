import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema(
  {
    appointment_id: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true },
);

const Feedback = model("Feedback", FeedbackSchema, "feedback");

export default Feedback;
