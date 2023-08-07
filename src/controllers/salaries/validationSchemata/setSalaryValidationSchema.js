import * as Yup from "yup";

/*----------------------------------------------------
SET SALARY FOR AN EMPLOYEE
-----------------------------------------------------*/
export const setSalaryValidationSchema = Yup.object({
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

  salary_period: Yup.string()
    .required("Salary period is required.")
    .min(7, "Salary period's length must be 7 characters (format: YYYY-MM).")
    .max(7, "Salary period's length must be 7 characters (format: YYYY-MM)."),

  base_amount: Yup.number().required("Base amount of salary is required."),
});
