import { useState, useEffect, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { usePrice } from "../context/Price";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

import "react-country-state-city/dist/react-country-state-city.css";
import { Typography } from "@mui/material";
// Define Zod schema for validation
const phoneRegex = /^[+]?[0-9]{10,15}$/; // Basic phone regex, adjust as needed
const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/; // Basic PAN regex

const schema = z
  .object({
    // Step 1: Contact Information
    profilePhoto: z
      .any()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith("image/")),
        "Please upload a valid image file"
      ),
    companyName: z.string().min(1, "Company/Organization Name is required"),
    chiefExecutiveTitle: z.string().min(1, "Chief Executive Title is required"),
    chiefExecutiveFirstName: z
      .string()
      .min(1, "Chief Executive First Name is required"),
    chiefExecutiveLastName: z
      .string()
      .min(1, "Chief Executive Last Name is required"),
    chiefExecutiveDesignation: z
      .string()
      .min(1, "Chief Executive Designation is required"),
    contactPersonTitle: z.string().min(1, "Contact Person Title is required"),
    contactPersonFirstName: z
      .string()
      .min(1, "Contact Person First Name is required"),
    contactPersonLastName: z
      .string()
      .min(1, "Contact Person Last Name is required"),
    contactPersonDesignation: z
      .string()
      .min(1, "Contact Person Designation is required"),

    // Step 2: Contact Details
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    stateProvinceRegion: z.string().min(1, "State/Province/Region is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal Code is required"),
    telephone: z.string().min(1, "Telephone is required"),
    fax: z.string().min(1, "Fax is required"),
    mobile: z
      .string()
      .min(1, "Mobile Number is required")
      .regex(phoneRegex, "Invalid mobile number"),
    emailAddress: z
      .string()
      .min(1, "Email Address is required")
      .email("Invalid email address"),
    alternateEmailAddress: z.string().optional(),
    website: z.string().optional(),
    panNoInput: z
      .string()
      .min(1, "PAN is required")
      .regex(panRegex, "Invalid PAN format"),
    gstNumber: z.string().min(1, "GST Number is required"),
    isExporter: z.enum(["yes", "no"], {
      required_error: "Please select ",
    }),
    iecCode: z.string().optional(),
    reason: z.string().optional(),
    correspondenceAddress: z.string().optional(),

    // Step 3: Exhibitor Information
    hallNo: z.string().optional(),
    stallNo: z.string().optional(),
    areaRequired: z.string().optional(),
    areaOfInterest: z.string().optional(),
    listOfProducts: z.string().optional(),
  })
  .refine(
    (data) =>
      !(
        data.isExporter === "yes" &&
        (!data.iecCode || data.iecCode.trim() === "")
      ),
    {
      message: "IEC Code is required if you select 'Yes'",
      path: ["iecCode"],
    }
  );

// Define fields for each step to trigger validation
const stepFields = {
  1: [
    "profilePhoto",
    "companyName",
    "chiefExecutiveTitle",
    "chiefExecutiveFirstName",
    "chiefExecutiveLastName",
    "chiefExecutiveDesignation",
    "contactPersonTitle",
    "contactPersonFirstName",
    "contactPersonLastName",
    "contactPersonDesignation",
  ],
  2: [
    "addressLine1",
    "addressLine2",
    "country",
    "stateProvinceRegion",
    "city",
    "postalCode",
    "telephone",
    "fax",
    "mobile",
    "emailAddress",
    "alternateEmailAddress",
    "website",
    "panNoInput",
    "gstNumber",
    "isExporter",
    "iecCode",
    "reason",
    "correspondenceAddress",
  ],
  3: ["hallNo", "stallNo", "areaRequired", "areaOfInterest", "listOfProducts"],
};

