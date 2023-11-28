import moment from 'moment';
import Swal from 'sweetalert2';

//Phone number with 10 digits
export function validationPhoneNumber(value) {
  const phoneNumberRegex = /^\d{10}$/;
  return phoneNumberRegex.test(value);
}

// Only letters and spaces
export function validationLettersOnly(value) {
  const lettersOnlyRegex = /^[a-zA-Z\s]*$/;
  return lettersOnlyRegex.test(value);
}

// Letters, numbers, and spaces
export function validationLettersAndNumbers(value) {
  const lettersAndNumbersRegex = /^[a-zA-Z0-9\s]*$/;
  return lettersAndNumbersRegex.test(value);
}

// Letters, spaces, and periods
export function validationLettersWithPeriod(value) {
  const lettersWithPeriodRegex = /^[a-zA-Z\s.]*$/;
  return lettersWithPeriodRegex.test(value);
}

// Letters, spaces, periods, and commas
export function validationLettersWithPeriodAndComma(value) {
  const lettersWithPeriodAndCommaRegex = /^[a-zA-Z\s.,]*$/;
  return lettersWithPeriodAndCommaRegex.test(value);
}

// Letters with special characters
export function validationLettersWithSpecialChars(value) {
  const lettersWithSpecialCharsRegex =
    /^[a-zA-Z\s.,!@#$%^&*()_+{}[\]:;<=>?~|/`'"-]*$/;
  return lettersWithSpecialCharsRegex.test(value);
}

export function validationNumbersWithHyphenAndComma(value) {
  const numbersWithHyphenAndCommaRegex = /^[0-9,\s-]*$/;
  return numbersWithHyphenAndCommaRegex.test(value);
}


//Date of validation only adults and no before date
export function validationDateOfBirth(dateOfBirth) {
  const inputDate = moment(dateOfBirth, 'YYYY-MM-DD', true); // Parse the input date

  if (!inputDate.isValid()) {
    return 'Invalid date format';
  }

  const currentDate = moment();
  const minBirthDate = moment().subtract(18, 'years');

  if (inputDate.isAfter(currentDate) || inputDate.isAfter(minBirthDate)) {
    return false;
  }

  return true; // Date is valid
}


export function validationApplicationDeadline(deadline) {
  const inputDate = moment(deadline, 'YYYY-MM-DD', true); 
  console.log(inputDate)

  const currentDate = moment();
  const maxDeadline = moment().add(3, 'months'); 
  console.log("currentDate", currentDate)
  console.log("maxDeadline", maxDeadline)
  console.log(!inputDate.isValid() || inputDate.isBefore(currentDate) || inputDate.isAfter(maxDeadline))

  if (!inputDate.isValid() || inputDate.isBefore(currentDate) || inputDate.isAfter(maxDeadline)) {
    console.log("Invalid deadline:", inputDate.format('YYYY-MM-DD'));
    console.log("Current date:", currentDate.format('YYYY-MM-DD'));
    console.log("Max deadline:", maxDeadline.format('YYYY-MM-DD'));
    return false; 
  }

  return true; 
}

export const showSwalError = (title, text, icon) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    position: 'top',
    allowOutsideClick: true,
    customClass: {
      popup: 'swal2-medium',
    },
  });
};

