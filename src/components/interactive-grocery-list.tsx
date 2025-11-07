
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useId, useState, useMemo, useEffect } from 'react';

export type GroceryListMode = 'pre-shop' | 'shopping';

type LineItem = {
  id: string;
  type: 'heading' | 'item' | 'text';
  content: string;
  level?: number;
  price?: number;
};

// Regex to capture item and price: "* Item - 1.23"
const itemRegex = /^\s*[-*]\s*(.*?)\s*-\s*(\d+(\.\d{1,2})?)\s*$/;

// A more robust parser for the expected markdown format from the AI.
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
      
      const match = trimmedLine.match(itemRegex);
      if (match) {
        const content = match[1].trim();
        const price = parseFloat(match[2]);
        return { id, type: 'item', content, price };
      }

      // Fallback for items without a price
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


interface InteractiveGroceryListProps {
  markdownContent: string;
  mode: GroceryListMode;
  initialPrice: number;
  onPriceChange: (newPrice: number) => void;
}

export function InteractiveGroceryList({ markdownContent, mode, initialPrice, onPriceChange }: InteractiveGroceryListProps) {
  const idPrefix = useId();
  const items = useMemo(() => parseMarkdown(markdownContent, idPrefix), [markdownContent, idPrefix]);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reset checks when mode changes
    setCheckedItems({});
  }, [mode]);

  useEffect(() => {
    if (mode === 'pre-shop') {
      const remainingPrice = items.reduce((total, item) => {
        if (item.type === 'item' && item.price && !checkedItems[item.id]) {
          return total + item.price;
        }
        return total;
      }, 0);
      onPriceChange(remainingPrice);
    } else {
      // In shopping mode, the price doesn't change, so reset to initial
      onPriceChange(initialPrice);
    }
  }, [checkedItems, mode, items, onPriceChange, initialPrice]);

  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: isChecked }));
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        switch (item.type) {
          case 'heading':
            if (item.level === 2) {
              return <h2 key={item.id} className="text-2xl font-headline font-bold mt-6 mb-2 border-b pb-2">{item.content}</h2>;
            }
            return <h3 key={item.id} className="text-xl font-headline font-semibold mt-4 mb-2">{item.content}</h3>;
          
          case 'item':
            return (
              <GroceryListItem
                key={item.id}
                id={item.id}
                label={item.content}
                price={item.price}
                isChecked={!!checkedItems[item.id]}
                onCheckedChange={(checked) => handleCheckChange(item.id, checked)}
                mode={mode}
              />
            );

          case 'text':
            return <p key={item.id} className="text-sm text-muted-foreground">{item.content}</p>;
          
          default:
            return null;
        }
      })}
    </div>
  );
}

interface GroceryListItemProps {
  id: string;
  label: string;
  price?: number;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  mode: GroceryListMode;
}

function GroceryListItem({ id, label, price, isChecked, onCheckedChange, mode }: GroceryListItemProps) {
  const isStrikethrough = 
    (mode === 'pre-shop' && isChecked) || // "I have this"
    (mode === 'shopping' && isChecked);  // "I picked this up"

  return (
    <div className="flex items-start space-x-3 rounded-md -mx-2 px-2 py-1.5 hover:bg-muted/50 transition-colors">
        <span className="hidden print:inline-block font-mono text-sm leading-snug pt-0.5">{isChecked ? '[x]' : '[ ]'}</span>
        <Checkbox
            id={id}
            className="mt-1 print:hidden"
            onCheckedChange={(checked) => onCheckedChange(Boolean(checked))}
            checked={isChecked}
        />
        <div className="grid gap-1.5 leading-none flex-1">
            <label
                htmlFor={id}
                className={cn(
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    'print:font-normal',
                    isStrikethrough && 'line-through text-muted-foreground'
                )}
            >
                {label}
                {mode === 'pre-shop' && price && <span className={cn('ml-2 text-xs', isChecked ? 'text-muted-foreground' : 'text-primary/80')}>(${price.toFixed(2)})</span>}
            </label>
        </div>
    </div>
  );
}
