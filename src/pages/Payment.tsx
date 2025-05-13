import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { useLoader } from "../context/LoaderContext";
import { usePrice } from "../context/Price";
import { API_URL } from "../constants";
import { get, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface PaymentDetails {
  amount: number;
  companyName: string;
  directorName: string;
  eventId: number;
  exhibitorId: number;
  supportEmail: string;
}

interface TransactionDetail {
  email: string;
  eventId: number;
  finalAmount: string; // Stored as a string in the data
  actualAmount: string; // Stored as a string in the data
  gst: string; // Stored as a string in the data
  paymentMethod: string;
  orderId: string;
  paymentStatus: string;
  paymentOption: string | null; // Nullable field
}

interface TransactionsData {
  totalAmount: number | null; // Nullable field
  paymentDetails: TransactionDetail[];
}

// Define Zod schema for offline payment form validation

function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

const PaymentPage = () => {
  const location = useLocation();
  const { setIsLoading } = useLoader();
  const [totalPrice, setTotalPrice] = useState(0);
  const [postGstPrice, setPostGstPrice] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [transactions, setTransactions] = useState<TransactionsData | null>(
    null
  );
  const [gstAmount, setGstAmount] = useState(0); // State for GST amount
  const [paymentMode, setPaymentMode] = useState(""); // Track selected payment mode
  const [otherDetails, setOtherDetails] = useState(""); // State for "Other" input
  const [showOfflineForm, setShowOfflineForm] = useState(false); // State to control offline form visibility
  const [paymentStatus, setPaymentStatus] = useState("");
  const [onlineAmount, setOnlineAmount] = useState<number>();
  const [amountError, setAmountError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const offlinePaymentSchema = z.object({
    inititalAmount: z
      .number()
      .min(0, "Amount must be greater than 25%")
      .max(postGstPrice, "Amount must be less than 1,000,000"),
    paymentMode: z
      .enum(["bank_transfer", "cheque", "upi", "other"])
      .refine((val) => !!val, {
        message: "Select a payment mode",
      }),
    orderId: z.string().min(1, "Required"), // Ensure orderId is always required
    finalAmount: z
      .number()
      .max(postGstPrice, "Amount must be less than " + postGstPrice)
      .refine((val) => !!val, {
        message: "This field is required",
      }),
    confirmOrderId: z.string().refine((val) => val === getValues("orderId"), {
      message: "Order ID does not match",
    }),
    confirmOfflineAmount: z
      .number()
      .refine((val) => val === getValues("finalAmount"), {
        message: "Amount does not match",
      }),
  });

  const [steps, setSteps] = useState([
    { id: 1, label: "Exhibitor Information", completed: true },
    { id: 2, label: "Contact Details", completed: true },
    { id: 3, label: "Activities", completed: true },
    { id: 4, label: "Objective & Preferences", completed: true },
    { id: 5, label: "Booth Type", completed: true },
    { id: 6, label: "Payment Details", completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(steps[5]);

  const navigate = useNavigate();

  // Extract query parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const { Razorpay } = useRazorpay();

  console.log("Email: ", email);

  useEffect(() => {
    if (!email) {
      console.error("Email not found in query parameters");
      return;
    }
    getPaymentDetails();
    verifyPaymentStatus();
    getTrasactionHistory();
  }, [email]);

  const getPaymentDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        API_URL + "pub/exhibitorDetails/" + email + "?eventId=157"
      );
      console.log(res.data.data);
      setPaymentDetails(res.data.data as PaymentDetails); // Use the interface
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const topRef = useRef<HTMLDivElement>(null);

  const getTrasactionHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        API_URL + "pub/userPaymentDetails?email=" + email + "&eventId=157"
      );
      console.log(res.data.data);
      setTransactions(res.data.data as TransactionsData); // Use the interface
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const verifyPaymentStatus = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(API_URL + "pub/verifyStatus", {
        email: email,
        eventId: 157,
      });
      console.log("Payment Status: ", res.data.data);
      if (res.data.data.status === "captured") {
        // setPaymentCompleted(true);
      }
      setPaymentStatus(res.data.data.status);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTotalPrice(paymentDetails?.amount || 0);
    const gst = (paymentDetails?.amount || 0) * 0.18; // Calculate 18% GST
    const postGst = Number(paymentDetails?.amount || 0) + Number(gst); // Ensure proper addition
    setGstAmount(gst);
    setPostGstPrice(postGst);
    console.log("Total Price: ", paymentDetails?.amount || 0);
    console.log("Post GST Price: ", postGst);
    console.log("GST Amount: ", gst);
  }, [paymentDetails]);

  const createOrder = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(API_URL + "pub/createOrder", {
        email: email,
        actualAmount: totalPrice,
        gst: totalPrice * 0.18,
        couponCode: "",
        eventId: 157,
        finalAmount: onlineAmount,
        userCohort: "EXHIBITOR",
        discountPrice: 0,
      });
      console.log(res.data.data.gatewayOrderId);
      setIsLoading(false);
      return res.data.data.gatewayOrderId;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const completePayment = async (response) => {
    setIsLoading(true);
    try {
      await axios.post(API_URL + "pub/verifyPayment", {
        email: email,
        eventId: 157,
        gatewayOrderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert(
        "Payment verification failed. Please try again or contact support."
      );
    }
    getTrasactionHistory();
  };

  const hasPendingVerification = () => {
    return transactions?.paymentDetails.some(
      (transaction) => transaction.paymentStatus === "init"
    );
  };

  const handlePayment = async () => {
    if (hasPendingVerification()) {
      setErrorMessage(
        "Please wait for your previous transaction to be verified by the organizer."
      );
      return;
    }
    setErrorMessage(null); // Clear any previous error
    const orderId = await createOrder();
    console.log("Before Razorpay init: ", orderId);
    const options = {
      key: "rzp_test_a9t8D8D5OaLuGN",
      amount: Number(onlineAmount?.toFixed(2)) * 100, // Amount in paise
      currency: "INR",
      name: "India Expo Mart Limited",
      description: "UP International Trade Show Registration",
      order_id: orderId,
      handler: (response: any) => {
        console.log(response);
        completePayment(response);
      },
      prefill: {
        email: email,
      },
      theme: {
        color: "#B5207E",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<{
    paymentMode: string;
    orderId: string;
    finalAmount: number;
    confirmOrderId: string;
    confirmOfflineAmount: number;
    inititalAmount: number;
  }>({
    resolver: zodResolver(offlinePaymentSchema),
    defaultValues: {
      paymentMode: "",
      orderId: "",
      finalAmount: undefined,
      confirmOrderId: "",
      confirmOfflineAmount: undefined,
      inititalAmount: 0,
    },
  });

  const handleOfflinePaymentSubmit = async (data: {
    paymentMode: string;
    orderId: string;
    finalAmount: number;
  }) => {
    if (hasPendingVerification()) {
      setErrorMessage(
        "Please wait for your previous transaction to be verified by the organizer."
      );
      return;
    }
    setErrorMessage(null); // Clear any previous error
    setIsLoading(true);
    try {
      const payload = {
        email: email,
        eventId: 157,
        actualAmount: totalPrice,
        gst: gstAmount,
        finalAmount: data.finalAmount,
        orderId: data.orderId, // Always include
        paymentOption: data.paymentMode,
      };
      console.log("Offline Payment Payload:", payload);

      await axios.post(API_URL + "pub/createOfflineOrder", payload);
      setIsLoading(false);
      reset(); // Reset form
      getTrasactionHistory(); // Refresh transaction history
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Offline Payment Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (onlineAmount) {
      const minAmount = postGstPrice * 0.25; // 25% of total amount
      if (onlineAmount < minAmount || onlineAmount > postGstPrice) {
        setAmountError(true);
      } else {
        setAmountError(false);
      }
    }
  }, [onlineAmount]);

  return (
    <>
      <div className="p-5 lg:p-10 pb-32 lg:pb-32 flex items-center justify-center">
        <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[90vh] rounded-2xl w-full xl:w-3/4 my-8">
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
                        cursor: "not-allowed",
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
                        cursor: "not-allowed",
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
            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
                {errorMessage}
              </div>
            )}
            <div
              className="flex flex-col lg:flex-row items-start gap-14 justify-between w-full mb-4"
              ref={topRef}
            >
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">Amount Details</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-lg font-normal">Base Fee </p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(totalPrice)}
                  </h1>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-lg font-normal">GST (18%)</p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(gstAmount)}
                  </h1>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-lg font-normal">Total </p>
                  <h1 className="text-xl font-semibold">
                    {formatCurrency(postGstPrice)}
                  </h1>
                </div>
              </div>
              <hr className="h-full w-[1px] bg-[#B1B1B1] hidden lg:block" />
              <div className="flex flex-col items-start h-full w-full">
                <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
                <hr className="w-full border-t-1 border-[#B1B1B1] mb-4" />
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-lg font-normal">Company</p>
                  <h1 className="text-xl font-semibold">
                    {paymentDetails?.companyName}
                  </h1>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-lg font-normal">Director</p>
                  <h1 className="text-xl font-semibold">
                    {paymentDetails?.directorName}
                  </h1>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-lg font-normal">Support Email </p>
                  <h1 className="text-xl font-semibold">
                    {paymentDetails?.supportEmail}
                  </h1>
                </div>
              </div>
            </div>
            {transactions && transactions.paymentDetails.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl lg:text-2xl font-semibold mb-3">
                  Transaction History
                </h2>
                <hr className="w-full border-t-1 border-gray-300" />
                <div className="overflow-x-auto">
                  <table className="lg:w-full border-collapse">
                    <thead className="overflow-x-auto">
                      <tr>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Sr. No.
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Payment&nbsp;Mode
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Payment&nbsp;Method
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Transaction&nbsp;ID
                        </th>
                        <th
                          title="Subject to admin verification"
                          className="text-left py-2 px-4 text-gray-500 font-normal"
                        >
                          Status
                        </th>
                        <th className="text-left py-2 px-4 text-gray-500 font-normal">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.paymentDetails.map((transaction, index) => (
                        <tr key={index} className="border-b-1 border-gray-300">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4 capitalize">
                            {transaction.paymentOption}
                          </td>
                          <td className="py-4 px-4 capitalize">
                            {transaction.paymentMethod.replace("_", " ")}
                          </td>
                          <td className="py-4 px-4">{transaction.orderId}</td>
                          <td
                            title="Subject to admin verification"
                            className="py-4 px-4"
                          >
                            <div
                              className={`flex items-center justify-center font-semibold rounded-lg p-1 ${
                                transaction.paymentStatus === "captured"
                                  ? "bg-green-100 text-green-600"
                                  : transaction.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {transaction.paymentStatus === "captured" && (
                                <CheckIcon
                                  sx={{ color: "#4CAF50", fontSize: "20px" }}
                                />
                              )}
                              {transaction.paymentStatus === "init" && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              )}
                              {transaction.paymentStatus === "pending" && (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                              )}
                              {transaction.paymentStatus === "failed" && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              )}
                              <span
                                className={`text-sm ${
                                  transaction.paymentStatus === "captured"
                                    ? "text-green-600"
                                    : transaction.paymentStatus === "pending"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                } capitalize`}
                              >
                                {transaction.paymentStatus}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {formatCurrency(Number(transaction.finalAmount))}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="py-4 px-4 font-semibold" colSpan={5}>
                          Balance Amount
                        </td>
                        <td className="py-4 px-4 font-semibold">
                          {formatCurrency(
                            postGstPrice -
                              transactions.paymentDetails.reduce(
                                (sum, transaction) =>
                                  sum + Number(transaction.finalAmount),
                                0
                              )
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="flex flex-col items-start h-full w-full mt-6">
              <h2 className="text-xl lg:text-2xl font-semibold mb-3">
                How would you like to Pay?
              </h2>
              <hr className="w-full border-t-1 border-gray-300 mb-6" />

              {/* Option 1: Pay Online */}
              <div className="w-full bg-white p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Option 1: Pay Online (Recommended)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Use UPI, debit/credit card, or net banking, get instant
                      confirmation.
                    </p>
                    <p className="text-sm text-gray-500 my-2">
                      First installment must be at least 25% of your total i.e{" "}
                      <strong>{formatCurrency(postGstPrice * 0.25)}</strong>.
                      You’re welcome to pay the full amount or any sum above the
                      minimum.
                    </p>
                    <input
                      type="number"
                      className={`w-full lg:w-1/2 h-13 border bg-white ${
                        amountError ? "border-red-500" : "border-gray-300"
                      } rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5207E]`}
                      placeholder={
                        "Enter amount to pay (min." +
                        formatCurrency(postGstPrice * 0.25) +
                        ")"
                      }
                      value={onlineAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setOnlineAmount(value);
                      }}
                      // value={email || ""}
                    />
                    {amountError && (
                      <p className="text-red-500 text-xs mt-1">
                        Amount must be at least 25% i.e.{" "}
                        {formatCurrency(postGstPrice * 0.25)} or less than{" "}
                        {formatCurrency(postGstPrice)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={
                      isSubmitting ||
                      !paymentDetails ||
                      amountError ||
                      !onlineAmount ||
                      paymentStatus === "pending"
                    } // Disable if submitting or details not loaded
                    className={`bg-[#B5207E] w-full lg:w-40 h-11 text-lg text-white rounded-full self-end px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed 
                      ${
                        paymentStatus === "pending" || amountError
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:scale-105 duration-300"
                      }
                      `}
                  >
                    Pay Online
                  </button>
                </div>
                {/* <hr className="w-full border-t-1 border-gray-300" />  */}
              </div>

              {/* Option 2: Pay Offline */}
              <div className="w-full bg-white p-4 rounded-lg">
                <div
                  className="flex sm:flex-row items-start sm:items-center justify-between cursor-pointer"
                  onClick={() => setShowOfflineForm(!showOfflineForm)}
                >
                  <div>
                    <h3 className="text-lg font-semibold ">
                      Option 2: Pay Offline
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submit details of your manual payment (bank transfer,
                      cheque, etc.)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOfflineForm(!showOfflineForm)}
                    className={`border-[#B5207E] border-2 text-xl cursor-pointer rounded-full p-1 hover:scale-105 duration-300 disabled:opacity-50`}
                  >
                    {/* {showOfflineForm ? 'Hide Details' : 'Add Details'} */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transform transition-transform text-[#B5207E] duration-300 ${
                        showOfflineForm ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Offline Payment Form - Conditional Rendering */}
                {showOfflineForm && (
                  <form
                    onSubmit={handleSubmit(handleOfflinePaymentSubmit)}
                    className="mt-6 border-t border-gray-200"
                  >
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 p-4 rounded-lg bg-gray-50 w-1/2">
                        <h3 className="text-lg font-semibold mb-4">
                          Bank Transfer Details
                        </h3>
                        <div className="flex flex-col gap-4">
                          <span className="text-xs text-end text-gray-600">
                            Click below to copy the details
                          </span>
                          {/* Account Number */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Account Number:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">
                                13400200032149
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard
                                    .writeText("13400200032149")
                                    .then(() => {
                                      alert(
                                        "Account Number copied to clipboard"
                                      );
                                    });
                                }}
                                className="text-sm text-blue-500 hover:underline"
                              >
                                <ContentCopyIcon
                                  sx={{
                                    color: "#B5207E",
                                    cursor: "pointer",
                                  }}
                                  fontSize="small"
                                />
                              </button>
                            </div>
                          </div>

                          {/* Bank Name */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Bank Name:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">
                                Federal Bank, Noida, UP
                              </span>
                              <button
                                onClick={() =>
                                  navigator.clipboard
                                    .writeText("Federal Bank, Noida, UP")
                                    .then(() => {
                                      alert("Bank Name copied to clipboard");
                                    })
                                }
                                className="text-sm text-blue-500 hover:underline"
                              >
                                <ContentCopyIcon
                                  sx={{
                                    color: "#B5207E",
                                    cursor: "pointer",
                                  }}
                                  fontSize="small"
                                />
                              </button>
                            </div>
                          </div>

                          {/* IFSC Code */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              IFSC Code:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">
                                FDRL0001340
                              </span>
                              <button
                                onClick={() =>
                                  navigator.clipboard
                                    .writeText("FDRL0001340")
                                    .then(() => {
                                      alert("IFSC Code copied to clipboard");
                                    })
                                }
                                className="text-sm text-blue-500 hover:underline"
                              >
                                <ContentCopyIcon
                                  sx={{
                                    color: "#B5207E",
                                    cursor: "pointer",
                                  }}
                                  fontSize="small"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-5 lg:items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selected Payment Method:
                        </label>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                          {(
                            ["bank_transfer", "cheque", "upi", "other"] as const
                          ).map((mode) => (
                            <label
                              key={mode}
                              className="inline-flex items-center"
                            >
                              <input
                                type="radio"
                                {...register("paymentMode")}
                                value={mode}
                                className="form-radio h-4 w-4 text-[#B5207E] focus:ring-[#B5207E] border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-600 capitalize">
                                {mode.replace("_", " ")}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {errors.paymentMode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.paymentMode.message}
                        </p>
                      )}
                      <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 ">
                            <div>
                              <label
                                htmlFor="orderId"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Enter&nbsp;Payment&nbsp;Reference:
                              </label>
                              <input
                                type="text"
                                id="orderId"
                                {...register("orderId")}
                                className="mt-1 block w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#B5207E] focus:border-[#B5207E] sm:text-sm"
                                placeholder="e.g., UTR No, Cheque No."
                              />
                              {errors.orderId && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.orderId.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="orderId"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Enter&nbsp;Payment&nbsp;Amount:
                              </label>
                              <input
                                type="number"
                                id="finalAmount"
                                {...register("finalAmount", {
                                  setValueAs: (value) =>
                                    value === "" ? undefined : Number(value), // Convert to number
                                })}
                                className="mt-1 block w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#B5207E] focus:border-[#B5207E] sm:text-sm"
                                placeholder={
                                  "e.g. " + formatCurrency(postGstPrice)
                                }
                                onPaste={(e) => e.preventDefault()} // Disable pasting
                              />
                              {errors.finalAmount && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.finalAmount.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col w-full lg:flex-row lg:items-center gap-2 ">
                            <div>
                              <label
                                htmlFor="confirmOrderId"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Confirm&nbsp;Payment&nbsp;Reference:
                              </label>
                              <input
                                type="text"
                                id="confirmOrderId"
                                {...register("confirmOrderId")}
                                className="mt-1 w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#B5207E] focus:border-[#B5207E] sm:text-sm"
                                placeholder="e.g., UTR No, Cheque No."
                              />
                              {errors.confirmOrderId && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.confirmOrderId.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="orderId"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Confirm&nbsp;Payment&nbsp;Amount:
                              </label>
                              <input
                                type="number"
                                id="confirmOfflineAmount"
                                {...register("confirmOfflineAmount", {
                                  setValueAs: (value) =>
                                    value === "" ? undefined : Number(value), // Convert to number
                                })}
                                className="mt-1 block w-full lg:w-80 px-3 py-2 border border-gray-300 h-13 rounded-sm focus:outline-none focus:ring-[#B5207E] focus:border-[#B5207E] sm:text-sm"
                                placeholder={
                                  "e.g. " + formatCurrency(postGstPrice)
                                }
                              />
                              {errors.confirmOfflineAmount && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.confirmOfflineAmount.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || paymentStatus === "pending"}
                          className={`bg-white w-full lg:w-40 h-11 self-end text-lg text-[#B5207E] border-[#B5207E] border rounded-full px-4 py-1 ${
                            paymentStatus === "pending"
                              ? "cursor-not-allowed disabled:opacity-50"
                              : "cursor-pointer hover:scale-105 duration-300"
                          } `}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
