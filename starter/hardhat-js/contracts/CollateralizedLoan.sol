// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Collateralized Loan Contract
contract CollateralizedLoan {
    // Define the structure of a loan
    struct Loan {
        address borrower;
        // Hint: Add a field for the lender's address
        address lender;
        uint collateralAmount;
        // Hint: Add fields for loan amount, interest rate, due date, isFunded, isRepaid
        uint loanAmount;
        uint interestRate;
        uint dueDate;
        bool isFunded;
        bool isRepaid;
        bool loanExists;
    }

    // Create a mapping to manage the loans
    mapping(uint => Loan) public loans;
    uint public nextLoanId;

    // Hint: Define events for loan requested, funded, repaid, and collateral claimed
    event loanRequested(uint loanId, uint loanAmount, address borrower, uint interestRate, uint dueDate);
    event loanFunded(uint loadId, address lender, uint loanAmount);
    event loanRepaid(uint loadId, address borrower);
    event collateralClaimed(uint loadId, address lender, uint collateralAmount);

    // Custom Modifiers
    // Hint: Write a modifier to check if a loan exists
    modifier checkLoanExists(uint loadId)
    { 
        require(loans[loadId].loanExists, "Loan does not exist."); 
        _; 
    }

    // Hint: Write a modifier to ensure a loan is not already funded
    modifier checkLoanNotFunded(uint loadId)
    { 
        require(!loans[loadId].isFunded, "Loan is already funded."); 
        _; 
    }

    // Function to deposit collateral and request a loan
    function depositCollateralAndRequestLoan(uint _interestRate, uint _durationInDays) external payable {
        // Hint: Check if the collateral is more than 0
        require(msg.value > 0, "Collateral amount must be more than 0.");
        // Hint: Calculate the loan amount based on the collateralized amount
        uint loanAmount = msg.value * 2;
        // Hint: Increment nextLoanId and create a new loan in the loans mapping
        uint loanId = nextLoanId++;

        loans[loanId] = Loan({
            borrower: msg.sender,
            lender: address(0),
            loanAmount: loanAmount,
            loanExists: true,
            dueDate: block.timestamp + (_durationInDays * 24 * 60 * 60),
            interestRate: _interestRate,
            isRepaid: false,
            isFunded: false,
            collateralAmount: msg.value
        });
        // Hint: Emit an event for loan request
        emit loanRequested(loanId, loanAmount, msg.sender, _interestRate, block.timestamp + (_durationInDays * 24 * 60 * 60));
    }

    // Function to fund a loan
    // Hint: Write the fundLoan function with necessary checks and logic
    function fundLoan(uint loanId) external payable checkLoanExists(loanId) checkLoanNotFunded(loanId) {
        Loan storage loan = loans[loanId];
        require(msg.value == loan.loanAmount, "Amount must be equal to the requested loan amount.");

        loan.lender = msg.sender;
        loan.isFunded = true;
        payable(loan.borrower).transfer(msg.value);

        emit loanFunded(loanId, msg.sender, msg.value);
    }

    // Function to repay a loan
    // Hint: Write the repayLoan function with necessary checks and logic
    function repayLoan(uint loanId) external payable checkLoanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(!loan.isRepaid, "Loan is already repaid by the borrower.");
        require(msg.sender == loan.borrower, "Only borrower can repay this loan.");
        require(msg.value == loan.loanAmount + (loan.loanAmount * loan.interestRate) / 100, "Repayment amount does not match the loan amount.");
        loan.isRepaid = true;
        payable(loan.lender).transfer(msg.value);

        emit loanRepaid(loanId, msg.sender);
    }

    // Function to claim collateral on default
    // Hint: Write the claimCollateral function with necessary checks and logic
    function claimCollateral(uint loanId) external checkLoanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(!loan.isRepaid, "Loan is already repaid by the borrower.");
        require(block.timestamp >= loan.dueDate, "Due Date is not execeeded.");
        require(msg.sender == loan.lender, "Only lender can claim the collateral amount.");

        payable(loan.lender).transfer(loan.collateralAmount);
        loan.collateralAmount = 0;
        loan.isRepaid = true;
        emit collateralClaimed(loanId, msg.sender, loan.collateralAmount);
    }
}