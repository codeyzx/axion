import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <div className="h-screen flex flex-col">
      <Helmet>
        <title>404 Page Not Found</title>
      </Helmet>
      <Navbar />
      <div className="text-center my-16 flex-grow justify-center flex flex-col mx-4">
        <h1 className="lg:text-4xl text-2xl font-medium">
          <span className="font-bold text-purple-600">404</span> | Page Not
          Found.
        </h1>
        <p className="mt-3 opacity-80">
          Sorry we couldn't find the page you were looking for
        </p>
        <Link to="/" className="btnPrimary w-max mx-auto mt-12 text-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
