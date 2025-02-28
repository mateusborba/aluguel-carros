"use client";

import { forwardRef, useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  classNames?: string;
  placeholder?: string;
  date: Date | undefined;
  onDateChange: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ classNames, placeholder, date, onDateChange }, ref) => {
    // Estado para o valor do input (sempre formatado como "dd/MM/yyyy")
    const [inputValue, setInputValue] = useState<string>(
      date ? format(date, "dd/MM/yyyy") : ""
    );
    // Estado para controlar o mês exibido pelo calendário (primeiro dia do mês)
    const [currentMonth, setCurrentMonth] = useState<Date>(
      date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date()
    );
    // Estado para controlar a abertura do Popover
    const [isOpen, setIsOpen] = useState(false);

    // Sempre que a prop "date" mudar, atualiza o input e o currentMonth
    useEffect(() => {
      if (date) {
        setInputValue(format(date, "dd/MM/yyyy"));
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      } else {
        setInputValue("");
      }
    }, [date]);

    // Converte uma string "dd/MM/yyyy" para Date (ou undefined se inválido)
    const parseDateString = (value: string): Date | undefined => {
      const parts = value.split("/");
      if (parts.length !== 3) return undefined;
      const [dayStr, monthStr, yearStr] = parts;
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const parsed = new Date(year, month - 1, day);
      return isValid(parsed) ? parsed : undefined;
    };

    // Atualiza o input e, se válido, a data e o mês do calendário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const parsed = parseDateString(value);
        if (parsed) {
          onDateChange(parsed);
          setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
          setInputValue(format(parsed, "dd/MM/yyyy")); // força a formatação
        }
      }
    };

    // Confirma a data ao pressionar Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.length === 10) {
        const parsed = parseDateString(inputValue);
        if (parsed) {
          onDateChange(parsed);
          setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
          setInputValue(format(parsed, "dd/MM/yyyy"));
          setIsOpen(false);
        }
      }
    };

    // Quando o usuário seleciona uma data pelo calendário
    const handleCalendarSelect = (selected: Date | undefined) => {
      if (selected) {
        onDateChange(selected);
        setCurrentMonth(
          new Date(selected.getFullYear(), selected.getMonth(), 1)
        );
        setInputValue(format(selected, "dd/MM/yyyy"));
        setIsOpen(false);
      }
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            onClick={() => setIsOpen(true)}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              classNames
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span>{placeholder || "Select date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          {/* Input para digitar a data */}
          <div className="mb-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="dd/MM/yyyy"
              className="w-full"
            />
          </div>
          {/* Calendário sincronizado com a data do input */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
