import { useEveAgent } from "eve/react";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { buildEveHeaders, EVE_API_URL } from "../../config";
import { Screen } from "./ui/Screen";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { glowText } from "../theme/glow";

const STATUS_LABEL: Record<string, string> = {
  ready: "Ready",
  resuming: "Resuming…",
  submitted: "Thinking…",
  streaming: "Streaming…",
  error: "Error",
};

const STATUS_COLOR: Record<string, string> = {
  ready: colors.active,
  resuming: colors.textMuted,
  submitted: colors.blocked,
  streaming: colors.accent,
  error: colors.failed,
};

export default function ChatScreen() {
  // Reuses the same eve/react hook the web app uses. `host` is the proxy base;
  // the hook appends `/eve/v1`, so `https://<deploy>/api` -> `/api/eve/v1/...`.
  const agent = useEveAgent({
    host: EVE_API_URL || undefined,
    headers: buildEveHeaders(),
  });

  const [input, setInput] = useState("");
  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  function onSubmit() {
    const text = input.trim();
    if (!text || isBusy) return;
    agent.send(text);
    setInput("");
  }

  const messages = agent.data.messages;

  return (
    <Screen>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Eve Agent</Text>
        <Text
          style={[
            styles.status,
            { color: STATUS_COLOR[agent.status] ?? colors.textMuted },
            glowText(STATUS_COLOR[agent.status] ?? colors.textMuted, 6),
          ]}
        >
          {STATUS_LABEL[agent.status] ?? agent.status}
        </Text>
      </View>

      {agent.error && (
        <Text style={styles.error} role="alert">
          {agent.error.message}
        </Text>
      )}

      <FlatList
        style={styles.messages}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item: m }) => (
          <View
            style={[
              styles.message,
              m.role === "assistant" ? styles.msgAssistant : styles.msgUser,
            ]}
          >
            <Text style={styles.role}>
              {m.role === "assistant" ? "Eve" : m.role}
            </Text>
            {m.parts.map((part, i) =>
              part.type === "text" ? (
                <Text key={i} style={styles.msgText}>
                  {part.text}
                </Text>
              ) : null,
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholder}>
            Send a message to start chatting.
          </Text>
        }
      />

      <View style={styles.composer}>
        <TextInput
          testID="chat-input"
          style={styles.input}
          placeholder="Type your message…"
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          editable={!isBusy}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
        />
        <Pressable
          testID="chat-send"
          style={[
            styles.send,
            isBusy || !input.trim() ? styles.sendDisabled : null,
          ]}
          onPress={onSubmit}
          disabled={isBusy || !input.trim()}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.titleMedium,
    color: colors.text,
  },
  status: {
    fontSize: 13,
    fontWeight: "500",
  },
  error: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.failed,
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    color: colors.failed,
    fontSize: 13,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  placeholder: {
    marginTop: 24,
    textAlign: "center",
    color: colors.textMuted,
  },
  message: {
    maxWidth: "85%",
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  msgUser: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(123, 140, 255, 0.18)",
    borderColor: colors.completed,
    boxShadow: `0 0 10px ${colors.completed}55`,
  },
  msgAssistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.active,
    boxShadow: `0 0 10px ${colors.active}44`,
  },
  role: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.text,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
  },
  send: {
    backgroundColor: "rgba(56, 232, 255, 0.18)",
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: `0 0 12px ${colors.accent}66`,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    height: 40,
  },
  sendDisabled: {
    opacity: 0.4,
    boxShadow: "none",
  },
  sendText: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: 15,
  },
});
