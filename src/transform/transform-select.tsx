import * as React from 'react';
import { Select, ItemRenderer} from '@blueprintjs/select';
import { Transform, TxOperation } from '../stores/types';
import { MenuItem } from '@blueprintjs/core';

export const OperationSelect = Select.ofType<TxOperation>();

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

  export const renderTxOperation: ItemRenderer<TxOperation> = (txOp, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            label={txOp.description||''}
            key={txOp.name}
            onClick={handleClick}
            text={txOp.name}
        />
    );
  };