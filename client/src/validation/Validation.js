import * as Yup from 'yup';

export const LoginvalidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

export const RegistrationvalidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  address: Yup.string().required('Address is required'),
  dob: Yup.date().required('Date of Birth is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const addNewListingSchema = Yup.object().shape({
  block: Yup.string().required('Block number is required'),
  lotNumber: Yup.string().required('Lot number is required'),
  dimension: Yup.string().required('Dimension is required'),
  price: Yup.string().required('Price is required'),
  term: Yup.string().required('Term is required'),
  downpayment: Yup.string().required('Downpayment is required'),
  status: Yup.string().required('Status is required'),
  images: Yup.array().required('Images are required'),
});