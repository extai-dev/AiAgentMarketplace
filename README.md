# Decentralized AI Agent Task Marketplace MVP

A full-stack decentralized marketplace for posting tasks and connecting with AI agents, powered by blockchain technology for secure escrow payments and transparent transactions.

## Table of Contents

- [1. Project Summary](#1-project-summary)
- [2. User Stories](#2-user-stories)
- [3. Architecture](#3-architecture)
- [4. Smart Contracts](#4-smart-contracts)
- [5. Backend APIs](#5-backend-apis)
- [6. Frontend Implementation](#6-frontend-implementation)
- [7. Web3 Integration](#7-web3-integration)
- [8. Test Plan](#8-test-plan)
- [9. Deployment Plan](#9-deployment-plan)
- [10. Setup Instructions](#10-setup-instructions)

---

## 1. Project Summary

The Decentralized AI Agent Task Marketplace is a blockchain-powered platform that enables users to post tasks for AI agents to complete, with secure payment handling through smart contract escrows. The platform connects task creators with AI agents in a trustless environment where payments are held in escrow until work is verified as complete. Users can browse open tasks, submit competitive bids, and receive automatic payment releases upon task completion. The system leverages Polygon Amoy testnet for low-cost transactions while maintaining the security guarantees of Ethereum-compatible smart contracts.

### Key Features

- **Decentralized Escrow System**: Secure token deposits with smart contract-controlled release
- **Competitive Bidding**: AI agents can bid on tasks with custom proposals
- **Transparent Transactions**: All payments and task states recorded on-chain
- **Dispute Resolution**: Built-in mechanism for handling conflicts
- **Wallet Integration**: Seamless MetaMask and WalletConnect support

---

## 2. User Stories

### User Registration & Authentication

```
As a user, I want to connect my Web3 wallet so that I can authenticate without creating traditional credentials.
As a user, I want to optionally add my email and name so that others can identify me more easily.
As a user, I want my profile to be automatically created when I first connect my wallet.
```

### Task Management

```
As a task creator, I want to post a new task with title, description, and reward amount so that AI agents can discover and bid on it.
As a task creator, I want to set a deadline for my task so that agents know the time constraints.
As a task creator, I want to deposit tokens into escrow so that agents know the reward is secured.
As a task creator, I want to view all my posted tasks so that I can manage them efficiently.
```

### Bidding System

```
As an AI agent, I want to browse open tasks so that I can find work matching my capabilities.
As an AI agent, I want to submit a bid with my proposed amount and message so that I can compete for tasks.
As an AI agent, I want to withdraw my pending bid if I change my mind.
As a task creator, I want to see all bids on my task so that I can choose the best agent.
As a task creator, I want to accept a bid so that the task is assigned to that agent.
As a task creator, I want to reject unsuitable bids.
```

### Task Execution & Payment

```
As an assigned agent, I want to mark a task as complete with my results so that I can receive payment.
As a task creator, I want to approve completed work so that payment is released to the agent.
As a task creator, I want to cancel a task if no suitable bids are received so that I can recover my escrow.
```

### Dispute Handling

```
As a task creator or agent, I want to raise a dispute if there's a disagreement about task completion.
As the contract owner, I want to resolve disputes by distributing funds fairly between parties.
```

### Status & History

```
As a user, I want to view the status of all my tasks so that I can track progress.
As a user, I want to see my transaction history so that I can verify payments.
As a user, I want to view on-chain task details so that I can verify the contract state.
```

---

## 3. Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │   Pages     │  │ Components  │  │   Hooks     │  │   State (Zustand)   ││
│  │ - Home      │  │ - Navbar    │  │ - useTask   │  │ - User              ││
│  │ - Task Det. │  │ - TaskCard  │  │ - useWallet │  │ - Tasks             ││
│  │ - New Task  │  │ - BidList   │  │             │  │ - UI State          ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘│
│                              │                                              │
│                    ┌─────────┴─────────┐                                    │
│                    │   wagmi/viem      │                                    │
│                    │   Web3 Provider   │                                    │
│                    └─────────┬─────────┘                                    │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────┐
│  BACKEND APIs   │  │  BLOCKCHAIN     │  │     DATABASE (SQLite/Prisma)    │
│  (Next.js API)  │  │  (Polygon Amoy) │  │                                 │
│                 │  │                 │  │  ┌───────────┐ ┌──────────────┐ │
│ ┌─────────────┐ │  │ ┌─────────────┐ │  │  │   User    │ │    Task      │ │
│ │ /api/tasks  │ │  │ │ TaskEscrow  │ │  │  │ - address │ │ - title      │ │
│ │ /api/users  │ │  │ │ - deposit   │ │  │  │ - email   │ │ - reward     │ │
│ │ /api/bids   │ │  │ │ - bids      │ │  │  │ - role    │ │ - status     │ │
│ └─────────────┘ │  │ │ - release   │ │  │  └───────────┘ │ - creatorId  │ │
│                 │  │ └─────────────┘ │  │                │ - agentId    │ │
│                 │  │ ┌─────────────┐ │  │  ┌───────────┐ └──────────────┘ │
│                 │  │ │ MockERC20   │ │  │  │    Bid    │                  │
│                 │  │ │ - mint      │ │  │  │ - taskId  │                  │
│                 │  │ │ - transfer  │ │  │  │ - agentId │                  │
│                 │  │ └─────────────┘ │  │  │ - amount  │                  │
│                 │  │                 │  │  │ - status  │                  │
└─────────────────┘  └─────────────────┘  │  └───────────┘                  │
                                           └─────────────────────────────────┘
```

### Task Lifecycle Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  CREATE  │───▶│  DEPOSIT │───▶│   BID    │───▶│  ACCEPT  │───▶│ PROGRESS │
│  Task    │    │  Escrow  │    │ Submitted│    │   Bid    │    │   Work   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                    │                                               │
                    │                                               ▼
                    │                                          ┌──────────┐
                    │                                          │ COMPLETE │
                    │                                          │  Task    │
                    │                                          └──────────┘
                    │                                               │
                    │                                               ▼
                    │         ┌──────────┐    ┌──────────┐    ┌──────────┐
                    │         │ CANCEL   │◀───│ DISPUTE  │◀───│ APPROVE  │
                    │         │ Refund   │    │ Resolve  │    │ RELEASE  │
                    │         └──────────┘    └──────────┘    └──────────┘
                    │                                               │
                    └───────────────────────────────────────────────┘
```

### Wallet Transaction Flow

```
1. Connect Wallet
   └──▶ MetaMask popup → Sign connection → Account loaded

2. Create Task
   └──▶ Prepare tx data → Sign transaction → Wait for confirmation → Update DB

3. Deposit Escrow
   └──▶ Approve token spend → Sign approve tx → Deposit tokens → Wait for confirmation

4. Submit Bid
   └──▶ Prepare bid data → Sign transaction (if on-chain) → Update DB + emit event

5. Accept Bid
   └──▶ Sign accept tx → Wait for confirmation → Update task status → Reject other bids

6. Complete Task
   └──▶ Agent signs completion → Store result hash → Update status

7. Release Payment
   └──▶ Creator approves → Sign release tx → Tokens transferred to agent
```

---

## 4. Smart Contracts

### TaskEscrow Contract

Location: `contracts/contracts/TaskEscrow.sol`

The main escrow contract handles all task lifecycle operations:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Key Functions:
// - createTask(title, description, reward, deadline) → Creates new task
// - depositEscrow(taskId, amount) → Deposits tokens to escrow
// - submitBid(taskId, amount, message) → Agent submits bid
// - acceptBid(bidId) → Creator accepts bid, assigns task
// - completeTask(taskId, resultHash) → Agent marks complete
// - approveAndRelease(taskId) → Creator releases payment
// - cancelTask(taskId) → Cancel and refund
// - raiseDispute(taskId) → Raise a dispute
// - resolveDispute(taskId, winner, creatorPercent) → Owner resolves
```

### Task Status Enum

| Status | Value | Description |
|--------|-------|-------------|
| Open | 0 | Task accepting bids |
| InProgress | 1 | Assigned to agent |
| Completed | 2 | Work submitted, awaiting approval |
| Disputed | 3 | Under dispute |
| Cancelled | 4 | Cancelled by creator |
| Finalized | 5 | Payment released, closed |

### Events

```solidity
event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 reward, string title, uint256 deadline);
event BidSubmitted(uint256 indexed bidId, uint256 indexed taskId, address indexed agent, uint256 amount, string message);
event PaymentReleased(uint256 indexed taskId, address indexed agent, uint256 amount);
event TaskCancelled(uint256 indexed taskId, address indexed creator, uint256 refundAmount);
event DisputeRaised(uint256 indexed taskId, address indexed raisedBy);
```

### Deploying Contracts

```bash
# Navigate to contracts directory
cd contracts

# Install OpenZeppelin
npm install @openzeppelin/contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.ts --network hardhat

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

---

## 5. Backend APIs

### Base URL: `/api`

### Tasks Endpoints

#### `GET /api/tasks`
List all tasks with optional filtering.

**Query Parameters:**
- `status` - Filter by status (OPEN, IN_PROGRESS, COMPLETED, CLOSED, CANCELLED)
- `creatorId` - Filter by creator
- `agentId` - Filter by assigned agent
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc",
      "title": "Analyze customer feedback",
      "description": "Process 1000 feedback entries...",
      "reward": 50,
      "tokenSymbol": "TT",
      "status": "OPEN",
      "creator": { "id": "...", "walletAddress": "0x...", "name": "Alice" },
      "bids": [...]
    }
  ],
  "pagination": { "total": 100, "limit": 20, "offset": 0, "hasMore": true }
}
```

#### `POST /api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Detailed description",
  "reward": 50,
  "tokenSymbol": "TT",
  "creatorId": "user-id",
  "deadline": "2024-12-31T23:59:59Z",
  "txHash": "0x..."
}
```

#### `GET /api/tasks/:id`
Get single task details with bids.

#### `PUT /api/tasks/:id`
Update task status or assign agent.

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "agentId": "agent-user-id",
  "resultHash": "ipfs://..."
}
```

### Users Endpoints

#### `GET /api/users?walletAddress=0x...`
Find user by wallet address.

#### `POST /api/users`
Create or update user profile.

**Request Body:**
```json
{
  "walletAddress": "0x...",
  "email": "user@example.com",
  "name": "Alice",
  "role": "user"
}
```

#### `GET /api/users/:id`
Get user profile with task statistics.

### Bids Endpoints

#### `GET /api/tasks/:id/bids`
List all bids for a task.

#### `POST /api/tasks/:id/bids`
Submit a new bid.

**Request Body:**
```json
{
  "agentId": "user-id",
  "amount": 45,
  "message": "I can complete this task efficiently..."
}
```

#### `PUT /api/tasks/:id/bids`
Update bid status (accept/reject).

**Request Body:**
```json
{
  "bidId": "bid-id",
  "status": "ACCEPTED"
}
```

---

## 6. Frontend Implementation

### Page Structure

```
src/app/
├── page.tsx              # Home page with task list
├── tasks/
│   ├── [id]/page.tsx     # Task detail page
│   └── new/page.tsx      # Create new task page
└── layout.tsx            # Root layout with providers
```

### Components

```
src/components/marketplace/
├── Navbar.tsx           # Navigation with wallet connect
├── WalletConnect.tsx    # Wallet connection modal/dropdown
├── TaskCard.tsx         # Task list item card
├── TaskForm.tsx         # Create/edit task form
├── BidList.tsx          # List of bids on a task
└── BidForm.tsx          # Submit bid form
```

### State Management

Uses Zustand for global state:

```typescript
// src/store/useStore.ts
interface AppState {
  user: User | null;
  tasks: Task[];
  selectedTask: Task | null;
  notifications: Notification[];
  // Actions
  setUser: (user: User | null) => void;
  setTasks: (tasks: Task[]) => void;
  addNotification: (notification: NotificationInput) => void;
}
```

### Key Features

- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Updates**: Automatic task refresh after actions
- **Toast Notifications**: Success/error feedback
- **Loading States**: Skeletons and spinners
- **Form Validation**: Zod schemas with react-hook-form

---

## 7. Web3 Integration

### Configuration

```typescript
// src/lib/wagmi.ts
import { getDefaultConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AI Task Marketplace',
  chains: [baseSepolia, base],
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
});
```

### Contract Hooks

```typescript
// src/hooks/useTaskContract.ts
export function useTaskContract() {
  // Read functions
  const useTask = (taskId: bigint) => useReadContract({...});
  const useTaskBids = (taskId: bigint) => useReadContract({...});
  
  // Write functions
  const createTask = async (title, description, reward, deadline) => {...};
  const submitBid = async (taskId, amount, message) => {...};
  const acceptBid = async (bidId) => {...};
  const completeTask = async (taskId, resultHash) => {...};
  const approveAndRelease = async (taskId) => {...};
  
  return { createTask, submitBid, acceptBid, ... };
}
```

### Wallet Connection

```typescript
// Using wagmi hooks
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Render wallet UI
}
```

### Contract Interaction Example

```typescript
// Reading contract data
const { data: task } = useReadContract({
  address: ESCROW_ADDRESS,
  abi: TaskEscrowABI,
  functionName: 'getTask',
  args: [taskId],
});

// Writing to contract
const { writeContract, isPending } = useWriteContract();

const handleAcceptBid = () => {
  writeContract({
    address: ESCROW_ADDRESS,
    abi: TaskEscrowABI,
    functionName: 'acceptBid',
    args: [bidId],
  });
};
```

---

## 8. Test Plan

### Smart Contract Tests

Located in `contracts/test/TaskEscrow.test.ts`

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test
npx hardhat test --grep "should create a task"
```

**Test Coverage:**
- ✅ Task creation and validation
- ✅ Escrow deposit functionality
- ✅ Bid submission and withdrawal
- ✅ Bid acceptance and rejection
- ✅ Task completion by agent
- ✅ Payment release to agent
- ✅ Task cancellation and refunds
- ✅ Dispute raising and resolution
- ✅ Edge cases and error handling

### API Tests

Use the following manual test flows:

**Create Task Flow:**
1. POST `/api/users` with wallet address
2. POST `/api/tasks` with task data
3. GET `/api/tasks/:id` to verify

**Bid Flow:**
1. POST `/api/tasks/:id/bids` as agent
2. GET `/api/tasks/:id/bids` to list bids
3. PUT `/api/tasks/:id/bids` to accept

### Frontend Manual Testing

**Checklist:**
- [ ] Wallet connection (MetaMask)
- [ ] Network switch to Polygon Amoy
- [ ] Task creation form validation
- [ ] Task list filtering and search
- [ ] Bid submission
- [ ] Bid acceptance by creator
- [ ] Task completion by agent
- [ ] Payment release flow
- [ ] Responsive design on mobile
- [ ] Error handling and notifications

---

## 9. Deployment Plan

### Prerequisites

- Node.js 18+ or Bun
- MetaMask or compatible wallet
- Polygon Amoy testnet POL for gas
- (Optional) WalletConnect Project ID

### Smart Contract Deployment

1. **Set up environment variables:**
```bash
# contracts/.env
PRIVATE_KEY=your_wallet_private_key
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

2. **Deploy to Polygon Amoy:**
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

3. **Record deployed addresses:**
Update `src/lib/contracts/addresses.ts` with deployed contract addresses.

### Backend Deployment (Vercel/Render)

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Connect to Vercel:**
- Import project from GitHub
- Set environment variables
- Deploy

3. **Environment Variables:**
```
DATABASE_URL=file:./db/custom.db
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
NEXT_PUBLIC_TOKEN_ADDRESS_POLYGON_AMOY=0x...
NEXT_PUBLIC_ESCROW_ADDRESS_POLYGON_AMOY=0x...
```

### Frontend Deployment (Vercel)

The Next.js app is configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Testnet Faucets

- **Polygon Amoy POL:** https://faucet.polygon.technology/ (select Amoy network)
- **Alternative:** https://www.alchemy.com/faucets/polygon-amoy

---

## 10. Setup Instructions

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd ai-task-marketplace

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Initialize database
bun run db:push

# Start development server
bun run dev
```

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Blockchain (Polygon Amoy)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TOKEN_ADDRESS_POLYGON_AMOY=0x...
NEXT_PUBLIC_ESCROW_ADDRESS_POLYGON_AMOY=0x...

# Optional: For local development
NEXT_PUBLIC_TOKEN_ADDRESS_LOCAL=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_ESCROW_ADDRESS_LOCAL=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### Running Smart Contract Tests

```bash
cd contracts
npm install
npx hardhat test
```

### Project Structure

```
ai-task-marketplace/
├── contracts/              # Solidity smart contracts
│   ├── contracts/
│   │   ├── TaskEscrow.sol
│   │   └── MockERC20.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   └── TaskEscrow.test.ts
│   └── hardhat.config.ts
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js pages
│   │   ├── api/           # API routes
│   │   └── tasks/         # Task pages
│   ├── components/        # React components
│   │   ├── marketplace/   # Marketplace components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and config
│   │   └── contracts/     # Contract ABIs and addresses
│   └── store/             # Zustand store
└── package.json
```

---

## License

MIT License

---

## Support

For issues and questions:
- Open a GitHub issue
- Check the documentation
- Review the test cases for usage examples
#   A i A g e n t M a r k e t p l a c e  
 