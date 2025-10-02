"use client";

import Loader from "@/components/loader";
import { useGetLoanQuery } from "@/services/loan-service";
import MainLayout from "@/shared/mainLayout";
import { useParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiHome,
  FiUsers,
  FiCreditCard,
  FiPercent,
  FiTrendingUp,
} from "react-icons/fi";

const LoanDetailsPage = () => {
  const { loanId } = useParams<{ loanId: string }>();

  const { data: loanResponse, isLoading } = useGetLoanQuery(loanId);
  const loanData = loanResponse?.data || {};

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "N/A";
    return `GH₵ ${Number.parseFloat(amount).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "captured":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <FiCheckCircle className="w-4 h-4" />;
      case "captured":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className=" rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {loanData?.approved?.profile_image ? (
                  <img
                    src={
                      loanData?.approved?.profile_image || "/placeholder.svg"
                    }
                    alt={loanData?.registered?.client_name}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <FiUser className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {loanData?.registered?.client_name}
                </h1>
                <p className="text-muted-foreground">
                  Loan ID: #{loanData?.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(loanData?.loan_status?.status)}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border border-gray-300 dark:border-neutral-600 ${getStatusColor(
                  loanData?.loan_status?.status
                )}`}
              >
                {loanData?.loan_status?.status?.charAt(0).toUpperCase() +
                  loanData?.loan_status?.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Information */}
            <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiDollarSign className="w-5 h-5" />
                Loan Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Requested Amount
                    </label>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(loanData?.registered?.requested_amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Approved Amount
                    </label>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(loanData?.approved?.approved_amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Processing Fee
                    </label>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(loanData?.approved?.processing_fee)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Interest Rate
                    </label>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                      <FiPercent className="w-4 h-4" />
                      {loanData?.approved?.interest_rate || "N/A"}%
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Loan Duration
                    </label>
                    <p className="text-lg font-semibold text-foreground">
                      {loanData?.approved?.loan_duration || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Payment Mode
                    </label>
                    <p className="text-lg font-semibold text-foreground capitalize">
                      {loanData?.approved?.payment_mode || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Disbursement method
                    </label>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                      {loanData?.disbursement?.disbursement_method || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Disbursement notes
                    </label>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                      {loanData?.disbursement?.disbursement_notes || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                Payment Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Start Date
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDate(loanData?.approved?.payment_start_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment End Date
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDate(loanData?.approved?.payment_end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                Client Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-foreground">
                        {loanData?.registered?.client_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Contact
                      </label>
                      <p className="text-foreground">
                        {loanData?.registered?.client_contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Location
                      </label>
                      <p className="text-foreground">
                        {loanData?.registered?.client_location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Occupation
                      </label>
                      <p className="text-foreground">
                        {loanData?.captured?.occupation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </label>
                      <p className="text-foreground">
                        {formatDate(loanData?.captured?.dob)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Marital Status
                      </label>
                      <p className="text-foreground capitalize">
                        {loanData?.captured?.marital_status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border border-gray-300 dark:border-neutral-600-t">
                <div className="flex items-center gap-2">
                  <FiCreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ID Information
                    </label>
                    <p className="text-foreground">
                      {loanData?.captured?.id_type}:{" "}
                      {loanData?.captured?.id_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Witnesses */}
            {loanData?.witnesses?.length > 0 && (
              <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FiUsers className="w-5 h-5" />
                  Witnesses
                </h2>
                <div className="space-y-4">
                  {loanData?.captured?.witnesses?.map((witness, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-foreground">
                        {witness.fullname}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                        <p className="text-muted-foreground">
                          Email: {witness.email}
                        </p>
                        <p className="text-muted-foreground">
                          Contact: {witness.contact}
                        </p>
                        <p className="text-muted-foreground">
                          Occupation: {witness.occupation}
                        </p>
                        <p className="text-muted-foreground">
                          Status: {witness.marital_status}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        Address: {witness.residence_address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Loan Timeline */}
            <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                Loan Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-foreground">Registered</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(loanData?.registered?.registration_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By: {loanData?.registered?.registered_by_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-foreground">Captured</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(loanData?.captured?.capturing_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By: {loanData?.captured?.captured_by_name}
                    </p>
                  </div>
                </div>
                {loanData?.approved?.approval_date && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-foreground">Approved</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(loanData?.approved?.approval_date)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By: {loanData?.approved?.approved_by_name}
                      </p>
                    </div>
                  </div>
                )}
                {loanData?.disbursement?.disbursement_date && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-foreground">Disbursed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(loanData?.disbursement?.disbursement_date)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By: {loanData?.disbursement?.disbursed_by_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loanData?.captured?.witnesses?.length > 0 && (
              <div className=" rounded-lg p-6 shadow-sm  border border-gray-300 dark:border-neutral-600">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiUsers className="w-5 h-5" />
                  Witnesses
                </h2>
                <div className="space-y-4">
                  {loanData?.captured?.witnesses.map((witness, index) => (
                    <div key={index} className="p-4 rounded-lg ">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {witness.fullname}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                        <p className="text-gray-600 dark:text-white">Email: {witness.email}</p>
                        <p className="text-gray-600 dark:text-white">
                          Contact: {witness.contact}
                        </p>
                        <p className="text-gray-600 dark:text-white">
                          Occupation: {witness.occupation}
                        </p>
                        <p className="text-gray-600 dark:text-white">
                          Status: {witness.marital_status}
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-white text-sm mt-1">
                        Address: {witness.residence_address}
                      </p>
                      <p className="text-gray-600 dark:text-white text-sm">
                        GPS: {witness.residence_gps}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Locations */}
            {loanData?.business_locations?.length > 0 && (
              <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
                <h2 className="text-xl font-semibold dark:text-white text-foreground mb-4 flex items-center gap-2">
                  <FiBriefcase className="w-5 h-5" />
                  Business Locations
                </h2>
                <div className="space-y-3">
                  {loanData?.captured?.business_locations?.map((location) => (
                    <div key={location.id} className="p-3 bg-muted rounded-lg">
                      <h3 className="font-medium text-foreground dark:text-white">
                        {location.name}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-white">
                        {location.region}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-white">
                        {location.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Residences */}
            {loanData?.captured?.residences?.length > 0 && (
              <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FiHome className="w-5 h-5" />
                  Residences
                </h2>
                <div className="space-y-3">
                  {loanData?.residences?.map((residence) => (
                    <div key={residence.id} className="p-3 bg-muted rounded-lg">
                      <h3 className="font-medium text-foreground">
                        {residence.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {residence.region}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {residence.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-card rounded-lg border border-gray-300 dark:border-neutral-600 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5" />
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Phase</span>
                  <span className="font-semibold text-foreground">
                    {loanData?.loan_status?.phase}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Client ID</span>
                  <span className="font-semibold text-foreground">
                    #{loanData?.registered?.client_id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-semibold text-foreground text-sm">
                    {formatDate(loanData?.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoanDetailsPage;
