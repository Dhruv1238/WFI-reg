
const Thankyou2 = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-[50vh] mb-10">
      <div className="tick-mark-container text-center">
        <div className="tick-mark-container">
          <div className="tick-mark-circle">
            <div className="tick-mark">&#10003;</div>
          </div>
          <p className="text-center mt-4 text-lg font-medium">
          Your transaction details have been recorded. You will receive an email
          for further processing, subject to admin verification of the payment
          on their end.
        </p>
        </div>
      </div>
    </div>
  );
};

export default Thankyou2;
