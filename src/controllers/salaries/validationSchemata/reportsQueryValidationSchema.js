import * as Yup from "yup";

/*----------------------------------------------------
PAYROLL REPORTS' QUERY VALIDATION SCHEMA
-----------------------------------------------------*/
export const reportsQueryValidationSchema = Yup.object({
  filter: Yup.string()
    .required("Type of filter is required.")
    .min(4, "Type of filter's length must be between 4 to 5 characters.")
    .max(5, "Type of filter's length must be between 4 to 5 characters."),

  period: Yup.string()
    .required("Salary period is required.")
    .min(
      4,
      "Salary period's length must be between 4 to 7 characters (format: YYYY or YYYY-MM)."
    )
    .max(
      7,
      "Salary period's length must be between 4 to 7 characters (format: YYYY or YYYY-MM)."
    ),

  sortingOption: Yup.string()
    .required("Sorting option is required.")
    .min(4, "Sorting option's length must be between 4 to 5 characters.")
    .max(5, "Sorting option's length must be between 4 to 5 characters."),

  sortingMethod: Yup.string()
    .required("Sorting method is required.")
    .min(3, "Sorting method's length must be between 3 to 4 characters.")
    .max(4, "Sorting method's length must be between 3 to 4 characters."),

  page: Yup.number()
    .required("Page is required.")
    .min(1, "Page's value length must be between 1 to 2 digits.")
    .max(2, "Page's value length must be between 1 to 2 digits."),
});
