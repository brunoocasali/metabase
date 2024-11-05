import type { ComponentType, ReactNode } from "react";

import type { OptionsType } from "metabase/lib/formatting/types";
import type { IconName, IconProps } from "metabase/ui";
import type {
  TextHeightMeasurer,
  TextWidthMeasurer,
} from "metabase/visualizations/shared/types/measure-text";
import type { ClickObject } from "metabase/visualizations/types";
import type Metadata from "metabase-lib/v1/metadata/Metadata";
import type Query from "metabase-lib/v1/queries/Query";
import type {
  Card,
  DashboardId,
  DatasetColumn,
  DatasetData,
  RawSeries,
  Series,
  TimelineEvent,
  TimelineEventId,
  TransformedSeries,
  VisualizationDisplay,
  VisualizationSettings,
} from "metabase-types/api";

import type { RemappingHydratedDatasetColumn } from "./columns";
import type { HoveredObject } from "./hover";

export type Formatter = (value: unknown, options?: OptionsType) => string;

export type ColorGetter = (colorName: string) => string;

export interface RenderingContext {
  getColor: ColorGetter;
  measureText: TextWidthMeasurer;
  measureTextHeight: TextHeightMeasurer;
  fontFamily: string;

  theme: VisualizationTheme;
}

/**
 * Visualization theming overrides.
 * Refer to DEFAULT_METABASE_COMPONENT_THEME for the default values.
 **/
export interface VisualizationTheme {
  cartesian: {
    label: {
      fontSize: number;
    };
    goalLine: {
      label: {
        fontSize: number;
      };
    };
  };
  pie: {
    borderColor: string;
  };
}

export type OnChangeCardAndRunOpts = {
  previousCard?: Card;
  nextCard: Card;
  seriesIndex?: number;
};

export type OnChangeCardAndRun = (opts: OnChangeCardAndRunOpts) => void;

export type ColumnSettings = OptionsType & {
  "pivot_table.column_show_totals"?: boolean;
  [key: string]: unknown;
};

export type ComputedVisualizationSettings = VisualizationSettings & {
  column?: (col: RemappingHydratedDatasetColumn) => ColumnSettings;
};

export interface StaticVisualizationProps {
  rawSeries: RawSeries;
  renderingContext: RenderingContext;
  isStorybook?: boolean;
}

export interface VisualizationProps {
  series: Series;
  card: Card;
  getHref?: () => string | undefined;
  data: DatasetData;
  metadata: Metadata;
  rawSeries: RawSeries;
  settings: ComputedVisualizationSettings;
  hiddenSeries?: Set<string>;
  headerIcon: IconProps;
  errorIcon: IconName;
  actionButtons: ReactNode;
  fontFamily: string;
  isPlaceholder?: boolean;
  isFullscreen: boolean;
  isQueryBuilder: boolean;
  isEmbeddingSdk: boolean;
  showTitle: boolean;
  isDashboard: boolean;
  isEditing: boolean;
  isNightMode: boolean;
  isSettings: boolean;
  showAllLegendItems?: boolean;
  hovered?: HoveredObject;
  clicked?: ClickObject;
  className?: string;
  timelineEvents?: TimelineEvent[];
  selectedTimelineEventIds?: TimelineEventId[];

  gridSize?: VisualizationGridSize;
  width: number;
  height: number;

  visualizationIsClickable: (clickObject?: ClickObject) => boolean;
  getExtraDataForClick?: (clickObject?: ClickObject) => Record<string, unknown>;

  onRender: ({
    yAxisSplit,
    warnings,
  }: {
    yAxisSplit?: number[][];
    warnings?: string[];
  }) => void;
  onRenderError: (error?: string) => void;
  onChangeCardAndRun: OnChangeCardAndRun;
  onHoverChange: (hoverObject?: HoveredObject | null) => void;
  onVisualizationClick: (clickObject?: ClickObject) => void;
  onUpdateVisualizationSettings: (settings: VisualizationSettings) => void;
  onSelectTimelineEvents?: (timelineEvents: TimelineEvent[]) => void;
  onDeselectTimelineEvents?: () => void;
  onOpenTimelines?: () => void;

  "graph.dimensions"?: string[];
  "graph.metrics"?: string[];

  canRemoveSeries?: (seriesIndex: number) => boolean;
  canToggleSeriesVisibility?: boolean;
  onRemoveSeries?: (event: React.MouseEvent, seriesIndex: number) => void;
  onUpdateWarnings?: any;
}

