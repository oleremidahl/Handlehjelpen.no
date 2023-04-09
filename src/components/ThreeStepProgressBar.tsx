import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
interface Props {
  currentStep: number;
}

const ThreeStepProgressBar: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="progress-bar">
      <div
        className={`step${currentStep >= 1 ? ' active' : ''}`}
        title="Shopping Cart"
      >
        <ShoppingCartIcon />
      </div>
      <div
        className={`step${currentStep >= 2 ? ' active' : ''}`}
        title="Information"
      >
        <InfoIcon />
      </div>
      <div
        className={`step${currentStep >= 3 ? ' active' : ''}`}
        title="Verification"
      >
        <VerifiedIcon />
      </div>
      <style>{`
        .progress-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 2rem;
          background-color: #e9f3ec;
          border-radius: 1rem;
          padding: 0.25rem;
        }

        .step {
          display: flex;
          justify-content: center;
          align-items: center;
          width: calc(100% / 3 - 0.5rem);
          height: 100%;
          border-radius: 1rem;
          transition: background-color 0.2s ease;
        }

        .step.active {
          background-color: #3cb371;
        }

        .step svg {
          width: 1rem;
          height: 1rem;
          fill: #fff;
        }
      `}</style>
    </div>
  );
};

export default ThreeStepProgressBar;
