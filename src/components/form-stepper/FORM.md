# Form Stepper - How to add new steps

This document explains how to create new `Step` components and step arrays compatible with the `FormStepper` component (where a step refers to an individual step in the form).

Overview
- Each step is a React component that registers fields into the shared react-hook-form instance.
- Export a step-array (typed `FormStepDefinition[]`) that the page (`Applications.tsx`) can import and choose from dynamically.
- `Applications` creates a single `useForm()` instance and passes it into `FormStepper` so a Select (or any step) can update the shared form value (e.g., `team`) and Applications can swap the step list.

1) Minimal step file (stateless, uses useFormContext)
Place under a team folder (e.g. `Teams/MyTeam/steps.tsx`).

```tsx
// example step component + exported steps array
// filepath: src/components/form-stepper/Teams/MyTeam/steps.tsx
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormStepDefinition } from "@/components/form-stepper/stepper";
import { FileText } from "lucide-react";

export const Step1MyTeam = () => {
  const { register, formState } = useFormContext();
  const errors = formState.errors ?? {};

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">My Team — Details</h2>

      <div>
        <Label htmlFor="projectName">Project name</Label>
        <Input id="projectName" {...register("projectName", { required: "Required" })} />
        {errors.projectName && <p className="text-sm text-red-500">{String(errors.projectName?.message)}</p>}
      </div>
    </div>
  );
};

export const myTeamSteps: FormStepDefinition[] = [
  {
    id: "myteam-details",
    label: { icon: FileText, label: "Details", content: "Project and role info" },
    Component: Step1MyTeam,
  },
];
```

2) Step component that uses props (goNext, goPrev, form)
If you want the step to call navigation helpers directly, accept the props the stepper may pass:

```tsx
// filepath: src/components/form-stepper/Teams/MyTeam/step-with-props.tsx
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const MyStepWithProps: React.FC<{
  index: number;
  form: UseFormReturn<any>;
  goNext: () => void;
  goPrev: () => void;
  submit: () => void;
}> = ({ index, form, goNext }) => {
  // you can use the passed form or useFormContext()
  const { register, trigger } = form;

  const onNext = async () => {
    // validate only fields in this step before advancing
    const ok = await trigger(["projectName"]);
    if (ok) goNext();
  };

  return (
    <div>
      <Input {...register("projectName", { required: "Required" })} />
      <Button onClick={onNext}>Next</Button>
    </div>
  );
};
```

3) Controlled / advanced components (Controller)
For custom third-party inputs (Select, DatePicker, `shadcn` Select), use `Controller` or `setValue`/`watch`. `Controller` is the easiest.

Example using the existing Default `Design Team` Select (same pattern as Default/steps.tsx):

```tsx
// usage inside a step
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TeamSelector = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="team"
      defaultValue="default"
      render={({ field: { value, onChange } }) => (
        <div>
          <Label>Design Team</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Choose...</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="ebike">E-Bike</SelectItem>
              <SelectItem value="robotarm">Robot Arm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
};
```

4) Per-step validation and navigation
- To only validate fields in the current step before going next, call `trigger(['field1','field2'])` from the step (either via `useFormContext()` or the `form` prop).
- The stepper's default "Next" submits the whole form, but you can also implement per-step validation in the step and call `goNext()` to advance.

5) Dynamic step switching (how Applications uses team Select)
- `Applications` creates a single `useForm()` instance and passes it down to `FormStepper` via the `form` prop.
- The default step contains the `Controller` for `team`. When the user changes the team, `watch('team')` in `Applications` fires and you can update `steps` (e.g., `setSteps([...defaultSteps, ...teamMap[team]])`).
- Optionally `reset()` to clear fields when switching teams, or `reset({ ...keepPrev })` to preserve some fields.

Example (already implemented in your `Applications.tsx`):
- Import team-specific exported step arrays (`webSteps`, `ebikeSteps`, `armSteps`, `defaultSteps`).
- Map selection value → step array (`teamMap`).
- `useEffect` watches `watch('team')` and updates `steps`.

6) Notes
- Keep field names unique across steps if you want all values preserved in the final submission. If different teams share a field name (e.g., `projectName`), their values may collide or persist when switching teams.
- Use `reset({ team: selected, ...keep })` to preserve `team` but remove other fields when changing the team.
- If a Step component doesn't accept props, it can still access the shared form using `useFormContext()`. Both patterns are supported.
- Step label icons should be the Lucide icon component (not an element instance): e.g. `label: { icon: FileText, label: 'Details', content: '...' }`.

7) Example export patterns (match your current files)
- `Teams/Web/steps.tsx` exports `webSteps`.
- `Teams/Default/steps.tsx` exports `defaultSteps`.
- Create `Teams/MyTeam/steps.tsx` exporting `myTeamSteps`, then include it in the `teamMap` in `Applications.tsx`.

Follow the `Step1Web` and `Step1Default` files as templates. Create one file per team, export a `FormStepDefinition[]`, and let `Applications` pick which arrays to concatenate and pass into `FormStepper`.