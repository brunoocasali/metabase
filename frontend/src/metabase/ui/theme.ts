import type { MantineThemeProviderProps } from "@mantine/core";
import { rem } from "@mantine/core";

import { DEFAULT_METABASE_COMPONENT_THEME } from "embedding-sdk/lib/theme";

import {
  //   getAccordionOverrides,
  //   getActionIconOverrides,
  alertOverrides,
  //   getAnchorOverrides,
  //   getAutocompleteOverrides,
  buttonOverrides,
  //   getCalendarOverrides,
  cardOverrides,
  checkboxOverrides,
  //   getChipOverrides,
  //   getDateInputOverrides,
  //   getDatePickerOverrides,
  dividerOverrides,
  //   getFileInputOverrides,
  hoverCardOverrides,
  //   getInputOverrides,
  listOverrides,
  //   getMenuOverrides,
  modalOverrides,
  //   getMultiSelectOverrides,
  //   getNavLinkOverrides,
  paperOverrides,
  popoverOverrides,
  progressOverrides,
  //   getRadioOverrides,
  //   getScrollAreaOverrides,
  //   getSegmentedControlOverrides,
  //   getSelectOverrides,
  //   getSkeletonOverrides,
  //   getSwitchOverrides,
  //   getTabsOverrides,
  //   getTextInputOverrides,
  //   getTextOverrides,
  //   getTextareaOverrides,
  //   getTimeInputOverrides,
  titleOverrides,
  tooltipOverrides,
} from "./components";
import { getThemeColors } from "./utils/colors";

export const breakpoints = {
  xs: "23em",
  sm: "40em",
  md: "60em",
  lg: "80em",
  xl: "120em",
};
export type BreakpointName = keyof typeof breakpoints;

export const getThemeOverrides = (): MantineThemeProviderProps["theme"] => ({
  breakpoints,
  colors: getThemeColors(),
  primaryColor: "brand",
  primaryShade: 0,
  shadows: {
    sm: "0px 1px 4px 2px rgba(0, 0, 0, 0.08)",
    md: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    xl: "40px",
  },
  fontSizes: {
    xs: rem(11),
    sm: rem(12),
    md: rem(14),
    lg: rem(17),
    xl: rem(21),
  },
  lineHeights: {
    sm: "1rem",
    md: "1.25rem",
    lg: "1.5rem",
  },
  headings: {
    sizes: {
      h1: {
        fontSize: rem(24),
        lineHeight: rem(24),
      },
      h2: {
        fontSize: rem(20),
        lineHeight: rem(24),
      },
      h3: {
        fontSize: rem(14),
        lineHeight: rem(16),
      },
      h4: {
        fontSize: rem(14),
        lineHeight: rem(16),
      },
    },
  },
  fontFamily: "var(--mb-default-font-family), sans-serif",
  fontFamilyMonospace: "Monaco, monospace",
  // focusClassName: css({
  //   outline: `0.125rem solid ${color("brand")}`,
  //   outlineOffset: "0.125rem",
  // }),
  focusRing: "auto",
  components: {
    // ...getAccordionOverrides(),
    // ...getActionIconOverrides(),
    ...alertOverrides,
    // ...getAnchorOverrides(),
    // ...getAutocompleteOverrides(),
    ...buttonOverrides,
    // ...getCalendarOverrides(),
    ...cardOverrides,
    ...checkboxOverrides,
    // ...getChipOverrides(),
    // ...getDateInputOverrides(),
    // ...getDatePickerOverrides(),
    ...dividerOverrides,
    // ...getFileInputOverrides(),
    // ...getInputOverrides(),
    // ...getMenuOverrides(),
    ...modalOverrides,
    // ...getMultiSelectOverrides(),
    // ...getNavLinkOverrides(),
    // ...getRadioOverrides(),
    ...paperOverrides,
    ...popoverOverrides,
    ...progressOverrides,
    // ...getSkeletonOverrides(),
    // ...getScrollAreaOverrides(),
    // ...getSegmentedControlOverrides(),
    // ...getSelectOverrides(),
    // ...getSwitchOverrides(),
    // ...getTabsOverrides(),
    // ...getTextareaOverrides(),
    // ...getTextInputOverrides(),
    // ...getTextOverrides(),
    // ...getTimeInputOverrides(),
    ...titleOverrides,
    ...tooltipOverrides,
    ...hoverCardOverrides,
    ...listOverrides,
  },
  other: DEFAULT_METABASE_COMPONENT_THEME,
});
