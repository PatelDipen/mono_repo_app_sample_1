import { useMemo, useState } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";
import {
  AppScreen,
  Button,
  H1,
  Input,
  MutedText,
  Paragraph,
  ScreenActions,
  ScreenHeader,
  SectionLabel,
  SurfaceCard,
  XStack,
  YStack,
} from "@repo/ui";
import {
  getAllowedTicketTransitions,
  TICKET_STATUS_ORDER,
  TICKET_STATUS_TITLES,
  type TicketStatus,
} from "./ticketsMachine";
import { useTicketStore } from "./ticketStore";

interface TicketsScreenProps {
  onGoBack: () => void;
}

export function TicketsScreen({ onGoBack }: TicketsScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideWeb = isWeb && width >= 1100;

  const [title, setTitle] = useState("");
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const tickets = useTicketStore((state) => state.tickets);
  const addTicket = useTicketStore((state) => state.addTicket);
  const updateTicketTitle = useTicketStore((state) => state.updateTicketTitle);
  const moveTicket = useTicketStore((state) => state.moveTicket);
  const deleteTicket = useTicketStore((state) => state.deleteTicket);

  const ticketsByStatus = useMemo(
    () =>
      TICKET_STATUS_ORDER.reduce(
        (accumulator, status) => ({
          ...accumulator,
          [status]: tickets.filter((ticket) => ticket.status === status),
        }),
        {
          todo: [],
          inProgress: [],
          inCodeReview: [],
          inQa: [],
          done: [],
        } as Record<TicketStatus, typeof tickets>,
      ),
    [tickets],
  );

  function handleAddTicket() {
    addTicket(title);
    setTitle("");
  }

  function handleStartEdit(ticketId: string, currentTitle: string) {
    setEditingTicketId(ticketId);
    setEditingTitle(currentTitle);
  }

  function handleSaveEdit(ticketId: string) {
    updateTicketTitle(ticketId, editingTitle);
    setEditingTicketId(null);
    setEditingTitle("");
  }

  const SectionWrapper = isWideWeb ? XStack : YStack;

  const sections = TICKET_STATUS_ORDER.map((status) => {
    const items = ticketsByStatus[status];

    return (
      <SurfaceCard
        key={status}
        flex={isWideWeb ? 1 : undefined}
        minHeight={260}
      >
        <SectionLabel>{TICKET_STATUS_TITLES[status]}</SectionLabel>

        {items.length === 0 ? (
          <MutedText>No tickets</MutedText>
        ) : (
          items.map((ticket) => {
            const isEditing = editingTicketId === ticket.id;
            const allowedTransitions = getAllowedTicketTransitions(
              ticket.status,
            );

            return (
              <SurfaceCard
                key={ticket.id}
                borderRadius="$3"
                padding="$2"
                gap="$2"
              >
                {isEditing ? (
                  <XStack gap="$2" alignItems="center">
                    <Input
                      flex={1}
                      size="$3"
                      value={editingTitle}
                      onChangeText={setEditingTitle}
                      placeholder="Update ticket title"
                    />
                    <Button
                      size="$2"
                      onPress={() => handleSaveEdit(ticket.id)}
                      disabled={!editingTitle.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="$2"
                      theme="gray"
                      onPress={() => {
                        setEditingTicketId(null);
                        setEditingTitle("");
                      }}
                    >
                      Cancel
                    </Button>
                  </XStack>
                ) : (
                  <Paragraph>{ticket.title}</Paragraph>
                )}

                {!isEditing ? (
                  <XStack gap="$2" flexWrap="wrap">
                    {allowedTransitions.map((nextStatus) => (
                      <Button
                        key={`${ticket.id}-${nextStatus}`}
                        size="$2"
                        onPress={() => moveTicket(ticket.id, nextStatus)}
                      >
                        Move to {TICKET_STATUS_TITLES[nextStatus]}
                      </Button>
                    ))}
                    <Button
                      size="$2"
                      theme="gray"
                      onPress={() => handleStartEdit(ticket.id, ticket.title)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="$2"
                      theme="red"
                      onPress={() => deleteTicket(ticket.id)}
                    >
                      Delete
                    </Button>
                  </XStack>
                ) : null}
              </SurfaceCard>
            );
          })
        )}
      </SurfaceCard>
    );
  });

  return (
    <AppScreen>
      <ScreenHeader>
        <H1>Tickets</H1>
        <MutedText>
          Workflow: TODO → In Progress → In Code Review → In QA → Done
        </MutedText>
      </ScreenHeader>

      <XStack gap="$2" width="100%" alignItems="center">
        <Input
          flex={1}
          size="$4"
          placeholder="Enter ticket title"
          value={title}
          onChangeText={setTitle}
        />
        <Button size="$4" onPress={handleAddTicket} disabled={!title.trim()}>
          Add Ticket
        </Button>
      </XStack>

      {isWideWeb ? (
        <SectionWrapper gap="$3" width="100%" flex={1} alignItems="stretch">
          {sections}
        </SectionWrapper>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <SectionWrapper gap="$3" width="100%" alignItems="stretch">
            {sections}
          </SectionWrapper>
        </ScrollView>
      )}

      <ScreenActions>
        <Button size="$5" onPress={onGoBack}>
          Go Back
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
