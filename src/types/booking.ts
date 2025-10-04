export interface IBooking {
  bookingId: string;
  name: string;
  value: number;
  refundValue?: number;
  bookingDate: string;
  arrivalDate: string;
  departureDate: string;
  cancelledDate?: string;
  status?: BookingStatus;
}

export interface IBookingResponse extends IBooking {
  status: BookingStatus;
}

export interface ICreateBooking {
  name: string;
  value: number;
  arrivalDate: string;
  departureDate: string;
}

export interface IUpdateBooking extends ICreateBooking {}

export interface ICancelBooking {
  cancelledDate: string;
  refundValue: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
  totalRevenue: number;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type BookingStatus = "all" | "confirmed" | "cancelled" | "completed";

export type TimeFrame = "all" | "lastMonth" | "lastYear" | "custom";

export interface IDateRange {
  from: string;
  to: string;
}

export interface IBookingFilters {
  status: BookingStatus;
  timeFrame: TimeFrame;
}

export interface IBookingQueryParams extends Partial<IDateRange> {
  sortBy?: string;
  order?: "asc" | "desc";
  status?: BookingStatus;
  page?: number;
  limit?: number;
}
