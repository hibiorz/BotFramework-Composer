// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useContext, FC, useEffect, useRef } from 'react';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

import { NodeEventTypes } from '../constants/NodeEventTypes';
import { NodeRendererContext } from '../store/NodeRendererContext';
import { KeyboardZone } from '../components/lib/KeyboardZone';
import { useKeyboardApi } from '../hooks/useKeyboardApi';
import { useSelection } from '../hooks/useSelection';
import { useEditorEventHandler } from '../hooks/useEditorEventHandler';
import { SelectionContext } from '../store/SelectionContext';

import { AdaptiveDialogEditor } from './AdaptiveDialogEditor';

export const ObiEditor: FC<ObiEditorProps> = ({ path, data }): JSX.Element | null => {
  const { focusedEvent } = useContext(NodeRendererContext);
  const { selection, selectedIds, getNodeIndex } = useSelection();
  const { handleEditorEvent } = useEditorEventHandler();
  const { handleKeyboardCommand } = useKeyboardApi();
  const divRef = useRef<HTMLDivElement>(null);

  // send focus to the keyboard area when navigating to a new trigger
  useEffect(() => {
    divRef.current?.focus();
  }, [focusedEvent]);

  if (!data) return null;
  return (
    <SelectionContext.Provider value={{ selectedIds, getNodeIndex }}>
      <KeyboardZone onCommand={handleKeyboardCommand} ref={divRef}>
        <MarqueeSelection selection={selection} css={{ width: '100%', height: '100%' }}>
          <div
            className="obi-editor-container"
            data-testid="obi-editor-container"
            css={{
              width: '100%',
              height: '100%',
              padding: '48px 20px',
              boxSizing: 'border-box',
            }}
            onClick={e => {
              e.stopPropagation();
              handleEditorEvent(NodeEventTypes.Focus, { id: '' });
            }}
          >
            <AdaptiveDialogEditor
              id={path}
              data={data}
              onEvent={(eventName, eventData) => {
                divRef.current?.focus({ preventScroll: true });
                handleEditorEvent(eventName, eventData);
              }}
            />
          </div>
        </MarqueeSelection>
      </KeyboardZone>
    </SelectionContext.Provider>
  );
};

ObiEditor.defaultProps = {
  path: '.',
  data: {},
};

interface ObiEditorProps {
  path: string;
  // Obi raw json
  data: any;
}
