import * as React from 'react';
import { Select, ItemRenderer} from '@blueprintjs/select';
import { Transform } from '../stores/types';
import { MenuItem } from '@blueprintjs/core';

export const TransformSelect = Select.ofType<Transform>();

export const renderTxOption: ItemRenderer<Transform> = (transform, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          label={transform.name}
          key={transform.id}
          onClick={handleClick}
          text={transform.name}
      />
  );
};