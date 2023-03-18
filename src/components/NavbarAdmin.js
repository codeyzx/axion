import React, { useEffect, useState } from "react";
import NavbarProfile from "./NavbarProfile";
import Notification from "./Notification";

function NavbarAdmin({ user }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date().getHours();
    if (4 <= now && now <= 11) {
      setGreeting({
        emoji: "🌄",
        greet: "Good Morning, ",
      });
    } else if (12 <= now && now <= 14) {
      setGreeting({
        emoji: "🌞",
        greet: "Good Afternoon, ",
      });
    } else if (15 <= now && now <= 18) {
      setGreeting({
        emoji: "🌆",
        greet: "Good Afternoon, ",
      });
    } else {
      setGreeting({
        emoji: "🌃",
        greet: "Good Night, ",
      });
    }
  }, []);

  return (
    <nav className="hidden md:flex shadow-sm bg-white py-3 px-5 border-b-[1px] border-b-gray-300 items-center sticky top-0 z-30 justify-between">
      <h5 className="font-medium text-lg">
        <span className="text-3xl">{greeting.emoji}</span>
        {greeting.greet} {user.name}
      </h5>
      <div className="flex items-center gap-6">
        {/* <Icon
          icon="clarity:notification-outline-badged"
          width="22"
          className="text-purple-600 hover:scale-105 transition-all duration-100 ease-out cursor-pointer"
        /> */}
        <Notification />
        {/* <img src={user.profileImg} className="w-10 rounded-full" alt="" /> */}
        <NavbarProfile />
      </div>
    </nav>
  );
}

export default NavbarAdmin;
