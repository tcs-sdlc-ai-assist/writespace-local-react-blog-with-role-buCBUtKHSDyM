import PropTypes from 'prop-types';

/**
 * Reusable admin dashboard stat tile component.
 * @param {Object} props
 * @param {string} props.title - The label/title for the stat.
 * @param {string|number} props.value - The stat value to display.
 * @param {string} props.icon - An emoji or text icon to display.
 * @param {string} [props.color] - A Tailwind color key (e.g. "primary", "secondary", "neutral"). Defaults to "primary".
 * @returns {JSX.Element}
 */
export default function StatCard({ title, value, icon, color = 'primary' }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      iconBg: 'bg-primary-100',
      iconText: 'text-primary-700',
      valueText: 'text-primary-900',
    },
    secondary: {
      bg: 'bg-secondary-50',
      iconBg: 'bg-secondary-100',
      iconText: 'text-secondary-700',
      valueText: 'text-secondary-900',
    },
    neutral: {
      bg: 'bg-neutral-50',
      iconBg: 'bg-neutral-200',
      iconText: 'text-neutral-700',
      valueText: 'text-neutral-900',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`${colors.bg} rounded-2xl shadow-card p-6 flex items-center gap-4 transition-shadow hover:shadow-soft`}
    >
      <div
        className={`${colors.iconBg} ${colors.iconText} inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-500 truncate">{title}</p>
        <p className={`text-2xl font-bold ${colors.valueText} mt-1`}>{value}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'neutral']),
};