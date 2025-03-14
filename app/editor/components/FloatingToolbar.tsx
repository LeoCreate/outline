import { NodeSelection } from "prosemirror-state";
import { CellSelection } from "prosemirror-tables";
import * as React from "react";
import styled from "styled-components";
import { depths } from "@shared/styles";
import { Portal } from "~/components/Portal";
import useComponentSize from "~/hooks/useComponentSize";
import useEventListener from "~/hooks/useEventListener";
import useMediaQuery from "~/hooks/useMediaQuery";
import useViewportHeight from "~/hooks/useViewportHeight";
import { useEditor } from "./EditorContext";

type Props = {
  active?: boolean;
  children: React.ReactNode;
  forwardedRef?: React.RefObject<HTMLDivElement> | null;
};

const defaultPosition = {
  left: -1000,
  top: 0,
  offset: 0,
  visible: false,
};

function usePosition({
  menuRef,
  isSelectingText,
  active,
}: {
  menuRef: React.RefObject<HTMLDivElement>;
  isSelectingText: boolean;
  active?: boolean;
}) {
  const { view } = useEditor();
  const { selection } = view.state;
  const { width: menuWidth, height: menuHeight } = useComponentSize(menuRef);
  const viewportHeight = useViewportHeight();
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");

  if (
    !active ||
    !menuWidth ||
    !menuHeight ||
    !menuRef.current ||
    isSelectingText
  ) {
    return defaultPosition;
  }

  // If we're on a mobile device then stick the floating toolbar to the bottom
  // of the screen above the virtual keyboard.
  if (isTouchDevice && viewportHeight) {
    return {
      left: 0,
      right: 0,
      top: viewportHeight - menuHeight,
      offset: 0,
      visible: true,
    };
  }

  // based on the start and end of the selection calculate the position at
  // the center top
  let fromPos;
  let toPos;
  try {
    fromPos = view.coordsAtPos(selection.from);
    toPos = view.coordsAtPos(selection.to, -1);
  } catch (err) {
    console.warn(err);
    return defaultPosition;
  }

  // ensure that start < end for the menu to be positioned correctly
  const selectionBounds = {
    top: Math.min(fromPos.top, toPos.top),
    bottom: Math.max(fromPos.bottom, toPos.bottom),
    left: Math.min(fromPos.left, toPos.left),
    right: Math.max(fromPos.right, toPos.right),
  };

  const offsetParent = menuRef.current.offsetParent
    ? menuRef.current.offsetParent.getBoundingClientRect()
    : ({
        width: window.innerWidth,
        height: window.innerHeight,
        top: 0,
        left: 0,
      } as DOMRect);

  // tables are an oddity, and need their own positioning logic
  const isColSelection =
    selection instanceof CellSelection &&
    selection.isColSelection &&
    selection.isColSelection();
  const isRowSelection =
    selection instanceof CellSelection &&
    selection.isRowSelection &&
    selection.isRowSelection();

  if (isColSelection) {
    const { node: element } = view.domAtPos(selection.from);
    const { width } = (element as HTMLElement).getBoundingClientRect();
    selectionBounds.top -= 20;
    selectionBounds.right = selectionBounds.left + width;
  }

  if (isRowSelection) {
    selectionBounds.right = selectionBounds.left = selectionBounds.left - 18;
  }

  const isImageSelection =
    selection instanceof NodeSelection && selection.node?.type.name === "image";

  // Images need their own positioning to get the toolbar in the center
  if (isImageSelection) {
    const element = view.nodeDOM(selection.from);

    // Images are wrapped which impacts positioning - need to traverse through
    // p > span > div.image
    const imageElement = (element as HTMLElement).getElementsByTagName(
      "img"
    )[0];
    const { left, top, width } = imageElement.getBoundingClientRect();

    return {
      left: Math.round(left + width / 2 - menuWidth / 2 - offsetParent.left),
      top: Math.round(top - menuHeight - offsetParent.top),
      offset: 0,
      visible: true,
    };
  } else {
    // calcluate the horizontal center of the selection
    const halfSelection =
      Math.abs(selectionBounds.right - selectionBounds.left) / 2;
    const centerOfSelection = selectionBounds.left + halfSelection;

    // position the menu so that it is centered over the selection except in
    // the cases where it would extend off the edge of the screen. In these
    // instances leave a margin
    const margin = 12;
    const left = Math.min(
      offsetParent.x + offsetParent.width - menuWidth - margin,
      Math.max(offsetParent.x + margin, centerOfSelection - menuWidth / 2)
    );
    const top = Math.min(
      window.innerHeight - menuHeight - margin,
      Math.max(margin, selectionBounds.top - menuHeight)
    );

    // if the menu has been offset to not extend offscreen then we should adjust
    // the position of the triangle underneath to correctly point to the center
    // of the selection still
    const offset = left - (centerOfSelection - menuWidth / 2);
    return {
      left: Math.round(left - offsetParent.left),
      top: Math.round(top - offsetParent.top),
      offset: Math.round(offset),
      visible: true,
    };
  }
}

const FloatingToolbar = React.forwardRef(
  (props: Props, ref: React.RefObject<HTMLDivElement>) => {
    const menuRef = ref || React.createRef<HTMLDivElement>();
    const [isSelectingText, setSelectingText] = React.useState(false);

    const position = usePosition({
      menuRef,
      isSelectingText,
      active: props.active,
    });

    useEventListener("mouseup", () => {
      setSelectingText(false);
    });

    useEventListener("mousedown", () => {
      if (!props.active) {
        setSelectingText(true);
      }
    });

    return (
      <Portal>
        <Wrapper
          active={props.active && position.visible}
          ref={menuRef}
          offset={position.offset}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {props.children}
        </Wrapper>
      </Portal>
    );
  }
);

const Wrapper = styled.div<{
  active?: boolean;
  offset: number;
}>`
  will-change: opacity, transform;
  padding: 8px 16px;
  position: absolute;
  z-index: ${depths.editorToolbar};
  opacity: 0;
  background-color: ${(props) => props.theme.toolbarBackground};
  border-radius: 4px;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  height: 40px;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;

  &::before {
    content: "";
    display: block;
    width: 24px;
    height: 24px;
    transform: translateX(-50%) rotate(45deg);
    background: ${(props) => props.theme.toolbarBackground};
    border-radius: 3px;
    z-index: -1;
    position: absolute;
    bottom: -2px;
    left: calc(50% - ${(props) => props.offset || 0}px);
    pointer-events: none;
  }

  * {
    box-sizing: border-box;
  }

  ${({ active }) =>
    active &&
    `
    transform: translateY(-6px) scale(1);
    opacity: 1;
  `};

  @media print {
    display: none;
  }

  @media (hover: none) and (pointer: coarse) {
    &:before {
      display: none;
    }

    transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scale(1);
    border-radius: 0;
    width: 100vw;
    position: fixed;
  }
`;

export default FloatingToolbar;
