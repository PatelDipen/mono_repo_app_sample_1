import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type TicketItem,
  type TicketStatus,
  reduceTickets,
} from "./ticketsMachine";
import { getPersistStorage } from "../../state/persistStorage";

interface TicketState {
  tickets: TicketItem[];
  addTicket: (title: string) => void;
  updateTicketTitle: (id: string, title: string) => void;
  moveTicket: (id: string, to: TicketStatus) => void;
  deleteTicket: (id: string) => void;
}

const storage = getPersistStorage();

export const useTicketStore = create<TicketState>()(
  persist(
    immer((set) => ({
      tickets: [],
      addTicket: (title) =>
        set((state) => {
          state.tickets = reduceTickets(state.tickets, {
            type: "ADD_TICKET",
            title,
          });
        }),
      updateTicketTitle: (id, title) =>
        set((state) => {
          state.tickets = reduceTickets(state.tickets, {
            type: "UPDATE_TICKET",
            id,
            title,
          });
        }),
      moveTicket: (id, to) =>
        set((state) => {
          state.tickets = reduceTickets(state.tickets, {
            type: "MOVE_TICKET",
            id,
            to,
          });
        }),
      deleteTicket: (id) =>
        set((state) => {
          state.tickets = reduceTickets(state.tickets, {
            type: "DELETE_TICKET",
            id,
          });
        }),
    })),
    {
      name: "tickets-store",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        tickets: state.tickets,
      }),
    },
  ),
);
