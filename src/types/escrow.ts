// src/types/escrow.ts

export enum ContractState {
  Created,
  Funded,
  InProgress,
  Disputed,
  Complete,
}

export enum MilestoneState {
  Pending,
  Submitted,
  Approved,
  Paid,
}

export interface Milestone {
  description: string;
  amount: string; // Formatted as ETH string
  state: MilestoneState;
  ipfsCid: string;
}

export interface EscrowDetails {
  client: string;
  freelancer: string;
  totalAmount: string; // Formatted as ETH string
  balance: string; // Formatted as ETH string
  currentState: ContractState;
  milestones: Milestone[];
}