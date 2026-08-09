import { useEffect, useRef, type ElementType } from "react";
import { useContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type EditableProps = {
  path: string;
  value: string;
  as?: ElementType;
  className?: string;
};

/** Inline-editable text bound to the site content store. */
export function Editable({ path, value, as, className }: EditableProps) {
  const Tag = (as ?? "span") as ElementType;
  const { editing, update } = useContent();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.textContent !== value && document.activeElement !== el) {
      el.textContent = value;
    }
  }, [value]);

  return (
    <Tag
      ref={ref}
      className={cn("editable-field", className)}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e: React.FocusEvent<HTMLElement>) =>
        update(path, e.currentTarget.textContent?.trim() || "")
      }
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {value}
    </Tag>
  );
}