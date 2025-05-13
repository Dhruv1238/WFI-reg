import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API_URL } from "../constants";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

import "react-country-state-city/dist/react-country-state-city.css";

// Define Zod schema for validation
const phoneRegex = /^[+]?[0-9]{10,15}$/; // Basic phone regex, adjust as needed

const visitorSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  companyName: z.string().min(1, "Company Name is required"),
  designation: z.string().min(1, "Designation is required"),
  mobileNumber: z
    .string()
    .regex(phoneRegex, "Invalid mobile number (e.g., 10-15 digits)"),
  emailId: z
    .string()
    .email("Invalid email address")
    .min(1, "Email ID is required"),
  street: z.string().min(1, "Street is required"),
  citySuburb: z.string().min(1, "City/Suburb is required"),
  state: z.string().min(1, "State is required"),
  zipPostCode: z.string().min(1, "Zip/Post Code is required"),
  country: z.string().min(1, "Country is required"),
  visitorProfile: z
    .array(z.string())
    .min(1, "Select at least one profile type")
    .max(14), // Max items if needed
  otherProfile: z.string().optional(), // For the "Other" checkbox text input
});

const VisitorRegistration = () => {
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [showOtherProfileInput, setShowOtherProfileInput] = useState(false);
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(visitorSchema),
    mode: "onChange", // Validate on change
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      designation: "",
      mobileNumber: "",
      emailId: "",
      street: "",
      citySuburb: "",
      state: "",
      zipPostCode: "",
      country: "",
      visitorProfile: [],
      otherProfile: "",
    },
  });

  const watchedVisitorProfile = watch("visitorProfile");

  // Show/hide "Other" text input based on checkbox selection
  useEffect(() => {
    if (watchedVisitorProfile?.includes("other")) {
      setShowOtherProfileInput(true);
    } else {
      setShowOtherProfileInput(false);
      setValue("otherProfile", ""); // Clear if "Other" is deselected
    }
  }, [watchedVisitorProfile, setValue]);

  const onSubmitApi = async (formData) => {
    setApiMessage({ type: "info", text: "Submitting..." });

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.mobileNumber,
      eventId: 157, // Assuming the same eventId, adjust if different for visitors
      userCohort: "ATTENDEE", // Changed for visitor
      image: "imgUrlPlaceholderVisitor", // Placeholder
      email: formData.emailId,
      companyOrganizationName: formData.companyName,
      // companyEmail, companyContact, companyAddress, companyPanNo, companyGstin, directorName might not be applicable or can be derived/omitted for visitors
      // For simplicity, I'm omitting them. If needed, they can be added or mapped from existing fields.
      data: {
        designation: formData.designation,
        street: formData.street,
        citySuburb: formData.citySuburb,
        state: formData.state,
        zipPostCode: formData.zipPostCode,
        country: formData.country,
        visitorProfile: formData.visitorProfile,
        ...(formData.visitorProfile.includes("other") &&
          formData.otherProfile && {
            otherProfileDetail: formData.otherProfile,
          }), // Add otherProfileDetail if "Other" is selected and filled
      },
    };

    // Clean up undefined optional fields from data object
    for (const key in payload.data) {
      if (payload.data[key] === undefined) {
        delete payload.data[key];
      }
    }

    console.log(
      "Submitting Visitor payload:",
      JSON.stringify(payload, null, 2)
    );

    try {
      // Using the same API endpoint as the exhibitor form.
      // You might have a different endpoint for visitor registration.
      const response = await fetch(API_URL + "auth/register/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Visitor Submission successful:", result);
        setApiMessage({
          type: "success",
          text: "Visitor Registration Successful!",
        });
        // Optionally reset form or redirect
      } else {
        const errorResult = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        console.error("Visitor Submission failed:", errorResult);
        setApiMessage({
          type: "error",
          text: `Registration Failed: ${
            errorResult.message || "Unknown error"
          }`,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      setApiMessage({
        type: "error",
        text: `Registration Failed: Network error. ${error.message}`,
      });
    }
  };

  const visitorProfileOptions = [
    { value: "buying_agents", label: "Buying Agents" },
    { value: "corporates", label: "Corporates" },
    { value: "distributors", label: "Distributors" },
    { value: "domestic_buyers", label: "Domestic Buyers" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "exporters", label: "Exporters" },
    { value: "institutional_buyers", label: "Institutional Buyers" },
    { value: "investors", label: "Investors" },
    { value: "marketing_professionals", label: "Marketing Professionals" },
    {
      value: "overseas_buyers",
      label: "Overseas Buyers, Importers & Wholesalers",
    },
    { value: "retail_stores", label: "Retail Stores" },
    { value: "think_tanks", label: "Think Tanks" },
    { value: "traders", label: "Traders" },
    { value: "other", label: "Other (Please specify)" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitApi)} className="w-full">
        <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[90vh] rounded-2xl w-full sm:w-11/12 md:w-5/6 lg:w-3/4 lg:mx-auto my-8">
          <div className="flex flex-col w-full justify-start gap-8 items-center lg:w-1/4 bg-[#FF4421] lg:min-h-full rounded-t-2xl lg:rounded-2xl px-5 py-12 text-white">
            <h1 className="text-2xl font-bold text-center">
              Visitor Registration
            </h1>
          </div>
          <div className="flex flex-col w-full p-6 md:p-8">
            <div className="flex flex-col items-start h-full w-full">
              <h2 className="text-2xl font-semibold mb-4 mt-4">
                Visitor Information
              </h2>
              <hr className="w-full border-t border-[#B1B1B1] mb-6" />{" "}
              {/* Changed border-t-1 to border-t */}
              {/* Row 1: First Name, Last Name */}
              <div className="flex flex-col md:flex-row items-start mb-1 w-full gap-x-6 md:gap-x-12 lg:gap-x-20">
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    First Name*
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="Enter First Name"
                    className={`w-full h-12 border bg-white ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />{" "}
                  {/* Changed h-13, rounded-sm */}
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Enter Last Name"
                    className={`w-full h-12 border bg-white ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Row 2: Company Name, Designation */}
              <div className="flex flex-col md:flex-row items-start mb-1 w-full gap-x-6 md:gap-x-12 lg:gap-x-20">
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    placeholder="Enter Company Name"
                    className={`w-full h-12 border bg-white ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Designation*
                  </label>
                  <input
                    type="text"
                    {...register("designation")}
                    placeholder="Enter Designation"
                    className={`w-full h-12 border bg-white ${
                      errors.designation ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.designation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.designation.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Row 3: Mobile Number, Email ID */}
              <div className="flex flex-col md:flex-row items-start mb-1 w-full gap-x-6 md:gap-x-12 lg:gap-x-20">
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Mobile Number*
                  </label>
                  <input
                    type="tel"
                    {...register("mobileNumber")}
                    placeholder="Enter Mobile Number"
                    className={`w-full h-12 border bg-white ${
                      errors.mobileNumber ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Email ID*
                  </label>
                  <input
                    type="email"
                    {...register("emailId")}
                    placeholder="Enter Email ID"
                    className={`w-full h-12 border bg-white ${
                      errors.emailId ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.emailId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emailId.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Row 4: Street, City/Suburb */}
              <div className="flex flex-col md:flex-row items-start mb-1 w-full gap-x-6 md:gap-x-12 lg:gap-x-20">
                <div className="mb-4 w-full md:w-1/2">
                  {" "}
                  {/* Adjusted to take half width like others for consistency, can be w-full if desired */}
                  <label className="block text-gray-700 font-medium mb-2">
                    Country*
                  </label>
                  <CountrySelect
                    placeholder="Enter Country"
                    className={`w-full h-13 border bg-white ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                    onChange={(selectedCountry) => {
                      setValue("country", selectedCountry.name, {
                        shouldValidate: true,
                      });
                      setCountryId(selectedCountry.id);
                    }}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    State*
                  </label>
                  <StateSelect
                    countryid={countryId || 0}
                    placeholder="Enter State or Region"
                    className={`w-full h-13 border bg-white ${
                      errors.state
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                    onChange={(selectedState) => {
                      setValue("state", selectedState.name, {
                        shouldValidate: true,
                      });
                      setStateId(selectedState.id);
                    }}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Row 5: State, Zip/Post Code */}
              <div className="flex flex-col md:flex-row items-start mb-1 w-full gap-x-6 md:gap-x-12 lg:gap-x-20">
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    City/Suburb*
                  </label>
                  <CitySelect
                        countryid={countryId || 0}
                        stateid={stateId || 0}
                        placeholder="Enter City or Town"
                        className={`w-full h-13 border bg-white ${
                          errors.citySuburb ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                        onChange={(selectedCity) =>
                          setValue("citySuburb", selectedCity.name, {
                            shouldValidate: true,
                          })
                        }
                      />
                  {errors.citySuburb && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.citySuburb.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Street*
                  </label>
                  <input
                    type="text"
                    {...register("street")}
                    placeholder="Enter Street Address"
                    className={`w-full h-12 border bg-white ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="mb-4 w-full md:w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Zip/Post Code*
                  </label>
                  <input
                    type="text"
                    {...register("zipPostCode")}
                    placeholder="Enter Zip/Post Code"
                    className={`w-full h-12 border bg-white ${
                      errors.zipPostCode ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.zipPostCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipPostCode.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Row 6: Country */}
              <div className="flex flex-col md:flex-row items-start mb-1 w-full gap-x-6 md:gap-x-12 lg:gap-x-20"></div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 mt-6">
              Visitor Profile
            </h2>
            <hr className="w-full border-t border-[#B1B1B1] mb-6" />
            <div className="mb-6 w-full">
              <label className="block text-gray-700 font-medium mb-2">
                An ideal platform for Indian and overseas audiences, business
                visitors, and other stakeholders who are associated directly or
                indirectly with the development model of the state of Uttar
                Pradesh. Here's a brief glance: * (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {visitorProfileOptions.map((obj) => (
                  <label key={obj.value} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("visitorProfile")}
                      value={obj.value}
                      className="mr-2 h-5 w-5 accent-[#FF4421]"
                    />
                    {obj.label}
                  </label>
                ))}
              </div>
              {errors.visitorProfile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.visitorProfile.message}
                </p>
              )}
              {/* Conditional input for "Other" */}
              {showOtherProfileInput && (
                <div className="mt-4">
                  <label
                    htmlFor="otherProfile"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Please specify "Other":
                  </label>
                  <input
                    type="text"
                    id="otherProfile"
                    {...register("otherProfile")}
                    placeholder="Specify other profile type"
                    className={`w-full md:w-1/2 h-12 border bg-white ${
                      errors.otherProfile ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]`}
                  />
                  {errors.otherProfile && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.otherProfile.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* API Message Display */}
            {apiMessage.text && (
              <div
                className={`my-4 p-3 rounded-md text-center ${
                  apiMessage.type === "success"
                    ? "bg-green-100 text-green-700"
                    : apiMessage.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {apiMessage.text}
              </div>
            )}

            <div className="flex justify-end w-full mt-auto pt-6">
              <button
                type="submit"
                className="bg-[#FF4421] self-end w-full lg:w-auto min-w-[160px] h-14 text-xl cursor-pointer text-white rounded-full px-6 py-2 hover:scale-105 duration-300 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default VisitorRegistration;
