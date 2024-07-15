"use client";

import React from "react";
import type { TimeValue } from "react-aria";
import type { TimeFieldStateOptions } from "react-stately";
import { TimeField } from "./time-field";

const TimePicker = React.forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions<TimeValue>, "locale">
>(({ hourCycle = 24, ...props }, ref) => {
  return <TimeField hourCycle={hourCycle} {...props} />;
});

TimePicker.displayName = "TimePicker";

export { TimePicker };
