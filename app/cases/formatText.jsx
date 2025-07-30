// Helper function to parse and format text like markdown

import {
  Text,
} from "react-native";

import React, { useState, useEffect, useCallback } from "react";

export const FormatText = (text) => {
  if (!text) return null;

  const regex = /(\*\*.*?\*\*|__.*?__|\[.*?\]|_.*?_|\n)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <Text key={index} style={{ fontWeight: "bold" }}>{part.slice(2, -2)}</Text>;
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return <Text key={index} style={{ fontWeight: "bold" }}>{part.slice(2, -2)}</Text>;
    }
    if (part.startsWith("[") && part.endsWith("]")) {
      return <Text key={index} style={{ fontStyle: "italic" }}>{part.slice(1, -1)}</Text>;
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <Text key={index} style={{ fontStyle: "italic" }}>{part.slice(1, -1)}</Text>;
    }
    if (part === "\n") {
      return <Text key={index}>{"\n"}</Text>;
    }
    return <Text key={index}>{part}</Text>;
  });
};