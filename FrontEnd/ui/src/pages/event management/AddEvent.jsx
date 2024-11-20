import React from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

import { districts } from "../../data/Districts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "@nextui-org/input";
import * as yup from "yup";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@nextui-org/react";

const formSchema = yup.object().shape({
  eventName: yup.string().required("Event name is required"),
  eventDate: yup.string().required("Event Date is required"),
  eventDescription: yup.string().required("Description is required"),
  // quantity: yup
  //   .number()
  //   .typeError("Quantity must be a number")
  //   .required("Quantity is required")
  //   .min(0, "Quantity cannot be a negative number"),
  selectDistrict: yup.string().required("Select District is required"),
});

const AddEvent = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!imageBase64) {
      return toast.error("Please upload an image");
    }
    const formattedDate =
      data.eventDate instanceof Date
        ? data.eventDate.toISOString().split("T")[0]
        : data.eventDate;

    const eventData = {
      eventName: data.eventName,
      eventDate: formattedDate,
      district: data.selectDistrict,
      description: data.eventDescription,
      image: imageBase64,
    };
    console.log("Event Data to Send:", eventData);
    try {
      const res = await axios.post("http://localhost:5000/events", eventData);
      console.log("Response:", res);

      if (res.status === 201) {
        toast.success("Event added successfully");
        navigate("/dashboard/events");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center p-3 h-full items-center ">
      <div className="w-[900px] border-2 px-10 py-5 rounded-lg bg-white">
        <h1 className="text-lg ml-1 font-semibold text-gray-800">Add Event</h1>
        <form
          className="mt-4 flex gap-2 flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-5">
            <div className="flex-1">
              <label className="block text-sm  leading-6 text-gray-900">
                Image Upload
              </label>
              <div className="flex items-center justify-center w-full mt-2">
                {!imageBase64 && (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 ">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 ">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}

                {imageBase64 && (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                    <img
                      className=" w-48 h-48"
                      src={imageBase64}
                      alt="Selected File"
                    />
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="flex-1 gap-2 flex flex-col">
              <Input
                size="md"
                variant="filled"
                type="text"
                className="text-sm "
                label="Event name"
                placeholder="Enter Event name"
                {...register("eventName")}
                isInvalid={errors.eventName}
                errorMessage={errors.eventName?.message}
              />

              <div className="flex  gap-2">
                <DatePicker
                  label="Event date"
                  className="max-w-[284px]"
                  isRequired
                  onChange={(value) =>
                    setValue("eventDate", value?.toString().split("T")[0])
                  } // Use setValue with formatted date
                  isInvalid={errors.eventDate}
                  errorMessage={errors.eventDate?.message}
                />
                <Select
                  items={districts}
                  label="Select "
                  placeholder="Select a District"
                  className="max-w-xs"
                  {...register("selectDistrict")}
                  isInvalid={errors.selectDistrict}
                  errorMessage={errors.selectDistrict?.message}
                >
                  {(districts) => (
                    <SelectItem key={districts.value} value={districts.value}>
                      {districts.value}
                    </SelectItem>
                  )}
                </Select>
              </div>
              <div className="flex w-full gap-2">
                <Textarea
                  size="md"
                  variant="filled"
                  type="text"
                  className="text-sm "
                  label="Event Description"
                  placeholder="Description"
                  {...register("eventDescription")}
                  isInvalid={errors.eventDescription}
                  errorMessage={errors.eventDescription?.message}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="large"
              className="bg-black text-white mt-2"
              loading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddEvent;
