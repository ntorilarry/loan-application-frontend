"use client";

import { Modal } from "@/components/modal";
import { CaptureLoanRequest } from "@/models/request/loan-request";
import { useUploadImageMutation } from "@/services/image-service";
import { useCaptureLoanMutation } from "@/services/loan-service";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RiUploadCloud2Line } from "react-icons/ri";

interface CaptureLoanDetailsProps {
  open: boolean;
  onClose: () => void;
  refetch: any;
  selectedLoan: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CaptureLoanDetails: React.FC<CaptureLoanDetailsProps> = ({
  open,
  onClose,
  refetch,
  selectedLoan,
}) => {
  const [formData, setFormData] = useState<CaptureLoanRequest>({
    dob: "",
    marital_status: "",
    profile_image: "",
    id_front_image: "",
    id_back_image: "",
    occupation: "",
    id_type: "",
    id_number: "",
    witnesses: [],
    business_locations: [],
    residences: [],
  });

  // Separate state for image previews
  const [imagePreviews, setImagePreviews] = useState({
    profile_image: null as string | null,
    id_front_image: null as string | null,
    id_back_image: null as string | null,
  });

  useEffect(() => {
    if (selectedLoan) {
      setFormData({
        dob: selectedLoan.captured.dob || "",
        marital_status: selectedLoan.captured.marital_status || "",
        profile_image: selectedLoan.captured.profile_image || "",
        occupation: selectedLoan.captured.occupation || "",
        id_type: selectedLoan.captured.id_type || "",
        id_number: selectedLoan.captured.id_number || "",
        id_front_image: selectedLoan.captured.id_front_image || "",
        id_back_image: selectedLoan.captured.id_back_image || "",
        witnesses:
          selectedLoan.captured.witnesses?.map((w: any) => ({
            fullname: w.fullname || "",
            contact: w.contact || "",
            marital_status: w.marital_status || "",
            email: w.email || "",
            occupation: w.occupation || "",
            residence_address: w.residence_address || "",
            residence_gps: w.residence_gps || "",
            id_type: w.id_type || "",
            id_number: w.id_number || "",
            id_front_image: w.id_front_image || "",
            id_back_image: w.id_back_image || "",
            profile_pic: w.profile_pic || "",
          })) || [],
        business_locations:
          selectedLoan.captured.business_locations?.map((b: any) => ({
            name: b.name || "",
            address: b.address || "",
            gps_address: b.gps_address || "",
            region: b.region || "",
          })) || [],
        residences:
          selectedLoan.captured.residences?.map((r: any) => ({
            name: r.name || "",
            address: r.address || "",
            gps_address: r.gps_address || "",
            region: r.region || "",
          })) || [],
      });
    }
  }, [selectedLoan]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    key: "witnesses" | "business_locations" | "residences",
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev[key]];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, [key]: updated };
    });
  };

  const handleDeleteNested = (
    key: "witnesses" | "business_locations" | "residences",
    index: number
  ) => {
    setFormData((prev) => {
      const updated = [...prev[key]];
      updated.splice(index, 1);
      return { ...prev, [key]: updated };
    });
  };

  const [uploadImage] = useUploadImageMutation();

  // --- Simplified Image Upload Handler ---
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile_image" | "id_front_image" | "id_back_image" | "witnesses",
    witnessIndex?: number,
    witnessField?: "profile_pic" | "id_front_image" | "id_back_image"
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const result = await uploadImage(formDataUpload).unwrap();
      const uploadedUrl = result.data.imageUrl;

      if (field === "witnesses" && witnessIndex !== undefined && witnessField) {
        setFormData((prev) => {
          const updated = [...prev.witnesses];
          updated[witnessIndex] = {
            ...updated[witnessIndex],
            [witnessField]: uploadedUrl,
          };
          return { ...prev, witnesses: updated };
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: uploadedUrl,
        }));
        // Set preview for main images
        setImagePreviews((prev) => ({
          ...prev,
          [field]: previewUrl,
        }));
      }

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Image upload failed. Try again.");
    }
  };

  // --- Remove Image Handler ---
  const handleRemoveImage = (
    field: keyof CaptureLoanRequest | "witnesses",
    witnessIndex?: number,
    witnessField?: "profile_pic" | "id_front_image" | "id_back_image"
  ) => {
    if (field === "witnesses" && witnessIndex !== undefined && witnessField) {
      setFormData((prev) => {
        const updated = [...prev.witnesses];
        updated[witnessIndex] = {
          ...updated[witnessIndex],
          [witnessField]: "",
        };
        return { ...prev, witnesses: updated };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: "",
      }));
      // Clear preview for main images
      setImagePreviews((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const [captureLoan] = useCaptureLoanMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await captureLoan({
        body: formData,
        loanId: selectedLoan.id,
      }).unwrap();
      const { message } = response;
      toast.success(message || "Loan Updated successfully");
      onClose();
      refetch();
    } catch (error: any) {
      console.error("Sign Up failed:", error);
      toast.error(error?.data?.message || "Sign Up failed. Please try again.");
    }
  };

  return (
    <div>
      {" "}
      <Modal
        open={open}
        onClose={onClose}
        title="Capture Loan"
        size="2xl"
        buttons={[
          {
            label: "Cancel",
            onClick: onClose,
            className: "bg-red-500 text-white hover:bg-red-600",
          },
          {
            label: "Save",
            type: "submit",
            onClick: handleSubmit,
            className:
              "bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-600 text-white",
          },
        ]}
      >
        <TabGroup>
          <TabList className="flex space-x-2 border-b border-gray-200">
            {[
              "Personal Info",
              "Witnesses/Guarantor",
              "Business Locations",
              "Residences",
            ].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "px-4 py-2 text-sm font-medium rounded-t-lg",
                    selected
                      ? "bg-neutral-200 dark:bg-neutral-700"
                      : "bg-gray-100 dark:bg-neutral-800"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-4">
            {/* Personal Info */}
            <TabPanel>
              <div>
                <div className="space-y-2 pb-4">
                  <label className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                    Passport / Profile Image
                  </label>
                  <div className="relative">
                    <label
                      htmlFor="profile_image"
                      className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700"
                    >
                      <input
                        id="profile_image"
                        name="profile_image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "profile_image")}
                        className="sr-only"
                      />
                      <RiUploadCloud2Line className="size-10 mx-auto text-gray-400 dark:text-neutral-600" />
                      <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                        Browse your device or{" "}
                        <span className="group-hover:text-blue-700 text-blue-600">
                          drag n drop
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                        Maximum file size is 2 MB
                      </span>
                    </label>
                    {(formData.profile_image ||
                      imagePreviews.profile_image) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <img
                          src={
                            formData.profile_image
                              ? getImageUrl(formData.profile_image)
                              : imagePreviews.profile_image!
                          }
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("profile_image")}
                          className="absolute top-2 right-2 text-white hover:text-red-500"
                        >
                          <IoCloseCircleOutline className="h-6 w-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="dob"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="marital_status"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Marital status
                    </label>
                    <select
                      name="marital_status"
                      value={formData.marital_status || ""}
                      onChange={handleInputChange}
                      className="px-4 py-3 mt-2 block w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-800 dark:border-white dark:text-white dark:placeholder-neutral-500"
                      required
                    >
                      <option value="" disabled>
                        Select a marital status
                      </option>

                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="occupation"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="id_type"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Id Type
                    </label>
                    <select
                      name="id_type"
                      value={formData.id_type || ""}
                      onChange={handleInputChange}
                      className="px-4 py-3 mt-2 block  w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                      required
                    >
                      <option value="" disabled>
                        Select a id type
                      </option>

                      <option value="Ghana Card">Ghana Card</option>
                      <option value="Voters Id">Voters Id</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver License">Driver License</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="occupation"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Id Number
                    </label>
                    <input
                      type="text"
                      name="id_number"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {" "}
                  <div className="space-y-2">
                    <label className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Front Id Image
                    </label>
                    <div className="relative">
                      <label
                        htmlFor="id_front_image"
                        className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700"
                      >
                        <input
                          id="id_front_image"
                          name="id_front_image"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "id_front_image")
                          }
                          className="sr-only"
                        />
                        <RiUploadCloud2Line className="size-10 mx-auto text-gray-400 dark:text-neutral-600" />
                        <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                          Browse your device or{" "}
                          <span className="group-hover:text-blue-700 text-blue-600">
                            drag n drop
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                          Maximum file size is 2 MB
                        </span>
                      </label>
                      {(formData.id_front_image ||
                        imagePreviews.id_front_image) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <img
                            src={
                              formData.id_front_image
                                ? getImageUrl(formData.id_front_image)
                                : imagePreviews.id_front_image!
                            }
                            alt="Front ID Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage("id_front_image")}
                            className="absolute top-2 right-2 text-white hover:text-red-500"
                          >
                            <IoCloseCircleOutline className="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Back Id Image
                    </label>
                    <div className="relative">
                      <label
                        htmlFor="id_back_image"
                        className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700"
                      >
                        <input
                          id="id_back_image"
                          name="id_back_image"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "id_back_image")
                          }
                          className="sr-only"
                        />
                        <RiUploadCloud2Line className="size-10 mx-auto text-gray-400 dark:text-neutral-600" />
                        <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                          Browse your device or{" "}
                          <span className="group-hover:text-blue-700 text-blue-600">
                            drag n drop
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                          Maximum file size is 2 MB
                        </span>
                      </label>
                      {(formData.id_back_image ||
                        imagePreviews.id_back_image) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <img
                            src={
                              formData.id_back_image
                                ? getImageUrl(formData.id_back_image)
                                : imagePreviews.id_back_image!
                            }
                            alt="Back ID Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage("id_back_image")}
                            className="absolute top-2 right-2 text-white hover:text-red-500"
                          >
                            <IoCloseCircleOutline className="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Witnesses */}
            <TabPanel>
              {formData.witnesses.map((witness, index) => (
                <div key={index} className="relative mb-8">
                  <div className="space-y-2">
                    <label className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Profile Image
                    </label>
                    <div className="relative">
                      <label
                        htmlFor={`witness-profile-${index}`}
                        className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700"
                      >
                        <input
                          id={`witness-profile-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "witnesses",
                              index,
                              "profile_pic"
                            )
                          }
                          className="sr-only"
                        />
                        <RiUploadCloud2Line className="size-10 mx-auto text-gray-400 dark:text-neutral-600" />
                        <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                          Browse your device or{" "}
                          <span className="group-hover:text-blue-700 text-blue-600">
                            drag n drop
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                          Maximum file size is 2 MB
                        </span>
                      </label>
                      {witness.profile_pic && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <img
                            src={getImageUrl(witness.profile_pic)}
                            alt="Witness Profile Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImage(
                                "witnesses",
                                index,
                                "profile_pic"
                              )
                            }
                            className="absolute top-2 right-2 text-white hover:text-red-500"
                          >
                            <IoCloseCircleOutline className="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullname"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={witness.fullname}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={witness.contact}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="marital_status"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Marital status
                      </label>
                      <select
                        name="marital_status"
                        value={witness.marital_status || ""}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="px-4 py-3 mt-2 block w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-800 dark:border-white dark:text-white dark:placeholder-neutral-500"
                        required
                      >
                        <option value="" disabled>
                          Select a marital status
                        </option>

                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Divorced</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="occupation"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={witness.occupation}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={witness.email}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="id_type"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Id Type
                      </label>
                      <select
                        name="id_type"
                        value={witness.id_type || ""}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="px-4 py-3 mt-2 block  w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500"
                        required
                      >
                        <option value="" disabled>
                          Select a id type
                        </option>

                        <option value="Ghana Card">Ghana Card</option>
                        <option value="Voters Id">Voters Id</option>
                        <option value="Passport">Passport</option>
                        <option value="Driver License">Driver License</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="occupation"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Id Number
                      </label>
                      <input
                        type="text"
                        name="id_number"
                        value={witness.id_number}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="residence_gps"
                        className="text-sm font-normal dark:text-white pb-4"
                      >
                        Residence GPS
                      </label>
                      <input
                        type="text"
                        name="residence_gps"
                        value={witness.residence_gps}
                        onChange={(e) =>
                          handleNestedChange("witnesses", index, e)
                        }
                        className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                      <label className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                        Front Id Image
                      </label>
                      <div className="relative">
                        <label
                          htmlFor={`witness-front-${index}`}
                          className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700"
                        >
                          <input
                            id={`witness-front-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, "witnesses", index, "id_front_image")
                            }
                            className="sr-only"
                          />
                          <RiUploadCloud2Line className="size-10 mx-auto text-gray-400 dark:text-neutral-600" />
                          <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                            Browse your device or{" "}
                            <span className="group-hover:text-blue-700 text-blue-600">
                              drag n drop
                            </span>
                          </span>
                          <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                            Maximum file size is 2 MB
                          </span>
                        </label>
                        {witness.id_front_image && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <img
                              src={getImageUrl(witness.id_front_image)}
                              alt="Witness Front ID Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage("witnesses", index, "id_front_image")
                              }
                              className="absolute top-2 right-2 text-white hover:text-red-500"
                            >
                              <IoCloseCircleOutline className="h-6 w-6" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                        Back Id Image
                      </label>
                      <div className="relative">
                        <label
                          htmlFor={`witness-back-${index}`}
                          className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700"
                        >
                          <input
                            id={`witness-back-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, "witnesses", index, "id_back_image")
                            }
                            className="sr-only"
                          />
                          <RiUploadCloud2Line className="size-10 mx-auto text-gray-400 dark:text-neutral-600" />
                          <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                            Browse your device or{" "}
                            <span className="group-hover:text-blue-700 text-blue-600">
                              drag n drop
                            </span>
                          </span>
                          <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                            Maximum file size is 2 MB
                          </span>
                        </label>
                        {witness.id_back_image && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <img
                              src={getImageUrl(witness.id_back_image)}
                              alt="Witness Back ID Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage("witnesses", index, "id_back_image")
                              }
                              className="absolute top-2 right-2 text-white hover:text-red-500"
                            >
                              <IoCloseCircleOutline className="h-6 w-6" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="residence_address"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Residence Address
                    </label>
                    <textarea
                      name="residence_address"
                      placeholder="Enter location"
                      value={witness.residence_address}
                      onChange={(e) =>
                        handleNestedChange("witnesses", index, e)
                      }
                      rows={3}
                      required
                      className="mt-2 border block w-full px-4 py-3 text-sm dark:text-white placeholder-gray-500 border-gray-300 rounded-lg  dark:placeholder-gray-300 "
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNested("witnesses", index)}
                    className="absolute top-0 text-xs border p-1 rounded-full right-2 text-red-500"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    witnesses: [
                      ...prev.witnesses,
                      {
                        fullname: "",
                        contact: "",
                        marital_status: "",
                        email: "",
                        occupation: "",
                        residence_address: "",
                        residence_gps: "",
                        id_type: "",
                        id_number: "",
                        id_front_image: "",
                        id_back_image: "",
                        profile_pic: "",
                      },
                    ],
                  }))
                }
                className="bg-neutral-700 rounded-lg text-sm text-white px-3 py-2"
              >
                + Add Witness
              </button>
            </TabPanel>

            {/* Business Locations */}
            <TabPanel>
              {formData.business_locations.map((loc, index) => (
                <div key={index} className="relative gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="residence_gps"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={loc.name}
                      onChange={(e) =>
                        handleNestedChange("business_locations", index, e)
                      }
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="residence_address"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Address"
                      value={loc.address}
                      onChange={(e) =>
                        handleNestedChange("business_locations", index, e)
                      }
                      rows={3}
                      required
                      className="mt-2 border block w-full px-4 py-3 text-sm dark:text-white placeholder-gray-500 border-gray-300 rounded-lg  dark:placeholder-gray-300 "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="residence_gps"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      GPS Address
                    </label>
                    <input
                      type="text"
                      name="gps_address"
                      value={loc.gps_address}
                      onChange={(e) =>
                        handleNestedChange("business_locations", index, e)
                      }
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="region"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Region
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={loc.region}
                      onChange={(e) =>
                        handleNestedChange("business_locations", index, e)
                      }
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteNested("business_locations", index)
                    }
                    className="absolute top-0 text-xs border p-1 rounded-full right-2 text-red-500"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    business_locations: [
                      ...prev.business_locations,
                      { name: "", address: "", gps_address: "", region: "" },
                    ],
                  }))
                }
                className="bg-neutral-700 rounded-lg text-sm text-white px-3 py-2"
              >
                + Add Location
              </button>
            </TabPanel>

            {/* Residences */}
            <TabPanel>
              {formData.residences.map((res, index) => (
                <div key={index} className="relative gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="residence_gps"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={res.name}
                      onChange={(e) =>
                        handleNestedChange("residences", index, e)
                      }
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="residence_address"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Address"
                      value={res.address}
                      onChange={(e) =>
                        handleNestedChange("residences", index, e)
                      }
                      rows={3}
                      required
                      className="mt-2 border block w-full px-4 py-3 text-sm dark:text-white placeholder-gray-500 border-gray-300 rounded-lg  dark:placeholder-gray-300 "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="residence_gps"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      GPS Address
                    </label>
                    <input
                      type="text"
                      name="gps_address"
                      value={res.gps_address}
                      onChange={(e) =>
                        handleNestedChange("residences", index, e)
                      }
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="region"
                      className="text-sm font-normal dark:text-white pb-4"
                    >
                      Region
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={res.region}
                      onChange={(e) =>
                        handleNestedChange("residences", index, e)
                      }
                      className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNested("residences", index)}
                    className="absolute top-0 text-xs border p-1 rounded-full right-2 text-red-500"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    residences: [
                      ...prev.residences,
                      { name: "", address: "", gps_address: "", region: "" },
                    ],
                  }))
                }
                className="bg-neutral-700 rounded-lg text-sm text-white px-3 py-2"
              >
                + Add Residence
              </button>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Modal>
    </div>
  );
};

export default CaptureLoanDetails;
