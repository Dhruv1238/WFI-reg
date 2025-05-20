// import React, { useState } from "react";
// // import { a, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   FaFacebookF,
//   FaLinkedinIn,
//   FaInstagram,
//   FaYoutube,
// } from "react-icons/fa";

// import { FaXTwitter } from "react-icons/fa6";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   // const location = useLocation();

//   const { i18n, t } = useTranslation();

//   const toggleLanguage = () => {
//     const newLang = i18n.language === "en" ? "hi" : "en";
//     i18n.changeLanguage(newLang);
//   };

//   const isActive = (path) => {
//     return false;
//   };

//   const baseLink = "https://incandescent-hotteok-21e835.netlify.app";

//   let navItems = [
//     { title: t("navbar.home"), path: "/" },
//     {
//       title: t("navbar.about"),
//       path: "/about",
//       dropdownItems: [
//         { title: t("dropdown.about.keyElements"), path: "/about/key-elements" },
//         {
//           title: t("dropdown.about.industryStats"),
//           path: "/about/industry-statistics",
//         },
//         // {
//         //   title: t("dropdown.about.whoShouldAttend"),
//         //   path: "/about/who-should-attend",
//         // },
//         {
//           title: t("dropdown.about.pastEvent"),
//           path: "/about/past-event-snapshots",
//         },
//         { title: t("dropdown.about.faq"), path: "/about/faq" },
//         // {
//         //   title: t("dropdown.about.exhibitorDirectory"),
//         //   path: "/about/show-exhibitor-directory",
//         // },

//         // { title: t("dropdown.about.howToReach"), path: "/about/how-to-reach" },
//       ],
//     },
//     // {
//     //   title: t("navbar.sessions"),
//     //   path: "/sessions",
//     //   dropdownItems: [
//     //     { title: t("dropdown.sessions.agenda"), path: "/sessions/agenda" },
//     //     {
//     //       title: t("dropdown.sessions.thematicSessions"),
//     //       path: "/sessions/thematic-sessions",
//     //     },
//     //     {
//     //       title: t("dropdown.sessions.stateSessions"),
//     //       path: "/sessions/state-sessions",
//     //     },
//     //     {
//     //       title: t("dropdown.sessions.countrySessions"),
//     //       path: "/sessions/country-sessions",
//     //     },
//     //     { title: t("dropdown.sessions.speakers"), path: "/sessions/speakers" },
//     //   ],
//     // },
//     {
//       title: t("navbar.exhibitors"),
//       path: "/exhibitor",
//       dropdownItems: [
//         {
//           title: t("dropdown.exhibitors.whyExhibit"),
//           path: "/exhibitor/why-exhibit",
//         },
//         {
//           title: t("dropdown.exhibitors.whoCanExhibit"),
//           path: "/exhibitor/who-can-exhibit",
//         },
//         // {
//         //   title: t("dropdown.exhibitors.zonesLayout"),
//         //   path: "/exhibitor/zones-and-layout",
//         // },
//         {
//           title: t("dropdown.exhibitors.boothOptions"),
//           path: "/exhibitor/booth-options",
//         },
//         {
//           title: "Brochures",
//           path: "/brochure",
//         },
//         {
//           title: t("dropdown.exhibitors.registration"),
//           path: "https://cute-lamington-e71b4d.netlify.app/",
//         },
//         // {
//         //   title: t("dropdown.exhibitors.portal"),
//         //   path: "/exhibitor/exhibitor-portal",
//         // },
//       ],
//     },
//     // {
//     //   title: t("navbar.buyers"),
//     //   path: "/buyers",
//     //   dropdownItems: [
//     //     { title: t("dropdown.buyers.whyAttend"), path: "/buyers/why-attend" },
//     //     {
//     //       title: t("dropdown.buyers.rbsm"),
//     //       path: "/buyers/rbsm",
//     //     },
//     //     {
//     //       title: t("dropdown.buyers.products"),
//     //       path: "/buyers/products-at-wfi",
//     //     },
//     //   ],
//     // },
//     {
//       title: t("navbar.news"),
//       path: "/news-and-events",
//       // dropdownItems: [
//       //   {
//       //     title: t("dropdown.news.pressReleases"),
//       //     path: "/news-and-events/press-release",
//       //   },
//       //   {
//       //     title: t("dropdown.news.mediaCoverage"),
//       //     path: "/news-and-events/media-coverage",
//       //   },
//       //   {
//       //     title: t("dropdown.news.roadshows"),
//       //     path: "/news-and-events/event-roadshows",
//       //   },
//       // ],
//     },
//     {
//       title: t("navbar.knowledge"),
//       path: "/knowledge",
//       // dropdownItems: [
//       //   {
//       //     title: t("dropdown.knowledge.centre"),
//       //     path: "/knowledge",
//       //   },
//       //   { title: t("dropdown.knowledge.archive"), path: "/knowledge/archive" },
//       // ],
//     },
//     // {
//     //   title: t("navbar.travel"),
//     //   path: "/travel",
//     //   dropdownItems: [
//     //     {
//     //       title: t("dropdown.travel.howToReach"),
//     //       path: "/travel/how-to-reach",
//     //     },
//     //     { title: t("dropdown.travel.bookCab"), path: "/travel/book-a-cab" },
//     //     {
//     //       title: t("dropdown.travel.hotel"),
//     //       path: "/travel/hotel-and-accomodation",
//     //     },
//     //   ],
//     // },
//     { title: t("navbar.contact"), path: "/contact" },
//   ];

