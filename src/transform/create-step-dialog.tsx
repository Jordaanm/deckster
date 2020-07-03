import * as React from 'react';
import { TxStep, TxOperation } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import { Dialog, Classes, Button, H2, Card, MenuItem, InputGroup, ControlGroup } from '@blueprintjs/core';
import { OperationSelect, renderTxOperation } from './transform-select';
import * as allOperations from '../transform/tx-ops';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';

interface CreateStepDialogProps {
  save: (step?: TxStep) => void;
  isOpen: boolean;
  toggleIsOpen: () => void;
}

const txOpItems = Object.values(allOperations);

export const CreateStepDialog: React.FC<CreateStepDialogProps> = (props) => {
  const { save, isOpen, toggleIsOpen } = props;
  const [operation, setOperation] = React.useState<TxOperation>();
  const [params, setParams] = React.useState<string[]>([]);

  const stores: IStores = useStores();
  const { project } = stores;

  const changeParams = (index: number) => (e: any) => {
    const val = e.target.value;
    let newParams = [...params];
    newParams[index] = val;
    setParams(newParams);
  };
  

  return useObserver(() => {

    const createAndSave = () => {
      if(operation != null) {
        const step: TxStep = project.createStep({
          params,
          operation
        });

        save(step);
        toggleIsOpen();
      }
    };

    const selectText = operation ? operation.name : 'No Operation Selected';
    const allParamsFilled = !(operation?.paramNames
      .map((x, i) => i)
      .some((index) => !params[index])
    );
      
    const canSave = Boolean(operation) && allParamsFilled;

    return (
      <Dialog
        isOpen={isOpen}
        icon="add-to-artifact"
        title="Create New Step"
        className="dialog--wide"
        onClose={toggleIsOpen}
      >
        <div className={`col`}>
          <div className={Classes.DIALOG_BODY}>
            <H2>Create Step</H2>
            <Card elevation={1}>
              <ControlGroup fill={true}>
                <OperationSelect
                  items={Object.values(txOpItems)}
                  itemRenderer={renderTxOperation}
                  noResults={<MenuItem disabled={true} text="No Operations Defined" />}
                  onItemSelect={setOperation}
                >
                  <Button text={selectText} rightIcon="double-caret-vertical" />
                </OperationSelect>
              </ControlGroup>
            </Card>
            <Card elevation={1}>
              {!operation && "Select an Operation to define Parameters"}
              {operation && operation.paramNames.map((name, index) =>
                <InputGroup placeholder={name} onChange={changeParams(index)} value={params[index]} key={name} />
              )}
            </Card>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={createAndSave} icon="saved" text="Save" disabled={!canSave}/>
            </div>
          </div>
        </div>
      </Dialog>
    );
  });
}