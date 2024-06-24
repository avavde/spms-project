import React from 'react';
import PropTypes from 'prop-types';
import { CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import type { Colors } from '@coreui/react/types';

export interface CustomWidgetStatsCProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  className?: string;
  color?: Colors;
  icon?: string | React.ReactNode;
  inverse?: boolean;
  title?: string | React.ReactNode;
  value?: string | number | React.ReactNode;
  footerSlot?: React.ReactNode; // Добавляем слот для кнопки
}

export const CustomWidgetStatsC: React.ForwardRefExoticComponent<CustomWidgetStatsCProps & React.RefAttributes<HTMLDivElement>> = React.forwardRef(
  ({ className, color, icon, inverse, title, value, footerSlot, ...rest }, ref) => {
    const classNames = [
      className,
      'card',
      `bg-${color}`,
      inverse ? 'text-white' : 'text-dark',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <CCard className={classNames} ref={ref} {...rest}>
        <CCardBody>
          {icon && <div className="text-end text-primary">{icon}</div>}
          {value && <CCardText className="h2">{value}</CCardText>}
          {title && <CCardTitle>{title}</CCardTitle>}
          {footerSlot && <div className="mt-3">{footerSlot}</div>} {/* Добавляем слот для кнопки */}
        </CCardBody>
      </CCard>
    );
  },
);

CustomWidgetStatsC.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inverse: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  footerSlot: PropTypes.node,
};

export default CustomWidgetStatsC;
