export enum CandidateStatus {
    WAITING_FOR_INTERVIEW = "WAITING_FOR_INTERVIEW",
    WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL",
    WAITING_FOR_RESPONSE = "WAITING_FOR_RESPONSE",
    OPEN = "OPEN",
    PASSED_INTERVIEW = "PASSED_INTERVIEW",
    APPROVED_OFFER = "APPROVED_OFFER",
    REJECTED_OFFER = "REJECTED_OFFER",
    ACCEPTED_OFFER = "ACCEPTED_OFFER",
    DECLINED_OFFER = "DECLINED_OFFER",
    CANCELLED_OFFER = "CANCELLED_OFFER",
    FAILED_INTERVIEW = "FAILED_INTERVIEW",
    CANCELLED_INTERVIEW = "CANCELLED_INTERVIEW",
    BANNED = "BANNED",
}

export function getCandidateStatusLabel(status: CandidateStatus) {
    switch (status) {
        case CandidateStatus.WAITING_FOR_INTERVIEW:
            return "Waiting for Interview";
        case CandidateStatus.WAITING_FOR_APPROVAL:
            return "Waiting for Approval";
        case CandidateStatus.WAITING_FOR_RESPONSE:
            return "Waiting for Response";
        case CandidateStatus.OPEN:
            return "Open";
        case CandidateStatus.PASSED_INTERVIEW:
            return "Passed Interview";
        case CandidateStatus.APPROVED_OFFER:
            return "Approved Offer";
        case CandidateStatus.REJECTED_OFFER:
            return "Rejected Offer";
        case CandidateStatus.ACCEPTED_OFFER:
            return "Accepted Offer";
        case CandidateStatus.DECLINED_OFFER:
            return "Declined Offer";
        case CandidateStatus.CANCELLED_OFFER:
            return "Cancelled Offer";
        case CandidateStatus.FAILED_INTERVIEW:
            return "Failed Interview";
        case CandidateStatus.CANCELLED_INTERVIEW:
            return "Cancelled Interview";
        case CandidateStatus.BANNED:
            return "Banned";
        default:
            return status;
    }
}