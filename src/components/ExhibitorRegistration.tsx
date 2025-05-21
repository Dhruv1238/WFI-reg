import { useState, useEffect, SetStateAction, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckIcon from "@mui/icons-material/Check";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import { useNavigate } from "react-router-dom";
// import { usePrice } from "../context/Price";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

import "react-country-state-city/dist/react-country-state-city.css";
import { Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

// Define Zod schema for validation
const phoneRegex = /^[+]?[0-9]{10,15}$/; // Basic phone regex, adjust as needed
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // Basic PAN regex
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

let formData = { isExporter: "", recommendedBy: "", scheme: "" };

const schema = z
  .object({
    // Step 1: Referral Information
    recommendedBy: z.string().min(1, "Please select who recommended you"),
    profileBrief: z
      .string()
      .min(1, "Please provide a profile brief")
      .refine((val) => {
        const wordCount = val
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
        return wordCount <= 200;
      }, "Profile brief must not exceed 200 words"),
    // Step 1: Contact Information
    profilePhoto: z
      .any()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith("image/")),
        "Please upload a valid image file"
      )
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
        "File size should be less than 5MB"
      ),
    companyName: z.string().min(1, "Company/Organization Name is required"),
    contactPersonTitle: z.enum(["Mr", "Mrs", "Ms", "Dr", "Prof"], {
      required_error: "Please select a title",
    }),
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
    telephone: z.string().optional(),
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
      .refine((val) => {
        return panRegex.test(val);
      }, "Invalid PAN number "),
    gstNumber: z.string().refine((val) => {
      if (!val) return true;
      return gstRegex.test(val);
    }, "Invalid GST number "),
    hasNoGst: z.boolean(),
    gstFile: z
      .any()
      .refine(
        (file) =>
          !file ||
          (file instanceof File &&
            (file.type === "application/pdf" ||
              file.type.startsWith("image/"))),
        "Please upload a valid PDF or image file"
      )
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
        "File size should be less than 5MB"
      ),
    isExporter: z.enum(["yes", "no"], {
      required_error: "Please select ",
    }),
    iecCode: z.string().refine((val) => {
      if (formData.isExporter === "yes") {
        return val && val.length > 0;
      }
      return true;
    }, "IEC Code is required when you are an exporter"),
    correspondenceAddress: z.string().optional(),
    billingAddressLine1: z
      .string()
      .optional()
      .refine((val) => {
        if (formData.recommendedBy === "Sea food export association") {
          return true;
        }
        return val && val.length > 0;
      }, "Billing Address Line 1 is required"),
    billingAddressLine2: z.string().optional(),
    billingCity: z
      .string()
      .optional()
      .refine((val) => {
        if (formData.recommendedBy === "Sea food export association") {
          return true;
        }
        return val && val.length > 0;
      }, "Billing City is required"),
    billingCountry: z
      .string()
      .optional()
      .refine((val) => {
        if (formData.recommendedBy === "Sea food export association") {
          return true;
        }
        return val && val.length > 0;
      }, "Billing Country is required"),
    billingStateProvinceRegion: z
      .string()
      .optional()
      .refine((val) => {
        if (formData.recommendedBy === "Sea food export association") {
          return true;
        }
        return val && val.length > 0;
      }, "Billing State/Province/Region is required"),
    billingPostalCode: z
      .string()
      .optional()
      .refine((val) => {
        if (formData.recommendedBy === "Sea food export association") {
          return true;
        }
        return val && val.length > 0;
      }, "Billing Postal Code is required"),

    // Step 3: Exhibitor Information
    hallNo: z.string().min(1, "Hall No. is required"),
    stallNo: z.string().min(1, "Stall No. is required"),
    areaRequired: z
      .string()
      .min(1, "Area Required is required")
      .refine(
        (val) => {
          const numVal = Number(val);
          if (formData.scheme === "bare") {
            return !isNaN(numVal) && numVal >= 6;
          }
          return true;
        },
        {
          message: "For Bare scheme, area must be at least 6 square meters",
        }
      )
      .refine(
        (val) => {
          const numVal = Number(val);
          if (formData.scheme === "shell") {
            return !isNaN(numVal) && numVal >= 6;
          }
          return true;
        },
        {
          message: "For Shell scheme, area must be at least 6 square meters",
        }
      )
      .transform((val) => Number(val)),
    areaOfInterest: z.string().optional(),
    productCategory: z
      .array(z.string())
      .min(1, "At least one Product Category is required"),
    productSubCategory: z
      .array(z.string())
      .min(1, "At least one Product Sub-Category is required"),
    scheme: z.enum(["bare", "shell"], {
      required_error: "Please select a scheme",
    }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to proceed",
    }),
  })
  .refine(
    (data) => {
      return (
        data.hasNoGst === true ||
        (data.gstNumber && gstRegex.test(data.gstNumber))
      );
    },
    {
      message:
        "Either provide a valid GST number or check 'I do not have a GST certificate'",
      path: ["gstNumber"],
    }
  );

