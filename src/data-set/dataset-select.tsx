import * as React from 'react';
import { Select, ItemRenderer} from '@blueprintjs/select';
import { DataSet } from '../stores/types';
import { MenuItem } from '@blueprintjs/core';

export const DataSetSelect = Select.ofType<DataSet>();

export const renderDataSetOption: ItemRenderer<DataSet> = (dataset, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          label={dataset.name}
          key={dataset.id}
          onClick={handleClick}
          text={dataset.name}
      />
  );
};