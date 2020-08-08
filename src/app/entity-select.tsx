import * as React from 'react';
import { EntityStore } from '../stores/entity-store';
import { IEntity } from '../stores/types';
import { ItemRenderer, Select } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';

export const defaultEntityItemRenderer: ItemRenderer<IEntity> = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          label={item.name}
          key={item.id}
          onClick={handleClick}
          text={item.name}
      />
  );
};

interface IEntitySelectOverrides<T> {
  itemRenderer?: ItemRenderer<T>;
  onItemSelect?: (item: T) => void;
  getActiveItem?: () => T|undefined;
  className?: string;
}

export const entitySelect = <T extends IEntity = IEntity>(store: EntityStore<T>, overrides?: IEntitySelectOverrides<T>) => {
  const EntitySelect = Select.ofType<T>();
  const currentItem = store.currentItem;
  const defaultItemSelect = (item: IEntity) => store.currentlySelectedID = item.id;
  const selectText = currentItem ? currentItem.name : 'Nothing Selected';

  const onItemSelect = overrides?.onItemSelect || defaultItemSelect;
  const itemRenderer = overrides?.itemRenderer || defaultEntityItemRenderer;
  const activeItem = (overrides?.getActiveItem && overrides.getActiveItem()) || currentItem;

  return (
    <EntitySelect
    className={overrides?.className}
    items={store.items}
    itemRenderer={itemRenderer}
    noResults={<MenuItem disabled={true} text="None Added" />}
    onItemSelect={onItemSelect}
    activeItem={activeItem}
  >        
    <Button text={selectText} rightIcon="double-caret-vertical" />
  </EntitySelect>    
  )
}