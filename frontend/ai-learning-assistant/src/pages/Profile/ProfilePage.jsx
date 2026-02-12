import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const response = await authService.updateProfile({
        username,
        email,
      });

      setUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      return toast.error("Passwords do not match.");
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <PageHeader title="Profile Settings" />

      {/* ================= USER INFO CARD ================= */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">

        <h2 className="text-lg font-semibold text-slate-800">
          User Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Username
            </label>
            <div className="flex items-center gap-3 mt-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50">
              <User size={18} className="text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Email Address
            </label>
            <div className="flex items-center gap-3 mt-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50">
              <Mail size={18} className="text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <Button onClick={handleUpdateProfile}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* ================= PASSWORD CARD ================= */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">

        <h2 className="text-lg font-semibold text-slate-800">
          Change Password
        </h2>

        <div className="space-y-5">

          <div>
            <label className="text-sm font-medium text-slate-600">
              Current Password
            </label>
            <div className="flex items-center gap-3 mt-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50">
              <Lock size={18} className="text-slate-500" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              New Password
            </label>
            <div className="flex items-center gap-3 mt-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50">
              <Lock size={18} className="text-slate-500" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Confirm New Password
            </label>
            <div className="flex items-center gap-3 mt-2 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50">
              <Lock size={18} className="text-slate-500" />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleChangePassword}
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