//   navItems = navItems.map((item) => {
//     const updatedItem = {
//       ...item,
//       path: baseLink + item.path,
//     };
//     if (item.dropdownItems) {
//       updatedItem.dropdownItems = item.dropdownItems.map((subItem) => ({
//         ...subItem,
//         path: baseLink + subItem.path,
//       }));
//     }
//     return updatedItem;
//   });

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-all duration-300"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       <div
//         className={`fixed top-0 left-0 h-full rounded-r-3xl w-[75%] max-w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
//       >
//         <div className="flex flex-col h-full">
//           {/* <div className="w-full text-end pr-4 pt-2 ">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-end rounded-full bg-gray-50 p-2"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div> */}

//           {/* Logo */}

//           <div className="px-4 py-4 flex justify-between items-center">
//             <img
//               src="/black_logo-new.png"
//               alt="World Food India"
//               className="h-14"
//             />

//             <div>
//               <button
//                 onClick={() => {
//                   window.location.href =
//                     "https://cute-lamington-e71b4d.netlify.app/";
//                 }}
//                 className="bg-gradient-to-t from-[#520040] to-[#D02AAC] text-white px-2 py-2 rounded-full text-xs font-medium flex items-center gap-2 group overflow-hidden cursor-pointer hover:border-[#D02AAC] border-white"
//               >
//                 <span className="relative z-10">Register Now</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 relative z-10"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
//                   />
//                 </svg>
//                 <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
//               </button>
//             </div>
//           </div>

//           <div className="bg-gray-100 p-4">
//             <div className="flex items-start gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5 mt-1"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
//                 />
//               </svg>
//               <p className="text-xs">
//                 Venue & Date : Bharat Mandapam, Pragati Maidan, New Delhi, India
//                 <br />
//                 <span className="font-semibold">
//                   25th - 28th September 2025
//                 </span>
//               </p>
//             </div>
//           </div>

//           <nav className="flex-1 px-4 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//             {navItems.map((item, index) => (
//               <div key={index} className="pb-2">
//                 <div className="flex items-center justify-between py-2 cursor-pointer">
//                   <a
//                     href={item.path}
//                     className={`text-sm font-medium transition-colors duration-200 ${
//                       isActive(item.path)
//                         ? "text-[#961E7C] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-[#961E7C]"
//                         : "text-gray-900 hover:text-[#961E7C]"
//                     }`}
//                     onClick={() => {
//                       setIsOpen(false);
//                     }}
//                   >
//                     {item.title}
//                   </a>
//                   {item.dropdownItems && (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className={`h-4 w-4 transform transition-transform duration-200 ${
//                         activeDropdown === index ? "rotate-180" : ""
//                       } ${
//                         isActive(item.path) ? "text-[#961E7C]" : "text-gray-900"
//                       }`}
//                       onClick={() =>
//                         setActiveDropdown(
//                           activeDropdown === index ? null : index
//                         )
//                       }
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   )}
//                 </div>
//                 {item.dropdownItems && activeDropdown === index && (
//                   <div className="ml-4 mt-2 space-y-2">
//                     {item.dropdownItems.map((dropdownItem, idx) => (
//                       <a
//                         key={idx}
//                         href={dropdownItem.path}
//                         className={`block text-sm py-1 ${
//                           location.pathname === dropdownItem.path
//                             ? "text-[#961E7C] font-medium"
//                             : "text-gray-600 hover:text-[#961E7C]"
//                         }`}
//                         onClick={() => setIsOpen(false)}
//                       >
//                         {dropdownItem.title}
//                       </a>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>

