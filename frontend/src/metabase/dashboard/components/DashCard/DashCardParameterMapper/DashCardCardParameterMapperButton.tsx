import { useMemo, useState } from "react";
import { t } from "ttag";

import { Ellipsified } from "metabase/core/components/Ellipsified";
import ParameterTargetList from "metabase/parameters/components/ParameterTargetList";
import type { ParameterMappingOption } from "metabase/parameters/utils/mapping-options";
import { Popover, Tooltip } from "metabase/ui";
import * as Lib from "metabase-lib";
import type Question from "metabase-lib/v1/Question";
import type { Card, ParameterTarget } from "metabase-types/api";

import {
  ChevrondownIcon,
  CloseIconButton,
  KeyIcon,
  TargetButton,
  TargetButtonText,
} from "./DashCardCardParameterMapper.styled";

interface DashCardCardParameterMapperButtonProps {
  isDisabled: boolean;
  isVirtual: boolean;
  isQuestion: boolean;
  question: Question | undefined;
  card: Card;
  handleChangeTarget: (target: ParameterTarget | null) => void;
  selectedMappingOption: ParameterMappingOption | undefined;
  target: ParameterTarget | null | undefined;
  mappingOptions: ParameterMappingOption[];
}

export const DashCardCardParameterMapperButton = ({
  isDisabled,
  handleChangeTarget,
  isVirtual,
  isQuestion,
  question,
  card,
  selectedMappingOption,
  target,
  mappingOptions,
}: DashCardCardParameterMapperButtonProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const hasPermissionsToMap = useMemo(() => {
    if (isVirtual) {
      return true;
    }

    if (!isQuestion) {
      return true;
    }

    if (!question || !card.dataset_query) {
      return false;
    }

    const { isEditable } = Lib.queryDisplayInfo(question.query());
    return isEditable;
  }, [isVirtual, isQuestion, question, card.dataset_query]);

  const { buttonVariant, buttonTooltip, buttonText, buttonIcon } =
    useMemo(() => {
      if (!hasPermissionsToMap) {
        return {
          buttonVariant: "unauthed",
          buttonTooltip: t`You don’t have permission to see this question’s columns.`,
          buttonText: null,
          buttonIcon: <KeyIcon name="key" />,
        };
      }

      if (isDisabled && !isVirtual) {
        return {
          buttonVariant: "disabled",
          buttonTooltip: t`This card doesn't have any fields or parameters that can be mapped to this parameter type.`,
          buttonText: t`No valid fields`,
          buttonIcon: null,
        };
      }

      if (selectedMappingOption) {
        return {
          buttonVariant: "mapped",
          buttonTooltip: null,
          buttonText: formatSelected(selectedMappingOption),
          buttonIcon: (
            <CloseIconButton
              role="button"
              aria-label={t`Disconnect`}
              onClick={e => {
                handleChangeTarget(null);
                e.stopPropagation();
              }}
            />
          ),
        };
      }

      if (target != null) {
        return {
          buttonVariant: "invalid",
          buttonText: t`Unknown Field`,
          buttonIcon: (
            <CloseIconButton
              aria-label={t`Disconnect`}
              onClick={e => {
                handleChangeTarget(null);
                e.stopPropagation();
              }}
            />
          ),
        };
      }

      return {
        buttonVariant: "default",
        buttonTooltip: null,
        buttonText: t`Select…`,
        buttonIcon: <ChevrondownIcon name="chevrondown" />,
      };
    }, [
      hasPermissionsToMap,
      isDisabled,
      isVirtual,
      selectedMappingOption,
      target,
      handleChangeTarget,
    ]);

  return (
    <Tooltip label={buttonTooltip} withArrow={false}>
      <Popover
        opened={isDropdownVisible && !isDisabled && hasPermissionsToMap}
        onClose={() => setIsDropdownVisible(false)}
        position="bottom-start"
      >
        <Popover.Target>
          <TargetButton
            variant={buttonVariant}
            aria-label={buttonTooltip ?? undefined}
            aria-haspopup="listbox"
            aria-expanded={isDropdownVisible}
            aria-disabled={isDisabled || !hasPermissionsToMap}
            onClick={() => {
              setIsDropdownVisible(true);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                setIsDropdownVisible(true);
              }
            }}
          >
            {buttonText && (
              <TargetButtonText>
                <Ellipsified>{buttonText}</Ellipsified>
              </TargetButtonText>
            )}
            {buttonIcon}
          </TargetButton>
        </Popover.Target>
        <Popover.Dropdown>
          <ParameterTargetList
            onChange={(target: ParameterTarget) => {
              handleChangeTarget(target);
              setIsDropdownVisible(false);
            }}
            target={target}
            mappingOptions={mappingOptions}
          />
        </Popover.Dropdown>
      </Popover>
    </Tooltip>
  );
};

function formatSelected({
  name,
  sectionName,
}: {
  name: string;
  sectionName?: string;
}) {
  if (sectionName == null) {
    // for native question variables or field literals we just display the name
    return name;
  }
  return `${sectionName}.${name}`;
}
