import * as React from 'react';
import { TxStep } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import { Card, H3 } from '@blueprintjs/core';

export interface TransformStepProps {
  step: TxStep
}

export const TransformStep: React.FC<TransformStepProps> = (props: TransformStepProps) => {
  return useObserver(() => {

    const { step } = props;
    return (
      <Card>
        <H3>{step.operation ? step.operation.name : 'No Operation Defined'}</H3>
        {step.operation && step.operation.paramNames.map((name, index) =>
          <div className="tx-step-param">
            <span>{name}</span>: <span>{step.params[index] || ''}</span>
          </div>
        )}
      </Card>
    );
  })

}