//           <div className="px-4 py-6 border-t border-gray-200">
//             <p className="text-sm text-gray-600 mb-4">{t("social.findUsOn")}</p>
//             <div className="flex gap-4">
//               <a href="#" className="flex-shrink-0">
//                 <img
//                   src="/google_play.png"
//                   alt="Get it on Google Play"
//                   className="h-8"
//                 />
//               </a>
//               <a href="#" className="flex-shrink-0">
//                 <img
//                   src="/app_store.png"
//                   alt="Download on App Store"
//                   className="h-8"
//                 />
//               </a>
//             </div>
//             <div className="flex gap-4 mt-6">
//               <a href="#" className="text-gray-600 hover:text-[#b1207d]">
//                 <FaFacebookF size={20} />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-[#b1207d]">
//                 <FaXTwitter size={20} />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-[#b1207d]">
//                 <FaLinkedinIn size={20} />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-[#b1207d]">
//                 <FaInstagram size={20} />
//               </a>
//               <a href="#" className="text-gray-600 hover:text-[#b1207d]">
//                 <FaYoutube size={20} />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative">
//         {/* <div className="w-full flex items-center justify-between h-8 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-gray-100">
//           <div className="flex items-center gap-4">
//             <img src="/mofpi.png" alt="MOFPI Logo" className="h-8 md:h-10" />
//             <div className="hidden lg:flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-5 h-5 text-black"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
//                 />
//               </svg>
//               <span className="text-sm text-gray-700">
//                 Venue & Date : Bharat Mandapam, Pragati Maidan, New Delhi, India
//                 |{" "}
//                 <span className="font-semibold">
//                   25th - 28th September 2025
//                 </span>
//               </span>
//             </div>
//           </div>

//           <img
//             onClick={toggleLanguage}
//             src="/Lang-change.svg"
//             alt=""
//             className="cursor-pointer"
//           />
//         </div> */}
//       </div>

//       <nav className="w-full bg-white shadow-lg sticky top-0 z-30 rounded-b-3xl">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-2 lg:py-4">
//             {/* Logo */}
//             <div className="flex items-center space-x-9">
//               <div className="flex-shrink-0">
//                 <a
//                   href="https://incandescent-hotteok-21e835.netlify.app"
//                   className="flex items-center"
//                 >
//                   <img
//                     src="/black_logo-new.png"
//                     alt="World Food India"
//                     className="h-16 w-auto lg:h-20"
//                   />
//                 </a>
//               </div>
//             </div>

//             {/* Mobile menu button */}
//             <div className="-mr-2 flex flex-col gap-1 items-end lg:hidden">
//               {/* <img src="/mofpi.png" alt="MOFPI Logo" className="h-8 md:h-10" /> */}
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="inline-flex items-center justify-center p-2 rounded-3xl text-gray-700 hover:text-[#D02AAC] bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#D02AAC] transition-colors duration-200 cursor-pointer"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <svg
//                   className={`${isOpen ? "hidden" : "block"} h-4 w-4`}
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//                 <svg
//                   className={`${isOpen ? "block" : "hidden"} h-4 w-4`}
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Desktop menu */}
//             <div className="hidden lg:block">
//               {/* <div className="lg:w-full hidden lg:flex lg:justify-end">
//                 <a
//                   href="#register"
//                   className="relative bg-gradient-to-t from-[#520040] to-[#D02AAC] text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-4 group overflow-hidden border-2 hover:border-[#D02AAC] border-white"
//                 >
//                   <span className="relative z-10">Register Now</span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 relative z-10"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
//                     />
//                   </svg>
//                   <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
//                 </a>
//               </div> */}

//                                   <div className="hidden lg:flex items-center gap-2 border-r-1 py-2 border-[#D6D6D6]">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className={`w-5 h-5  "text-gray-800"
//                         `}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
//                         />
//                       </svg>
//                       <span
//                         className={`text-xs [@media(min-width:1450px)]:text-sm pr-4 xl:pr-10 "text-gray-800" `}
//                       >
//                         {t("venue.title")} : {t("venue.location")} |{" "}
//                         <span className="font-semibold">{t("venue.date")}</span>
//                       </span>
//                     </div>

