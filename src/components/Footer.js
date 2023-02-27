import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import logo from "../assets/axionLogo.svg";

function Footer() {
  return (
    <footer className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:items-center py-8 px-16 border-t-[1px] border-t-gray-300">
      <div className="flex items-center gap-6 font-semibold">
        <img src={logo} alt="axion logo" />
        <Link to="/faq" className="hover:text-purple-600">
          FAQ
        </Link>
        <Link to="/login" className="hover:text-purple-600">
          Login
        </Link>
      </div>
      <div className="flex items-center gap-6 w-full lg:justify-end">
        <a
          href="https://instagram.com"
          className="hover:text-purple-600"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="akar-icons:instagram-fill" width="24" />
        </a>
        <a
          href="https://youtube.com"
          className="hover:text-purple-600"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="ant-design:youtube-outlined" width="30" />
        </a>
        <a
          href="https://twitter.com"
          className="hover:text-purple-600"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="lucide:twitter" width="26" />
        </a>
        <a
          href="https://github.com/emrsyah"
          className="hover:text-purple-600"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="akar-icons:github-fill" width="24" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
