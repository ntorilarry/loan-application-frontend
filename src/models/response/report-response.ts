export interface ListReportDashboardResponse {
  total_loans: number;
  active_loans: 1;
  completed_loans: number;
  defaulted_loans: number;
  total_disbursed: number;
  total_collected: number;
  pending_approvals: number;
  pending_disbursements: number;
  loans_by_phase: {
    registration: number;
    capturing: number;
    approval: number;
    disbursement: number;
  };
  monthly_disbursements: {
    month: string;
    amount: number;
    count: number;
  }[];
  recent_activities: {
    id: number;
    action: string;
    entity_type: string;
    entity_id: number;
    user_name: string;
    created_at: string;
  }[];
}
