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

export const entitySelect = <T extends IEntity = IEntity>(store: EntityStore<T>, itemRendererOverride?: ItemRenderer<T>) => {
  const EntitySelect = Select.ofType<T>();
  const currentItem = store.currentItem;
  const selectText = currentItem ? currentItem.name : 'Nothing Selected';
  const onItemSelect = (item: IEntity) => store.currentlySelectedID = item.id;

  const itemRenderer = itemRendererOverride || defaultEntityItemRenderer;

  return (
    <EntitySelect
    items={store.items}
    itemRenderer={itemRenderer}
    noResults={<MenuItem disabled={true} text="None Added" />}
    onItemSelect={onItemSelect}
    activeItem={currentItem}
  >        
    <Button text={selectText} rightIcon="double-caret-vertical" />
  </EntitySelect>    
  )
}