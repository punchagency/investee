import { cn } from "@/lib/utils";

interface DSCRIndicatorProps {
  dscr: number;
  status: 'excellent' | 'good' | 'poor';
  statusColor: 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * DSCR Traffic Light Indicator Component
 *
 * Displays DSCR value with color-coded status:
 * - Green (>=1.25): Excellent - Strong cash flow
 * - Yellow (1.10-1.24): Good - Meets requirements
 * - Red (<1.10): Poor - Does not qualify
 */
export function DSCRIndicator({
  dscr,
  status,
  statusColor,
  size = 'md',
  showLabel = true,
  className,
}: DSCRIndicatorProps) {
  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      value: 'text-lg',
      label: 'text-xs',
    },
    md: {
      container: 'w-24 h-24',
      value: 'text-2xl',
      label: 'text-sm',
    },
    lg: {
      container: 'w-32 h-32',
      value: 'text-4xl',
      label: 'text-base',
    },
  };

  const colorClasses = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-500',
      text: 'text-green-700 dark:text-green-400',
      ring: 'ring-green-500/30',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-500',
      text: 'text-yellow-700 dark:text-yellow-400',
      ring: 'ring-yellow-500/30',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-500',
      text: 'text-red-700 dark:text-red-400',
      ring: 'ring-red-500/30',
    },
  };

  const sizes = sizeClasses[size];
  const colors = colorClasses[statusColor];

  const statusLabels = {
    excellent: 'Excellent',
    good: 'Good',
    poor: 'Poor',
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full border-4 flex flex-col items-center justify-center',
          'ring-4 shadow-lg transition-all duration-300',
          sizes.container,
          colors.bg,
          colors.border,
          colors.ring
        )}
      >
        <span className={cn('font-bold', sizes.value, colors.text)}>
          {dscr.toFixed(2)}x
        </span>
        {showLabel && size !== 'sm' && (
          <span className={cn('font-medium uppercase tracking-wide', sizes.label, colors.text)}>
            DSCR
          </span>
        )}
      </div>
      {showLabel && (
        <span className={cn('font-semibold', sizes.label, colors.text)}>
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
}

/**
 * Compact DSCR Badge for property cards
 */
interface DSCRBadgeProps {
  dscr: number;
  statusColor: 'green' | 'yellow' | 'red';
  className?: string;
}

export function DSCRBadge({ dscr, statusColor, className }: DSCRBadgeProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
    red: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border',
        colorClasses[statusColor],
        className
      )}
      title="Debt Service Coverage Ratio"
    >
      <span>DSCR</span>
      <span>{dscr.toFixed(2)}x</span>
    </div>
  );
}

/**
 * DSCR Traffic Light - Visual 3-light indicator
 */
interface DSCRTrafficLightProps {
  statusColor: 'green' | 'yellow' | 'red';
  className?: string;
}

export function DSCRTrafficLight({ statusColor, className }: DSCRTrafficLightProps) {
  return (
    <div className={cn('flex flex-col gap-1 p-2 bg-gray-800 rounded-lg', className)}>
      <div
        className={cn(
          'w-4 h-4 rounded-full transition-all duration-300',
          statusColor === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-red-900/30'
        )}
      />
      <div
        className={cn(
          'w-4 h-4 rounded-full transition-all duration-300',
          statusColor === 'yellow' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-yellow-900/30'
        )}
      />
      <div
        className={cn(
          'w-4 h-4 rounded-full transition-all duration-300',
          statusColor === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-green-900/30'
        )}
      />
    </div>
  );
}

/**
 * DSCR Summary Card - Full breakdown display
 */
interface DSCRSummaryProps {
  dscr: number;
  status: 'excellent' | 'good' | 'poor';
  statusColor: 'green' | 'yellow' | 'red';
  message: string;
  qualifies: boolean;
  monthlyRent: number;
  monthlyMortgage: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHOA?: number;
  totalDebtService: number;
  monthlyNetCashFlow: number;
  className?: string;
}

export function DSCRSummary({
  dscr,
  status,
  statusColor,
  message,
  qualifies,
  monthlyRent,
  monthlyMortgage,
  monthlyTaxes,
  monthlyInsurance,
  monthlyHOA = 0,
  totalDebtService,
  monthlyNetCashFlow,
  className,
}: DSCRSummaryProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);

  const colorClasses = {
    green: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/10',
  };

  return (
    <div className={cn('rounded-xl border-2 p-6', colorClasses[statusColor], className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            DSCR Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{message}</p>
        </div>
        <DSCRIndicator
          dscr={dscr}
          status={status}
          statusColor={statusColor}
          size="md"
          showLabel={false}
        />
      </div>

      <div className="space-y-4">
        {/* Income */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Monthly Income
          </h4>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Rental Income</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(monthlyRent)}
            </span>
          </div>
        </div>

        {/* Expenses */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Monthly Expenses (Debt Service)
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Mortgage (P&I)</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(monthlyMortgage)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Property Taxes</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(monthlyTaxes)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Insurance</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(monthlyInsurance)}</span>
            </div>
            {monthlyHOA > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">HOA</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(monthlyHOA)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Debt Service</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(totalDebtService)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Monthly Net Cash Flow
            </span>
            <span
              className={cn(
                'font-bold text-lg',
                monthlyNetCashFlow >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {formatCurrency(monthlyNetCashFlow)}
            </span>
          </div>
        </div>

        {/* Qualification Status */}
        <div
          className={cn(
            'mt-4 p-3 rounded-lg text-center font-medium',
            qualifies
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          )}
        >
          {qualifies ? '✓ Qualifies for DSCR Loan' : '✗ Does Not Meet DSCR Requirements'}
        </div>
      </div>
    </div>
  );
}
