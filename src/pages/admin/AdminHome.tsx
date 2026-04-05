import { Link } from 'react-router-dom';
import { Users, ClipboardList, LayoutGrid, ArrowRight } from 'lucide-react';
import rweLogo from '@/assets/rwe-logo.svg';
import { ImageWithLoader } from '@/components/ui/image-with-loader';

const sections = [
  {
    to: '/admin/membership',
    title: 'Membership',
    description: 'View, add, edit, and remove club members and assign teams.',
    icon: Users,
  },
  {
    to: '/admin/applications',
    title: 'Applications',
    description: 'Review submissions, update status, and notify applicants.',
    icon: ClipboardList,
  },
  {
    to: '/admin/teams',
    title: 'Teams',
    description: 'Manage design teams, programs, and recruiting visibility.',
    icon: LayoutGrid,
  },
] as const;

const AdminHome = () => {
  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-10 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-muted/40" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Officer dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Real World Engineering
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Central place to run recruiting and operations: membership roster, incoming applications,
              and team structure.
            </p>
          </div>
          <div className="flex shrink-0 justify-center md:justify-end">
            <ImageWithLoader
              src={rweLogo}
              alt="RWE logo"
              wrapperClassName="h-24 w-auto md:h-32"
              className="h-24 w-auto md:h-32 object-contain opacity-95"
              loading="eager"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick access</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ to, title, description, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-semibold text-foreground group-hover:text-primary">{title}</span>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