const ExhibitorRegistration = () => {
  const [steps, setSteps] = useState([
    { id: 1, label: "Contact Information", completed: false },
    { id: 2, label: "Corporate Address", completed: false },
    { id: 3, label: "Exhibitor Information", completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [totalCost, setTotalCost] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const { setAmount } = usePrice();

  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    control, // For controlled components like MUI select or custom radio/checkbox groups if needed
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      profilePhoto: undefined,
      companyName: "",
      chiefExecutiveTitle: "",
      chiefExecutiveFirstName: "",
      chiefExecutiveLastName: "",
      chiefExecutiveDesignation: "",
      contactPersonTitle: "",
      contactPersonFirstName: "",
      contactPersonLastName: "",
      contactPersonDesignation: "",

      // Step 2: Corporate Address
      addressLine1: "",
      addressLine2: "",
      country: "",
      stateProvinceRegion: "",
      city: "",
      postalCode: "",
      telephone: "",
      fax: "",
      mobile: "",
      emailAddress: "",
      alternateEmailAddress: "",
      website: "",
      panNoInput: "",
      gstNumber: "",
      isExporter: "",
      iecCode: "",
      reason: "",
      correspondenceAddress: "",

      // Step 3: Exhibitor Information
      hallNo: "",
      stallNo: "",
      areaRequired: "",
      areaOfInterest: "",
      listOfProducts: "",
    },
  });

  // const watchedHasGstNumber = watch("hasGstNumber");
  const watchedIsExporter = watch("isExporter");
  // const watchedBookingViaAssociation = watch("bookingViaAssociation");
  // const watchedRegisteredWithMsme = watch("registeredWithMsme");
  // const watchedBoothTypePreference = watch("boothTypePreference");
  // const watchedTotalAreaRequired = watch("totalAreaRequired");

  // useEffect(() => {
  //   const area = parseFloat(watchedTotalAreaRequired);
  //   if (!isNaN(area) && area > 0 && watchedBoothTypePreference) {
  //     let rate = 0;
  //     if (watchedBoothTypePreference === "pre_fitted") rate = 7000;
  //     else if (watchedBoothTypePreference === "space_only") rate = 6500;
  //     setTotalCost(rate * area);
  //   } else {
  //     setTotalCost(0);
  //   }
  // }, [watchedBoothTypePreference, watchedTotalAreaRequired]);

  const handleGoToNextStep = async () => {
    console.log(currentStep.id);
    const fieldsToValidate = stepFields[currentStep.id];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === currentStep.id ? { ...step, completed: true } : step
        )
      );
      const nextStepIndex =
        steps.findIndex((step) => step.id === currentStep.id) + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex]);
      }
      setApiMessage({ type: "", text: "" }); // Clear previous API messages
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Errors will be displayed by react-hook-form
      setApiMessage({
        type: "error",
        text: "Make sure all required fields are filled out correctly.",
      });
      console.log("Validation failed for step " + currentStep.id, errors);
    }
  };

  const handleGoToPrevStep = () => {
    const prevStepIndex =
      steps.findIndex((step) => step.id === currentStep.id) - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex]);
      setApiMessage({ type: "", text: "" }); // Clear any API messages
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTimelineStepClick = async (
    targetStep: SetStateAction<{
      id: number;
      label: string;
      completed: boolean;
    }>
  ) => {
    // Allow navigation to already completed steps
    // Or if it's the current step or a previous step that's not necessarily completed yet (e.g. user wants to go back)
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep.id);
    const targetStepIndex = steps.findIndex((s) => s.id === targetStep.id);

    if (targetStep.completed || targetStepIndex <= currentStepIndex) {
      // If going back from a valid step, no need to re-validate current one to go back
      if (targetStepIndex < currentStepIndex) {
        setCurrentStep(targetStep);
        return;
      }
      // If clicking on current or future (but allowed) step, validate current before moving
      const fieldsToValidate = stepFields[currentStep.id];
      const isValid = await trigger(fieldsToValidate);
      if (isValid || targetStep.id === currentStep.id) {
        // Allow staying or if valid
        setCurrentStep(targetStep);
        topRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
    // Do not allow jumping to future, uncompleted steps beyond the next one
  };

  const onSubmitApi = async (formData: z.infer<typeof schema>) => {
    console.log(formData);
    console.log("Jhugyf");
    setApiMessage({ type: "info", text: "Submitting..." });
    setAmount(totalCost);
    const payload = {
      firstName: formData.contactPersonFirstName || "",
      lastName: formData.contactPersonLastName || "",
      phone: formData.mobile || "",
      eventId: 146,
      userCohort: "EXHIBITOR",
      image: "imgUrlPlaceholder",
      email: formData.emailAddress || "",
      companyOrganizationName: formData.companyName || "",
      companyEmail: formData.emailAddress || "",
      companyContact: formData.mobile || "",
      companyAddress: `${formData.addressLine1 || ""}, ${
        formData.city || ""
      }, ${formData.stateProvinceRegion || ""}, ${formData.postalCode || ""}`,
      companyPanNo: formData.panNoInput || "",
      companyGstin: formData.gstNumber || "",
      directorName:
        formData.chiefExecutiveFirstName +
          " " +
          formData.chiefExecutiveLastName || "",
      data: {
        boothDisplayName: formData.companyName || "",
        addressLine1: formData.addressLine1 || "",
        addressLine2: formData.addressLine2 || "",
        city: formData.city || "",
        country: formData.country || "",
        stateProvinceRegion: formData.stateProvinceRegion || "",
        postalCode: formData.postalCode || "",
        hasGstNumber: formData.gstNumber ? "yes" : "no",
        alternateMobileNumber: formData.alternateMobileNumber || "",
        alternateEmailAddress: formData.alternateEmailAddress || "",
        website: formData.website || "",
        contactPersonDesignation: formData.contactPersonDesignation || "",
        bookingViaAssociation: "no",
        associationNumber: "",
        registeredWithMsme: "no",
        msmeNumber: "",
        participatedEarlier: "no",
        productCategory: "",
        departmentCategory: "",
        interestedInSponsorship: "no",
        mainObjectives: "",
        otherObjective: "",
        boothTypePreference: "",
        totalAreaRequired: formData.areaRequired || "",
        calculatedTotalCost: totalCost,
      },
    };

    for (const key in payload.data) {
      if (payload.data[key] === undefined || payload.data[key] === "") {
        delete payload.data[key];
      }
    }
    if (payload.companyGstin === undefined || payload.companyGstin === "") {
      delete payload.companyGstin;
    }

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(
        "https://sit.spicetrade.io/api/auth/register/event",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Submission successful:", result);
        if (result.status === "success") {
          setApiMessage({
            type: "success",
            text: "Registration Successful!",
          });
          // const timer = setTimeout(() => {
          //   navigate(`/payment?email=${formData.emailAddress}`);
          // }, 5000);

          // return () => clearTimeout(timer);
        } else {
          setApiMessage({
            type: "info",
            text: `Registration Failed: ${result.message || "Unknown error"}`,
          });
        }
        // Optionally reset form or redirect
      } else {
        const errorResult = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        console.error("Submission failed:", errorResult);
        setApiMessage({
          type: "error",
          text: `Registration Failed: ${
            errorResult.message || "Unknown error contact eventstrat.ai"
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

  const exhibitorCategories = [
    "Agriculture & Allied Sectors",
    "Aerospace & Defense",
    "Aviation Sector",
    "Khadi Gramodyog Vikas Yojana Umbrella Scheme",
    "Defence Manufacturing Pavilion",
    "Marine Industry",
    "Leather Industry",
    "Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)",
    "Micro & Small Enterprises Cluster Development Programme (MSE-CDP)",
    "Credit Guarantee Scheme for Micro & Small Development of Infrastructure in UP",
    "Namami Gange & Jal Shakti",
    "Digital India Mission",
    "Education Sector",
    "National Manufacturing Competitiveness Programme (NMCP)",
    "E-Commerce",
    "Electronics Industry",
    "ODOP Display",
    "Entrepreneurship and Skill Development Programme (ESDP)",
    "Power Corporation (UP Power Corporation/ NCPL & Others)",
    "Film & Entertainment Industry",
    "Prime Minister's Employment Generation Programme (PMEGP)",
    "Fishery, Animal Husbandry & Dairy",
    "Procurement and Marketing Support (PMS) Scheme",
    "GI Tags Products from Uttar Pradesh-H2C",
    "Renewable Energy, EV & Mines",
    "Glass Industry",
    "Retail Sector",
    "Rural and Urban Development Scheme",
    "Handloom, Handicrafts & Textiles",
    "Sports Sector",
    "STPI (Software Technology Parks of India)",
    "Sugar & Cane Industry",
    "Health & Wellness (AYUSH/ Pharma/Naturophathy/ Diagonostic/Joga/Unani)",
    "Tourism & Hospitality Sector",
    "Highways/Industrial Park/Development Authorities",
    "Toy Association & Clusters of Uttar Pradesh",
    "Horticulture / Food Processing",
    "Transforming India (Atmanirbhar Bharat Abhiyan)",
    "Infra, Engineering & Manufacturing Industry",
    "UP Police Association",
    "International Cooperation (IC) Scheme",
    "Warehouse and Logistics",
    "IT & Smart City Mission, Uttar Pradesh",
    "Water, Sanitation & Waste Water Management",
    "Others (Please Specify)",
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitApi)} className="w-full">
        {" "}
        <div ref={topRef} className="absolute top-0 left-0" />
        {/* Form wraps the content */}
        <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[90vh] rounded-2xl md:w-full xl:w-3/4 mx-auto my-8">
          {" "}
          {/* Centered form */}
          <div className="flex flex-col justify-start gap-3 lg:gap-8 items-center lg:items-start lg:w-2/5 w-full bg-[#B5207E] rounded-t-2xl lg:rounded-2xl lg:pl-5 px-4 py-6 lg:py-12 text-white">
            <h1 className="text-white text-2xl lg:text-3xl font-semibold px-4">
              Register Now
            </h1>
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
                alignItems: { xs: "center", md: "flex-start" }, // Center for horizontal view in mobile
                paddingLeft: { lg: 0 }, // Adjust padding for large screens
                marginLeft: { lg: "10px" }, // Space for dots in large screens
                flexDirection: { xs: "row", md: "column" }, // Horizontal for mobile, vertical for large screens
                overflowX: { xs: "auto", md: "visible" }, // Allow horizontal scrolling in mobile
                "& .MuiTimelineConnector-root": {
                  transform: { xs: "none", md: "none" }, // Ensure connectors are aligned
                },
                alignSelf: { xs: "center", md: "flex-start" }, // Center for horizontal view in mobile
              }}
            >
              {steps.map((step, index) => (
                <TimelineItem
                  key={step.id}
                  sx={{
                    minHeight: { xs: "auto", md: "80px" }, // Adjust height for horizontal mode
                    display: "flex",
                    flexDirection: "row",
                    "& .MuiTimelineContent-root": {
                      marginLeft: "10px", // Space between dot and text
                      paddingTop: "10px", // Align text with dot center
                      paddingLeft: "8px", // MUI default is 16px, reduce if needed
                      paddingRight: "8px",
                    },
                    "& .MuiTimelineSeparator-root": {
                      flexDirection: { xs: "row", md: "column" }, // Align connectors horizontally in mobile
                    },
                  }}
                >
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        width: { xs: "36px", md: "40px" },
                        height: { xs: "36px", md: "40px" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color:
                          step.completed || currentStep.id === step.id
                            ? "#B5207E"
                            : "white",
                        backgroundColor:
                          step.completed || currentStep.id === step.id
                            ? "white"
                            : "transparent",
                        borderColor: "white",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        borderRadius: "50%",
                        cursor:
                          step.completed ||
                          steps.findIndex((s) => s.id === currentStep.id) >=
                            index
                            ? "pointer"
                            : "not-allowed",
                        opacity:
                          step.completed ||
                          currentStep.id === step.id ||
                          steps.findIndex((s) => s.id === currentStep.id) >=
                            index
                            ? 1
                            : 0.5,
                        margin: { xs: "none", lg: 0 }, // Remove default margin if any
                      }}
                      variant={
                        step.completed || currentStep.id === step.id
                          ? "filled"
                          : "outlined"
                      }
                      onClick={() => {
                        const targetStepObj = steps.find(
                          (s) => s.id === step.id
                        );
                        if (targetStepObj)
                          handleTimelineStepClick(targetStepObj);
                      }}
                    >
                      {step.completed && currentStep.id !== step.id ? (
                        <CheckIcon
                          sx={{ color: "#B5207E", fontSize: "20px" }}
                        />
                      ) : (
                        step.id
                      )}
                    </TimelineDot>
                    {index < steps.length - 1 && (
                      <TimelineConnector
                        sx={{
                          backgroundColor: "white",
                          opacity: step.completed ? 1 : 0.5,
                          width: {
                            xs: "26px",
                            md: step.completed ? "2px" : "1px",
                          }, // Horizontal width for mobile
                          height: {
                            xs: step.completed ? "2px" : "1px",
                            md: "40px",
                          }, // Vertical height for large screens
                          flexGrow: 1, // Ensure connector fills space
                        }}
                      />
                    )}
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      color: "white",
                      fontWeight:
                        step.completed || currentStep.id === step.id
                          ? "bold"
                          : "normal",
                      opacity:
                        step.completed ||
                        currentStep.id === step.id ||
                        steps.findIndex((s) => s.id === currentStep.id) >= index
                          ? 1
                          : 0.5,
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor:
                          step.completed ||
                          steps.findIndex((s) => s.id === currentStep.id) >=
                            index
                            ? "pointer"
                            : "not-allowed",
                        "&:hover": {
                          textDecoration:
                            step.completed ||
                            steps.findIndex((s) => s.id === currentStep.id) >=
                              index
                              ? "underline"
                              : "none",
                        },
                      }}
                      onClick={() => {
                        const targetStepObj = steps.find(
                          (s) => s.id === step.id
                        );
                        if (targetStepObj)
                          handleTimelineStepClick(targetStepObj);
                      }}
                    >
                      {step.label}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
          <div className="flex flex-col w-full p-6 lg:p-8">
            {/* Step 1: Exhibitor Information */}
            {currentStep.id === 1 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">
                    Contact Information
                  </h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 1 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("profilePhoto", file);
                          }
                        }}
                        className={`w-full h-13 border bg-white ${
                          errors.profilePhoto
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.profilePhoto && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.profilePhoto.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Company/Organization Name*
                      </label>
                      <input
                        type="text"
                        {...register("companyName")}
                        placeholder="Enter Company/Organization Name"
                        className={`w-full h-13 border bg-white ${
                          errors.companyName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Chief Executive Title*
                      </label>
                      <input
                        type="text"
                        {...register("chiefExecutiveTitle")}
                        placeholder="Enter Chief Executive Title"
                        className={`w-full h-13 border bg-white ${
                          errors.chiefExecutiveTitle
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.chiefExecutiveTitle && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.chiefExecutiveTitle.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Chief Executive First Name*
                      </label>
                      <input
                        type="text"
                        {...register("chiefExecutiveFirstName")}
                        placeholder="Enter Chief Executive First Name"
                        className={`w-full h-13 border bg-white ${
                          errors.chiefExecutiveFirstName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.chiefExecutiveFirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.chiefExecutiveFirstName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Chief Executive Last Name*
                      </label>
                      <input
                        type="text"
                        {...register("chiefExecutiveLastName")}
                        placeholder="Enter Chief Executive Last Name*"
                        className={`w-full h-13 border bg-white ${
                          errors.chiefExecutiveLastName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.chiefExecutiveLastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.chiefExecutiveLastName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Chief Executive Designation*
                      </label>
                      <input
                        type="text"
                        {...register("chiefExecutiveDesignation")}
                        placeholder="Enter Chief Executive Designation*"
                        className={`w-full h-13 border bg-white ${
                          errors.chiefExecutiveDesignation
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.chiefExecutiveDesignation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.chiefExecutiveDesignation.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 4 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person Title*
                      </label>
                      <input
                        type="text"
                        {...register("contactPersonTitle")}
                        placeholder="Enter Contact Person Title*"
                        className={`w-full h-13 border bg-white ${
                          errors.contactPersonTitle
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.contactPersonTitle && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonTitle.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person First Name*
                      </label>
                      <input
                        type="text"
                        {...register("contactPersonFirstName")}
                        placeholder="Enter Contact Person First Name"
                        className={`w-full h-13 border bg-white ${
                          errors.website ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.contactPersonFirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonFirstName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person Last Name*
                      </label>
                      <input
                        type="text"
                        {...register("contactPersonLastName")}
                        placeholder="Enter Contact Person Last Name"
                        className={`w-full h-13 border bg-white ${
                          errors.contactPersonLastName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.contactPersonLastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonLastName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person Designation*
                      </label>
                      <input
                        type="text"
                        {...register("contactPersonDesignation")}
                        placeholder="Enter Contact Person Designation"
                        className={`w-full h-13 border bg-white ${
                          errors.contactPersonDesignation
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.contactPersonDesignation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonDesignation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Contact Details */}
            {currentStep.id === 2 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4 mt-4">
                    Corporate Address
                  </h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 2 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Address Line 1*
                      </label>
                      <input
                        type="text"
                        {...register("addressLine1")}
                        placeholder="Enter Street Address"
                        className={`w-full h-13 border bg-white ${
                          errors.addressLine1
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.addressLine1.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        {...register("addressLine2")}
                        placeholder="Enter Floor / Suite / Unit"
                        className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]"
                      />
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Country*
                      </label>
                      <CountrySelect
                        placeholder="Enter Country"
                        className={`w-full h-13 border bg-white ${
                          errors.country ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
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
                    <div className="mb-4 w-full md:w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        State / Province / Region*
                      </label>
                      <StateSelect
                        countryid={countryId || 0}
                        placeholder="Enter State or Region"
                        className={`w-full h-13 border bg-white ${
                          errors.stateProvinceRegion
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                        onChange={(selectedState) => {
                          setValue("stateProvinceRegion", selectedState.name, {
                            shouldValidate: true,
                          });
                          setStateId(selectedState.id);
                        }}
                      />
                      {errors.stateProvinceRegion && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.stateProvinceRegion.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        City / Town*
                      </label>
                      <CitySelect
                        countryid={countryId || 0}
                        stateid={stateId || 0}
                        placeholder="Enter City or Town"
                        className={`w-full h-13 border bg-white ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                        onChange={(selectedCity) =>
                          setValue("city", selectedCity.name, {
                            shouldValidate: true,
                          })
                        }
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/3">
                      <label className="block text-gray-700 font-medium mb-2">
                        Postal Code / ZIP Code*
                      </label>
                      <input
                        type="text"
                        {...register("postalCode")}
                        placeholder="Enter Postal or ZIP Code"
                        className={`w-full h-13 border bg-white ${
                          errors.postalCode
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Telephone
                      </label>
                      <input
                        type="text"
                        {...register("telephone")}
                        placeholder="Enter Telephone"
                        className={`w-full h-13 border bg-white ${
                          errors.telephone
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.telephone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.telephone.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Fax
                      </label>
                      <input
                        type="text"
                        {...register("fax")}
                        placeholder="Enter Fax"
                        className={`w-full h-13 border bg-white ${
                          errors.fax ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.fax && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fax.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Mobile*
                      </label>
                      <input
                        type="text"
                        {...register("mobile")}
                        placeholder="Enter Mobile"
                        className={`w-full h-13 border bg-white ${
                          errors.mobile ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.mobile.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        E-Mail*
                      </label>
                      <input
                        type="text"
                        {...register("emailAddress")}
                        placeholder="Enter Email"
                        className={`w-full h-13 border bg-white ${
                          errors.emailAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.emailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.emailAddress.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Alternative Email
                      </label>
                      <input
                        type="text"
                        {...register("alternateEmailAddress")}
                        placeholder="Enter Alternative Email"
                        className={`w-full h-13 border bg-white ${
                          errors.alternateEmailAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.alternateEmailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.alternateEmailAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Website
                      </label>
                      <input
                        type="text"
                        {...register("website")}
                        placeholder="Enter Website"
                        className={`w-full h-13 border bg-white ${
                          errors.website ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        PAN Number*
                      </label>
                      <input
                        type="text"
                        {...register("panNoInput")}
                        placeholder="Enter Company PAN"
                        className={`w-full h-13 border bg-white ${
                          errors.panNoInput
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.panNoInput && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.panNoInput.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        GST Number*
                      </label>
                      <input
                        type="text"
                        {...register("gstNumber")}
                        placeholder="Enter Your GST Number"
                        className={`w-full h-13 border bg-white ${
                          errors.gstNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.gstNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Are you a Exporter?*
                      </label>
                      <select
                        {...register("isExporter")}
                        defaultValue=""
                        className={`w-full h-13 border bg-white ${
                          errors.isExporter
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {errors.isExporter && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.isExporter.message}
                        </p>
                      )}
                    </div>
                    {watchedIsExporter === "yes" && (
                      <div className="mb-4 w-full md:w-1/2">
                        <label className="block text-gray-700 font-medium mb-2">
                          If Yes, Please Specify your IEC Code*
                        </label>
                        <input
                          type="text"
                          {...register("iecCode")}
                          placeholder="Enter Your IEC Code*"
                          className={`w-full h-13 border bg-white ${
                            errors.iecCode
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                        />
                        {errors.iecCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.iecCode.message}
                          </p>
                        )}
                      </div>
                    )}
                    {watchedIsExporter === "no" && (
                      <div className="mb-4 w-full md:w-1/2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Reason for No IEC Code*
                        </label>
                        <input
                          type="text"
                          {...register("reason")}
                          placeholder="Enter Reason for No IEC Code*"
                          className={`w-full h-13 border bg-white ${
                            errors.reason ? "border-red-500" : "border-gray-300"
                          } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                        />
                        {errors.reason && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.reason.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Correspondence Address
                      </label>
                      <input
                        type="text"
                        {...register("correspondenceAddress")}
                        placeholder="Enter Correspondence Address"
                        className={`w-full h-13 border bg-white ${
                          errors.correspondenceAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.correspondenceAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.correspondenceAddress.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Activities */}
            {currentStep.id === 3 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">
                    Exhibitor Information
                  </h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 1 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Hall No.
                      </label>
                      <input
                        type="text"
                        {...register("hallNo")}
                        placeholder="Enter Hall No."
                        className={`w-full h-13 border bg-white ${
                          errors.hallNo ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.hallNo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hallNo.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Stall No.
                      </label>
                      <input
                        type="text"
                        {...register("stallNo")}
                        placeholder="Enter Stall No."
                        className={`w-full h-13 border bg-white ${
                          errors.stallNo ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.stallNo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.stallNo.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Area Required (in sqmt)
                      </label>
                      <input
                        type="text"
                        {...register("areaRequired")}
                        placeholder="Enter Area Required (in sqmt)"
                        className={`w-full h-13 border bg-white ${
                          errors.areaRequired
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.areaRequired && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.areaRequired.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Area of interest
                      </label>
                      <input
                        type="text"
                        {...register("areaOfInterest")}
                        placeholder="Enter Area of interest"
                        className={`w-full h-13 border bg-white ${
                          errors.areaOfInterest
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.areaOfInterest && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.areaOfInterest.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        List of products
                      </label>
                      <input
                        type="text"
                        {...register("listOfProducts")}
                        placeholder="Enter Chief Executive Designation*"
                        className={`w-full h-13 border bg-white ${
                          errors.listOfProducts
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      />
                      {errors.listOfProducts && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.listOfProducts.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* API Message Display */}
            {apiMessage.text && (
              <div
                className={`mt-4 p-3 rounded-md text-center ${
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

            <div className="flex gap-2 justify-between w-full mt-auto pt-6">
              {/* Back Button */}
              {currentStep.id > 1 ? (
                <button
                  type="button"
                  className="bg-[#B5207E]  self-start w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50"
                  onClick={handleGoToPrevStep}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              ) : (
                <div className="hidden lg:block"></div>
              )}

              {/* Next or Submit Button */}
              {currentStep.id < 3 ? (
                <button
                  type="button"
                  className={`bg-[#B5207E] w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50`}
                  onClick={handleGoToNextStep}
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-[#B5207E] self-end w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={() => {
                    const formData = getValues();
                    onSubmitApi(formData);
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Checkout"}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ExhibitorRegistration;
