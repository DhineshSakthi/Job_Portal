import Axios from "axios";

export function fetchSkills(setPredefinedSkills) {
  Axios.get("/skills")
    .then((response) => {
      setPredefinedSkills(response.data);
    })
    .catch((error) => {
      console.error("Error fetching skills:", error);
    });
}

export function fetchSchoolFields(setPredefinedField) {
  Axios.get("/fields/schoolFields")
    .then((response) => {
      setPredefinedField(response.data);
    })
    .catch((error) => {
      console.error("Error fetching field:", error);
    });
}

export function fetchCollegeFields(setPredefinedCfield) {
  Axios.get("/fields/collegeFields")
    .then((response) => {
      setPredefinedCfield(response.data);
    })
    .catch((error) => {
      console.error("Error fetching cfields:", error);
    });
}

export function fetchCollegeDegree(setPredefinedDegree) {
  Axios.get("/fields/collegeDegrees")
    .then((response) => {
      setPredefinedDegree(response.data);
    })
    .catch((error) => {
      console.error("Error fetching degree:", error);
    });
}

// const apiKey = "bWlrVHNFU3hVNFE5TERFUWcxbGtyVHBqSDI2OHp2d3M1SjNlbGVSNg==";

// //Function to fetch countries
// export const fetchCountries = async (setCountryOptions) => {
//   try {
//     const response = await Axios.get(
//       "https://api.countrystatecity.in/v1/countries",
//       {
//         headers: {
//           "X-CSCAPI-KEY": apiKey,
//         },
//       }
//     );

//     if (response.status === 200) {
//       const data = response.data;
//       setCountryOptions(data);
//     } else {
//       console.error("Request failed with status:", response.status);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// // Function to fetch states for the selected country
// export const fetchStates = async (countryCode, setStateOptions) => {
//   try {
//     console.log(countryCode)
//     const response = await Axios.get(
//       `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
//       {
//         headers: {
//           "X-CSCAPI-KEY": apiKey,
//         },
//       }
//     );

//     if (response.status === 200) {
//       const data = response.data;
//       setStateOptions(data)
//     } else {
//       console.error("Request failed with status:", response.status);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }}

const apiKey = "bWlrVHNFU3hVNFE5TERFUWcxbGtyVHBqSDI2OHp2d3M1SjNlbGVSNg==";

//Function to fetch states
export const fetchStates = async (setStatesOptions) => {
  try {
    const response = await Axios.get(
      "https://api.countrystatecity.in/v1/countries/IN/states",
      {
        headers: {
          "X-CSCAPI-KEY": apiKey,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      setStatesOptions(data);
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Function to fetch states for the selected country
export const fetchCities = async (stateCode, setCityOptions) => {
  try {
    console.log(stateCode)
    const response = await Axios.get(
      `https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY": apiKey,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log(data)
      setCityOptions(data)
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }}