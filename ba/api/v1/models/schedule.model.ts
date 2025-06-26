import { Schema, model } from "mongoose";

const daysEnum = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

const ScheduleSchema = new Schema(
  {
    doctor_id: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    day_of_week: {
      type: String,
      enum: daysEnum,
      required: true,
    },
    start_time: String,
    end_time: String,
  },
  { timestamps: true },
);

const Schedule = model("Schedule", ScheduleSchema, "schedule");

export default Schedule;
