import * as Yup from "yup";

/*----------------------------------------------------
SET SHIFT (TO AN EMPLOYEE) VALIDATION SCHEMA
-----------------------------------------------------*/
export const setShiftValidationSchema = Yup.object({
  employee_email: Yup.string()
    .required("Employee's email is required.")
    .email("Employee's email must be valid.")
    .matches(
      /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,
      "Employee's email domain must be included."
    )
    .min(
      10,
      "Employee's email address' length should be between 10 to 45 characters."
    )
    .max(
      45,
      "Employee's email address' length should be between 10 to 45 characters."
    ),

  scheduled_date: Yup.string()
    .required("Scheduled date is required.")
    .min(
      10,
      "Scheduled date's length must be 10 characters (format: YYYY-MM-DD)."
    )
    .max(
      10,
      "Scheduled date's length must be 10 characters (format: YYYY-MM-DD)."
    ),

  shift_id: Yup.number().required("Shift ID is required."),

  salary_deduction: Yup.number().required(
    "Initial salary amount for this shift is required."
  ),
});