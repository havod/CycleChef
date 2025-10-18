
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useId, useState } from 'react';

type LineItem = {
  id: string;
  type: 'heading' | 'item' | 'text';
  content: string;
  level?: number;
};

// A simple parser for the expected markdown format from the AI.
const parseMarkdown = (markdown: string, idPrefix: string): LineItem[] => {
  return markdown
    .split('\n')
    .map((line, index) => {
      const id = `${idPrefix}-${index}`;
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('## ')) {
        return { id, type: 'heading', content: trimmedLine.substring(3), level: 2 };
      }
      if (trimmedLine.startsWith('### ')) {
        return { id, type: 'heading', content: trimmedLine.substring(4), level: 3 };
      }
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        return { id, type: 'item', content: trimmedLine.substring(2) };
      }
      if (trimmedLine === '') {
        return null;
      }
      return { id, type: 'text', content: trimmedLine };
    })
    .filter((item): item is LineItem => item !== null);
};

export function InteractiveGroceryList({ markdownContent }: { markdownContent: string }) {
  const idPrefix = useId();
  const items = parseMarkdown(markdownContent, idPrefix);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        if (item.type === 'heading') {
          if (item.level === 2) {
            return (
              <h2 key={item.id} className="text-2xl font-headline font-bold mt-6 mb-2 border-b pb-2">
                {item.content}
              </h2>
            );
          }
          return (
            <h3 key={item.id} className="text-xl font-headline font-semibold mt-4 mb-2">
              {item.content}
            </h3>
          );
        }
        if (item.type === 'item') {
          return <GroceryListItem key={item.id} id={item.id} label={item.content} />;
        }
        return (
          <p key={item.id} className="text-sm text-muted-foreground">
            {item.content}
          </p>
        );
      })}
    </div>
  );
}

function GroceryListItem({ id, label }: { id: string; label: string }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-start space-x-3 rounded-md -mx-2 px-2 py-1.5 hover:bg-muted/50 transition-colors">
        <span className="hidden print:inline-block font-mono text-sm leading-snug pt-0.5">{isChecked ? '[x]' : '[ ]'}</span>
        <Checkbox
            id={id}
            className="mt-1 print:hidden"
            onCheckedChange={(checked) => setIsChecked(Boolean(checked))}
            checked={isChecked}
        />
        <div className="grid gap-1.5 leading-none flex-1">
            <label
                htmlFor={id}
                className={cn(
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    'print:font-normal',
                    isChecked && 'line-through text-muted-foreground'
                )}
            >
                {label}
            </label>
        </div>
    </div>
  );
}
