import type { CardDisplayType } from "./visualization";

import type {
  ColumnSettings,
  ConditionalFormattingOperator,
  SeriesSettings,
} from ".";

export type MetabotFeedbackType =
  | "great"
  | "wrong_data"
  | "incorrect_result"
  | "invalid_sql";

/* Metabot v3 - Base Types */

export type MetabotChatContext = {
  current_time_with_timezone: string;
} & Record<string, any>;

export type MetabotTool = {
  name: string; // TODO: make strictly typed - currently there's no tools
  parameters: Record<string, any>;
};

export type MetabotHistoryUserMessageEntry = {
  role: "user";
  message: string;
  context: MetabotChatContext;
};

export type MetabotHistoryToolEntry = {
  role: "assistant";
  assistant_response_type: "tools";
  tools: MetabotTool[];
};

export type MetabotHistoryMessageEntry = {
  role: "assistant";
  assistant_response_type: "message";
  message: string;
};

export type MetabotHistoryEntry =
  | MetabotHistoryUserMessageEntry
  | MetabotHistoryToolEntry
  | MetabotHistoryMessageEntry;

export type MetabotHistory = any;

export type MetabotMessageReaction = {
  type: "metabot.reaction/message";
  message: string;
};

export type MetabotChangeDisplayTypeReaction = {
  type: "metabot.reaction/change-display-type";
  display_type: CardDisplayType;
};

export type MetabotChangeVisiualizationSettingsReaction = {
  type: "metabot.reaction/change-table-visualization-settings";
  visible_columns: string[];
};

export type MetabotConfirmationReaction = {
  type: "metabot.reaction/confirmation";
  description: string;
  options: Record<string, MetabotReaction[]>;
};

export type MetabotWriteBackReaction = {
  type: "metabot.reaction/writeback";
  message: string;
};

export type MetabotApiCallReaction = {
  type: "metabot.reaction/api-call";
  api_call: {
    method: string;
    url: string;
    body?: Record<string, any>;
  };
};

export type MetabotStringFilterDetails = {
  column: string;
  operator:
    | "="
    | "!="
    | "contains"
    | "does-not-contain"
    | "starts-with"
    | "ends-with";
  value: string;
};

export type MetabotNumberFilterDetails = {
  column: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=";
  value: number;
};

export type MetabotBooleanFilterDetails = {
  column: string;
  value: boolean;
};

export type MetabotSpecificDateFilterDetails = {
  column: string;
  operator: "=" | ">" | "<";
  value: string;
};

export type MetabotRelativeDateFilterDetails = {
  column: string;
  direction: "last" | "current" | "next";
  value: number;
  unit: "day" | "week" | "month" | "quarter" | "year";
};

export type MetabotAggregateQueryDetails = {
  operator: string;
  column: string | null;
};

export type MetabotBreakoutQueryDetails = {
  column: string;
};

export type MetabotOrderByQueryDetails = {
  column: string;
  direction: "asc" | "desc" | null;
};

export type MetabotLimitQueryDetails = {
  limit: number;
};

export type MetabotChangeQueryReaction = {
  type: "metabot.reaction/change-query";
  string_filters: MetabotStringFilterDetails[];
  number_filters: MetabotNumberFilterDetails[];
  boolean_filters: MetabotBooleanFilterDetails[];
  specific_date_filters: MetabotSpecificDateFilterDetails[];
  relative_date_filters: MetabotRelativeDateFilterDetails[];
  aggregations: MetabotAggregateQueryDetails[];
  breakouts: MetabotBreakoutQueryDetails[];
  order_bys: MetabotOrderByQueryDetails[];
  limits: MetabotLimitQueryDetails[];
};

type SeriesSettingsEntry = SeriesSettings & { key: string };

export type MetabotChangeSeriesSettingsReaction = {
  type: "metabot.reaction/change-series-settings";
  series_settings: SeriesSettingsEntry[];
};

type ColumnSettingsEntry = ColumnSettings & { key: string };

export type MetabotChangeColumnSettingsReaction = {
  type: "metabot.reaction/change-column-settings";
  column_settings: ColumnSettingsEntry[];
};

export type MetabotChangeChartAppearanceReaction = {
  type: "metabot.reaction/change-chart-appearance";
  goal: {
    goal_value: number | null;
    show_goal: boolean | null;
    goal_label: string | null;
  } | null;
  trend_line: boolean | null;
  data_labels: {
    show_data_labels: boolean | null;
    data_label_format: "auto" | "compact" | "full" | null;
    pie_chart_percent_visibility: "off" | "legend" | "inside" | "both" | null;
  };
  total: boolean | null;
  stack_type: "stacked" | "normalized" | "none" | null;
  max_series_count: number | "all" | null;
  axes_labels: {
    x_axis_label: string | null;
    y_axis_label: string | null;
  } | null;
  y_axis_range: {
    auto_range: boolean | null;
    min: number | null;
    max: number | null;
  } | null;
};

export type SingleColorCellStyleEntry = {
  columns: string[];
  operator: ConditionalFormattingOperator;
  value: string | number;
  highlight_row: boolean;
  color: string;
};

export type GradientCellStyleEntry = {
  columns: string[];
  min_type: "custom" | null;
  max_type: "custom" | null;
  min_value: number | null;
  max_value: number | null;
  color: string;
  gradient_direction: "ascending" | "descending";
};

export type MetabotChangeTableCellsStyleReaction = {
  type: "metabot.reaction/change-table-cells-style";
  single_color_cell_styles: SingleColorCellStyleEntry[];
  numeric_gradient_cell_styles: GradientCellStyleEntry[];
  removed_styles: number[];
};

export type MetabotReaction =
  | MetabotChangeTableCellsStyleReaction
  | MetabotChangeChartAppearanceReaction
  | MetabotChangeColumnSettingsReaction
  | MetabotChangeSeriesSettingsReaction
  | MetabotMessageReaction
  | MetabotChangeDisplayTypeReaction
  | MetabotChangeVisiualizationSettingsReaction
  | MetabotConfirmationReaction
  | MetabotWriteBackReaction
  | MetabotApiCallReaction
  | MetabotChangeQueryReaction;

/* Metabot v3 - API Request Types */

export type MetabotAgentRequest = {
  message: string;
  context: MetabotChatContext;
  history: MetabotHistory[];
};

export type MetabotAgentResponse = {
  reactions: MetabotReaction[];
  history: MetabotHistory[];
};

/* Metabot v3 - Type Guards */

export const isMetabotMessageReaction = (
  reaction: MetabotReaction,
): reaction is MetabotMessageReaction => {
  return reaction.type === "metabot.reaction/message";
};

export const isMetabotToolMessage = (
  message: MetabotHistoryEntry,
): message is MetabotHistoryToolEntry => {
  return (
    message.role === "assistant" && message.assistant_response_type === "tools"
  );
};

export const isMetabotHistoryMessage = (
  message: MetabotHistoryEntry,
): message is MetabotHistoryMessageEntry => {
  return (
    message.role === "assistant" &&
    message.assistant_response_type === "message"
  );
};

export const isMetabotMessage = (
  message: MetabotHistoryEntry,
): message is MetabotHistoryMessageEntry => {
  return message.role === "assistant";
};
