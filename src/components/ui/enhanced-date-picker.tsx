import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface EnhancedDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function EnhancedDatePicker({ 
  date, 
  onDateChange, 
  placeholder = "Escolha uma data",
  className 
}: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState(
    date ? date.getFullYear() : new Date().getFullYear()
  );

  // Gerar anos de 1920 até ano atual + 10
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: currentYearNum - 1920 + 11 }, (_, i) => 1920 + i).reverse();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = parseInt(monthIndex);
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setCurrentYear(newYear);
  };

  const displayMonth = new Date(currentYear, currentMonth);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal text-sm",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {date ? format(date, "dd/MM/yyyy") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between gap-2">
            <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto">
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={currentYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="pointer-events-auto max-h-48">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={displayMonth}
          onMonthChange={(newMonth) => {
            setCurrentMonth(newMonth.getMonth());
            setCurrentYear(newMonth.getFullYear());
          }}
          locale={ptBR}
          className="pointer-events-auto"
          classNames={{
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
          }}
          components={{
            IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}