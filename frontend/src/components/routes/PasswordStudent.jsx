import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authenticator";

const BASE_URL = "https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/students/password";

function PasswordStudent() {
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const [apiErrors, setApiErrors] = useState(null);
  const useAuth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (ev) => {
    setFormData((oldFormData) => ({
      ...oldFormData,
      [ev.target.name]: ev.target.value,
    }));
    setErr({});
    setMessage(null);
    setApiErrors(null);
  };

  async function updatePassword(info) {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        body: info, // Automatically sets multipart/form-data
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Success! Password updated!");
        setFormData({ username: "", password: "" });
        setErr({});
        setApiErrors(null);
      } else {
        const APIerrors = data["Error"] || {};
        if (typeof APIerrors === "string") {
          // Handle APIerrors as a string
          setApiErrors(APIerrors);
        } else if (typeof APIerrors === "object") {
          // Combine object values into a single string
          setApiErrors(Object.values(APIerrors).join(". "));
        }
        setErr({
          username: APIerrors["username"] || "",
          password: APIerrors["password"] || "",
        });
      }
    } catch (error) {
      console.error("Error connecting to the API:", error);
      setErr({ global: "An unexpected error occurred. Please try again later." });
    }
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errors = validate();

    if (!Object.keys(errors).length) {
      const newFormData = new FormData();
      newFormData.append("username", formData.username);
      newFormData.append("password", formData.password);

      updatePassword(newFormData);
    } else {
      setErr(errors);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.username) {
      errors.username = "Username is required.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    }
    return errors;
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-[url('./assets/classroom.jpeg')] bg-cover bg-center bg-no-repeat text-white">
        <div className="bg-[#252323] rounded-3xl shadow-lg p-3 w-80 min-h-72 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-10 mt-4 self-center">Forgot Password?</h1>
          <p className="text-center mb-4">Enter your student username and new password.</p>
          <fieldset className="flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-y-5">
              <div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border-4 border-solid border-[#ff8800] rounded-full p-2 w-64 text-black"
                />
                {err.username && (
                  <span style={{ color: "red" }}>{err.username}</span>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-4 border-solid border-[#ff8800] rounded-full p-2 w-64 text-black"
                />
                {err.password && (
                  <span style={{ color: "red" }}>{err.password}</span>
                )}
              </div>

              {apiErrors && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {apiErrors}
                </div>
              )}

              {message && (
                <div style={{ color: "green", marginTop: "10px" }}>
                  {message}
                </div>
              )}

              {err.global && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {err.global}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="bg-[#ff8800] hover:scale-105 hover:shadow-md hover:shadow-[#858483] text-white font-bold py-2 px-4 rounded-full mb-5"
                >
                  Submit
                </button>
              </div>
            </form>
            <div className="flex flex-col items-center gap-y-2 text-sm">
              <div className="underline hover:text-blue-400">
                  <Link to="/loginTeacher">Teacher? Login here!</Link>
                </div>
                <div className="underline hover:text-blue-400">
                  <Link to="/login">Student? Login here!</Link>
                </div>
                <div className="underline hover:text-blue-400">
                  <Link to="/loginAdmin">Admin? Login here!</Link>
                </div>
              </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}

export default PasswordStudent;
