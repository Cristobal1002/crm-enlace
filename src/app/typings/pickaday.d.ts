// src/pikaday.d.ts
declare module 'pikaday' {
  interface PikadayOptions {
    field: HTMLElement;
    trigger?: HTMLElement;
    bound?: boolean;
    position?: string;
    reposition?: boolean;
    container?: HTMLElement;
    format?: string;
    defaultDate?: Date;
    setDefaultDate?: boolean;
    firstDay?: number;
    minDate?: Date;
    maxDate?: Date;
    disableWeekends?: boolean;
    disableDayFn?: (date: Date) => boolean;
    yearRange?: number | number[];
    showWeekNumber?: boolean;
    pickWholeWeek?: boolean;
    isRTL?: boolean;
    i18n?: {
      previousMonth?: string;
      nextMonth?: string;
      months?: string[];
      weekdays?: string[];
      weekdaysShort?: string[];
    };
    events?: string[];
    theme?: string;
    blurFieldOnSelect?: boolean;
    showTime?: boolean;
    showSeconds?: boolean;
    use24hour?: boolean;
    incrementHourBy?: number;
    incrementMinuteBy?: number;
    incrementSecondBy?: number;
    autoClose?: boolean;
    onSelect?: (date: Date) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onDraw?: () => void;
  }

  class Pikaday {
    constructor(options: PikadayOptions);
    toString(format?: string): string;
    getDate(): Date;
    setDate(date: Date, triggerOnSelect?: boolean): void;
    gotoDate(date: Date): void;
    gotoToday(): void;
    gotoMonth(month: number): void;
    gotoYear(year: number): void;
    nextMonth(): void;
    prevMonth(): void;
    setMinDate(date: Date): void;
    setMaxDate(date: Date): void;
    setStartRange(date: Date): void;
    setEndRange(date: Date): void;
    draw(force?: boolean): void;
    adjustPosition(): void;
    show(): void;
    hide(): void;
    isVisible(): boolean;
    destroy(): void;
  }

  export default Pikaday;
}
