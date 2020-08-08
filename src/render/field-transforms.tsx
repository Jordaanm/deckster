import * as React from 'react';
import { Render, Transform, FieldTransformIds } from '../stores/types';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';
import { Project } from '../stores/project';
import { useObserver } from 'mobx-react-lite';
import { Icon, Button, Dialog, MenuItem, Classes } from '@blueprintjs/core';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { entitySelect } from '../app/entity-select';

const removeTransform = (deck: Render, index: number) => {
  deck.fieldTransforms.splice(index, 1);
};

const moveItem = (deck: Render, fromIndex: number, direction: number) => {
  const toIndex = fromIndex + direction;

  var element = deck.fieldTransforms[fromIndex];
  deck.fieldTransforms.splice(fromIndex, 1);
  deck.fieldTransforms.splice(toIndex, 0, element);
};

const addTransform = (deck: Render) => {
  deck.fieldTransforms.push({
    field: "",
    transform: ""
  });    
};

interface FieldTransformEditorProps {
  deck: Render;
  save: (fieldTransforms: FieldTransformIds[]) => void;
}

export const FieldTransformEditor: React.FC<FieldTransformEditorProps> = props => {
  const {deck, save} = props;
  const stores: IStores = useStores();  
  const project: Project = stores.project;
  const [fieldTx, setFieldTx] = React.useState<FieldTransformIds[]>(deck.fieldTransforms);
  
  const updateTx = (index: number, key: "field"|"transform", value: string) => {
    const newTx = fieldTx.map(x => ({...x}));
    newTx[index][key] = value;
    setFieldTx(newTx);
  }

  return useObserver(() => {  

    const fields = [...(project.datasets.find(deck.dataSet||undefined)?.fields || [])];

    return (
      <div className="col">
        <div className={Classes.DIALOG_BODY}>
          {fieldTx.length === 0 && "No Transforms Defined"}
          {fieldTx.map((tx, index) => {
            const activeField = tx.field||null;
            const txName = project.transforms.find(tx.transform);
            const key = `${index}-${txName||''}-${tx.field}`;
            return (
              <div className="row" key={key}>
                <div className="row f2 space-between">
                  <FieldSelect
                    items = {fields}
                    itemRenderer={renderField}
                    noResults={<MenuItem disabled={true} text="No Fields Added" />}
                    onItemSelect={(field) => updateTx(index, "field", field)}
                    activeItem={activeField}
                  >
                    <Button text={activeField} rightIcon="double-caret-vertical" />
                  </FieldSelect>
                  <Icon icon="flows" iconSize={20} />
                  {entitySelect<Transform>(project.transforms, {
                    onItemSelect: (item) => updateTx(index, "transform", item.id),
                    getActiveItem: () => project.transforms.find(fieldTx[index].transform)
                  })}
                </div>
                <div className="row f1">
                  <Button icon="delete" onClick={() => removeTransform(deck, index)}></Button>
                  <Button icon="arrow-down" onClick={() => moveItem(deck, index, 1)}></Button>
                  <Button icon="arrow-up" onClick={() => moveItem(deck, index, -1)}></Button>
                </div>
              </div>
            )
          }).filter(Boolean)}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button icon="add-row-bottom" onClick={() => addTransform(deck)}>Add a Transform</Button>
            <Button icon="add-row-bottom" onClick={() => save(fieldTx)}>Save Changes</Button>              
          </div>
        </div>
      </div>
    );
  });
}


interface FieldTransformViewProps {
  deck: Render;
}


export const FieldTransformView: React.FC<FieldTransformViewProps> = (props) => {
  const { deck } = props;
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  
  const edit = () => setIsEditing(true);
  const stopEditing = () => setIsEditing(false);

  return useObserver(() => {

    const save = (ft: FieldTransformIds[]) => {
      deck.fieldTransforms = ft;
      setIsEditing(false);
    };

    const fieldTx = deck.fieldTransforms;

    return (
      <>
        <div className="row">
          {fieldTx.length === 0 && "No Transforms Applied"}
          {fieldTx.length === 1 && "1 Transform Applied"}
          {fieldTx.length > 1 && <span>{`${fieldTx.length} Transforms Applied`}</span>}
          <Button icon="edit" onClick={edit}>Edit</Button>
        </div>
        <Dialog isOpen={isEditing} onClose={stopEditing}>
          <FieldTransformEditor deck={deck} save={save} />
        </Dialog>
      </>
    );
  });
}

const FieldSelect = Select.ofType<string>();

const renderField: ItemRenderer<string> = (field, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          key={field}
          onClick={handleClick}
          text={field}
          label={field}
      />
  );
};
