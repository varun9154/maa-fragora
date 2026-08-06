"use client";

import { useState } from "react";

export default function AddressForm() {
  const [address, setAddress] =useState({
    fullName:"",
    phone:"",
    address:"",
    city:"",
    state:"",
    pincode:"",
  });

  const handleChange=(
    e:React.ChangeEvent<HTMLInputElement>
  )=>{
    setAddress({
      ...address,
      [e.target.name]:e.target.value,
    });
  };

  const inputStyle =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 outline-none transition focus:border-[#D4AF37]";

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

      <h2 className="mb-8 text-3xl font-bold">
        Shipping Address
      </h2>

      <div className="grid gap-6">

        <div>

          <label>
            Full Name
          </label>

          <input
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className={inputStyle}
            placeholder="John Doe"
          />

        </div>

        <div>

          <label>
            Mobile Number
          </label>

          <input
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className={inputStyle}
            placeholder="9876543210"
          />

        </div>

        <div>

          <label>
            Address
          </label>

          <input
            name="address"
            value={address.address}
            onChange={handleChange}
            className={inputStyle}
            placeholder="House No, Street"
          />

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label>
              City
            </label>

            <input
              name="city"
              value={address.city}
              onChange={handleChange}
              className={inputStyle}
            />

          </div>

          <div>

            <label>
              State
            </label>

            <input
              name="state"
              value={address.state}
              onChange={handleChange}
              className={inputStyle}
            />

          </div>

        </div>

        <div>

          <label>
            Pincode
          </label>

          <input
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            className={inputStyle}
          />

        </div>

      </div>

    </div>
  );
}