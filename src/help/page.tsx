import * as React from 'react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import * as markdownContent from '../help.md';

export const HelpPage: React.FC = () => {
  return (
    <div className="app-section help">
      <div className="full-xy">
        <ReactMarkdown source={markdownContent.default} />
      </div>
    </div>
  );
}