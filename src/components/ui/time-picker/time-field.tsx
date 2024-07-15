/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { DateSegment } from "./date-segment";
import { useRef } from "react";
import {
  type AriaTimeFieldProps,
  type TimeValue,
  useLocale,
  useTimeField,
} from "react-aria";
import { useTimeFieldState } from "react-stately";
import { cn } from "~/lib/utils";

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });
  const {
    fieldProps: { ...fieldProps },
  } = useTimeField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "focus-visible:ring-ring border-input inline-flex h-9 w-full flex-1 rounded-md border bg-transparent px-3 py-[6px] text-sm focus-visible:outline-none focus-visible:ring-1",
        props.isDisabled ? "cursor-not-allowed opacity-50" : "",
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

export { TimeField };
