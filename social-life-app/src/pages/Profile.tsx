import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";

const Profile = () => {
  const { user, loading, getIdToken } = useAuth();
  const [username, setUsername] = useState("User");
  const [bio, setBio] = useState("Hello! I’m new here 😄");
  const [socials, setSocials] = useState({
    twitter: "",
    instagram: "",
    github: "",
  });

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to view your profile.</div>;


  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6 rounded-3xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user.avatarUrl} alt="User Profile Picture" />
            </div>
          </div>
          <button className="btn btn-outline btn-sm mt-2">Change Avatar</button>
        </div>

        {/* Username */}
        <div className="form-control mb-3">
          <label className="label">
            <span className="label-text font-medium">Username</span>
          </label>
          <input
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
            placeholder="Twitter URL"
            className="input input-bordered w-full"
            value={socials.twitter}
            onChange={(e) =>
              setSocials({ ...socials, twitter: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Instagram URL"
            className="input input-bordered w-full"
            value={socials.instagram}
            onChange={(e) =>
              setSocials({ ...socials, instagram: e.target.value })
            }
          />
        </div>

        {/* Save button */}
        <button className="btn btn-primary w-full">Save Changes</button>
      </div>
    </div>
  );
};

export default Profile;