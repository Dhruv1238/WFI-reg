import axios from "axios";
import { useEffect, useState } from "react";
import { useLoader } from "../context/LoaderContext";
import { API_URL } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";

const Registration = () => {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  const { isLoading, setIsLoading } = useLoader();

  const location = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(location.search).get("code");

  const cohort = new URLSearchParams(location.search).get("cohort");

  console.log(cohort);

  const getCohorts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL + "auth/eventusercohorts/156");
      console.log(response.data.data);
      setCohorts(response.data.data);
      setSelectedCohort(response.data.data[0]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getFormFields = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        API_URL + "auth/getForm/156?userCohort=" + selectedCohort.name
      );
      console.log(res.data.data);
      setFormFields(
        res.data.data
          .filter((field) => field.isActive) // Filter fields with isActive: true
          .sort((a, b) => a.sectionHeader.localeCompare(b.sectionHeader))
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      eventId: 156,
      phone: formValues.phone || "",
      userCohort: selectedCohort.name,
      email: formValues.email || "",
      firstName: formValues.first_name || "",
      lastName: formValues.last_name || "",
      companyOrganizationName: formValues.company_organization_name || "",
      data: formValues,
    };

    code && (requestData.code = code);

    // console.log(requestData);
    setIsLoading(true);
    try {
      const response = await axios.post(
        API_URL + "auth/registerEvent",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data);
      setIsLoading(false);
      if (response?.data?.message === "user already registered") {
        setIsLoading(false);
        alert("You are already registered!, redirecting to payment page");
        // navigate(
        //   `/payment?email=${formValues.email}&userCohort=${selectedCohort.name}`
        // );
      } else {
        setRegistrationCompleted(true);
        if (selectedCohort) {
          // navigate(
          //   `/payment?email=${formValues.email}&userCohort=${selectedCohort.name}`
          // );
        } else {
          window.location.href = "https://upinternationaltradeshow.com/";
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCohorts();
  }, []);

  useEffect(() => {
    if (code) {
      setSelectedCohort(
        cohorts.find((cohort) => cohort.name === "ADDON_PEOPLE")
      );
    }
  }, [cohorts, code]);

  useEffect(() => {
    if (selectedCohort) {
      getFormFields();
    }
  }, [selectedCohort]);

  const sortedSections = Object.entries(
    formFields.reduce((acc, field) => {
      if (!acc[field.sectionHeader]) {
        acc[field.sectionHeader] = [];
      }
      acc[field.sectionHeader].push(field);
      return acc;
    }, {})
  ).sort(([sectionHeaderA], [sectionHeaderB]) => {
    if (sectionHeaderA === "Personal Details") return -1;
    if (sectionHeaderB === "Personal Details") return 1;
    if (sectionHeaderA === "Contact Details") return -1;
    if (sectionHeaderB === "Contact Details") return 1;
    return 0; // Maintain the order of the response for other sections
  });

  useEffect(() => {
    if (cohort) {
      setSelectedCohort(
        cohorts.find((eachCohort) => eachCohort.name === cohort)
      );
    }
  }, [cohort, cohorts]);

  return (
    <>
      {!registrationCompleted ? (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="p-10 mt-20 flex flex-col items-center justify-center mb-24"
        >
          <div className="mb-4 w-full md:w-5xl grid md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-md mb-2 text-start">Select a cohort *</h3>
              <select
                value={selectedCohort?.id || ""}
                {...(code || (cohort && { disabled: true }))}
                onChange={(e) =>
                  setSelectedCohort(
                    cohorts.find(
                      (cohort) => cohort.id === parseInt(e.target.value)
                    )
                  )
                }
                className="p-2 border border-gray-300 rounded bg-white w-full cursor-pointer disabled:cursor-not-allowed"
              >
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="text-md mb-2 text-start">Select a type *</h3>
              <select defaultValue="" className="p-2 border border-gray-300 rounded bg-white w-full cursor-pointer">
                <option value="" disabled>
                  Plese Select
                </option>
                <option value="Individual">Individual</option>
                <option value="Group">B2B Visitor</option>
              </select>
            </div>
          </div>
          <div className="md:w-5xl w-full">
            {sortedSections.map(([sectionHeader, fields]) => (
              <>
                {/* <h3 className="text-3xl text-start mb-4">{sectionHeader}</h3> */}
                <div
                  key={sectionHeader}
                  className="w-full grid md:grid-cols-2 gap-5"
                >
                  {fields.map((field) => (
                    <div key={field.id} className="p-4">
                      <h3 className="text-md mb-2">{field.label}*</h3>
                      {field.kind === "RADIO" ? (
                        field.defaultValue.map((option) => (
                          <div key={option.value}>
                            <input
                              required={field.isRequired}
                              type="radio"
                              name={field.name}
                              value={option.value}
                              className="mr-2"
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                            />
                            <label>{option.label}</label>
                          </div>
                        ))
                      ) : field.kind === "SELECT" ? (
                        <select
                          className="p-2 border border-gray-300 rounded bg-white w-full"
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          required={field.isRequired}
                        >
                          {field.defaultValue.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.kind}
                          className="p-2 border border-gray-300 rounded bg-white w-full"
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          required={field.isRequired}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
          <div className="md:w-5xl w-full mt-4">
            <h3 className="font-semibold mb-2">Visitor's Profile*</h3>
            <h4 className="mb-2">
              An ideal platform for Indian and overseas audiences, business
              visitors, and other stakeholders who are associated directly or
              indirectly with the development model of the state of Uttar
              Pradesh. Here's a brief glance:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                "Buying Agents",
                "Investors",
                "Corporates",
                "Marketing Professionals",
                "Distributors",
                "Overseas Buyers, Importers & Wholesalers",
                "Domestic Buyers",
                "Retail Stores",
                "E-commerce",
                "Think Tanks",
                "Exporters",
                "Traders",
                "Institutional Buyers",
                "Other",
              ].map((profile) => (
                <label
                  key={profile}
                  className="flex items-center justify-between space-x-2 shadow-lg p-3 rounded"
                >
                  <span>{profile}</span>
                  <input
                    type="checkbox"
                    value={profile}
                    className="form-checkbox"
                  />
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="mt-10 p-2 w-full md:w-5xl cursor-pointer bg-[#FF4D2D] text-white rounded disabled:cursor-not-allowed"
            {...(selectedCohort?.name === "ADDON_PEOPLE" &&
              !code && { disabled: true })}
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="tick-mark-container">
            <div className="tick-mark-circle">
              <div className="tick-mark">&#10003;</div>
            </div>
            <p className="text-center mt-4">
              Registration Completed. Check your mail for further steps! you
              will be redirected shortly!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Registration;
