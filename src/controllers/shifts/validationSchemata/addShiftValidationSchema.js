import * as Yup from "yup";

/*----------------------------------------------------
ADD NEW SHIFT VALIDATION SCHEMA
-----------------------------------------------------*/
export const addShiftValidationSchema = Yup.object({
  name: Yup.string()
    .required("Shift name is required.")
    .min(3, "Shift name's length must be between 3 to 45 characters.")
    .max(45, "Shift name's length must be between 3 to 45 characters."),

  fromTime: Yup.string()
    .required("Shift start time is required.")
    .min(8, "Shift start time's length must be 8 characters (format hh:mm:ss).")
    .max(
      8,
      "Shift start time's length must be 8 characters (format hh:mm:ss)."
    ),

  toTime: Yup.string()
    .required("Shift end time is required.")
    .min(8, "Shift end time's length must be 8 characters (format hh:mm:ss).")
    .max(8, "Shift end time's length must be 8 characters (format hh:mm:ss)."),
});
