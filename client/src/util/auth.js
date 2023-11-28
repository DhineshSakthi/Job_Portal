export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    window.location.href = "/auth";
    return null;
  }
  return token;
}

// import store from '../store';

// export function getAuthToken() {
//   console.log(store.getState().auth.token)
//   return store.getState().auth.token;
// }

// export function tokenLoader() {
//   return getAuthToken();
// }

// export function checkAuthLoader() {
//   const token = getAuthToken();

//   if (!token) {
//     window.location.href = '/auth';
//     return null;
//   }
//   return token;
// }

