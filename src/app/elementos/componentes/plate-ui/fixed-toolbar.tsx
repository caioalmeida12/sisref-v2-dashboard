import { withCn } from '@udecode/cn';

import { Toolbar } from './toolbar';

export const FixedToolbar = withCn(
  Toolbar,
  'sticky left-0 top-[57px] z-[60] w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border bg-background/95'
);