//                     {/* <img
//                       onClick={toggleLanguage}
//                       src="/Lang-change.svg"
//                       alt=""
//                       className="cursor-pointer"
//                     /> */}
//                     {/* <img
//                       // onClick={toggleLanguage}
//                       src="/search_icon.svg"
//                       alt=""
//                       className="cursor-pointer pr-6"
//                     /> */}
//                     <div className="flex items-center pr-4 border-r-1 border-[#D6D6D6]">
//                       <button
//                         onClick={() => {
//                           window.location.href =
//                             "https://cute-lamington-e71b4d.netlify.app/";
//                         }}
//                         className="relative bg-gradient-to-l from-[#520040] to-[#D02AAC] text-white px-2 py-2 rounded-full text-xs font-medium flex items-center gap-4 group overflow-hidden border-2 hover:border-[#D02AAC] border-white cursor-pointer"
//                       >
//                         <span className="relative z-10">
//                           {t("buttons.registerNow")}
//                         </span>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={2}
//                           stroke="currentColor"
//                           className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 relative z-10"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
//                           />
//                         </svg>
//                         <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
//                       </button>
//                     </div>
//                     <img
//                       src="/mofpi.png"
//                       alt="MOFPI Logo"
//                       className="h-6 md:h-14 xl:pl-4 xl:pr-6"
//                     />
//                   </div>
//                 </div>

