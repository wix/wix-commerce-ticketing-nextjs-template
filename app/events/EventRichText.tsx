'use client';

import React from 'react';
import '@wix/ricos/css/all-plugins-viewer.css';
import { quickStartViewerPlugins, RicosViewer } from '@wix/ricos';
import { ricos as richText } from '@wix/events';

interface EventRichTextProps {
  richText?: richText.RichContent | null;
  title?: React.ReactNode;
}

const EventRichText = ({ richText, title }: EventRichTextProps) => {
  if (!richText || !richText.content) {
    return null;
  }

  return (
    <>
      {title && <>{title}</>}
      <RicosViewer
        plugins={quickStartViewerPlugins()}
        content={richText.content as any}
      />
    </>
  );
};

export default EventRichText;
