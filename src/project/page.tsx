import * as React from 'react';
import { Helmet } from 'react-helmet';
import { H1 } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { IStores } from '../stores/index';
import { Project } from '../stores/project';
import { useStores } from '../stores/util';
import { ProjectEditor } from './editor';

export const ProjectPage: React.FC = () => {
  
  const stores: IStores = useStores();
  
  const project: Project = stores.project;

  return useObserver(() => {
    return (
      <section className="app-section card-designs">
        <H1>Project</H1>
        <Helmet>
          <title>{project?.name||''} - Card Generator</title>
        </Helmet>
        <div className="row">
          <ProjectEditor project={project}/>
        </div>
      </section>
    )
  });
};