//               <div className="hidden lg:flex lg:items-center">
//                 {navItems.map((item, index) => (
//                   <div
//                     key={index}
//                     className="relative group"
//                     onMouseEnter={() => setActiveDropdown(item.title)}
//                     onMouseLeave={() => setActiveDropdown(null)}
//                   >
//                     <a
//                       href={item.path}
//                       className={`px-2 py-2 text-center text-[0.7rem] xl:text-sm font-medium transition-colors duration-200 group flex items-center gap-1 ${
//                         isActive(item.path)
//                           ? "text-[#961E7C]"
//                           : "hover:text-[#961E7C]"
//                       }`}
//                     >
//                       <span
//                         className={`relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:transform after:bg-[#961E7C] after:transition-transform after:duration-300 after:ease-out ${
//                           isActive(item.path)
//                             ? "after:scale-x-100"
//                             : "after:scale-x-0 group-hover:after:scale-x-100"
//                         }`}
//                       >
//                         {item.title}
//                       </span>
//                       {item.dropdownItems && (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={2}
//                           stroke="currentColor"
//                           className="w-4 h-4 transform transition-transform duration-200 group-hover:rotate-180"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="m19.5 8.25-7.5 7.5-7.5-7.5"
//                           />
//                         </svg>
//                       )}
//                     </a>
//                     {item.dropdownItems && activeDropdown === item.title && (
//                       <div className="absolute left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//                         <div className="py-1 px-1 space-y-0.5">
//                           {item.dropdownItems.map(
//                             (dropdownItem, dropdownIndex) => (
//                               <a
//                                 key={dropdownIndex}
//                                 href={dropdownItem.path}
//                                 className={`block px-2 py-2 text-sm rounded-sm ${
//                                   location.pathname === dropdownItem.path
//                                     ? "bg-[#961E7C] text-white"
//                                     : "bg-gray-100 hover:text-white hover:bg-[#961E7C]"
//                                 }`}
//                               >
//                                 {dropdownItem.title}
//                               </a>
//                             )
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  // const location = useLocation();
  const baseLink = "https://incandescent-hotteok-21e835.netlify.app";
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > window.innerHeight * 0.16) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  const isActive = (path) => {
    return false;
  };

  let navItems = [
    { title: "HOME", path: "/" },
    {
      title: "ABOUT WFI",
      path: "/about",
      dropdownItems: [
        { title: "Key Elements", path: "/about/key-elements" },
        {
          title: "Industry Statistics",
          path: "/about/industry-statistics",
        },
        // {
        //   title: t("dropdown.about.whoShouldAttend"),
        //   path: "/about/who-should-attend",
        // },
        {
          title: "Past Event Snapshots",
          path: "/about/past-event-snapshots",
        },
        { title: "FAQ", path: "/about/faq" },
        // {
        //   title: t("dropdown.about.exhibitorDirectory"),
        //   path: "/about/show-exhibitor-directory",
        // },

        // { title: t("dropdown.about.howToReach"), path: "/about/how-to-reach" },
      ],
    },
    // {
    //   title: t("navbar.sessions"),
    //   path: "/sessions",
    //   dropdownItems: [
    //     { title: t("dropdown.sessions.agenda"), path: "/sessions/agenda" },
    //     {
    //       title: t("dropdown.sessions.thematicSessions"),
    //       path: "/sessions/thematic-sessions",
    //     },
    //     {
    //       title: t("dropdown.sessions.stateSessions"),
    //       path: "/sessions/state-sessions",
    //     },
    //     {
    //       title: t("dropdown.sessions.countrySessions"),
    //       path: "/sessions/country-sessions",
    //     },
    //     { title: t("dropdown.sessions.speakers"), path: "/sessions/speakers" },
    //   ],
    // },
    {
      title: "EXHIBITORS",
      path: "/exhibitor",
      dropdownItems: [
        {
          title: "Why Exhibit",
          path: "/exhibitor/why-exhibit",
        },
        {
          title: "Who Can Exhibit",
          path: "/exhibitor/who-can-exhibit",
        },
        // {
        //   title: t("dropdown.exhibitors.zonesLayout"),
        //   path: "/exhibitor/zones-and-layout",
        // },
        {
          title: "Booth Options",
          path: "/exhibitor/booth-options",
        },
        {
          title: "Brochures",
          path: "/brochure",
        },
        {
          title: "Exhibitor Registration",
          path: "https://cute-lamington-e71b4d.netlify.app/",
        },
        // {
        //   title: t("dropdown.exhibitors.portal"),
        //   path: "/exhibitor/exhibitor-portal",
        // },
      ],
    },
    // {
    //   title: t("navbar.buyers"),
    //   path: "/buyers",
    //   dropdownItems: [
    //     { title: t("dropdown.buyers.whyAttend"), path: "/buyers/why-attend" },
    //     {
    //       title: t("dropdown.buyers.rbsm"),
    //       path: "/buyers/rbsm",
    //     },
    //     {
    //       title: t("dropdown.buyers.products"),
    //       path: "/buyers/products-at-wfi",
    //     },
    //   ],
    // },
    {
      title: "NEWS & EVENTS",
      path: "/news-and-events",
      // dropdownItems: [
      //   {
      //     title: t("dropdown.news.pressReleases"),
      //     path: "/news-and-events/press-release",
      //   },
      //   {
      //     title: t("dropdown.news.mediaCoverage"),
      //     path: "/news-and-events/media-coverage",
      //   },
      //   {
      //     title: t("dropdown.news.roadshows"),
      //     path: "/news-and-events/event-roadshows",
      //   },
      // ],
    },
    {
      title: "KNOWLEDGE CENTER",
      path: "/knowledge",
      // dropdownItems: [
      //   {
      //     title: t("dropdown.knowledge.centre"),
      //     path: "/knowledge",
      //   },
      //   { title: t("dropdown.knowledge.archive"), path: "/knowledge/archive" },
      // ],
    },
    // {
    //   title: t("navbar.travel"),
    //   path: "/travel",
    //   dropdownItems: [
    //     {
    //       title: t("dropdown.travel.howToReach"),
    //       path: "/travel/how-to-reach",
    //     },
    //     { title: t("dropdown.travel.bookCab"), path: "/travel/book-a-cab" },
    //     {
    //       title: t("dropdown.travel.hotel"),
    //       path: "/travel/hotel-and-accomodation",
    //     },
    //   ],
    // },
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
                onClick={() => {
                  window.location.href =
                    "https://cute-lamington-e71b4d.netlify.app/";
                }}
                className="bg-gradient-to-t from-[#520040] to-[#D02AAC] text-white px-2 py-2 rounded-full text-xs font-medium flex items-center gap-2 group overflow-hidden cursor-pointer hover:border-[#D02AAC] border-white"
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
                : 25th - 28th September 2025
                <br />
                <span className="font-semibold">{t("venue.date")}</span>
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

      <div className="">
        {/* <div className="w-full flex items-center justify-between h-8 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-gray-100">
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
                {t("venue.title")} : {t("venue.location")} |{" "}
                <span className="font-semibold">{t("venue.date")}</span>
              </span>
            </div>
          </div>

          <img
            onClick={toggleLanguage}
            src="/Lang-change.svg"
            alt=""
            className="cursor-pointer"
          />
        </div> */}

        <nav
          className={`w-full rounded-b-3xl  z-40 transition-all duration-500 ease-in-out    ${
            scrolled
              ? "fixed top-0 bg-white shadow-lg translate-y-0"
              : "absolute bg-transparent"
          }
          `}
        >
          <div className="max-w-full mx-auto px-4 sm:px-4 [@media(min-width:1120px)]:px-8">
            <div className="flex justify-between items-center py-2 lg:py-4">
              {/* Logo */}
              <div className="flex items-center space-x-9">
                <div className="flex-shrink-0">
                  <a href="/" className="flex items-center">
                    {scrolled ? (
                      <img
                        src="/black_logo-new.png"
                        alt="World Food India"
                        className="h-16 w-auto lg:h-20 xl:h-24"
                      />
                    ) : (
                      <img
                        src="/white_logo-new.png"
                        alt="World Food India"
                        className="h-16 w-auto lg:h-20 xl:h-24"
                      />
                    )}
                  </a>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex flex-col gap-1 items-end lg:hidden">
                {/* <img src="/mofpi.png" alt="MOFPI Logo" className="h-8 md:h-10" /> */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`inline-flex items-center justify-center p-2 rounded-3xl hover:text-[#D02AAC]  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#D02AAC] transition-colors duration-200 cursor-pointer ${
                    scrolled
                      ? "text-gray-800 bg-gray-100"
                      : "text-white  bg-transparent"
                  }`}
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
              <div className="hidden [@media(min-width:1024px)]:block">
                <div className="lg:w-full hidden lg:flex lg:justify-end border-b-1 border-[#D6D6D6]">
                  <div className="flex items-center gap-2 [@media(min-width:1450px)]:gap-4 py-2">
                    <div className="hidden lg:flex items-center gap-2 border-r-1 py-2 border-[#D6D6D6]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-5 h-5 ${
                          scrolled ? "text-gray-800" : "text-white"
                        }`}
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
                      <span
                        className={`text-xs [@media(min-width:1450px)]:text-sm pr-4 xl:pr-10 ${
                          scrolled ? "text-gray-800" : "text-white"
                        }`}
                      >
                        Venue & Date : Bharat Mandapam, Pragati Maidan, New
                        Delhi, India |{" "}
                        <span className="font-semibold">
                          25th - 28th September 2025
                        </span>
                      </span>
                    </div>

                    {/* <img
                      onClick={toggleLanguage}
                      src="/Lang-change.svg"
                      alt=""
                      className="cursor-pointer"
                    /> */}
                    {/* <img
                      // onClick={toggleLanguage}
                      src="/search_icon.svg"
                      alt=""
                      className="cursor-pointer pr-6"
                    /> */}
                    <div className="flex items-center pr-4 border-r-1 border-[#D6D6D6]">
                      <button
                        onClick={() => {
                          window.location.href =
                            "https://cute-lamington-e71b4d.netlify.app/";
                        }}
                        className="relative bg-gradient-to-l from-[#520040] to-[#D02AAC] text-white px-2 py-2 rounded-full text-xs font-medium flex items-center gap-4 group overflow-hidden border-2 hover:border-[#D02AAC] border-white cursor-pointer"
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
                    <img
                      src="/mofpi.png"
                      alt="MOFPI Logo"
                      className="h-6 md:h-14 xl:pl-4 xl:pr-6"
                    />
                  </div>
                </div>

                <div className="hidden lg:flex lg:items-center justify-end pt-1">
                  {navItems.map((item, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setActiveDropdown(item.title)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <a
                        href={item.path}
                        className={`px-1 [@media(min-width:1450px)]:px-2.5 py-2 text-center text-[0.6rem] xl:text-sm font-medium transition-colors duration-200 group flex items-center gap-1
                        ${
                          scrolled
                            ? ` ${
                                isActive(item.path)
                                  ? "text-[#961E7C]"
                                  : "text-gray-800 hover:text-[#961E7C]"
                              }`
                            : ` ${
                                isActive(item.path)
                                  ? "text-[#961E7C]"
                                  : "text-white hover:text-[#961E7C]"
                              }`
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
                  <img
                    onClick={toggleLanguage}
                    src="/Lang-change.svg"
                    alt=""
                    className="cursor-pointer w-18 pl-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
