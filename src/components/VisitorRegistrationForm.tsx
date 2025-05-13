import React, { useState } from 'react';

const VisitorRegistrationForm = () => {
  const [formData, setFormData] = useState<{
      firstName: string;
      lastName: string;
      companyName: string;
      designation: string;
      mobileNumber: string;
      email: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      visitorProfile: string[];
    }>({
      firstName: '',
      lastName: '',
      companyName: '',
      designation: '',
      mobileNumber: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      visitorProfile: [],
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      visitorProfile: checked
        ? [...prevState.visitorProfile, value]
        : prevState.visitorProfile.filter((profile) => profile !== value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Visitor Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name*"
            value={formData.companyName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation*"
            value={formData.designation}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number*"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email ID*"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="street"
            placeholder="Street*"
            value={formData.street}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="city"
            placeholder="City/Suburb*"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="state"
            placeholder="State*"
            value={formData.state}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip/Post Code*"
            value={formData.zip}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="country"
            placeholder="Country*"
            value={formData.country}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Visitor's Profile*</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              'Buying Agents',
              'Investors',
              'Corporates',
              'Marketing Professionals',
              'Distributors',
              'Overseas Buyers, Importers & Wholesalers',
              'Domestic Buyers',
              'Retail Stores',
              'E-commerce',
              'Think Tanks',
              'Exporters',
              'Traders',
              'Institutional Buyers',
              'Other',
            ].map((profile) => (
              <label key={profile} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={profile}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span>{profile}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default VisitorRegistrationForm;
