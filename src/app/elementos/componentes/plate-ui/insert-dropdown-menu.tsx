'use client';

import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import {
  focusEditor,
  insertEmptyElement,
  useEditorRef,
} from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';

import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { ELEMENT_HR } from '@udecode/plate-horizontal-rule';
import { ELEMENT_CODE_BLOCK } from '@udecode/plate-code-block';
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw';
import { ELEMENT_LINK } from '@udecode/plate-link';
import { ELEMENT_IMAGE } from '@udecode/plate-media';

const items = [
  {
    items: [
      {
        description: 'Parágrafo',
        icon: Icons.paragraph,
        label: 'Parágrafo',
        value: ELEMENT_PARAGRAPH,
      },
      {
        description: 'Título 1',
        icon: Icons.h1,
        label: 'Título 1',
        value: ELEMENT_H1,
      },
      {
        description: 'Título 2',
        icon: Icons.h2,
        label: 'Título 2',
        value: ELEMENT_H2,
      },
      {
        description: 'Título 3',
        icon: Icons.h3,
        label: 'Título 3',
        value: ELEMENT_H3,
      },
      {
        description: 'Citação (Ctrl+Shift+.)',
        icon: Icons.blockquote,
        label: 'Citação',
        value: ELEMENT_BLOCKQUOTE,
      },
      {
        value: ELEMENT_TABLE,
        label: 'Tabela',
        description: 'Tabela',
        icon: Icons.table,
      },
      {
        value: 'ul',
        label: 'Lista com Marcadores',
        description: 'Lista com Marcadores',
        icon: Icons.ul,
      },
      {
        value: 'ol',
        label: 'Lista Numerada',
        description: 'Lista Numerada',
        icon: Icons.ol,
      },
      {
        value: ELEMENT_HR,
        label: 'Divisor',
        description: 'Divisor (---)',
        icon: Icons.hr,
      },
    ],
    label: 'Blocos Básicos',
  },
  {
    label: 'Mídia',
    items: [
      {
        value: ELEMENT_CODE_BLOCK,
        label: 'Código',
        description: 'Código (```)',
        icon: Icons.codeblock,
      },
      {
        value: ELEMENT_IMAGE,
        label: 'Imagem',
        description: 'Imagem',
        icon: Icons.image,
      },
      // {
      //   value: ELEMENT_MEDIA_EMBED,
      //   label: 'Incorporar',
      //   description: 'Incorporar',
      //   icon: Icons.embed,
      // },
      {
        value: ELEMENT_EXCALIDRAW,
        label: 'Excalidraw',
        description: 'Excalidraw',
        icon: Icons.excalidraw,
      },
    ],
  },
  {
    label: 'Em linha',
    items: [
      {
        value: ELEMENT_LINK,
        label: 'Link',
        description: 'Link',
        icon: Icons.link,
      },
    ],
  },
];
export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={openState.open} tooltip="Inserir">
          <Icons.add />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {nestedItems.map(
              ({ icon: Icon, label: itemLabel, value: type }) => (
                <DropdownMenuItem
                  className="min-w-[180px]"
                  key={type}
                  onSelect={() => {
                    switch (type) {
                      // case ELEMENT_CODE_BLOCK: {
                      //   insertEmptyCodeBlock(editor);
                      //
                      //   break;
                      // }
                      // case ELEMENT_IMAGE: {
                      //   await insertMedia(editor, { type: ELEMENT_IMAGE });
                      //
                      //   break;
                      // }
                      // case ELEMENT_MEDIA_EMBED: {
                      //   await insertMedia(editor, {
                      //     type: ELEMENT_MEDIA_EMBED,
                      //   });
                      //
                      //   break;
                      // }
                      // case 'ul':
                      // case 'ol': {
                      //   insertEmptyElement(editor, ELEMENT_PARAGRAPH, {
                      //     select: true,
                      //     nextBlock: true,
                      //   });
                      //
                      //   if (settingsStore.get.checkedId(KEY_LIST_STYLE_TYPE)) {
                      //     toggleIndentList(editor, {
                      //       listStyleType: type === 'ul' ? 'disc' : 'decimal',
                      //     });
                      //   } else if (settingsStore.get.checkedId('list')) {
                      //     toggleList(editor, { type });
                      //   }
                      //
                      //   break;
                      // }
                      // case ELEMENT_TABLE: {
                      //   insertTable(editor);
                      //
                      //   break;
                      // }
                      // case ELEMENT_LINK: {
                      //   triggerFloatingLink(editor, { focused: true });
                      //
                      //   break;
                      // }
                      default: {
                        insertEmptyElement(editor, type, {
                          nextBlock: true,
                          select: true,
                        });
                      }
                    }

                    focusEditor(editor);
                  }}
                >
                  <Icon className="mr-2 size-5" />
                  {itemLabel}
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
