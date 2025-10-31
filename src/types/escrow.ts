// src/types/escrow.ts

// This now perfectly matches the Escrow.sol v1.4 contract
export enum ContractState {
  PendingAcceptance,
  Created,
  Funded,
  InProgress,
  Disputed,
  Complete,
  Canceled,
}

// This now perfectly matches the Escrow.sol v1.4 contract
export enum MilestoneState {
  Pending,
  Submitted,
  Approved,
  Paid,
  Rejected,
}

// This now perfectly matches the Escrow.sol v1.4 contract
export interface Milestone {
  description: string;
  amount: string;
  state: MilestoneState;
  ipfsCid: string;
  rejectionReason: string; // Added this property
}

export interface EscrowDetails {
  client: string;
  freelancer: string;
  totalAmount: string;
  balance: string;
  currentState: ContractState;
  milestones: Milestone[];
}