import * as React from 'react';
import { Icon, IconName } from '@blueprintjs/core';

interface TabTitleProps {
  label: string,
  icon: IconName
}

export const TabTitle: React.FC<TabTitleProps> = props => {
  const { label, icon } = props;

  return (
    <div className="col tab-title">
      <span className="label">{label}</span>
      <Icon icon={icon} iconSize={64} title={label}/>
    </div>
  );
};