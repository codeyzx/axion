import { Disclosure, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const faqItems = [
  {
    title: "What's axion",
    body: "Axion is a simple auction application built with Go and React. It is a simple application that allows users to create auctions for products. Users can bid on auctions and the highest bidder wins the auction. The application also allows users to create products and auctions for those products.",
  },
  {
    title: "Is axion paid",
    body: "The features on the full axion application are all free, our mission in making this application is to make it easier for local umkm to be able to market their products more broadly by providing convenience in making contemporary auctions with various features and appearance.",
  },
  {
    title: "Does axion need technical personnel",
    body: "No, to create an auction in axion you just need to add the products you sell, for the appearance and other things we have handled so you don't need to bother anymore.",
  },
  {
    title: "How do I manage products and orders",
    body: "You can log in and enter as the admin of your store, there will be navigation to direct you to the product and order pages where you can manage what you want.",
  },
  {
    title: "Can I customize my store",
    body: "Yes, in Axion you can make various customizations to your store, ranging from adding links to your various websites, adding a bio, to adjusting the color theme of your store.",
  },
  {
    title: "Why haven't I received a verification email",
    body: "You can check your spam folder for the verification email, if you still haven't received it, please contact the developer.",
  },
  {
    title: "Where can I contact if I have difficulty",
    body: "You can contact the developer via email at yahyatruth@gmail.com or through the links in the footer of this website.",
  },
];

function Faq() {
  return (
    <>
      <Helmet>
        <title>FAQ | Axion</title>
      </Helmet>
      <Navbar />
      <div className="flex flex-col items-center mt-8 mb-16">
        <h1 className="font-semibold text-center text-2xl lg:text-4xl">
          Frequently Asked Questions🤔
        </h1>
        <div className="flex flex-col items-start gap-3 mt-8 w-11/12 lg:w-2/3">
          {faqItems.map((faqItem, i) => (
            <Disclosure
              key={i}
              as="div"
              className="border-[1px] border-gray-300 rounded-lg  w-full"
            >
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`md:text-lg px-6 py-4 font-semibold w-full text-left flex items-center justify-between ${
                      open && "text-purple-600"
                    }`}
                  >
                    {faqItem.title}
                    {open ? (
                      <Icon icon="akar-icons:minus" width="24" />
                    ) : (
                      <Icon icon="bi:plus" width="32" />
                    )}
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="text-gray-500 px-6 pb-4 w-11/12 ">
                      {faqItem.body}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Faq;
