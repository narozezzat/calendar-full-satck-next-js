import * as React from "react";

interface FormRootErrorProps {
  /** The form's root error message (e.g. `form.formState.errors.root?.message`). */
  message?: string;
}

/**
 * Standard destructive banner used to surface a form-level (root) error.
 * Renders nothing when there is no message, so it's safe to mount
 * unconditionally at the top of any form.
 */
export function FormRootError({
  message,
}: FormRootErrorProps): React.JSX.Element | null {
  if (!message) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3.5 font-medium">
      {message}
    </div>
  );
}
