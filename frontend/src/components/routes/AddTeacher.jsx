import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Authenticator";
import NavbarAdmin from "../NavbarAdmin";

export default function AddTeacher() {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    image: "",
    subject: "None", // Default value for subject
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const { APIKey } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};

    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (
      !formData.email ||
      !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!formData.image) {
      newErrors.image = "Please upload an image.";
    }

    if (formData.subject === "None") {
      newErrors.subject = "Please select a subject.";
    }

    return newErrors;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const encodedData = new FormData();
    encodedData.append("username", formData.username);
    encodedData.append("name", formData.name);
    encodedData.append("email", formData.email);
    encodedData.append("password", formData.password);
    encodedData.append("image", formData.image);
    encodedData.append("subject", formData.subject);

    try {
      const response = await fetch(
        `https://loki.trentu.ca/~vedarthselat/3430/student_teacher/api/teachers/entries`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": APIKey,
          },
          body: encodedData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.Error);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage("Success! Teacher Added");
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        image: "",
        subject: "None",
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
      setMessage("Failed to add teacher");
    }
  };

  const handleChange = (ev) => {
    const { name, value, files } = ev.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value || "",
    }));
    setErrors({});
    setMessage(null);
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <NavbarAdmin />
      <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md">
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Teacher Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            <div>
              <label htmlFor="image" className="font-bold mr-2">Select image:</label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
            </div>
            <div>
              <label htmlFor="subject-select" className="font-bold mr-2">Subject:</label>
              <select
                id="subject-select"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="None">None</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
                <option value="biology">Biology</option>
                <option value="computer science">Computer Science</option>
              </select>
              {errors.subject && <span className="text-red-500 text-sm">{errors.subject}</span>}
            </div>
          </div>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
