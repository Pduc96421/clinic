import { Schema, model } from "mongoose";

const ScheduleSchema = new Schema({
  doctor_id: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  day_of_week: {
    type: String,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true,
  },
  start_time: String,
  end_time: String,
});

const Schedule = model("Schedule", ScheduleSchema, 'schedule');

export default Schedule;
