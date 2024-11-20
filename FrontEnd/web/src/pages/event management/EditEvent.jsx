import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { districts } from "../../data/Districts";

// Validation schema
const formSchema = yup.object().shape({
  eventName: yup.string().required("Event name is required"),
  eventDate: yup.string().required("Event Date is required"),
  description: yup.string().required("Description is required"),
  district: yup.string().required("District is required"),
});

const EditEvent = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/events/${id}`);
        const data = res.data.event;
        setEvent(data);

        const formattedDate =
          data.eventDate instanceof Date
            ? data.eventDate.toISOString().split("T")[0]
            : data.eventDate;

        if (data) {
          reset({
            eventName: data.eventName,
            eventDate: formattedDate,
            district: data.district,
            description: data.description,
          });

          setImageBase64(data.image);
        }
        setLoading(false);
      } catch (error) {
        console.log("Error fetching event data: ", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      // Check if image is uploaded
      if (!imageBase64) {
        return toast.error("Please upload an image");
      }

      // Format the date
      const formattedDate =
        data.eventDate instanceof Date
          ? data.eventDate.toISOString().split("T")[0]
          : data.eventDate;

      const eventData = {
        eventName: data.eventName,
        eventDate: formattedDate,
        district: data.district,
        description: data.description,
        image: imageBase64,
      };

      console.log("Submitting eventData:", eventData); // Debugging log

      await axios.put(`http://localhost:5000/events/${id}`, eventData);

      toast.success("Event updated successfully");
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error updating event: ", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-3 h-full items-center">
      <div className="w-[900px] border-2 px-10 py-5 rounded-lg">
        <h1 className="text-lg ml-1 font-semibold text-gray-800">Edit Event</h1>
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
                  }
                  isInvalid={errors.eventDate}
                  errorMessage={errors.eventDate?.message}
                />
                <Select
                  items={districts}
                  label="District"
                  placeholder="Select district"
                  variant="filled"
                  className="flex-1"
                  errorMessage={errors.district?.message}
                  {...register("district")}
                  isInvalid={errors.district}
                >
                  {districts.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
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
                  {...register("description")}
                  isInvalid={errors.description}
                  errorMessage={errors.description?.message}
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
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
