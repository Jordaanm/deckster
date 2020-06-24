import * as React from 'react';
import { Select, ItemRenderer} from '@blueprintjs/select';
import { CardDesign } from '../stores/types';
import { MenuItem } from '@blueprintjs/core';

export const CardDesignSelect = Select.ofType<CardDesign>();

export const renderDesignOption: ItemRenderer<CardDesign> = (cardDesign, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          label={cardDesign.name}
          key={cardDesign.id}
          onClick={handleClick}
          text={cardDesign.name}
      />
  );
};