import React, { useState } from "react";
// import { a, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  // const location = useLocation();

  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  const isActive = (path) => {
    return false;
  };

  const baseLink = "https://incandescent-hotteok-21e835.netlify.app";

  let navItems = [
    { title: "HOME", path: "/" },
    {
      title: "ABOUT WFI",
      path: "/about",
      dropdownItems: [
        { title: "Key elements", path: "/about/key-elements" },
        {
          title: "Show Exhibitor Directory",
          path: "/about/show-exhibitor-directory",
        },
        { title: "Who should attend", path: "/about/who-should-attend" },
        { title: "How to reach", path: "/about/how-to-reach" },
        { title: "Past event snapshot", path: "/about/past-event-snapshots" },
        { title: "Industry Statistics", path: "/about/industry-statistics" },
        { title: "FAQ", path: "/about/faq" },
      ],
    },
    {
      title: "SESSIONS",
      path: "/sessions",
      dropdownItems: [
        { title: "Agenda", path: "/sessions/agenda" },
        { title: "Thematic Sessions", path: "/sessions/thematic-sessions" },
        { title: "State Sessions", path: "/sessions/state-sessions" },
        { title: "Country Sessions", path: "/sessions/country-sessions" },
        { title: "Speakers", path: "/sessions/speakers" },
      ],
    },
    {
      title: "EXHIBITORS",
      path: "/exhibitor",
      dropdownItems: [
        { title: "Why Exhibit", path: "/exhibitor/why-exhibit" },
        { title: "Who Can Exhibit", path: "/exhibitor/who-can-exhibit" },
        { title: "Zones & Layout", path: "/exhibitor/zones-and-layout" },
        { title: "Booth Options & Pricing", path: "/exhibitor/booth-options" },
        {
          title: "Exhibitor Registration",
          path: "/exhibitor/exhibitor-registration",
        },
        { title: "Exhibitor portal", path: "/exhibitor/exhibitor-portal" },
      ],
    },
    {
      title: "BUYERS",
      path: "/buyers",
      dropdownItems: [
        { title: "Why Attend", path: "/buyers/why-attend" },
        {
          title: "Reverse Buyer-Seller Meet (RBSM)",
          path: "/buyers/rbsm",
        },
        { title: "Products at WFI", path: "/buyers/products-at-wfi" },
      ],
    },
    {
      title: "NEWS & EVENTS",
      path: "/news-and-events",
      dropdownItems: [
        { title: "Press Releases", path: "/news-and-events/press-release" },
        {
          title: "Media Coverage",
          path: "/news-and-events/media-coverage",
        },
        { title: "Event Roadshows", path: "/news-and-events/event-roadshows" },
        {
          title: "Download (Media kit, logos, brochures)",
          path: "/news-and-events/download",
        },
      ],
    },
    {
      title: "KNOWLEDGE CENTRE",
      path: "/knowledge",
      dropdownItems: [
        { title: "Knowledge Centre", path: "/knowledge/knowledge-centre" },
        { title: "Archive", path: "/knowledge/archive" },
      ],
    },
    {
      title: "PLAN YOUR TRAVEL",
      path: "/travel",
      dropdownItems: [
        { title: "How to reach", path: "/travel/how-to-reach" },
        { title: "Book a cab", path: "/travel/book-a-cab" },
        {
          title: "Hotel & Accommodation",
          path: "/travel/hotel-and-accomodation",
        },
      ],
    },
    { title: "CONTACT US", path: "/contact" },
  ];

  navItems = navItems.map((item) => {
    const updatedItem = {
      ...item,
      path: baseLink + item.path,
    };
    if (item.dropdownItems) {
      updatedItem.dropdownItems = item.dropdownItems.map((subItem) => ({
        ...subItem,
        path: baseLink + subItem.path,
      }));
    }
    return updatedItem;
  });

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full rounded-r-3xl w-[75%] max-w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        <div className="flex flex-col h-full">
          {/* <div className="w-full text-end pr-4 pt-2 ">
            <button
              onClick={() => setIsOpen(false)}
              className="text-end rounded-full bg-gray-50 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div> */}

          {/* Logo */}
          <div className="px-4 py-4 flex justify-between items-center">
            <img
              src="/black_logo-new.png"
              alt="World Food India"
              className="h-14"
            />

            <div>
              <button
                // href="#register"
                className="bg-gradient-to-t from-[#520040] to-[#D02AAC] text-white px-3 py-3 rounded-full text-xs font-medium flex items-center gap-2 group overflow-hidden cursor-pointer hover:border-[#D02AAC] border-white"
              >
                <span className="relative z-10">Register Now</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 relative z-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
                <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-4">
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <p className="text-xs">
                Venue & Date : Bharat Mandapam, Pragati Maidan, New Delhi, India
                <br />
                <span className="font-semibold">
                  25th - 28th September 2025
                </span>
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item, index) => (
              <div key={index} className="pb-2">
                <div className="flex items-center justify-between py-2 cursor-pointer">
                  <a
                    href={item.path}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? "text-[#961E7C] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-[#961E7C]"
                        : "text-gray-900 hover:text-[#961E7C]"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    {item.title}
                  </a>
                  {item.dropdownItems && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        activeDropdown === index ? "rotate-180" : ""
                      } ${
                        isActive(item.path) ? "text-[#961E7C]" : "text-gray-900"
                      }`}
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === index ? null : index
                        )
                      }
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
                {item.dropdownItems && activeDropdown === index && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.dropdownItems.map((dropdownItem, idx) => (
                      <a
                        key={idx}
                        href={dropdownItem.path}
                        className={`block text-sm py-1 ${
                          location.pathname === dropdownItem.path
                            ? "text-[#961E7C] font-medium"
                            : "text-gray-600 hover:text-[#961E7C]"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {dropdownItem.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="px-4 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">{t("social.findUsOn")}</p>
            <div className="flex gap-4">
              <a href="#" className="flex-shrink-0">
                <img
                  src="/google_play.png"
                  alt="Get it on Google Play"
                  className="h-8"
                />
              </a>
              <a href="#" className="flex-shrink-0">
                <img
                  src="/app_store.png"
                  alt="Download on App Store"
                  className="h-8"
                />
              </a>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-[#b1207d]">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#b1207d]">
                <FaXTwitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#b1207d]">
                <FaLinkedinIn size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#b1207d]">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#b1207d]">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full flex items-center justify-between h-8 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-gray-100">
          <div className="flex items-center gap-4">
            <img src="/mofpi.png" alt="MOFPI Logo" className="h-8 md:h-10" />
            <div className="hidden lg:flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span className="text-sm text-gray-700">
                Venue & Date : Bharat Mandapam, Pragati Maidan, New Delhi, India
                |{" "}
                <span className="font-semibold">
                  25th - 28th September 2025
                </span>
              </span>
            </div>
          </div>

          <img
            onClick={toggleLanguage}
            src="/Lang-change.svg"
            alt=""
            className="cursor-pointer"
          />
        </div>
      </div>

      <nav className="w-full bg-white shadow-lg sticky top-0 z-30 rounded-b-3xl">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 lg:py-4">
            {/* Logo */}
            <div className="flex items-center space-x-9">
              <div className="flex-shrink-0">
                <a
                  href="https://incandescent-hotteok-21e835.netlify.app"
                  className="flex items-center"
                >
                  <img
                    src="/black_logo-new.png"
                    alt="World Food India"
                    className="h-16 w-auto lg:h-20"
                  />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex flex-col gap-1 items-end lg:hidden">
              {/* <img src="/mofpi.png" alt="MOFPI Logo" className="h-8 md:h-10" /> */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-3xl text-gray-700 hover:text-[#D02AAC] bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#D02AAC] transition-colors duration-200 cursor-pointer"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isOpen ? "hidden" : "block"} h-4 w-4`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isOpen ? "block" : "hidden"} h-4 w-4`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:block">
              <div className="lg:w-full hidden lg:flex lg:justify-end">
                <a
                  href="#register"
                  className="relative bg-gradient-to-t from-[#520040] to-[#D02AAC] text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-4 group overflow-hidden border-2 hover:border-[#D02AAC] border-white"
                >
                  <span className="relative z-10">Register Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 relative z-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                </a>
              </div>

              <div className="hidden lg:flex lg:items-center">
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={item.path}
                      className={`px-2 py-2 text-center text-[0.7rem] xl:text-sm font-medium transition-colors duration-200 group flex items-center gap-1 ${
                        isActive(item.path)
                          ? "text-[#961E7C]"
                          : "hover:text-[#961E7C]"
                      }`}
                    >
                      <span
                        className={`relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:transform after:bg-[#961E7C] after:transition-transform after:duration-300 after:ease-out ${
                          isActive(item.path)
                            ? "after:scale-x-100"
                            : "after:scale-x-0 group-hover:after:scale-x-100"
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.dropdownItems && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 transform transition-transform duration-200 group-hover:rotate-180"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      )}
                    </a>
                    {item.dropdownItems && activeDropdown === item.title && (
                      <div className="absolute left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1 px-1 space-y-0.5">
                          {item.dropdownItems.map(
                            (dropdownItem, dropdownIndex) => (
                              <a
                                key={dropdownIndex}
                                href={dropdownItem.path}
                                className={`block px-2 py-2 text-sm rounded-sm ${
                                  location.pathname === dropdownItem.path
                                    ? "bg-[#961E7C] text-white"
                                    : "bg-gray-100 hover:text-white hover:bg-[#961E7C]"
                                }`}
                              >
                                {dropdownItem.title}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
