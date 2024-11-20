import React, { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse authUser from localStorage", error);
      }
    }
    setLoading(false);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    // console.log(editedName, editedEmail);
    if (!editedName) {
      toast.error("Please enter a new name");
    }

    if (!editedEmail) {
      toast.error("Please enter a new email");
    }
    // console.log(selectedImage);
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/auth/${user._id}`, {
        username: editedName,
        email: editedEmail,
        profileImage: selectedImage,
      });

      if (res.status !== 200) {
        toast.error("Failed to update profile");
        setLoading(false);
        return;
      }

      const updatedUser = {
        ...user,
        username: editedName,
        email: editedEmail,
        profileImage: selectedImage || user.profileImage,
      };

      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditProfile(false);
      toast.success("Profile updated successfully");
      setLoading(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-5">
      <h1 className="text-2xl font-semibold text-gray-900 text-center">
        Profile
      </h1>
      <div className="mt-4 w-[300px] gap-5 flex flex-col">
        <div className="relative flex justify-center items-center">
          <img
            src={
              selectedImage ||
              user.profileImage ||
              "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png"
            }
            alt="avatar"
            className={
              editProfile
                ? `rounded-full w-32 h-32 object-cover bg-black opacity-50`
                : "rounded-full w-32 h-32 object-cover "
            }
          />
          {editProfile && (
            <>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="imageUpload"
                className="absolute inset-0 flex justify-center items-center  rounded-full cursor-pointer"
              >
                <FaUpload className="text-white text-2xl" />
              </label>
            </>
          )}
        </div>
        <div className="flex items-center">
          <div className="w-1/4">Name:</div>
          {editProfile ? (
            <input
              type="text"
              className="w-3/4 border-b-2 border-gray-900 focus:outline-none focus:border-blue-500"
              defaultValue={user.username}
              onChange={(e) => setEditedName(e.target.value)}
            />
          ) : (
            <div className="w-3/4">{user.username}</div>
          )}
        </div>
        <div className="flex items-center">
          <div className="w-1/4">Email:</div>
          {editProfile ? (
            <input
              type="email"
              className="w-3/4 border-b-2 border-gray-900 focus:outline-none focus:border-blue-500"
              defaultValue={user.email}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
          ) : (
            <div className="w-3/4">{user.email}</div>
          )}
        </div>
        <div className="flex items-center">
          <div className="w-1/4">Role:</div>
          <div className="w-3/4">{user.role}</div>
        </div>
      </div>
      <div>
        <button
          className="
          mt-4
          px-4
          py-2
          bg-blue-500
          text-white
          rounded-md
          hover:bg-blue-600
          focus:outline-none
          focus:ring-2
          focus:ring-blue-600
          focus:ring-opacity-50
        "
          onClick={() => {
            setEditProfile(!editProfile);
            setEditedName(user.username);
            setEditedEmail(user.email);
          }}
        >
          {editProfile ? "Cancel" : "Edit Profile"}
        </button>
        {editProfile && (
          <button
            onClick={() => handleEdit()}
            className="
              mt-4
              ml-5
              px-4
              py-2
              bg-green-500
              text-white
              rounded-md
              hover:bg-green-600
              focus:outline-none
              focus:ring-2
              focus:ring-green-600
              focus:ring-opacity-50
            "
          >
            Save Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
