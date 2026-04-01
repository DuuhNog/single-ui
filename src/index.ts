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

export { ToastProvider, ToastContainer, useToast } from './components/Toast/Toast';
export type { ToastVariant, ToastOptions } from './components/Toast/Toast';

export { Textarea } from './components/Textarea/Textarea';
export type { TextareaProps } from './components/Textarea/Textarea';

export { Tabs } from './components/Tabs/Tabs';
export type { TabsProps, TabItem } from './components/Tabs/Tabs';

export { Skeleton } from './components/Skeleton/Skeleton';
export type { SkeletonProps } from './components/Skeleton/Skeleton';

export { Avatar, AvatarGroup } from './components/Avatar/Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarStatus } from './components/Avatar/Avatar';

export { Drawer } from './components/Drawer/Drawer';
export type { DrawerProps, DrawerSide, DrawerSize } from './components/Drawer/Drawer';

export { Popover } from './components/Popover/Popover';
export type { PopoverProps, PopoverPlacement } from './components/Popover/Popover';

export { Tooltip } from './components/Tooltip/Tooltip';
export type { TooltipProps, TooltipPlacement } from './components/Tooltip/Tooltip';

export { Accordion } from './components/Accordion/Accordion';
export type { AccordionProps, AccordionItem } from './components/Accordion/Accordion';

export { Pagination } from './components/Pagination/Pagination';
export type { PaginationProps } from './components/Pagination/Pagination';

export { InputOTP } from './components/InputOTP/InputOTP';
export type { InputOTPProps } from './components/InputOTP/InputOTP';

export { Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge/Badge';

export { Navbar } from './components/Navbar/Navbar';
export type { NavbarProps, NavbarMenuItem, NavbarSubItem, NavbarSubGroup, NavbarMenuConfig, NavbarProfile, NavbarProfileAction } from './components/Navbar/Navbar';

export { Slider } from './components/Slider/Slider';
export type { SliderProps } from './components/Slider/Slider';

// Hooks
export { useMask } from './hooks/useMask';
export type { MaskType } from './hooks/useMask';

export { Spinner } from './components/Spinner/Spinner';
export type { SpinnerProps, SpinnerVariant, SpinnerSize } from './components/Spinner/Spinner';

export { FloatButton } from './components/FloatButton/FloatButton';
export type { FloatButtonProps } from './components/FloatButton/FloatButton';

export { Divider } from './components/Divider/Divider';
export type { DividerProps } from './components/Divider/Divider';

export { Anchor } from './components/Anchor/Anchor';
export type { AnchorProps } from './components/Anchor/Anchor';

export { ModalManagerProvider, useModal } from './components/ModalManager/ModalManager';
export type { OpenModalOptions } from './components/ModalManager/ModalManager';

// Version
export const VERSION = '1.0.0';
