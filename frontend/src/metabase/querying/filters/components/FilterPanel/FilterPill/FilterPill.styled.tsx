import styled from "@emotion/styled";

import { alpha } from "metabase/lib/colors";
import type { FlexProps } from "metabase/ui";
import { Flex } from "metabase/ui";

export const FilterPillRoot = styled(Flex)<FlexProps>`
  cursor: pointer;
  color: var(--mb-color-filter);
  background-color: ${({ theme }) => alpha(theme.fn.themeColor("filter"), 0.2)};
  border-radius: 0.75rem;
` as unknown as typeof Flex;
