"use client";

import { forwardRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  classNames?: string;
  placeholder?: string;
  date: Date | undefined;
  onDateChange: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ classNames, placeholder, date, onDateChange }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
              classNames
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
