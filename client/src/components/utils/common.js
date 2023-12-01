
export const loginStatus = () => {
  if (localStorage.getItem("loginToken")) {
    return true;
  } else {
    return false;
  }
};


export const upperFirst = (string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const isFieldEmpty = (value) => {
  return value.trim() === "";
};

export const isEmailValid = (email) => {
  // Regex for a basic email validation
  return /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(email);
};

export const isPasswordValid = (password) => {
  // Password length  eight characters, at least one letter, one number and one special character
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
};

export const isNumberValid = (number) => {
  // Regex for a basic number validation (only digits)
  return /^[6789]\d{9}$/.test(number);
};

export const isValidPin = (pin) => {
  // Regex for a basic number validation (only digits)
  return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pin)}

export const stringSortingByChar = (str, char) => {
    if (
      str != null &&
      str != undefined &&
      str != "" &&
      str.length > char &&
      str.length != char
    ) {
      let sorted = str.slice(0, char);
  
      return sorted + "...";
    } else {
      return str;
    }
  };