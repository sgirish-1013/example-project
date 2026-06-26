import { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [profile, setProfile] = useState(null);

  return profile
    ? <ChatWindow profile={profile} onClearSession={() => setProfile(null)} />
    : <ProfileForm onProfileSet={setProfile} />;
}