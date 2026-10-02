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
import { buildEveHeaders, EVE_API_URL } from "./config";

const STATUS_LABEL: Record<string, string> = {
  ready: "Ready",
  resuming: "Resuming…",
  submitted: "Thinking…",
  streaming: "Streaming…",
  error: "Error",
};

const STATUS_COLOR: Record<string, string> = {
  ready: "#16a34a",
  resuming: "#64748b",
  submitted: "#d97706",
  streaming: "#2563eb",
  error: "#dc2626",
};

export default function App() {
  // Reuses the same eve/react hook the web app uses. `host` is the proxy base;
  // the hook appends `/eve/v1`, so `https://deploy/api` -> `/api/eve/v1/...`.
  const agent = useEveAgent({
    host: EVE_API_URL || undefined,
    headers: buildEveHeaders(),
  });

  const [input, setInput] = useState("");
  const isBusy =
    agent.status === "submitted" || agent.status === "streaming";

  function onSubmit() {
    const text = input.trim();
    if (!text || isBusy) return;
    agent.send(text);
    setInput("");
  }

  const messages = agent.data.messages;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Eve Agent</Text>
        <Text
          style={[styles.status, { color: STATUS_COLOR[agent.status] ?? "#64748b" }]}
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
          style={styles.input}
          placeholder="Type your message…"
          value={input}
          onChangeText={setInput}
          editable={!isBusy}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
        />
        <Pressable
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
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
    backgroundColor: "#fef2f2",
    color: "#dc2626",
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
    color: "#9ca3af",
  },
  message: {
    maxWidth: "85%",
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
  },
  msgUser: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
  },
  msgAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f5f9",
  },
  role: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 21,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
  },
  send: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    height: 40,
  },
  sendDisabled: {
    backgroundColor: "#93c5fd",
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
