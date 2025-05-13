import { useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckIcon from "@mui/icons-material/Check"; // Import the Check icon

const Registration = () => {
  const [steps, setSteps] = useState([
    { id: 1, label: "Exhibitor Information", completed: false },
    { id: 2, label: "Contact Details", completed: false },
    { id: 3, label: "Activities", completed: false },
    { id: 4, label: "Objective & Preferences", completed: false },
    { id: 5, label: "Booth Type", completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState({ id: 1, completed: false });
  const [isAssociationYes, setIsAssociationYes] = useState(false);
  const [isMSMEYes, setIsMSMEYes] = useState(false);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => {
      const nextStep = steps.find((step) => step.id === prevStep.id + 1);
      if (nextStep) {
        return { ...nextStep, completed: true };
      }
      return prevStep;
    });
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === currentStep.id ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <>
      <div className="flex flex-row relative bg-[#F6F6F6] min-h-[90vh] rounded-2xl w-3/4">
        <div className="flex flex-col justify-center gap-8 items-start w-2/5 bg-[#FF4421] rounded-2xl pl-5 py-12 text-white">
          <h1 className="text-white text-3xl font-semibold">Register Now</h1>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {steps.map((step, index) => (
              <TimelineItem
                key={step.id}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: step.completed ? "#FF4421" : "white",
                      backgroundColor: step.completed ? "white" : "transparent",
                      borderColor: "white",
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderRadius: "50%",
                      cursor: step.completed ? "pointer" : "not-allowed",
                      opacity:
                        step.completed || currentStep.id === step.id ? 1 : 0.5,
                    }}
                    variant={step.completed ? "filled" : "outlined"}
                    onClick={
                      step.completed ? () => setCurrentStep(step) : undefined
                    }
                  >
                    {step.completed ? (
                      <CheckIcon sx={{ color: "#FF4421", fontSize: "20px" }} />
                    ) : (
                      step.id
                    )}
                  </TimelineDot>
                  {index < steps.length - 1 && (
                    <TimelineConnector
                      sx={{
                        backgroundColor: "white",
                        width: step.completed ? "2px" : "1px",
                        height: "40px",
                      }}
                    />
                  )}
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    color: "white",
                    fontWeight: step.completed ? "bold" : "normal",
                    marginLeft: "10px",
                    marginTop: "14px",
                    opacity:
                      step.completed || currentStep.id === step.id ? 1 : 0.5,
                  }}
                >
                  {step.label}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
        <div className="flex flex-col w-full p-8">
          {currentStep.id === 1 && (
            <>
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">
                  Exhibitor Information
                </h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2 ">
                      Name of the Exhibitor*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Legal Business Name"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Name to appear your booth*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Booth Display Name"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-4">
                  Registered Business Address
                </h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2 ">
                      Address Line 1*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Street Address"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Floor / Suite / Unit"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      City / Town
                    </label>
                    <input
                      type="text"
                      placeholder="Enter City or Town"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      State / Province / Region
                    </label>
                    <input
                      type="text"
                      placeholder="Enter State or Region"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Postal Code / ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Postal or ZIP Code"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>

                {/* Tax Information */}
                <h2 className="text-2xl font-semibold mb-4">Tax Information</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Do you have a GST Number?*
                    </label>
                    <select className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      If Yes, Please Specify your GST Number*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your GST Number"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
              </div>
              <button
                className="bg-[#FF4421] self-end w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 mt-2 hover:scale-105 duration-300"
                onClick={goToNextStep}
              >
                Next
              </button>
            </>
          )}
          {currentStep.id === 2 && (
            <>
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">Contact Details</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2 ">
                      Mobile Number*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Mobile Number"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Alternate Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Alternate Number"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2 ">
                      Email Address*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Email Address"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>

                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Alternate Email Address (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Alternate Email Address"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Website (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Website"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                  <div className="mb-6 w-full">
                    {/* <label className="block text-gray-700 font-medium mb-2">
                  Website (Optional)
                  </label> */}
                    <input
                      type="hidden"
                      placeholder="null"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>

                {/* Tax Information */}
                <h2 className="text-2xl font-semibold mb-4">Contact Person</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Contact Person Name*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Contact Person Name"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Contact Person Designation*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Contact Person Designation"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
              </div>
              <button
                className="bg-[#FF4421] self-end w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 mt-2 hover:scale-105 duration-300"
                onClick={goToNextStep}
              >
                Next
              </button>
            </>
          )}
          {currentStep.id === 3 && (
            <>
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">Activities</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                {/* Association Question */}
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Are you booking via an association?*
                    </label>
                    <select
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                      onChange={(e) =>
                        setIsAssociationYes(e.target.value === "yes")
                      }
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                {isAssociationYes && (
                  <div className="flex flex-row items-center mb-6 w-full gap-20">
                    <div className="mb-6 w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Enter Association Number*
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Association Number"
                        className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                      />
                    </div>
                  </div>
                )}
                {/* MSME Question */}
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Are you registered with MSME?*
                    </label>
                    <select
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                      onChange={(e) => setIsMSMEYes(e.target.value === "yes")}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                {isMSMEYes && (
                  <div className="flex flex-row items-center mb-6 w-full gap-20">
                    <div className="mb-6 w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Enter MSME Number*
                      </label>
                      <input
                        type="text"
                        placeholder="Enter MSME Number"
                        className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Have you have participated in earlier Edition?
                    </label>
                    <select className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                className="bg-[#FF4421] self-end w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 mt-2 hover:scale-105 duration-300"
                onClick={goToNextStep}
              >
                Next
              </button>
            </>
          )}
          {currentStep.id === 4 && (
            <>
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">
                  Objectives & Preferences
                </h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Specify your Product Category*
                    </label>
                    <input
                      type="text"
                      placeholder="Tell us about"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mb-6 w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Which department category do you belong to?*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Department Category"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center w-full gap-20">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Are you interested in sponsorship and branding
                      opportunities at the show?*
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sponsorship"
                          value="yes"
                          className="mr-2 h-10"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sponsorship"
                          value="no"
                          className="mr-2"
                        />
                        No
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sponsorship"
                          value="maybe"
                          className="mr-2"
                        />
                        Maybe
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mb-6 w-full gap-0">
                  <div className="mb-6 w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      What are your main objectives for exhibiting at UPITS
                      2025?*
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="objective"
                          value="generate_leads"
                          className="mr-2"
                        />
                        Generate Leads
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="objective"
                          value="launch_new_product"
                          className="mr-2"
                        />
                        Launch New Product
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="objective"
                          value="brand_visibility"
                          className="mr-2"
                        />
                        Brand Visibility
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="objective"
                          value="market_research"
                          className="mr-2"
                        />
                        Market Research
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="objective"
                          value="explore_partnerships"
                          className="mr-2"
                        />
                        Explore Partnership Opportunities
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="objective"
                          value="networking"
                          className="mr-2"
                        />
                        Network with Industry Professionals
                      </label>
                    </div>
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-gray-500 font-normal mb-2">
                      If other
                    </label>
                    <input
                      type="text"
                      placeholder="Input Text"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                  </div>
                </div>
              </div>
              <button
                className="bg-[#FF4421] self-end w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 mt-2 hover:scale-105 duration-300"
                onClick={goToNextStep}
              >
                Next
              </button>
            </>
          )}
          {currentStep.id === 5 && (
            <>
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">Booth Type</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="w-full my-6">
                  <label className="block text-gray-700 font-medium mb-4">
                    Which type of booth do you prefer?
                  </label>
                  <div className="p-1">
                    <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Booth&nbsp;Type
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Rate&nbsp;(INR/sqm)
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Min.&nbsp;Area
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          What's&nbsp;Included
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b-1 border-gray-300">
                        <td className="py-4 px-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="booth_type"
                              value="pre_fitted"
                              className="mr-2"
                            />
                            Pre-fitted
                          </label>
                        </td>
                        <td className="py-4 px-4">₹7000</td>
                        <td className="py-4 px-4">12 sqm</td>
                        <td className="py-4 px-4">
                          Wall panels, fascia with company name, carpet, 1
                          electricity socket, 1 reception counter, 3 chairs,
                          waste basket, 4 spotlights
                        </td>
                      </tr>
                      <tr className="border-b-1 border-gray-300">
                        <td className="py-4 px-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="booth_type"
                              value="space_only"
                              className="mr-2"
                            />
                            Space&nbsp;Only
                          </label>
                        </td>
                        <td className="py-4 px-4">₹6500</td>
                        <td className="py-4 px-4">36 sqm</td>
                        <td className="py-4 px-4">
                          Bare space only. Electricity @ ₹2250/kw (extra). Setup
                          at your own cost.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-sm text-gray-500 mt-4">
                    Note: All rates are exclusive of 18% GST.
                  </p>
                </div>
                <div className="flex flex-row items-start mb-4 w-full gap-4">
                  {/* Total Area Required */}
                  <div className="w-2/3">
                    <label className="block text-gray-700 font-medium mb-2">
                      Total Area Required?*
                    </label>
                    <input
                      type="number"
                      placeholder="Input text"
                      className="w-full h-13 border bg-white border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF4421]"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the area you require (in sqm), Minimum: 12 sqm for
                      Pre-fitted, 36 sqm for Space Only.
                    </p>
                  </div>

                  {/* Total Cost */}
                  <div className="w-1/3">
                    <label className="block text-gray-700 font-medium mb-2">
                      Total Cost
                    </label>
                    <input
                      type="number"
                      value="0"
                      readOnly
                      className="w-full h-13 border bg-gray-100 border-gray-300 rounded-sm px-4 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Important Guidelines */}
                <div className="mt-4">
                  <h3 className="text-gray-500 font-medium mb-2">
                    Important Guidelines
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-500">
                    <li>
                      Requests for open sides are subject to availability &
                      feasibility.
                    </li>
                    <li>
                      Final booth location is indicative and may change based on
                      safety, commercial, or technical reasons.
                    </li>
                  </ul>
                </div>
              </div>
              <button
                className="bg-[#FF4421] self-end w-40 h-14 text-xl cursor-pointer text-white rounded-full px-4 py-2 mt-2 hover:scale-105 duration-300"
                onClick={goToNextStep}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Registration;
