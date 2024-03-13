const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("CollateralizedLoan", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCollateralizedLoanFixture() {
    const [borrower, lender] = await ethers.getSigners();

    const CollateralizedLoan = await ethers.getContractFactory(
      "CollateralizedLoan"
    );
    const collateralizedLoan = await CollateralizedLoan.deploy();

    return { collateralizedLoan, borrower, lender };
  }


  describe("Collateralized Loan", function () {
    it("should request a loan by calling depositCollateralAndRequestLoan method", async function () {
      const { collateralizedLoan, borrower, lender } = await loadFixture(
        deployCollateralizedLoanFixture
      );
      const collateral = ethers.parseEther("100");
      const loanAmount = ethers.parseEther("200");
      const interestRate = 10;
      const durationInDays = 30;

      await expect(
        collateralizedLoan
          .connect(borrower)
          .depositCollateralAndRequestLoan(interestRate, durationInDays, {
            value: collateral,
          })
      )
        .to.emit(collateralizedLoan, "loanRequested")
        .withArgs(0, loanAmount, borrower.address, interestRate, anyValue);
    });

    it("should return message if funding amount is not equal to loan amount", async function () {
      const { collateralizedLoan, borrower, lender } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      const fundingAmount = ethers.parseEther("150");

      await collateralizedLoan
        .connect(borrower)
        .depositCollateralAndRequestLoan( 10, 30, {
          value: ethers.parseEther("100"),
        });

      await expect(
        collateralizedLoan
          .connect(lender)
          .fundLoan(0, {
            value: fundingAmount,
          })
      )
        .to.be.revertedWith("Amount must be equal to the requested loan amount.");
    });

    it("should fund the loan by calling fundLoan method", async function () {
      const { collateralizedLoan, borrower, lender } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      const loanAmount = ethers.parseEther("200");

      await collateralizedLoan
        .connect(borrower)
        .depositCollateralAndRequestLoan( 10, 30, {
          value: ethers.parseEther("100"),
        });

      await expect(
        collateralizedLoan
          .connect(lender)
          .fundLoan(0 , {
            value: loanAmount,
          })
      )
        .to.emit(collateralizedLoan, "loanFunded")
        .withArgs(0, lender.address, loanAmount);
    });

    it("should not be able to repay the loan if loan is not existing", async function () {
      const { collateralizedLoan, borrower, lender } = await loadFixture(
        deployCollateralizedLoanFixture
      );
      const loanAmount = ethers.parseEther("200");
      const interestRate = 10n;
      const repayAmount = loanAmount + (interestRate * loanAmount / 100n);
      
      await expect(
        collateralizedLoan
          .connect(borrower)
          .repayLoan(0 , {
            value: repayAmount,
          })
      )
        .to.be.revertedWith("Loan does not exist.");
    });

    it("should repay the loan by calling repayLoan method", async function () {
      const { collateralizedLoan, borrower, lender } = await loadFixture(
        deployCollateralizedLoanFixture
      );

      const loanAmount = ethers.parseEther("200");
      const interestRate = 10n;
      const repayAmount = loanAmount + (interestRate * loanAmount / 100n);
      await collateralizedLoan
        .connect(borrower)
        .depositCollateralAndRequestLoan( 10, 30, {
          value: ethers.parseEther("100"),
        });

      await collateralizedLoan
      .connect(lender)
      .fundLoan(0 , {
        value: loanAmount,
      });

      await expect(
        collateralizedLoan
          .connect(borrower)
          .repayLoan(0 , {
            value: repayAmount,
          })
      )
        .to.emit(collateralizedLoan, "loanRepaid")
        .withArgs(0, borrower.address);
    });
  });
});
