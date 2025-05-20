import ExhibitorRegistration from "../components/ExhibitorRegistration";

function ExhibitorRegistrationPage() {
  return (
    <>
      <div className="relative w-full h-[250px] md:h-[350px] bg-gradient-to-r from-[#56126d]/60 to-[#b1207d]/60 flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
        <img
          src="/about-header.webp"
          alt="World Food India Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <h1
          className="text-2xl xl:text-3xl font-bold text-white mb-2 z-10 mt-40 text-center"
          style={{
            textShadow: `
                  0 0 0 #000,  
                  0 0 0 #000,
                  0 0 0 #000,
                  3px 3px 0 #000,
                  2px 2px 4px rgba(0,0,0,0.5)
                `,
          }}
        >
          EXHIBITOR REGISTRATION
        </h1>
      </div>
      <div className=" p-5 lg:p-10 pb-32 lg:pb-32 flex items-center justify-center">
        <ExhibitorRegistration />
      </div>
    </>
  );
}

export default ExhibitorRegistrationPage;
