import * as Yup from "yup";

/*----------------------------------------------------
SAVE EMPLOYEE DATA VALIDATION SCHEMA
-----------------------------------------------------*/
export const saveEmployeeDataValidationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required.")
    .min(3, "Full name's length must be between 3 to 45 characters.")
    .max(45, "Full name's length must be between 3 to 45 characters."),

  dob: Yup.string()
    .required("Date of birth is required.")
    .min(
      10,
      "Date of birth's length must be 10 characters (format: YYYY-MM-DD)."
    )
    .max(
      10,
      "Date of birth's length must be 10 characters (format: YYYY-MM-DD)."
    ),

  password: Yup.string().required("Password is required."),
});
