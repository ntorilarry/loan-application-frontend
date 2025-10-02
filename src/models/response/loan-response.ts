export interface ListLoanResponse {
  id: number;
  registered: {
    client_id: number;
    client_name: string;
    client_contact: string;
    client_email: string;
    client_location: string;
    client_landmark: string;
    client_business: string;
    requested_amount: string;
    registered_by: number;
    registered_by_name: string;
    registration_date: string; // ISO Date
  };
  captured: {
    captured_by: number;
    captured_by_name: string;
    capturing_date: string; // ISO Date
    dob: string; // ISO Date
    marital_status: string;
    occupation: string;
    profile_image: string;
    id_type: string;
    id_number: string;
    witnesses: Witness[];
    business_locations: Location[];
    residences: Location[];
  };
  approved: {
    approved_amount: string | null;
    loan_duration: string | null;
    payment_mode: string | null;
    processing_fee: string | null;
    interest_rate: string | null;
    payment_start_date: string | null; // ISO Date or null
    payment_end_date: string | null; // ISO Date or null
    approved_by: number | null;
    approved_by_name: string | null;
    approval_date: string | null; // ISO Date or null
  };

  disbursement: {
    disbursed_by: number | null;
    disbursed_by_name: string | null;
    disbursement_date: string | null; // ISO Date or null
  };
  loan_status: {
    status: string; // e.g. "captured", "approved"
    phase: number;
    payment_schedule_start: string | null; // ISO Date or null
  };
  created_at: string; // ISO Date
  updated_at: string; // ISO Date
}

export interface Witness {
  id: number;
  email: string;
  contact: string;
  fullname: string;
  occupation: string;
  residence_gps: string;
  marital_status: string;
  residence_address: string;
}

export interface Location {
  id: number;
  name: string;
  region: string;
  address: string;
  gps_address: string;
}

// Loan stats
export interface LoanStats {
  total_registrations: number;
  registered: number;
  captured: number;
  total_requested: number;
}
