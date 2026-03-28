/**
 * Single UI React - Main Export File
 */

// Styles
import './styles/tokens.css';

// Components
export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';

export { Input } from './components/Input/Input';
export type { InputProps } from './components/Input/Input';

export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';

export { Modal } from './components/Modal/Modal';
export type { ModalProps, ModalSize } from './components/Modal/Modal';

export { Table } from './components/Table/Table';
export type { TableProps, TableColumn } from './components/Table/Table';

export { Select } from './components/Select/Select';
export type { SelectProps, SelectOption } from './components/Select/Select';

export { DatePicker } from './components/DatePicker/DatePicker';
export type { DatePickerProps } from './components/DatePicker/DatePicker';

export { DateRangePicker } from './components/DateRangePicker/DateRangePicker';
export type { DateRangePickerProps, DateRange } from './components/DateRangePicker/DateRangePicker';

export { DatePickerInput } from './components/DatePickerInput/DatePickerInput';
export type { DatePickerInputProps } from './components/DatePickerInput/DatePickerInput';

export { DateRangePickerInput } from './components/DateRangePickerInput/DateRangePickerInput';
export type { DateRangePickerInputProps } from './components/DateRangePickerInput/DateRangePickerInput';

export { Switch } from './components/Switch/Switch';
export type { SwitchProps, SwitchSize } from './components/Switch/Switch';

export { Checkbox } from './components/Checkbox/Checkbox';
export type { CheckboxProps } from './components/Checkbox/Checkbox';

export { Chip } from './components/Chip/Chip';
export type { ChipProps, ChipVariant, ChipSize } from './components/Chip/Chip';

// Hooks
export { useMask } from './hooks/useMask';
export type { MaskType } from './hooks/useMask';

// Version
export const VERSION = '1.0.0';
