import * as Yup from "yup";

/*----------------------------------------------------
CLOCKED IN/OUT VALIDATION SCHEMA
-----------------------------------------------------*/
export const clockedInOutValidationSchema = Yup.object({
  scheduledDate: Yup.string()
    .required("Scheduled date is required.")
    .min(
      10,
      "Scheduled date's length must be 10 characters (format: YYYY-MM-DD)."
    )
    .max(
      10,
      "Scheduled date's length must be 10 characters (format: YYYY-MM-DD)."
    ),

  type: Yup.string()
    .required("Type is required.")
    .min(2, "Type's length must be between 2 to 3 characters.")
    .max(3, "Type's length must be between 2 to 3 characters."),

  time: Yup.string()
    .required("Time is required.")
    .min(8, "Time's length must be 8 characters (format hh:mm:ss).")
    .max(8, "Time's length must be 8 characters (format hh:mm:ss)."),
});
