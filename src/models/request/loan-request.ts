export interface RegisterLoanRequest {
  fullname: string;
  contact: string;
  email: string;
  location: string;
  landmark: string;
  business: string;
  requested_amount: number;
}

export interface LoanParams {
  page?: number;
  limit?: number;
  status?: string;
  phase?: number;
  search?: string;
}

export interface Witness {
  fullname: string;
  contact: string;
  marital_status: string;
  email: string;
  occupation: string;
  residence_address: string;
  residence_gps: string;
  id_type: string;
  id_number: string;
  id_front_image: string;
  id_back_image: string;
  profile_pic: string;
}

export interface BusinessLocation {
  name: string;
  address: string;
  gps_address: string;
  region: string;
}

export interface Residence {
  name: string;
  address: string;
  gps_address: string;
  region: string;
}

export interface CaptureLoanRequest {
  dob: string;
  marital_status: string;
  profile_image: string;
  occupation: string;
  id_type: string;
  id_number: string;
  id_front_image: string;
  id_back_image: string;
  witnesses: Witness[];
  business_locations: BusinessLocation[];
  residences: Residence[];
}

export interface ApproveLoanRequest {
  approved_amount: number;
  loan_duration: string;
  payment_mode: string;
  payment_start_date: string;
  payment_end_date: string;
  processing_fee: number;
  interest_rate: number;
}

export interface DisburseLoanRequest {
  disbursement_method: string;
  disbursement_notes: string;
}

export interface RepayLoanRequest {
  amount: number;
  payment_date: string;
}