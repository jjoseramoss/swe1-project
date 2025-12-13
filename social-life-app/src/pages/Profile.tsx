import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import GameNavbar from "../components/common/GameNavbar";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const avatarList = [
  "crab-hat.jpg",
  "punk-cat.jpg",
  "robber.jpg",
  "think-monkey.jpg",
  "wizard-cat.jpg",
  "raccoon-cool.jpg"
];

const Profile = () => {
  const { user, loading /** , getIdToken*/ } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [insta, setInsta] = useState<string>("");

  const navigate = useNavigate();

  // Redirect safely after auth resolves
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [loading, user, navigate]);

  // Initialize local form state when user object becomes available
  useEffect(() => {
    if (!user) return;
    setAvatarUrl(user.avatarUrl || "");
    setAvatarUrl(user.avatarUrl ?? "");
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // redirect handled in useEffect

  const handleChanges = async () => {
    if (!user) return;

    const finalData = filterUpdateData({
      displayName: username || undefined,
      bio: bio || undefined,
      insta: insta || undefined,
      avatarUrl: avatarUrl || undefined,
    });

    try {
      const uid = user.uid;
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, finalData);
      window.location.reload();
    } catch (err) {
      console.log("Failed to update user data: ", err);
    }
  };

  const filterUpdateData = (data: { [x: string]: any }) => {
    const filteredData = {};
    Object.keys(data).forEach((key) => {
      // Only copy the field if its value is not undefined and not null
      if (data[key] !== undefined && data[key] !== null) {
        filteredData[key] = data[key];
      }
    });
    return filteredData;
  };

  return (
    <>
      <GameNavbar />
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl p-6 rounded-3xl">
          <h2 className="text-2xl font-semibold text-center mb-4 border-b">
            Profile
          </h2>
          <p className="text-center text-2xl pb-4 font-bold">
            {user?.displayName}
          </p>
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={`../avatars/${avatarUrl}`}
                  alt="User Profile Picture"
                />
              </div>
            </div>
            {/* Avatar Menu */}
            
            <select
              defaultValue={user?.avatarUrl}
              className="select select-primary "
              onChange={(e) => setAvatarUrl(e.target.value)}
            >
              <option value={avatarUrl} selected disabled>Select an Avatar</option>
              {avatarList.map((avatar, idx) => (
                <option key={idx} value={avatar}>
                  {avatar.replace(".jpg", "").replace("-", " ")}
                </option>
              ))}
            </select>

            {/* <button onClick={handleAvatarChange} className="btn btn-outline btn-sm mt-2">
              Change Avatar
            </button> */}
          </div>

          {/* Username */}
          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text font-medium">Username</span>
            </label>
            <input
              placeholder={user?.displayName}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Bio */}
          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text font-medium">Bio</span>
            </label>
            <textarea
              placeholder={user?.bio}
              className="textarea textarea-bordered w-full"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Social Links */}
          <div className="form-control space-y-2 mb-4">
            <label className="label">
              <span className="label-text font-medium">Social Links</span>
            </label>
            <input
              type="text"
              placeholder={user?.insta}
              className="input input-bordered w-full"
              value={insta}
              onChange={(e) => setInsta(e.target.value)}
            />
            {/* <input
              type="text"
              placeholder="Instagram URL"
              className="input input-bordered w-full"
              value={user?.links[1] || ""}
              
            /> */}
          </div>

          {/* Save button */}
          <button onClick={handleChanges} className="btn btn-primary w-full">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
