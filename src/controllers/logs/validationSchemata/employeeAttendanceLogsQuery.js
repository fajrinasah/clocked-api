import * as Yup from "yup";

/*----------------------------------------------------
EMPLOYEE ATTENDANCE LOGS QUERY
-----------------------------------------------------*/
export const employeeAttendanceLogsQuery = Yup.object({
  period: Yup.string()
    .required("Scheduled date is required.")
    .min(7, "Scheduled date's length must be 7 characters (format: YYYY-MM).")
    .max(7, "Scheduled date's length must be 7 characters (format: YYYY-MM)."),

  sortingOption: Yup.string()
    .required("Sorting option is required.")
    .min(4, "Sorting option's length must be between 4 to 9 characters.")
    .max(9, "Sorting option's length must be between 4 to 9 characters."),

  sortingMethod: Yup.string()
    .required("Sorting method is required.")
    .min(3, "Sorting method's length must be between 3 to 4 characters.")
    .max(4, "Sorting method's length must be between 3 to 4 characters."),

  page: Yup.number()
    .required("Page is required.")
    .min(1, "Page's value length must be between 1 to 2 digits.")
    .max(2, "Page's value length must be between 1 to 2 digits."),
});