export type ColumnSettingDefinition<TValue, TProps = unknown> = {
  title?: string;
  hint?: string;
  widget?: string | React.ComponentType<any>;
  default?: TValue;
  props?: TProps;
  inline?: boolean;
  readDependencies?: string[];
  getDefault?: (col: DatasetColumn) => TValue;
  getHidden?: (col: DatasetColumn, settings: OptionsType) => boolean;
  getProps?: (
    col: DatasetColumn,
    settings: OptionsType,
    onChange: (value: TValue) => void,
    extra: {
      series: Series;
    },
  ) => TProps;
};

// why do we have an object of extra values when we can just use the
// widget definition as we do for marginBottom and others?
export type SettingDefinitionExtra = {
  transformedSeries?: TransformedSeries;
  dashboardId?: DashboardId;
};

type BaseVisualizationSettingDefinition<TValue> = {
  section?: string;
  title?: string;
  group?: string;
  isValid?: (series: Series, settings: VisualizationSettings) => boolean;
  getHidden?: (
    series: Series,
    settings: VisualizationSettings,
    extra?: SettingDefinitionExtra,
  ) => boolean;
  getDefault?: (
    series: Series,
    settings: VisualizationSettings,
  ) => TValue | null;
  onUpdate?: (value: TValue, extra: SettingDefinitionExtra) => void;
  getValue?: (series: Series, settings: VisualizationSettings) => TValue;
  getDisabled?: (series: Series, settings: VisualizationSettings) => TValue;
  disabled?: boolean;
  default?: TValue;
  marginBottom?: string;
  getMarginBottom?: (series: Series, settings: VisualizationSettings) => string;
  persistDefault?: boolean;
  inline?: boolean;
  readDependencies?: string[];
  writeDependencies?: string[];
  eraseDependencies?: string[];
  dashboard?: boolean;
  useRawSeries?: boolean;
  hidden?: boolean;
  placeholder?: string;
  index?: number;
};

export type WidgetComponentDef<Widget, P, TValue> = {
  widget?: Widget;
  props?: P;
  getProps?: (
    series: Series,
    vizSettings: VisualizationSettings,
    onChange: (value: TValue | null) => void,
    extra: SettingDefinitionExtra,
    onChangeSettings: (value: VisualizationSettings) => void,
  ) => P;
};

export type WidgetStringDef<Widget, TValue> = {
  widget?: Widget;
  props?: unknown;
  getProps?: (
    series: Series,
    vizSettings: VisualizationSettings,
    onChange: (value: TValue | null) => void,
    extra: SettingDefinitionExtra,
    onChangeSettings: (value: VisualizationSettings) => void,
  ) => unknown;
};

type VisualizationSettingWidgetDef<
  TValue,
  Widget extends string | ComponentType<any> = string | ComponentType<any>,
> = Widget extends string
  ? WidgetStringDef<Widget, TValue>
  : Widget extends ComponentType<infer P>
    ? WidgetComponentDef<Widget, P, TValue>
    : never;

export type VisualizationSettingDefinition<
  K extends keyof VisualizationSettings = keyof VisualizationSettings,
  Widget extends string | ComponentType<any> = string | ComponentType<any>,
> = {
  id?: K;
} & BaseVisualizationSettingDefinition<VisualizationSettings[K]> &
  VisualizationSettingWidgetDef<VisualizationSettings[K], Widget>;

export type VisualizationSettingsDefinitions = {
  [K in keyof VisualizationSettings]: VisualizationSettingDefinition<K>;
};

export type VisualizationGridSize = {
  // grid columns
  width: number;
  // grid rows
  height: number;
};

// TODO: add component property for the react component instead of the intersection
export type Visualization = React.ComponentType<VisualizationProps> &
  VisualizationDefinition;

export type VisualizationDefinition = {
  name?: string;
  noun?: string;
  uiName: string;
  identifier: VisualizationDisplay;
  aliases?: string[];
  iconName: IconName;

  maxMetricsSupported?: number;
  maxDimensionsSupported?: number;

  disableClickBehavior?: boolean;
  canSavePng?: boolean;
  noHeader?: boolean;
  hidden?: boolean;
  disableSettingsConfig?: boolean;
  supportPreviewing?: boolean;
  supportsSeries?: boolean;

  minSize: VisualizationGridSize;
  defaultSize: VisualizationGridSize;

  settings: VisualizationSettingsDefinitions;

  placeHolderSeries?: Series;

  transformSeries?: (series: Series) => TransformedSeries;
  isSensible: (data: DatasetData) => boolean;
  // checkRenderable throws an error if a visualization is not renderable
  checkRenderable: (
    series: Series,
    settings: VisualizationSettings,
    query: Query,
  ) => void | never;
  isLiveResizable?: (series: Series) => boolean;
  onDisplayUpdate?: (settings: VisualizationSettings) => VisualizationSettings;
  placeholderSeries: RawSeries;
};
