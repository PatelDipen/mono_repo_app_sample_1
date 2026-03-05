import { useState } from "react";
import { ScrollView } from "react-native";
import {
  AppScreen,
  Avatar,
  Button,
  Card,
  Checkbox,
  H1,
  H2,
  Input,
  Label,
  MutedText,
  Paragraph,
  Progress,
  RadioGroup,
  ScreenActions,
  ScreenHeader,
  SectionLabel,
  Separator,
  Spinner,
  SurfaceCard,
  Switch,
  TextArea,
  XStack,
  YStack,
} from "@repo/ui";

interface UILibraryScreenProps {
  onGoBack: () => void;
}

export function UILibraryScreen({ onGoBack }: UILibraryScreenProps) {
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [progressValue, setProgressValue] = useState(45);

  return (
    <AppScreen>
      <ScreenHeader>
        <H1>UI Library</H1>
        <MutedText>Tamagui component reference for this app</MutedText>
      </ScreenHeader>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <YStack gap="$3">
          <SurfaceCard>
            <SectionLabel>Typography</SectionLabel>
            <H2>Heading Level 2</H2>
            <Paragraph>This is a paragraph style for body text.</Paragraph>
            <MutedText>This is muted helper text.</MutedText>
          </SurfaceCard>

          <SurfaceCard>
            <SectionLabel>Buttons</SectionLabel>
            <XStack gap="$2" flexWrap="wrap">
              <Button size="$4">Primary</Button>
              <Button size="$4" theme="active">
                Active
              </Button>
              <Button size="$4" theme="red">
                Danger
              </Button>
              <Button size="$4" disabled>
                Disabled
              </Button>
            </XStack>
          </SurfaceCard>

          <SurfaceCard>
            <SectionLabel>Inputs</SectionLabel>
            <YStack gap="$2">
              <Label htmlFor="ui-name">Name</Label>
              <Input
                id="ui-name"
                placeholder="Type your name"
                value={name}
                onChangeText={setName}
              />
              <Label htmlFor="ui-notes">Notes</Label>
              <TextArea
                id="ui-notes"
                placeholder="Write longer notes"
                value={notes}
                onChangeText={setNotes}
                minHeight={100}
              />
            </YStack>
          </SurfaceCard>

          <SurfaceCard>
            <SectionLabel>Selection Controls</SectionLabel>

            <XStack alignItems="center" justifyContent="space-between">
              <Paragraph>Enable notifications</Paragraph>
              <Switch
                checked={switchEnabled}
                onCheckedChange={setSwitchEnabled}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>

            <Separator />

            <XStack alignItems="center" gap="$2">
              <Checkbox
                id="ui-checkbox"
                checked={checkboxChecked}
                onCheckedChange={(value) => setCheckboxChecked(value === true)}
              >
                <Checkbox.Indicator />
              </Checkbox>
              <Label htmlFor="ui-checkbox">Accept terms</Label>
            </XStack>

            <Separator />

            <YStack gap="$2">
              <Paragraph>Priority</Paragraph>
              <RadioGroup value={priority} onValueChange={setPriority}>
                <XStack gap="$3" flexWrap="wrap">
                  <XStack alignItems="center" gap="$2">
                    <RadioGroup.Item value="low" id="priority-low">
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label htmlFor="priority-low">Low</Label>
                  </XStack>

                  <XStack alignItems="center" gap="$2">
                    <RadioGroup.Item value="medium" id="priority-medium">
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label htmlFor="priority-medium">Medium</Label>
                  </XStack>

                  <XStack alignItems="center" gap="$2">
                    <RadioGroup.Item value="high" id="priority-high">
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label htmlFor="priority-high">High</Label>
                  </XStack>
                </XStack>
              </RadioGroup>
            </YStack>
          </SurfaceCard>

          <SurfaceCard>
            <SectionLabel>Feedback</SectionLabel>

            <YStack gap="$2">
              <Paragraph>Loading spinner</Paragraph>
              <Spinner size="large" />
            </YStack>

            <Separator />

            <YStack gap="$2">
              <Paragraph>Progress ({progressValue}%)</Paragraph>
              <Progress value={progressValue}>
                <Progress.Indicator animation="bouncy" />
              </Progress>
              <XStack gap="$2">
                <Button
                  size="$2"
                  onPress={() =>
                    setProgressValue((value) => Math.max(0, value - 10))
                  }
                >
                  -10
                </Button>
                <Button
                  size="$2"
                  onPress={() =>
                    setProgressValue((value) => Math.min(100, value + 10))
                  }
                >
                  +10
                </Button>
              </XStack>
            </YStack>
          </SurfaceCard>

          <SurfaceCard>
            <SectionLabel>Card & Avatar</SectionLabel>
            <Card bordered elevate>
              <Card.Header padded>
                <XStack gap="$3" alignItems="center">
                  <Avatar circular size="$4">
                    <Avatar.Image
                      src="https://i.pravatar.cc/100?img=12"
                      accessibilityLabel="User avatar"
                    />
                    <Avatar.Fallback backgroundColor="$blue6" />
                  </Avatar>
                  <YStack>
                    <Paragraph fontWeight="700">Sample Profile</Paragraph>
                    <MutedText>Card header/body/footer example</MutedText>
                  </YStack>
                </XStack>
              </Card.Header>

              <Card.Footer padded>
                <Button size="$3">View Details</Button>
              </Card.Footer>
            </Card>
          </SurfaceCard>
        </YStack>
      </ScrollView>

      <ScreenActions>
        <Button size="$5" onPress={onGoBack}>
          Go Back
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
