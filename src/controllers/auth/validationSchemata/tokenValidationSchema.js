import * as Yup from "yup";

/*----------------------------------------------------
TOKEN VALIDATION SCHEMA
current configuration for OTP token's length is 6 chars
-----------------------------------------------------*/
export const tokenValidationSchema = Yup.object({
  token: Yup.string()
    .required("OTP token is required.")
    .min(6, "OTP token's length must be 6 characters.")
    .max(6, "OTP token's length must be 6 characters."),
});