// Define fields for each step to trigger validation
const stepFields = {
  1: ["recommendedBy"],
  2: [
    "profilePhoto",
    "companyName",
    "contactPersonTitle",
    "contactPersonFirstName",
    "contactPersonLastName",
    "contactPersonDesignation",
    "profileBrief",
  ],
  3: [
    "addressLine1",
    "addressLine2",
    "country",
    "stateProvinceRegion",
    "city",
    "postalCode",
    "telephone",
    "mobile",
    "emailAddress",
    "alternateEmailAddress",
    "website",
    "panNoInput",
    "hasNoGst",
    "gstNumber",
    "gstFile",
    "isExporter",
    "iecCode",
    "correspondenceAddress",
    "billingAddressLine1",
    "billingAddressLine2",
    "billingCity",
    "billingCountry",
    "billingStateProvinceRegion",
    "billingPostalCode",
  ],
  4: [
    "hallNo",
    "stallNo",
    "areaRequired",
    "areaOfInterest",
    "productCategory",
    "productSubCategory",
    "scheme",
    "termsAccepted",
  ],
};

interface FilePreview {
  file: File;
  preview: string;
}

const FileUploadBox = ({
  label,
  accept,
  error,
  onChange,
  preview,
  onDelete,
  helperText,
  errorMessage,
  disabled,
}: {
  label: string;
  accept: string;
  error?: boolean;
  onChange: (file: File) => void;
  preview?: string;
  onDelete?: () => void;
  helperText?: string;
  errorMessage?: string;
  disabled: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string>();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndHandleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setLocalError("File size should be less than 5MB");
      return;
    }
    setLocalError(undefined);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
      const file = files[0];
      if (file.type.match(accept.replace(/\*/g, ".*"))) {
        validateAndHandleFile(file);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          ${
            isDragging
              ? "border-[#B5207E] bg-pink-50"
              : error
              ? "border-red-500"
              : "border-gray-300"
          }
          ${
            preview ? "bg-gray-50" : "hover:bg-gray-50"
          } transition-colors duration-200`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 mx-auto rounded"
            />
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setLocalError(undefined);
                }}
                className="absolute top-0 right-0 p-1 bg-[#B5207E] text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 py-4">
            <CloudUploadIcon sx={{ fontSize: 40, color: "#B5207E" }} />
            <div className="text-sm text-gray-600">
              Drag and drop your file here or click to browse
            </div>
            <div className="text-xs text-gray-500">{helperText}</div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndHandleFile(file);
        }}
        className="hidden"
      />
      {(localError || errorMessage) && (
        <p className="text-red-500 text-sm mt-1">
          {localError || errorMessage}
        </p>
      )}
    </div>
  );
};

const hallOptions = {
  groundFloor: ["Hall 2", "Hall 3", "Hall 4", "Hall 5", "Hall 6", "Hall 14"],
  firstFloor: ["Hall 2", "Hall 3", "Hall 4", "Hall 5"],
  hangers: ["Hanger 1", "Hanger 2", "Hanger 3"],
};

const productList = {
  "Agri Products": [
    "Fresh and Natural Products",
    "Raw Materials eg. Rice,Pulses.",
  ],
  "Meat and Poultry": [
    "Meat Products",
    "Preserves Containing Meat",
    "Meat-based convenience products",
    "Poultry Products",
    "Halal Food",
  ],
  "Plant Based": ["Plant Based."],
  Dairy: [
    "Milk and Dairy Products",
    "Cream and cream products",
    "Cheese",
    "Butter",
    "Desserts",
    "Dried milk products",
    "Frozen Dairy products",
    "Lactose -free milk & dairy products",
  ],
  "Drinks & Hot beverages": [
    "Heath-promoting drinks",
    "Energy drinks",
    "Soft Drinks",
    "Juices",
    "Coffee & tea",
    "Beer & mixed beer drinks",
    "Wine and sparkling wine",
    "Spirits",
  ],
  "Fine Food": [
    "General Provisions and staple food",
    "Nutrients",
    "Canned Food",
    "Ready-meals and soup products",
    "Delicatessen sauces & seasonings",
    "Dried fruit and vegetables",
    "Oils and Fats",
  ],
  Organic: ["Organic food in general", "Natural", "Minimally processed"],
  "Bread and Bakery": [
    "Bread",
    "Baked goods",
    "Cakes and pastry",
    "Small baked rolls",
    "Long-life baked goods",
    "Spreads",
  ],
  "Sweets & Snacks": ["Chocolate", "Confectionary", "Biscuits and Snacks"],
  "Food Service": [
    "Cooking",
    "Technology",
    "Equipment & services",
    "Catering & hotel areas",
  ],
  "Associations, Organisations, Press": [
    "Associations and Organizations",
    "Trade Press",
    "Services, IT",
  ],
  "Marine products": ["Fish"],
};

const ExhibitorRegistration = () => {
  const [steps, setSteps] = useState([
    { id: 1, label: "Referral Information", completed: false },
    { id: 2, label: "Contact Information", completed: false },
    { id: 3, label: "Corporate Address", completed: false },
    { id: 4, label: "Exhibitor Information", completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [totalCost, setTotalCost] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  // const { setAmount } = usePrice();

  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [phoneCountry, setPhoneCountry] = useState("in"); // Default to India

  // Add these state variables after other useState declarations
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);

      setPhoneCountry(selectedCountry.isoCode.toLowerCase());
      if (
        !selectedState ||
        !countryStates.some((state) => state.isoCode === selectedState.isoCode)
      ) {
        setSelectedState(null);
        setSelectedCity(null);
        setCities([]);
      }
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      );
      setCities(stateCities);
      if (
        !selectedCity ||
        !stateCities.some((city) => city.name === selectedCity.name)
      ) {
        setSelectedCity(null);
      }
    }
  }, [selectedCountry, selectedState]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    control, // For controlled components like MUI select or custom radio/checkbox groups if needed
    getValues,
    setValue,
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      recommendedBy: "",
      profileBrief: "",
      profilePhoto: undefined,
      companyName: "",
      contactPersonTitle: undefined,
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
      mobile: "",
      emailAddress: "",
      alternateEmailAddress: "",
      website: "",
      panNoInput: "",
      gstNumber: "",

      hasNoGst: false,
      gstFile: undefined,
      isExporter: undefined,
      iecCode: "",
      correspondenceAddress: "",
      billingAddressLine1: "",
      billingAddressLine2: "",
      billingCity: "",
      billingCountry: "",
      billingStateProvinceRegion: "",
      billingPostalCode: "",

      // Step 3: Exhibitor Information
      hallNo: "",
      stallNo: "",
      areaRequired: "",
      areaOfInterest: "",
      productCategory: [],
      productSubCategory: [],
      scheme: undefined,
      termsAccepted: false,
    },
  });

  // const watchedHasGstNumber = watch("hasGstNumber");
  const watchedIsExporter = watch("isExporter");
  const watchedRecommendedBy = watch("recommendedBy");
  const watchedScheme = watch("scheme");

  // Update formData when values change
  useEffect(() => {
    formData.isExporter = watchedIsExporter;
    formData.recommendedBy = watchedRecommendedBy;
    formData.scheme = watchedScheme;
  }, [watchedIsExporter, watchedRecommendedBy, watchedScheme]);

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

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    const URL = `https://sit.spicetrade.io/api/auth/api/file/upload`;
    formData.append("file", file);

    try {
      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File upload response:", response);

      return response.data;
    } catch (err: any) {
      console.error("File upload error:", err);
      return err;
    }
  };

  const onSubmitApi = async (formData: z.infer<typeof schema>) => {
    const isValid = await trigger();
    if (!isValid) {
      setApiMessage({
        type: "error",
        text: "Please fill all fields correctly",
      });
      return;
    }

    if (formData.profilePhoto instanceof File) {
      try {
        const uploadResponse = await uploadFile(formData.profilePhoto);
        console.log("aaaaaaaaa : ", uploadResponse);
        formData.profilePhoto = uploadResponse.data.storeUrl;
      } catch (error) {
        console.error("Logo upload failed:", error);
        setApiMessage({
          type: "error",
          text: `Profile Upload failed:. ${error.message}`,
        });
        return;
      }
    }

    if (formData.gstFile instanceof File) {
      try {
        const uploadResponse = await uploadFile(formData.gstFile);
        console.log("aaaaaaaaa : ", uploadResponse);
        formData.gstFile = uploadResponse.data.storeUrl;
      } catch (error) {
        console.error("Gst file upload failed:", error);
        setApiMessage({
          type: "error",
          text: `Gst file Upload failed:. ${error.message}`,
        });
        return;
      }
    }

    console.log(formData);

    console.log("Jhugyf");
    setApiMessage({ type: "info", text: "Submitting..." });
    // setAmount(totalCost);
    const payload = {
      firstName: formData.contactPersonFirstName || "",
      lastName: formData.contactPersonLastName || "",
      phone: formData.mobile || "",
      eventId: 146,
      userCohort: "EXHIBITOR",
      // image: formData.profilePhoto,
      imgUrl: formData.profilePhoto,
      email: formData.emailAddress || "",
      companyOrganizationName: formData.companyName || "",
      companyEmail: formData.emailAddress || "",
      companyContact: formData.mobile || "",
      companyAddress: `${formData.addressLine1 || ""}, ${
        formData.city || ""
      }, ${formData.stateProvinceRegion || ""}, ${formData.country || ""}, ${
        formData.postalCode || ""
      }`,
      companyPanNo: formData.panNoInput || "",
      companyGstin: formData.gstNumber || "",
      directorName: "",
      data: {
        profileBrief: formData.profileBrief || "",
        contactPersonFullName:
          formData.contactPersonTitle +
            " " +
            formData.contactPersonFirstName +
            " " +
            formData.contactPersonLastName || "",
        contactPersonDesignation: formData.contactPersonDesignation || "",
        alternateEmailAddress: formData.alternateEmailAddress || "",
        telephone: formData.telephone || "",
        website: formData.website || "",
        hasGSTNumber: formData.gstNumber ? "yes" : "no",
        hasPanNumber: formData.panNoInput ? "yes" : "no",
        gstFile: formData.gstFile || "",
        isExporter: formData.isExporter || "",
        iecCode: formData.isExporter === "yes" ? formData.iecCode : "",
        correspondenceAddress: formData.correspondenceAddress || "",
        hallNo: formData.hallNo || "",
        stallNo: formData.stallNo || "",
        scheme: formData.scheme || "",
        termsAccepted: formData.termsAccepted || false,
        productCategory: formData.productCategory || [],
        productSubCategory: formData.productSubCategory || [],
        recommendedBy: formData.recommendedBy || "",
        areaRequired: Number(formData.areaRequired) || "",

        billingAddressLine1: formData.billingAddressLine1 || "",
        billingAddressLine2: formData.billingAddressLine2 || "",
        billingCity: formData.billingCity || "",
        billingCountry: formData.billingCountry || "",
        billingPostalCode: formData.billingPostalCode || "",
        billingStateProvinceRegion: formData.billingStateProvinceRegion || "",
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
          // }, 5000);
          navigate(`/thankyou`);

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

  const [profilePreview, setProfilePreview] = useState<string | undefined>();
  const [gstFilePreview, setGstFilePreview] = useState<string | undefined>();

  const handleFilePreview = (
    file: File,
    setPreview: (preview: string) => void
  ) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      setPreview("/pdf-icon.png"); // You can add a PDF icon in your public folder
    }
  };

  const [billingAddressSame, setBillingAddressSame] = useState(false);
  const [selectedBillingCountry, setSelectedBillingCountry] =
    useState<ICountry | null>(null);
  const [selectedBillingState, setSelectedBillingState] =
    useState<IState | null>(null);
  const [selectedBillingCity, setSelectedBillingCity] = useState<ICity | null>(
    null
  );
  const [billingStates, setBillingStates] = useState<IState[]>([]);
  const [billingCities, setBillingCities] = useState<ICity[]>([]);

  useEffect(() => {
    const hasNoGst = watch("hasNoGst");
    if (hasNoGst) {
      setValue("gstNumber", "");
      setValue("gstFile", undefined);
      setGstFilePreview(undefined);
    }
  }, [watch("hasNoGst"), setValue]);

  useEffect(() => {
    if (billingAddressSame) {
      const businessAddress = {
        addressLine1: getValues("addressLine1"),
        addressLine2: getValues("addressLine2"),
        city: getValues("city"),
        country: getValues("country"),
        stateProvinceRegion: getValues("stateProvinceRegion"),
        postalCode: getValues("postalCode"),
      };

      setValue("billingAddressLine1", businessAddress.addressLine1);
      setValue("billingAddressLine2", businessAddress.addressLine2);
      setValue("billingCity", businessAddress.city);
      setValue("billingCountry", businessAddress.country);
      setValue(
        "billingStateProvinceRegion",
        businessAddress.stateProvinceRegion
      );
      setValue("billingPostalCode", businessAddress.postalCode);

      setSelectedBillingCountry(selectedCountry);
      setSelectedBillingState(selectedState);
      setSelectedBillingCity(selectedCity);
      setBillingStates(states);
      setBillingCities(cities);
    }
  }, [
    billingAddressSame,
    getValues,
    setValue,
    selectedCountry,
    selectedState,
    selectedCity,
    states,
    cities,
    watch("postalCode"),
  ]);

  useEffect(() => {
    if (!billingAddressSame) {
      if (selectedBillingCountry) {
        const countryStates = State.getStatesOfCountry(
          selectedBillingCountry.isoCode
        );
        setBillingStates(countryStates);
        if (
          !selectedBillingState ||
          !countryStates.some(
            (state) => state.isoCode === selectedBillingState.isoCode
          )
        ) {
          setSelectedBillingState(null);
          setSelectedBillingCity(null);
          setBillingCities([]);
        }
      }
    }
  }, [selectedBillingCountry, billingAddressSame]);

  useEffect(() => {
    if (!billingAddressSame) {
      if (selectedBillingCountry && selectedBillingState) {
        const stateCities = City.getCitiesOfState(
          selectedBillingCountry.isoCode,
          selectedBillingState.isoCode
        );
        setBillingCities(stateCities);
        if (
          !selectedBillingCity ||
          !stateCities.some((city) => city.name === selectedBillingCity.name)
        ) {
          setSelectedBillingCity(null);
        }
      }
    }
  }, [selectedBillingCountry, selectedBillingState, billingAddressSame]);

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
              Exhibitor Registration
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
            {/* Step 1: Referal Information */}

            {currentStep.id === 1 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">
                    Exhibitor Registration Form
                  </h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  <div className="bg-[#FDF7FA] py-2 rounded-lg w-full mb-6">
                    <h3 className="font-semibold mb-3 text-lg">Instructions</h3>
                    <ul className="list-disc pl-4 space-y-2 text-gray-700">
                      <li>
                        Before filling up this form kindly get in touch with
                        FICCI Officials
                      </li>
                      <li>
                        Registration must be completed in one go with stable
                        internet
                      </li>
                      <li>
                        Please fill correct information as per field given
                      </li>
                      <li>Validate mobile number & email ID</li>
                    </ul>
                  </div>

                  <div className="w-full md:w-1/2 mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Select who recommended you*
                    </label>
                    <select
                      {...register("recommendedBy")}
                      className={`w-full h-13 border bg-white ${
                        errors.recommendedBy
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                    >
                      <option value=""></option>
                      <option value="Ministries">Ministries</option>
                      <option value="States">States</option>
                      <option value="Commodity Boards">Commodity Boards</option>
                      <option value="Associations">Associations</option>
                      <option value="MoFPI Beneficiary">
                        MoFPI Beneficiary
                      </option>
                      <option value="International Pavilion">
                        International Pavilion
                      </option>
                      <option value="Self">Self</option>
                      <option value="Sea food export association">
                        Sea food export association
                      </option>
                    </select>
                    {errors.recommendedBy && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.recommendedBy.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Exhibitor Information */}
            {currentStep.id === 2 && (
              <>
                <div className="flex flex-col items-start h-full w-full">
                  <h2 className="text-2xl font-semibold mb-4">
                    Contact Information
                  </h2>
                  <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  {/* Row 1 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <FileUploadBox
                        label="Company Logo Upload"
                        accept="image/*"
                        error={!!errors.profilePhoto}
                        helperText="Supported formats: JPG, PNG, WEBP (Max 5MB)"
                        preview={profilePreview}
                        errorMessage={errors.profilePhoto?.message}
                        onDelete={() => {
                          setValue("profilePhoto", undefined);
                          setProfilePreview(undefined);
                        }}
                        onChange={(file) => {
                          setValue("profilePhoto", file);
                          handleFilePreview(file, setProfilePreview);
                        }}
                      />
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
                  {/* Row 4 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-4">
                    <div className="mb-4 w-full md:w-1/3">
                      <label className="block text-gray-700 font-medium mb-2">
                        Contact Person Title*
                      </label>
                      <select
                        {...register("contactPersonTitle")}
                        className={`w-full h-13 border bg-white ${
                          errors.contactPersonTitle
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      >
                        <option value=""></option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                      </select>
                      {errors.contactPersonTitle && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactPersonTitle.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/3">
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
                    <div className="mb-4 w-full md:w-1/3">
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
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
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
                    <div className="mb-4 w-full md:w-1/2"></div>
                  </div>

                  <div className="w-full mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Profile Brief (Max 200 words)*
                    </label>
                    <textarea
                      {...register("profileBrief")}
                      placeholder="Enter a brief profile of your company/organization"
                      className={`w-full border bg-white ${
                        errors.profileBrief
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E] min-h-[120px]`}
                    />
                    {errors.profileBrief && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.profileBrief.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {(() => {
                        const briefText = watch("profileBrief") || "";
                        const wordCount = briefText
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length;
                        const isOverLimit = wordCount > 200;
                        return (
                          <span className={isOverLimit ? "text-red-500" : ""}>
                            Words: {wordCount}/200
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Contact Details */}
            {currentStep.id === 3 && (
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
                    <div className="mb-8 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Country*
                      </label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={Country.getAllCountries()}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            value={selectedCountry}
                            onChange={(_, newValue) => {
                              field.onChange(newValue?.name || "");
                              setSelectedCountry(newValue);
                            }}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option.name} ({option.isoCode})
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Country"
                                error={!!errors.country}
                                helperText={errors.country?.message}
                                className={`w-full h-14 border bg-white ${
                                  errors.country
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                              />
                            )}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: errors.country
                                    ? "#EF4444"
                                    : "#D1D5DB",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#B5207E",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#B5207E",
                                  borderWidth: "2px",
                                },
                              },
                              "& .MuiAutocomplete-input": {
                                // padding: "10px 4px !important",
                              },
                              "& .MuiFormHelperText-root.Mui-error": {
                                color: "#B5207E",
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-8 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">
                        State / Province / Region*
                      </label>
                      <Controller
                        name="stateProvinceRegion"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={states}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            value={selectedState}
                            onChange={(_, newValue) => {
                              field.onChange(newValue?.name || "");
                              setSelectedState(newValue);
                            }}
                            disabled={!selectedCountry}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option.name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  selectedCountry
                                    ? "Select State"
                                    : "Select Country First"
                                }
                                error={!!errors.stateProvinceRegion}
                                helperText={errors.stateProvinceRegion?.message}
                                className={`w-full h-14 border bg-white ${
                                  errors.stateProvinceRegion
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: errors.stateProvinceRegion
                                        ? "#EF4444"
                                        : "#D1D5DB",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#B5207E",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#B5207E",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiAutocomplete-input": {
                                    // padding: "10px 4px !important",
                                  },
                                  "& .MuiFormHelperText-root.Mui-error": {
                                    color: "#B5207E",
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-8 w-full md:w-2/4">
                      <label className="block text-gray-700 font-medium mb-2">
                        City / Town*
                      </label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={cities}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            value={selectedCity}
                            onChange={(_, newValue) => {
                              field.onChange(newValue?.name || "");
                              setSelectedCity(newValue);
                            }}
                            disabled={!selectedState}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option.name}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  selectedState
                                    ? "Select City"
                                    : "Select State First"
                                }
                                error={!!errors.city}
                                helperText={errors.city?.message}
                                className={`w-full h-14 border bg-white ${
                                  errors.city
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: errors.city
                                        ? "#EF4444"
                                        : "#D1D5DB",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#B5207E",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#B5207E",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiAutocomplete-input": {
                                    // padding: "10px 4px !important",
                                  },
                                  "& .MuiFormHelperText-root.Mui-error": {
                                    color: "#B5207E",
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-4 w-full md:w-2/4">
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
                        Mobile*
                      </label>
                      <Controller
                        name="mobile"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <PhoneInput
                            country={phoneCountry}
                            value={value}
                            onChange={(phone) => {
                              const formattedPhone = phone.startsWith("+")
                                ? phone
                                : `+${phone}`;
                              onChange(formattedPhone);
                            }}
                            placeholder="Enter Mobile Number"
                            specialLabel=""
                            inputStyle={{
                              width: "100%",
                              height: "53px",
                              borderRadius: "0.125rem",
                              borderColor: error ? "#EF4444" : "#D1D5DB",
                              backgroundColor: "white",
                              fontSize: "1rem",
                              color: "#374151",
                            }}
                            buttonStyle={{
                              backgroundColor: "transparent",
                              borderColor: error ? "#EF4444" : "#D1D5DB",
                              borderRadius: "0.125rem 0 0 0.125rem",
                            }}
                            dropdownStyle={{
                              backgroundColor: "white",
                              color: "#374151",
                            }}
                            containerStyle={{
                              width: "100%",
                            }}
                            inputProps={{
                              onFocus: (e) => {
                                e.target.style.borderColor = "#B5207E";
                                e.target.style.boxShadow =
                                  "0 0 0 2px rgba(181, 32, 126, 1)";
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = error
                                  ? "#EF4444"
                                  : "#D1D5DB";
                                e.target.style.boxShadow = "none";
                              },
                            }}
                          />
                        )}
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
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
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
                    <div className="mb-4 w-full md:w-1/2"></div>
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
                        disabled={watch("hasNoGst")}
                        className={`w-full h-13 border bg-white ${
                          errors.gstNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E] ${
                          watch("hasNoGst") ? "bg-gray-100" : ""
                        }`}
                      />
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            {...register("hasNoGst")}
                            className="form-checkbox h-5 w-5 text-[#B5207E] rounded border-gray-300 focus:ring-[#B5207E]"
                          />
                          <span className="ml-2 text-gray-700">
                            I do not have a GST certificate
                          </span>
                        </label>
                      </div>
                      {errors.gstNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <FileUploadBox
                        label="Upload GST File"
                        accept=".pdf,image/*"
                        error={!!errors.gstFile}
                        helperText="Supported formats: PDF, JPG, PNG (Max 5MB)"
                        preview={gstFilePreview}
                        errorMessage={errors.gstFile?.message}
                        onDelete={() => {
                          setValue("gstFile", undefined);
                          setGstFilePreview(undefined);
                        }}
                        onChange={(file) => {
                          setValue("gstFile", file);
                          handleFilePreview(file, setGstFilePreview);
                        }}
                        disabled={watch("hasNoGst")}
                      />
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
                    {watch("isExporter") === "yes" && (
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
                  </div>

                  {/*<div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
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
                    <div className="mb-4 w-full md:w-1/2"></div>
                  </div>*/}

                  {watchedRecommendedBy !== "Sea food export association" && (
                    <>
                      <div className="mb-4 w-full">
                        <label className="flex items-center text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingAddressSame}
                            onChange={(e) =>
                              setBillingAddressSame(e.target.checked)
                            }
                            className="mr-2 h-5 w-5 accent-[#B5207E]"
                          />
                          <span className="font-medium">
                            Billing address same as above
                          </span>
                        </label>
                      </div>
                      <h2 className="text-2xl font-semibold mb-4 mt-4">
                        Billing Address
                      </h2>
                      <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                      <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                        <div className="mb-4 w-full md:w-1/2">
                          <label className="block text-gray-700 font-medium mb-2">
                            Address Line 1*
                          </label>
                          <input
                            type="text"
                            {...register("billingAddressLine1")}
                            placeholder="Enter Street Address"
                            className={`w-full h-13 border bg-white ${
                              errors.billingAddressLine1
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                          />
                          {errors.billingAddressLine1 && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.billingAddressLine1.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-4 w-full md:w-1/2">
                          <label className="block text-gray-700 font-medium mb-2">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            {...register("billingAddressLine2")}
                            placeholder="Enter Floor / Suite / Unit"
                            className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                        <div className="mb-6 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Country*
                          </label>
                          <Controller
                            name="billingCountry"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                options={Country.getAllCountries()}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                value={selectedBillingCountry}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue?.name || "");
                                  setSelectedBillingCountry(newValue);
                                }}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props}>
                                    {option.name} ({option.isoCode})
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Country"
                                    error={!!errors.billingCountry}
                                    helperText={errors.billingCountry?.message}
                                    className={`w-full h-14 border bg-white ${
                                      errors.billingCountry
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                                  />
                                )}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: errors.billingCountry
                                        ? "#EF4444"
                                        : "#D1D5DB",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#B5207E",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#B5207E",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiAutocomplete-input": {
                                    // padding: "10px 4px !important",
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="mb-6 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            State / Province / Region*
                          </label>
                          <Controller
                            name="billingStateProvinceRegion"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                options={billingStates}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                value={selectedBillingState}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue?.name || "");
                                  setSelectedBillingState(newValue);
                                }}
                                disabled={!selectedBillingCountry}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props}>
                                    {option.name}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder={
                                      selectedBillingCountry
                                        ? "Select State"
                                        : "Select Country First"
                                    }
                                    error={!!errors.billingStateProvinceRegion}
                                    helperText={
                                      errors.billingStateProvinceRegion?.message
                                    }
                                    className={`w-full h-14 border bg-white ${
                                      errors.billingStateProvinceRegion
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                                  />
                                )}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor:
                                        errors.billingStateProvinceRegion
                                          ? "#EF4444"
                                          : "#D1D5DB",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#B5207E",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#B5207E",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiAutocomplete-input": {
                                    // padding: "10px 4px !important",
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                        <div className="mb-8 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            City / Town*
                          </label>
                          <Controller
                            name="billingCity"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                options={billingCities}
                                autoHighlight
                                getOptionLabel={(option) => option.name}
                                value={selectedBillingCity}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue?.name || "");
                                  setSelectedBillingCity(newValue);
                                }}
                                disabled={!selectedBillingState}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props}>
                                    {option.name}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder={
                                      selectedBillingState
                                        ? "Select City"
                                        : "Select State First"
                                    }
                                    error={!!errors.billingCity}
                                    helperText={errors.billingCity?.message}
                                    className={`w-full h-14 border bg-white ${
                                      errors.billingCity
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                                  />
                                )}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: errors.billingCity
                                        ? "#EF4444"
                                        : "#D1D5DB",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#B5207E",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#B5207E",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiAutocomplete-input": {
                                    // padding: "10px 4px !important",
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="mb-8 w-full md:w-2/4">
                          <label className="block text-gray-700 font-medium mb-2">
                            Postal Code / ZIP Code*
                          </label>
                          <input
                            type="text"
                            {...register("billingPostalCode")}
                            placeholder="Enter Postal or ZIP Code"
                            className={`w-full h-13 border bg-white ${
                              errors.billingPostalCode
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                          />
                          {errors.billingPostalCode && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.billingPostalCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Step 4: Activities */}
            {currentStep.id === 4 && (
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
                        Hall No.*
                      </label>
                      <select
                        {...register("hallNo")}
                        className={`w-full h-13 border bg-white ${
                          errors.hallNo ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      >
                        <option value=""></option>
                        <optgroup label="Ground Floor">
                          {hallOptions.groundFloor.map((hall) => (
                            <option
                              key={`ground-${hall}`}
                              value={`Ground Floor ${hall}`}
                            >
                              {hall}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="First Floor">
                          {hallOptions.firstFloor.map((hall) => (
                            <option
                              key={`first-${hall}`}
                              value={`First Floor ${hall}`}
                            >
                              {hall}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Hangers">
                          {hallOptions.hangers.map((hanger) => (
                            <option key={hanger} value={hanger}>
                              {hanger}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.hallNo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hallNo.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Stall No.*
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
                        Scheme*
                      </label>
                      <select
                        {...register("scheme")}
                        className={`w-full h-13 border bg-white ${
                          errors.scheme ? "border-red-500" : "border-gray-300"
                        } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      >
                        <option value=""></option>
                        <option value="bare">Bare</option>
                        <option value="shell">Shell</option>
                      </select>
                      {errors.scheme && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.scheme.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Area Required (in sqmt)*
                      </label>

                      <input
                        type="number"
                        {...register("areaRequired")}
                        placeholder={`Enter area in sqm (minimum ${
                          watchedScheme === "raw"
                            ? "36"
                            : watchedScheme === "shell"
                            ? "6"
                            : "6"
                        })`}
                        min={watchedScheme === "raw" ? "36" : "6"}
                        step="1"
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
                  </div>
                  {/* Row 3 */}

                  {/* Row 4 */}
                  <div className="flex flex-col md:flex-row items-start mb-2 w-full gap-x-20">
                    <div className="mb-4 w-full md:w-1/2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Product Categories*
                      </label>
                      <Controller
                        name="productCategory"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            options={Object.keys(productList)}
                            value={selectedCategories}
                            onChange={(_, newValue) => {
                              setSelectedCategories(newValue);
                              field.onChange(newValue);
                              // Reset subcategories when categories change
                              setSelectedSubCategories([]);
                              setValue("productSubCategory", []);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Product Categories"
                                error={!!errors.productCategory}
                                helperText={errors.productCategory?.message}
                                className={`w-full border bg-white ${
                                  errors.productCategory
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                              />
                            )}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: errors.productCategory
                                    ? "#EF4444"
                                    : "#D1D5DB",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#B5207E",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#B5207E",
                                  borderWidth: "2px",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </div>

                    {selectedCategories.length > 0 && (
                      <div className="mb-4 w-full md:w-1/2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Product Sub-Categories*
                        </label>
                        <Controller
                          name="productSubCategory"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              multiple
                              options={selectedCategories.flatMap(
                                (category) => productList[category] || []
                              )}
                              value={selectedSubCategories}
                              onChange={(_, newValue) => {
                                setSelectedSubCategories(newValue);
                                field.onChange(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Product Sub-Categories"
                                  error={!!errors.productSubCategory}
                                  helperText={
                                    errors.productSubCategory?.message
                                  }
                                  className={`w-full border bg-white ${
                                    errors.productSubCategory
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                                />
                              )}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: errors.productSubCategory
                                      ? "#EF4444"
                                      : "#D1D5DB",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#B5207E",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#B5207E",
                                    borderWidth: "2px",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full mt-6 mb-4">
                  <label className="inline-flex items-start">
                    <input
                      type="checkbox"
                      {...register("termsAccepted")}
                      className="form-checkbox h-5 w-5 text-[#B5207E] rounded border-gray-300 focus:ring-[#B5207E] mt-1"
                    />
                    <span className="ml-2 text-gray-700">
                      * I have carefully read and understood the{" "}
                      <a
                        href="https://sit-event-backend-public.s3.amazonaws.com/event/img/ad_ur/1/1747249013254_Rules___Regulations_for_Exhibitors.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B5207E] underline hover:text-[#8A1861]"
                      >
                        General Exhibitor Rules
                      </a>{" "}
                      and I agree to Terms and Conditions without any
                      reservations whatsoever. I further understand that this
                      Application form is valid only if accompanied by payment
                      as per the specified payment schedule in the{" "}
                      <a
                        href="https://sit-event-backend-public.s3.amazonaws.com/event/img/ad_ur/1/1747249013254_Rules___Regulations_for_Exhibitors.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B5207E] underline hover:text-[#8A1861]"
                      >
                        General Exhibitor Rules
                      </a>{" "}
                      and as detailed under.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.termsAccepted.message}
                    </p>
                  )}
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
              {currentStep.id < 4 ? (
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
                  className={`bg-[#B5207E] self-end w-full lg:w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 hover:scale-105 duration-300 disabled:opacity-50 disabled:hover:scale-100 ${
                    !watch("termsAccepted") && "cursor-not-allowed"
                  }`}
                  disabled={isSubmitting || !watch("termsAccepted")}
                  onClick={() => {
                    const formData = getValues();
                    onSubmitApi(formData);
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Register"}
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
