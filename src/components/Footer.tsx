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
              className="h-24 md:h-32"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <a
              href="https://ficci.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-500 rounded-lg p-2 w-[140px] md:w-[160px] h-[80px]  flex items-center justify-center hover:border-[#961E7C] transition-colors"
            >
              <img
                src="/FICCI_Logo.webp"
                alt="FICCI"
                className="h-12 md:h-18 object-contain"
              />
            </a>
            <a
              href="https://www.investindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-500 rounded-lg p-2 w-[140px] md:w-[160px] h-[80px]  flex items-center justify-center hover:border-[#961E7C] transition-colors"
            >
              <img
                src="/INVEST_INDIA_Logo.webp"
                alt="Invest India"
                className="h-12 md:h-18 object-contain"
              />
            </a>
            <a
              href="https://mofpi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-500 rounded-lg p-2 w-[140px] md:w-[160px] h-[80px]  flex items-center justify-center hover:border-[#961E7C] transition-colors"
            >
              <img
                src="/MOFPI_Logo.webp"
                alt="MOFPI"
                className="h-12 md:h-18 object-contain"
              />
            </a>
            <a
              href="https://www.ey.com/en_in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-500 rounded-lg p-2 w-[140px] md:w-[160px] h-[80px] flex items-center justify-center hover:border-[#961E7C] transition-colors"
            >
              <img
                src="/EY_Logo.webp"
                alt="MOFPI"
                className="h-12 md:h-18 object-contain"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm mb-4 text-center md:text-left">
              Download our mobile app
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

          <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a
              href="/"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              About
            </a>
            <a
              href="/exhibition"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Exhibition
            </a>
            <a
              href="/conference"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Conference
            </a>
            <a
              href="/investor"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Investor
            </a>
            <a
              href="/knowledge-centre"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Knowledge Centre
            </a>
            <a
              href="/archive"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Archive
            </a>
            <a
              href="/contact"
              className="text-white hover:text-[#961E7C] text-sm uppercase"
            >
              Contact
            </a>
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
              © 2024 World Food India. All rights reserved.
              <a href="/terms" className="text-[#83B4FF] hover:underline ml-1">
                Terms of Use
              </a>{" "}
              |
              <a
                href="/privacy"
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
