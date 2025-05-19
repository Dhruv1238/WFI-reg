import React from "react";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-white">
      <div className="max-w-full mx-auto py-8 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
          <div>
            <img
              src="/white_logo-new.png"
              alt="World Food India"
              className=""
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <div className="w-[160px]">
              <p className="text-white text-xs mb-1 sm:mb-5 font-semibold text-center">
                ORGANISED BY
              </p>
              <a
                href="https://mofpi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-500 rounded-lg p-2 h-[70px] flex flex-col items-center justify-center hover:border-[#961E7C] transition-colors"
              >
                <img
                  src="/MOFPI_Logo.webp"
                  alt="MOFPI"
                  className="h-12 md:h-18 object-contain"
                />
              </a>
            </div>

            <div className="w-[160px]">
              <p className="text-white text-xs mb-1 sm:mb-5 font-semibold text-center">
                NATIONAL EVENT PARTNER
              </p>
              <a
                href="https://ficci.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-500 rounded-lg p-2 h-[70px] flex flex-col items-center justify-center hover:border-[#961E7C] transition-colors"
              >
                <img
                  src="/FICCI_Logo.webp"
                  alt="FICCI"
                  className="h-12 md:h-14 object-contain"
                />
              </a>
            </div>

            <div className="w-[160px]">
              <p className="text-white text-xs mb-1 font-semibold text-center break-words">
                INVESTMENT FACILIATION PARTNER
              </p>
              <a
                href="https://www.investindia.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-500 rounded-lg p-2 h-[70px] flex flex-col items-center justify-center hover:border-[#961E7C] transition-colors"
              >
                <img
                  src="/invest_footer_logo.png"
                  alt="Invest India"
                  className="h-12 md:w-34 object-contain"
                />
              </a>
            </div>

            <div className="w-[160px]">
              <p className="text-white text-xs mb-1 sm:mb-5 font-semibold text-center break-all">
                REGULATORY PARTNER
              </p>
              <a
                href="https://fssai.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-500 rounded-lg p-2 h-[70px] flex flex-col items-center justify-center hover:border-[#961E7C] transition-colors"
              >
                <img
                  src="/fssai_logo.png"
                  alt="Invest India"
                  className="h-12 md:w-34 object-contain"
                />
              </a>
            </div>

            <div className="w-[160px]">
              <p className="text-white text-xs mb-1 sm:mb-5 font-semibold text-center">
                KNOWLEDGE PARTNER
              </p>
              <a
                href="https://www.ey.com/en_in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-500 rounded-lg p-2 h-[70px] flex flex-col items-center justify-center hover:border-[#961E7C] transition-colors"
              >
                <img
                  src="/EY_Logo.webp"
                  alt="MOFPI"
                  className="h-12 md:h-14 object-contain"
                />
              </a>
            </div>

            <div className="w-[160px]">
              <p className="text-white text-xs mb-1 sm:mb-5 font-semibold text-center">
                VENUE PARTNER
              </p>
              <a
                href="https://indiatradefair.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-500 rounded-lg p-2 h-[70px] flex flex-col items-center justify-center hover:border-[#961E7C] transition-colors"
              >
                <img
                  src="/ITPO_logo.png"
                  alt="MOFPI"
                  className="h-12 md:h-18 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-8 gap-20">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm mb-4 text-center md:text-left">
              Download the app by clicking the link below :
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 md:h-8 lg:h-12">
                <img
                  src="/google_play.png"
                  alt="Get it on Google Play"
                  className="h-full"
                />
              </a>
              <a href="#" className="h-10 md:h-8 lg:h-12">
                <img
                  src="/app_store.png"
                  alt="Download on App Store"
                  className="h-full"
                />
              </a>
            </div>
          </div>

          <nav className="flex flex-col gap-6 md:items-start">
            <p className="text-sm italic text-center">Quick Link -</p>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/book-a-stand"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                BOOK A STAND
              </a>
              <a
                href="https://cute-lamington-e71b4d.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                REGISTER NOW
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/contact"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                CONTACT US
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                MEDIA REGISTRATION
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                PRIVACY POLICY
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                COOKIES POLICY
              </a>
            </nav>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                HOME
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/about"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                ABOUT
              </a>

              <a
                href="https://incandescent-hotteok-21e835.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                EXHIBITION
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                CONFERENCE
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/investor"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                INVESTOR
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/knowledge"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                KNOWLEDGE CENTER
              </a>
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/archieve"
                className="text-white hover:text-[#961E7C] text-sm uppercase"
              >
                ARCHIVE SECTION
              </a>
            </nav>
          </nav>
        </div>
      </div>

      <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t-[1px] border-[#243752] bg-black">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href="https://www.facebook.com/worldfoodindia?mibextid=LQQJ4d"
              target="_blank"
              className="bg-[#1B1B1B] p-3 rounded-sm hover:bg-[#961E7C] transition-colors"
            >
              <FaFacebookF className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/worldfoodindia?s=21&t=cJ1Cb6d2pUZ61d64gNt3Pw"
              target="_blank"
              className="bg-[#1B1B1B] p-3 rounded-sm hover:bg-[#961E7C] transition-colors"
            >
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a
              href="https://in.linkedin.com/company/worldfoodindia"
              target="_blank"
              className="bg-[#1B1B1B] p-3 rounded-sm hover:bg-[#961E7C] transition-colors"
            >
              <FaLinkedinIn className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/worldfoodindia/?igshid=YmMyMTA2M2Y="
              target="_blank"
              className="bg-[#1B1B1B] p-3 rounded-sm hover:bg-[#961E7C] transition-colors"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@WorldFoodIndia"
              target="_blank"
              className="bg-[#1B1B1B] p-3 rounded-sm hover:bg-[#961E7C] transition-colors"
            >
              <FaYoutube className="h-5 w-5" />
            </a>
          </div>

          <div className="text-sm text-center md:text-left">
            <p>
              © worldfoodindia.gov.in, All Rights Reserved. |
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/terms"
                className="text-[#83B4FF] hover:underline ml-1"
              >
                Terms and Conditions
              </a>{" "}
              |
              <a
                href="https://incandescent-hotteok-21e835.netlify.app/privacy"
                className="text-[#83B4FF] hover:underline ml-1"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
