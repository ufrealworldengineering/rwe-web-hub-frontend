import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
};

export const PageHeader = ({ title, subtitle, rightSlot }: PageHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        {subtitle ? <p className="text-foreground-secondary">{subtitle}</p> : null}
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};
