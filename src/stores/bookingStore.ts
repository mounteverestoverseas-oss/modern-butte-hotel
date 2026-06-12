import { useSyncExternalStore } from "react";

export type BookingSearch = {
  checkIn?: string; // ISO date
  checkOut?: string;
  guests: number;
  selectedRoomSlug?: string;
  showResults: boolean;
};

let state: BookingSearch = { guests: 2, showResults: false };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const bookingStore = {
  get: () => state,
  set: (patch: Partial<BookingSearch>) => {
    state = { ...state, ...patch };
    emit();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export const useBookingSearch = () =>
  useSyncExternalStore(bookingStore.subscribe, bookingStore.get, bookingStore.get);
