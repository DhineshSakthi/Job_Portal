const moment = require('moment');

const isValidEmployerName = (employerName) => {
  const regex = /^[A-Za-z.-\s]+$/;
  return regex.test(employerName);
};

const isValidJobTitle = (jobTitle) => {
  const regex = /^[A-Za-z.-\s]+$/;
  return regex.test(jobTitle);
};

const isValidJobDescription = (jobDescription) => {
  const lettersWithSpecialCharsRegex =
    /^[a-zA-Z\s.,!@#$%^&*()_+{}[\]:;<=>?~|/`'"-]*$/;
  return lettersWithSpecialCharsRegex.test(jobDescription);
};

const isValidSalaryRange = (salaryRange) => {
  const numbersWithHyphenAndCommaRegex = /^[0-9,\s-]*$/;
  return numbersWithHyphenAndCommaRegex.test(salaryRange);
};

const isValidApplicationDeadline = (applicationDeadline) => {
  const inputDate = moment(applicationDeadline, "YYYY-MM-DD", true);
  console.log(inputDate);

  const currentDate = moment();
  const maxDeadline = moment().add(3, "months");
  console.log("currentDate", currentDate);
  console.log("maxDeadline", maxDeadline);
  console.log(
    !inputDate.isValid() ||
      inputDate.isBefore(currentDate) ||
      inputDate.isAfter(maxDeadline)
  );

  if (
    !inputDate.isValid() ||
    inputDate.isBefore(currentDate) ||
    inputDate.isAfter(maxDeadline)
  ) {
    console.log("Invalid deadline:", inputDate.format("YYYY-MM-DD"));
    console.log("Current date:", currentDate.format("YYYY-MM-DD"));
    console.log("Max deadline:", maxDeadline.format("YYYY-MM-DD"));
    return false;
  }

  return true;
};

module.exports = {
  isValidEmployerName,
  isValidJobTitle,
  isValidJobDescription,
  isValidSalaryRange,
  isValidApplicationDeadline,
};
