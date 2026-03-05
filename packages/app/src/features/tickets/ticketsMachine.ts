import { assign, createActor, createMachine } from "xstate";

export type TicketStatus =
  | "todo"
  | "inProgress"
  | "inCodeReview"
  | "inQa"
  | "done";

export interface TicketItem {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: number;
  updatedAt: number;
}

type TicketsEvent =
  | { type: "ADD_TICKET"; title: string }
  | { type: "UPDATE_TICKET"; id: string; title: string }
  | { type: "DELETE_TICKET"; id: string }
  | { type: "MOVE_TICKET"; id: string; to: TicketStatus };

interface TicketsContext {
  tickets: TicketItem[];
}

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  todo: ["inProgress"],
  inProgress: ["inCodeReview"],
  inCodeReview: ["inProgress", "inQa"],
  inQa: ["inProgress", "done"],
  done: [],
};

function createTicketId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const ticketsMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBjA1mZsCyAhugBaoB2YAxAIIAitA+gCoCSAwgNICiTA2gAwBdRKAAOAe1io04siJAAPRAFYAjADpVygEwBmACwB2ZYe0A2fv2XKANCACeiXfw27lATl0XDq1fuVm+gC+QXZoWDj4RKQUlACqAAq01ExczOzcfELyElIyckiKTobq+vx6+toAHO7u+vU6do4I2vz66u78ZtplRvrOlYYhYRjYuIQk5FS0XAAyPGmsnDwCwoW50qiy8koIulXqVWoBXn7VxoZNiKr8B-66qq16PjqPwyDhY1GTsXgA8gA1RYZFbZdaSTbbQq7XwdWrwhHwqpmK4IN7vMjiCBweSfSITGJgHIQ-I7Jz8dSGdxmKqGC66TqmMyXBxOKrtKqPfRVfh1ZG3ZTBUIfUb46JTdQAJzABAgzTEJK2BVAu0MBypNLpJgZ-FMLOaRm06gePTMujp3SsQpCQA */
  types: {} as {
    context: TicketsContext;
    input: TicketsContext;
    events: TicketsEvent;
  },
  id: "ticketsMachine",
  initial: "ready",
  context: ({ input }) => ({
    tickets: input.tickets,
  }),
  states: {
    ready: {},
  },
  on: {
    ADD_TICKET: {
      actions: assign({
        tickets: ({ context, event }) => {
          const normalizedTitle = event.title.trim();

          if (!normalizedTitle) {
            return context.tickets;
          }

          return [
            {
              id: createTicketId(),
              title: normalizedTitle,
              status: "todo",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            ...context.tickets,
          ];
        },
      }),
    },
    UPDATE_TICKET: {
      actions: assign({
        tickets: ({ context, event }) => {
          const normalizedTitle = event.title.trim();

          if (!normalizedTitle) {
            return context.tickets;
          }

          return context.tickets.map((ticket) => {
            if (ticket.id !== event.id) {
              return ticket;
            }

            return {
              ...ticket,
              title: normalizedTitle,
              updatedAt: Date.now(),
            };
          });
        },
      }),
    },
    DELETE_TICKET: {
      actions: assign({
        tickets: ({ context, event }) =>
          context.tickets.filter((ticket) => ticket.id !== event.id),
      }),
    },
    MOVE_TICKET: {
      guard: ({ context, event }) => {
        const ticket = context.tickets.find((item) => item.id === event.id);

        if (!ticket) {
          return false;
        }

        const allowedStatuses = ALLOWED_TRANSITIONS[ticket.status];

        return allowedStatuses.includes(event.to);
      },
      actions: assign({
        tickets: ({ context, event }) =>
          context.tickets.map((ticket) => {
            if (ticket.id !== event.id) {
              return ticket;
            }

            return {
              ...ticket,
              status: event.to,
              updatedAt: Date.now(),
            };
          }),
      }),
    },
  },
});

export const TICKET_STATUS_ORDER: TicketStatus[] = [
  "todo",
  "inProgress",
  "inCodeReview",
  "inQa",
  "done",
];

export const TICKET_STATUS_TITLES: Record<TicketStatus, string> = {
  todo: "TODO",
  inProgress: "In Progress",
  inCodeReview: "In Code Review",
  inQa: "In QA",
  done: "Done",
};

export function getAllowedTicketTransitions(status: TicketStatus) {
  return ALLOWED_TRANSITIONS[status];
}

export function reduceTickets(
  tickets: TicketItem[],
  event: TicketsEvent,
): TicketItem[] {
  const actor = createActor(ticketsMachine, {
    input: { tickets },
  });

  actor.start();
  actor.send(event);

  const nextTickets = actor.getSnapshot().context.tickets;
  actor.stop();

  return nextTickets;
}
