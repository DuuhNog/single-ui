import React from 'react';
import { clsx } from 'clsx';
import './Stepper.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepperDirection = 'horizontal' | 'vertical';
export type StepperVariant = 'default' | 'dot' | 'panel';

export interface StepItem {
  id: string;
  label: string;
  /** Texto auxiliar exibido abaixo do label. */
  description?: string;
  icon?: React.ReactNode;
  /** Sobrescreve o status derivado de `activeStep` (ex: marcar o passo atual como erro). */
  status?: StepStatus;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  onStepClick?: (index: number) => void;
  /** @default 'horizontal' */
  direction?: StepperDirection;
  /**
   * `panel` é sempre renderizado horizontalmente (blocos em seta), independente de `direction`.
   * @default 'default'
   */
  variant?: StepperVariant;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className="single-stepper__status-icon"
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="single-stepper__status-icon"
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveStatus(step: StepItem, index: number, activeStep: number): StepStatus {
  if (step.status) return step.status;
  if (index < activeStep) return 'finish';
  if (index === activeStep) return 'process';
  return 'wait';
}

function stepIndicatorContent(step: StepItem, index: number, status: StepStatus) {
  if (step.icon) return step.icon;
  if (status === 'finish') return <CheckIcon />;
  if (status === 'error') return <ErrorIcon />;
  return <span className="single-stepper__number">{index + 1}</span>;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onStepClick,
  direction = 'horizontal',
  variant = 'default',
  className,
}) => {
  if (variant === 'panel') {
    return (
      <PanelStepper steps={steps} activeStep={activeStep} onStepClick={onStepClick} className={className} />
    );
  }

  return (
    <div
      className={clsx(
        'single-stepper',
        `single-stepper--${direction}`,
        `single-stepper--${variant}`,
        className,
      )}
      role="list"
    >
      {steps.map((step, index) => {
        const status = resolveStatus(step, index, activeStep);
        const isLast = index === steps.length - 1;
        const isClickable = !!onStepClick && status === 'finish';

        const handleClick = () => {
          if (isClickable) onStepClick?.(index);
        };

        return (
          <div
            key={step.id}
            role="listitem"
            aria-current={status === 'process' ? 'step' : undefined}
            className={clsx(
              'single-stepper__step',
              `single-stepper__step--${status}`,
              { 'single-stepper__step--clickable': isClickable, 'single-stepper__step--last': isLast },
            )}
          >
            <div className="single-stepper__indicator-col">
              <button
                type="button"
                className={clsx('single-stepper__circle', {
                  'single-stepper__dot': variant === 'dot',
                })}
                onClick={handleClick}
                disabled={!isClickable}
                aria-label={step.label}
              >
                {variant === 'default' && stepIndicatorContent(step, index, status)}
              </button>
              {!isLast && (
                <span
                  className={clsx('single-stepper__connector', {
                    'single-stepper__connector--done': status === 'finish',
                  })}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="single-stepper__text">
              <span className="single-stepper__label">{step.label}</span>
              {step.description && (
                <span className="single-stepper__description">{step.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Stepper.displayName = 'Stepper';

// ─── Panel variant (blocos em seta, sempre horizontal) ───────────────────────

interface PanelStepperProps {
  steps: StepItem[];
  activeStep: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

function PanelStepper({ steps, activeStep, onStepClick, className }: PanelStepperProps) {
  return (
    <div className={clsx('single-stepper single-stepper--panel-root', className)} role="list">
      {steps.map((step, index) => {
        const status = resolveStatus(step, index, activeStep);
        const isClickable = !!onStepClick && status === 'finish';
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;

        return (
          <button
            key={step.id}
            type="button"
            role="listitem"
            aria-current={status === 'process' ? 'step' : undefined}
            onClick={() => { if (isClickable) onStepClick?.(index); }}
            disabled={!isClickable}
            className={clsx(
              'single-stepper__panel',
              `single-stepper__panel--${status}`,
              {
                'single-stepper__panel--first': isFirst,
                'single-stepper__panel--last': isLast,
                'single-stepper__panel--clickable': isClickable,
              },
            )}
          >
            <span className="single-stepper__panel-label">
              {step.icon && <span className="single-stepper__panel-icon">{step.icon}</span>}
              {step.label}
            </span>
            {step.description && (
              <span className="single-stepper__panel-description">{step.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
