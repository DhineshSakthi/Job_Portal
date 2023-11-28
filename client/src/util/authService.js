import Axios from "axios";
import { toast } from "react-toastify";

export const handleLogin = async (formData, navigate, setCommonError) => {
  try {
    const response = await Axios.post("login", {
      username: formData.username,
      password: formData.password,
    });
    localStorage.setItem("object_id", JSON.stringify(response.data._id));

    if (response.status === 200) {
      console.log("Login successful");
      console.log(response.data.token);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      console.log(response.data.role);

      if (response.data.role === "User") {
        const existingResponse = await Axios.get("profile", {});

        let userExists = false;

        for (const profile of existingResponse.data) {
          if (profile === response.data._id) {
            userExists = true;
            break;
          }
        }

        if (userExists) {
          toast.success("Login Successfully", {
            position: "top-right",
          });
          setTimeout(() => {
            navigate("/profile");
          }, 300);
        } else {
          toast.success(
            "Login Successfully. Please Create the profile and go to dashboard",
            {
              position: "top-right",
            }
          );
          setTimeout(() => {
            navigate("/userprofile");
          }, 300);
        }
      } else if (response.data.role === "Admin") {
        toast.success("Login Successfully", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/adminprofile");
        }, 300);
      } else {
      }
    } else {
      setCommonError("An error occurred...");
    }
  } catch (error) {
    if (error.response.status === 401) {
      setCommonError(
        "Wrong username or password. Please enter correct credentials"
      );
    } else {
      console.error("Login error:", error);
      setCommonError("An error occurred. Please try again later.");
    }
  }
};

export const handleGoogleLoginSuccess = async (
  response,
  navigate,
  setCommonError,
  role
) => {
  try {
    const tokenId = response.credential;

    const res = await Axios.post("/login/googlelogin", { tokenId, role });

    if (res.status === 200) {
      console.log("Login successful");
      localStorage.setItem("object_id", JSON.stringify(res.data._id));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      console.log(res.data.role);

      if (res.data.role === "User") {
        // Check if the user has a username and password
        const userResponse = await Axios.get(`/login/${res.data._id}`);

        if (
          userResponse.status === 200 
        ) {
          // User has a username and password
          const existingResponse = await Axios.get("profile", {});

          let userExists = false;

          for (const profile of existingResponse.data) {
            if (profile === res.data._id) {
              userExists = true;
              break;
            }
          }

          if (userExists) {
            toast.success("Login Successfully", {
              position: "top-right",
            });
            setTimeout(() => {
              navigate("/profile");
            }, 300);
          } else {
            toast.success(
              "Login Successfully. Please Create the profile and go to dashboard",
              {
                position: "top-right",
              }
            );
            setTimeout(() => {
              navigate("/userprofile");
            }, 300);
          }
        } else {
          // User does not have a username or password
          toast.error("Please update your username and password", {
            position: "top-right",
          });
          setTimeout(() => {
            navigate("/registerupdate");
          }, 300);
        }
      } else if (res.data.role === "Admin") {
        toast.success("Login Successfully", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/adminprofile");
        }, 300);
      } else {
      }
    } else {
      setCommonError("An error occurred...");
    }
  } catch (error) {
    if (error.response.status === 400) {
      toast.info("Please update your username and password", {
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/registerupdate");
      }, 300);
    } else {
      console.error("Login error:", error);
      setCommonError("An error occurred. Please try again later.");
    }
  }
};
